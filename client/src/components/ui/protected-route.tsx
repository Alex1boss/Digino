import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <Route path={path}>
      {() => {
        // Show loading state while checking authentication
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Checking authentication...</p>
              </div>
            </div>
          );
        }

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
          return <Redirect to="/auth" />;
        }

        // Render the component if authenticated
        return <Component />;
      }}
    </Route>
  );
}