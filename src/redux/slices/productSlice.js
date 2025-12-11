import { createSlice } from '@reduxjs/toolkit';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/localStorage';

const initialState = {
  products: getFromLocalStorage('products') || [],
  filteredProducts: [],
  selectedCategory: 'All Categories',
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: `PROD${Date.now()}`,
        listedAt: new Date().toISOString(),
        status: 'available',
      };
      state.products.push(newProduct);
      saveToLocalStorage('products', state.products);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
        saveToLocalStorage('products', state.products);
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      saveToLocalStorage('products', state.products);
    },
    markAsSold: (state, action) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product) {
        product.status = 'sold';
        product.soldAt = new Date().toISOString();
        saveToLocalStorage('products', state.products);
      }
    },
    filterByCategory: (state, action) => {
      state.selectedCategory = action.payload;
      if (action.payload === 'All Categories') {
        state.filteredProducts = state.products.filter(p => p.status === 'available');
      } else {
        state.filteredProducts = state.products.filter(
          p => p.category === action.payload && p.status === 'available'
        );
      }
    },
    searchProducts: (state, action) => {
      state.searchQuery = action.payload;
      const query = action.payload.toLowerCase();
      state.filteredProducts = state.products.filter(
        p => p.status === 'available' && (
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
        )
      );
    },
    loadAllProducts: (state) => {
      state.filteredProducts = state.products.filter(p => p.status === 'available');
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  markAsSold,
  filterByCategory,
  searchProducts,
  loadAllProducts,
} = productSlice.actions;

export default productSlice.reducer;