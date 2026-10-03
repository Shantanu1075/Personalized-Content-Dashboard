"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Provider, useSelector } from "react-redux";

import { store } from "@/store/store";
import { setCategories } from "@/store/slices/preferencesSlice";
import { setTheme } from "@/store/slices/themeSlice";
import { loadPreferences, loadTheme, saveTheme } from "@/lib/storage";
import type { RootState } from "@/store/store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function ThemeSync() {
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
    saveTheme(theme);
  }, [theme]);

  return null;
}

export function ReduxProvider({
  children,
}: ReduxProviderProps) {
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const savedPreferences = loadPreferences();
    const savedTheme = loadTheme();

    if (savedPreferences?.categories) {
      store.dispatch(
        setCategories(savedPreferences.categories)
      );
    }

    if (savedTheme) {
      store.dispatch(setTheme(savedTheme));
    }
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeSync />
      {children}
    </Provider>
  );
}