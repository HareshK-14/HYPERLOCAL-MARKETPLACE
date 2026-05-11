import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }) => {
  const storeName = encodeURIComponent(store?.name || '');

  return (
    <Link to={`/products?store=${storeName}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:border-blue-200 transition group block cursor-pointer"
      >
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
            <img 
              src={store?.image || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&q=80'} 
              alt={store?.name || 'Store'} 
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition">{store?.name || 'Green Grocery'}</h3>
              <div className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 fill-current" />
                {store?.rating || '4.8'}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{store?.category || 'Groceries & Essentials'}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {store?.distance || '0.8 km'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {store?.deliveryTime || '15-20 min'}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition">
                Shop <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default StoreCard;
