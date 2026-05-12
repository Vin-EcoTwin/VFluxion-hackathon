import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '../components/TopAppBar';
import { SoCGauge } from '../components/SoCGauge';
import { EnergyTransferredCard, RealTimeFlowCard } from '../components/BentoCard';
import { StatusTimeline } from '../components/StatusTimeline';
import { FinancialRow } from '../components/FinancialRow';
import { mockEvOwnerDashboard } from '../data/ev-owner';
import { colors, spacing, typography, radii, shadows } from '../theme';

export const OverviewScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { soc, energy, timeline, financials } = mockEvOwnerDashboard;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopAppBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* SoC Circular Gauge */}
        <SoCGauge
          percentage={soc.percentage}
          statusLabel={soc.statusLabel}
          targetDepartureTime={soc.targetDepartureTime}
        />

        {/* Bento Grid: Energy Insights */}
        <View style={styles.bentoGrid}>
          <EnergyTransferredCard energyKwh={energy.energyTransferredKwh} />
          <RealTimeFlowCard
            flowKw={energy.realTimeFlowKw}
            v2gActive={energy.v2gActive}
          />
        </View>

        {/* Stay Duration Timeline */}
        <StatusTimeline
          connectedAt={timeline.connectedAt}
          currentAt={timeline.currentAt}
          departureAt={timeline.departureAt}
          progress={timeline.progress}
        />

        {/* V2G Financials */}
        <View style={[styles.financialsCard, shadows.atmospheric]}>
          <View style={styles.financialsHeader}>
            <Text style={styles.financialsTitle}>V2G Financials</Text>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </View>
          <View style={styles.financialsRows}>
            <FinancialRow
              icon="payments"
              iconBgColor={colors.secondaryContainer}
              iconColor={colors.onSecondaryContainer}
              label="V2G Profit Earned"
              value={`+$${financials.v2gProfitEarnedUsd.toFixed(2)}`}
              valueColor={colors.primary}
              valueStyle="bold"
            />
            <FinancialRow
              icon="show-chart"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Current Energy Price"
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
  financialsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  financialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  financialsTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  financialsRows: {
    gap: spacing.sm,
  },
});
