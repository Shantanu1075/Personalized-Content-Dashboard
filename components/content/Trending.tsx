"use client";

import ContentSection from "./ContentSection";
import ContentCard from "./ContentCard";
import { TMDB_IMAGE } from "@/lib/constants";
import { useGetMoviesQuery } from "@/store/api/tmdbApi";

export default function Trending() {
  const { data } = useGetMoviesQuery({ q: "", page: 1 });
  const items = (data?.results ?? []).slice(0, 6);

  return (
    <ContentSection title="Trending" subtitle="A quick mix of current movies and community discussions.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
        {items.map((movie) => (
          <ContentCard
            key={`trend-${movie.id}`}
            item={{
              id: `trend-${movie.id}`,
              type: "movie",
              title: movie.title,
              description: movie.overview ?? "",
              image: movie.poster_path ? `${TMDB_IMAGE}${movie.poster_path}` : undefined,
              url: `https://www.themoviedb.org/movie/${movie.id}`,
              source: "TMDB Trending",
              category: "entertainment",
              rating: movie.vote_average,
              publishedAt: movie.release_date,
            }}
          />
        ))}
      </div>
    </ContentSection>
  );
}
