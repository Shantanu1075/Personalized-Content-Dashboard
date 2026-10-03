 "use client";

import CategorySelector from "./CategorySelector";
import ThemeToggle from "./ThemeToggle";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function PreferencesPanel() {
  const categories = useAppSelector((state) => state.preferences.categories);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">Personalization</p>
        <h1 className="mt-2 text-4xl font-black">Settings</h1>
        <p className="mt-2 text-(--muted)">Choose what you want to see in your dashboard.</p>
      </div>

      <section className="rounded-3xl border border-(--border) bg-(--surface) p-6">
        <h2 className="text-xl font-black">Favorite categories</h2>
        <p className="mt-1 mb-5 text-sm text-(--muted)">
          Selected: {categories.length ? categories.join(", ") : "none"}
        </p>
        <CategorySelector />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-black">Appearance</h2>
        <ThemeToggle />
      </section>
    </div>
  );
}

