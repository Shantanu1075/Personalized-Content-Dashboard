export type ContentType = "news" | "movie" | "social";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image?: string;
  url?: string;
  source: string;
  category: string;
  author?: string;
  rating?: number;
  publishedAt?: string;
}