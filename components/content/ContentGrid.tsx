import ContentCard from "./ContentCard";
import type { ContentItem } from "@/types/content";

export default function ContentGrid({ items }: { items: ContentItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => <ContentCard key={item.id} item={item} />)}
    </div>
  );
}