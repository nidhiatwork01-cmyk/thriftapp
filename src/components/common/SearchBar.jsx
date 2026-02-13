import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { CATEGORIES } from "../../utils/constants";
import {
  searchProducts,
  filterByCategory,
  loadAllProducts,
} from "../../redux/slices/productSlice";

const SearchBar = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(CATEGORIES.ALL);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      dispatch(loadAllProducts());
    } else {
      dispatch(searchProducts(value));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    dispatch(filterByCategory(value));
  };

  const bg = isDarkMode ? "app-panel" : "app-panel-strong";
  const text = isDarkMode ? "text-gray-100" : "text-gray-800";
  const placeholder = isDarkMode ? "placeholder-gray-400" : "placeholder-gray-400";

  return (
    <div className="w-full flex flex-col md:flex-row gap-2">
      <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border ${bg}`}>
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search thrifted gems, brands, categories..."
          className={`flex-1 outline-none text-sm ${text} ${placeholder} bg-transparent`}
        />
      </div>

      <select
        value={category}
        onChange={handleCategoryChange}
        className={`md:w-52 w-full px-3 py-2 rounded-xl border text-sm ${
          isDarkMode
            ? "app-panel text-gray-100"
            : "app-panel-strong text-gray-700"
        }`}
      >
        {Object.values(CATEGORIES).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
