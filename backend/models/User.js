const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer'
  },
  securityQuestion: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: true,
  },
  isSellerApproved: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  sellerApplication: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    submittedAt: {
      type: Date
    },
    businessName: {
      type: String
    },
    businessType: {
      type: String,
      enum: ['individual', 'company']
    },
    taxId: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },
    description: {
      type: String
    },
    documents: {
      profilePic: {
        type: String
      },
      idProof: {
        type: String
      },
      addressProof: {
        type: String
      },
      taxDocument: {
        type: String
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster email lookups
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);