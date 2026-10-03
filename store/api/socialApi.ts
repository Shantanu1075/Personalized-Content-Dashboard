import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { socialPosts } from "@/mocks/socialPosts";
import type { SocialPost } from "@/types/social";

export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getSocialPosts: builder.query<SocialPost[], { query?: string }>({
      async queryFn({ query = "" }) {
        const normalized = query.toLowerCase().trim();
        const result = normalized
          ? socialPosts.filter((post) =>
              `${post.text} ${post.hashtag} ${post.author}`.toLowerCase().includes(normalized)
            )
          : socialPosts;
        return { data: result };
      },
    }),
  }),
});

export const { useGetSocialPostsQuery } = socialApi;