import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/image_1749285656583.png";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
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
            <p className="text-slate-300 mb-4 leading-relaxed">
              Quality baked goods crafted with consistency, hygiene, and excellence since 2004.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-slate-400 hover:text-orange-400 hover:bg-slate-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-slate-400 hover:text-orange-400 hover:bg-slate-800">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-slate-400 hover:text-orange-400 hover:bg-slate-800">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-300 hover:text-orange-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-orange-400 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-300 hover:text-orange-400 transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-300 hover:text-orange-400 transition-colors duration-200">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><strong className="text-orange-400">Hyderabad:</strong> +91 98490 08282</li>
              <li><strong className="text-orange-400">Bengaluru:</strong> +91 98490 08282</li>
              <li><strong className="text-orange-400">Tirupati:</strong> +91 97005 52003</li>
              <li className="mt-3 text-orange-400 font-medium">info@sunrisefoods.in</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Hours</h4>
            <ul className="space-y-2 text-slate-300">
              <li><strong>Mon-Sat:</strong> 8AM - 6PM</li>
              <li><strong>Sunday:</strong> Closed</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
          <p>&copy; 2024 Sunrise Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
