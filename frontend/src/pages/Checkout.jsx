import { useState } from 'react';
import { CreditCard, MapPin, Truck, CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

  const handlePlaceOrder = () => {
    setStep(3); // Success step
  };

  if (step === 3) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 mb-2">Your order <span className="font-bold text-gray-800">{orderId}</span> has been confirmed.</p>
          <p className="text-gray-400 text-sm mb-8">We'll start preparing your items right away.</p>

          <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4 mb-6 text-left">
            <Truck className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Estimated Delivery</p>
              <p className="text-primary font-bold">Today, 2:30 PM – 4:00 PM</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/track/12345')}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mb-3"
          >
            <Truck className="h-5 w-5" />
            Track My Order <ArrowRight className="h-5 w-5" />
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition text-sm"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-primary p-2 rounded-full"><MapPin className="h-5 w-5" /></div>
            <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-primary bg-blue-50 rounded-xl p-4 cursor-pointer relative">
              <div className="absolute top-4 right-4 h-4 w-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
              <h3 className="font-bold text-gray-900">Home</h3>
              <p className="text-gray-600 text-sm mt-1">123 Main Street, Apt 4B<br/>Downtown Area, City 10001</p>
            </div>
            <div className="border-2 border-gray-100 hover:border-gray-200 rounded-xl p-4 cursor-pointer transition">
              <h3 className="font-bold text-gray-900">Work</h3>
              <p className="text-gray-600 text-sm mt-1">456 Corporate Blvd, Suite 200<br/>Business District, City 10002</p>
            </div>
          </div>
          <button className="mt-4 text-primary font-medium text-sm hover:underline">+ Add new address</button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-primary p-2 rounded-full"><CreditCard className="h-5 w-5" /></div>
            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between border border-gray-200 p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" className="h-4 w-4 text-primary" defaultChecked />
                <span className="font-medium text-gray-900">Credit / Debit Card</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-blue-600 rounded"></div>
                <div className="w-8 h-5 bg-red-500 rounded"></div>
              </div>
            </label>
            <label className="flex items-center justify-between border border-gray-200 p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" className="h-4 w-4 text-primary" />
                <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
              </div>
            </label>
          </div>
        </div>

        <button 
          onClick={handlePlaceOrder}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
        >
          Place Order - $113.99
        </button>
      </div>
    </div>
  );
};

export default Checkout;
