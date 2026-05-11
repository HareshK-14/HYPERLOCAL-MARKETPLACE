import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const total = cartTotal + deliveryFee;

  return (
    <div className="bg-gray-50 min-h-[80vh] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items from the products page!</p>
            <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {cartItems.map(item => (
                    <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 group">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-gray-500 text-sm">{item.storeName}</p>
                        <p className="text-primary font-bold mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-primary transition p-1"><Minus className="h-4 w-4" /></button>
                          <span className="font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-primary transition p-1"><Plus className="h-4 w-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-96">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-semibold text-gray-900">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;


