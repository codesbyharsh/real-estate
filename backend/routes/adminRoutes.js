const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');


// Get all seller applications
router.get('/seller-applications', async (req, res) => {
  try {
    // Find users who want to become sellers but not yet approved
    const applications = await User.find({ 
      role: 'buyer', 
      isSellerApproved: false 
    }).select('-password');
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protect all admin routes
router.use(adminAuth);
// Approve/Reject seller application
router.put('/seller-application/:id', adminAuth, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'approve') {
      user.role = 'seller';
      user.isSellerApproved = true;
    }
    
    user.sellerApplication.status = action === 'approve' ? 'approved' : 'rejected';
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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
    
    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.securityAnswer;
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;