 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-(--border) bg-(--surface) p-5 lg:block">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">Content OS</p>
        <h1 className="mt-2 text-2xl font-black">PulseBoard</h1>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-(--muted) hover:bg-(--surface-muted) hover:text-(--foreground)"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100">
          <p className="font-bold">Personalized for you</p>
          <p className="mt-1 text-xs opacity-75">Tune your interests in Settings to improve your feed.</p>
        </div>
      </div>
    </aside>
  );
}

