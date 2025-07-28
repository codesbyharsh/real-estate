const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new property
router.post('/', async (req, res) => {
  const property = new Property({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location
  });

  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;