import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5" />
            LocalLink
          </h3>
          <p className="text-gray-500 mb-4">
            Connecting nearby buyers and sellers. Fast delivery, fresh products, directly from your community.
          </p>
          <div className="flex gap-4">
            {/* Social links */}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#" className="hover:text-primary transition">Home</a></li>
            <li><a href="#" className="hover:text-primary transition">Products</a></li>
            <li><a href="#" className="hover:text-primary transition">Stores Nearby</a></li>
            <li><a href="#" className="hover:text-primary transition">About Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">For Sellers</h4>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#" className="hover:text-primary transition">Partner with us</a></li>
            <li><a href="#" className="hover:text-primary transition">Seller Dashboard</a></li>
            <li><a href="#" className="hover:text-primary transition">Seller Guidelines</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-500">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> +1 234 567 890</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> support@locallink.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} LocalLink. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
