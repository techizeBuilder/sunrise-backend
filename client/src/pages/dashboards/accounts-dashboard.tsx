import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Plus, FileText } from "lucide-react";

export default function AccountsDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard/stats"),
  });

  const { data: financialRecords } = useQuery({
    queryKey: ["financial", "records"],
    queryFn: () => apiRequest("GET", "/api/financial/records"),
  });

  const { data: financialSummary } = useQuery({
    queryKey: ["financial", "summary"],
    queryFn: () => apiRequest("GET", "/api/financial/summary"),
  });

  return (
    <DashboardLayout 
      title="Accounts Dashboard" 
      subtitle="Financial management and accounting overview"
    >
      <div className="space-y-6">
        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{stats?.monthlyIncome || 0}</div>
              <p className="text-xs text-muted-foreground">
                Current month revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{stats?.monthlyExpense || 0}</div>
              <p className="text-xs text-muted-foreground">
                Current month costs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (stats?.monthlyIncome || 0) - (stats?.monthlyExpense || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{(stats?.monthlyIncome || 0) - (stats?.monthlyExpense || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly difference
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialRecords?.filter((record: any) => !record.approved).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Require approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Alert */}
        {financialRecords?.filter((record: any) => !record.approved).length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <Calculator className="h-5 w-5 mr-2" />
                Pending Financial Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                {financialRecords?.filter((record: any) => !record.approved).length} financial records require your approval
              </p>
              <div className="space-y-2">
                {financialRecords?.filter((record: any) => !record.approved).slice(0, 3).map((record: any) => (
                  <div key={record.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{record.description}</p>
                      <p className="text-xs text-muted-foreground">{record.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{record.amount}
                      </p>
                      <Badge variant="secondary">{record.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-800">
                <Plus className="h-5 w-5 mr-2" />
                Record Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700 mb-4">
                Add new income or expense transactions
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                New Transaction
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate comprehensive financial reports and statements
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                Budget Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage budgets for different departments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financialRecords?.slice(0, 8).map((record: any) => (
                  <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{record.description}</p>
                      <p className="text-xs text-muted-foreground">{record.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.type === 'income' ? '+' : '-'}₹{record.amount}
                      </p>
                      <Badge 
                        variant={record.approved ? 'default' : 'secondary'}
                      >
                        {record.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Total Income</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">₹{stats?.monthlyIncome || 0}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-medium">Total Expenses</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">₹{stats?.monthlyExpense || 0}</span>
                </div>
                
                <div className={`flex justify-between items-center p-4 rounded-lg ${
                  (stats?.monthlyIncome || 0) - (stats?.monthlyExpense || 0) >= 0 ? 'bg-blue-50' : 'bg-yellow-50'
                }`}>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">Net Result</span>
                  </div>
                  <span className={`text-xl font-bold ${
                    (stats?.monthlyIncome || 0) - (stats?.monthlyExpense || 0) >= 0 ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    ₹{(stats?.monthlyIncome || 0) - (stats?.monthlyExpense || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}