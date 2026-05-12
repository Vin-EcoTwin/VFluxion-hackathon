import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '../theme';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface FinancialRowProps {
  icon: MaterialIconName;
  iconBgColor?: string;
  iconColor?: string;
  label: string;
  value: string;
  valueColor?: string;
  valueStyle?: 'bold' | 'normal';
}

export const FinancialRow: React.FC<FinancialRowProps> = ({
  icon,
  iconBgColor = colors.secondaryContainer,
  iconColor = colors.onSecondaryContainer,
  label,
  value,
  valueColor = colors.primary,
  valueStyle = 'bold',
}) => (
  <View style={styles.row}>
    <View style={styles.leftGroup}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text
      style={[
        styles.value,
        { color: valueColor },
        valueStyle === 'bold' && styles.valueBold,
      ]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.DEFAULT,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconContainer: {
    padding: 8,
    borderRadius: radii.full,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flexShrink: 1,
  },
  value: {
    ...typography.bodyMd,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  valueBold: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '700',
  },
});
