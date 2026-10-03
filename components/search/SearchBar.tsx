 "use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchResults from "./SearchResults";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 450);

  useEffect(() => {
    // Debounced value is consumed by SearchResults.
  }, [debouncedQuery]);

  const handleSelect = () => {
    setQuery("");
  };

  return (
    <div className="relative">
      <label htmlFor="global-search" className="sr-only">Search content</label>
      <div className="flex items-center rounded-2xl border border-(--border) bg-(--surface) px-4">
        <span className="mr-2 text-(--muted)">⌕</span>
        <input
          id="global-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies, news or social posts..."
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </div>
      {debouncedQuery.trim() && <SearchResults query={debouncedQuery.trim()} onSelect={handleSelect} />}
    </div>
  );
}
