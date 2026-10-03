import { GET as getNews } from "@/app/api/news/route";
import { GET as getMovies } from "@/app/api/movies/route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

describe("upstream API resilience", () => {
  beforeEach(() => {
    process.env.NEWS_API_KEY = "test-news-key";
    process.env.TMDB_API_KEY = "test-movie-key";
    global.fetch = jest.fn().mockRejectedValue(new TypeError("read ECONNRESET")) as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("news route returns empty results when the upstream fetch fails", async () => {
    const request = { url: "http://localhost/api/news?category=technology&page=1" } as Parameters<typeof getNews>[0];

    const response = await getNews(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      articles: [],
      totalResults: 0,
    });
  });

  test("movies route returns empty results when the upstream fetch fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new TypeError("read ECONNRESET"));
    const request = { url: "http://localhost/api/movies?page=1" } as Parameters<typeof getMovies>[0];

    const response = await getMovies(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      results: [],
      total_pages: 0,
    });
  });
});
