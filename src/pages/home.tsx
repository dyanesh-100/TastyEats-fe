import Header from "@/components/header";
import CategoryTabs from "@/components/category-tabs";
import MenuGrid from "@/components/menu-grid";
import FloatingCartButton from "@/components/floating-cart-button";
import CartModal from "@/components/cart-modal";
import PaymentModal from "@/components/payment-modal";
import AdminModal from "@/components/admin-modal";
import SuccessModal from "@/components/success-modal";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import OrdersPage from "./orders-page";

export default function Home() {
  const { role } = useRole();
  const { cartItems, totalItems, totalAmount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleProceedToPayment = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentComplete = () => {
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);
  };

  if (role === 'chef') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <Header onCartClick={() => {}} onAdminClick={() => setIsAdminOpen(true)} />
        <main className="flex-1 container mx-auto py-8">
          <OrdersPage />
        </main>
        <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <Header onCartClick={() => setIsCartOpen(true)} onAdminClick={() => {}} />
      
      <CategoryTabs 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      
      <MenuGrid selectedCategory={selectedCategory} />
      
      <FloatingCartButton 
        totalItems={totalItems}
        totalAmount={totalAmount}
        onClick={() => setIsCartOpen(true)}
      />

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToPayment={handleProceedToPayment}
        cartItems={cartItems}
        totalAmount={totalAmount}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentComplete={handlePaymentComplete}
        totalAmount={totalAmount}
      />

      <SuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
}
