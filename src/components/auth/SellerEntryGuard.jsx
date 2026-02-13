import React from "react";
import { Navigate } from "react-router-dom";

const SellerEntryGuard = ({ children }) => {
  const hasSellerIntent =
    typeof window !== "undefined" && window.sessionStorage.getItem("sellerEntryIntent") === "true";

  if (!hasSellerIntent) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SellerEntryGuard;
