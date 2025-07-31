import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  const orderId = `ORD-${Date.now()}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-secondary mb-2">Order Confirmed!</h3>
          <p className="text-gray-600 text-sm mb-6">Your payment was successful. Your order will be prepared shortly.</p>
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <p className="text-xs text-gray-600">Order ID</p>
            <p className="font-mono font-bold text-orange-primary">#{orderId}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-full bg-orange-primary text-white py-3 rounded-xl font-medium hover:bg-orange-hover transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
