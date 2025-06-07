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
  Factory,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  Settings,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  FolderTree,
  Percent
} from "lucide-react";
import { Link } from "wouter";

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

          {/* Role-specific content */}
          {user.role === "admin" && <AdminPanel />}
          {user.role === "sales" && <SalesPanel />}
          {user.role === "production" && <ProductionPanel />}
          {user.role === "inventory" && <InventoryPanel />}
          {user.role === "accounts" && <AccountsPanel />}
          {user.role === "distributor" && <DistributorPanel />}
        </div>
      </main>
    </div>
  );
}

// Admin Panel Component
function AdminPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Total Users</p>
                <p className="text-2xl font-bold text-red-700">142</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-700">1,284</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">Products</p>
                <p className="text-2xl font-bold text-orange-700">486</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Product Management Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Product Management Suite</h3>
          <p className="text-blue-700 text-sm">Comprehensive tools for managing your bakery's product catalog, pricing, and promotions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Link href="/product-management">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-blue-300 bg-blue-100 hover:bg-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Management Hub</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-700">
                  Central dashboard & overview
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manage/products">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Manage inventory & SKUs
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manage/categories">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <FolderTree className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Product organization
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manage/price-lists">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Lists</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  B2B & bulk pricing
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/manage/discounts">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discounts</CardTitle>
                <Percent className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Promotional offers & coupons
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">More Features</CardTitle>
              <Plus className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Additional modules coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users & Roles
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Reports
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Low stock alert: 12 items</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Pending orders: 23 items</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System running normally</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sales Panel Component
function SalesPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">My Orders</p>
                <p className="text-2xl font-bold text-blue-700">84</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Monthly Sales</p>
                <p className="text-2xl font-bold text-green-700">₹485K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">Pending</p>
                <p className="text-2xl font-bold text-orange-700">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Customers
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Track Deliveries
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Order #1234</p>
                  <p className="text-sm text-gray-600">Rajesh Kumar - ₹2,450</p>
                </div>
                <Badge>Processing</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Order #1235</p>
                  <p className="text-sm text-gray-600">Priya Singh - ₹1,850</p>
                </div>
                <Badge variant="outline">Shipped</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Production Panel Component
function ProductionPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Factory className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Active Batches</p>
                <p className="text-2xl font-bold text-green-700">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Completed Today</p>
                <p className="text-2xl font-bold text-blue-700">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Factory className="h-5 w-5" />
              <span>Production Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Start New Batch
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Schedule Production
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Quality Control
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Production Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Batch #PB001</p>
                  <p className="text-sm text-gray-600">Chocolate Cake - 50 units</p>
                </div>
                <Badge className="bg-green-100 text-green-800">In Progress</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Batch #PB002</p>
                  <p className="text-sm text-gray-600">Bread Loaves - 100 units</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Inventory Panel Component
function InventoryPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-600">Total Items</p>
                <p className="text-2xl font-bold text-purple-700">1,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-700">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">In Stock</p>
                <p className="text-2xl font-bold text-green-700">1,835</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Inventory Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Entry
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Stock Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Low Stock Alerts
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <p className="font-medium">Flour (Premium)</p>
                  <p className="text-sm text-gray-600">Stock: 15 kg</p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <div>
                  <p className="font-medium">Sugar</p>
                  <p className="text-sm text-gray-600">Stock: 25 kg</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Accounts Panel Component
function AccountsPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Monthly Income</p>
                <p className="text-2xl font-bold text-green-700">₹845K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Monthly Expense</p>
                <p className="text-2xl font-bold text-red-700">₹324K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-700">₹521K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Financial Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Financial Record
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Budget Analysis
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Equipment Purchase</p>
                  <p className="text-sm text-gray-600">₹45,000</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Raw Material Cost</p>
                  <p className="text-sm text-gray-600">₹12,500</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Distributor Panel Component
function DistributorPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">Assigned Deliveries</p>
                <p className="text-2xl font-bold text-orange-700">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-700">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-700">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Delivery Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Delivery Status
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Delivery Reports
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">DEL-001</p>
                  <p className="text-sm text-gray-600">Sector 15, Noida - 2.5 km</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">DEL-002</p>
                  <p className="text-sm text-gray-600">Connaught Place - 8.2 km</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}