import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Story Section */}
      <section className="section-padding bg-card">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl text-heading mb-8">Our Story</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 1985 by Maria and Giuseppe Roselli, Golden Crust Bakery began as a small neighborhood shop with a simple mission: to bring authentic, artisanal baked goods to our community.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                What started with a handful of traditional Italian recipes has grown into a beloved bakery known throughout the city for our commitment to quality, tradition, and innovation.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Today, our second-generation bakers continue the legacy, combining time-honored techniques with modern culinary innovations to create exceptional breads, pastries, and desserts that bring joy to every table.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-4 cream-gradient">
                  <CardContent className="p-4">
                    <div className="text-3xl text-heading font-bold text-primary mb-2">38+</div>
                    <div className="text-sm text-muted-foreground">Years of Excellence</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 cream-gradient">
                  <CardContent className="p-4">
                    <div className="text-3xl text-heading font-bold text-primary mb-2">150+</div>
                    <div className="text-sm text-muted-foreground">Daily Varieties</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Baker kneading dough"
                className="rounded-xl shadow-lg w-full h-auto"
              />
              <img 
                src="https://images.unsplash.com/photo-1504730030853-efa950a8e7e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Vintage bakery storefront"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe that great baking is more than just following recipes—it's about passion, tradition, and bringing people together through the universal language of delicious food.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Card className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-3xl">🌱</div>
                </CardContent>
              </Card>
              <h3 className="text-xl text-subheading mb-4">Sustainability</h3>
              <p className="text-muted-foreground">
                We source ingredients locally and sustainably, supporting our community and protecting our environment.
              </p>
            </div>
            
            <div className="text-center">
              <Card className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-3xl">👥</div>
                </CardContent>
              </Card>
              <h3 className="text-xl text-subheading mb-4">Community</h3>
              <p className="text-muted-foreground">
                Building lasting relationships with our customers and giving back to the community that supports us.
              </p>
            </div>
            
            <div className="text-center">
              <Card className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-3xl">⭐</div>
                </CardContent>
              </Card>
              <h3 className="text-xl text-subheading mb-4">Excellence</h3>
              <p className="text-muted-foreground">
                Never compromising on quality and constantly innovating to exceed our customers' expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
