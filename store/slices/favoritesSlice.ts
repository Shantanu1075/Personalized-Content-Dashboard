import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentItem } from "@/types/content";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: [] as ContentItem[],
  reducers: {
    toggleFavorite(state, action: PayloadAction<ContentItem>) {
      const exists = state.some((item) => item.id === action.payload.id);
      if (exists) return state.filter((item) => item.id !== action.payload.id);
      state.push(action.payload);
    },
    clearFavorites() {
      return [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;