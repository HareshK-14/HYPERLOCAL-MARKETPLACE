import { useState } from 'react';
import { Users, ShoppingBag, Store, DollarSign, Activity, TrendingUp, Shield, Download, ArrowLeft, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [view, setView] = useState('overview'); // 'overview' | 'users'
  const [isDownloading, setIsDownloading] = useState(false);

  const [stats] = useState([
    { title: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Active Sellers', value: '342', icon: Store, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Total Orders', value: '45,892', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Platform Revenue', value: '$1.2M', icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]);

  const recentActivity = [
    { id: 1, text: 'New seller "Local Fresh Bakery" registered.', time: '2 mins ago', type: 'seller' },
    { id: 2, text: 'Order #4829 from "Tech Hub" completed.', time: '15 mins ago', type: 'order' },
    { id: 3, text: 'New user registration: hareeshraj15@gmail.com.', time: '1 hour ago', type: 'user' },
    { id: 4, text: 'System update v2.1.4 deployed successfully.', time: '3 hours ago', type: 'system' },
  ];

  const dummyUsers = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'buyer', status: 'Active', joinDate: '2026-01-12' },
    { id: 2, name: 'Bob Johnson', email: 'bob.seller@example.com', role: 'seller', status: 'Active', joinDate: '2026-02-05' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'buyer', status: 'Suspended', joinDate: '2026-03-20' },
    { id: 4, name: 'Haresh Raj', email: 'hareeshraj15@gmail.com', role: 'admin', status: 'Active', joinDate: '2026-04-26' },
  ];

  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      // Simulate CSV creation
      const csvContent = "data:text/csv;charset=utf-8,Date,Total Users,Active Sellers,Total Orders,Revenue\n2026-04-26,12450,342,45892,1200000";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "locallink_admin_report_2026.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1500); // simulate network delay
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin {view === 'users' ? 'Users' : 'Overview'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {view === 'users' ? 'Manage user accounts and permissions.' : 'Monitor platform performance and manage users.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {view === 'users' ? (
              <button 
                onClick={() => setView('overview')}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? <Activity className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isDownloading ? 'Generating...' : 'Download Report'}
                </button>
                <button 
                  onClick={() => setView('users')}
                  className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-500/30"
                >
                  Manage Users
                </button>
              </>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Placeholder */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Revenue & Growth
                    </h2>
                    <select className="bg-gray-50 border-none text-sm font-medium text-gray-700 rounded-xl focus:ring-0">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="h-72 w-full bg-gradient-to-tr from-gray-50 to-blue-50/30 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                    <Activity className="h-10 w-10 text-blue-200 mb-2" />
                    <p className="text-sm text-gray-400 font-medium">Analytics integration required for live chart.</p>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-6">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 z-10">
                          {activity.type === 'seller' && <Store className="h-4 w-4 text-purple-500" />}
                          {activity.type === 'order' && <ShoppingBag className="h-4 w-4 text-green-500" />}
                          {activity.type === 'user' && <Users className="h-4 w-4 text-blue-500" />}
                          {activity.type === 'system' && <Activity className="h-4 w-4 text-amber-500" />}
                        </div>
                        {/* Timeline Line */}
                        <div className="absolute top-10 left-5 -ml-px h-full w-0.5 bg-gray-100 -z-0 hidden md:block"></div>
                        
                        <div className="pt-1">
                          <p className="text-sm font-medium text-gray-800 leading-snug">{activity.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2.5 bg-gray-50 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-100 transition">
                    View All Logs
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">User Management</h2>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 bg-white"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 font-semibold">User Info</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Joined</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dummyUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' :
                            u.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{u.joinDate}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-primary transition bg-gray-50 hover:bg-blue-50 rounded-lg">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 transition bg-gray-50 hover:bg-red-50 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center bg-gray-50/50">
                <span>Showing 4 of 12,450 users</span>
                <div className="flex gap-1">
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">Prev</button>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">Next</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
