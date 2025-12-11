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
} from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);
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
    // Copy link to clipboard
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
    <div className="min-h-screen bg-gray-50 pb-24">
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

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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
          <div
            className={`relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 ${
              imageZoom ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setImageZoom(!imageZoom)}
          >
            <img
              src={
                product.imageUrl ||
                "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                imageZoom ? "scale-150" : "scale-100"
              } ${isSold ? "opacity-60" : ""}`}
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
            <Heart
              className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`}
            />
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
                  Standard Delivery (5-7 days)
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleWishlist}
            className={`p-4 rounded-2xl border-2 transition ${
              isInWishlist
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Heart
              className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`}
            />
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