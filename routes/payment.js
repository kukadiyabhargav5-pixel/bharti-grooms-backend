const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order (Razorpay)
router.post('/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Could not create order', error: error.message });
  }
});

// Verify Payment and Save to Database
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Save order to database upon successful verification
      const newOrder = new Order({
        userId: orderDetails.userId,
        user: (orderDetails.userId && mongoose.Types.ObjectId.isValid(orderDetails.userId)) ? orderDetails.userId : null, 
        customer: {
          name: orderDetails.name,
          email: orderDetails.email,
          mobile: orderDetails.mobileNumber,
          address: orderDetails.address
        },
        products: orderDetails.products.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          photo: item.images?.[0] || '' 
        })),
        totalAmount: orderDetails.totalAmount,
        status: 'Pending',
        payment: {
          method: 'Razorpay',
          transactionId: razorpay_payment_id,
          orderId: razorpay_order_id
        }
      });

      await newOrder.save();
      
      // Send order confirmation email (fire-and-forget)
      if (orderDetails.email) {
        sendOrderConfirmationEmail(orderDetails.email, orderDetails.name, newOrder)
          .catch(err => console.error('Order email error:', err));
      }

      return res.status(200).json({ message: "Payment verified and order saved successfully", order: newOrder });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Save COD Order
router.post('/verify-cod', async (req, res) => {
  try {
    const { orderDetails } = req.body;

    const newOrder = new Order({
      userId: orderDetails.userId,
      user: (orderDetails.userId && mongoose.Types.ObjectId.isValid(orderDetails.userId)) ? orderDetails.userId : null,
      customer: {
        name: orderDetails.name,
        email: orderDetails.email,
        mobile: orderDetails.mobileNumber,
        address: orderDetails.address
      },
      products: orderDetails.products.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        photo: item.images?.[0] || ''
      })),
      totalAmount: orderDetails.totalAmount,
      status: 'Pending',
      payment: {
        method: 'COD',
        transactionId: `COD_${Date.now()}`,
        orderId: `ORD_COD_${Date.now()}`
      }
    });

    await newOrder.save();

    // Send order confirmation email (fire-and-forget)
    if (orderDetails.email) {
      sendOrderConfirmationEmail(orderDetails.email, orderDetails.name, newOrder)
        .catch(err => console.error('COD Order email error:', err));
    }

    res.status(200).json({ message: "COD Order saved successfully", order: newOrder });
  } catch (error) {
    console.error('COD Order Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
