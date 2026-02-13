import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { isSellerLoggedIn } from "../../utils/sellerSession";

const SellerGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated && !isSellerLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isSellerLoggedIn()) {
    return <Navigate to="/seller-registration" replace />;
  }

  return children;
};

export default SellerGuard;
