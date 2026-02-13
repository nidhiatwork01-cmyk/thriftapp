import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CATEGORIES } from "../../utils/constants";
import { Upload, X, Image as ImageIcon, CheckCircle, ArrowLeft } from "lucide-react";
import { getSellerSession } from "../../utils/sellerSession";

const ProductListing = () => {
  const sellerUser = getSellerSession();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    size: "",
    condition: "Good",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!imageFile) {
      setError("Please upload a product image");
      return;
    }

    if (!formData.name || !formData.category || !formData.price) {
      setError("Please fill in all required fields");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      setIsUploading(true);
      if (!sellerUser?.isSeller) {
        setError("Please complete seller registration first.");
        navigate("/seller-registration");
        return;
      }

      if (!sellerUser?.email) {
        setError("Seller email missing. Please log in again.");
        return;
      }

      const productData = {
        ...formData,
        sellerEmail: sellerUser.email,
        price: Number(formData.price),
        imageFile,
      };

      await dispatch(addProduct(productData)).unwrap();
      alert("✅ Product listed successfully!");
      navigate("/seller-dashboard");
    } catch (submitError) {
      setError(submitError || "Failed to upload product");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/seller-dashboard")}
          className={`p-2 rounded-lg transition ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            List New Product
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Add details about your thrift item
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div
          className={`rounded-2xl border-2 border-dashed p-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <label className="block mb-2">
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Product Image <span className="text-red-500">*</span>
            </span>
          </label>

          {!imagePreview ? (
            <div className="flex flex-col items-center justify-center py-8 cursor-pointer">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <ImageIcon
                  className={`w-10 h-10 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium mb-1 ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Click to upload product image
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                PNG, JPG up to 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium cursor-pointer hover:shadow-lg transition"
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Choose Image
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full max-h-96 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Image uploaded
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div
          className={`rounded-2xl p-6 border space-y-5 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Product Name */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Vintage Denim Jacket"
              required
              className={`w-full p-3 border rounded-xl outline-none transition ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              }`}
            />
          </div>

          {/* Category & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                }`}
              >
                <option value="">Select category</option>
                {Object.values(CATEGORIES)
                  .filter((cat) => cat !== "All Categories")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Size (Optional)
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., M, L, XL"
                className={`w-full p-3 border rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                }`}
              />
            </div>
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="1"
                required
                className={`w-full p-3 border rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={`w-full p-3 border rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                }`}
              >
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the item, mention any flaws, styling tips, etc."
              className={`w-full p-3 border rounded-xl outline-none transition resize-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              }`}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-4 rounded-2xl font-semibold text-white text-lg transition-all ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:scale-[1.02]"
          }`}
        >
          {isUploading ? "Uploading..." : "List Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductListing;
