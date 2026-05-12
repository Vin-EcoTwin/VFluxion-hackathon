import { TextStyle } from 'react-native';

/**
 * Typography tokens — Space Grotesk
 * Source: mobile/DESIGN.md
 */

const FONT_FAMILY = 'SpaceGrotesk_400Regular';
const FONT_FAMILY_MEDIUM = 'SpaceGrotesk_500Medium';
const FONT_FAMILY_SEMI = 'SpaceGrotesk_600SemiBold';
const FONT_FAMILY_BOLD = 'SpaceGrotesk_700Bold';

export const typography = {
  displayData: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.04 * 48, // -0.04em
  } as TextStyle,

  headlineLg: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.02 * 30, // -0.02em
  } as TextStyle,

  headlineMd: {
    fontFamily: FONT_FAMILY_SEMI,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.01 * 24, // -0.01em
  } as TextStyle,

  headlineSm: {
    fontFamily: FONT_FAMILY_SEMI,
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,

  bodyLg: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,

  bodyMd: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,

  labelMd: {
    fontFamily: FONT_FAMILY_MEDIUM,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.05 * 12, // 0.05em
    textTransform: 'uppercase' as const,
  } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
