import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DEFAULT_PREFERENCES,
  ThemeMode,
  UserPreferences,
  ViewMode,
} from "@/types/preferences";

const initialState: UserPreferences = {
  ...DEFAULT_PREFERENCES,
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    toggleCompactView: (state) => {
      state.compactView = !state.compactView;
    },
    setCompactView: (state, action: PayloadAction<boolean>) => {
      state.compactView = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.categories.indexOf(category);
      if (index >= 0) {
        // Keep at least one category selected
        if (state.categories.length > 1) {
          state.categories.splice(index, 1);
        }
      } else {
        state.categories.push(category);
      }
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      if (action.payload.length > 0) {
        state.categories = action.payload;
      }
    },
    toggleHashtag: (state, action: PayloadAction<string>) => {
      const hashtag = action.payload;
      const index = state.hashtags.indexOf(hashtag);
      if (index >= 0) {
        if (state.hashtags.length > 1) {
          state.hashtags.splice(index, 1);
        }
      } else {
        state.hashtags.push(hashtag);
      }
    },
    setHashtags: (state, action: PayloadAction<string[]>) => {
      if (action.payload.length > 0) {
        state.hashtags = action.payload;
      }
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshIntervalSeconds = action.payload;
    },
    setContentOrder: (state, action: PayloadAction<string[]>) => {
      state.contentOrder = action.payload;
    },
    resetPreferences: () => {
      return { ...DEFAULT_PREFERENCES };
    },
    loadSavedPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  setTheme,
  setViewMode,
  toggleCompactView,
  setCompactView,
  toggleCategory,
  setCategories,
  toggleHashtag,
  setHashtags,
  toggleAutoRefresh,
  setAutoRefresh,
  setRefreshInterval,
  setContentOrder,
  resetPreferences,
  loadSavedPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
