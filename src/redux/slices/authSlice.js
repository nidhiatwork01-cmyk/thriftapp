// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage, getFromLocalStorage } from "../../utils/localStorage";

const initialState = {
  users: getFromLocalStorage("users") || [],
  user: getFromLocalStorage("user") || null,
  isAuthenticated: getFromLocalStorage("isAuthenticated") || false,
  userMode: getFromLocalStorage("userMode") || "buyer",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action) => {
      const newUser = {
        ...action.payload,
        id: `USER${Date.now()}`,
        isSeller: false,
      };

      state.users.push(newUser);
      state.user = newUser;
      state.isAuthenticated = true;

      // PERSIST
      saveToLocalStorage("users", state.users);
      saveToLocalStorage("user", state.user);
      saveToLocalStorage("isAuthenticated", true);
    },

    login: (state, action) => {
      const loggedInUser = state.users.find(
        (u) =>
          u.email === action.payload.email &&
          u.password === action.payload.password
      );

      if (loggedInUser) {
        state.user = loggedInUser;
        state.isAuthenticated = true;

        // PERSIST
        saveToLocalStorage("user", state.user);
        saveToLocalStorage("isAuthenticated", true);
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      saveToLocalStorage("isAuthenticated", false);
      saveToLocalStorage("user", null);
    },

    switchMode: (state, action) => {
      state.userMode = action.payload;
      saveToLocalStorage("userMode", state.userMode);
    },

    updateSellerDetails: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveToLocalStorage("user", state.user);
    },
  },
});

export const { signup, login, logout, switchMode, updateSellerDetails } =
  authSlice.actions;

export default authSlice.reducer;
