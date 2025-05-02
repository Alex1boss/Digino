import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type UserWithoutPassword = Omit<User, "password">;

type AuthContextType = {
  user: UserWithoutPassword | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<UserWithoutPassword, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<UserWithoutPassword, Error, RegisterData>;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to get the current authenticated user
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<UserWithoutPassword | null, Error>({
    queryKey: ["/api/user"],
    async queryFn() {
      try {
        const res = await fetch("/api/user");
        if (res.status === 401) {
          return null;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      } catch (err) {
        if ((err as Response)?.status === 401) {
          return null;
        }
        throw err;
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation<UserWithoutPassword, Error, LoginCredentials>({
    async mutationFn(credentials) {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Refetch the user data after login
      refetch();
      // Invalidate any queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation<UserWithoutPassword, Error, RegisterData>({
    async mutationFn(data) {
      const res = await apiRequest("POST", "/api/register", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.username}!`,
      });
      // Refetch the user data after registration
      refetch();
      // Invalidate any queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    async mutationFn() {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout failed");
      }
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      // Clear user data after logout
      queryClient.setQueryData(["/api/user"], null);
      // Invalidate any queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Ensure user is either the actual user object or null (not undefined)
  const safeUser = user === undefined ? null : user;

  return (
    <AuthContext.Provider
      value={{
        user: safeUser,
        isLoading,
        isAuthenticated: !!safeUser,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}