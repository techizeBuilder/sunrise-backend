import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  User, 
  Settings, 
  Home,
  Package,
  ShoppingCart,
  Factory,
  Warehouse,
  Calculator,
  Truck
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const roleIcons = {
  admin: Settings,
  sales: ShoppingCart,
  production: Factory,
  inventory: Warehouse,
  accounts: Calculator,
  distributor: Truck,
};

const roleColors = {
  admin: "bg-purple-100 text-purple-800",
  sales: "bg-blue-100 text-blue-800",
  production: "bg-green-100 text-green-800",
  inventory: "bg-yellow-100 text-yellow-800",
  accounts: "bg-indigo-100 text-indigo-800",
  distributor: "bg-orange-100 text-orange-800",
};

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  if (!user || !user.role) return null;

  const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || Settings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://sunrisefoods.in/assets/img/Global/Everyday118x72.png" 
              alt="Sunrise Foods" 
              className="h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <RoleIcon className="h-4 w-4" />
              <Badge className={roleColors[user.role]}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = "/profile"}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <User className="h-4 w-4" />
              <span>{user.firstName} {user.lastName}</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logout()}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}