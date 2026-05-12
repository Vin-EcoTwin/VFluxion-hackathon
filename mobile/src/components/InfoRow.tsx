import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '../theme';

interface InfoRowProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor?: string;
  label: string;
  value: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  iconColor = colors.primary,
  label,
  value,
}) => (
  <View style={styles.container}>
    <MaterialIcons name={icon} size={20} color={iconColor} />
    <Text style={styles.text}>
      {label}: <Text style={styles.value}>{value}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.DEFAULT,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  text: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  value: {
    ...typography.headlineSm,
    fontSize: 14,
    fontWeight: '600',
  },
});
