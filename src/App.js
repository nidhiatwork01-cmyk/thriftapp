// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import MainLayout from "./components/layout/MainLayout";

// Buyer screens
import Home from "./components/buyer/Home";
import Cart from "./components/buyer/Cart";
import Wishlist from "./components/buyer/Wishlist";

// Seller screens
import SellerRegistration from "./components/seller/SellerRegistration";
import ProductListing from "./components/seller/ProductListing";
import SellerDashboard from "./components/seller/SellerDashboard";

const App = () => {
  return (
    <Routes>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Layout (Top header + Bottom nav) */}
      <Route element={<MainLayout />}>

        {/* Buyer routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Seller routes */}
        <Route path="/seller-registration" element={<SellerRegistration />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-listing" element={<ProductListing />} />
      </Route>

      {/* Catch-all → redirect to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
