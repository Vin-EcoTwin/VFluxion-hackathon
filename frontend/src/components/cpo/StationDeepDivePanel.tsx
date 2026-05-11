import { useState } from "react";
import type { ChargingStation } from "@/types/cpo";

export function StationDeepDivePanel({ onClose, data, onSelectEV }: { onClose: () => void, data?: ChargingStation, onSelectEV?: (evId: string) => void }) {
  const [timeFilter, setTimeFilter] = useState<'1D' | '3D' | '7D'>('1D');

  // Use mock data if not provided
  const stationData = data || {
    id: "STATION-X9",
    name: "Demo Station",
    position: [0, 0] as [number, number],
    totalStalls: 7,
    activeStalls: 7,
    inUseStalls: 5,
    stalls: [],
    financials: {
      '1D': { currentRate: 0.42, v2gProfit: 142, pset: 320, ptot: 295 },
      '3D': { currentRate: 0.41, v2gProfit: 410, pset: 950, ptot: 880 },
      '7D': { currentRate: 0.43, v2gProfit: 980, pset: 2200, ptot: 2050 }
    },
    fulfillment: 94
  };

  const currentFinancials = stationData.financials?.[timeFilter] || stationData.financials['1D'];

  return (
    <div className="absolute right-container-margin top-[calc(64px+32px)] bottom-container-margin w-[400px] z-30 flex flex-col gap-widget-gap">
      {/* Header / Close */}
      <div className="glass-panel rounded-xl p-md flex justify-between items-center pointer-events-auto border-cyan-glow">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">ev_station</span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Station {stationData.id} Detail</h2>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-sm pb-sm -mr-sm flex flex-col gap-widget-gap pointer-events-auto custom-scrollbar">
        {/* Station Status / Stalls */}
        <section className="glass-panel rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Station Status ({stationData.inUseStalls}/{stationData.totalStalls} In Use)</h3>
          </div>
          
          <div className="flex gap-sm flex-wrap">
            {stationData.stalls?.map((stall) => {
              const isDischarging = stall.status === 'DISCHARGING';
              const isCharging = stall.status === 'CHARGING';
              const isAvailable = stall.status === 'AVAILABLE';

              if (isAvailable) {
                return (
                  <div key={stall.id} className="flex flex-col items-center p-sm bg-surface-container/10 border border-outline-variant/10 rounded-lg flex-1 min-w-[80px] opacity-40">
                    <span className="material-symbols-outlined text-[32px] text-outline-variant">
                      local_parking
                    </span>
                    <span className="font-label-sm text-[10px] mt-2 text-on-surface-variant uppercase text-center">
                      Available
                    </span>
                    <span className="font-data-mono text-[14px] mt-1 text-transparent">
                      0 kW
                    </span>
                  </div>
                );
              }

              return (
                <button 
                  key={stall.id} 
                  onClick={() => stall.evId && onSelectEV?.(stall.evId)}
                  className="flex flex-col items-center p-sm bg-surface-container/50 border border-outline-variant/20 rounded-lg flex-1 min-w-[80px] hover:bg-surface-variant/50 transition-colors cursor-pointer text-left"
                >
                  <span className={`material-symbols-outlined text-[32px] ${isDischarging ? 'text-secondary pulse-emerald' : 'text-primary'}`}>
                    ev_station
                  </span>
                  <span className="font-label-sm text-[10px] mt-2 text-on-surface-variant uppercase text-center">
                    {isDischarging ? 'Discharging' : 'Charging'}
                  </span>
                  <span className={`font-data-mono text-[14px] mt-1 ${isDischarging ? 'text-secondary' : 'text-primary'}`}>
                    {stall.powerKw > 0 ? `+${stall.powerKw}` : stall.powerKw} kW
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Pset vs Ptot */}
        <section className="glass-panel rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Power Delivery (Pset vs Ptot)</h3>
          </div>
          <div className="flex flex-col gap-sm">
            <div className="flex justify-between items-end mb-xs">
              <div className="flex items-center gap-xs">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="font-label-sm text-label-sm text-on-surface">Pset (Available)</span>
              </div>
              <span className="font-data-mono text-data-mono text-primary">{currentFinancials.pset} kW</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            
            <div className="flex justify-between items-end mt-sm mb-xs">
              <div className="flex items-center gap-xs">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="font-label-sm text-label-sm text-on-surface">Ptot (Actual)</span>
              </div>
              <span className="font-data-mono text-data-mono text-secondary">{currentFinancials.ptot} kW</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: '74%' }}></div>
            </div>
          </div>
        </section>

        {/* Station Financials */}
        <section className="glass-panel rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Financials</h3>
            <div className="flex bg-surface-variant rounded p-xs gap-xs">
              <button 
                className={`px-2 py-1 rounded font-label-sm text-[10px] ${timeFilter === '1D' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setTimeFilter('1D')}
              >
                1D
              </button>
              <button 
                className={`px-2 py-1 rounded font-label-sm text-[10px] ${timeFilter === '3D' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setTimeFilter('3D')}
              >
                3D
              </button>
              <button 
                className={`px-2 py-1 rounded font-label-sm text-[10px] ${timeFilter === '7D' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setTimeFilter('7D')}
              >
                7D
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="bg-surface/30 border border-outline-variant/30 rounded-lg p-sm flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Current Rate</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-data-mono text-headline-md text-primary">${currentFinancials.currentRate}</span>
                <span className="font-label-sm text-on-surface-variant">/kWh</span>
              </div>
            </div>
            <div className="bg-surface/30 border border-outline-variant/30 rounded-lg p-sm flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant mb-xs">V2G Profit</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-data-mono text-headline-md text-secondary">+${currentFinancials.v2gProfit}</span>
                <span className="material-symbols-outlined text-secondary text-[16px]">trending_up</span>
              </div>
            </div>
          </div>
        </section>

        {/* User Satisfaction */}
        <section className="glass-panel rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">User Fulfillment</h3>
          </div>
          <div className="flex items-center gap-lg">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(133, 147, 151, 0.2)" strokeWidth="8"></circle>
                <circle cx="50" cy="50" fill="none" r="45" stroke="#22d3ee" strokeDasharray="282.7" strokeDashoffset={`${282.7 - (282.7 * stationData.fulfillment) / 100}`} strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">sentiment_satisfied</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-data-mono text-headline-lg text-primary">{stationData.fulfillment}%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Target Departure SoC Met</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
