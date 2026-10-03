import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category, UserPreferences } from "@/types/preferences";

const initialState: UserPreferences = {
  categories: ["technology", "entertainment"],
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<Category>) {
      const category = action.payload;
      state.categories = state.categories.includes(category)
        ? state.categories.filter((item) => item !== category)
        : [...state.categories, category];
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { toggleCategory, setCategories } = preferencesSlice.actions;
export default preferencesSlice.reducer;