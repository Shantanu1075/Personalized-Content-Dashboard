import reducer, { toggleFavorite } from "@/store/slices/favoritesSlice";
import type { ContentItem } from "@/types/content";

const item: ContentItem = {
  id: "1", type: "news", title: "Test", description: "Test", source: "Test", category: "technology",
};

test("adds and removes a favorite", () => {
  const added = reducer([], toggleFavorite(item));
  expect(added).toHaveLength(1);
  const removed = reducer(added, toggleFavorite(item));
  expect(removed).toHaveLength(0);
});