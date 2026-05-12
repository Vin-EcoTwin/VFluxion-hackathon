import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '../components/TopAppBar';
import { BentoCard } from '../components/BentoCard';
import { InfoRow } from '../components/InfoRow';
import { FinancialRow } from '../components/FinancialRow';
import { mockEvOwnerDashboard, mockEvOwnerFinancialsSummary } from '../data/ev-owner';
import { colors, spacing, typography, radii, shadows } from '../theme';

export const FinancialsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { financials } = mockEvOwnerDashboard;
  const summary = mockEvOwnerFinancialsSummary;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopAppBar title="Financials" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bentoGrid}>
          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={styles.metricIconCircle}>
                <MaterialIcons name="payments" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Today</Text>
              <Text style={styles.metricValue}>
                +${summary.todayV2gEarningsUsd.toFixed(2)}
              </Text>
            </View>
          </BentoCard>

          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={styles.metricIconCircle}>
                <MaterialIcons name="date-range" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Month to Date</Text>
              <Text style={styles.metricValue}>
                +${summary.monthToDateV2gEarningsUsd.toFixed(2)}
              </Text>
            </View>
          </BentoCard>
        </View>

        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payout</Text>
            <MaterialIcons name="account-balance-wallet" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.rows}>
            <InfoRow icon="event" label="Next payout" value={summary.nextPayoutDate} />
            <InfoRow
              icon="savings"
              label="Estimated"
              value={`$${summary.estimatedNextPayoutUsd.toFixed(2)}`}
            />
          </View>
        </View>

        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>V2G Breakdown</Text>
            <MaterialIcons name="show-chart" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.financialRows}>
            <FinancialRow
              icon="paid"
              iconBgColor={colors.secondaryContainer}
              iconColor={colors.onSecondaryContainer}
              label="Lifetime Profit"
              value={`+$${summary.lifetimeV2gProfitUsd.toFixed(2)}`}
              valueColor={colors.primary}
              valueStyle="bold"
            />
            <FinancialRow
              icon="bolt"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Energy Exported (Today)"
              value={`${summary.energyExportedTodayKwh.toFixed(1)} kWh`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="trending-up"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Avg Sell Price"
              value={`$${summary.averageSellPriceUsdPerKwh.toFixed(2)}/kWh`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="local-offer"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Current Market Price"
              value={`$${financials.currentEnergyPriceUsdPerKwh.toFixed(2)}/kWh`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: spacing.gutterMobile,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricIconCircle: {
    backgroundColor: colors.surfaceContainer,
    padding: 8,
    borderRadius: radii.full,
  },
  metricBottom: {
    marginTop: 'auto' as any,
  },
  metricLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
    textTransform: 'none',
  },
  metricValue: {
    ...typography.headlineSm,
    fontWeight: '700',
    color: colors.onSurface,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  rows: {
    gap: spacing.sm,
  },
  financialRows: {
    gap: spacing.sm,
  },
});
