"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLazyGetNewsQuery } from "@/store/api/newsApi";
import { useLazyGetMoviesQuery } from "@/store/api/tmdbApi";
import { useGetSocialPostsQuery } from "@/store/api/socialApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { reorderItems } from "@/store/slices/dashboardSlice";
import ContentCard from "./ContentCard";
import ContentSection from "./ContentSection";
import LoadingCard from "./LoadingCard";
import EmptyState from "./EmptyState";
import type { ContentItem } from "@/types/content";
import { TMDB_IMAGE } from "@/lib/constants";

const PAGE_SIZE = 12;

function buildNewsItems(data: { articles?: Array<{ title: string; description?: string | null; url: string; urlToImage?: string | null; source?: { name?: string }; author?: string | null; publishedAt: string }> } | undefined, category: string): ContentItem[] {
  return (data?.articles ?? []).slice(0, PAGE_SIZE).map((article, index) => ({
    id: `news-${article.url}-${index}`,
    type: "news",
    title: article.title,
    description: article.description ?? "",
    image: article.urlToImage ?? undefined,
    url: article.url,
    source: article.source?.name ?? "News",
    category,
    author: article.author ?? undefined,
    publishedAt: article.publishedAt,
  }));
}

function buildMovieItems(data: { results?: Array<{ id: number; title: string; overview?: string; poster_path?: string | null; vote_average?: number; release_date?: string }> } | undefined): ContentItem[] {
  return (data?.results ?? []).slice(0, PAGE_SIZE).map((movie) => ({
    id: `movie-${movie.id}`,
    type: "movie",
    title: movie.title,
    description: movie.overview ?? "",
    image: movie.poster_path ? `${TMDB_IMAGE}${movie.poster_path}` : undefined,
    url: `https://www.themoviedb.org/movie/${movie.id}`,
    source: "TMDB",
    category: "entertainment",
    rating: movie.vote_average,
    publishedAt: movie.release_date,
  }));
}

function SortableCard({ item }: { item: ContentItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`sortable-card-${item.id}`}
      className={isDragging ? "scale-[1.02] shadow-xl shadow-indigo-500/10" : ""}
    >
      <ContentCard item={item} dragHandle />
    </div>
  );
}

export default function Feed() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.preferences.categories);
  const dashboardItems = useAppSelector((state) => state.dashboard.items);

  const [newsPage, setNewsPage] = useState(1);
  const [moviePage, setMoviePage] = useState(1);
  const [feedId] = useState("personalized-feed");
  const [newsPages, setNewsPages] = useState<Record<number, ContentItem[]>>({});
  const [moviePages, setMoviePages] = useState<Record<number, ContentItem[]>>({});
  const [newsMeta, setNewsMeta] = useState({ totalResults: 0 });
  const [movieMeta, setMovieMeta] = useState({ totalPages: 0 });
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [newsError, setNewsError] = useState<unknown>(null);
  const [movieError, setMovieError] = useState<unknown>(null);

  const requestedNewsPagesRef = useRef<Record<number, boolean>>({});
  const requestedMoviePagesRef = useRef<Record<number, boolean>>({});
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const feedRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedRootRef.current) {
      feedRootRef.current.setAttribute("data-feed-id", feedId);
    }
  }, [feedId]);
  const triggerNewsPageRef = useRef<ReturnType<typeof useLazyGetNewsQuery>[0] | null>(null);
  const triggerMoviePageRef = useRef<ReturnType<typeof useLazyGetMoviesQuery>[0] | null>(null);
  const fetchNewsPageRef = useRef<((page: number) => Promise<unknown> | null) | null>(null);
  const fetchMoviePageRef = useRef<((page: number) => Promise<unknown> | null) | null>(null);
  const previousCategoryRef = useRef<string>(categories[0] ?? "technology");
  const initializedCategoryRef = useRef<string | null>(null);

  const primaryCategory = categories[0] ?? "technology";
  const [triggerNewsPage, newsQuery] = useLazyGetNewsQuery();
  const [triggerMoviePage, movieQuery] = useLazyGetMoviesQuery();
  const social = useGetSocialPostsQuery({});

  const fetchNewsPage = useCallback(async (page: number) => {
    if (requestedNewsPagesRef.current[page] || !triggerNewsPageRef.current) {
      return null;
    }

    requestedNewsPagesRef.current = { ...requestedNewsPagesRef.current, [page]: true };
    setIsNewsLoading(true);
    setNewsError(null);

    try {
      const response = await triggerNewsPageRef.current({ category: primaryCategory, page }).unwrap();
      setNewsMeta({ totalResults: response.totalResults ?? 0 });
      const nextItems = buildNewsItems(response, primaryCategory);
      setNewsPages((current) => {
        const currentItems = current[page];
        const sameItems = currentItems && currentItems.length === nextItems.length && currentItems.every((item, index) => item.id === nextItems[index]?.id);
        if (sameItems) {
          return current;
        }
        return { ...current, [page]: nextItems };
      });
      return response;
    } catch (error) {
      setNewsError(error);
      return null;
    } finally {
      setIsNewsLoading(false);
    }
  }, [primaryCategory]);

  const fetchMoviePage = useCallback(async (page: number) => {
    if (requestedMoviePagesRef.current[page] || !triggerMoviePageRef.current) {
      return null;
    }

    requestedMoviePagesRef.current = { ...requestedMoviePagesRef.current, [page]: true };
    setIsMovieLoading(true);
    setMovieError(null);

    try {
      const response = await triggerMoviePageRef.current({ page }).unwrap();
      setMovieMeta({ totalPages: response.total_pages ?? 0 });
      const nextItems = buildMovieItems(response);
      setMoviePages((current) => {
        const currentItems = current[page];
        const sameItems = currentItems && currentItems.length === nextItems.length && currentItems.every((item, index) => item.id === nextItems[index]?.id);
        if (sameItems) {
          return current;
        }
        return { ...current, [page]: nextItems };
      });
      return response;
    } catch (error) {
      setMovieError(error);
      return null;
    } finally {
      setIsMovieLoading(false);
    }
  }, []);

  useEffect(() => {
    triggerNewsPageRef.current = triggerNewsPage;
  }, [triggerNewsPage]);

  useEffect(() => {
    triggerMoviePageRef.current = triggerMoviePage;
  }, [triggerMoviePage]);

  useEffect(() => {
    fetchNewsPageRef.current = fetchNewsPage;
  }, [fetchNewsPage]);

  useEffect(() => {
    fetchMoviePageRef.current = fetchMoviePage;
  }, [fetchMoviePage]);

  useEffect(() => {
    const categoryChanged = previousCategoryRef.current !== primaryCategory;
    previousCategoryRef.current = primaryCategory;

    if (categoryChanged) {
      requestedNewsPagesRef.current = {};
      requestedMoviePagesRef.current = {};
      initializedCategoryRef.current = null;
      setNewsPage(1);
      setMoviePage(1);
      setNewsPages({});
      setMoviePages({});
      setNewsMeta({ totalResults: 0 });
      setMovieMeta({ totalPages: 0 });
      setNewsError(null);
      setMovieError(null);
    }

    if (initializedCategoryRef.current === primaryCategory) {
      return;
    }

    initializedCategoryRef.current = primaryCategory;
    void fetchNewsPageRef.current?.(1);
    void fetchMoviePageRef.current?.(1);
  }, [primaryCategory]);

  const currentNewsItems = useMemo(() => {
    const current = newsPages[newsPage];
    return current ?? (newsQuery.data ? buildNewsItems(newsQuery.data, primaryCategory) : []);
  }, [newsPage, newsPages, newsQuery.data, primaryCategory]);

  const currentMovieItems = useMemo(() => {
    const current = moviePages[moviePage];
    return current ?? (movieQuery.data ? buildMovieItems(movieQuery.data) : []);
  }, [moviePage, moviePages, movieQuery.data]);

  const allNewsItems = useMemo(() => {
    const previousPages = Object.values(newsPages).flat();
    const merged = [...previousPages, ...currentNewsItems];
    const seen = new Set<string>();
    return merged.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [newsPages, currentNewsItems]);

  const allMovieItems = useMemo(() => {
    const previousPages = Object.values(moviePages).flat();
    const merged = [...previousPages, ...currentMovieItems];
    const seen = new Set<string>();
    return merged.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [moviePages, currentMovieItems]);

  const socialItems = useMemo<ContentItem[]>(() => {
    return (social.data ?? []).map((post) => ({
      id: post.id,
      type: "social",
      title: `${post.author} ${post.handle}`,
      description: post.text,
      image: post.image,
      url: "#",
      source: "Mock Social",
      category: post.hashtag.replace("#", ""),
      publishedAt: post.createdAt,
    }));
  }, [social.data]);

  const combined = useMemo<ContentItem[]>(() => [...allNewsItems, ...allMovieItems, ...socialItems], [allNewsItems, allMovieItems, socialItems]);
  const displayItems = dashboardItems.length ? dashboardItems : combined;

  const hasMoreNews = useMemo(() => {
    if (newsMeta.totalResults > 0) {
      return newsPage * PAGE_SIZE < newsMeta.totalResults;
    }
    const pageSize = newsPages[newsPage]?.length ?? 0;
    return pageSize >= PAGE_SIZE;
  }, [newsMeta.totalResults, newsPage, newsPages]);

  const hasMoreMovies = useMemo(() => {
    if (movieMeta.totalPages > 0) {
      return moviePage < movieMeta.totalPages;
    }
    const pageSize = moviePages[moviePage]?.length ?? 0;
    return pageSize >= PAGE_SIZE;
  }, [movieMeta.totalPages, moviePage, moviePages]);

  const loadNextNewsPage = useCallback(() => {
    const nextPage = newsPage + 1;
    if (!hasMoreNews || isNewsLoading || requestedNewsPagesRef.current[nextPage]) {
      return;
    }

    void fetchNewsPage(nextPage).then(() => {
      setNewsPage(nextPage);
    });
  }, [fetchNewsPage, hasMoreNews, isNewsLoading, newsPage]);

  const loadNextMoviePage = useCallback(() => {
    const nextPage = moviePage + 1;
    if (!hasMoreMovies || isMovieLoading || requestedMoviePagesRef.current[nextPage]) {
      return;
    }

    void fetchMoviePage(nextPage).then(() => {
      setMoviePage(nextPage);
    });
  }, [fetchMoviePage, hasMoreMovies, isMovieLoading, moviePage]);

  const loadingMore = isNewsLoading || isMovieLoading;
  const hasMore = hasMoreNews || hasMoreMovies;

  useEffect(() => {
    const node = sentinelRef.current;
    const root = feedRootRef.current ?? null;
    if (!node || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || loadingMore) {
          return;
        }

        if (hasMoreNews) {
          loadNextNewsPage();
        }

        if (hasMoreMovies) {
          loadNextMoviePage();
        }
      },
      { root: root, rootMargin: "260px 0px", threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, hasMoreMovies, hasMoreNews, loadNextMoviePage, loadNextNewsPage, loadingMore]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = displayItems.findIndex((item) => item.id === active.id);
    const newIndex = displayItems.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    dispatch(reorderItems(arrayMove(displayItems, oldIndex, newIndex)));
  }

  const initialLoading = displayItems.length === 0 && (isNewsLoading || isMovieLoading || social.isLoading);
  const error = newsError || movieError || social.error;

  return (
    <div ref={feedRootRef} className="h-full min-h-0 overflow-y-auto">
      <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-700 p-6 text-white sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">Your daily briefing</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black sm:text-5xl">Everything you care about, in one feed.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
          Personalized news, movie recommendations and social discussions based on your selected interests.
        </p>
      </section>

      <ContentSection title="Personalized Feed" subtitle={`Showing content for ${categories.join(", ") || "your interests"}. Drag cards to customize the order.`}>
        {initialLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)}
          </div>
        ) : error ? (
          <EmptyState title="Some content could not be loaded" description="Check your API keys in .env.local and try refreshing the page." />
        ) : displayItems.length === 0 ? (
          <EmptyState title="No content found" description="Choose more categories in Settings." />
        ) : (
          <>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              accessibility={{ restoreFocus: false }}
            >
              <SortableContext items={displayItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {displayItems.map((item) => <SortableCard key={item.id} item={item} />)}
                </div>
              </SortableContext>
            </DndContext>

            <div aria-live="polite" aria-busy={loadingMore ? "true" : "false"}>
              {loadingMore && (
                <div className="mt-6 flex items-center justify-center h-12">
                  <span className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-t-transparent border-(--muted)" aria-hidden="true" />
                  <span className="sr-only">Loading more content</span>
                </div>
              )}

              {hasMore ? (
                <div ref={sentinelRef} className="mt-6 h-1 w-full" aria-hidden="true" />
              ) : (
                <p className="mt-6 text-center text-sm text-(--muted)">You’ve reached the end of the available content.</p>
              )}
            </div>
          </>
        )}
      </ContentSection>

      {/* Trending moved to a dedicated component/layout slot to avoid interfering with infinite scroll */}
      </div>
    </div>
  );
}

