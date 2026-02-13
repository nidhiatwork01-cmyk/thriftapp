import React from "react";
import { TicketPercent } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const coupons = [
  { code: "THRIFT10", desc: "10% off on orders above ₹999" },
  { code: "FREESHIP", desc: "Free delivery on your next order" },
  { code: "ECO20", desc: "20% off on sustainable picks" },
];

const CouponsPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className={`rounded-2xl p-6 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Coupons</h2>
        <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Available buyer offers</p>
      </div>

      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className={`rounded-2xl p-5 border ${isDarkMode ? "app-panel" : "app-panel-strong"}`}
        >
          <div className="flex items-center gap-3">
            <TicketPercent className={`w-5 h-5 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`} />
            <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{coupon.code}</p>
          </div>
          <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{coupon.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default CouponsPage;
