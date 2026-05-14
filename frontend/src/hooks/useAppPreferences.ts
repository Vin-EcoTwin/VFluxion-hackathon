"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";

const THEME_KEY = "vfluxion-theme";
const LANGUAGE_KEY = "vfluxion-language";

export function useAppPreferences() {
  const theme = useUIStore((state) => state.theme);
  const language = useUIStore((state) => state.language);
  const setTheme = useUIStore((state) => state.setTheme);
  const setLanguage = useUIStore((state) => state.setLanguage);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "vi") {
      setLanguage(storedLanguage);
    }
  }, [setTheme, setLanguage]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);
}
