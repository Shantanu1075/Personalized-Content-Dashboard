"use client";

import { CATEGORIES, type Category } from "@/types/preferences";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toggleCategory } from "@/store/slices/preferencesSlice";

export default function CategorySelector() {
  const dispatch = useAppDispatch();

  const selectedCategories = useAppSelector(
    (state) => state.preferences.categories
  );

  const handleToggle = (category: Category) => {
    dispatch(toggleCategory(category));
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {CATEGORIES.map((category) => {
        const selected =
          selectedCategories.includes(category);

        return (
          <button
            key={category}
            type="button"
            onClick={() => handleToggle(category)}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium capitalize transition ${
              selected
                ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
                : "border-(--border) bg-(--surface) text-(--muted) hover:bg-(--surface-muted) hover:text-(--foreground)"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}