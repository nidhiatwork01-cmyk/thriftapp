import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { HeartOff, ShoppingBag, Trash2, IndianRupee, Sparkles } from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  removeFromWishlist,
  clearWishlist,
} from "../../redux/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const items = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const moveToCart = (productId, product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(productId));
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isDarkMode
              ? "bg-gray-800 border-2 border-gray-700"
              : "bg-purple-50 border-2 border-purple-100"
          }`}
        >
          <HeartOff
            className={`w-12 h-12 ${
              isDarkMode ? "text-gray-600" : "text-purple-300"
            }`}
          />
        </div>
        <div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Your wishlist is empty
          </h3>
          <p
            className={`text-sm max-w-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Save items you love by tapping the heart icon on any product
          </p>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Discover Products
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`font-bold text-xl ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Wishlist
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Remove all items from wishlist?")) {
              dispatch(clearWishlist());
            }
          }}
          className={`text-sm font-medium transition ${
            isDarkMode
              ? "text-red-400 hover:text-red-300"
              : "text-red-600 hover:text-red-700"
          }`}
        >
          Clear All
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const inCart = isInCart(item.product.id);
          const isSold = item.product.status === "sold";

          return (
            <div
              key={item.id}
              className={`flex gap-4 rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              {/* Product Image */}
              <div
                onClick={() => navigate(`/product/${item.product.id}`)}
                className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer relative group"
              >
                <img
                  src={
                    item.product.imageUrl ||
                    "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={item.product.name}
                  className={`w-full h-full object-cover transition-transform group-hover:scale-110 ${
                    isSold ? "opacity-50 grayscale" : ""
                  }`}
                />
                {isSold && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="text-white text-xs font-bold">SOLD</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between gap-2">
                <div>
                  <h3
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className={`text-sm font-semibold line-clamp-2 cursor-pointer hover:underline ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.product.name}
                  </h3>
                  <div
                    className={`flex items-center gap-2 mt-1 text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>{item.product.category}</span>
                    {item.product.size && (
                      <>
                        <span>•</span>
                        <span>Size {item.product.size}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-1">
                    <IndianRupee
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <span
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {Number(item.product.price || 0).toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Move to Cart Button */}
                    {!isSold && (
                      <button
                        onClick={() => moveToCart(item.id, item.product)}
                        disabled={inCart}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          inCart
                            ? isDarkMode
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{inCart ? "In Cart" : "Add to Cart"}</span>
                      </button>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => dispatch(removeFromWishlist(item.id))}
                      className={`p-2 rounded-lg transition ${
                        isDarkMode
                          ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Move All to Cart */}
      <button
        onClick={() => {
          items.forEach((item) => {
            if (item.product.status !== "sold" && !isInCart(item.product.id)) {
              dispatch(addToCart(item.product));
            }
          });
          dispatch(clearWishlist());
        }}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg ${
          isDarkMode
            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02]"
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02]"
        }`}
      >
        Move All to Cart
      </button>
    </div>
  );
};

export default Wishlist;