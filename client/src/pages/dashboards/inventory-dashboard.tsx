import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Warehouse, Package, AlertTriangle, TrendingDown, Plus, BarChart3, FolderTree } from "lucide-react";

export default function InventoryDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard/stats"),
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiRequest("GET", "/api/products"),
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: () => apiRequest("GET", "/api/inventory/low-stock"),
  });

  const { data: movements } = useQuery({
    queryKey: ["inventory", "movements"],
    queryFn: () => apiRequest("GET", "/api/inventory/movements"),
  });

  return (
    <DashboardLayout 
      title="Inventory Dashboard" 
      subtitle="Monitor stock levels and inventory movements"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Items in catalog
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.lowStockProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{
                products?.reduce((total: number, product: any) => {
                  const price = parseFloat(product.price.replace('₹', ''));
                  return total + (price * product.stock);
                }, 0) || 0
              }</div>
              <p className="text-xs text-muted-foreground">
                Current inventory value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Movements</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {movements?.filter((m: any) => 
                  new Date(m.date).toDateString() === new Date().toDateString()
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Stock adjustments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts && lowStockProducts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                {lowStockProducts.length} products are running low on stock and need immediate attention
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lowStockProducts.slice(0, 4).map((product: any) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                    </div>
                    <Badge variant="destructive">{product.stock} left</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/product-management">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-green-200 bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Product Management Hub</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-700">
                  Complete inventory management suite
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manage/products">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Product Catalog</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Manage products and inventory levels
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manage/categories">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <FolderTree className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Organize products with categories
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-yellow-200 bg-yellow-50 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Record Movement</CardTitle>
              <Plus className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-yellow-700">
                Add stock adjustments
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Generate inventory analytics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Overview and Recent Movements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products?.slice(0, 8).map((product: any) => (
                  <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{product.stock}</p>
                      <Badge 
                        variant={product.stock <= product.minStock ? 'destructive' : 
                                product.stock <= product.minStock * 2 ? 'secondary' : 'outline'}
                      >
                        {product.stock <= product.minStock ? 'Low' : 
                         product.stock <= product.minStock * 2 ? 'Medium' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Inventory Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {movements?.slice(0, 8).map((movement: any) => (
                  <div key={movement.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{movement.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(movement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm ${
                        movement.type === 'in' ? 'text-green-600' : 
                        movement.type === 'out' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{movement.quantity}
                      </p>
                      <Badge variant="outline">
                        {movement.type}
                      </Badge>
                    </div>
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