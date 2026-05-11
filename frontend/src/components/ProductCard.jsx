import { useState } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation(); // don't navigate when clicking +
    addToCart({
      id: product?.id || Math.random(),
      name: product?.name || 'Product',
      price: parseFloat(product?.price) || 9.99,
      image: product?.image || '',
      storeName: product?.storeName || '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => product?.id && navigate(`/products/${product.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group cursor-pointer"
    >
      <div className="relative h-48 bg-gray-100">
        <img 
          src={product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'} 
          alt={product?.name || 'Product'} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          {product?.rating || '4.5'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-xs text-primary font-medium mb-1">{product?.category || 'Electronics'}</div>
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{product?.name || 'Product'}</h3>
        <p className="text-sm text-gray-500 mb-3 truncate">{product?.storeName || 'Nearby Store'}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">₹{product?.price || '9.99'}</span>
          <button
            onClick={handleAdd}
            className={`p-2 rounded-full transition active:scale-95 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-blue-700'
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

