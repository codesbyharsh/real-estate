const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    
    // Create a simple token with user data
    const token = JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: true
    });
    
    // Return user without sensitive data and token
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.securityAnswer;
    
    res.json({ ...userResponse, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protect all admin routes
// router.use(adminAuth);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password -securityAnswer');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all seller applications
router.get('/seller-applications', async (req, res) => {
  try {
    const applications = await User.find({
      'sellerApplication.status': 'pending'
    }).select('-password -securityAnswer');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject seller application
router.put('/seller-application/:id', async (req, res) => {
  try {
    const { action } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'approve') {
      user.role = 'seller';
      user.isSellerApproved = true;
      user.sellerApplication.status = 'approved';
    } else {
      user.sellerApplication.status = 'rejected';
    }

    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -securityAnswer');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;