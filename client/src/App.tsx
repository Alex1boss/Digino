import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Profile3D from "./pages/Profile3D";
import ProfileEdit from "./pages/ProfileEdit";
import UploadProduct from "./pages/UploadProduct";
import SimplePublish from "./pages/SimplePublish";
import DirectPublish from "./pages/DirectPublish";
import ProductDetailPage from "./pages/ProductDetail";
import BottomNav from "./components/BottomNav";
import Explore from "./pages/Explore";
import AuthPage from "./pages/AuthPage";
import BuyingPage from "./pages/BuyingPage";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/ui/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/buying" component={BuyingPage} />
      
      {/* Protected routes that require authentication */}
      <ProtectedRoute path="/sell" component={Sell} />
      <ProtectedRoute path="/profile" component={Profile3D} />
      <ProtectedRoute path="/profile/edit" component={ProfileEdit} />
      <ProtectedRoute path="/product/new" component={UploadProduct} />
      <ProtectedRoute path="/publish" component={SimplePublish} />
      <ProtectedRoute path="/direct-publish" component={DirectPublish} />
      
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
          <BottomNav />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
