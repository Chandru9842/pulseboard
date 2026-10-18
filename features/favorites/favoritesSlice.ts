import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentType, UnifiedContentItem } from "@/types/content";

export interface FavoritesState {
  items: UnifiedContentItem[];
  filterType: "all" | ContentType;
  searchQuery: string;
}

const initialState: FavoritesState = {
  items: [],
  filterType: "all",
  searchQuery: "",
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<UnifiedContentItem>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<UnifiedContentItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
    setFavoritesFilter: (state, action: PayloadAction<"all" | ContentType>) => {
      state.filterType = action.payload;
    },
    setFavoritesSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    loadSavedFavorites: (state, action: PayloadAction<UnifiedContentItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  setFavoritesFilter,
  setFavoritesSearch,
  loadSavedFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
