import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  FolderTree, 
  DollarSign, 
  Percent,
  ArrowRight,
  ShoppingCart,
  Tag
} from "lucide-react";

interface ProductNavigationProps {
  userRole?: string;
}

export default function ProductNavigation({ userRole }: ProductNavigationProps) {
  const [location] = useLocation();

  const navigationItems = [
    {
      title: "Product Catalog",
      description: "Browse all products with SKU, pricing, and inventory details",
      icon: Package,
      href: "/manage/products",
      roles: ["admin", "inventory", "sales", "production"],
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "Product Categories",
      description: "Organize products with hierarchical categories and subcategories",
      icon: FolderTree,
      href: "/manage/categories",
      roles: ["admin", "inventory"],
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    },
    {
      title: "Custom Price Lists",
      description: "Manage B2B pricing, bulk discounts, and client-specific rates",
      icon: DollarSign,
      href: "/manage/price-lists",
      roles: ["admin", "sales"],
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600"
    },
    {
      title: "Discount Management",
      description: "Create time-based promotions and item-specific discount rules",
      icon: Percent,
      href: "/manage/discounts",
      roles: ["admin", "sales"],
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    }
  ];

  const accessibleItems = navigationItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Management</h2>
        <p className="text-muted-foreground">
          Comprehensive tools for managing your bakery's product catalog, pricing, and promotions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accessibleItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${item.color} ${
                isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                        <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {isActive && (
                          <Badge variant="default" className="mt-1">
                            Current Page
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.roles.join(", ")} access
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {userRole && (
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingCart className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Role-Based Access: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            You have access to {accessibleItems.length} of {navigationItems.length} product management modules based on your role permissions.
          </p>
        </div>
      )}
    </div>
  );
}