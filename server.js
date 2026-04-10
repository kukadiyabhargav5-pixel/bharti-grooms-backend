const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://www.bhartiglooms.in',
  'https://bhartiglooms.in',
  'https://bharti-grooms-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow all Vercel preview URLs for the project
    if (origin.includes('bharti-grooms-frontend') && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payment');
const complaintRoutes = require('./routes/complaint');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/complaints', complaintRoutes);


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Bharti Glooms API is running!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 GLOBAL ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

console.log('⏳ Connecting to MongoDB at:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
