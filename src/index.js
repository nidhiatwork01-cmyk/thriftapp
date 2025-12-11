import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "./context/ThemeContext"; // ⭐ NEW
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider> {/* ⭐ WRAP APP WITH THEME PROVIDER */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);