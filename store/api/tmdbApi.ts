import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MovieResponse } from "@/types/movie";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getMovies: builder.query<MovieResponse, { q?: string; page?: number }>({
      query: ({ q = "", page = 1 }) => ({
        url: "movies",
        params: { q, page },
      }),
    }),
  }),
});

export const { useGetMoviesQuery, useLazyGetMoviesQuery } = tmdbApi;