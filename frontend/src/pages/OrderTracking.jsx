import { useState, useEffect } from 'react';
import { MapPin, Package, CheckCircle, Truck, Phone, ArrowLeft, Clock, Star, MessageSquare, Copy, Check } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const STEPS = [
  { id: 0, label: 'Order Placed',      desc: 'Your order has been received by the store.', icon: CheckCircle, time: '12:00 PM', done: true  },
  { id: 1, label: 'Confirmed',          desc: 'Store confirmed and is preparing your order.', icon: CheckCircle, time: '12:05 PM', done: true  },
  { id: 2, label: 'Packed & Ready',    desc: 'Your items are packed and ready for pickup.',  icon: Package,     time: '12:15 PM', done: true  },
  { id: 3, label: 'Out for Delivery',  desc: 'Agent is on the way to your address.',          icon: Truck,       time: '12:30 PM', done: true, active: true },
  { id: 4, label: 'Delivered',         desc: 'Package delivered to your doorstep.',           icon: MapPin,      time: 'ETA 14:30', done: false },
];

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId  = id || 'LL-12345';

  const [copied, setCopied]       = useState(false);
  const [eta, setEta]             = useState(300);   // seconds countdown
  const [rating, setRating]       = useState(0);
  const [hoverRating, setHover]   = useState(0);
  const [rated, setRated]         = useState(false);

  // Live countdown
  useEffect(() => {
    if (eta <= 0) return;
    const t = setTimeout(() => setEta(e => e - 1), 1000);
    return () => clearTimeout(t);
  }, [eta]);

  const formatEta = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Header card */}
        <div className="bg-gradient-to-r from-primary to-blue-500 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Order ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <h1 className="text-2xl font-extrabold">#{orderId}</h1>
                  <button onClick={copyOrderId} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <span className="bg-white text-primary px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 flex-shrink-0">
                <Truck className="h-4 w-4" /> Out for Delivery
              </span>
            </div>

            {/* Live ETA */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-blue-100 text-xs">Live ETA</p>
                <p className="text-white font-bold text-lg flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {eta > 0 ? formatEta(eta) + ' min' : 'Arriving now!'}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-blue-100 text-xs">Store</p>
                <p className="text-white font-bold text-sm">Green Grocery</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-blue-100 text-xs">Agent</p>
                <p className="text-white font-bold text-sm">John D. ⭐4.9</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Timeline ──────────────────────────── */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-bold text-gray-900 text-lg mb-6">Live Order Timeline</h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

              <div className="space-y-0">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === STEPS.length - 1;
                  return (
                    <div key={step.id} className="relative flex gap-4">
                      {/* Node */}
                      <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow transition ${
                        step.active
                          ? 'bg-primary text-white shadow-blue-500/40 shadow-lg animate-pulse'
                          : step.done
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className={`pb-8 flex-1 ${isLast ? 'pb-0' : ''}`}>
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold ${step.active ? 'text-primary' : step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                            {step.active && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
                          </h3>
                          <span className="text-xs text-gray-400">{step.time}</span>
                        </div>
                        <p className={`text-sm mt-0.5 ${step.done || step.active ? 'text-gray-500' : 'text-gray-300'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rate delivery */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Rate your experience</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => { if (!rated) { setRating(s); setRated(true); } }}
                    onMouseEnter={() => !rated && setHover(s)}
                    onMouseLeave={() => !rated && setHover(0)}
                    className="transition"
                  >
                    <Star className={`h-7 w-7 transition ${
                      s <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                    }`} />
                  </button>
                ))}
                {rated && <span className="ml-2 text-sm text-green-600 font-medium self-center">Thanks for your feedback! 🎉</span>}
              </div>
            </div>
          </div>

          {/* ── Right Panel ───────────────────────── */}
          <div className="w-full lg:w-80 space-y-5">

            {/* Simulated Map */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-52 bg-blue-50">
                {/* Grid background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />
                {/* Road lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-blue-200 opacity-50" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full bg-blue-200 opacity-50" />
                </div>
                {/* Delivery agent dot */}
                <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
                      <Truck className="h-3 w-3 text-white" />
                    </span>
                  </span>
                </div>
                {/* Destination */}
                <div className="absolute bottom-4 left-1/4 transform -translate-x-1/2">
                  <MapPin className="h-6 w-6 text-red-500 fill-red-100" />
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold text-primary flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  {eta > 0 ? `${Math.floor(eta / 60)} mins away` : 'Arrived!'}
                </div>
              </div>
            </div>

            {/* Delivery Agent */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Delivery Agent</p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80"
                  alt="Agent"
                  className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-500">Delivery Agent</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">4.9</span>
                    <span className="text-xs text-gray-400">(1,234 deliveries)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-green-100 text-green-600 p-2.5 rounded-xl hover:bg-green-200 transition">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="bg-blue-100 text-primary p-2.5 rounded-xl hover:bg-blue-200 transition">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Order Summary</p>
              {[
                { name: 'Organic Apples', qty: 2, price: 7.98 },
                { name: 'Fresh Milk 1L', qty: 1, price: 2.49 },
                { name: 'Brown Eggs (12)', qty: 1, price: 3.29 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700">{item.name} × {item.qty}</span>
                  <span className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 pt-3 mt-1 border-t border-gray-100">
                <span>Total</span>
                <span>₹13.76</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
