import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminDashboard from "./dashboards/admin-dashboard";
import SalesDashboard from "./dashboards/sales-dashboard";
import ProductionDashboard from "./dashboards/production-dashboard";
import InventoryDashboard from "./dashboards/inventory-dashboard";
import AccountsDashboard from "./dashboards/accounts-dashboard";
import DistributorDashboard from "./dashboards/distributor-dashboard";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "sales":
      return <SalesDashboard />;
    case "production":
      return <ProductionDashboard />;
    case "inventory":
      return <InventoryDashboard />;
    case "accounts":
      return <AccountsDashboard />;
    case "distributor":
      return <DistributorDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600">Your role is not recognized. Please contact an administrator.</p>
          </div>
        </div>
      );
  }
}