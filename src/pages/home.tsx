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

export default function Home() {
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

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <Header onCartClick={() => setIsCartOpen(true)} onAdminClick={() => setIsAdminOpen(true)} />
      
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

      <AdminModal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <SuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
}
