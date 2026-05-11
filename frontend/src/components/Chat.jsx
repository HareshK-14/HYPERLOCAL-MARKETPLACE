import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ChevronDown, Store, User, Bot, Phone, Video, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const STORES = [
  { id: 1, name: 'Green Grocery',  avatar: '🛒', status: 'online',  category: 'Groceries' },
  { id: 2, name: 'TechZone',       avatar: '💻', status: 'online',  category: 'Electronics' },
  { id: 3, name: 'Fashion Hub',    avatar: '👗', status: 'away',    category: 'Clothing' },
  { id: 4, name: 'Fresh Bakery',   avatar: '🥖', status: 'online',  category: 'Bakery' },
  { id: 5, name: 'PharmaCare',     avatar: '💊', status: 'offline', category: 'Pharmacy' },
];

const SMART_REPLIES = {
  default: [
    "Is this item available today?",
    "What's the delivery time?",
    "Do you have any discounts?",
  ],
  greeting: [
    "I need help with my order.",
    "Do you have this item in stock?",
    "What are your opening hours?",
  ],
};

const AI_RESPONSES = [
  "Hi! Thanks for reaching out. How can I help you today? 😊",
  "Great question! Let me check that for you right away.",
  "Yes, we have it in stock! Would you like to place an order?",
  "Our delivery usually takes 15–30 minutes to your location.",
  "We currently have a 10% discount on orders above ₹500!",
  "I'll pass your query to our team. You'll hear back shortly.",
  "Thanks for your patience! Is there anything else I can help with?",
];

let replyIdx = 0;
const getNextReply = () => {
  const r = AI_RESPONSES[replyIdx % AI_RESPONSES.length];
  replyIdx++;
  return r;
};

const StatusDot = ({ status }) => {
  const colors = { online: 'bg-green-400', away: 'bg-amber-400', offline: 'bg-gray-300' };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors[status]}`} />;
};

const Chat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen]           = useState(false);
  const [view, setView]               = useState('list');   // 'list' | 'chat'
  const [selectedStore, setSelected]  = useState(null);
  const [chats, setChats]             = useState({});       // storeId → messages[]
  const [input, setInput]             = useState('');
  const [typing, setTyping]           = useState(false);
  const [unread, setUnread]           = useState({});       // storeId → count
  const messagesEndRef                = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { if (view === 'chat') scrollToBottom(); }, [chats, view]);

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  const openStore = (store) => {
    setSelected(store);
    setView('chat');
    // Clear unread
    setUnread(u => ({ ...u, [store.id]: 0 }));
    // Init conversation if none
    if (!chats[store.id]) {
      setChats(c => ({
        ...c,
        [store.id]: [
          { id: 1, text: `Hi! Welcome to ${store.name}. How can I help you?`, sender: 'seller', time: new Date() },
        ],
      }));
    }
  };

  const sendMessage = (text) => {
    if (!text.trim() || !selectedStore) return;
    const msg = { id: Date.now(), text, sender: 'buyer', time: new Date() };
    setChats(c => ({ ...c, [selectedStore.id]: [...(c[selectedStore.id] || []), msg] }));
    setInput('');

    // Simulate seller typing
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = { id: Date.now() + 1, text: getNextReply(), sender: 'seller', time: new Date() };
      setChats(c => ({ ...c, [selectedStore.id]: [...(c[selectedStore.id] || []), reply] }));
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const currentMessages = selectedStore ? (chats[selectedStore.id] || []) : [];

  const fmt = (d) => d?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition z-50"
      >
        <MessageSquare className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {totalUnread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col"
            style={{ height: 520 }}
          >

            {/* ── Store List View ─────────────────── */}
            {view === 'list' && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-500 px-5 py-4 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-bold text-lg">Messages</h3>
                    <p className="text-blue-100 text-xs">Chat with stores near you</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Buyer identity */}
                {user && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">Buyer account</p>
                    </div>
                  </div>
                )}

                {/* Store list */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {STORES.map(store => (
                    <button
                      key={store.id}
                      onClick={() => openStore(store)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition text-left"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {store.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                          <StatusDot status={store.status} />
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {chats[store.id]
                            ? chats[store.id][chats[store.id].length - 1]?.text
                            : `Tap to chat with ${store.category} store`}
                        </p>
                      </div>
                      {unread[store.id] > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold flex-shrink-0">
                          {unread[store.id]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── Chat View ───────────────────────── */}
            {view === 'chat' && selectedStore && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-500 px-4 py-3 flex items-center gap-3 text-white flex-shrink-0">
                  <button onClick={() => setView('list')} className="hover:bg-white/20 p-1.5 rounded-lg transition">
                    <ChevronDown className="h-5 w-5 rotate-90" />
                  </button>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                    {selectedStore.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{selectedStore.name}</p>
                    <p className="text-xs text-blue-100 flex items-center gap-1">
                      <StatusDot status={selectedStore.status} />
                      {selectedStore.status === 'online' ? 'Online now' : selectedStore.status === 'away' ? 'Away' : 'Offline'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="hover:bg-white/20 p-1.5 rounded-lg transition"><Phone className="h-4 w-4" /></button>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition"><X className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 flex flex-col gap-3">
                  {currentMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'} gap-2`}
                    >
                      {msg.sender === 'seller' && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-base flex-shrink-0 self-end">
                          {selectedStore.avatar}
                        </div>
                      )}
                      <div className={`max-w-[72%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        msg.sender === 'buyer'
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-0.5 ${msg.sender === 'buyer' ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                          {fmt(msg.time)}
                        </p>
                      </div>
                      {msg.sender === 'buyer' && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0 self-end">
                          {user?.name?.[0] || 'Y'}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {typing && (
                    <div className="flex items-center gap-2 justify-start">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-base">{selectedStore.avatar}</div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Smart replies */}
                <div className="px-3 pt-2 flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
                  {SMART_REPLIES.default.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(r)}
                      className="whitespace-nowrap text-xs bg-blue-50 text-primary font-medium px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition flex-shrink-0"
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex items-center gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Message ${selectedStore.name}...`}
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-primary text-white p-2.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
