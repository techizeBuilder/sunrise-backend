import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/image_1749285656583.png";

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-white">
      <div className="container-max section-padding">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={logoPath} 
                alt="Sunrise Foods Logo" 
                className="h-12 w-auto mr-3"
              />
              <h3 className="text-2xl text-heading font-bold">Sunrise Foods</h3>
            </div>
            <p className="text-gray-100 mb-4 leading-relaxed">
              Quality baked goods crafted with consistency, hygiene, and excellence since 2004.
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
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-100 hover:text-orange-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-100 hover:text-orange-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-100 hover:text-orange-300 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-100 hover:text-orange-300 transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <ul className="space-y-2 text-gray-100 text-sm">
              <li><strong className="text-orange-300">Hyderabad:</strong> +91 98490 08282</li>
              <li><strong className="text-orange-300">Bengaluru:</strong> +91 98490 08282</li>
              <li><strong className="text-orange-300">Tirupati:</strong> +91 97005 52003</li>
              <li className="mt-2">info@sunrisefoods.in</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Hours</h4>
            <ul className="space-y-2 text-gray-100">
              <li>Mon-Sat: 8AM - 6PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-500 mt-8 pt-8 text-center text-gray-100">
          <p>&copy; 2024 Sunrise Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
