import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, LogOut, LayoutDashboard, ChevronDown, Package, Settings, Shield, Mic, MicOff, Search, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const dropdownRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // --- Voice Search ---
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice search not supported in this browser.');
      setTimeout(() => setVoiceError(''), 3000);
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setSearchQuery(transcript);
      if (e.results[0].isFinal) {
        setListening(false);
        navigate(`/products?q=${encodeURIComponent(transcript.trim())}`);
      }
    };
    recognition.onerror = (e) => {
      setListening(false);
      if (e.error !== 'aborted') {
        setVoiceError(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Could not hear you. Try again.');
        setTimeout(() => setVoiceError(''), 3000);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/login');
  };

  // Generate initials avatar from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              LocalLink
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block relative">
            <div className="relative">
              {/* Search icon (left) */}
              <button
                onClick={() => searchQuery.trim() && navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
              >
                <Search className="h-4 w-4" />
              </button>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={listening ? 'Listening... speak now' : 'Search products, stores...'}
                className={`w-full pl-9 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 transition ${
                  listening
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400 bg-red-50 placeholder-red-400'
                    : 'border-gray-300 focus:border-primary focus:ring-primary'
                }`}
              />

              {/* Mic button (right) */}
              <button
                onClick={startVoiceSearch}
                title={listening ? 'Stop listening' : 'Search by voice'}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
                  listening ? 'text-red-500' : 'text-gray-400 hover:text-primary'
                }`}
              >
                {listening ? (
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                    <Mic className="relative h-4 w-4 text-red-500" />
                  </span>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Voice error toast */}
            {voiceError && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl flex items-center gap-2 z-40 shadow">
                <MicOff className="h-3.5 w-3.5 flex-shrink-0" />
                {voiceError}
              </div>
            )}

            {/* Listening hint bar */}
            {listening && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-red-200 shadow-lg text-sm px-4 py-3 rounded-2xl flex items-center gap-3 z-40">
                <span className="relative flex h-4 w-4 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
                <span className="text-gray-700 font-medium">Listening... speak now</span>
                {searchQuery && <span className="text-primary font-semibold truncate ml-auto">"{searchQuery}"</span>}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-600 hover:text-primary transition font-medium hidden sm:block">Explore</Link>
            <Link
              to="/ai-insights"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Picks
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-primary transition relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile pill button */}
                <button
                  onClick={() => setShowProfile(prev => !prev)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition border-2 ${
                    showProfile
                      ? 'bg-primary text-white border-primary'
                      : 'bg-blue-50 text-primary border-blue-100 hover:border-primary'
                  }`}
                >
                  {/* Avatar circle with initials */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    showProfile ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}>
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:block">{user.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-br from-primary to-blue-400 p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold border-2 border-white/40 flex-shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-lg truncate">{user.name || 'User'}</p>
                          <p className="text-blue-100 text-sm truncate">{user.email || 'No email'}</p>
                          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            user.role === 'seller'
                              ? 'bg-amber-400/30 text-amber-100 border border-amber-300/30'
                              : 'bg-white/20 text-white border border-white/30'
                          }`}>
                            {user.role === 'admin' ? (
                              <><Shield className="h-3 w-3" /> Admin</>
                            ) : user.role === 'seller' ? (
                              <><Shield className="h-3 w-3" /> Seller</>
                            ) : (
                              <><User className="h-3 w-3" /> Buyer</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick links */}
                    <div className="p-2">
                      <Link
                        to="/track/12345"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition group"
                      >
                        <div className="w-9 h-9 bg-blue-50 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">My Orders</p>
                          <p className="text-xs text-gray-500">Track your deliveries</p>
                        </div>
                      </Link>

                      {user.role === 'seller' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setShowProfile(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition group"
                        >
                          <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                            <LayoutDashboard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Seller Dashboard</p>
                            <p className="text-xs text-gray-500">Manage your store</p>
                          </div>
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setShowProfile(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition group"
                        >
                          <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition">
                            <LayoutDashboard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Admin Dashboard</p>
                            <p className="text-xs text-gray-500">Platform overview</p>
                          </div>
                        </Link>
                      )}

                      <Link
                        to="/products"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition group"
                      >
                        <div className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition">
                          <Settings className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Account Settings</p>
                          <p className="text-xs text-gray-500">Preferences & security</p>
                        </div>
                      </Link>
                    </div>

                    {/* Logout footer */}
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition group"
                      >
                        <div className="w-9 h-9 bg-red-50 text-red-400 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">Sign Out</p>
                          <p className="text-xs text-red-400">See you next time!</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-full transition font-medium shadow-sm shadow-blue-500/30">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

