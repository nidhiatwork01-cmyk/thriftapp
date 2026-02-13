import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import productReducer from "./slices/productSlice";

import { getFromLocalStorage } from "../utils/localStorage";

const preloadedState = {
  auth: {
    users: getFromLocalStorage("users") || [],
    user: getFromLocalStorage("user") || null,
    isAuthenticated: getFromLocalStorage("isAuthenticated") || false,
    userMode: getFromLocalStorage("userMode") || "buyer",
  },
  cart: {
    items: getFromLocalStorage("cartItems") || [],
  },
  wishlist: {
    items: getFromLocalStorage("wishlistItems") || [],
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
  },
  preloadedState,
});

export default store;
