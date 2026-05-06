"use client";

import type { ReactNode } from "react";

type TremorThemeProviderProps = {
  children: ReactNode;
};

export function TremorThemeProvider({ children }: TremorThemeProviderProps) {
  return <div className="tremor-theme-cyberpunk">{children}</div>;
}
