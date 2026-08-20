import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/api";
import { getFromLocalStorage, saveToLocalStorage } from "../../utils/localStorage";

const PRODUCTS_CACHE_KEY = "cachedProducts";

const getCachedProducts = () => {
  const cached = getFromLocalStorage(PRODUCTS_CACHE_KEY, []);
  return Array.isArray(cached) ? cached : [];
};

const cachedProducts = getCachedProducts();

const initialState = {
  products: cachedProducts,
  filteredProducts: [],
  selectedCategory: "All Categories",
  searchQuery: "",
  loading: false,
  creating: false,
  error: "",
};

const filterAvailableProducts = (products = []) =>
  products.filter((p) => p.status === "available");

const applyProductFilters = (
  products = [],
  selectedCategory = "All Categories",
  searchQuery = ""
) => {
  let filtered = filterAvailableProducts(products);

  if (selectedCategory && selectedCategory !== "All Categories") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  const query = String(searchQuery || "").trim().toLowerCase();
  if (!query) {
    return filtered;
  }

  return filtered.filter(
    (p) =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
  );
};

const withFriendlyNetworkError = (error, fallbackMessage) => {
  const rawMessage = error?.message || "";

  if (/just a moment|cloudflare|challenge|bot protection/i.test(rawMessage)) {
    return "Backend security challenge triggered (Cloudflare/Render bot protection). Please set REACT_APP_API_BASE_URL in Vercel to connect directly.";
  }

  if (
    error?.name === "TypeError" ||
    /failed to fetch|networkerror|load failed/i.test(rawMessage)
  ) {
    return "Cannot reach backend. If using Render free tier, the server may be waking up from sleep (takes ~45s). Please wait a moment and click Retry.";
  }

  if (/non-json response/i.test(rawMessage) || /html error page/i.test(rawMessage)) {
    return "Received non-JSON response from API. Verify REACT_APP_API_BASE_URL points directly to your backend.";
  }

  if (/cors blocked/i.test(rawMessage)) {
    return "Request blocked by CORS. Add your frontend domain to backend CORS_ORIGIN.";
  }

  return rawMessage || fallbackMessage;
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkApi) => {
  const maxRetries = 2;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        let message = `Failed to fetch products (HTTP ${response.status})`;
        const contentType = (response.headers.get("content-type") || "").toLowerCase();

        if (contentType.includes("application/json")) {
          const payload = await response.json().catch(() => ({}));
          if (payload?.message) {
            message = payload.message;
          }
        } else {
          const text = await response.text().catch(() => "");
          if (/just a moment/i.test(text) || /cloudflare/i.test(text)) {
            message = "Cloudflare/Render security challenge block";
          } else if (/<html|<!doctype/i.test(text)) {
            message = "Server returned HTML error page instead of JSON";
          } else if (text) {
            message = text.slice(0, 150);
          }
        }

        throw new Error(message);
      }

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("application/json")) {
        const text = await response.text().catch(() => "");
        if (/just a moment/i.test(text) || /cloudflare/i.test(text)) {
          throw new Error("Cloudflare/Render security challenge block");
        }
        throw new Error(`Non-JSON response from API (${contentType || "unknown content-type"})`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid products payload from server");
      }

      return data;
    } catch (error) {
      lastError = error;
      if (
        attempt < maxRetries &&
        (error?.name === "TypeError" || /failed to fetch|networkerror|load failed/i.test(error?.message || ""))
      ) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }
      break;
    }
  }

  return thunkApi.rejectWithValue(withFriendlyNetworkError(lastError, "Failed to fetch products"));
});

export const addProduct = createAsyncThunk("products/addProduct", async (payload, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("category", payload.category);
    formData.append("price", String(payload.price));
    formData.append("size", payload.size || "");
    formData.append("condition", payload.condition || "Good");
    formData.append("description", payload.description || "");
    formData.append("sellerEmail", payload.sellerEmail || "");
    formData.append("image", payload.imageFile);

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to add product");
    }

    return await response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(withFriendlyNetworkError(error, "Failed to add product"));
  }
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (productId, thunkApi) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return productId;
  } catch (error) {
    return thunkApi.rejectWithValue(withFriendlyNetworkError(error, "Failed to delete product"));
  }
});

export const markAsSold = createAsyncThunk("products/markAsSold", async (productId, thunkApi) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sold" }),
    });
    if (!response.ok) throw new Error("Failed to mark product as sold");
    return await response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(withFriendlyNetworkError(error, "Failed to mark product as sold"));
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    filterByCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = applyProductFilters(
        state.products,
        state.selectedCategory,
        state.searchQuery
      );
    },
    searchProducts: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredProducts = applyProductFilters(
        state.products,
        state.selectedCategory,
        state.searchQuery
      );
    },
    loadAllProducts: (state) => {
      state.searchQuery = "";
      state.filteredProducts = applyProductFilters(
        state.products,
        state.selectedCategory,
        state.searchQuery
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        saveToLocalStorage(PRODUCTS_CACHE_KEY, action.payload);
        state.filteredProducts = applyProductFilters(
          state.products,
          state.selectedCategory,
          state.searchQuery
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(addProduct.pending, (state) => {
        state.creating = true;
        state.error = "";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.creating = false;
        state.products.unshift(action.payload);
        state.filteredProducts = applyProductFilters(
          state.products,
          state.selectedCategory,
          state.searchQuery
        );
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to add product";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.filteredProducts = applyProductFilters(
          state.products,
          state.selectedCategory,
          state.searchQuery
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete product";
      })
      .addCase(markAsSold.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
        state.filteredProducts = applyProductFilters(
          state.products,
          state.selectedCategory,
          state.searchQuery
        );
      })
      .addCase(markAsSold.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark product as sold";
      });
  },
});

export const { filterByCategory, searchProducts, loadAllProducts } = productSlice.actions;

export default productSlice.reducer;
