import type { ReactNode } from "react";

export default function ContentSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-black">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-(--muted)">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}