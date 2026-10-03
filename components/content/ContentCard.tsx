"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import Badge from "@/components/ui/Badge";
import type { ContentItem } from "@/types/content";
import { formatDate } from "@/lib/utils";

export default function ContentCard({ item, dragHandle = false }: { item: ContentItem; dragHandle?: boolean }) {
  const dispatch = useAppDispatch();
  const favorite = useAppSelector((state) => state.favorites.some((entry) => entry.id === item.id));
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-sm"
    >
      {item.image && !imageFailed ? (
        <div className="relative h-44 overflow-hidden bg-slate-200">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            loading="lazy"
            unoptimized
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="grid h-44 place-items-center bg-linear-to-br from-indigo-500 to-violet-700 text-5xl text-white">
          {item.type === "movie" ? "🎬" : item.type === "social" ? "💬" : "📰"}
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge>{item.type}</Badge>
          {dragHandle && <span className="cursor-grab text-xs text-(--muted)">↕ drag</span>}
        </div>

        <h3 className="line-clamp-2 text-lg font-extrabold">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-(--muted)">{item.description || "No description available."}</p>

        <div className="mt-4 flex items-center justify-between text-xs text-(--muted)">
          <span>{item.source}</span>
          <span>{formatDate(item.publishedAt)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-indigo-500">
              {item.type === "movie" ? "View Movie" : item.type === "social" ? "Open Post" : "Read More"}
            </a>
          )}
          <button
            onClick={() => dispatch(toggleFavorite(item))}
            className="rounded-xl border border-(--border) px-3 py-2 text-lg"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
