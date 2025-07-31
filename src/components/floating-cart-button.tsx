import { ShoppingBag, ArrowRight } from "lucide-react";

interface FloatingCartButtonProps {
  totalItems: number;
  totalAmount: number;
  onClick: () => void;
}

export default function FloatingCartButton({ totalItems, totalAmount, onClick }: FloatingCartButtonProps) {
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 z-50">
      <button 
        onClick={onClick}
        className="w-full bg-orange-primary text-white py-4 rounded-xl shadow-lg flex items-center justify-between px-6 font-medium hover:bg-orange-hover transition-all transform hover:scale-105"
      >
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-5 h-5" />
          <span>{totalItems} items</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>₹{totalAmount.toFixed(2)}</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
}
