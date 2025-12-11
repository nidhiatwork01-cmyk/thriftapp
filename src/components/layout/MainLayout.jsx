import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  ShoppingCart,
  Heart,
  User,
} from "lucide-react";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const navItems = [
    { name: "Home", icon: Home, path: "/home", badge: 0 },
    { name: "Cart", icon: ShoppingCart, path: "/cart", badge: cartItems?.length || 0 },
    { name: "Wishlist", icon: Heart, path: "/wishlist", badge: wishlistItems?.length || 0 },
    { name: "You", icon: User, path: "/seller-dashboard", badge: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔹 Main content area */}
      <div className="flex-1 overflow-auto pb-16 p-4">
        <Outlet />
      </div>

      {/* 🔹 Bottom Navigation (Always Visible) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center text-[13px]"
              >
                {/* Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[11px] px-1.5 py-[1px] rounded-full">
                    {item.badge}
                  </span>
                )}

                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-purple-600" : "text-gray-500"
                  }`}
                />

                <span
                  className={`mt-1 ${
                    isActive ? "text-purple-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
