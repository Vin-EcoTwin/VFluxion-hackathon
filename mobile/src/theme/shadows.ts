import { Platform, ViewStyle } from 'react-native';

/**
 * Shadow tokens — "Atmospheric" shadow
 * Web equivalent: 0px 4px 20px rgba(0,0,0,0.04)
 */
export const shadows = {
  atmospheric: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 20,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 20,
    },
  }) as ViewStyle,
} as const;
