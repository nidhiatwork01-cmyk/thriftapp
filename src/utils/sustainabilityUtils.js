// src/utils/sustainabilityUtils.js

/**
 * Calculate CO2 saved by buying thrifted items
 * Based on average fashion industry emissions data
 */

// Average CO2 emissions (in kg) for producing new clothing items by category
const CO2_EMISSIONS_BY_CATEGORY = {
  'Tops': 5.5,           // T-shirts, blouses
  'Shirts': 7.0,         // Formal shirts
  'Pants': 11.0,         // Trousers, pants
  'Jeans': 33.4,         // Denim jeans (highest impact)
  'Dresses': 12.0,       // Dresses
  'Jackets': 15.0,       // Jackets, coats
  'Sweaters': 8.5,       // Sweaters, hoodies
  'Skirts': 6.0,         // Skirts
  'Shorts': 5.0,         // Shorts
  'Ethnic Wear': 10.0,   // Traditional clothing
  'Accessories': 2.0,    // Belts, scarves, etc.
  'Shoes': 14.0,         // Footwear
  'Bags': 8.0,           // Bags, purses
  'All Categories': 10.0 // Default
};

// Water saved (in liters) by buying thrifted
const WATER_SAVED_BY_CATEGORY = {
  'Tops': 2700,
  'Shirts': 2700,
  'Pants': 3000,
  'Jeans': 7500,     // Jeans use massive amounts of water
  'Dresses': 3500,
  'Jackets': 4000,
  'Sweaters': 3000,
  'Skirts': 2500,
  'Shorts': 2000,
  'Ethnic Wear': 3200,
  'Accessories': 500,
  'Shoes': 3500,
  'Bags': 2000,
  'All Categories': 3000
};

/**
 * Calculate CO2 saved for a single product
 */
export const calculateCO2Saved = (category) => {
  return CO2_EMISSIONS_BY_CATEGORY[category] || CO2_EMISSIONS_BY_CATEGORY['All Categories'];
};

/**
 * Calculate water saved for a single product (in liters)
 */
export const calculateWaterSaved = (category) => {
  return WATER_SAVED_BY_CATEGORY[category] || WATER_SAVED_BY_CATEGORY['All Categories'];
};

/**
 * Calculate total environmental impact for multiple products
 */
export const calculateTotalImpact = (products) => {
  let totalCO2 = 0;
  let totalWater = 0;

  products.forEach(product => {
    totalCO2 += calculateCO2Saved(product.category);
    totalWater += calculateWaterSaved(product.category);
  });

  return {
    co2: totalCO2,
    water: totalWater,
    trees: Math.floor(totalCO2 / 21), // 1 tree absorbs ~21kg CO2/year
    plastic: Math.floor(totalCO2 / 6), // Equivalent plastic bottles saved
  };
};

/**
 * Get achievement level based on CO2 saved
 */
export const getAchievementLevel = (totalCO2) => {
  if (totalCO2 >= 500) return { level: 'Planet Hero', emoji: '🌍', color: 'purple' };
  if (totalCO2 >= 200) return { level: 'Eco Champion', emoji: '🏆', color: 'green' };
  if (totalCO2 >= 100) return { level: 'Green Warrior', emoji: '💚', color: 'emerald' };
  if (totalCO2 >= 50) return { level: 'Eco Starter', emoji: '🌱', color: 'lime' };
  return { level: 'Thrift Beginner', emoji: '🌿', color: 'teal' };
};

/**
 * Get fun facts about environmental impact
 */
export const getEnvironmentalFact = (co2Saved) => {
  const facts = [
    {
      threshold: 0,
      fact: 'Every thrifted item helps reduce fashion waste!',
      icon: '♻️'
    },
    {
      threshold: 10,
      fact: `You've saved enough CO2 to power a laptop for ${Math.floor(co2Saved * 10)} hours!`,
      icon: '💻'
    },
    {
      threshold: 30,
      fact: `That's equivalent to ${Math.floor(co2Saved / 2.3)} car-free days!`,
      icon: '🚗'
    },
    {
      threshold: 50,
      fact: `You've saved as much CO2 as ${Math.floor(co2Saved / 21)} trees absorb in a year!`,
      icon: '🌳'
    },
    {
      threshold: 100,
      fact: `Amazing! You've prevented ${Math.floor(co2Saved)} kg of textile waste from landfills!`,
      icon: '🎉'
    },
    {
      threshold: 200,
      fact: `You're a sustainability superstar! That's ${Math.floor(co2Saved / 0.4)} smartphone charges worth of energy saved!`,
      icon: '⭐'
    }
  ];

  // Find the highest threshold fact that applies
  const applicableFacts = facts.filter(f => co2Saved >= f.threshold);
  return applicableFacts[applicableFacts.length - 1];
};

/**
 * Format CO2 value for display
 */
export const formatCO2 = (co2) => {
  if (co2 >= 1000) {
    return `${(co2 / 1000).toFixed(1)}t`; // tons
  }
  return `${co2.toFixed(1)}kg`;
};

/**
 * Format water value for display
 */
export const formatWater = (liters) => {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}k`; // thousands
  }
  return `${liters}`;
};

/**
 * Get comparison metrics for visualization
 */
export const getComparisonMetrics = (co2Saved) => {
  return {
    smartphones: Math.floor(co2Saved / 0.08), // Charges
    coffees: Math.floor(co2Saved / 0.21), // Cups of coffee
    miles: Math.floor(co2Saved / 0.4), // Car miles
    trees: Math.floor(co2Saved / 21), // Tree-years
  };
};