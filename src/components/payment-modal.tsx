import { X, CheckCircle, QrCode, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  totalAmount: number;
}

type PaymentMethod = 'gpay' | 'phonepe' | 'upi';

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, totalAmount }: PaymentModalProps) {
  const { cartItems, clearCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('gpay');
  const [qrCodeData, setQrCodeData] = useState("");
  const [showQR, setShowQR] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post("/orders", orderData);
      return data;
    },
    onSuccess: (order) => {
      clearCart();
      onPaymentComplete();
    }
  });

  const generatePaymentData = (method: PaymentMethod) => {
    const baseData = {
      pn: "TastyEats Downtown Kitchen",
      am: (totalAmount + 40).toFixed(2), // Add delivery fee
      cu: "INR",
      tn: `Food Order Payment - ${Date.now()}`
    };

    switch (method) {
      case 'gpay':
        return {
          ...baseData,
          pa: "merchant@okaxis", // Google Pay merchant UPI ID
        };
      case 'phonepe':
        return {
          ...baseData,
          pa: "merchant@ybl", // PhonePe merchant UPI ID
        };
      default:
        return {
          ...baseData,
          pa: "merchant@paytm", // Generic UPI ID
        };
    }
  };

  useEffect(() => {
    if (isOpen && totalAmount > 0) {
      const paymentData = generatePaymentData(selectedPaymentMethod);
      const upiUrl = `upi://pay?${Object.entries(paymentData)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`;
      
      setQrCodeData(upiUrl);
    }
  }, [isOpen, totalAmount, selectedPaymentMethod]);

  const handlePaymentComplete = () => {
    const orderData = {
      items: JSON.stringify(cartItems.map(({ item, quantity }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity
      }))),
      total: (totalAmount + 40).toFixed(2),
      status: "completed",
      paymentMethod: selectedPaymentMethod
    };
    
    createOrderMutation.mutate(orderData);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    if (method === 'upi') {
      setShowQR(true);
    } else {
      // For GPay and PhonePe, try to open the app directly
      const paymentData = generatePaymentData(method);
      const upiUrl = `upi://pay?${Object.entries(paymentData)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`;
      
      // Try to open the payment app
      window.open(upiUrl, '_blank');
      setShowQR(true); // Also show QR as fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-secondary">Payment</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-orange-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-4 py-6">
          {!showQR ? (
            /* Payment Method Selection */
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-secondary mb-2">Choose Payment Method</h3>
                <p className="text-gray-600 text-sm">Total Amount: <span className="font-bold text-orange-primary">₹{(totalAmount + 40).toFixed(2)}</span></p>
              </div>

              {/* Google Pay Option */}
              <button 
                onClick={() => handlePaymentMethodSelect('gpay')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-secondary">Google Pay</h4>
                    <p className="text-sm text-gray-600">Pay using Google Pay UPI</p>
                  </div>
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              {/* PhonePe Option */}
              <button 
                onClick={() => handlePaymentMethodSelect('phonepe')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Pe</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-secondary">PhonePe</h4>
                    <p className="text-sm text-gray-600">Pay using PhonePe UPI</p>
                  </div>
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              {/* Generic UPI Option */}
              <button 
                onClick={() => handlePaymentMethodSelect('upi')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <QrCode className="text-white w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-secondary">UPI QR Code</h4>
                    <p className="text-sm text-gray-600">Scan QR with any UPI app</p>
                  </div>
                  <QrCode className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>
          ) : (
            /* QR Code Display */
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-secondary mb-2">
                  {selectedPaymentMethod === 'gpay' ? 'Google Pay' : 
                   selectedPaymentMethod === 'phonepe' ? 'PhonePe' : 'UPI Payment'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedPaymentMethod !== 'upi' ? 
                    'App will open automatically, or scan QR code below' : 
                    'Scan the QR code with any UPI app'}
                </p>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6 inline-block">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mb-2 mx-auto" />
                    <p className="text-xs text-gray-500">UPI QR Code</p>
                    <p className="text-xs text-gray-400">₹{(totalAmount + 40).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className={`p-4 rounded-lg mb-4 ${
                selectedPaymentMethod === 'gpay' ? 'bg-blue-50' :
                selectedPaymentMethod === 'phonepe' ? 'bg-purple-50' : 'bg-orange-50'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    selectedPaymentMethod === 'gpay' ? 'bg-blue-600' :
                    selectedPaymentMethod === 'phonepe' ? 'bg-purple-600' : 'bg-orange-600'
                  }`}>
                    {selectedPaymentMethod === 'gpay' ? 
                      <span className="text-white font-bold text-sm">G</span> :
                      selectedPaymentMethod === 'phonepe' ? 
                      <span className="text-white font-bold text-xs">Pe</span> :
                      <QrCode className="text-white w-4 h-4" />
                    }
                  </div>
                  <span className={`font-medium ${
                    selectedPaymentMethod === 'gpay' ? 'text-blue-800' :
                    selectedPaymentMethod === 'phonepe' ? 'text-purple-800' : 'text-orange-800'
                  }`}>
                    {selectedPaymentMethod === 'gpay' ? 'Google Pay' :
                     selectedPaymentMethod === 'phonepe' ? 'PhonePe' : 'UPI Payment'}
                  </span>
                </div>
                <p className={`text-sm ${
                  selectedPaymentMethod === 'gpay' ? 'text-blue-700' :
                  selectedPaymentMethod === 'phonepe' ? 'text-purple-700' : 'text-orange-700'
                }`}>
                  Amount: <span className="font-bold">₹{(totalAmount + 40).toFixed(2)}</span>
                </p>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-6">
                {selectedPaymentMethod !== 'upi' ? (
                  <>
                    <p>• {selectedPaymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'} app should open automatically</p>
                    <p>• Or open the app and scan the QR code above</p>
                    <p>• Complete the payment in the app</p>
                  </>
                ) : (
                  <>
                    <p>• Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</p>
                    <p>• Tap "Scan QR Code"</p>
                    <p>• Scan the code above and complete payment</p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handlePaymentComplete}
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-green-accent text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors disabled:bg-gray-300"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  {createOrderMutation.isPending ? "Processing..." : "Payment Completed"}
                </button>
                
                <button 
                  onClick={() => setShowQR(false)}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Choose Different Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
