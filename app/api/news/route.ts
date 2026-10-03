import { NextRequest, NextResponse } from "next/server";

const allowedCategories = new Set(["technology", "sports", "business", "health", "science", "entertainment"]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "technology";
  const query = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? "1";

  if (!allowedCategories.has(category) && !query) {
    return NextResponse.json({ message: "Unsupported category" }, { status: 400 });
  }

  const key = process.env.NEWS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { message: "NEWS_API_KEY is not configured. Add it to .env.local." },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    apiKey: key,
    language: "en",
    pageSize: "12",
    page,
    ...(query ? { q: query } : { category, country: "us" }),
  });

  const fallback = {
    status: "ok",
    totalResults: 0,
    articles: [],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://newsapi.org/v2/${query ? "everything" : "top-headlines"}?${params}`,
      {
        next: { revalidate: 300 },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return NextResponse.json(fallback, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(
      {
        status: data?.status ?? "ok",
        totalResults: Number(data?.totalResults ?? 0),
        articles: Array.isArray(data?.articles) ? data.articles : [],
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(fallback, { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}

