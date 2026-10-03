import type {
  Category,
  Theme,
  UserPreferences,
} from "@/types/preferences";

const PREFERENCES_KEY =
  "personalized-dashboard-preferences";

const THEME_KEY =
  "personalized-dashboard-theme";

export function readStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = localStorage.getItem(key);

    if (stored === null) {
      return fallback;
    }

    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(
  key: string,
  value: T
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export function savePreferences(
  preferences: UserPreferences
): void {
  writeStorage(PREFERENCES_KEY, preferences);
}

export function loadPreferences(): UserPreferences | null {

  const preferences = readStorage<UserPreferences | null>(
    PREFERENCES_KEY,
    null
  );

  if (!preferences) {
    return null;
  }

  const validCategories = preferences.categories.filter(
    (category): category is Category =>
      [
        "technology",
        "sports",
        "business",
        "health",
        "science",
        "entertainment",
      ].includes(category)
  );

  return {
    categories: validCategories,
  };
}

export function saveTheme(theme: Theme): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(THEME_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return null;
}