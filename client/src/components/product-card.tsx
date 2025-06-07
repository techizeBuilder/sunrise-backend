import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breads":
        return "bg-secondary text-secondary-foreground";
      case "pastries":
        return "bg-accent text-accent-foreground";
      case "desserts":
        return "bg-primary text-primary-foreground";
      case "cakes":
        return "bg-dark-brown text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="product-card">
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl text-subheading mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold text-lg">{product.price}</span>
          <Badge className={`capitalize ${getCategoryColor(product.category)}`}>
            {product.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
