"use client";

import Link from "next/link";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toggleTheme } from "@/store/slices/themeSlice";
import SearchBar from "@/components/search/SearchBar";

export default function Header() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  const favorites = useAppSelector((state) => state.favorites.length);

  return (
    <header className="sticky top-0 z-20 border-b border-(--border) bg-(--background)/90 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <Link href="/favorites" className="rounded-xl border border-(--border) px-3 py-2 text-sm font-semibold">
            ♡ {favorites}
          </Link>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm"
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link href="/settings" className="flex items-center gap-2 rounded-xl border border-(--border) px-3 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">S</span>
            <span className="hidden text-sm font-semibold sm:inline">Shantanu</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
