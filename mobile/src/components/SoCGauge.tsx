import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '../theme';

interface SoCGaugeProps {
  /** Battery percentage 0–100 */
  percentage: number;
  /** Status label, e.g. "Optimized" */
  statusLabel: string;
  /** Target departure time string */
  targetDepartureTime: string;
  /** SVG gauge diameter in pixels */
  size?: number;
  /** Gauge stroke width */
  strokeWidth?: number;
}

export const SoCGauge: React.FC<SoCGaugeProps> = ({
  percentage,
  statusLabel,
  targetDepartureTime,
  size = 192,
  strokeWidth = 8,
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <View style={[styles.card, shadows.atmospheric]}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>State of Charge</Text>

      {/* Circular Gauge */}
      <View style={[styles.gaugeContainer, { width: size, height: size }]}>
        <Svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={styles.svgRotate}
        >
          {/* Background track */}
          <Circle
            cx={50}
            cy={50}
            r={radius}
            fill="none"
            stroke={colors.surfaceContainer}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <Circle
            cx={50}
            cy={50}
            r={radius}
            fill="none"
            stroke={colors.primaryContainer}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={dashOffset}
          />
        </Svg>

        {/* Center label */}
        <View style={styles.centerLabel}>
          <Text style={styles.percentText}>
            {percentage}
            <Text style={styles.percentSign}>%</Text>
          </Text>
          <View style={styles.chip}>
            <MaterialIcons name="eco" size={14} color={colors.onSecondaryContainer} />
            <Text style={styles.chipText}>{statusLabel}</Text>
          </View>
        </View>
      </View>

      {/* Target Departure Info Box */}
      <View style={styles.departureBox}>
        <MaterialIcons name="schedule" size={20} color={colors.primary} />
        <Text style={styles.departureText}>
          Target Departure:{' '}
          <Text style={styles.departureTime}>{targetDepartureTime}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  gaugeContainer: {
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgRotate: {
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
  },
  centerLabel: {
    alignItems: 'center',
  },
  percentText: {
    ...typography.displayData,
    color: colors.primary,
  },
  percentSign: {
    ...typography.headlineLg,
    color: colors.primary,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: spacing.sm,
  },
  chipText: {
    ...typography.labelMd,
    color: colors.onSecondaryContainer,
  },
  departureBox: {
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
  departureText: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  departureTime: {
    ...typography.headlineSm,
    fontSize: 14,
    fontWeight: '600',
  },
});
