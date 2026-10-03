
 "use client";

 import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Feed from "@/components/content/Feed";
import Trending from "@/components/content/Trending";
import FavoritesList from "@/components/favorites/FavoritesList";
import PreferencesPanel from "@/components/settings/PreferencesPanel";

type Section = "dashboard" | "favorites" | "settings";

export default function DashboardLayout({ initialSection }: { initialSection?: Section }) {
  const pathname = usePathname();
  const section = initialSection ?? (pathname.includes("favorites") ? "favorites" : pathname.includes("settings") ? "settings" : "dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-(--background) text-(--foreground)">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-xl border border-(--border) px-4 py-2 text-sm font-semibold"
            >
              Menu
            </button>
            {mobileOpen && (
              <div className="absolute left-4 right-4 top-20 z-30 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-2xl">
                <a href="/dashboard" className="block rounded-lg p-3">Dashboard</a>
                <a href="/favorites" className="block rounded-lg p-3">Favorites</a>
                <a href="/settings" className="block rounded-lg p-3">Settings</a>
              </div>
            )}
          </div>

          {section === "dashboard" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] h-[calc(100vh-64px)]">
              <aside className="order-1 lg:order-none h-full min-h-0 overflow-y-auto">
                <div className="p-2">
                  <React.Suspense fallback={null}>
                    <Trending />
                  </React.Suspense>
                </div>
              </aside>
              <main className="order-2 lg:order-none h-full min-h-0 overflow-y-auto">
                <div className="p-2 h-full min-h-0">
                  <Feed />
                </div>
              </main>
            </div>
          )}
          {section === "favorites" && <FavoritesList />}
          {section === "settings" && <PreferencesPanel />}
        </main>
      </div>
    </div>
  );
}