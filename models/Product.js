const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  category: { 
    type: String, 
    required: true,
    enum: ['Saree', 'Kurti', 'Lehenga', 'Tunic', 'Dupatta']
  },
  stock: { type: Number, default: 0 },
  specifications: { type: Map, of: String, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
