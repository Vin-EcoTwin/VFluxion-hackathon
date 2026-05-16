"use client";

import { useMemo } from "react";
import type { TransformerEntity, ChargingStation } from "@/types/cpo";

function loadBand(loadFactor: number) {
  if (loadFactor >= 0.9) return "critical";
  if (loadFactor >= 0.7) return "warning";
  return "optimal";
}

function bandStyles(band: "optimal" | "warning" | "critical") {
  if (band === "critical") {
    return {
      bar: "bg-red-500",
      text: "text-red-400",
      glow: "border-red-400/40 shadow-[0_0_24px_rgba(239,68,68,0.18)]"
    };
  }
  if (band === "warning") {
    return {
      bar: "bg-amber-400",
      text: "text-amber-300",
      glow: "border-amber-400/40 shadow-[0_0_24px_rgba(251,191,36,0.16)]"
    };
  }
  return {
    bar: "bg-emerald-400",
    text: "text-emerald-300",
    glow: "border-emerald-400/40 shadow-[0_0_24px_rgba(52,211,153,0.16)]"
  };
}

function formatKw(value: number) {
  return `${Math.round(value)} kW`;
}

export function TransformerDeepDivePanel({
  onClose,
  data,
  stations
}: {
  onClose: () => void;
  data?: TransformerEntity;
  stations?: ChargingStation[];
}) {
  if (!data) return null;
  const telemetry = data.telemetry;
  const loadPct = Math.round(telemetry.loadFactor * 100);
  const band = loadBand(telemetry.loadFactor);
  const styles = bandStyles(band);
  const drActive = telemetry.drCapacityReduction > 0;

  const history = data.powerHistory ?? [];
  const sparkline = useMemo(() => {
    if (history.length < 2) return "";
    const values = history.map((point) => point.netPower);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(1, max - min);
    return history
      .map((point, idx) => {
        const x = (idx / (history.length - 1)) * 100;
        const y = 40 - ((point.netPower - min) / range) * 36 - 2;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [history]);

  return (
    <div className="absolute right-container-margin top-[calc(64px+32px)] bottom-container-margin w-[420px] z-30 flex flex-col pointer-events-auto">
      <div className={`glass-panel rounded-xl p-md flex justify-between items-start flex-shrink-0 mb-3 ${styles.glow}`}>
        <div className="flex items-start gap-sm">
          <span className="material-symbols-outlined text-primary">electrical_services</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-on-surface">{data.name}</h2>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${styles.text} border border-current/30`}>
                {data.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-data-mono mt-0.5">{data.id}</p>
            <p className="text-[11px] text-on-surface-variant">
              {data.position[1].toFixed(4)} N, {data.position[0].toFixed(4)} E
            </p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-sm pb-sm -mr-sm flex flex-col gap-widget-gap custom-scrollbar">
        <section className="glass-panel rounded-xl p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Load factor</span>
            <span className={`font-data-mono text-sm ${styles.text}`}>{loadPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-variant/40">
            <div className={`${styles.bar} h-2 rounded-full`} style={{ width: `${Math.min(100, Math.max(0, loadPct))}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>Net Power</span>
            <span className="text-on-surface">
              <span className={data.minCapacityKw !== undefined && telemetry.netPower < data.minCapacityKw ? "text-red-400 font-bold" : ""}>
                {formatKw(telemetry.netPower)}
              </span>
              {" / Max: "}{formatKw(data.maxCapacityKw)}
              {data.minCapacityKw !== undefined && ` | Min: ${formatKw(data.minCapacityKw)}`}
            </span>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Aggregation Breakdown</span>
            <span className="text-[10px] text-on-surface-variant">{data.stationIds.length} stations</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Inflexible load (P^L)</span>
            <span className="text-red-300">+{formatKw(telemetry.inflexibleLoad)}</span>
          </div>
          {telemetry.inflexibleLoadBreakdown && (
            <div className="flex flex-col gap-1 pl-4 border-l border-outline-variant/30 mt-1 mb-2">
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>Residential (Home)</span>
                <span className="text-red-300/80">+{formatKw(telemetry.inflexibleLoadBreakdown.residentialKw)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>Industrial (Factory)</span>
                <span className="text-red-300/80">+{formatKw(telemetry.inflexibleLoadBreakdown.industrialKw)}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">EV load (P^EVs)</span>
            <span className="text-amber-300">{telemetry.evLoad >= 0 ? "+" : ""}{formatKw(telemetry.evLoad)}</span>
          </div>
          {telemetry.evLoadBreakdown && (
            <div className="flex flex-col gap-1 pl-4 border-l border-outline-variant/30 mt-1 mb-2">
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>Electric Cars</span>
                <span className="text-amber-300/80">{telemetry.evLoadBreakdown.carsKw >= 0 ? "+" : ""}{formatKw(telemetry.evLoadBreakdown.carsKw)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>Electric Trucks</span>
                <span className="text-amber-300/80">{telemetry.evLoadBreakdown.trucksKw >= 0 ? "+" : ""}{formatKw(telemetry.evLoadBreakdown.trucksKw)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-on-surface-variant mt-1 border-t border-outline-variant/20 pt-1">
                <span className="italic text-error">V2G Degradation Cost (C_deg)</span>
                <span className="text-error">${telemetry.evLoadBreakdown.degradationCost.toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">PV generation (P^PV)</span>
            <span className="text-emerald-300">-{formatKw(telemetry.pvGeneration)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-outline-variant/30 pt-2">
            <span className="text-on-surface">Net power</span>
            <span className="text-primary">{formatKw(telemetry.netPower)}</span>
          </div>
        </section>

        {stations && stations.length > 0 && (
          <section className="glass-panel rounded-xl p-md flex flex-col gap-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Connected Stations ({stations.length})</span>
            <div className="flex flex-col gap-2 mt-1">
              {stations.map(station => (
                <div key={station.id} className="flex justify-between items-center bg-surface-variant/20 p-2 rounded-lg border border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface font-semibold">{station.name}</span>
                    <span className="text-[10px] text-on-surface-variant">{station.inUseStalls}/{station.activeStalls} stalls active</span>
                  </div>
                  <div className="text-xs text-primary font-data-mono">
                    {(station.stalls.reduce((sum, stall) => sum + (stall.powerKw ?? 0), 0)) >= 0 ? "+" : ""}{formatKw(station.stalls.reduce((sum, stall) => sum + (stall.powerKw ?? 0), 0))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {drActive && (
          <section className="glass-panel rounded-xl p-md border border-red-400/40 bg-red-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-red-300">Demand response</span>
              <span className="text-[10px] text-red-200">{data.drEvent?.label ?? "DR Event"}</span>
            </div>
            <p className="mt-2 text-xs text-red-200">
              Reduce capacity by {telemetry.drCapacityReduction}% for {data.drEvent?.minutesRemaining ?? 15} min.
            </p>
          </section>
        )}

        <section className="glass-panel rounded-xl p-md flex flex-col gap-sm">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant">Asset health</span>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Hot-spot temp</span>
            <span className="text-on-surface">{data.health?.hotSpotTempC ?? 82} C</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Loss of life</span>
            <span className="text-on-surface">+{data.health?.lossOfLifeDailyPct ?? 0.02}% / day</span>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-md flex flex-col gap-sm">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant">Net power trend</span>
          {history.length > 1 ? (
            <div className="rounded-lg bg-surface-variant/30 p-2">
              <svg viewBox="0 0 100 40" className="w-full h-20">
                <polyline
                  points={sparkline}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant">
                <span>{history[0].time}</span>
                <span>{history[history.length - 1].time}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant">No history yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
