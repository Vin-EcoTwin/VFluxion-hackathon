export type StallStatus = 'AVAILABLE' | 'CHARGING' | 'DISCHARGING';

export type Stall = {
  id: string;
  status: StallStatus;
  evId?: string;
  powerKw?: number;
};

export type Financials = {
  currentRate: number;
  v2gProfit: number;
  pset: number;
  ptot: number;
};

export type ChargingStation = {
  id: string;
  name: string;
  position: [number, number];
  totalStalls: number;
  activeStalls: number;
  inUseStalls: number;
  stalls: Stall[];
  financials: {
    '1D': Financials;
    '3D': Financials;
    '7D': Financials;
  };
  fulfillment: number;
};

// ---------------------------------------------------------------
// EV Power History — one data point per recorded interval
// ---------------------------------------------------------------
export type EVPowerHistoryPoint = {
  /** ISO timestamp or HH:MM string */
  time: string;
  /** Positive = G2V (charging), Negative = V2G (discharging), in kW */
  powerKw: number;
  /** State-of-Charge at that point, 0–100 */
  socPercent: number;
};

export type EVHistoryLog = {
  startTime: string;
  endTime: string;
  /** 'V2G' | 'G2V' */
  mode: 'V2G' | 'G2V';
  /** Energy transferred in kWh (absolute) */
  energyKwh: number;
  /** Financial impact: positive = revenue, negative = cost */
  financialImpact: number;
};

export type EVFinancialHorizon = {
  currentRate: number;
  /** Positive = V2G revenue earned, negative = charging cost */
  sessionImpact: number;
  powerHistory: EVPowerHistoryPoint[];
  recentLogs: EVHistoryLog[];
};

// ---------------------------------------------------------------
// Core ActiveEV entity — used by map layer + EVDeepDivePanel
// ---------------------------------------------------------------
export type ActiveEV = {
  id: string;
  stallId?: string;
  stationId?: string;
  /** [longitude, latitude] */
  position: [number, number];
  vehicleType: string;
  licensePlate?: string;
  /** true = V2G discharging, false = G2V charging */
  isDischarging: boolean;
  /** Wall-clock time the session started, e.g. "08:42" */
  connectedTime: string;

  // --- Battery ---
  /** Current State-of-Charge, 0–100 */
  socPercent: number;
  /** Customer-requested target SoC, 0–100 */
  targetSocPercent: number;
  /** Expected departure wall-clock time, e.g. "18:00" */
  departureTime: string;
  /** Minutes remaining until departure */
  minutesUntilDeparture: number;

  // --- Port Power ---
  /** Allocated power limit from CPO (kW, negative = discharge) */
  pset: number;
  /** Actual realized power (kW, negative = discharge) */
  ptot: number;

  // --- Legacy / convenience fields kept for backward compat ---
  currentLoadPercent: number;
  reliefKw: number;
  revenue: number;
  rate: number;

  // --- Financial horizons ---
  financials: {
    '1D': EVFinancialHorizon;
    '3D': EVFinancialHorizon;
    '7D': EVFinancialHorizon;
  };
};
