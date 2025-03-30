
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Please login to access this page");
        navigate("/login");
      } else if (!isAdmin) {
        toast.error("You don't have permission to access this page");
        navigate("/");
      }
    }
  }, [user, isLoading, isAdmin, navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
}
