export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date?: string) {
  if (!date) return "Unknown date";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Unknown date" : parsed.toLocaleDateString();
}