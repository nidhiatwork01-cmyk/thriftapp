import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Package } from "lucide-react";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const sellerProducts = products.filter(
    (p) => p.sellerEmail === user.email
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Welcome, {user.storeName || "Seller"}
        </h2>
        <button
          onClick={() => navigate("/seller-listing")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-md transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>List a Product</span>
        </button>
      </div>

      {sellerProducts.length === 0 ? (
        <div className="text-center py-10">
          <Package className="w-10 h-10 text-gray-400 mx-auto" />
          <p className="text-gray-500 mt-2">You haven't listed anything yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sellerProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 bg-white border rounded-xl p-3 shadow-sm"
            >
              <img
                src={
                  p.imageUrl ||
                  "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt={p.name}
                className="w-20 h-24 rounded-xl object-cover bg-gray-100"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.category}</p>
                <p className="text-sm font-medium mt-1">₹{p.price}</p>
                <p className="text-xs mt-1">
                  Status:{" "}
                  <span
                    className={
                      p.status === "sold"
                        ? "text-red-500 font-semibold"
                        : "text-green-600"
                    }
                  >
                    {p.status === "sold" ? "Sold" : "Available"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
