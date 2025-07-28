const natural = require('natural');
const Property = require('../models/Property');

const checkForDuplicates = async (newProperty) => {
  try {
    // Find properties within 1km radius
    const nearbyProperties = await Property.find({
      'location.coordinates.lat': {
        $gte: newProperty.location.coordinates.lat - 0.01,
        $lte: newProperty.location.coordinates.lat + 0.01
      },
      'location.coordinates.lng': {
        $gte: newProperty.location.coordinates.lng - 0.01,
        $lte: newProperty.location.coordinates.lng + 0.01
      }
    });

    // Check title similarity
    const similarityThreshold = 0.8;
    const duplicate = nearbyProperties.some(existing => {
      const similarity = natural.JaroWinklerDistance(
        newProperty.title.toLowerCase(),
        existing.title.toLowerCase()
      );
      return similarity > similarityThreshold;
    });

    return duplicate;
  } catch (error) {
    console.error("Duplicate check error:", error);
    return false;
  }
};

module.exports = checkForDuplicates;