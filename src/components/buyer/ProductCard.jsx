import React from "react";
import { useDispatch } from "react-redux";
import { Heart, ShoppingBag, IndianRupee } from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (product.status === "sold") return;
    dispatch(addToCart(product));
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  const isSold = product.status === "sold";
  const price = Number(product.price) || 0;

  return (
    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100">
      {/* Sold badge */}
      {isSold && (
        <div className="absolute z-10 top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          SOLD OUT
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={
            product.imageUrl ||
            "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
          }
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isSold ? "opacity-70" : "hover:scale-105"
          }`}
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {product.name || "Thrifted Piece"}
            </h3>
            <p className="text-xs text-gray-500">
              {product.category || "Misc"}
            </p>
          </div>
          <button
            onClick={handleWishlist}
            className="p-1.5 rounded-full bg-gray-50 hover:bg-purple-50 transition"
          >
            <Heart className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-4 h-4 text-gray-900" />
            <span className="text-base font-semibold text-gray-900">
              {price.toFixed(0)}
            </span>
          </div>
          {product.size && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              Size {product.size}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isSold}
          className={`mt-2 w-full inline-flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-xl transition ${
            isSold
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isSold ? "Sold" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
