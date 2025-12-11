import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage, getFromLocalStorage } from "../../utils/localStorage";

const initialState = {
  items: getFromLocalStorage("wishlistItems") || [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existing) {
        state.items = state.items.filter(
          (item) => item.product.id !== action.payload.id
        );
      } else {
        state.items.push({ product: action.payload });
      }

      saveToLocalStorage("wishlistItems", state.items);
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );

      saveToLocalStorage("wishlistItems", state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveToLocalStorage("wishlistItems", state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
