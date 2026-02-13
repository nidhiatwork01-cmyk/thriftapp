import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/api";

const initialState = {
  products: [],
  filteredProducts: [],
  selectedCategory: "All Categories",
  searchQuery: "",
  loading: false,
  creating: false,
  error: "",
};

const withFriendlyNetworkError = (error, fallbackMessage) => {
  if (error?.name === "TypeError") {
    return "Cannot reach server. Start backend with `npm run server` and check CORS/API URL.";
  }
  return error?.message || fallbackMessage;
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkApi) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(withFriendlyNetworkError(error, "Failed to fetch products"));
  }
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
      if (action.payload === "All Categories") {
        state.filteredProducts = state.products.filter((p) => p.status === "available");
      } else {
        state.filteredProducts = state.products.filter(
          (p) => p.category === action.payload && p.status === "available"
        );
      }
    },
    searchProducts: (state, action) => {
      state.searchQuery = action.payload;
      const query = action.payload.toLowerCase();
      state.filteredProducts = state.products.filter(
        (p) =>
          p.status === "available" &&
          (p.name?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query))
      );
    },
    loadAllProducts: (state) => {
      state.filteredProducts = state.products.filter((p) => p.status === "available");
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
        state.filteredProducts = action.payload.filter((p) => p.status === "available");
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
        state.filteredProducts = state.products.filter((p) => p.status === "available");
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to add product";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.filteredProducts = state.filteredProducts.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete product";
      })
      .addCase(markAsSold.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
        state.filteredProducts = state.products.filter((p) => p.status === "available");
      })
      .addCase(markAsSold.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark product as sold";
      });
  },
});

export const { filterByCategory, searchProducts, loadAllProducts } = productSlice.actions;

export default productSlice.reducer;
