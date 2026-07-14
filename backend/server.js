import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB, { sequelize } from './config/db.js';
import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import './models/Product.js'; // ensure Product model is registered for sequelize.sync

dotenv.config();

// TEMPORARY DEBUG - remove after fix
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_SSL:', process.env.DB_SSL);

const app = express();
const server = http.createServer(app);

// Allow frontend origin from env, or localhost in dev
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Connect Database & Sync Models
const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true }); // auto-creates/updates tables
  console.log('Database synced.');
};
startServer();

// Basic Route
app.get('/', (req, res) => {
  res.send('LocalLink Backend is running...');
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Inventory Routes
app.use('/api/inventory', inventoryRoutes);

// Socket.io for Real-time Chat & Notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
