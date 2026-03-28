const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { sendComplaintNotification, sendReplyEmail } = require('../utils/emailService');

// @route   POST /api/complaints/:id/reply
// @desc    Reply to an inquiry via email
// @access  Private (Admin)
router.post('/:id/reply', async (req, res) => {
  console.log('📬 Attempting to reply to inquiry:', req.params.id);
  try {
    const { replyMessage } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      console.log('❌ Inquiry not found:', req.params.id);
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    console.log('📧 Sending email to:', complaint.email);
    // Send email to customer
    await sendReplyEmail(complaint.email, complaint.subject, replyMessage, complaint.message);

    console.log('✅ Email sent, removing inquiry from database...');
    // Delete the complaint after successful reply (as requested)
    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: 'Reply sent successfully and inquiry removed' });
  } catch (error) {
    console.error('💥 Reply Route Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete an inquiry
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete Complaint Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @route   POST /api/complaints
// @desc    Submit a new complaint/inquiry
// @access  Public
router.post('/', async (req, res) => {
  console.log('📩 Incoming Complaint Request:', req.body);
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newComplaint = new Complaint({
      name,
      email,
      subject,
      message,
    });

    await newComplaint.save();

    // Send email notification to admin
    await sendComplaintNotification(name, email, subject, message);

    res.status(201).json({ message: 'Complaint submitted successfully' });
  } catch (error) {
    console.error('Complaint Submission Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (Mark as Read/Replied)
// @access  Private (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: status || 'Read' },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Update Complaint Status Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @route   GET /api/complaints
// @desc    Get all complaints (Admin only)
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Fetch Complaints Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
