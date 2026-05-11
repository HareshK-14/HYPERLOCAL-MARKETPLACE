import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, TrendingUp, Sparkles, Brain, Eye, ShoppingCart,
  ArrowUpRight, AlertTriangle, Star, Activity, BarChart2,
  Clock, ChevronRight, RefreshCw, Heart, ThumbsUp, BadgePercent,
} from 'lucide-react';
import { allProducts } from '../data/products';
import { useCart } from '../context/CartContext';

// ── AI Scoring ──────────────────────────────────────────────────────────────
const withScores = allProducts.map((p) => {
  const vel  = Math.min(100, (p.salesVelocity / 80)   * 100);
  const trd  = Math.min(100, (p.demandTrend   / 70)   * 100);
  const viw  = Math.min(100, (p.weeklyViews   / 3500) * 100);
  const rat  = (p.rating / 5) * 100;
  return {
    ...p,
    hotScore:   Math.round(vel * 0.5 + rat * 0.3 + trd * 0.2),
    riseScore:  Math.round(trd * 0.5 + viw * 0.3 + vel * 0.2),
    dealScore:  Math.round(rat * 0.5 + (100 - Math.min(100, p.price)) * 0.3 + vel * 0.2),
  };
});

const top5 = (arr, key) => [...arr].sort((a, b) => b[key] - a[key]).slice(0, 5);

const LISTS = {
  hot:    top5(withScores, 'hotScore'),
  rising: top5(withScores, 'riseScore'),
  future: top5(withScores, 'futureScore'),
  deals:  top5(withScores, 'dealScore'),
};

const TAB_META = {
  hot:    { label: 'Selling Fast',    emoji: '🔥', accent: 'orange', scoreKey: 'hotScore',    scoreLabel: 'Hot Score',     buyerTip: 'Buy before it sells out!' },
  rising: { label: 'Rising Demand',  emoji: '📈', accent: 'green',  scoreKey: 'riseScore',   scoreLabel: 'Demand Score',  buyerTip: 'Trending — get it early at today\'s price.' },
  future: { label: 'Future Picks',   emoji: '🔮', accent: 'purple', scoreKey: 'futureScore', scoreLabel: 'Future Score',  buyerTip: 'AI predicts high demand in the next 30–90 days.' },
  deals:  { label: 'Best for You',   emoji: '💎', accent: 'blue',   scoreKey: 'dealScore',   scoreLabel: 'Value Score',   buyerTip: 'Top-rated products offering the best value.' },
};

const ACCENT_CLASSES = {
  orange: { bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-600', tab: 'bg-orange-500' },
  green:  { bar: 'bg-green-500',  badge: 'bg-green-100 text-green-600',   tab: 'bg-green-500'  },
  purple: { bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-600', tab: 'bg-purple-500' },
  blue:   { bar: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-600',     tab: 'bg-blue-500'   },
};

// ── Components ──────────────────────────────────────────────────────────────
const ScoreBar = ({ value, barClass }) => (
  <div className="w-full bg-gray-100 rounded-full h-1.5">
    <div className={`h-1.5 rounded-full ${barClass}`} style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const ProductCard = ({ product, rank, tabId }) => {
  const { addToCart } = useCart();
  const meta   = TAB_META[tabId];
  const accent = ACCENT_CLASSES[meta.accent];
  const score  = product[meta.scoreKey];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">
      <div className="relative flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs font-bold">
          #{rank}
        </div>
        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>
          {meta.emoji} {meta.label}
        </span>
        {product.restockAlert && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Low Stock
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 truncate">{product.storeName} · {product.storeDistance}</p>
        <h3 className="font-bold text-gray-900 mt-0.5 truncate">{product.name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-600">{product.rating} ({product.reviews} reviews)</span>
          <span className="ml-auto font-bold text-gray-900">₹{product.price}</span>
        </div>

        {/* AI Score bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{meta.scoreLabel}</span>
            <span className="font-bold text-gray-800">{score}/100</span>
          </div>
          <ScoreBar value={score} barClass={accent.bar} />
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-2 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{product.salesVelocity}/day</span>
          <span className="flex items-center gap-1 text-green-600 font-semibold"><TrendingUp className="h-3 w-3" />+{product.demandTrend}%</span>
          <span className="flex items-center gap-1 ml-auto"><Eye className="h-3 w-3" />{product.weeklyViews.toLocaleString()}</span>
        </div>

        {/* Buyer tip */}
        <p className="text-xs text-indigo-500 font-medium mt-2 italic">{meta.buyerTip}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3 mt-auto pt-3">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const AIInsights = () => {
  const [activeTab, setActiveTab]   = useState('hot');
  const [lastUpdated]               = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart } = useCart();


  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const products   = LISTS[activeTab] || [];
  const meta       = TAB_META[activeTab];
  const accent     = ACCENT_CLASSES[meta?.accent || 'blue'];

  const totalViews = allProducts.reduce((s, p) => s + p.weeklyViews, 0);
  const avgTrend   = Math.round(allProducts.reduce((s, p) => s + p.demandTrend, 0) / allProducts.length);
  const topSeller  = withScores.reduce((a, b) => b.hotScore > a.hotScore ? b : a);
  const topFuture  = withScores.reduce((a, b) => b.futureScore > a.futureScore ? b : a);
  const restockAlerts = allProducts.filter(p => p.restockAlert);

  const TABS = [
    { id: 'hot',    label: 'Selling Fast',   emoji: '🔥' },
    { id: 'rising', label: 'Rising Demand',  emoji: '📈' },
    { id: 'future', label: 'Future Picks',   emoji: '🔮' },
    { id: 'deals',  label: 'Best for You',   emoji: '💎' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* ── Hero ────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 pt-10 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AI Insights Engine</h1>
                <p className="text-indigo-200 text-sm mt-1">Smart product recommendations powered by real-time demand intelligence</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex-shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Buyer message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 mb-6 flex items-start gap-3 border border-white/20">
            <ThumbsUp className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            <p className="text-white text-sm">
              <strong>For buyers like you:</strong> Our AI scans <strong>sales velocity</strong>, <strong>demand trends</strong>, <strong>weekly views</strong>, and <strong>ratings</strong>
              — so you always know what to buy, what's trending, and what will be in demand before others know it.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Weekly Views',    value: totalViews.toLocaleString(), icon: <Eye className="h-4 w-4" /> },
              { label: 'Avg. Demand Rise', value: `+${avgTrend}%`,            icon: <TrendingUp className="h-4 w-4" /> },
              { label: 'Top Seller Today', value: topSeller.name.split(' ').slice(0, 2).join(' '), icon: <Zap className="h-4 w-4" /> },
              { label: 'Best Future Pick', value: topFuture.name.split(' ').slice(0, 2).join(' '), icon: <Sparkles className="h-4 w-4" /> },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-1.5 text-indigo-200 text-xs mb-1">{s.icon} {s.label}</div>
                <p className="text-white font-bold text-lg leading-tight">{s.value}</p>
              </div>
            ))}
          </div>

          <p className="text-indigo-300 text-xs mt-4 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* ── Tabs (sticky, overlapping hero bottom) ─── */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 mt-8">

        {/* Active tab header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              {meta.emoji} {meta.label}
              <span className="text-sm bg-primary text-white px-2.5 py-0.5 rounded-full font-semibold">Top 5</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">{meta.buyerTip}</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
            Browse all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} rank={i + 1} tabId={activeTab} />
          ))}
        </div>

        {/* ── Detailed Table ─────────────────────────── */}
        <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-gray-900">AI Ranking Details — {meta.label}</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-5 text-left">Rank</th>
                  <th className="py-3 px-5 text-left">Product</th>
                  <th className="py-3 px-5 text-left">Category</th>
                  <th className="py-3 px-5 text-right">Sales/Day</th>
                  <th className="py-3 px-5 text-right">Demand Trend</th>
                  <th className="py-3 px-5 text-right">Views/Week</th>
                  <th className="py-3 px-5 text-right">AI Score</th>
                  <th className="py-3 px-5 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p, i) => {
                  const score = p[meta.scoreKey];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition group">
                      <td className="py-3 px-5">
                        <span className="font-bold text-gray-400">#{i + 1}</span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.storeName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className="bg-blue-50 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium">{p.category}</span>
                      </td>
                      <td className="py-3 px-5 text-right font-semibold text-gray-900">{p.salesVelocity}</td>
                      <td className="py-3 px-5 text-right">
                        <span className="flex items-center justify-end gap-1 text-green-600 font-semibold text-xs">
                          <ArrowUpRight className="h-3.5 w-3.5" />+{p.demandTrend}%
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right text-gray-600">{p.weeklyViews.toLocaleString()}</td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${accent.bar}`} style={{ width: `${score}%` }} />
                          </div>
                          <span className="font-bold text-gray-900 w-7 text-right">{score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right font-bold text-gray-900">₹{p.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Restock Alerts ─────────────────────────── */}
        {restockAlerts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Buy Now — Running Low
              <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">{restockAlerts.length} items</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {restockAlerts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm p-4 flex gap-4 items-center">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">⚠ Low Stock</span>
                    </div>
                    <p className="text-sm text-gray-500">{p.storeName}</p>
                    <div className="flex gap-3 mt-1 text-xs flex-wrap">
                      <span className="flex items-center gap-1 text-gray-500"><Activity className="h-3 w-3" />{p.salesVelocity}/day</span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold"><TrendingUp className="h-3 w-3" />+{p.demandTrend}%</span>
                      <span className="flex items-center gap-1 text-purple-500 font-semibold"><Sparkles className="h-3 w-3" />Future: {p.futureScore}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-lg">₹{p.price}</p>
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-1 flex items-center gap-1 text-xs text-white bg-primary px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── How it works ─────────────────────────── */}
        <div className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-3">
          <Brain className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-800 space-y-1">
            <p><strong>🔥 Selling Fast</strong> — sales velocity × 0.5 + rating × 0.3 + trend × 0.2</p>
            <p><strong>📈 Rising Demand</strong> — demand trend × 0.5 + weekly views × 0.3 + velocity × 0.2</p>
            <p><strong>🔮 Future Picks</strong> — AI-predicted demand index for the next 30–90 days</p>
            <p><strong>💎 Best for You</strong> — rating × 0.5 + value score × 0.3 + velocity × 0.2</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIInsights;
