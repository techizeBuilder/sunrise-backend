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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-heading mb-4 sm:mb-6">
            Golden Crust Bakery
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-light px-4">
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

      {/* Statistics Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="container-max relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-white mb-4">Our Success Story</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Two decades of excellence in manufacturing, innovation, and trusted partnerships across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {/* Years of Experience */}
            <div className="text-center text-white">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">21</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Years of experience in manufacturing, institutional sales, and retail.
              </p>
            </div>
            
            {/* Employees */}
            <div className="text-center text-white">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">650</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Employees with strong management teams across three units
              </p>
            </div>
            
            {/* Manufacturing Units */}
            <div className="text-center text-white">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">3</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Manufacturing units spread across three states. (AP, TG & KA)
              </p>
            </div>
            
            {/* Manufacturing Space */}
            <div className="text-center text-white">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">35000</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Sq. Ft. manufacturing space across Andhra Pradesh, Karnataka, and Telangana
              </p>
            </div>
            
            {/* SKUs */}
            <div className="text-center text-white">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">82</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                SKUs with dedicated product team continually developing new tastes
              </p>
            </div>
            
            {/* Annual Growth */}
            <div className="text-center text-white">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">15</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Percent of annual growth on year-on-year basis to be a growing brand in local markets
              </p>
            </div>
            
            {/* Total Outlets */}
            <div className="text-center text-white sm:col-span-2 md:col-span-1 lg:col-span-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">40000</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Total outlets where our products are accessible. BLR-5000 + 35,000-S. India
              </p>
            </div>
            
            {/* Distributors */}
            <div className="text-center text-white sm:col-span-2 md:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">1250</div>
              <p className="text-xs sm:text-sm text-white/90 px-2">
                Distributors spread across three manufacturing units of 3 operational states.
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
                    <span className="text-primary font-semibold">₹{product.basePrice}</span>
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

      {/* About Us Section */}
      <section id="about" className="section-padding bg-background">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-heading mb-4 sm:mb-6">About Sunrise Foods</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                With over two decades of excellence in the bakery industry, Sunrise Foods has grown from a small bakery 
                to one of India's most trusted names in baked goods. Our journey began in 2003 with a simple mission: 
                to create delicious, high-quality products that bring families together.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                Today, we operate three state-of-the-art manufacturing facilities across Andhra Pradesh, Telangana, 
                and Karnataka, employing over 650 dedicated professionals who share our passion for quality and innovation.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">2003</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Founded</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">3</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">States</p>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="About Sunrise Foods"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-heading mb-3 sm:mb-4">Our Core Values</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              The principles that guide our daily operations and long-term vision
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-subheading mb-2 sm:mb-3">Quality First</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Every product undergoes rigorous quality checks to ensure we deliver only the finest baked goods.
              </p>
            </div>
            
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-subheading mb-2 sm:mb-3">Innovation</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Our dedicated R&D team continuously develops new flavors and products to delight our customers.
              </p>
            </div>
            
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-subheading mb-2 sm:mb-3">Customer Care</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Building lasting relationships through exceptional service and understanding our customers' needs.
              </p>
            </div>
            
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-subheading mb-2 sm:mb-3">Team Spirit</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Our success is built on the dedication and collaboration of our 650+ team members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence Section */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">Manufacturing Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our three state-of-the-art facilities are equipped with modern technology and operated by skilled professionals 
              to ensure consistent quality and efficient production.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Andhra Pradesh Facility"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Andhra Pradesh</h3>
                  <p className="text-sm">Primary Manufacturing Unit</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Our flagship facility houses our main production lines and R&D center.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Telangana Facility"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Telangana</h3>
                  <p className="text-sm">Distribution Hub</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Strategic location for efficient distribution across South India.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Karnataka Facility"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Karnataka</h3>
                  <p className="text-sm">Specialty Products</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Focused on premium and specialty bakery items for discerning customers.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">35,000</div>
              <p className="text-muted-foreground">Square feet of manufacturing space</p>
            </div>
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Production capability</p>
            </div>
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">ISO</div>
              <p className="text-muted-foreground">Certified quality standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">Our Product Range</h2>
            <p className="text-lg text-muted-foreground">
              From traditional favorites to innovative creations, we offer something for every taste
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Breads"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Breads</h3>
                  <p className="text-sm">Fresh daily varieties</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Cakes"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Cakes</h3>
                  <p className="text-sm">Celebration essentials</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Pastries"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Pastries</h3>
                  <p className="text-sm">Artisan crafted</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Snacks"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Snacks</h3>
                  <p className="text-sm">Quick bites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground">
              Hear from the people who trust us with their daily bread
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "The quality of bread from Sunrise Foods is exceptional. Our customers always ask for more. 
                It's been our trusted supplier for over 5 years."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">RS</span>
                </div>
                <div>
                  <div className="font-semibold">Rajesh Sharma</div>
                  <div className="text-sm text-muted-foreground">Store Owner, Bangalore</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Their cakes and pastries are simply amazing! Perfect for our hotel's breakfast buffet. 
                Consistent quality and timely delivery every single day."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">MP</span>
                </div>
                <div>
                  <div className="font-semibold">Meera Patel</div>
                  <div className="text-sm text-muted-foreground">Hotel Manager, Hyderabad</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "As a distributor, I appreciate their professional approach and product variety. 
                They understand our business needs and always deliver on promises."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">AK</span>
                </div>
                <div>
                  <div className="font-semibold">Arun Kumar</div>
                  <div className="text-sm text-muted-foreground">Distributor, Chennai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-heading mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground">
              Ready to partner with us? Contact our team for orders, distributorship, or inquiries
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl text-subheading mb-3">Phone</h3>
              <p className="text-muted-foreground">+91 9876543210</p>
              <p className="text-muted-foreground">+91 9876543211</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl text-subheading mb-3">Email</h3>
              <p className="text-muted-foreground">info@sunrisefoods.com</p>
              <p className="text-muted-foreground">sales@sunrisefoods.com</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-subheading mb-3">Headquarters</h3>
              <p className="text-muted-foreground">Sunrise Foods Pvt. Ltd.</p>
              <p className="text-muted-foreground">Hyderabad, Telangana</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
