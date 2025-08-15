import { useQuery } from "@tanstack/react-query";
import MenuItemCard from "./menu-item-card";

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
        {filteredItems.map((item: MenuItem) => (
          <MenuItemCard key={item._id} item={item} />
        ))}
      </div>
    </main>
  );
}
