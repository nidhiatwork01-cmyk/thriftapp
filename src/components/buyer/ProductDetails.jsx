import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Share2,
  MapPin,
  Truck,
  ShieldCheck,
  Store,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  Leaf,
  X,
  Sparkles,
  TrendingUp,
  Droplets,
  Trees,
  Award,
} from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";

// Sustainability Badge Component with Modal
const SustainabilityBadge = ({ category = 'Tops' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const calculateCO2Saved = (cat) => {
    return CO2_EMISSIONS_BY_CATEGORY[cat] || 10.0;
  };

  const calculateWaterSaved = (cat) => {
    return WATER_SAVED_BY_CATEGORY[cat] || 3000;
  };

  const formatCO2 = (co2) => {
    if (co2 >= 1000) return `${(co2 / 1000).toFixed(1)}t`;
    return `${co2.toFixed(1)}kg`;
  };

  const formatWater = (liters) => {
    if (liters >= 1000) return `${(liters / 1000).toFixed(1)}k`;
    return `${liters}`;
  };

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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate("/home");
    }
  }, [id, products, navigate]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  const isSold = product.status === "sold";
  const isInWishlist = wishlistItems.some(
    (item) => item.product.id === product.id
  );
  const isInCart = cartItems.some((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    if (isSold) return;
    dispatch(addToCart(product));
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  const handleShare = () => {
    setShowShareModal(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Product Details</h1>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full transition relative"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
            {showShareModal && (
              <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                Link copied! ✓
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Sold Badge Banner */}
        {isSold && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">This item is sold out</p>
              <p className="text-xs text-red-700 mt-0.5">
                Check out similar items in the {product.category} category
              </p>
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className="relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={
                product.imageUrl ||
                "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
              alt={product.name}
              className={`w-full h-full object-cover ${isSold ? "opacity-60" : ""}`}
            />
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-2xl rotate-[-15deg]">
                  SOLD OUT
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Button Overlay */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-sm transition ${
              isInWishlist
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Product Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          {/* Title & Category */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{product.category}</span>
              {product.size && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm font-medium text-gray-700">
                    Size {product.size}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2 border-t">
            <IndianRupee className="w-7 h-7 text-purple-600" />
            <span className="text-4xl font-bold text-purple-600">
              {Number(product.price || 0).toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 ml-2">+ ₹50 delivery</span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-2 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Seller Info */}
          {product.sellerEmail && (
            <div className="pt-2 border-t flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sold by</p>
                <p className="text-sm font-medium text-gray-900">
                  {product.sellerEmail}
                </p>
              </div>
            </div>
          )}

          {/* Listed Date */}
          {product.listedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Listed on {formatDate(product.listedAt)}</span>
            </div>
          )}
        </div>

        {/* Sustainability Badge with Modal */}
        <SustainabilityBadge category={product.category} />

        {/* Delivery & Policy Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-600" />
            Delivery & Returns
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Standard Delivery (5–7 days)
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Flat ₹50 delivery charge per item
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Delivery across India
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Ships from seller's location
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  No Returns or Exchanges
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This is a thrifted item. Please check details carefully before purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleWishlist}
            className={`p-4 rounded-2xl border-2 transition ${
              isInWishlist
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Heart className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isSold}
            className={`flex-1 py-4 rounded-2xl font-semibold text-white text-lg transition-all ${
              isSold
                ? "bg-gray-300 cursor-not-allowed"
                : isInCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {isSold ? "Sold Out" : isInCart ? "Added to Cart" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;