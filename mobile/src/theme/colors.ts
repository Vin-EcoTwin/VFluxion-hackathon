/**
 * Eco-Corporate Management — Color Palette
 * Source: mobile/DESIGN.md + mobile/code.html tailwind config
 */
export const colors = {
  // Surfaces
  surface: '#f8f9ff',
  surfaceDim: '#cbdbf5',
  surfaceBright: '#f8f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',

  // On-Surface
  onSurface: '#0b1c30',
  onSurfaceVariant: '#3c4a42',

  // Inverse
  inverseSurface: '#213145',
  inverseOnSurface: '#eaf1ff',
  inversePrimary: '#4edea3',

  // Outline
  outline: '#6c7a71',
  outlineVariant: '#bbcabf',

  // Surface Tint
  surfaceTint: '#006c49',

  // Primary
  primary: '#006c49',
  onPrimary: '#ffffff',
  primaryContainer: '#10b981',
  onPrimaryContainer: '#00422b',

  // Primary Fixed
  primaryFixed: '#6ffbbe',
  primaryFixedDim: '#4edea3',
  onPrimaryFixed: '#002113',
  onPrimaryFixedVariant: '#005236',

  // Secondary
  secondary: '#2b6954',
  onSecondary: '#ffffff',
  secondaryContainer: '#adedd3',
  onSecondaryContainer: '#306d58',

  // Secondary Fixed
  secondaryFixed: '#b0f0d6',
  secondaryFixedDim: '#95d3ba',
  onSecondaryFixed: '#002117',
  onSecondaryFixedVariant: '#0b513d',

  // Tertiary
  tertiary: '#006c4b',
  onTertiary: '#ffffff',
  tertiaryContainer: '#00b982',
  onTertiaryContainer: '#00422c',

  // Tertiary Fixed
  tertiaryFixed: '#68fcbf',
  tertiaryFixedDim: '#45dfa4',
  onTertiaryFixed: '#002114',
  onTertiaryFixedVariant: '#005137',

  // Error
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Background
  background: '#f8f9ff',
  onBackground: '#0b1c30',

  // Surface Variant
  surfaceVariant: '#d3e4fe',
} as const;

export type ColorToken = keyof typeof colors;
