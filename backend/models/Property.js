const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  price: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  images: [String],
  isDuplicate: { type: Boolean, default: false },
  duplicateReason: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);