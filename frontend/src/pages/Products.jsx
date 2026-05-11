import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, Store, X, ArrowLeft, SlidersHorizontal, Check, Search } from 'lucide-react';
import { allProducts } from '../data/products';
import { useSearchParams, Link } from 'react-router-dom';

const categories = ['All', 'Groceries', 'Electronics', 'Clothing', 'Pharmacy'];

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Highest Rated' },
  { value: 'distance',    label: 'Nearest First' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxDistance, setMaxDistance] = useState(20);
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const sortRef = useRef(null);

  const storeFilter = searchParams.get('store') || '';
  const searchQuery = searchParams.get('q') || '';

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const clearStoreFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('store');
    setSearchParams(params);
  };

  const handleCategoryChange = (c) => {
    setActiveCategory(c);
    const params = new URLSearchParams(searchParams);
    if (c === 'All') params.delete('category');
    else params.set('category', c);
    setSearchParams(params);
  };

  const clearAll = () => {
    clearStoreFilter();
    handleCategoryChange('All');
    setMaxDistance(20);
    setSortBy('recommended');
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    setSearchParams(params);
  };

  // Apply filters: store + category + distance + text search
  let filtered = allProducts;
  if (storeFilter) {
    filtered = filtered.filter(p =>
      p.storeName.toLowerCase() === storeFilter.toLowerCase()
    );
  }
  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }
  filtered = filtered.filter(p => {
    const km = parseFloat(p.storeDistance);
    return !isNaN(km) && km <= maxDistance;
  });
  // Text search — match name, category, store, tags, description
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.storeName.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  // --- Sorting ---
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':  return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating':     return b.rating - a.rating;
      case 'distance':   return parseFloat(a.storeDistance) - parseFloat(b.storeDistance);
      default:           return 0;
    }
  });

  const activeSort = sortOptions.find(o => o.value === sortBy);
  const activeFiltersCount = [
    activeCategory !== 'All',
    maxDistance < 20,
    !!storeFilter,
    !!searchQuery,
  ].filter(Boolean).length;

  // Shared filter panel content (used in both sidebar and drawer)
  const FilterContent = ({ onClose }) => (
    <div>
      {onClose && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" /> Filters
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-1">
        {categories.map((c) => (
          <li key={c}>
            <button
              onClick={() => { handleCategoryChange(c); onClose?.(); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                activeCategory === c
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {c}
              {activeCategory === c && <Check className="h-4 w-4" />}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-7 mb-3">
        <h3 className="font-bold text-gray-900">Distance</h3>
        <span className="text-sm font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full">
          ≤ {maxDistance} km
        </span>
      </div>
      <input
        type="range"
        className="w-full accent-primary cursor-pointer"
        min="1" max="20" step="0.5"
        value={maxDistance}
        onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1 km</span>
        <span>20 km</span>
      </div>

      {storeFilter && (
        <div className="mt-6 pt-5 border-t">
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All Stores
          </Link>
        </div>
      )}

      {activeFiltersCount > 0 && (
        <button
          onClick={() => { clearAll(); onClose?.(); }}
          className="mt-6 w-full text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 rounded-xl py-2 transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search query banner */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-2xl px-5 py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white p-2 rounded-xl">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-purple-500 font-medium uppercase tracking-wide">Search results for</p>
                <h2 className="text-lg font-bold text-gray-900">"{searchQuery}"</h2>
              </div>
            </div>
            <button
              onClick={() => { const p = new URLSearchParams(searchParams); p.delete('q'); setSearchParams(p); }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition font-medium"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          </div>
        )}

        {/* Store banner */}
        {storeFilter && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-2 rounded-xl">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Browsing store</p>
                <h2 className="text-lg font-bold text-gray-900">{storeFilter}</h2>
              </div>
            </div>
            <button
              onClick={clearStoreFilter}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition font-medium"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : storeFilter ? storeFilter : 'Explore Products'}
            </h1>
            <p className="text-gray-500">
              {searchQuery
                ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`
                : storeFilter
                ? `Products available from ${storeFilter}`
                : 'Find what you need from nearby stores'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filters button — opens drawer on mobile */}
            <button
              onClick={() => setShowFilterDrawer(true)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
                activeFiltersCount > 0
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-white text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortMenu(prev => !prev)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  showSortMenu
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                Sort: {activeSort?.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition ${
                        sortBy === opt.value
                          ? 'text-primary font-semibold bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                      {sortBy === opt.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <div className="w-56 hidden lg:block flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <FilterContent />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile category tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 lg:hidden">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activeCategory === c
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-300 text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              {maxDistance < 20 && <span className="ml-1 text-primary font-medium">within {maxDistance} km</span>}
              {sortBy !== 'recommended' && (
                <span className="ml-2 text-gray-400">• sorted by <span className="text-gray-600 font-medium">{activeSort?.label}</span></span>
              )}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Store className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? `No products match "${searchQuery}". Try a different word.`
                    : storeFilter
                    ? `"${storeFilter}" doesn't have products in this category or distance.`
                    : `No products found within ${maxDistance} km. Try increasing the distance.`}
                </p>
                <button
                  onClick={clearAll}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilterDrawer(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <FilterContent onClose={() => setShowFilterDrawer(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

