import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { store } from "@/store/store";
import DashboardLayout from "@/components/layout/DashboardLayout";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

jest.mock("@/store/api/newsApi", () => ({
  newsApi: {
    reducerPath: "newsApi",
    reducer: (state = { queries: {}, mutations: {}, provided: {}, subscriptions: {}, entities: {} }) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
  useGetNewsQuery: () => ({ data: { articles: [] }, isLoading: false, error: undefined }),
  useLazyGetNewsQuery: () => [
    jest.fn(() => ({ unwrap: async () => ({ articles: [], totalResults: 0 }) })),
    { data: { articles: [] }, isLoading: false, error: undefined },
  ],
}));
jest.mock("@/store/api/tmdbApi", () => ({
  tmdbApi: {
    reducerPath: "tmdbApi",
    reducer: (state = { queries: {}, mutations: {}, provided: {}, subscriptions: {}, entities: {} }) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
  useGetMoviesQuery: () => ({ data: { results: [] }, isLoading: false, error: undefined }),
  useLazyGetMoviesQuery: () => [
    jest.fn(() => ({ unwrap: async () => ({ results: [], total_pages: 0 }) })),
    { data: { results: [] }, isLoading: false, error: undefined },
  ],
}));
jest.mock("@/store/api/socialApi", () => ({
  socialApi: {
    reducerPath: "socialApi",
    reducer: (state = { queries: {}, mutations: {}, provided: {}, subscriptions: {}, entities: {} }) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
  useGetSocialPostsQuery: () => ({ data: [] }),
}));

test("shows personalized feed heading", () => {
  render(<Provider store={store}><DashboardLayout /></Provider>);
  expect(screen.getByText(/personalized feed/i)).toBeInTheDocument();
});