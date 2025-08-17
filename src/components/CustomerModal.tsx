import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '@/lib/api';

interface CustomerModalProps {
  initialData?: {
    customerId: string;
    name: string;
    phone: string;
    address: string;
  };
  onClose: () => void;
  onSuccess: (data: { customerId: string; name: string; phone: string; address: string }) => void;
}

export default function CustomerModal({ initialData, onClose, onSuccess }: CustomerModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const customerData = { name, phone, address };
      let response;

      if (initialData) {
        response = await api.put(`/customers/update`, customerData);
      } else {
        response = await api.post('/customers/save', customerData);
      }
      const savedCustomer = response.data.customer;

      onSuccess({
        customerId: savedCustomer.customerId, 
        name: savedCustomer.name,
        phone: savedCustomer.phone,
        address: savedCustomer.address,
      });
      onClose();
    } catch (err) {
      setError('Failed to save customer details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-secondary">
            {initialData ? 'Review Your Details' : 'Before We Proceed'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-orange-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary"
              rows={4}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-primary text-white py-4 rounded-xl font-medium hover:bg-orange-hover disabled:bg-gray-300"
          >
            {isLoading ? 'Processing...' : initialData ? 'Update & Continue to Payment' : 'Save & Continue to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}
