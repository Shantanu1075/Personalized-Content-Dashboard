import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { NewsResponse } from "@/types/news";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getNews: builder.query<NewsResponse, { category?: string; q?: string; page?: number }>({
      query: ({ category = "technology", q = "", page = 1 }) => ({
        url: "news",
        params: { category, q, page },
      }),
    }),
  }),
});

export const { useGetNewsQuery, useLazyGetNewsQuery } = newsApi;