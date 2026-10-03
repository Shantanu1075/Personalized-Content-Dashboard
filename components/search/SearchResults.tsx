 "use client";

import { useGetNewsQuery } from "@/store/api/newsApi";
import { useGetMoviesQuery } from "@/store/api/tmdbApi";
import { useGetSocialPostsQuery } from "@/store/api/socialApi";

export default function SearchResults({ query, onSelect }: { query: string; onSelect?: () => void }) {
  const normalized = query.trim().toLowerCase();
  const news = useGetNewsQuery({ category: "technology" });
  const movies = useGetMoviesQuery({});
  const social = useGetSocialPostsQuery({});

  const items = [
    ...(news.data?.articles ?? [])
      .filter((item) => {
        if (!normalized) return true;
        return `${item.title} ${item.description ?? ""} ${item.author ?? ""} ${item.source?.name ?? ""}`
          .toLowerCase()
          .includes(normalized);
      })
      .slice(0, 3)
      .map((item) => ({ id: item.url, title: item.title, type: "News", url: item.url })),
    ...(movies.data?.results ?? [])
      .filter((item) => {
        if (!normalized) return true;
        return `${item.title} ${item.overview ?? ""}`.toLowerCase().includes(normalized);
      })
      .slice(0, 3)
      .map((item) => ({
        id: String(item.id),
        title: item.title,
        type: "Movie",
        url: `https://www.themoviedb.org/movie/${item.id}`,
      })),
    ...(social.data ?? [])
      .filter((item) => {
        if (!normalized) return true;
        return `${item.text} ${item.author} ${item.hashtag} ${item.handle}`.toLowerCase().includes(normalized);
      })
      .slice(0, 3)
      .map((item) => ({ id: item.id, title: item.text, type: "Social", url: "#" })),
  ];

  return (
    <div className="absolute left-0 right-0 top-16 z-40 max-h-96 overflow-auto rounded-2xl border border-(--border) bg-(--surface) p-3 shadow-2xl">
      {items.length ? (
        items.map((item) => {
          const content = (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{item.type}</p>
              <p className="mt-1 text-sm font-semibold">{item.title}</p>
            </>
          );

          if (item.url && item.url !== "#") {
            return (
              <a
                key={`${item.type}-${item.id}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={onSelect}
                className="block rounded-xl p-3 hover:bg-(--surface-muted)"
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              onClick={onSelect}
              className="block w-full rounded-xl p-3 text-left hover:bg-(--surface-muted)"
            >
              {content}
            </button>
          );
        })
      ) : (
        <p className="p-4 text-sm text-(--muted)">No results found.</p>
      )}
    </div>
  );
}