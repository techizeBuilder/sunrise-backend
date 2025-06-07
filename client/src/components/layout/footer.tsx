import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
const logoPath = "https://sunrisefoods.in/assets/img/Global/Everyday118x72.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-600 to-red-600 text-white">
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
            <p className="text-orange-100 mb-4 leading-relaxed">
              Quality baked goods crafted with consistency, hygiene, and excellence since 2004.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-orange-200 hover:text-yellow-200 hover:bg-orange-700">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-orange-200 hover:text-yellow-200 hover:bg-orange-700">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-orange-200 hover:text-yellow-200 hover:bg-orange-700">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-orange-100 hover:text-yellow-200 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-orange-100 hover:text-yellow-200 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-orange-100 hover:text-yellow-200 transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-orange-100 hover:text-yellow-200 transition-colors duration-200">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <ul className="space-y-2 text-orange-100 text-sm">
              <li><strong className="text-yellow-200">Hyderabad:</strong> +91 98490 08282</li>
              <li><strong className="text-yellow-200">Bengaluru:</strong> +91 98490 08282</li>
              <li><strong className="text-yellow-200">Tirupati:</strong> +91 97005 52003</li>
              <li className="mt-3 text-yellow-200 font-medium">info@sunrisefoods.in</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Hours</h4>
            <ul className="space-y-2 text-orange-100">
              <li><strong>Mon-Sat:</strong> 8AM - 6PM</li>
              <li><strong>Sunday:</strong> Closed</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-orange-400 mt-8 pt-8 text-center text-orange-100">
          <p>&copy; 2024 Sunrise Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
