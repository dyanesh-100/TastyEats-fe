import { X, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  totalAmount: number;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, totalAmount }: PaymentModalProps) {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const UPI_ID = "tastyeats@okaxis";
  const PHONE_NUMBER = "9876543210";

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post("/orders", orderData);
      return data;
    },
    onSuccess: () => {
      clearCart();
      onPaymentComplete();
      toast({
        title: "Payment Successful!",
        description: "Cart has been cleared",
        duration: 2000
      });
    }
  });

  // const generatePaymentData = () => {
  //   return {
  //     pn: "TastyEats Downtown Kitchen",
  //     am: (totalAmount + 40).toFixed(2),
  //     cu: "INR",
  //     tn: `Food Order Payment - ${Date.now()}`,
  //     pa: UPI_ID
  //   };
  // };

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
      paymentMethod: "upi"
    };
    
    createOrderMutation.mutate(orderData);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${label} copied successfully`,
      duration: 2000
    });
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
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-secondary mb-2">UPI Payment</h3>
              <p className="text-gray-600 text-sm">Total Amount: <span className="font-bold text-orange-primary">₹{(totalAmount + 40).toFixed(2)}</span></p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6 mx-auto max-w-xs">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-secondary mb-2">UPI Payment</h3>
                <p className="text-gray-600 text-sm">Scan the QR code with any UPI app</p>
              </div>

              {/* QR Code Display */}
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mx-auto">
                <img 
                  src="/qr-code.png" 
                  alt="UPI QR Code" 
                  className="w-full h-full p-2 object-contain"
                />
              </div>

              {/* Payment Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">UPI ID</p>
                    <p className="text-sm text-gray-600">{UPI_ID}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(UPI_ID, 'UPI ID')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <p className="text-sm text-gray-600">{PHONE_NUMBER}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(PHONE_NUMBER, 'Phone number')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-6">
                <p>• Scan the QR code using any UPI app</p>
                <p>• Or enter UPI ID/phone number manually</p>
                <p>• Complete payment and click below</p>
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
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
