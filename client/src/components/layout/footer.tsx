import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-white">
      <div className="container-max section-padding">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl text-heading font-bold mb-4">Golden Crust</h3>
            <p className="text-gray-300 mb-4">
              Artisanal baked goods made with love and tradition since 1985.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Plot#75, Road# 9, IDA</li>
              <li>Mallapur, Telangana - 500076</li>
              <li>+91 98490 08282</li>
              <li>orders@sunrisefoods</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Mon-Sat: 8AM - 7PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Golden Crust Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
