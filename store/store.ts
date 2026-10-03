import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./slices/preferencesSlice";
import favoritesReducer from "./slices/favoritesSlice";
import dashboardReducer from "./slices/dashboardSlice";
import themeReducer from "./slices/themeSlice";
import { newsApi } from "./api/newsApi";
import { tmdbApi } from "./api/tmdbApi";
import { socialApi } from "./api/socialApi";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [socialApi.reducerPath]: socialApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(newsApi.middleware)
      .concat(tmdbApi.middleware)
      .concat(socialApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;