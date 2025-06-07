import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Factory, Clock, CheckCircle, AlertCircle, Plus, Package } from "lucide-react";

export default function ProductionDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard/stats"),
  });

  const { data: batches } = useQuery({
    queryKey: ["production", "batches"],
    queryFn: () => apiRequest("GET", "/api/production/batches"),
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiRequest("GET", "/api/products"),
  });

  return (
    <DashboardLayout 
      title="Production Dashboard" 
      subtitle="Manage production batches and manufacturing schedules"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeBatches || 0}</div>
              <p className="text-xs text-muted-foreground">
                Currently in production
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
                Available for production
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {batches?.filter((b: any) => 
                  b.status === 'completed' && 
                  new Date(b.actualEndDate).toDateString() === new Date().toDateString()
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Batches finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Behind Schedule</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {batches?.filter((b: any) => 
                  b.status === 'in-progress' && 
                  new Date(b.expectedEndDate) < new Date()
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Overdue batches
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Plus className="h-5 w-5 mr-2" />
                New Production Batch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Schedule a new production batch for any product
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Create Batch
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Production Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage the production timeline and schedules
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Factory className="h-5 w-5 mr-2 text-purple-600" />
                Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor quality metrics and batch compliance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Production Status and Recent Batches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Production Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {batches?.filter((batch: any) => batch.status === 'in-progress').slice(0, 6).map((batch: any) => (
                  <div key={batch.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{batch.batchNumber}</p>
                      <p className="text-xs text-muted-foreground">{batch.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(batch.expectedEndDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{batch.quantity} units</p>
                      <Badge 
                        variant={new Date(batch.expectedEndDate) < new Date() ? 'destructive' : 'secondary'}
                      >
                        {batch.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {batches?.filter((batch: any) => batch.status === 'completed').slice(0, 6).map((batch: any) => (
                  <div key={batch.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{batch.batchNumber}</p>
                      <p className="text-xs text-muted-foreground">{batch.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed: {new Date(batch.actualEndDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{batch.quantity} units</p>
                      <Badge variant="default">
                        {batch.status}
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