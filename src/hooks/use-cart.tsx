import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

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

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  cartItems: Array<{ item: MenuItem; quantity: number }>;
  totalItems: number;
  totalAmount: number;
  getItemQuantity: (id: string) => number;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("tastyeats-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tastyeats-cart", JSON.stringify(cart));
  }, [cart]);

  const getItemQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0;
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.id !== id);
      }

      const existingIndex = prev.findIndex(item => item.id === id);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex] = { id, quantity };
        return newCart;
      } else {
        return [...prev, { id, quantity }];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart items with menu data
  const cartItems = cart
    .map(cartItem => {
      const menuItem = (menuItems || []).find((item: MenuItem) => item.id === cartItem.id);
      return menuItem ? { item: menuItem, quantity: cartItem.quantity } : null;
    })
    .filter(Boolean) as Array<{ item: MenuItem; quantity: number }>;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, { item, quantity }) => {
    return sum + (item.price * quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalAmount,
      getItemQuantity,
      updateItemQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Higher-order component to wrap the app with CartProvider
export function withCartProvider<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <CartProvider>
        <Component {...props} />
      </CartProvider>
    );
  };
}
