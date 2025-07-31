import { useQuery } from "@tanstack/react-query";
import { Star, Minus, Plus, Leaf } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: string;
  id: string;
}

interface MenuGridProps {
  selectedCategory: string;
}

export default function MenuGrid({ selectedCategory }: MenuGridProps) {
  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
  });

  const { getItemQuantity, updateItemQuantity } = useCart();

  if (isLoading) {
    return (
      <main className="px-4 py-4 pb-20">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="flex">
                <div className="flex-1 p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-20 m-4 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  const filteredItems = (menuItems || []).filter((item: MenuItem) => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <main className="px-4 py-4 pb-20">
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((item: MenuItem) => {
          const quantity = getItemQuantity(item.id); 
          return (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-secondary text-sm">{item.name}</h3>
                    <span className="text-orange-primary font-bold text-sm">₹{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < Math.floor(parseFloat(item.rating || "0")) 
                                ? "fill-current" 
                                : ""
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs">{item.rating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateItemQuantity(item.id, Math.max(0, quantity - 1))}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button 
                        onClick={() => updateItemQuantity(item.id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-orange-primary flex items-center justify-center text-white hover:bg-orange-hover transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 m-4 relative">
                  <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg" 
                  />
                  {item.category === "appetizers" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-accent rounded-full flex items-center justify-center">
                      <Leaf className="text-white w-2 h-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
