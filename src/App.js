// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import SellerGuard from "./components/auth/SellerGuard";
import SellerEntryGuard from "./components/auth/SellerEntryGuard";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/landing/LandingPage";

// Buyer screens
import Home from "./components/buyer/Home";
import Cart from "./components/buyer/Cart";
import Wishlist from "./components/buyer/Wishlist";
import ProductDetails from "./components/buyer/ProductDetails";
import YouPage from "./components/buyer/YouPage";
import CouponsPage from "./components/buyer/CouponsPage";

// Orders
import OrderHistory from "./components/orders/OrderHistory"; // ⭐ NEW

// Seller screens
import SellerRegistration from "./components/seller/SellerRegistration";
import ProductListing from "./components/seller/ProductListing";
import SellerDashboard from "./components/seller/SellerDashboard";
import ProfilePage from "./components/profile/ProfilePage";
import SettingsPage from "./components/settings/SettingsPage";

const App = () => {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Layout (Top header + Bottom nav) */}
      <Route element={<MainLayout />}>
        {/* Buyer routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/you" element={<YouPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<OrderHistory />} /> {/* ⭐ NEW ROUTE */}
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Seller flow (separate from buyer browsing layout) */}
      <Route
        path="/seller-registration"
        element={
          <SellerEntryGuard>
            <SellerRegistration />
          </SellerEntryGuard>
        }
      />
      <Route
        path="/seller-dashboard"
        element={
          <SellerGuard>
            <SellerDashboard />
          </SellerGuard>
        }
      />
      <Route
        path="/seller-listing"
        element={
          <SellerGuard>
            <ProductListing />
          </SellerGuard>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
