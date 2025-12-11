import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Heart, ShoppingBag, IndianRupee, Sparkles, Leaf } from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { calculateCO2Saved, formatCO2 } from "../../utils/sustainabilityUtils";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const isSold = product.status === "sold";
  const isInWishlist = wishlistItems.some(
    (item) => item.product.id === product.id
  );
  const isInCart = cartItems.some((item) => item.product.id === product.id);
  const price = Number(product.price) || 0;
  
  // Calculate CO2 saved
  const co2Saved = calculateCO2Saved(product.category);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isSold) return;
    dispatch(addToCart(product));
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border cursor-pointer group ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Sold badge */}
      {isSold && (
        <div className="absolute z-10 top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
          SOLD OUT
        </div>
      )}

      {/* New/Fresh badge for recently listed items */}
      {!isSold && product.listedAt && (
        (() => {
          const daysSinceListed = Math.floor(
            (Date.now() - new Date(product.listedAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceListed <= 3 ? (
            <div className="absolute z-10 top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              NEW
            </div>
          ) : null;
        })()
      )}

      {/* Sustainability badge - Top Left (below NEW badge if present) */}
      {!isSold && (
        <div className="absolute z-10 top-10 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Leaf className="w-3 h-3" />
          {formatCO2(co2Saved)}
        </div>
      )}

      {/* Wishlist heart button */}
      <button
        onClick={handleWishlist}
        className={`absolute z-10 top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all ${
          isInWishlist
            ? "bg-red-500 text-white scale-110"
            : "bg-white/80 text-gray-600 hover:bg-white hover:scale-110"
        }`}
      >
        <Heart
          className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`}
        />
      </button>

      {/* Image with zoom effect */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={
            product.imageUrl ||
            "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
          }
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isSold
              ? "opacity-60 grayscale"
              : "group-hover:scale-110"
          }`}
        />
        
        {/* Hover overlay */}
        {!isSold && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white text-sm font-medium">
              View Details
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold line-clamp-2 leading-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {product.name || "Thrifted Piece"}
            </h3>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {product.category || "Misc"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <IndianRupee
              className={`w-4 h-4 ${
                isDarkMode ? "text-purple-400" : "text-gray-900"
              }`}
            />
            <span
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {price.toFixed(0)}
            </span>
          </div>
          {product.size && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
              Size {product.size}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isSold}
          className={`mt-2 w-full inline-flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-all ${
            isSold
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : isInCart
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {isSold ? "Sold Out" : isInCart ? "In Cart" : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;