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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
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
