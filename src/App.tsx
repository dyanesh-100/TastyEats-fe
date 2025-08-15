import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import RoleSelectionPage from "@/pages/role-selection";
import { RoleProvider, useRole } from "./context/RoleContext";

function AppRoutes() {
  const { role } = useRole();

  return (
    <Switch>
      <Route path="/selection" component={RoleSelectionPage} />
      <Route path="/">
        {role ? <Home /> : <Redirect to="/selection" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <AppRoutes />
          </TooltipProvider>
        </CartProvider>
      </RoleProvider>
    </QueryClientProvider>
  );
}

export default App;
