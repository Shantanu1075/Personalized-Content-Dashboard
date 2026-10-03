import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "PulseBoard — Personalized Content Dashboard",
  description: "A personalized news, movie and social content dashboard.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}