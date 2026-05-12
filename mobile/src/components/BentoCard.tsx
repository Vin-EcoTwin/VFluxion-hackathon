import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '../theme';

// ---------------------------------------------------------------------------
// Base BentoCard
// ---------------------------------------------------------------------------

interface BentoCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'primary';
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const bg =
    variant === 'primary' ? colors.primary : colors.surfaceContainerLowest;
  return (
    <View style={[styles.card, shadows.atmospheric, { backgroundColor: bg }, style]}>
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Energy Transferred Card
// ---------------------------------------------------------------------------

interface EnergyTransferredCardProps {
  energyKwh: number;
}

export const EnergyTransferredCard: React.FC<EnergyTransferredCardProps> = ({
  energyKwh,
}) => (
  <BentoCard>
    <View style={styles.topRow}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="ev-station" size={20} color={colors.secondary} />
      </View>
      <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
    </View>
    <View style={styles.bottomContent}>
      <Text style={styles.label}>Energy Transferred</Text>
      <Text style={styles.valueDefault}>
        {energyKwh}{' '}
        <Text style={styles.unit}>kWh</Text>
      </Text>
    </View>
  </BentoCard>
);

// ---------------------------------------------------------------------------
// Real-time Flow Card
// ---------------------------------------------------------------------------

interface RealTimeFlowCardProps {
  flowKw: number;
  v2gActive: boolean;
}

export const RealTimeFlowCard: React.FC<RealTimeFlowCardProps> = ({
  flowKw,
  v2gActive,
}) => (
  <BentoCard variant="primary">
    {/* Background bolt icon */}
    <View style={styles.bgBolt}>
      <MaterialIcons name="bolt" size={80} color={colors.onPrimary} />
    </View>

    <View style={[styles.topRow, { zIndex: 10 }]}>
      <View style={styles.iconCirclePrimary}>
        <MaterialIcons name="swap-horiz" size={20} color={colors.onPrimary} />
      </View>
      {v2gActive && (
        <View style={styles.v2gBadge}>
          <Text style={styles.v2gBadgeText}>V2G Active</Text>
        </View>
      )}
    </View>
    <View style={[styles.bottomContent, { zIndex: 10 }]}>
      <Text style={[styles.label, { color: colors.surfaceContainerHighest }]}>
        Real-time Flow
      </Text>
      <View style={styles.flowRow}>
        <Text style={styles.valuePrimary}>
          +{flowKw}{' '}
          <Text style={[styles.unit, { color: colors.surfaceContainerHighest }]}>kW</Text>
        </Text>
        <MaterialIcons name="arrow-upward" size={16} color={colors.onPrimary} />
      </View>
    </View>
  </BentoCard>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.md,
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconCircle: {
    backgroundColor: colors.surfaceContainer,
    padding: 8,
    borderRadius: radii.full,
  },
  iconCirclePrimary: {
    backgroundColor: colors.onPrimaryFixedVariant,
    padding: 8,
    borderRadius: radii.full,
  },
  bottomContent: {
    marginTop: 'auto' as any,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  valueDefault: {
    ...typography.headlineSm,
    fontWeight: '700',
    color: colors.onSurface,
  },
  valuePrimary: {
    ...typography.headlineSm,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  unit: {
    ...typography.bodyMd,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
  },
  v2gBadge: {
    backgroundColor: colors.onPrimaryFixedVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  v2gBadgeText: {
    ...typography.labelMd,
    color: colors.onPrimary,
  },
  bgBolt: {
    position: 'absolute',
    right: -16,
    top: -16,
    opacity: 0.2,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
