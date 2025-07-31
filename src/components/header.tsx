import { Utensils, Settings, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface HeaderProps {
  onCartClick: () => void;
  onAdminClick: () => void;
}

export default function Header({ onCartClick, onAdminClick }: HeaderProps) {
  const { totalItems } = useCart();

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-primary rounded-full flex items-center justify-center">
            <Utensils className="text-white w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-secondary">TastyEats</h1>
            <p className="text-xs text-gray-500">Downtown Kitchen</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onAdminClick}
            className="p-2 text-gray-600 hover:text-orange-primary transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={onCartClick}
            className="relative p-2 text-gray-600 hover:text-orange-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
