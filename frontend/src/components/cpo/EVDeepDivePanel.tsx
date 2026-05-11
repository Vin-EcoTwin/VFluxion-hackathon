"use client";

import { useState, useRef, useEffect } from "react";
import type { ActiveEV, EVPowerHistoryPoint, EVHistoryLog } from "@/types/cpo";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmtDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Dual-ring SVG SoC indicator */
function SoCRing({ soc, target }: { soc: number; target: number }) {
  const r = 52;
  const cx = 64;
  const circumference = 2 * Math.PI * r;
  const socOffset = circumference - (circumference * soc) / 100;
  const targetAngle = (target / 100) * 360 - 90; // CSS rotate starts at top
  const rad = (targetAngle * Math.PI) / 180;
  const tx = cx + r * Math.cos(rad);
  const ty = cx + r * Math.sin(rad);

  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className="flex-shrink-0">
      {/* Track */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      {/* SoC arc */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={soc > 50 ? "#4ede a3" : "#22d3ee"}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={socOffset}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ stroke: soc > 50 ? "#4edea3" : "#22d3ee", transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Target marker */}
      <circle cx={tx} cy={ty} r={6} fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
      {/* Center labels */}
      <text x={cx} y={cx - 8} textAnchor="middle" className="fill-white" fontSize="22" fontWeight="700" fontFamily="monospace">{soc}%</text>
      <text x={cx} y={cx + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">SoC</text>
      <text x={cx} y={cx + 26} textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">▶ {target}%</text>
    </svg>
  );
}

/** Mini bidirectional power + SoC chart */
function MiniChart({ data }: { data: EVPowerHistoryPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; pt: EVPowerHistoryPoint } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const maxPow = Math.max(...data.map((d) => Math.abs(d.powerKw)));
    const midY = H * 0.55; // axis sits slightly above center to give more room to discharge (negative)

    // Zero line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(W, midY);
    ctx.stroke();

    const barW = (W / data.length) * 0.7;
    const gap  = W / data.length;

    data.forEach((pt, i) => {
      const x = i * gap + gap * 0.15;
      const normalized = Math.abs(pt.powerKw) / (maxPow || 1);
      const barH = normalized * midY * 0.9;
      const isV2G = pt.powerKw < 0;

      const grad = ctx.createLinearGradient(0, isV2G ? midY : midY - barH, 0, isV2G ? midY + barH : midY);
      if (isV2G) {
        grad.addColorStop(0, "rgba(251,146,60,0.8)");
        grad.addColorStop(1, "rgba(251,146,60,0.2)");
      } else {
        grad.addColorStop(0, "rgba(78,222,163,0.9)");
        grad.addColorStop(1, "rgba(78,222,163,0.2)");
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, isV2G ? midY : midY - barH, barW, barH, 2);
      ctx.fill();
    });

    // SoC line
    ctx.beginPath();
    ctx.strokeStyle = "rgba(250,204,21,0.8)";
    ctx.lineWidth = 1.5;
    data.forEach((pt, i) => {
      const x = i * gap + gap / 2;
      const y = (1 - pt.socPercent / 100) * (H * 0.85) + H * 0.05;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

  }, [data]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(data.length - 1, Math.floor(xRel * data.length));
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, pt: data[idx] });
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={360}
        height={140}
        className="w-full rounded-lg"
        style={{ height: 140 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div
          className="absolute z-50 bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1 text-[10px] font-data-mono text-on-surface pointer-events-none shadow-xl"
          style={{ left: tooltip.x + 8, top: tooltip.y - 32 }}
        >
          <span className="text-on-surface-variant">{tooltip.pt.time}</span>
          <span className={`ml-2 ${tooltip.pt.powerKw < 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {tooltip.pt.powerKw > 0 ? "+" : ""}{tooltip.pt.powerKw.toFixed(1)} kW
          </span>
          <span className="ml-2 text-yellow-400">SoC {tooltip.pt.socPercent}%</span>
        </div>
      )}
      {/* Legend */}
      <div className="flex gap-3 mt-1 text-[9px] font-data-mono text-on-surface-variant">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />G2V Charge</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />V2G Discharge</span>
        <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-yellow-400 inline-block" />SoC %</span>
      </div>
    </div>
  );
}

/** Single history log row */
function LogRow({ log }: { log: EVHistoryLog }) {
  const isV2G = log.mode === "V2G";
  return (
    <div className="flex items-center gap-2 text-[10px] font-data-mono py-1 border-b border-outline-variant/10 last:border-0">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isV2G ? "bg-amber-400" : "bg-emerald-400"}`} />
      <span className="text-on-surface-variant">{log.startTime}–{log.endTime}</span>
      <span className={`font-semibold ${isV2G ? "text-amber-400" : "text-emerald-400"}`}>
        {isV2G ? "V2G Discharge" : "Smart Charge"}
      </span>
      <span className="ml-auto text-on-surface">{isV2G ? "-" : "+"}{log.energyKwh} kWh</span>
      <span className={isV2G ? "text-emerald-400" : "text-amber-400"}>
        {isV2G ? "+" : "-"}${Math.abs(log.financialImpact).toFixed(2)}
      </span>
    </div>
  );
}

// ─── Default mock EV (self-contained so panel works standalone) ──────────────
function buildHorizon(rate: number, impact: number, days: number) {
  const pts = Array.from({ length: days * 6 }, (_, i) => ({
    time: `${String(Math.floor((i * 4) % 24)).padStart(2, "0")}:00`,
    powerKw: i % 3 === 0 ? -(Math.random() * 15 + 5) : Math.random() * 12 + 3,
    socPercent: Math.min(100, 40 + i * (50 / (days * 6)))
  }));
  return {
    currentRate: rate,
    sessionImpact: impact,
    powerHistory: pts,
    recentLogs: [
      { startTime: "14:00", endTime: "15:30", mode: "V2G" as const, energyKwh: 15, financialImpact: 6.3 },
      { startTime: "11:00", endTime: "13:00", mode: "G2V" as const, energyKwh: 30, financialImpact: -12.6 },
      { startTime: "09:00", endTime: "10:30", mode: "G2V" as const, energyKwh: 20, financialImpact: -8.4 }
    ]
  };
}

const MOCK_EV_STANDALONE: ActiveEV = {
  id: "EV-9942-X",
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
};

// ─── Main component ──────────────────────────────────────────────────────────
export function EVDeepDivePanel({
  onClose,
  data
}: {
  onClose: () => void;
  data?: ActiveEV;
}) {
  const ev = data || MOCK_EV_STANDALONE;
  const [timeFilter, setTimeFilter] = useState<"1D" | "3D" | "7D">("1D");

  const horizon = ev.financials[timeFilter];
  const isV2G   = ev.isDischarging;

  const glowClass    = isV2G ? "border-amber-400/40 shadow-[0_0_24px_rgba(251,146,60,0.15)]"
                              : "border-emerald-400/40 shadow-[0_0_24px_rgba(78,222,163,0.15)]";
  const accentText   = isV2G ? "text-amber-400" : "text-emerald-400";
  const accentBg     = isV2G ? "bg-amber-400/10"    : "bg-emerald-400/10";
  const accentBorder = isV2G ? "border-amber-400/30" : "border-emerald-400/30";

  const psetAbs = Math.abs(ev.pset);
  const ptotAbs = Math.abs(ev.ptot);
  const ptotPct = psetAbs > 0 ? Math.min(100, (ptotAbs / psetAbs) * 100) : 0;

  return (
    <div className="absolute left-container-margin md:left-[calc(80px+32px)] top-[calc(64px+32px)] bottom-container-margin w-[420px] z-30 flex flex-col pointer-events-auto select-none">
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <div className={`glass-panel rounded-xl px-4 py-3 border ${glowClass} flex justify-between items-start flex-shrink-0 mb-3`}>
        {/* Icon + title */}
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined text-[28px] mt-0.5 ${accentText}`}>electric_car</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">{ev.vehicleType}</h2>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${accentBg} ${accentText} border ${accentBorder} uppercase tracking-wider`}>
                {isV2G ? "V2G Discharging" : "Smart Charging"}
              </span>
            </div>
            <div className="font-data-mono text-[11px] text-on-surface-variant mt-0.5">
              {ev.id} {ev.licensePlate && `· ${ev.licensePlate}`}
            </div>
          </div>
        </div>
        <button
          className="text-outline hover:text-on-surface transition-colors ml-2 flex-shrink-0"
          onClick={onClose}
          aria-label="Close EV panel"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 pb-2 custom-scrollbar">

        {/* ── a. Battery & Fulfillment ──────────────────────────────────── */}
        <section className={`glass-panel rounded-xl p-4 border ${glowClass}`}>
          <div className="flex gap-4 items-center">
            {/* SoC Ring */}
            <SoCRing soc={ev.socPercent} target={ev.targetSocPercent} />

            {/* Right-side info */}
            <div className="flex flex-col gap-3 flex-1">
              {/* Current power */}
              <div>
                <div className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider mb-0.5">Current Power</div>
                <div className={`font-data-mono text-[22px] font-bold leading-none ${isV2G ? "text-amber-400" : "text-emerald-400"}`}>
                  {ev.ptot > 0 ? "+" : ""}{ev.ptot} <span className="text-[12px] text-outline">kW</span>
                </div>
              </div>

              {/* Departure */}
              <div>
                <div className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider mb-0.5">Departure</div>
                <div className="font-data-mono text-[13px] text-on-surface">
                  {ev.departureTime}
                  <span className="text-on-surface-variant text-[10px] ml-1">({fmtDuration(ev.minutesUntilDeparture)} left)</span>
                </div>
              </div>

              {/* Fulfillment message */}
              <div className={`text-[9px] ${accentText} ${accentBg} border ${accentBorder} rounded-lg px-2 py-1 leading-snug`}>
                {isV2G
                  ? `V2G active · will reach ${ev.targetSocPercent}% before departure`
                  : `On track to reach ${ev.targetSocPercent}% before departure`}
              </div>
            </div>
          </div>

          {/* Target SoC label */}
          <div className="mt-2 flex gap-3 text-[9px] font-data-mono text-on-surface-variant">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Current SoC: {ev.socPercent}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Target: {ev.targetSocPercent}%</span>
            <span className="flex items-center gap-1 text-outline">Connected: {ev.connectedTime}</span>
          </div>
        </section>

        {/* ── b. Port Power Delivery (Pset vs Ptot) ───────────────────── */}
        <section className="glass-panel rounded-xl p-4">
          <h3 className="font-label-sm text-[9px] text-outline uppercase tracking-wider mb-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">compare_arrows</span>
            Port Power Delivery
          </h3>

          {/* Pset */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] font-data-mono mb-1">
              <span className="text-on-surface-variant">Pset <span className="text-[9px]">(Allocated Limit)</span></span>
              <span className="text-on-surface">{isV2G ? "-" : "+"}{psetAbs} kW</span>
            </div>
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary/40 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Ptot */}
          <div>
            <div className="flex justify-between text-[10px] font-data-mono mb-1">
              <span className="text-on-surface-variant">Ptot <span className="text-[9px]">(Actual Realized)</span></span>
              <span className={accentText}>{isV2G ? "-" : "+"}{ptotAbs} kW</span>
            </div>
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isV2G ? "bg-amber-400" : "bg-emerald-400"}`}
                style={{ width: `${ptotPct}%` }}
              />
            </div>
            <div className="text-[9px] text-on-surface-variant text-right mt-0.5 font-data-mono">
              {ptotPct.toFixed(1)}% of allocated
            </div>
          </div>
        </section>

        {/* ── c. Financials & Time Horizon ────────────────────────────── */}
        <section className="glass-panel rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-sm text-[9px] text-outline uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">payments</span>
              Financials
            </h3>
            {/* Time filter segmented control */}
            <div className="flex bg-surface-variant/50 border border-outline-variant/20 rounded-lg p-0.5 gap-0.5">
              {(["1D", "3D", "7D"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-2.5 py-0.5 rounded text-[9px] font-semibold transition-all ${
                    timeFilter === f
                      ? "bg-primary/20 text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Current Rate */}
            <div className="bg-surface/30 border border-outline-variant/20 rounded-lg p-3">
              <div className="font-label-sm text-[9px] text-on-surface-variant mb-1">Current Rate</div>
              <div className="flex items-baseline gap-1">
                <span className="font-data-mono text-[18px] text-primary">${horizon.currentRate}</span>
                <span className="text-[9px] text-on-surface-variant">/kWh</span>
              </div>
            </div>

            {/* Session impact */}
            <div className="bg-surface/30 border border-outline-variant/20 rounded-lg p-3">
              <div className="font-label-sm text-[9px] text-on-surface-variant mb-1">
                {isV2G ? "V2G Profit" : "Charging Cost"}
              </div>
              <div className={`font-data-mono text-[18px] ${isV2G ? "text-emerald-400" : "text-amber-400"}`}>
                {isV2G ? "+" : "-"}${Math.abs(horizon.sessionImpact).toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* ── d. Power & SoC History ──────────────────────────────────── */}
        <section className="glass-panel rounded-xl p-4">
          <h3 className="font-label-sm text-[9px] text-outline uppercase tracking-wider mb-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">bar_chart</span>
            Power & SoC History <span className="text-on-surface-variant ml-1 normal-case">({timeFilter})</span>
          </h3>

          <MiniChart data={horizon.powerHistory} />

          {/* Recent logs */}
          <div className="mt-3">
            <div className="text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Recent Sessions</div>
            {horizon.recentLogs.map((log, i) => (
              <LogRow key={i} log={log} />
            ))}
          </div>
        </section>

        {/* ── GDPR badge ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 bg-surface-container/30 border border-outline-variant/20 rounded-lg p-2">
          <span className="material-symbols-outlined text-outline text-[15px]">lock</span>
          <span className="font-body-sm text-[9px] text-on-surface-variant leading-tight">
            Driver identity &amp; sensitive data masked per GDPR protocols.
          </span>
        </div>
      </div>
    </div>
  );
}
