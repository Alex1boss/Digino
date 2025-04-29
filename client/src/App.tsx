import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Profile3D from "./pages/Profile3D";
import ProfileEdit from "./pages/ProfileEdit";
import UploadProduct from "./pages/UploadProduct";
import SimplePublish from "./pages/SimplePublish";
import BottomNav from "./components/BottomNav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Reuse Home component for Explore path since we've merged them */}
      <Route path="/explore" component={Home} />
      <Route path="/buy" component={Buy} />
      <Route path="/sell" component={Sell} />
      <Route path="/profile" component={Profile3D} />
      <Route path="/profile/edit" component={ProfileEdit} />
      <Route path="/product/new" component={UploadProduct} />
      <Route path="/publish" component={SimplePublish} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <BottomNav />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
