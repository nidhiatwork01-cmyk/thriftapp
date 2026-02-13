import React from "react";
import { useSelector } from "react-redux";
import { User, Mail, ShoppingBag } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className={`rounded-2xl p-6 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Profile</h2>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Your account information
        </p>
      </div>

      <div className={`rounded-2xl p-6 border space-y-4 ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <div className="flex items-center gap-3">
          <User className={`w-5 h-5 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`} />
          <div>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Name</p>
            <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user?.name || "User"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className={`w-5 h-5 ${isDarkMode ? "text-cyan-400" : "text-cyan-700"}`} />
          <div>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Email</p>
            <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user?.email || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShoppingBag className={`w-5 h-5 ${isDarkMode ? "text-purple-400" : "text-purple-700"}`} />
          <div>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Current Mode</p>
            <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Buyer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
