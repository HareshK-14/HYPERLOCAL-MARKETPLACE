import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Loader2, Navigation, Sparkles, TrendingUp, Zap, Star, ShoppingCart, MessageSquare, Package, Brain } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation2 } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { allProducts } from '../data/products';

const stores = [
  { id: 1, name: 'Green Grocery',  category: 'Groceries & Essentials', rating: '4.8', distance: '0.8 km', deliveryTime: '10-15 min', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80', lat: 0.008, lng: 0.005 },
  { id: 2, name: 'TechZone',       category: 'Electronics & Gadgets',   rating: '4.6', distance: '1.2 km', deliveryTime: '20-30 min', image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=500&q=80', lat: 0.012, lng: 0.009 },
  { id: 3, name: 'Fashion Hub',    category: 'Clothing & Accessories',  rating: '4.5', distance: '0.5 km', deliveryTime: '15-20 min', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&q=80', lat: 0.005, lng: 0.003 },
  { id: 4, name: 'Fresh Bakery',   category: 'Bakery & Sweets',         rating: '4.9', distance: '0.3 km', deliveryTime: '5-10 min',  image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', lat: 0.003, lng: 0.002 },
  { id: 5, name: 'PharmaCare',     category: 'Pharmacy & Health',       rating: '4.7', distance: '1.5 km', deliveryTime: '25-35 min', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80', lat: 0.015, lng: 0.010 },
  { id: 6, name: 'BookNest',       category: 'Books & Stationery',      rating: '4.4', distance: '2.0 km', deliveryTime: '30-40 min', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80', lat: 0.020, lng: 0.014 },
];

// Personalized recommendations: top-rated + trending
const recommended = [...allProducts]
  .sort((a, b) => (b.rating * 10 + b.demandTrend) - (a.rating * 10 + a.demandTrend))
  .slice(0, 4);

const trending = [...allProducts]
  .sort((a, b) => b.salesVelocity - a.salesVelocity)
  .slice(0, 8);

const Home = () => {
  const navigate = useNavigate();
  const { area, status, detect, location } = useLocation2();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [addressInput, setAddressInput] = useState('');
  const [nearbyStores, setNearbyStores] = useState(stores);

  // Sort stores by simulated distance from user location
  useEffect(() => {
    if (location) {
      // Stores within 2km (simulated — all stores qualify, sorted by their relative distance)
      const sorted = [...stores].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setNearbyStores(sorted);
      setAddressInput(area);
    }
  }, [location, area]);

  // Feature cards
  const features = [
    { icon: <Brain className="h-6 w-6 text-purple-500" />, bg: 'bg-purple-50', title: 'AI Recommendations', desc: 'Personalised picks based on what\'s trending near you.', to: '/ai-insights' },
    { icon: <Navigation className="h-6 w-6 text-blue-500" />,   bg: 'bg-blue-50',   title: 'Location-Based',     desc: 'Automatically shows stores & products within your area.',   to: '/products' },
    { icon: <TrendingUp className="h-6 w-6 text-green-500" />,  bg: 'bg-green-50',  title: 'Demand Prediction',  desc: 'Know what\'s about to go viral before it sells out.',           to: '/ai-insights' },
    { icon: <Package className="h-6 w-6 text-orange-500" />,    bg: 'bg-orange-50', title: 'Order Tracking',     desc: 'Real-time tracking from store to your door.',                   to: '/track/12345' },
    { icon: <MessageSquare className="h-6 w-6 text-teal-500" />,bg: 'bg-teal-50',   title: 'Buyer ↔ Seller Chat',desc: 'Chat directly with store owners instantly.',                     to: '/' },
    { icon: <Zap className="h-6 w-6 text-amber-500" />,         bg: 'bg-amber-50',  title: 'Fast Delivery',     desc: 'Most stores deliver within 10-30 mins.',                        to: '/products' },
  ];

  return (
    <div className="bg-gray-50 pb-20">

      {/* ── Hero ─────────────────────────────────── */}
      <div className="bg-white border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white z-0" />
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-4 w-4" /> AI-Powered Hyperlocal Marketplace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5"
            >
              {user ? `Welcome back, ${user.name?.split(' ')[0]}! 👋` : 'Everything you need,'}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">delivered locally.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 mb-8">
              Discover local stores, fresh groceries, and electronics. AI-personalised recommendations, real-time demand intelligence, and instant delivery.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={addressInput}
                  onChange={e => setAddressInput(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                  placeholder="Enter your delivery address"
                />
              </div>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                Find Stores <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Location status pill */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 flex items-center gap-2">
              {status === 'detecting' && (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" /> Detecting your location...
                </span>
              )}
              {status === 'granted' && (
                <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  <Navigation className="h-4 w-4" /> {area} — showing nearby stores
                </span>
              )}
              {status === 'denied' && (
                <button onClick={detect} className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-full hover:bg-amber-100 transition">
                  <MapPin className="h-4 w-4" /> Allow location for nearby stores
                </button>
              )}
              {status === 'idle' && (
                <button onClick={detect} className="flex items-center gap-2 text-sm text-primary font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition">
                  <Navigation className="h-4 w-4" /> Detect my location
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ── Feature Highlights ────────────────── */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why LocalLink?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((f, i) => (
              <Link key={i} to={f.to} className={`${f.bg} rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition border border-transparent hover:border-gray-200 group`}>
                <div>{f.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Stores Near You ───────────────────── */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">Stores Near You</h2>
                {status === 'granted' && (
                  <span className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-600 px-2.5 py-0.5 rounded-full">
                    <Navigation className="h-3 w-3" /> Live Location
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {status === 'granted' ? `Shops within 5km of ${area}` : 'Discover shops in your community'}
              </p>
            </div>
            <Link to="/products" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>

        {/* ── Personalised Recommendations ──────── */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user ? `Picked for You, ${user.name?.split(' ')[0]}` : 'AI Recommendations'}
                </h2>
                <span className="flex items-center gap-1 text-xs font-semibold bg-purple-100 text-purple-600 px-2.5 py-0.5 rounded-full">
                  <Brain className="h-3 w-3" /> AI Powered
                </span>
              </div>
              <p className="text-gray-500 text-sm">Top-rated products personalised based on demand & ratings</p>
            </div>
            <Link to="/ai-insights" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm">
              AI Insights <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {recommended.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> For You
                  </span>
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 text-amber-500 text-xs px-2 py-0.5 rounded-full font-semibold">
                    <Star className="h-3 w-3 fill-amber-400" />{p.rating}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400">{p.storeName} · {p.storeDistance}</p>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">₹{p.price}</span>
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />+{p.demandTrend}%
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="mt-2 w-full flex items-center justify-center gap-1 bg-primary text-white text-xs font-semibold py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Trending Products ─────────────────── */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🔥 Selling Fast Near You
              </h2>
              <p className="text-gray-500 text-sm">Most bought items in your area right now</p>
            </div>
            <Link to="/products" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm">
              All products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trending.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* ── Order Tracking CTA ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <Package className="h-10 w-10 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Track Your Order</h3>
            <p className="text-blue-100 text-sm mb-5">Real-time live tracking from store to your doorstep. Know exactly where your delivery is.</p>
            <Link to="/track/12345" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition">
              Track Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <Brain className="h-10 w-10 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">AI Demand Insights</h3>
            <p className="text-purple-100 text-sm mb-5">Know what's selling fast, what's rising in demand, and what will be the next big thing.</p>
            <Link to="/ai-insights" className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-purple-50 transition">
              Explore AI Picks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
