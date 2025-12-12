import React, { useState } from 'react';
import { Leaf, X, Sparkles, Heart, TrendingUp, Droplets, Trees, Award } from 'lucide-react';

// CO2 emissions data by category (in kg)
const CO2_EMISSIONS_BY_CATEGORY = {
  'Tops': 5.5,
  'Shirts': 7.0,
  'Pants': 11.0,
  'Jeans': 33.4,
  'Dresses': 12.0,
  'Jackets': 15.0,
  'Sweaters': 8.5,
  'Skirts': 6.0,
  'Shorts': 5.0,
  'Ethnic Wear': 10.0,
  'Accessories': 2.0,
  'Shoes': 14.0,
  'Bags': 8.0,
  'All Categories': 10.0
};

const WATER_SAVED_BY_CATEGORY = {
  'Tops': 2700,
  'Shirts': 2700,
  'Pants': 3000,
  'Jeans': 7500,
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

const calculateCO2Saved = (category) => {
  return CO2_EMISSIONS_BY_CATEGORY[category] || 10.0;
};

const calculateWaterSaved = (category) => {
  return WATER_SAVED_BY_CATEGORY[category] || 3000;
};

const formatCO2 = (co2) => {
  if (co2 >= 1000) return `${(co2 / 1000).toFixed(1)}t`;
  return `${co2.toFixed(1)}kg`;
};

const formatWater = (liters) => {
  if (liters >= 1000) return `${(liters / 1000).toFixed(1)}k`;
  return `${liters}`;
};

const SustainabilityBadge = ({ category = 'Tops', showDetails = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const co2Saved = calculateCO2Saved(category);
  const waterSaved = calculateWaterSaved(category);
  const treesEquivalent = Math.floor(co2Saved / 21);
  const plasticBottles = Math.floor(co2Saved / 6);

  return (
    <>
      {/* Badge Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full rounded-2xl p-5 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              🌱 Sustainable Choice
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Tap to see your environmental impact
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {formatCO2(co2Saved)}
            </p>
            <p className="text-xs text-gray-500">CO₂ saved</p>
          </div>
        </div>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8 text-white rounded-t-3xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <Heart className="w-10 h-10 text-white fill-current" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Thank You, Eco Warrior! 🌟
                </h2>
                <p className="text-green-50 text-sm">
                  By choosing thrift, you're making a real difference
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Appreciation Message */}
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  You're Acting Wisely! 💚
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Every thrifted item you buy helps reduce fashion waste, conserve 
                  resources, and protect our planet. You're part of the solution!
                </p>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-4">
                {/* CO2 Saved */}
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <div className="inline-flex p-2 bg-green-100 rounded-lg mb-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCO2(co2Saved)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    CO₂ Emissions Saved
                  </p>
                </div>

                {/* Water Saved */}
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="inline-flex p-2 bg-blue-100 rounded-lg mb-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatWater(waterSaved)}L
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Water Conserved
                  </p>
                </div>

                {/* Trees */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="inline-flex p-2 bg-emerald-100 rounded-lg mb-2">
                    <Trees className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {treesEquivalent}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Tree-Years Equivalent
                  </p>
                </div>

                {/* Plastic */}
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                  <div className="inline-flex p-2 bg-purple-100 rounded-lg mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {plasticBottles}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Plastic Bottles Worth
                  </p>
                </div>
              </div>

              {/* Fun Facts */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-xs font-semibold text-yellow-800 mb-1">
                      Did You Know?
                    </p>
                    <p className="text-sm text-yellow-900">
                      The fashion industry is one of the world's largest polluters. 
                      By buying thrift, you're extending clothing life and reducing 
                      demand for new production!
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Metrics */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Your Impact Equals
                </h3>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-purple-600">
                      {Math.floor(co2Saved / 0.08)}
                    </p>
                    <p className="text-xs text-gray-600">📱 Phone Charges</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue-600">
                      {Math.floor(co2Saved / 0.4)}
                    </p>
                    <p className="text-xs text-gray-600">🚗 Car-Free Miles</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">
                      {Math.floor(co2Saved / 0.21)}
                    </p>
                    <p className="text-xs text-gray-600">☕ Cups of Coffee</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-600">
                      {treesEquivalent}
                    </p>
                    <p className="text-xs text-gray-600">🌳 Trees Planted</p>
                  </div>
                </div>
              </div>

              {/* Encouragement */}
              <div className="text-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 border border-pink-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Keep Making a Difference! ✨
                </p>
                <p className="text-xs text-gray-600">
                  Every thrifted purchase is a step towards a more sustainable future. 
                  Share your journey and inspire others!
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Continue Shopping Sustainably
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Demo wrapper
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('Jeans');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sustainability Badge Demo
          </h1>
          <p className="text-gray-600">
            Click the badge to see your environmental impact!
          </p>
        </div>

        {/* Category Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Tops">Tops (5.5kg CO₂)</option>
            <option value="Shirts">Shirts (7kg CO₂)</option>
            <option value="Pants">Pants (11kg CO₂)</option>
            <option value="Jeans">Jeans (33.4kg CO₂) - Highest Impact!</option>
            <option value="Dresses">Dresses (12kg CO₂)</option>
            <option value="Jackets">Jackets (15kg CO₂)</option>
            <option value="Sweaters">Sweaters (8.5kg CO₂)</option>
            <option value="Skirts">Skirts (6kg CO₂)</option>
            <option value="Shorts">Shorts (5kg CO₂)</option>
            <option value="Ethnic Wear">Ethnic Wear (10kg CO₂)</option>
            <option value="Accessories">Accessories (2kg CO₂)</option>
            <option value="Shoes">Shoes (14kg CO₂)</option>
            <option value="Bags">Bags (8kg CO₂)</option>
          </select>
        </div>

        {/* Sustainability Badge */}
        <SustainabilityBadge category={selectedCategory} showDetails={true} />

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-sm text-blue-900">
            <strong>💡 Integration Tip:</strong> Replace the SustainabilityBadge 
            component in your ProductDetails.jsx or ProductCard.jsx with this version. 
            It will show this beautiful modal when users click on it!
          </p>
        </div>
      </div>
    </div>
  );
}
