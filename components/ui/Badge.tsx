
export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">{children}</span>;
}
