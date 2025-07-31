interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Items" },
  { id: "appetizers", label: "Appetizers" },
  { id: "mains", label: "Main Course" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
];

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="bg-white px-4 py-2 sticky top-16 z-30 border-b border-gray-100">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-orange-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
