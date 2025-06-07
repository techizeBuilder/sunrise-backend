import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Calculator,
  Settings,
  FolderTree,
  DollarSign,
  Percent,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard/stats"),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiRequest("GET", "/api/users"),
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiRequest("GET", "/api/orders"),
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: () => apiRequest("GET", "/api/inventory/low-stock"),
  });

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="Complete overview and system management"
    >
      <div className="space-y-6">
        {/* Product Management Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Management Suite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/product-management">
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-blue-300 bg-white hover:bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Management Hub</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-blue-700">
                    Dashboard & overview
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

            <Card className="border-dashed border-2 border-gray-300 bg-gray-50 opacity-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">More Features</CardTitle>
                <Settings className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400">
                  Coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Management</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage system users and roles
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Configure system preferences
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Analytics & insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Products in catalog
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingOrders || 0} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats?.monthlyIncome || 0}</div>
              <p className="text-xs text-muted-foreground">
                Current month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        {lowStockProducts && lowStockProducts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-3">
                {lowStockProducts.length} products are running low on stock
              </p>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map((product: any) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-sm">{product.name}</span>
                    <Badge variant="destructive">{product.stock} left</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders?.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">₹{order.totalAmount}</p>
                      <Badge 
                        variant={order.status === 'pending' ? 'secondary' : 
                                order.status === 'completed' ? 'default' : 'outline'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users && Object.entries(
                  users.reduce((acc: any, user: any) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([role, count]) => (
                  <div key={role} className="flex justify-between items-center">
                    <span className="capitalize text-sm">{role}</span>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}