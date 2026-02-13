import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard, LogIn, LogOut, Settings, TicketPercent, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../redux/slices/authSlice";

const YouPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isBuyerSession = isAuthenticated && user && !user.isSeller;

  if (!isBuyerSession) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-2xl p-6 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>You</h2>
          <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Sign in to view profile, orders, and coupons.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl text-white font-semibold brand-gradient"
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`px-5 py-2.5 rounded-xl border font-semibold ${
                isDarkMode ? "border-slate-600 text-slate-200" : "border-slate-300 text-slate-700"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className={`rounded-2xl p-6 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>You</h2>
        <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Buyer account center</p>
        <div className="mt-4">
          <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user?.name}</p>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{user?.email}</p>
        </div>
      </div>

      <div className={`rounded-2xl p-2 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <button onClick={() => navigate("/profile")} className="w-full text-left p-3 rounded-xl hover:bg-white/10">
          <User className="w-5 h-5 inline mr-3" />
          Profile
        </button>
        <button onClick={() => navigate("/orders")} className="w-full text-left p-3 rounded-xl hover:bg-white/10">
          <CreditCard className="w-5 h-5 inline mr-3" />
          Order History
        </button>
        <button onClick={() => navigate("/coupons")} className="w-full text-left p-3 rounded-xl hover:bg-white/10">
          <TicketPercent className="w-5 h-5 inline mr-3" />
          Coupons
        </button>
        <button onClick={() => navigate("/settings")} className="w-full text-left p-3 rounded-xl hover:bg-white/10">
          <Settings className="w-5 h-5 inline mr-3" />
          Settings
        </button>
      </div>

      <button
        onClick={() => {
          dispatch(logout());
          navigate("/home");
        }}
        className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
      >
        <LogOut className="w-4 h-4 inline mr-2" />
        Logout
      </button>
    </div>
  );
};

export default YouPage;
