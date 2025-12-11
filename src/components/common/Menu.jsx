import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, switchMode } from "../../redux/slices/authSlice";
import { User, LogOut, Home, Store, ShoppingBag } from "lucide-react";

const Menu = ({ isOpen, onClose, isDarkMode }) => {
  const { userMode, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/login");
  };

  const goProfile = () => {
    // You will add a profile page later
    alert("Profile Coming Soon!");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-72 h-full z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-xl`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold">Menu</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col p-4 gap-4">

        {/* Home */}
        <button
          onClick={() => {
            navigate("/home");
            onClose();
          }}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
        >
          <Home className="w-5 h-5" />
          Home
        </button>

        {/* Switch Mode */}
        <button
          onClick={() => {
            if (userMode === "buyer") {
              dispatch(switchMode("seller"));
              navigate("/seller-dashboard");
            } else {
              dispatch(switchMode("buyer"));
              navigate("/home");
            }
            onClose();
          }}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
        >
          {userMode === "buyer" ? (
            <>
              <Store className="w-5 h-5" />
              Become Seller
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Switch to Buyer
            </>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={goProfile}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
        >
          <User className="w-5 h-5" />
          Profile
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-100 text-red-600"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Menu;
