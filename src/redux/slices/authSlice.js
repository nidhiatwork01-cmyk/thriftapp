// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage, getFromLocalStorage } from "../../utils/localStorage";

const storedUser = getFromLocalStorage("user") || null;
const safeBuyerUser = storedUser && !storedUser.isSeller ? storedUser : null;

const initialState = {
  users: getFromLocalStorage("users") || [],
  user: safeBuyerUser,
  isAuthenticated: safeBuyerUser ? Boolean(getFromLocalStorage("isAuthenticated")) : false,
  userMode: "buyer",
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
      state.userMode = "buyer";

      // PERSIST
      saveToLocalStorage("users", state.users);
      saveToLocalStorage("user", state.user);
      saveToLocalStorage("isAuthenticated", true);
      saveToLocalStorage("userMode", "buyer");
    },

    login: (state, action) => {
      const loggedInUser = state.users.find(
        (u) =>
          !u.isSeller &&
          u.email === action.payload.email &&
          u.password === action.payload.password
      );

      if (loggedInUser) {
        state.user = loggedInUser;
        state.isAuthenticated = true;
        state.userMode = "buyer";

        // PERSIST
        saveToLocalStorage("user", state.user);
        saveToLocalStorage("isAuthenticated", true);
        saveToLocalStorage("userMode", state.userMode);
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userMode = "buyer";
      saveToLocalStorage("isAuthenticated", false);
      saveToLocalStorage("user", null);
      saveToLocalStorage("userMode", "buyer");
    },

    switchMode: (state, action) => {
      state.userMode = action.payload;
      saveToLocalStorage("userMode", state.userMode);
    },

    updateSellerDetails: (state, action) => {
      const currentUser = state.user || {};
      state.user = { ...currentUser, ...action.payload };

      if (state.user?.id) {
        state.users = state.users.map((u) =>
          u.id === state.user.id ? { ...u, ...action.payload } : u
        );
      }

      saveToLocalStorage("user", state.user);
      saveToLocalStorage("users", state.users);
    },

    setAuthenticatedUser: (state, action) => {
      const incomingUser = action.payload;
      if (!incomingUser) return;
      if (incomingUser.isSeller) return;

      state.user = incomingUser;
      state.isAuthenticated = true;
      state.userMode = "buyer";

      const existingIndex = state.users.findIndex((u) => u.id === incomingUser.id);
      if (existingIndex !== -1) {
        state.users[existingIndex] = { ...state.users[existingIndex], ...incomingUser };
      } else {
        state.users.push(incomingUser);
      }

      saveToLocalStorage("users", state.users);
      saveToLocalStorage("user", state.user);
      saveToLocalStorage("isAuthenticated", true);
      saveToLocalStorage("userMode", state.userMode);
    },
  },
});

export const { signup, login, logout, switchMode, updateSellerDetails, setAuthenticatedUser } =
  authSlice.actions;

export default authSlice.reducer;
