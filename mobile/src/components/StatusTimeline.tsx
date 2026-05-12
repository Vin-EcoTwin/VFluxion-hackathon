import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme';

interface StatusTimelineProps {
  connectedAt: string;
  currentAt: string;
  departureAt: string;
  /** Normalized progress 0–1 */
  progress: number;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  connectedAt,
  currentAt,
  departureAt,
  progress,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.card, shadows.atmospheric]}>
      <Text style={styles.title}>Stay Duration</Text>

      <View style={styles.timelineContainer}>
        {/* Background line */}
        <View style={styles.bgLine} />

        {/* Progress line */}
        <View
          style={[
            styles.progressLine,
            { width: `${clampedProgress * 100}%` as any },
          ]}
        />

        {/* Points */}
        <View style={styles.pointsRow}>
          {/* Point 1: Connected */}
          <View style={styles.pointCol}>
            <View style={styles.pointFilled}>
              <View style={styles.pointFilledInner} />
            </View>
            <Text style={styles.pointLabel}>Connected</Text>
            <Text style={styles.pointTime}>{connectedAt}</Text>
          </View>

          {/* Point 2: Current */}
          <View style={styles.pointCol}>
            <View style={styles.pointCurrent}>
              <View style={styles.pointCurrentInner} />
            </View>
            <Text style={[styles.pointLabel, styles.pointLabelActive]}>
              Current
            </Text>
            <Text style={[styles.pointTime, styles.pointTimeActive]}>
              {currentAt}
            </Text>
          </View>

          {/* Point 3: Departure */}
          <View style={styles.pointCol}>
            <View style={styles.pointEmpty} />
            <Text style={styles.pointLabel}>Departure</Text>
            <Text style={styles.pointTime}>{departureAt}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const DOT_SIZE = 16;
const CURRENT_DOT_SIZE = 20;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  title: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.lg,
  },
  timelineContainer: {
    position: 'relative',
    paddingHorizontal: spacing.sm,
    height: 60,
    justifyContent: 'center',
  },
  bgLine: {
    position: 'absolute',
    top: DOT_SIZE / 2 - 1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.surfaceContainer,
  },
  progressLine: {
    position: 'absolute',
    top: DOT_SIZE / 2 - 1,
    left: 0,
    height: 2,
    backgroundColor: colors.primaryContainer,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pointCol: {
    alignItems: 'center',
    gap: spacing.xs,
  },

  // Connected dot — filled green
  pointFilled: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointFilledInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceContainerLowest,
  },

  // Current dot — larger, glow ring
  pointCurrent: {
    width: CURRENT_DOT_SIZE,
    height: CURRENT_DOT_SIZE,
    borderRadius: CURRENT_DOT_SIZE / 2,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    // Glow ring
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pointCurrentInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryContainer,
  },

  // Departure dot — empty
  pointEmpty: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },

  pointLabel: {
    ...typography.labelMd,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  pointLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  pointTime: {
    ...typography.labelMd,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  pointTimeActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
