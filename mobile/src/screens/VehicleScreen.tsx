import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '../components/TopAppBar';
import { SoCGauge } from '../components/SoCGauge';
import { StatusTimeline } from '../components/StatusTimeline';
import { BentoCard } from '../components/BentoCard';
import { InfoRow } from '../components/InfoRow';
import { mockEvOwnerDashboard, mockEvOwnerVehicle } from '../data/ev-owner';
import { colors, spacing, typography, radii, shadows } from '../theme';

export const VehicleScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { soc, energy, timeline } = mockEvOwnerDashboard;
  const vehicle = mockEvOwnerVehicle;

  // Derived metrics from ev-owner data mapped to CPO schema fields
  const batteryHealthPct = Math.round(
    (vehicle.batteryCapacityKwh / 82.0) * 100 // 82kWh is nominal for Model S class
  );
  const motorEfficiencyPct = energy.v2gActive
    ? Math.round((Math.abs(energy.realTimeFlowKw) / vehicle.maxChargePowerKw) * 100)
    : Math.round((vehicle.currentChargePowerKw / vehicle.maxChargePowerKw) * 100);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopAppBar title="Vehicle" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── State of Charge Gauge (SoC) ──────────────────────────── */}
        <SoCGauge
          percentage={soc.percentage}
          statusLabel={soc.statusLabel}
          targetDepartureTime={soc.targetDepartureTime}
        />

        {/* ── Bento Grid: Battery Capacity + Estimated Range ───────── */}
        <View style={styles.bentoGrid}>
          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={styles.metricIconCircle}>
                <MaterialIcons name="battery-full" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Battery Capacity</Text>
              <Text style={styles.metricValue}>
                {vehicle.batteryCapacityKwh.toFixed(1)}{' '}
                <Text style={styles.metricUnit}>kWh</Text>
              </Text>
            </View>
          </BentoCard>

          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={styles.metricIconCircle}>
                <MaterialIcons name="route" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Est. Range</Text>
              <Text style={styles.metricValue}>
                {vehicle.estimatedRangeKm}{' '}
                <Text style={styles.metricUnit}>km</Text>
              </Text>
            </View>
          </BentoCard>
        </View>

        {/* ── Bento Grid: Battery Health (SoH) + Motor Efficiency ──── */}
        <View style={styles.bentoGrid}>
          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={[styles.metricIconCircle, { backgroundColor: colors.secondaryContainer }]}>
                <MaterialIcons name="favorite" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Battery Health (SoH)</Text>
              <Text style={[styles.metricValue, { color: batteryHealthPct > 85 ? colors.primary : colors.error }]}>
                {batteryHealthPct}
                <Text style={styles.metricUnit}>%</Text>
              </Text>
            </View>
          </BentoCard>

          <BentoCard>
            <View style={styles.metricTopRow}>
              <View style={[styles.metricIconCircle, { backgroundColor: colors.secondaryContainer }]}>
                <MaterialIcons name="electric-bolt" size={20} color={colors.secondary} />
              </View>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.metricBottom}>
              <Text style={styles.metricLabel}>Motor Efficiency</Text>
              <Text style={styles.metricValue}>
                {motorEfficiencyPct}
                <Text style={styles.metricUnit}>%</Text>
              </Text>
            </View>
          </BentoCard>
        </View>

        {/* ── Stay / Session Timeline ───────────────────────────────── */}
        <StatusTimeline
          connectedAt={timeline.connectedAt}
          currentAt={timeline.currentAt}
          departureAt={timeline.departureAt}
          progress={timeline.progress}
        />

        {/* ── Real-time Diagnostics Card ────────────────────────────── */}
        <View style={[styles.detailsCard, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Real-Time Diagnostics</Text>
            <MaterialIcons name="sensors" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.detailsRows}>
            <InfoRow
              icon="bolt"
              label="Real-Time Flow"
              value={`${energy.realTimeFlowKw > 0 ? '+' : ''}${energy.realTimeFlowKw.toFixed(1)} kW`}
            />
            <InfoRow
              icon="electric-bolt"
              label="Charge Power"
              value={`${vehicle.currentChargePowerKw.toFixed(1)} / ${vehicle.maxChargePowerKw.toFixed(0)} kW`}
            />
            <InfoRow
              icon="power"
              label="Charge Status"
              value={vehicle.plugStatusLabel}
            />
            <InfoRow
              icon={energy.v2gActive ? 'swap-vert' : 'power-off'}
              label="V2G Mode"
              value={energy.v2gActive ? 'Active (Exporting)' : 'Inactive'}
            />
            <InfoRow
              icon="flag"
              label="Target SoC"
              value={`${vehicle.targetSocPercentage}%`}
            />
          </View>
        </View>

        {/* ── Vehicle Details Card ──────────────────────────────────── */}
        <View style={[styles.detailsCard, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <MaterialIcons name="electric-car" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.detailsRows}>
            <InfoRow icon="directions-car" label="Vehicle" value={vehicle.vehicleName} />
            <InfoRow icon="badge"          label="VIN"     value={vehicle.vinMasked} />
            <InfoRow icon="speed"          label="Odometer" value={`${vehicle.odometerKm.toLocaleString()} km`} />
            <InfoRow icon="ev-station"     label="Charger"  value={vehicle.chargerLocationLabel} />
            <InfoRow
              icon="local-gas-station"
              label="Energy Transferred"
              value={`${energy.energyTransferredKwh.toFixed(1)} kWh`}
            />
          </View>
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
  metricUnit: {
    ...typography.bodyMd,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
  },
  detailsCard: {
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
  detailsRows: {
    gap: spacing.sm,
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
