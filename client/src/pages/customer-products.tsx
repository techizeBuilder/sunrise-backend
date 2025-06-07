import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product, ProductCategory } from "@shared/schema";

export default function CustomerProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<ProductCategory[]>({
    queryKey: ["/api/categories"],
  });

  const isLoading = productsLoading || categoriesLoading;

  // Filter products by category
  const filteredProducts = products?.filter(product => 
    selectedCategory === "all" || product.categoryId === selectedCategory
  ) || [];

  // Group products by category for display
  const groupedProducts = categories?.reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(product => product.categoryId === category.id);
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        category,
        products: categoryProducts
      };
    }
    return acc;
  }, {} as Record<string, { category: ProductCategory; products: Product[] }>) || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container-max">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-heading mb-4">
              Our Products from Everyday Brand
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our wide range of freshly baked goods, from traditional breads to delicious cakes
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-card border-b">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              All Products
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <div className="container-max">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-5 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded mb-2 w-20" />
                    <div className="h-6 bg-muted rounded w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedCategory === "all" ? (
            // Show all products grouped by category
            <div className="space-y-12">
              {Object.values(groupedProducts).map(({ category, products }) => (
                <div key={category.id}>
                  {/* Category Separator */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-border"></div>
                    <h2 className="text-2xl font-semibold text-heading px-4">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.stock < 10 && (
                            <Badge variant="destructive" className="absolute top-2 left-2">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg text-heading mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {product.unit === 'kg' ? '1 Kg' : `1 ${product.unit}`}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-red-600">
                              ₹{product.basePrice.toFixed(2)}
                            </span>
                            {product.stock > 0 ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                In Stock
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedProducts).length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold text-heading mb-2">No Products Available</h3>
                  <p className="text-muted-foreground">Check back soon for new products!</p>
                </div>
              )}
            </div>
          ) : (
            // Show filtered products for specific category
            <div>
              {filteredProducts.length > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-border"></div>
                  <h2 className="text-2xl font-semibold text-heading px-4">
                    {categories?.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock < 10 && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-heading mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.unit === 'kg' ? '1 Kg' : `1 ${product.unit}`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red-600">
                          ₹{product.basePrice.toFixed(2)}
                        </span>
                        {product.stock > 0 ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold text-heading mb-2">No Products in This Category</h3>
                  <p className="text-muted-foreground">Try selecting a different category or check back later!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}