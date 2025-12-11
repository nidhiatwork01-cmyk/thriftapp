import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../utils/constants";
import { Upload } from "lucide-react";

const ProductListing = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "", // base64
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Product
  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      sellerEmail: user.email,
    };

    dispatch(addProduct(productData));
    navigate("/seller-dashboard");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        List a New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Image
          </label>
          <div className="border rounded-xl p-3 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <Upload className="w-6 h-6 mb-2" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
          </div>

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="preview"
              className="mt-3 w-32 h-40 rounded-xl object-cover border"
            />
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            name="category"
            className="w-full p-3 border rounded-xl bg-white"
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {Object.values(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            className="w-full p-3 border rounded-xl"
            rows="3"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-md transition"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default ProductListing;
