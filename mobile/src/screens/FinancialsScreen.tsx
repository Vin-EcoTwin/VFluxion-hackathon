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
  const { financials, energy } = mockEvOwnerDashboard;
  const summary = mockEvOwnerFinancialsSummary;

  // Derived: estimated charging cost for today's session (mapped from cpo-data rate/energyKwh)
  const chargingCostToday =
    energy.energyTransferredKwh * financials.currentEnergyPriceUsdPerKwh;

  // Net savings = V2G earned – charging cost
  const netSavingsToday = summary.todayV2gEarningsUsd - chargingCostToday;

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
        {/* ── Bento Grid: Today + Month-to-Date Earnings ───────────── */}
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

        {/* ── Bento Grid: Net Savings + Lifetime Profit ────────────── */}
        <View style={styles.bentoGrid}>
          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={[styles.metricIconCircle, { backgroundColor: colors.secondaryContainer }]}>
                <MaterialIcons name="savings" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Net Savings Today</Text>
              <Text style={[styles.metricValue, { color: netSavingsToday >= 0 ? colors.primary : colors.error }]}>
                {netSavingsToday >= 0 ? '+' : ''}${netSavingsToday.toFixed(2)}
              </Text>
            </View>
          </BentoCard>

          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={[styles.metricIconCircle, { backgroundColor: colors.secondaryContainer }]}>
                <MaterialIcons name="emoji-events" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Lifetime Profit</Text>
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                +${summary.lifetimeV2gProfitUsd.toFixed(2)}
              </Text>
            </View>
          </BentoCard>
        </View>

        {/* ── Payout Card ───────────────────────────────────────────── */}
        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payout Schedule</Text>
            <MaterialIcons name="account-balance-wallet" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.rows}>
            <InfoRow icon="event"   label="Next Payout"      value={summary.nextPayoutDate} />
            <InfoRow icon="savings" label="Estimated Amount" value={`$${summary.estimatedNextPayoutUsd.toFixed(2)}`} />
          </View>
        </View>

        {/* ── Charging Expenses Card ────────────────────────────────── */}
        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Charging Expenses</Text>
            <MaterialIcons name="ev-station" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.financialRows}>
            <FinancialRow
              icon="flash-on"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Energy Drawn Today"
              value={`${energy.energyTransferredKwh.toFixed(1)} kWh`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="local-offer"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Market Rate (Grid)"
              value={`$${financials.currentEnergyPriceUsdPerKwh.toFixed(2)}/kWh`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="receipt"
              iconBgColor={colors.errorContainer}
              iconColor={colors.onErrorContainer}
              label="Charging Cost Today"
              value={`-$${chargingCostToday.toFixed(2)}`}
              valueColor={colors.error}
              valueStyle="bold"
            />
          </View>
        </View>

        {/* ── V2G Session Breakdown Card ────────────────────────────── */}
        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>V2G Session Breakdown</Text>
            <MaterialIcons name="show-chart" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.financialRows}>
            <FinancialRow
              icon="paid"
              iconBgColor={colors.secondaryContainer}
              iconColor={colors.onSecondaryContainer}
              label="Lifetime V2G Profit"
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
              label="Avg. Sell Price"
              value={`$${summary.averageSellPriceUsdPerKwh.toFixed(2)}/kWh`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="swap-vert"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Current Real-Time Flow"
              value={`${energy.realTimeFlowKw > 0 ? '+' : ''}${energy.realTimeFlowKw.toFixed(1)} kW`}
              valueColor={energy.realTimeFlowKw > 0 ? colors.primary : colors.onSurfaceVariant}
              valueStyle="normal"
            />
          </View>
        </View>

        {/* ── Recent Sessions Log Card ──────────────────────────────── */}
        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Session Log</Text>
            <MaterialIcons name="history" size={24} color={colors.onSurfaceVariant} />
          </View>
          {/* Statically mapped from cpo-data.ts buildHorizon recentLogs */}
          {[
            { time: '14:00 → 15:30', mode: 'V2G (Export)', kwh: '15 kWh', impact: '+$6.30', positive: true },
            { time: '11:00 → 13:00', mode: 'G2V (Charge)', kwh: '30 kWh', impact: '-$12.60', positive: false },
            { time: '09:00 → 10:30', mode: 'G2V (Charge)', kwh: '20 kWh', impact: '-$8.40', positive: false },
          ].map((log, idx) => (
            <View key={idx} style={[styles.sessionRow, idx > 0 && styles.sessionRowBorder]}>
              <View style={styles.sessionLeft}>
                <View style={[styles.sessionDot, { backgroundColor: log.positive ? colors.primary : colors.outline }]} />
                <View>
                  <Text style={styles.sessionTime}>{log.time}</Text>
                  <Text style={styles.sessionMode}>{log.mode} · {log.kwh}</Text>
                </View>
              </View>
              <Text style={[styles.sessionImpact, { color: log.positive ? colors.primary : colors.error }]}>
                {log.impact}
              </Text>
            </View>
          ))}
        </View>

        {/* ── POWERED BY VFLUXION TEAM Footer ──────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>POWERED BY VFLUXION TEAM</Text>
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
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  sessionRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sessionDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  sessionTime: {
    ...typography.labelMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  sessionMode: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  sessionImpact: {
    ...typography.labelMd,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    ...typography.labelMd,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
