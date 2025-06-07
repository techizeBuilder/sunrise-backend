import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";

const categories = [
  { id: "all", label: "All Products" },
  { id: "breads", label: "Breads" },
  { id: "pastries", label: "Pastries" },
  { id: "desserts", label: "Desserts" },
  { id: "cakes", label: "Cakes" },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory === "all" ? "" : `?category=${selectedCategory}`],
    queryFn: () => fetch(`/api/products${selectedCategory === "all" ? "" : `?category=${selectedCategory}`}`)
      .then(res => res.json()) as Promise<Product[]>,
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-card">
        <div className="container-max">
          <div className="text-center mb-16">
            <h1 className="text-5xl text-heading mb-4">Our Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete range of artisanal breads, pastries, and desserts, all made fresh daily with the finest ingredients
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-xl h-48 mb-4" />
                  <div className="bg-muted h-6 rounded mb-2" />
                  <div className="bg-muted h-4 rounded mb-4" />
                  <div className="bg-muted h-4 rounded w-20" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
