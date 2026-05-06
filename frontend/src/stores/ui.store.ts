import { create } from "zustand";

type HiddenPane = "map" | "dashboard" | null;
export type AppTheme = "dark" | "light";
export type AppLanguage = "en" | "vi";

export type UIState = {
  hiddenPane: HiddenPane;
  theme: AppTheme;
  language: AppLanguage;
  togglePane: (pane: Exclude<HiddenPane, null>) => void;
  resetPane: () => void;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setLanguage: (language: AppLanguage) => void;
};

export const useUIStore = create<UIState>((set) => ({
  hiddenPane: null,
  theme: "dark",
  language: "en",
  togglePane: (pane) =>
    set((state) => ({
      hiddenPane: state.hiddenPane === pane ? null : pane
    })),
  resetPane: () => set({ hiddenPane: null }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark"
    })),
  setLanguage: (language) => set({ language })
}));
