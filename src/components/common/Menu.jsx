import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, switchMode } from "../../redux/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";
import {
  User,
  LogOut,
  Home,
  Store,
  ShoppingBag,
  Moon,
  Sun,
  Settings,
  Heart,
  X,
  History,
} from "lucide-react";

const Menu = ({ isOpen, onClose }) => {
  const { userMode, user } = useSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleModeSwitch = () => {
    if (userMode === "buyer") {
      if (user?.isSeller) {
        dispatch(switchMode("seller"));
        navigate("/seller-dashboard");
      } else {
        navigate("/seller-registration");
      }
    } else {
      dispatch(switchMode("buyer"));
      navigate("/home");
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 w-80 h-full z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${
          isDarkMode
            ? "bg-gray-900 text-white border-l border-gray-800"
            : "bg-white text-gray-800 border-l border-gray-200"
        } shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {user?.name || "User"}
                </h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              userMode === "seller"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {userMode === "seller" ? (
              <>
                <Store className="w-3.5 h-3.5" />
                Seller Mode
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Buyer Mode
              </>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col p-4 gap-2 overflow-y-auto h-[calc(100%-200px)]">
          {/* Navigation Links */}
          <button
            onClick={() => handleNavigation("/home")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => handleNavigation("/wishlist")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="font-medium">Wishlist</span>
          </button>

          <button
            onClick={() => handleNavigation("/cart")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">My Cart</span>
          </button>

          <button
            onClick={() => handleNavigation("/orders")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
          >
            <History className="w-5 h-5" />
            <span className="font-medium">Order History</span>
          </button>

          {/* Divider */}
          <div
            className={`my-2 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
          />

          {/* Mode Switch */}
          <button
            onClick={handleModeSwitch}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-purple-900/30 text-purple-300"
                : "hover:bg-purple-50 text-purple-700"
            }`}
          >
            {userMode === "buyer" ? (
              <>
                <Store className="w-5 h-5" />
                <span className="font-medium">
                  {user?.isSeller ? "Switch to Seller" : "Become a Seller"}
                </span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Switch to Buyer</span>
              </>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-between gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span className="font-medium">
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>

            {/* Toggle Switch */}
            <div
              className={`relative w-11 h-6 rounded-full transition ${
                isDarkMode ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isDarkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>

          {/* Divider */}
          <div
            className={`my-2 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
          />

          {/* Profile (Coming Soon) */}
          <button
            onClick={() => alert("Profile page coming soon!")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>

          {/* Settings (Coming Soon) */}
          <button
            onClick={() => alert("Settings coming soon!")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>

        {/* Logout Button */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Menu;