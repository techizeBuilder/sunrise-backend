import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Heart, Wheat } from "lucide-react";
import { Product } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["/api/products"],
    select: (data: Product[]) => data.slice(0, 3), // Show first 3 products as featured
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl text-heading mb-6">
            Golden Crust Bakery
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Artisanal breads and pastries baked fresh daily with love and tradition
          </p>
          <Link href="/products">
            <Button size="lg" className="btn-primary text-lg">
              Explore Our Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">Why Choose Golden Crust?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine traditional baking methods with the finest ingredients to create exceptional products
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wheat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl text-subheading mb-4">Premium Ingredients</h3>
              <p className="text-muted-foreground">
                We source only the finest organic flours, fresh dairy, and premium ingredients for exceptional taste and quality.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl text-subheading mb-4">Fresh Daily</h3>
              <p className="text-muted-foreground">
                Every item is baked fresh daily using time-honored techniques passed down through generations of bakers.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl text-subheading mb-4">Made with Love</h3>
              <p className="text-muted-foreground">
                Our passionate bakers pour their heart into every creation, ensuring each bite delivers pure satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">A selection of our most beloved creations</p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <Card key={product.id} className="product-card">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl text-subheading mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <span className="text-primary font-semibold">{product.price}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
