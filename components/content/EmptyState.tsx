export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-(--border) p-10 text-center">
      <div className="text-4xl">⌁</div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-(--muted)">{description}</p>
    </div>
  );
}