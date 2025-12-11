
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Sparkles, Shirt, Store, TrendingUp, Filter } from "lucide-react";
import ProductCard from "./ProductCard";
import { loadAllProducts } from "../../redux/slices/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [showStats, setShowStats] = useState(true);

  const { products, filteredProducts, selectedCategory } = useSelector(
    (state) => state.products
  );

  const list = filteredProducts.length ? filteredProducts : products;
  const availableProducts = list.filter((p) => p.status === "available");

  useEffect(() => {
    dispatch(loadAllProducts());
  }, [dispatch]);

  const handleBecomeSeller = () => {
    navigate("/seller-registration");
  };

  // Calculate stats
  const totalProducts = products.filter((p) => p.status === "available").length;
  const soldItems = products.filter((p) => p.status === "sold").length;
  const categories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section
        className={`rounded-3xl px-6 py-8 md:px-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white"
            : "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white"
        }`}
      >
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">New arrivals daily</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            Find your next
            <br />
            <span className="text-yellow-300">favourite fit.</span>
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-md leading-relaxed">
            Shop unique thrift pieces from trusted sellers. Sustainable,
            budget-friendly, and one-of-one.
          </p>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalProducts}+</div>
                <div className="text-xs text-white/80">Active Items</div>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <div className="text-2xl font-bold">{soldItems}+</div>
                <div className="text-xs text-white/80">Items Sold</div>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <div className="text-2xl font-bold">{categories}+</div>
                <div className="text-xs text-white/80">Categories</div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleBecomeSeller}
          className="hidden md:flex flex-col items-center gap-2 bg-white text-purple-700 rounded-2xl px-6 py-4 font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
        >
          <Store className="w-6 h-6" />
          <span className="text-sm">Start Selling</span>
        </button>
      </section>

      {/* Mobile Seller CTA */}
      <button
        onClick={handleBecomeSeller}
        className={`md:hidden w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold shadow-lg transition-all ${
          isDarkMode
            ? "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
            : "bg-white text-purple-700 border border-purple-100 hover:bg-purple-50"
        }`}
      >
        <Store className="w-5 h-5" />
        <span>Become a Seller & Earn</span>
      </button>

      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`font-bold text-lg md:text-xl ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {selectedCategory === "All Categories"
              ? "Trending Pieces"
              : selectedCategory}
          </h2>
          <div
            className={`flex items-center gap-2 mt-1 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>
              {availableProducts.length}{" "}
              {availableProducts.length === 1 ? "item" : "items"} available
            </span>
          </div>
        </div>

        {/* View Toggle (Future: Grid/List view) */}
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg transition ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {availableProducts.length === 0 ? (
        <div
          className={`mt-10 flex flex-col items-center justify-center text-center gap-4 py-16 rounded-3xl border-2 border-dashed ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700 text-gray-300"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <Shirt
              className={`w-10 h-10 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <p
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No items in this category yet
            </p>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Be the first to list something amazing!
            </p>
          </div>
          <button
            onClick={handleBecomeSeller}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            <Store className="w-5 h-5" />
            Become a Seller
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {availableProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Trending Banner (if more than 10 items) */}
      {availableProducts.length > 10 && (
        <div
          className={`mt-8 rounded-2xl p-6 flex items-center gap-4 ${
            isDarkMode
              ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-800/30"
              : "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100"
          }`}
        >
          <div
            className={`p-3 rounded-full ${
              isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
            }`}
          >
            <TrendingUp
              className={`w-6 h-6 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              🔥 Trending Collection
            </h3>
            <p
              className={`text-sm mt-0.5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              These items are getting lots of love from the community
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;