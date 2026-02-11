import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import {
  Home,
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu as MenuIcon,
} from "lucide-react";
import Menu from "../common/Menu";
import SearchBar from "../common/SearchBar";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const navItems = [
    { name: "Home", icon: Home, path: "/home", badge: 0 },
    {
      name: "Cart",
      icon: ShoppingCart,
      path: "/cart",
      badge: cartItems?.length || 0,
    },
    {
      name: "Wishlist",
      icon: Heart,
      path: "/wishlist",
      badge: wishlistItems?.length || 0,
    },
    { name: "You", icon: User, path: "/seller-dashboard", badge: 0 },
  ];

  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname.startsWith("/product/");
    }
    return location.pathname === path;
  };

  // Show top header on specific pages
  const showTopHeader =
    location.pathname === "/home" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist" ||
    location.pathname === "/seller-dashboard";

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Top Header (Conditional) */}
      {showTopHeader && (
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur supports-[backdrop-filter]:bg-opacity-90 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-800"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div className="px-4 py-3 flex items-center justify-between gap-3 max-w-7xl mx-auto">
            {/* Logo/Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TH</span>
              </div>
              <h1
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ThriftHub
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Toggle search"
                className={`p-2 rounded-lg transition ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className={`p-2 rounded-lg transition ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <MenuIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {showSearch && (
            <div className="px-4 pb-3 max-w-7xl mx-auto w-full">
              <SearchBar isDarkMode={isDarkMode} />
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pb-24 p-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 border-t shadow-[0_-6px_20px_rgba(0,0,0,0.08)] ${
          isDarkMode
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        } backdrop-blur safe-area-bottom rounded-t-2xl`}
      >
        <div className="flex justify-around items-center py-2 max-w-3xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center min-w-[64px] py-1.5 px-2 rounded-xl transition ${
                  active
                    ? isDarkMode
                      ? "bg-purple-900/30"
                      : "bg-purple-50"
                    : ""
                }`}
              >
                {/* Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}

                {/* Icon */}
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${
                    active
                      ? "text-purple-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    active
                      ? "text-purple-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {item.name}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Slide-out Menu */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default MainLayout;