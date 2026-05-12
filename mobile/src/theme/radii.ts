/**
 * Border radius tokens
 * Source: mobile/DESIGN.md
 */
export const radii = {
  sm: 4,     // 0.25rem
  DEFAULT: 8, // 0.5rem
  md: 12,    // 0.75rem
  lg: 16,    // 1rem — cards
  xl: 24,    // 1.5rem
  full: 9999, // chips, pills
} as const;

export type RadiusToken = keyof typeof radii;
