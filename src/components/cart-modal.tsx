import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { MenuItem } from "@shared/schema";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
  cartItems: Array<{ item: MenuItem; quantity: number }>;
  totalAmount: number;
}

export default function CartModal({ isOpen, onClose, onProceedToPayment, cartItems, totalAmount }: CartModalProps) {
  const { updateItemQuantity } = useCart();
  
  if (!isOpen) return null;

  const subtotal = totalAmount;
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-secondary">Your Order</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-orange-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-4 py-4 space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {cartItems.map(({ item, quantity }) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-secondary text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-600">₹{item.price} each</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateItemQuantity(item.id, Math.max(0, quantity - 1))}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium">{quantity}</span>
                    <button 
                      onClick={() => updateItemQuantity(item.id, quantity + 1)}
                      className="w-6 h-6 rounded-full bg-orange-primary flex items-center justify-center text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-orange-primary">₹{(parseFloat(item.price) * quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span className="text-orange-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <button 
            onClick={onProceedToPayment}
            disabled={cartItems.length === 0}
            className="w-full bg-orange-primary text-white py-4 rounded-xl font-medium hover:bg-orange-hover transition-colors disabled:bg-gray-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
