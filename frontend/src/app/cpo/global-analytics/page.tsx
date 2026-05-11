import React from "react";

export default function GlobalAnalyticsPage() {
  return (
    <div className="p-container-margin grid grid-cols-1 md:grid-cols-12 gap-widget-gap h-full overflow-y-auto custom-scrollbar relative z-10 pointer-events-auto">
      
      {/* Background grid pattern matching layout but specific to analytics */}
      <div className="absolute inset-0 chart-grid opacity-5 pointer-events-none -z-10"></div>

      {/* Alert Ticker */}
      <div className="col-span-1 md:col-span-12 glass-panel rounded-xl h-12 flex items-center px-md gap-md overflow-hidden border-l-4 border-l-error">
        <span className="material-symbols-outlined text-error pulse-emerald" style={{ animationName: "pulse", color: "#ffb4ab" }}>
          campaign
        </span>
        <div className="font-label-md text-label-md text-error flex-1 truncate">
          <span className="font-bold mr-sm">ACTIVE DEMAND RESPONSE (DR) EVENT:</span> 
          Zone Alpha-7 critical load predicted at 18:00 UTC. Initiating V2G discharge protocol across 452 connected fleets. Grid frequency stabilization active.
        </div>
        <span className="font-data-mono text-data-mono text-on-surface-variant text-sm">T-00:42:15</span>
      </div>

      {/* User Satisfaction */}
      <div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between border-cyan-glow">
        <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-xs">
          <h2 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider text-primary">User Satisfaction Index</h2>
          <span className="material-symbols-outlined text-primary text-[16px]">sentiment_satisfied</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Circular Progress Mock */}
          <div className="w-48 h-48 rounded-full border-[12px] border-surface-variant relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[12px] border-secondary border-t-transparent border-r-transparent rotate-45"></div>
            <div className="text-center">
              <div className="font-headline-xl text-headline-xl text-secondary">92<span className="text-xl">%</span></div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-xs">City-Wide Fulfillment</div>
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-lg px-md">
            <div className="text-center">
              <div className="font-data-mono text-data-mono text-on-surface">14.2k</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="font-data-mono text-data-mono text-secondary">+2.4%</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">7D Trend</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue, Cost & Pricing */}
      <div className="col-span-1 md:col-span-8 glass-panel-cyan rounded-xl p-md flex flex-col">
        <div className="flex justify-between items-center mb-md border-b border-primary/20 pb-xs">
          <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Revenue, Cost &amp; Pricing Dynamics</h2>
          <div className="flex bg-surface-variant/50 rounded-lg p-xs gap-xs">
            <button className="px-sm py-xs text-xs font-label-md text-label-md rounded text-on-surface-variant hover:bg-surface-variant transition-colors">1D</button>
            <button className="px-sm py-xs text-xs font-label-md text-label-md rounded bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">3D</button>
            <button className="px-sm py-xs text-xs font-label-md text-label-md rounded text-on-surface-variant hover:bg-surface-variant transition-colors">7D</button>
          </div>
        </div>
        
        <div className="flex-1 relative min-h-[250px] w-full flex items-end mt-sm">
          {/* Abstract Chart Mockup using divs */}
          <div className="absolute inset-0 border-b border-l border-outline-variant/30"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pt-sm">
            <div className="w-full h-px bg-outline-variant/10"></div>
            <div className="w-full h-px bg-outline-variant/10"></div>
            <div className="w-full h-px bg-outline-variant/10"></div>
            <div className="w-full h-px bg-outline-variant/10"></div>
          </div>
          
          {/* Area Chart Layers */}
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-primary/20 to-transparent flex items-end pb-px">
            {/* SVG Path roughly imitating a chart */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,100 L0,50 Q25,30 50,60 T100,20 L100,100 Z" fill="rgba(34, 211, 238, 0.1)" stroke="#22d3ee" strokeWidth="0.5"></path>
              <path d="M0,100 L0,70 Q25,80 50,40 T100,60 L100,100 Z" fill="rgba(78, 222, 163, 0.1)" stroke="#4edea3" strokeWidth="0.5"></path>
            </svg>
          </div>
          
          {/* Legend */}
          <div className="absolute top-sm left-md flex gap-md">
            <div className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="font-label-sm text-label-sm text-on-surface-variant">V2G Revenue</span></div>
            <div className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-secondary"></span><span className="font-label-sm text-label-sm text-on-surface-variant">Dynamic Pricing</span></div>
            <div className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-surface-variant"></span><span className="font-label-sm text-label-sm text-on-surface-variant">Profit Margin</span></div>
          </div>
        </div>
        
        <div className="flex justify-between mt-sm pt-sm border-t border-outline-variant/20 font-data-mono text-data-mono text-xs text-on-surface-variant">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Environment & Peripheral Grid */}
      <div className="col-span-1 md:col-span-12 glass-panel rounded-xl p-md flex flex-col border-glow-emerald">
        <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-xs">
          <h2 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider text-primary">Environment &amp; Peripheral Grid Status</h2>
          <span className="material-symbols-outlined text-primary text-[16px]">eco</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg h-full">
          {/* Solar Generation */}
          <div className="bg-surface/30 rounded-lg p-md border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-sm left-sm material-symbols-outlined text-secondary opacity-50">solar_power</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-sm">Solar Generation</div>
            <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden mt-sm">
              <div className="h-full bg-secondary w-[68%] shadow-[0_0_10px_rgba(78,222,163,0.5)]"></div>
            </div>
            <div className="flex justify-between w-full mt-xs font-data-mono text-data-mono text-sm">
              <span className="text-on-surface">68%</span>
              <span className="text-on-surface-variant">142 MW</span>
            </div>
          </div>
          
          {/* Wind Generation */}
          <div className="bg-surface/30 rounded-lg p-md border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-sm left-sm material-symbols-outlined text-primary opacity-50">air</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-sm">Wind Generation</div>
            <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden mt-sm">
              <div className="h-full bg-primary w-[42%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
            </div>
            <div className="flex justify-between w-full mt-xs font-data-mono text-data-mono text-sm">
              <span className="text-on-surface">42%</span>
              <span className="text-on-surface-variant">88 MW</span>
            </div>
          </div>
          
          {/* Fixed Base-load */}
          <div className="bg-surface/30 rounded-lg p-md border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-sm left-sm material-symbols-outlined text-error opacity-50">factory</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-sm">Fixed Base-load</div>
            <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden mt-sm">
              <div className="h-full bg-error w-[85%] shadow-[0_0_10px_rgba(255,178,183,0.5)]"></div>
            </div>
            <div className="flex justify-between w-full mt-xs font-data-mono text-data-mono text-sm">
              <span className="text-on-surface text-error">85%</span>
              <span className="text-on-surface-variant">450 MW</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
