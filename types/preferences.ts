export const CATEGORIES = [
  "technology",
  "sports",
  "business",
  "health",
  "science",
  "entertainment",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Theme = "light" | "dark";

export interface UserPreferences {
  categories: Category[];
}