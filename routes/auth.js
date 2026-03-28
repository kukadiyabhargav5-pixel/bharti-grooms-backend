const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('Registration Request Body:', req.body);
    const { name, email, mobileNumber, address, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Register: User already exists');
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ name, email, mobileNumber, address, password: hashedPassword });
    await user.save();
    console.log('Register: User saved successfully');

    // Send welcome email (fire-and-forget - don't block registration)
    sendWelcomeEmail(email, name).catch(err => console.error('Welcome email error:', err));

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, address: user.address },
    });
  } catch (error) {
    console.error('Register: Error occurred:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    // Hardcoded Admin Check
    if (email === 'bhartiglooms@gmail.com' && password === 'bhartiglooms@2005') {
      if (process.env.ADMIN_2FA_SECRET) {
        // Step 1: Password correct, but 2FA is active
        return res.json({
          requires2FA: true,
          message: 'Please enter the 6-digit code from Google Authenticator',
          adminEmail: email
        });
      }

      // If no 2FA secret is set yet, allow login but with a warning (or for first-time setup)
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: 'Admin Login successful! (2FA not yet configured)',
        token,
        user: { id: 'admin123', name: 'Bharti Admin', email: 'bhartiglooms@gmail.com', role: 'admin' },
        setup2FA: true // Flag to suggest setup in UI
      });
    }

    // Check regular user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, address: user.address },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GOOGLE LOGIN
router.post('/google-login', async (req, res) => {
  try {
    const { credential, access_token } = req.body;
    let name, email;

    if (credential) {
      // Flow 1: ID Token (from standard GoogleLogin component)
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
    } else if (access_token) {
      // Flow 2: Access Token (from custom useGoogleLogin hook)
      const axios = require('axios');
      const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      name = googleRes.data.name;
      email = googleRes.data.email;
    } else {
      return res.status(400).json({ message: 'Google credential or access_token missing' });
    }

    if (!email) return res.status(400).json({ message: 'Could not retrieve email from Google' });
    const lowerEmail = email.toLowerCase();
    let user = await User.findOne({ email: lowerEmail });

    if (!user) {
      user = new User({
        name,
        email: lowerEmail,
      });
      await user.save();
      sendWelcomeEmail(lowerEmail, name).catch(err => console.error('Welcome email error:', err));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Google Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, address: user.address }
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(400).json({ message: 'Google Login verification failed', error: error.message });
  }
});

const Order = require('../models/Order');
const crypto = require('crypto');

// In-memory OTP store { email: { otp, expiresAt } }
const otpStore = {};

// GET /api/auth/my-orders  — search by userId string OR customer email
router.get('/my-orders', async (req, res) => {
  try {
    const { userId, email } = req.query;
    if (!userId && !email) return res.status(400).json({ message: 'User ID or email required' });
    const filter = userId
      ? { $or: [{ userId: userId.toString() }, { 'customer.email': email }] }
      : { 'customer.email': email };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// POST /api/auth/verify-password
router.post('/verify-password', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    res.json({ verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/auth/update-profile
router.put('/update-profile', async (req, res) => {
  try {
    const { userId, name, mobileNumber, address } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, mobileNumber, address },
      { new: true }
    );
    res.json({ message: 'Profile updated', user: { id: updated._id, name: updated.name, email: updated.email, mobileNumber: updated.mobileNumber, address: updated.address } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// ── Forgot Password Flow ─────────────────────────────────────────────────────

// POST /api/auth/forgot-password/send-otp
router.post('/forgot-password/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

    // Send OTP email
    const { sendOtpEmail } = require('../utils/emailService');
    await sendOtpEmail(email, user.name, otp);

    res.json({ message: 'OTP sent to your email successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// POST /api/auth/forgot-password/verify-otp
router.post('/forgot-password/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: 'OTP not found. Please request again.' });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp.toString()) return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    res.json({ verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/forgot-password/reset
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp.toString() || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please start again.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashedPassword });
    delete otpStore[email]; // OTP used — clear it
    res.json({ message: 'Password reset successful! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

// Admin Verify 2FA
router.post('/admin/verify-2fa', async (req, res) => {
  const { code, email } = req.body;
  if (!email || !code) return res.status(400).json({ message: 'Email and Code required' });

  // Currently only for bhartiglooms@gmail.com
  if (email !== 'bhartiglooms@gmail.com') return res.status(403).json({ message: 'Unauthorized' });

  const secret = process.env.ADMIN_2FA_SECRET;
  if (!secret) return res.status(400).json({ message: '2FA not configured on server' });

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code,
    window: 1 // allows ± 30 seconds
  });

  if (verified) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      message: 'Admin Login successful!',
      token,
      user: { id: 'admin123', name: 'Bharti Admin', email: 'bhartiglooms@gmail.com', role: 'admin' }
    });
  } else {
    return res.status(401).json({ message: 'Invalid 6-digit code' });
  }
});

// Admin Setup 2FA (Generate Secret and QR Code)
router.get('/admin/setup-2fa', async (req, res) => {
  const existingSecret = process.env.ADMIN_2FA_SECRET;
  let secret;
  let otpauth_url;

  if (existingSecret) {
    // If a secret exists in .env, use it to generate the QR code
    secret = existingSecret;
    otpauth_url = `otpauth://totp/Bharti%20Glooms%3Abhartiglooms%40gmail.com?secret=${secret}&issuer=Bharti%20Glooms%20Admin%20Tool`;
  } else {
    // Otherwise generate a new one
    const newSecret = speakeasy.generateSecret({ name: "Bharti Glooms Admin Tool" });
    secret = newSecret.base32;
    otpauth_url = newSecret.otpauth_url;
  }
  
  qrcode.toDataURL(otpauth_url, (err, data_url) => {
    if (err) return res.status(500).json({ message: 'Error generating QR Code' });
    res.json({
      secret: secret,
      qrcode: data_url,
      message: 'Scan this QR code in Google Authenticator APP. Save the secret key safely.'
    });
  });
});

module.exports = router;
