import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  IndianRupee,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Truck,
  Package,
} from "lucide-react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";
import { markAsSold } from "../../redux/slices/productSlice";
import { PLATFORM_FEE } from "../../utils/constants";
import { openRazorpayCheckout } from "../../utils/razorpay";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

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

  const handleCheckout = async () => {
    if (!user) {
      setError("Please login to continue");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await openRazorpayCheckout({
        amountInRupees: total,
        user: user,
        onSuccess: (response) => {
          console.log("Payment successful:", response);

          // Mark all items as sold
          items.forEach((item) => {
            dispatch(markAsSold(item.product.id));
          });

          // Clear cart
          dispatch(clearCart());

          // Show success message
          alert(
            `✅ Payment Successful!\n\nPayment ID: ${response.razorpay_payment_id}\n\nYour order has been placed. Sellers will be notified.`
          );

          // Navigate to home
          navigate("/home");
        },
        onFailure: (error) => {
          console.error("Payment failed:", error);
          setError("Payment failed. Please try again.");
          setIsProcessing(false);
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Looks like you haven't added anything to your cart yet. Start shopping!
        </p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl text-gray-900">Shopping Cart</h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="w-24 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={
                  item.product.imageUrl ||
                  "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.product.category}
                  {item.product.size && ` • Size ${item.product.size}`}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-900" />
                  <span className="text-lg font-bold text-gray-900">
                    {(item.product.price * item.quantity).toFixed(0)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>

                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-900 pb-2 border-b">
          Price Details
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <IndianRupee className="w-4 h-4" />
              <span>{subtotal.toFixed(0)}</span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              Platform Fee
              <div className="group relative">
                <AlertCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2 z-10">
                  ₹{PLATFORM_FEE} per item delivery charge
                </div>
              </div>
            </span>
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <IndianRupee className="w-4 h-4" />
              <span>{platformFee.toFixed(0)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-800">
            <Truck className="w-4 h-4" />
            <span>Standard delivery (5-7 days) included</span>
          </div>

          <div className="pt-3 border-t flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Amount</span>
            <div className="flex items-center gap-1 text-xl font-bold text-purple-600">
              <IndianRupee className="w-5 h-5" />
              <span>{total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-semibold">Important Policy</p>
          <p>
            • No returns or exchanges on thrifted items
            <br />
            • Payment via UPI/Card only (No COD)
            <br />• Secure payment powered by Razorpay
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isProcessing || items.length === 0}
        className={`w-full py-4 rounded-2xl font-semibold text-white text-lg shadow-lg transition-all ${
          isProcessing || items.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl hover:scale-[1.02]"
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Package className="w-5 h-5" />
            Proceed to Pay ₹{total.toFixed(0)}
          </span>
        )}
      </button>
    </div>
  );
};

export default Cart;