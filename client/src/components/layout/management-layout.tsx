import { Link, useLocation } from "wouter";
import { Package, Folder, Home, LogOut, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface ManagementLayoutProps {
  children: React.ReactNode;
}

export default function ManagementLayout({ children }: ManagementLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: location === "/dashboard",
    },
    {
      label: "Products",
      href: "/manage/products",
      icon: Package,
      active: location === "/manage/products",
    },
    {
      label: "Categories",
      href: "/manage/categories",
      icon: Folder,
      active: location === "/manage/categories",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Sunrise Foods</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      className="flex items-center space-x-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-1 whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}