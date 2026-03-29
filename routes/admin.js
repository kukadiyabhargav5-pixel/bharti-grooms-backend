const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { upload } = require('../config/cloudinary');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const { filterType, startDate, endDate } = req.query;
    
    // Global counts (always show total current status)
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalProducts = await Product.countDocuments();
    
    // Date Filtering Logic
    let dateFilter = {};
    const now = new Date();
    
    if (filterType === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      dateFilter = { createdAt: { $gte: sevenDaysAgo } };
    } else if (filterType === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    } else if (filterType === 'custom' && startDate && endDate) {
      dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    } else {
      // Default: Daily (Today)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: todayStart } };
    }

    // Filtered Stats
    const filteredUsers = await User.countDocuments(dateFilter);
    const filteredProducts = await Product.countDocuments(dateFilter);
    
    const revenueResult = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const filteredRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const filteredOrdersCount = await Order.countDocuments(dateFilter);

    // Global Order Status Counts (independent of date filter)
    const orderStatusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const getCount = (status) => {
      const found = orderStatusCounts.find(s => s._id === status);
      return found ? found.count : 0;
    };

    const orderStats = {
      pendingCount: getCount('Pending'),
      readyToShipCount: getCount('Ready to Ship'),
      outForDeliveryCount: getCount('Out for Delivery'),
      deliveredCount: getCount('Delivered')
    };

    // Calculate Stock Stats (Global)
    const products = await Product.find({});
    const stockStats = {
      inStockCount: products.filter(p => p.stock >= 5).length,
      lowStockCount: products.filter(p => p.stock > 0 && p.stock < 5).length,
      outOfStockCount: products.filter(p => p.stock === 0).length
    };

    // Global Income
    const globalIncomeResult = await Order.aggregate([
      { $group: { _id: null, totalIncome: { $sum: '$totalAmount' } } }
    ]);
    const totalIncome = globalIncomeResult.length > 0 ? globalIncomeResult[0].totalIncome : 0;

    // Fetch Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalProducts,
      totalIncome,
      filteredUsers,
      filteredProducts,
      filteredRevenue,
      filteredOrdersCount,
      orderStats,
      stockStats,
      recentOrders
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users', error: error.message });
  }
});

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products', error: error.message });
  }
});

// GET /api/admin/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product details', error: error.message });
  }
});


// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, mobileNumber, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, mobileNumber, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// PUT /api/admin/products/:id/stock
router.put('/products/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email mobileNumber')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// GET /api/admin/orders/view/:id
router.get('/orders/view/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email mobileNumber');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// DELETE /api/admin/orders/:id
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

// POST /api/admin/products
router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const { name, price, category, initialStock, specifications } = req.body;
    const stock = parseInt(initialStock) || parseInt(req.body.stock) || 0;

    // Cloudinary returns secure_url for each uploaded file
    const images = req.files.map(file => file.path);

    // Parse specifications if sent as stringified JSON
    let parsedSpecs = specifications;
    if (typeof specifications === 'string') {
      try {
        parsedSpecs = JSON.parse(specifications);
      } catch (e) {
        parsedSpecs = {};
      }
    }

    const newProduct = new Product({
      name,
      price,
      category,
      stock,
      images,
      specifications: parsedSpecs
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

module.exports = router;
