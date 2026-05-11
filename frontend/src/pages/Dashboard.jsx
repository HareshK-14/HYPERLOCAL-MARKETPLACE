import { useState } from 'react';
import { Package, ShoppingBag, DollarSign, Users, Plus, Edit, Trash2, TrendingUp, AlertTriangle, BarChart2, Sparkles, Check, X } from 'lucide-react';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Premium Wireless Headphones', price: 99.99, stock: 15, sold: 42, category: 'Electronics', status: 'In Stock',    demand: 88 },
  { id: 2, name: 'Smart Watch Series 5',        price: 199.99, stock: 0,  sold: 31, category: 'Electronics', status: 'Out of Stock', demand: 95 },
  { id: 3, name: 'Organic Apples (1kg)',         price: 4.50,  stock: 50, sold: 75, category: 'Groceries',   status: 'In Stock',    demand: 72 },
  { id: 4, name: 'Vitamin C Tablets',            price: 12.99, stock: 8,  sold: 24, category: 'Pharmacy',    status: 'Low Stock',   demand: 86 },
  { id: 5, name: 'Running Sneakers',             price: 79.99, stock: 12, sold: 18, category: 'Clothing',    status: 'In Stock',    demand: 79 },
];

const EMPTY = { name: '', price: '', stock: '', category: 'Groceries' };

const Dashboard = () => {
  const [activeTab, setActiveTab]   = useState('overview');
  const [products, setProducts]     = useState(INITIAL_PRODUCTS);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [deleteId, setDeleteId]     = useState(null);

  const stats = [
    { label: 'Total Sales',  value: '₹12,450', icon: <DollarSign className="h-6 w-6 text-green-600" />,  bg: 'bg-green-100',  trend: '+12%' },
    { label: 'Orders',       value: '156',      icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,  bg: 'bg-blue-100',   trend: '+8%'  },
    { label: 'Products',     value: products.length, icon: <Package className="h-6 w-6 text-purple-600" />,bg: 'bg-purple-100', trend: '' },
    { label: 'Customers',    value: '89',       icon: <Users className="h-6 w-6 text-orange-600" />,      bg: 'bg-orange-100', trend: '+5%' },
  ];

  const lowStock  = products.filter(p => p.stock > 0 && p.stock < 10);
  const outStock  = products.filter(p => p.stock === 0);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ name: p.name, price: String(p.price), stock: String(p.stock), category: p.category }); setEditId(p.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.stock) return;
    const stock  = parseInt(form.stock);
    const status = stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';
    if (editId) {
      setProducts(ps => ps.map(p => p.id === editId ? { ...p, ...form, price: parseFloat(form.price), stock, status } : p));
    } else {
      setProducts(ps => [...ps, { id: Date.now(), ...form, price: parseFloat(form.price), stock, status, sold: 0, demand: 65 }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => { setProducts(ps => ps.filter(p => p.id !== id)); setDeleteId(null); };

  const tabs = [
    { id: 'overview',   label: 'Overview'   },
    { id: 'inventory',  label: 'Inventory'  },
    { id: 'ai',         label: '✨ AI Demand' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-full">

        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4 hidden md:flex flex-col gap-1">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Seller Menu</h2>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${activeTab === t.id ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {t.id === 'overview' && <ShoppingBag className="h-4 w-4" />}
              {t.id === 'inventory' && <Package className="h-4 w-4" />}
              {t.id === 'ai' && <Sparkles className="h-4 w-4" />}
              {t.label}
            </button>
          ))}

          {/* Alerts */}
          {(lowStock.length > 0 || outStock.length > 0) && (
            <div className="mt-auto">
              {outStock.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {outStock.length} out of stock
                </div>
              )}
              {lowStock.length > 0 && (
                <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {lowStock.length} low stock
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className={`${s.bg} p-3 rounded-xl`}>{s.icon}</div>
                    <div>
                      <p className="text-gray-500 text-sm">{s.label}</p>
                      <h3 className="text-xl font-bold text-gray-900">{s.value}</h3>
                      {s.trend && <span className="text-xs text-green-600 font-semibold">{s.trend} this week</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 text-left">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { id: '#ORD-156', name: 'Haresh K.',  amt: '₹113.99', status: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
                        { id: '#ORD-155', name: 'Priya M.',   amt: '₹45.50',  status: 'Delivered',  color: 'bg-green-100 text-green-700'  },
                        { id: '#ORD-154', name: 'Arjun S.',   amt: '₹89.00',  status: 'Shipped',    color: 'bg-blue-100 text-blue-700'    },
                      ].map(o => (
                        <tr key={o.id}>
                          <td className="py-3 font-semibold text-gray-900">{o.id}</td>
                          <td className="py-3 text-gray-600">{o.name}</td>
                          <td className="py-3 font-semibold">{o.amt}</td>
                          <td className="py-3"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${o.color}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Inventory ── */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-900">Inventory Management</h3>
                <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm text-sm">
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                  <h4 className="font-bold text-gray-900 mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 font-medium">Product Name</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Organic Apples" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Price (₹)</label>
                      <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Stock (units)</label>
                      <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Category</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        {['Groceries', 'Electronics', 'Clothing', 'Pharmacy', 'Bakery'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSave} className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                      <Check className="h-4 w-4" /> {editId ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="border border-gray-200 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="py-3 px-5 text-left">Product</th>
                      <th className="py-3 px-5 text-left">Category</th>
                      <th className="py-3 px-5 text-right">Price</th>
                      <th className="py-3 px-5 text-right">Stock</th>
                      <th className="py-3 px-5 text-right">Sold</th>
                      <th className="py-3 px-5 text-left">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="py-3 px-5 font-semibold text-gray-900">{p.name}</td>
                        <td className="py-3 px-5 text-gray-500">{p.category}</td>
                        <td className="py-3 px-5 text-right font-semibold">₹{p.price}</td>
                        <td className="py-3 px-5 text-right">
                          <span className={`font-bold ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-gray-900'}`}>{p.stock}</span>
                        </td>
                        <td className="py-3 px-5 text-right text-gray-500">{p.sold}</td>
                        <td className="py-3 px-5">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>{p.status}</span>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Delete confirm */}
              {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <h3 className="font-bold text-gray-900 mb-2">Delete Product?</h3>
                    <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition text-sm">Delete</button>
                      <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 py-2 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AI Demand ── */}
          {activeTab === 'ai' && (
            <div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-xl font-bold">AI Demand Predictions</h3>
                </div>
                <p className="text-purple-100 text-sm">Based on sales velocity, trends, and market data — know what to restock before it runs out.</p>
              </div>

              <div className="space-y-4">
                {products.sort((a, b) => b.demand - a.demand).map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{p.name}</h3>
                          {p.demand >= 85 && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> High Demand</span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{p.category} · {p.stock} units remaining · {p.sold} sold</p>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>AI Demand Score</span>
                            <span className="font-bold text-gray-900">{p.demand}/100</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${p.demand >= 85 ? 'bg-red-500' : p.demand >= 70 ? 'bg-amber-400' : 'bg-green-400'}`}
                              style={{ width: `${p.demand}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-xs mt-2 font-medium">
                          {p.demand >= 85
                            ? <span className="text-red-500">⚠ Restock urgently — predicted to sell out within 2 days</span>
                            : p.demand >= 70
                            ? <span className="text-amber-600">📈 Moderate demand — consider restocking this week</span>
                            : <span className="text-green-600">✅ Stock levels healthy — no action needed</span>}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-lg">₹{p.price}</p>
                        <button className="mt-2 text-xs bg-primary text-white px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 transition">
                          + Restock
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
