import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HeartOff, ShoppingBag } from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  removeFromWishlist,
  clearWishlist,
} from "../../redux/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  const moveToCart = (productId, product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(productId));
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
        <HeartOff className="w-10 h-10 text-gray-400" />
        <p className="text-gray-600 text-sm">
          Your wishlist is empty right now.
        </p>
        <p className="text-xs text-gray-400">
          Tap the heart on any product to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-gray-900">Your Wishlist</h2>
        <button
          onClick={() => dispatch(clearWishlist())}
          className="text-xs text-gray-500 underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
          >
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={
                  item.product.imageUrl ||
                  "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.product.category} • Size {item.product.size || "-"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{Number(item.product.price || 0).toFixed(0)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(item.id, item.product)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-medium"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move to cart</span>
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="text-xs text-gray-500 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
