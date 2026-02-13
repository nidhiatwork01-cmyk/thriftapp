import React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className={`rounded-2xl p-6 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Settings</h2>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Customize app appearance
        </p>
      </div>

      <div className={`rounded-2xl p-6 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-between rounded-xl p-4 transition ${
            isDarkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-50 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5" />
            <span className="font-medium">Theme</span>
          </div>
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>{isDarkMode ? "Dark" : "Light"}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
