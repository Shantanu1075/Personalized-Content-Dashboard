"use client";

import ContentGrid from "@/components/content/ContentGrid";
import EmptyState from "@/components/content/EmptyState";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function FavoritesList() {
  const favorites = useAppSelector((state) => state.favorites);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">Saved content</p>
        <h1 className="mt-2 text-4xl font-black">Favorites</h1>
        <p className="mt-2 text-(--muted)">Everything you saved for later.</p>
      </div>
      {favorites.length ? (
        <ContentGrid items={favorites} />
      ) : (
        <EmptyState title="No favorites yet" description="Use the heart button on any content card to save it here." />
      )}
    </div>
  );
}