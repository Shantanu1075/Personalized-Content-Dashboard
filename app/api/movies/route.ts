import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? "1";
  const key = process.env.TMDB_API_KEY;

  if (!key) {
    return NextResponse.json(
      { message: "TMDB_API_KEY is not configured. Add it to .env.local." },
      { status: 503 }
    );
  }

  const endpoint = q ? "search/movie" : "trending/movie/week";
  const params = new URLSearchParams({
    api_key: key,
    language: "en-US",
    page,
    ...(q ? { query: q } : {}),
  });

  const fallback = {
    page: Number(page),
    total_results: 0,
    total_pages: 0,
    results: [],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://api.themoviedb.org/3/${endpoint}?${params}`, {
      next: { revalidate: 900 },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(fallback, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(
      {
        page: Number(data?.page ?? page),
        total_results: Number(data?.total_results ?? 0),
        total_pages: Number(data?.total_pages ?? 0),
        results: Array.isArray(data?.results) ? data.results : [],
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(fallback, { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}
