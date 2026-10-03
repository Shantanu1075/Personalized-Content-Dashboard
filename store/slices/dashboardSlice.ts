import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentItem } from "@/types/content";

interface DashboardState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  items: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<ContentItem[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    reorderItems(state, action: PayloadAction<ContentItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { setItems, setLoading, setError, reorderItems } = dashboardSlice.actions;
export default dashboardSlice.reducer;