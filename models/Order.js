const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: {
    name: String,
    email: String,
    mobile: String,
    address: String
  },
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
      photo: String
    }
  ],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  payment: {
    method: { type: String, default: 'COD' },
    transactionId: String,
    orderId: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
