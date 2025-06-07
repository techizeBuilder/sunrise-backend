import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AccessControlGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function AccessControlGuard({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/login" 
}: AccessControlGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Access Denied",
          description: "Please log in to access this area.",
          variant: "destructive",
        });
        setLocation(redirectTo);
        return;
      }

      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        toast({
          title: "Insufficient Permissions",
          description: `Access restricted to ${allowedRoles.join(", ")} roles only.`,
          variant: "destructive",
        });
        setLocation("/dashboard");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}