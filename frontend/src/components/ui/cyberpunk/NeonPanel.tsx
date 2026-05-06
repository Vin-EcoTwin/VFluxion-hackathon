import type { ReactNode } from "react";

type NeonPanelProps = {
  title: string;
  accent?: "cyan" | "pink";
  children: ReactNode;
};

export function NeonPanel({ title, accent = "cyan", children }: NeonPanelProps) {
  const accentClass =
    accent === "pink"
      ? "shadow-[0_0_16px_rgba(245,93,181,0.24)]"
      : "shadow-[0_0_16px_rgba(51,185,255,0.22)]";

  const titleColor = accent === "pink" ? "text-[var(--accent-secondary)]" : "text-[var(--accent-primary)]";

  return (
    <article
      className={`rounded-lg border border-[color:var(--app-border)] bg-[var(--panel-background)] p-3 backdrop-blur-sm ${accentClass}`}
    >
      <header className={`mb-2 font-[var(--font-display)] text-xs uppercase tracking-[0.2em] ${titleColor}`}>
        {title}
      </header>
      {children}
    </article>
  );
}
