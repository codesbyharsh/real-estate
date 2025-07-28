const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/logout/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isLoggedIn = false;
    await user.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password, // Note: In production, hash this password
      securityQuestion,
      securityAnswer,
      role: 'buyer' // Force buyer role
    });

    await user.save();
    
    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.securityAnswer;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Replace your current login route with this:
// backend/routes/userRoutes.js
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received:', req.body); // Add this for debugging
    
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier }
      ]
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) { // In production, use bcrypt.compare()
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.isLoggedIn = true;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.securityAnswer;

    res.json(userResponse);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/:id/become-seller', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user role to seller (pending approval)
    user.role = 'seller';
    user.isSellerApproved = false;
    await user.save();
    
    res.json({ message: 'Seller application submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || user.securityAnswer !== securityAnswer) {
      return res.status(401).json({ message: 'Invalid security answer' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;