import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Plus, Minus, Check, ShoppingCart, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { allProducts } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
        <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          Back to Products
        </Link>
      </div>
    );
  }

  const cartItem = cartItems.find(i => i.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        storeName: `${product.storeName}, ${product.storeDistance}`,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related products (same category, different id)
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary transition font-medium">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category badge */}
            <span className="inline-block bg-blue-50 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
              {product.category}
            </span>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-1 text-sm font-bold text-gray-800">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-4xl font-extrabold text-gray-900 mb-6">
              ₹{product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>

            {/* Store Info */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{product.storeName}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{product.storeDistance}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{product.deliveryTime}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector + Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-gray-600 hover:text-primary transition"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-gray-600 hover:text-primary transition"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition shadow-lg active:scale-95 ${
                  added
                    ? 'bg-green-500 shadow-green-200'
                    : 'bg-primary hover:bg-blue-700 shadow-blue-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <><Check className="h-5 w-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> Add {quantity > 1 ? `${quantity}x` : ''} to Cart — ₹{(product.price * quantity).toFixed(2)}</>
                )}
              </button>
            </div>

            {cartQty > 0 && (
              <p className="text-sm text-gray-500 text-center">
                You already have <span className="font-semibold text-primary">{cartQty}</span> of this item in your cart.{' '}
                <Link to="/cart" className="text-primary underline font-medium">View Cart</Link>
              </p>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More from {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(rel => (
                <motion.div
                  key={rel.id}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/products/${rel.id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition group"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary font-medium mb-1">{rel.category}</p>
                    <h3 className="font-semibold text-gray-900">{rel.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-900">₹{rel.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <Star className="h-3 w-3 fill-current" />
                        {rel.rating}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
