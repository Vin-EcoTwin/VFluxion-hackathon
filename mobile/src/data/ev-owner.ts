/**
 * EV Owner Dashboard — Mock Data & TypeScript Interfaces
 *
 * Field naming convention: camelCase with explicit units (Kwh, Kw, Usd)
 * to align with a future shared backend API schema.
 *
 * Source: mobile/code.html + mobile/PROMPT.md + frontend/src/store/cpo-data.ts
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface SoCStatus {
  /** Current battery percentage (0–100) */
  percentage: number;
  /** Human-readable status label, e.g. "Optimized" */
  statusLabel: string;
  /** Target departure time, e.g. "07:30 AM" */
  targetDepartureTime: string;
}

export interface EnergyInsights {
  /** Total energy transferred this session (kWh) */
  energyTransferredKwh: number;
  /** Instantaneous power flow (kW). Positive = V2G export */
  realTimeFlowKw: number;
  /** Whether Vehicle-to-Grid is currently active */
  v2gActive: boolean;
}

export interface StayTimeline {
  /** Time the vehicle connected */
  connectedAt: string;
  /** Current timestamp */
  currentAt: string;
  /** Expected departure time */
  departureAt: string;
  /** Normalized progress through stay (0–1) */
  progress: number;
}

export interface V2GFinancials {
  /** Cumulative V2G profit earned (USD) */
  v2gProfitEarnedUsd: number;
  /** Current energy market price (USD / kWh) */
  currentEnergyPriceUsdPerKwh: number;
}

export interface EvOwnerDashboard {
  soc: SoCStatus;
  energy: EnergyInsights;
  timeline: StayTimeline;
  financials: V2GFinancials;
}

export interface EvOwnerVehicle {
  /** Display name shown in app */
  vehicleName: string;
  /** Masked VIN (for demo) */
  vinMasked: string;
  /** Battery usable capacity (kWh) */
  batteryCapacityKwh: number;
  /** Estimated range (km) */
  estimatedRangeKm: number;
  /** Odometer (km) */
  odometerKm: number;
  /** Charger / plug status label */
  plugStatusLabel: string;
  /** Charger location label */
  chargerLocationLabel: string;
  /** Current charge power (kW) */
  currentChargePowerKw: number;
  /** Max charge power (kW) */
  maxChargePowerKw: number;
  /** Target SoC (0–100) */
  targetSocPercentage: number;
}

export interface EvOwnerFinancialsSummary {
  /** V2G earnings today (USD) */
  todayV2gEarningsUsd: number;
  /** V2G earnings month-to-date (USD) */
  monthToDateV2gEarningsUsd: number;
  /** Lifetime V2G profit (USD) */
  lifetimeV2gProfitUsd: number;
  /** Energy exported today via V2G (kWh) */
  energyExportedTodayKwh: number;
  /** Average sell price (USD / kWh) */
  averageSellPriceUsdPerKwh: number;
  /** Next payout date label */
  nextPayoutDate: string;
  /** Estimated next payout (USD) */
  estimatedNextPayoutUsd: number;
}

export interface EvOwnerSettings {
  accountName: string;
  defaultVehicleName: string;
  currency: string;
  homeGridRegion: string;
  notificationsEnabled: boolean;
  autoOptimizeEnabled: boolean;
  dataRefreshIntervalSec: number;
}

// ---------------------------------------------------------------------------
// Mock Data (matches code.html exactly)
// ---------------------------------------------------------------------------

export const mockEvOwnerDashboard: EvOwnerDashboard = {
  soc: {
    percentage: 75,
    statusLabel: 'Optimized',
    targetDepartureTime: '07:30 AM',
  },
  energy: {
    energyTransferredKwh: 42.8,
    realTimeFlowKw: 4.2,
    v2gActive: true,
  },
  timeline: {
    connectedAt: '07:45 PM',
    currentAt: '02:15 AM',
    departureAt: '07:30 AM',
    progress: 0.6,
  },
  financials: {
    v2gProfitEarnedUsd: 124.50,
    currentEnergyPriceUsdPerKwh: 0.14,
  },
};

// ---------------------------------------------------------------------------
// Additional Mock Data (for Vehicle / Financials / Settings tabs)
// ---------------------------------------------------------------------------

export const mockEvOwnerVehicle: EvOwnerVehicle = {
  vehicleName: 'VFluxion EV • Model S',
  vinMasked: '5YJ3•••••••A12345',
  batteryCapacityKwh: 78.0,
  estimatedRangeKm: 412,
  odometerKm: 18240,
  plugStatusLabel: 'Plugged in • Charging',
  chargerLocationLabel: 'Home Charger (AC)',
  currentChargePowerKw: 6.8,
  maxChargePowerKw: 11.0,
  targetSocPercentage: 85,
};

export const mockEvOwnerFinancialsSummary: EvOwnerFinancialsSummary = {
  todayV2gEarningsUsd: 6.75,
  monthToDateV2gEarningsUsd: 58.40,
  lifetimeV2gProfitUsd: 124.50,
  energyExportedTodayKwh: 12.4,
  averageSellPriceUsdPerKwh: 0.16,
  nextPayoutDate: 'May 15, 2026',
  estimatedNextPayoutUsd: 18.20,
};

export const mockEvOwnerSettings: EvOwnerSettings = {
  accountName: 'EV Owner',
  defaultVehicleName: 'VFluxion EV • Model S',
  currency: 'USD',
  homeGridRegion: 'Hanoi (VN)',
  notificationsEnabled: true,
  autoOptimizeEnabled: true,
  dataRefreshIntervalSec: 5,
};
