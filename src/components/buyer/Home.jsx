import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Sparkles, Shirt, Store } from "lucide-react";
import ProductCard from "./ProductCard";
import { loadAllProducts } from "../../redux/slices/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, filteredProducts, selectedCategory } = useSelector(
    (state) => state.products
  );

  const list = filteredProducts.length ? filteredProducts : products;

  useEffect(() => {
    dispatch(loadAllProducts());
  }, [dispatch]);

  const handleBecomeSeller = () => {
    navigate("/seller-registration");
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-3xl px-5 py-4 md:px-7 md:py-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/10 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>Curated thrift drops daily</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">
            Find your next favourite fit.
          </h1>
          <p className="text-xs md:text-sm text-white/80 max-w-md">
            Shop unique thrift pieces from trusted sellers. Sustainable, budget
            friendly, and one-of-one.
          </p>
        </div>

        <button
          onClick={handleBecomeSeller}
          className="hidden sm:inline-flex flex-col items-center gap-2 bg-white text-purple-700 rounded-2xl px-4 py-3 font-semibold text-xs md:text-sm shadow-md hover:shadow-xl transition"
        >
          <Store className="w-5 h-5" />
          <span>Start selling</span>
        </button>
      </section>

      {/* Category + count */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-base md:text-lg">
          {selectedCategory === "All Categories"
            ? "Trending pieces"
            : selectedCategory}
        </h2>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Shirt className="w-4 h-4" />
          <span>{list.length} items</span>
        </div>
      </div>

      {/* Product Grid */}
      {list.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center text-center gap-3 py-10">
          <p className="text-gray-500 text-sm">
            No items in this category yet… Be the first to list something!
          </p>
          <button
            onClick={handleBecomeSeller}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
          >
            <Store className="w-4 h-4" />
            Become a seller
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
