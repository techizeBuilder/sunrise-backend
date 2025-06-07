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
                Founded in 2004 by a group of young, passionate bakery concept developers, Sunrise Foods began its journey with a vision to redefine industrial baking in India.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                The first production unit was established in Hyderabad, marking the beginning of a commitment to quality and innovation in the bakery segment. Building on early success, a second unit was launched in Bengaluru in 2009, followed by a third facility in Tirupati in 2022.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                With each expansion, Sunrise Foods has continued to uphold its core values of consistency, hygiene, and excellence—bringing thoughtfully crafted baked goods to everyday moments across South India. The Everyday range—featuring cookies, cakes, breads, rusks, and more—combines traditional recipes with a commitment to wholesome, hygienic preparation. It's a promise of purity and taste in every bite.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-4 cream-gradient">
                  <CardContent className="p-4">
                    <div className="text-3xl text-heading font-bold text-primary mb-2">20+</div>
                    <div className="text-sm text-muted-foreground">Years of Excellence</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 cream-gradient">
                  <CardContent className="p-4">
                    <div className="text-3xl text-heading font-bold text-primary mb-2">3</div>
                    <div className="text-sm text-muted-foreground">Production Units</div>
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
            <h2 className="text-4xl text-heading mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sunrise Foods is built on three fundamental pillars that define everything we do: consistency in quality, excellence in taste, and hygiene in every process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Card className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-3xl">🔄</div>
                </CardContent>
              </Card>
              <h3 className="text-xl text-subheading mb-4">Consistency</h3>
              <p className="text-muted-foreground">
                Maintaining uniform quality and taste in every product, ensuring our customers get the same excellent experience every time.
              </p>
            </div>
            
            <div className="text-center">
              <Card className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-3xl">🧼</div>
                </CardContent>
              </Card>
              <h3 className="text-xl text-subheading mb-4">Hygiene</h3>
              <p className="text-muted-foreground">
                Implementing the highest standards of cleanliness and safety in all our production processes and facilities.
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
                Continuously innovating and refining our recipes and processes to deliver superior quality baked goods.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
