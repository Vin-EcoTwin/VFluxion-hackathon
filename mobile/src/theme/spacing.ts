/**
 * Spacing tokens — 4pt base scale
 * Source: mobile/DESIGN.md
 */
export const spacing = {
  base: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  marginMobile: 20,
  gutterMobile: 12,
} as const;

export type SpacingToken = keyof typeof spacing;
