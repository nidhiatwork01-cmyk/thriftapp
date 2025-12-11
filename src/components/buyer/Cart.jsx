import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Trash2,
  Plus,
  Minus,
  IndianRupee,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";
import { PLATFORM_FEE } from "../../utils/constants";
import { openRazorpayCheckout } from "../../utils/razorpay";
import { markAsSold } from "../../redux/slices/productSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const { subtotal, platformFee, total } = useMemo(() => {
    const subtotalValue = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const platformFeeValue = PLATFORM_FEE * items.length;
    return {
      subtotal: subtotalValue,
      platformFee: platformFeeValue,
      total: subtotalValue + platformFeeValue,
    };
  }, [items]);

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleDelete = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg text-gray-900">Your Cart</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
          >
            <div className="w-20 h-24 rounded-xl overflow-hidden">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-xs text-gray-500">
                {item.product.category}
              </p>
              <p className="text-sm font-semibold">
                ₹{item.product.price}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="bg-gray-100 rounded-full p-1"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-sm w-6 text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="bg-gray-100 rounded-full p-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1.5 rounded-full bg-red-50 hover:bg-red-100"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {/* PRICE SUMMARY */}
      {/* (kept same as earlier) */}
    </div>
  );
};

export default Cart;
