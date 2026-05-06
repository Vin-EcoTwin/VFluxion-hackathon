"use client";

import { t } from "@/lib/i18n/translations";
import { useUIStore } from "@/stores/ui.store";
import type { AppLanguage, UIState } from "@/stores/ui.store";

export function MainNavbar() {
  const hiddenPane = useUIStore((state: UIState) => state.hiddenPane);
  const togglePane = useUIStore((state: UIState) => state.togglePane);
  const resetPane = useUIStore((state: UIState) => state.resetPane);
  const theme = useUIStore((state: UIState) => state.theme);
  const toggleTheme = useUIStore((state: UIState) => state.toggleTheme);
  const language = useUIStore((state: UIState) => state.language);
  const setLanguage = useUIStore((state: UIState) => state.setLanguage);

  return (
    <header className="h-16 border-b border-[color:var(--app-border)] bg-[var(--nav-background)] px-4 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full items-center justify-between gap-3">
        <div>
          <p className="font-[var(--font-display)] text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
            {t(language, "app.subtitle")}
          </p>
          <h1 className="font-[var(--font-display)] text-lg text-[var(--text-primary)]">{t(language, "app.title")}</h1>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <button
            type="button"
            onClick={() => togglePane("map")}
            className="rounded-md border border-[color:var(--app-border-strong)] px-3 py-1 text-[var(--text-primary)] transition hover:bg-[var(--button-soft-hover)]"
          >
            {hiddenPane === "map" ? t(language, "control.showMap") : t(language, "control.hideMap")}
          </button>
          <button
            type="button"
            onClick={() => togglePane("dashboard")}
            className="rounded-md border border-[color:var(--app-border-strong)] px-3 py-1 text-[var(--text-primary)] transition hover:bg-[var(--button-soft-hover)]"
          >
            {hiddenPane === "dashboard"
              ? t(language, "control.showDashboard")
              : t(language, "control.hideDashboard")}
          </button>
          <button
            type="button"
            onClick={resetPane}
            className="rounded-md border border-[color:var(--app-border-strong)] px-3 py-1 text-[var(--text-primary)] transition hover:bg-[var(--button-soft-hover)]"
          >
            {t(language, "control.resetLayout")}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-[color:var(--app-border)] bg-[var(--panel-background)] px-3 py-1 text-[var(--text-primary)]"
          >
            {t(language, "control.theme")}: {theme === "dark" ? t(language, "theme.dark") : t(language, "theme.light")}
          </button>

          <label className="rounded-md border border-[color:var(--app-border)] bg-[var(--panel-background)] px-2 py-1 text-[var(--text-primary)]">
            {t(language, "control.language")}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as AppLanguage)}
              className="ml-2 bg-transparent text-[var(--text-primary)] outline-none"
            >
              <option value="en">EN</option>
              <option value="vi">VI</option>
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
