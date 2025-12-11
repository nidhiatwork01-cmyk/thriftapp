import { createSlice } from "@reduxjs/toolkit";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  items: getFromLocalStorage("cartItems") || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (i) => i.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: `CART${Date.now()}`,
          product,
          quantity: 1,
        });
      }

      saveToLocalStorage("cartItems", state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToLocalStorage("cartItems", state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      saveToLocalStorage("cartItems", state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage("cartItems", state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
