import type {
  ChargingStation,
  ActiveEV,
  Stall,
  EVFinancialHorizon,
  TransformerEntity,
  TransformerTelemetry
} from "@/types/cpo";

// ---------------------------------------------------------------------------
// Helper: build a financial horizon with mock history
// ---------------------------------------------------------------------------
export function buildHorizon(
  currentRate: number,
  sessionImpact: number,
  days: number
): EVFinancialHorizon {
  const pts = Array.from({ length: days * 4 }, (_, i) => ({
    time: `${String(Math.floor((i * 6) % 24)).padStart(2, "0")}:00`,
    powerKw: i % 3 === 0 ? -(Math.random() * 15 + 5) : Math.random() * 12 + 3,
    socPercent: Math.min(100, 40 + i * (50 / (days * 4)))
  }));
  return {
    currentRate,
    sessionImpact,
    powerHistory: pts,
    recentLogs: [
      { startTime: "14:00", endTime: "15:30", mode: "V2G", energyKwh: 15, financialImpact: 6.3 },
      { startTime: "11:00", endTime: "13:00", mode: "G2V", energyKwh: 30, financialImpact: -12.6 },
      { startTime: "09:00", endTime: "10:30", mode: "G2V", energyKwh: 20, financialImpact: -8.4 }
    ]
  };
}

// ---------------------------------------------------------------------------
// Mock EV data (normalized schema)
// ---------------------------------------------------------------------------
export const MOCK_EVS: ActiveEV[] = [
  {
    id: "EV-9942-X",
    stallId: "station-01-stall-1",
    stationId: "station-01",
    position: [-73.986, 40.757],
    vehicleType: "Volkswagen ID.4 Pro S",
    licensePlate: "NYC-4X2-VW",
    isDischarging: true,
    connectedTime: "08:42",
    socPercent: 84,
    targetSocPercent: 90,
    departureTime: "18:00",
    minutesUntilDeparture: 150,
    pset: -7.2,
    ptot: -7.1,
    currentLoadPercent: 84,
    reliefKw: -12,
    revenue: 4.82,
    rate: 0.32,
    financials: {
      "1D": buildHorizon(0.42, 4.82, 1),
      "3D": buildHorizon(0.41, 14.1, 3),
      "7D": buildHorizon(0.43, 31.5, 7)
    }
  },
  {
    id: "EV-1123-Y",
    stallId: "station-01-stall-2",
    stationId: "station-01",
    position: [-73.9854, 40.7579],
    vehicleType: "Hyundai Ioniq 5",
    licensePlate: "NYC-1Y3-HY",
    isDischarging: false,
    connectedTime: "09:15",
    socPercent: 45,
    targetSocPercent: 80,
    departureTime: "17:30",
    minutesUntilDeparture: 90,
    pset: 11,
    ptot: 10.8,
    currentLoadPercent: 45,
    reliefKw: 0,
    revenue: 0,
    rate: 0.35,
    financials: {
      "1D": buildHorizon(0.35, -22.0, 1),
      "3D": buildHorizon(0.35, -63.0, 3),
      "7D": buildHorizon(0.36, -140.0, 7)
    }
  },
  {
    id: "EV-5541-Z",
    stallId: "station-02-stall-1",
    stationId: "station-02",
    position: [-73.9939, 40.7507],
    vehicleType: "Tesla Model 3 LR",
    licensePlate: "NYC-5Z9-TS",
    isDischarging: true,
    connectedTime: "07:30",
    socPercent: 60,
    targetSocPercent: 70,
    departureTime: "16:00",
    minutesUntilDeparture: 30,
    pset: -9,
    ptot: -8.8,
    currentLoadPercent: 60,
    reliefKw: -15,
    revenue: 6.5,
    rate: 0.38,
    financials: {
      "1D": buildHorizon(0.38, 6.5, 1),
      "3D": buildHorizon(0.38, 19.0, 3),
      "7D": buildHorizon(0.39, 45.0, 7)
    }
  }
];

// ---------------------------------------------------------------------------
// Station helpers
// ---------------------------------------------------------------------------
const defaultFinancials = {
  "1D": { currentRate: 0.42, v2gProfit: 142, pset: 320, ptot: 295 },
  "3D": { currentRate: 0.41, v2gProfit: 410, pset: 950, ptot: 880 },
  "7D": { currentRate: 0.43, v2gProfit: 980, pset: 2200, ptot: 2050 }
};

// Map to look up EVs by station easily
const EVS_BY_STATION = new Map<string, ActiveEV[]>();
MOCK_EVS.forEach(ev => {
  if (ev.stationId) {
    if (!EVS_BY_STATION.has(ev.stationId)) EVS_BY_STATION.set(ev.stationId, []);
    EVS_BY_STATION.get(ev.stationId)!.push(ev);
  }
});

const STATION_POSITIONS: Record<string, [number, number]> = {
  "station-01": [-73.9855, 40.758],
  "station-02": [-73.994, 40.7506],
  "station-03": [-73.9772, 40.7527],
  "station-04": [-73.991, 40.7359],
  "station-05": [-74.009, 40.706],
  "station-06": [-73.9817, 40.7681],
  "station-07": [-73.9967, 40.7158],
  "station-08": [-74.015, 40.712],
  "station-09": [-73.97, 40.76],
  "station-10": [-73.98, 40.73],
  "station-11": [-74.00, 40.74],
  "station-12": [-73.96, 40.77],
  "station-13": [-73.99, 40.72],
  "station-14": [-74.01, 40.75]
};

function buildStallsForStation(stationId: string, totalStalls: number, targetInUse: number): Stall[] {
  const stationEVs = EVS_BY_STATION.get(stationId) || [];
  const stalls: Stall[] = [];
  const basePos = STATION_POSITIONS[stationId] || [-73.9855, 40.758];

  // 1. Add stalls for actual EVs we have in the database
  for (const ev of stationEVs) {
    stalls.push({
      id: ev.stallId!,
      status: ev.isDischarging ? "DISCHARGING" : "CHARGING",
      evId: ev.id,
      powerKw: ev.ptot
    });
  }

  // 2. Pad with mock in-use stalls if we didn't define enough real EVs
  let mockInUseCount = targetInUse - stationEVs.length;
  let stallIndex = stalls.length + 1;
  while (mockInUseCount > 0 && stalls.length < totalStalls) {
    const isDischarging = stallIndex % 2 === 0;
    const mockId = `EV-MOCK-${stationId}-${stallIndex}`;
    const powerKw = isDischarging ? -7.2 : 11.0;

    stalls.push({
      id: `${stationId}-stall-${stallIndex}`,
      status: isDischarging ? "DISCHARGING" : "CHARGING",
      evId: mockId,
      powerKw
    });

    const horizon = buildHorizon(0.35, isDischarging ? 4.5 : -8.0, 1);

    // Offset each EV slightly so they don't perfectly overlap at the station center
    const evPos: [number, number] = [
      basePos[0] + (stallIndex * 0.00025),
      basePos[1] + (stallIndex * 0.0001)
    ];

    // Add it to MOCK_EVS so it resolves correctly with exact state when clicked
    MOCK_EVS.push({
      id: mockId,
      stallId: `${stationId}-stall-${stallIndex}`,
      stationId: stationId,
      position: evPos,
      vehicleType: isDischarging ? "Nissan Leaf (V2G Capable)" : "Standard EV",
      licensePlate: "UNK-" + (1000 + stallIndex),
      isDischarging,
      connectedTime: "10:30",
      socPercent: isDischarging ? 85 : 40,
      targetSocPercent: 90,
      departureTime: "18:00",
      minutesUntilDeparture: 180,
      pset: powerKw,
      ptot: powerKw,
      currentLoadPercent: 75,
      reliefKw: isDischarging ? -7.2 : 0,
      revenue: isDischarging ? 4.5 : 0,
      rate: 0.35,
      financials: { "1D": horizon, "3D": horizon, "7D": horizon }
    });

    stallIndex++;
    mockInUseCount--;
  }

  // 3. Pad with available stalls up to totalStalls
  while (stalls.length < totalStalls) {
    stalls.push({
      id: `${stationId}-stall-${stallIndex}`,
      status: "AVAILABLE"
    });
    stallIndex++;
  }

  return stalls;
}

export const CHARGING_STATIONS: ChargingStation[] = [
  { id: "station-01", name: "Times Sq Hub", position: STATION_POSITIONS["station-01"], totalStalls: 7, activeStalls: 7, inUseStalls: 5, stalls: buildStallsForStation("station-01", 7, 5), financials: defaultFinancials, fulfillment: 94 },
  { id: "station-02", name: "Penn Station", position: STATION_POSITIONS["station-02"], totalStalls: 7, activeStalls: 6, inUseStalls: 4, stalls: buildStallsForStation("station-02", 7, 4), financials: defaultFinancials, fulfillment: 88 },
  { id: "station-03", name: "Grand Central", position: STATION_POSITIONS["station-03"], totalStalls: 7, activeStalls: 7, inUseStalls: 6, stalls: buildStallsForStation("station-03", 7, 6), financials: defaultFinancials, fulfillment: 96 },
  { id: "station-04", name: "Union Square", position: STATION_POSITIONS["station-04"], totalStalls: 7, activeStalls: 6, inUseStalls: 3, stalls: buildStallsForStation("station-04", 7, 3), financials: defaultFinancials, fulfillment: 91 },
  { id: "station-05", name: "Wall Street", position: STATION_POSITIONS["station-05"], totalStalls: 7, activeStalls: 5, inUseStalls: 2, stalls: buildStallsForStation("station-05", 7, 2), financials: defaultFinancials, fulfillment: 85 },
  { id: "station-06", name: "Central Park S", position: STATION_POSITIONS["station-06"], totalStalls: 7, activeStalls: 7, inUseStalls: 4, stalls: buildStallsForStation("station-06", 7, 4), financials: defaultFinancials, fulfillment: 95 },
  { id: "station-07", name: "Chinatown", position: STATION_POSITIONS["station-07"], totalStalls: 7, activeStalls: 6, inUseStalls: 6, stalls: buildStallsForStation("station-07", 7, 6), financials: defaultFinancials, fulfillment: 92 },
  { id: "station-08", name: "Tribeca Hub", position: STATION_POSITIONS["station-08"], totalStalls: 7, activeStalls: 7, inUseStalls: 5, stalls: buildStallsForStation("station-08", 7, 5), financials: defaultFinancials, fulfillment: 90 },
  { id: "station-09", name: "Columbus Circle", position: STATION_POSITIONS["station-09"], totalStalls: 7, activeStalls: 6, inUseStalls: 4, stalls: buildStallsForStation("station-09", 7, 4), financials: defaultFinancials, fulfillment: 85 },
  { id: "station-10", name: "East Village", position: STATION_POSITIONS["station-10"], totalStalls: 7, activeStalls: 7, inUseStalls: 6, stalls: buildStallsForStation("station-10", 7, 6), financials: defaultFinancials, fulfillment: 92 },
  { id: "station-11", name: "Chelsea", position: STATION_POSITIONS["station-11"], totalStalls: 7, activeStalls: 6, inUseStalls: 3, stalls: buildStallsForStation("station-11", 7, 3), financials: defaultFinancials, fulfillment: 88 },
  { id: "station-12", name: "Upper East Side", position: STATION_POSITIONS["station-12"], totalStalls: 7, activeStalls: 5, inUseStalls: 2, stalls: buildStallsForStation("station-12", 7, 2), financials: defaultFinancials, fulfillment: 80 },
  { id: "station-13", name: "SoHo", position: STATION_POSITIONS["station-13"], totalStalls: 7, activeStalls: 7, inUseStalls: 4, stalls: buildStallsForStation("station-13", 7, 4), financials: defaultFinancials, fulfillment: 93 },
  { id: "station-14", name: "Hudson Yards", position: STATION_POSITIONS["station-14"], totalStalls: 7, activeStalls: 6, inUseStalls: 6, stalls: buildStallsForStation("station-14", 7, 6), financials: defaultFinancials, fulfillment: 96 }
];

function buildTransformerHistory(baseKw: number): TransformerEntity["powerHistory"] {
  return Array.from({ length: 12 }, (_, idx) => {
    const wave = Math.sin((idx / 11) * Math.PI * 2);
    return {
      time: `${String(6 + idx).padStart(2, "0")}:00`,
      netPower: Math.max(0, Math.round(baseKw + wave * baseKw * 0.18))
    };
  });
}

function buildTransformerTelemetry(baseKw: number): TransformerTelemetry {
  const inflexibleLoad = Math.round(baseKw * 0.45);
  return {
    timestamp: new Date().toISOString(),
    loadFactor: 0,
    inflexibleLoad,
    inflexibleLoadBreakdown: {
      residentialKw: Math.round(inflexibleLoad * 0.6),
      industrialKw: Math.round(inflexibleLoad * 0.4)
    },
    evLoad: 0,
    evLoadBreakdown: {
      carsKw: 0,
      trucksKw: 0,
      degradationCost: 0
    },
    pvGeneration: Math.round(baseKw * 0.12),
    netPower: 0,
    drCapacityReduction: 0
  };
}

export const TRANSFORMERS: TransformerEntity[] = [
  {
    id: "transformer-01",
    name: "TX-SUBSTATION-01",
    position: [-73.99, 40.75],
    heading: 25,
    maxCapacityKw: 1500,
    minCapacityKw: -300,
    stationIds: ["station-01", "station-02", "station-04", "station-10", "station-11", "station-14"],
    telemetry: {
      ...buildTransformerTelemetry(1500),
      drCapacityReduction: 20
    },
    status: "optimal",
    drEvent: {
      label: "Peak Shaving",
      minutesRemaining: 15
    },
    health: {
      hotSpotTempC: 84,
      lossOfLifeDailyPct: 0.02
    },
    powerHistory: buildTransformerHistory(1180)
  },
  {
    id: "transformer-02",
    name: "TX-SUBSTATION-02",
    position: [-74.005, 40.71],
    heading: -15,
    maxCapacityKw: 2000,
    minCapacityKw: -500,
    stationIds: ["station-05", "station-07", "station-08", "station-13"],
    telemetry: {
      ...buildTransformerTelemetry(2000),
      drCapacityReduction: 0
    },
    status: "optimal",
    health: {
      hotSpotTempC: 78,
      lossOfLifeDailyPct: 0.015
    },
    powerHistory: buildTransformerHistory(1450)
  },
  {
    id: "transformer-03",
    name: "TX-SUBSTATION-03",
    position: [-73.97, 40.76],
    heading: 45,
    maxCapacityKw: 1800,
    minCapacityKw: -400,
    stationIds: ["station-03", "station-06", "station-09", "station-12"],
    telemetry: {
      ...buildTransformerTelemetry(1800),
      drCapacityReduction: 10
    },
    status: "optimal",
    health: {
      hotSpotTempC: 80,
      lossOfLifeDailyPct: 0.018
    },
    powerHistory: buildTransformerHistory(1300)
  }
];
