"use client";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toggleTheme } from "@/store/slices/themeSlice";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="flex w-full items-center justify-between rounded-2xl border border-(--border) bg-(--surface) p-4 text-left"
    >
      <div>
        <p className="font-bold">Dark mode</p>
        <p className="text-sm text-(--muted)">Currently using {theme} mode.</p>
      </div>
      <span className="rounded-full bg-(--surface-muted) px-3 py-1 text-sm">{theme === "dark" ? "On" : "Off"}</span>
    </button>
  );
}