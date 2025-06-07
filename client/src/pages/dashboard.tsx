import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LogOut, 
  Shield, 
  ShoppingCart, 
  Package, 
  Calculator,
  Truck,
  Factory
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setLocation("/login");
    },
    onError: () => {
      toast({
        title: "Logout Failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "admin": return <Shield className="h-8 w-8 text-red-600" />;
      case "sales": return <ShoppingCart className="h-8 w-8 text-blue-600" />;
      case "production": return <Factory className="h-8 w-8 text-green-600" />;
      case "inventory": return <Package className="h-8 w-8 text-purple-600" />;
      case "accounts": return <Calculator className="h-8 w-8 text-yellow-600" />;
      case "distributor": return <Truck className="h-8 w-8 text-orange-600" />;
      default: return <User className="h-8 w-8 text-gray-600" />;
    }
  };

  const getRoleDescription = () => {
    switch (user.role) {
      case "admin": 
        return "Complete system access with user management, financial oversight, and administrative controls.";
      case "sales": 
        return "Order management, customer relations, and distributor network coordination.";
      case "production": 
        return "Manufacturing batch management, production schedules, and quality control.";
      case "inventory": 
        return "Stock level monitoring, inventory movements, and supply chain management.";
      case "accounts": 
        return "Financial record management, budget approval, and expense tracking.";
      case "distributor": 
        return "Delivery management, order tracking, and distribution network operations.";
      default: 
        return "Role-specific dashboard access.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Sunrise Foods Dashboard
              </h1>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/profile")}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>{user.firstName} {user.lastName}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                {getRoleIcon()}
                <div>
                  <h2 className="text-2xl font-bold capitalize">{user.role} Dashboard</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Welcome back, {user.firstName}!
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {getRoleDescription()}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Account Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                      <p><strong>Status:</strong> <Badge variant="outline" className="text-green-600">Active</Badge></p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setLocation("/profile")}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Role Permissions</h3>
                    <p className="text-sm text-gray-600">
                      You have {user.role} level access to the system with role-specific features and data.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific content placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Role-Specific Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Role-specific dashboard features will be displayed here.
                </p>
                <p className="text-sm text-gray-400">
                  This dashboard demonstrates the role-based authentication system with secure access control.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}