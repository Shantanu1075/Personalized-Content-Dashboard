import { act, render, screen, waitFor } from "@testing-library/react";
import Feed from "@/components/content/Feed";

const state = {
  preferences: { categories: ["technology", "entertainment"] },
  dashboard: { items: [] },
  favorites: [],
};

const pageOneNews = [
  { title: "News 1", url: "https://example.com/news-1", description: "First story", source: { name: "Example" }, author: "Author 1", publishedAt: "2026-10-01" },
  { title: "News 2", url: "https://example.com/news-2", description: "Second story", source: { name: "Example" }, author: "Author 2", publishedAt: "2026-10-02" },
];

const pageTwoNews = [
  { title: "News 3", url: "https://example.com/news-3", description: "Third story", source: { name: "Example" }, author: "Author 3", publishedAt: "2026-10-03" },
  { title: "News 4", url: "https://example.com/news-4", description: "Fourth story", source: { name: "Example" }, author: "Author 4", publishedAt: "2026-10-04" },
];

const pageOneMovies = [
  { id: 101, title: "Movie 1", overview: "Movie one", poster_path: "/movie-1.jpg", vote_average: 7.6, release_date: "2026-10-01" },
  { id: 102, title: "Movie 2", overview: "Movie two", poster_path: "/movie-2.jpg", vote_average: 8.1, release_date: "2026-10-02" },
];

const pageTwoMovies = [
  { id: 103, title: "Movie 3", overview: "Movie three", poster_path: "/movie-3.jpg", vote_average: 8.4, release_date: "2026-10-03" },
  { id: 104, title: "Movie 4", overview: "Movie four", poster_path: "/movie-4.jpg", vote_average: 8.8, release_date: "2026-10-04" },
];

const mockNewsQuery = jest.fn(({ page }: { page?: number } = {}) => ({
  data: page === 1 ? { articles: pageOneNews, totalResults: 24 } : { articles: pageTwoNews, totalResults: 24 },
  isLoading: false,
  isFetching: false,
  error: undefined,
}));

const mockMoviesQuery = jest.fn(({ page }: { page?: number } = {}) => ({
  data: page === 1 ? { results: pageOneMovies, total_pages: 2 } : { results: pageTwoMovies, total_pages: 2 },
  isLoading: false,
  isFetching: false,
  error: undefined,
}));

const mockSocialQuery = jest.fn(() => ({ data: [], isLoading: false, error: undefined, isFetching: false }));
const triggerNewsPage = jest.fn(({ page }: { page?: number } = {}) => ({
  unwrap: async () => ({
    articles: page === 1 ? pageOneNews : pageTwoNews,
    totalResults: 24,
  }),
}));
const triggerMoviePage = jest.fn(({ page }: { page?: number } = {}) => ({
  unwrap: async () => ({
    results: page === 1 ? pageOneMovies : pageTwoMovies,
    total_pages: 2,
  }),
}));

jest.mock("@/store/api/newsApi", () => ({
  useLazyGetNewsQuery: () => [triggerNewsPage, mockNewsQuery({ page: 1 })],
}));

jest.mock("@/store/api/tmdbApi", () => ({
  useLazyGetMoviesQuery: () => [triggerMoviePage, mockMoviesQuery({ page: 1 })],
}));

jest.mock("@/store/api/socialApi", () => ({
  useGetSocialPostsQuery: () => mockSocialQuery(),
}));

jest.mock("@/hooks/useAppDispatch", () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock("@/hooks/useAppSelector", () => ({
  useAppSelector: (selector: (value: typeof state) => unknown) => selector(state),
}));

let triggerIntersection: (() => void) | undefined;

beforeEach(() => {
  jest.clearAllMocks();
  triggerIntersection = undefined;

  (globalThis as typeof globalThis & { IntersectionObserver?: unknown }).IntersectionObserver = class {
    observe = jest.fn((target: Element) => {
      triggerIntersection = () => this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    });

    disconnect = jest.fn();
    unobserve = jest.fn();

    callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
  } as unknown as typeof IntersectionObserver;
});

describe("Feed infinite scroll", () => {
  test("renders the feed without a Load More button and appends new pages when the sentinel is visible", async () => {
    render(<Feed />);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
      expect(screen.getByText("News 1")).toBeInTheDocument();
    });

    act(() => {
      triggerIntersection?.();
      triggerIntersection?.();
      triggerIntersection?.();
    });

    await waitFor(() => {
      expect(screen.getByText("News 3")).toBeInTheDocument();
    });

    expect(screen.getAllByText("News 3")).toHaveLength(1);
  });
});
