export default function EvOwnerDashboardPage() {
  return (
    <div className="p-8 pb-20">
      <header className="mb-lg">
        <h2 className="font-h2 text-[32px] text-on-primary-container font-semibold">EV Owner Portal - My Vehicle Status</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">LIVE DATA FEED ACTIVE</span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        
        {/* Widget 1: State of Charge (SoC) */}
        <div className="col-span-12 lg:col-span-4 white-card p-md rounded-xl flex flex-col items-center justify-between min-h-[400px]">
          <span className="self-start font-label-caps text-label-caps text-on-surface-variant">STATE OF CHARGE</span>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-variant" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary arc-gauge" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeLinecap="round" strokeWidth="12" style={{ strokeDashoffset: '70' }}></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-stat-display text-[64px] font-bold text-primary">75%</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">OPTIMIZED</span>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-4 pt-4 border-t border-outline-variant/30">
            <div className="text-center">
              <p className="font-label-caps text-[10px] text-on-surface-variant">ENERGY TRANSFERRED</p>
              <p className="font-h3 text-[24px] text-on-primary-container">42.8 <span className="text-sm text-primary">kWh</span></p>
            </div>
            <div className="text-center">
              <p className="font-label-caps text-[10px] text-on-surface-variant">TARGET DEPARTURE</p>
              <p className="font-h3 text-[24px] text-on-primary-container">07:30 <span className="text-sm text-primary">AM</span></p>
            </div>
          </div>
        </div>

        {/* Widget 2: Real-time Power */}
        <div className="col-span-12 lg:col-span-8 white-card p-md rounded-xl flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">REAL-TIME POWER FLOW (V2G)</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Import</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></div>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Export (Profit)</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative chart-grid rounded-lg border border-outline-variant/30 bg-white">
            <div className="absolute inset-0 flex items-end">
              <svg className="w-full h-48 overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <path d="M0,100 Q125,150 250,100 T500,100 T750,100 T1000,100" fill="none" stroke="#7CB342" strokeWidth="3"></path>
                <path d="M0,100 Q125,150 250,100 T500,100 T750,100 T1000,100 V200 H0 Z" fill="#7CB342" fillOpacity="0.1"></path>
                <circle cx="250" cy="100" fill="#7CB342" r="4"></circle>
                <circle cx="500" cy="100" fill="#7CB342" r="4"></circle>
                <circle cx="750" cy="100" fill="#7CB342" r="4"></circle>
              </svg>
            </div>
            <div className="absolute top-4 left-4 z-10">
              <p className="font-stat-display text-[48px] font-bold text-primary">+11.4 <span className="text-xl">kW</span></p>
            </div>
          </div>
        </div>

        {/* Widget 3: Time Management */}
        <div className="col-span-12 lg:col-span-7 white-card p-md rounded-xl">
          <span className="font-label-caps text-label-caps text-on-surface-variant mb-6 block">STAY DURATION &amp; TIMELINE</span>
          <div className="relative py-12 mb-4">
            <div className="h-1 bg-surface-container w-full rounded-full absolute top-1/2 transform -translate-y-1/2"></div>
            <div className="h-1 bg-primary w-2/3 rounded-full absolute top-1/2 transform -translate-y-1/2"></div>
            
            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary rounded-full mb-3 border-4 border-white"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-label-caps text-[10px] text-on-surface uppercase">Connected</span>
                  <span className="font-body-md text-sm text-on-surface-variant">07:45 PM</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary rounded-full mb-3 border-4 border-white shadow-sm"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-label-caps text-[10px] text-primary uppercase">Current</span>
                  <span className="font-body-md text-sm text-primary">02:15 AM</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-surface-container-highest rounded-full mb-3 border-4 border-white"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Departure</span>
                  <span className="font-body-md text-sm text-on-surface-variant">07:30 AM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-gutter">
            <div className="flex-1 p-4 bg-surface-container/30 rounded-lg">
              <p className="font-label-caps text-[10px] text-on-surface-variant">ELAPSED</p>
              <p className="font-h3 text-[20px] text-on-primary-container">06h 30m</p>
            </div>
            <div className="flex-1 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
              <p className="font-label-caps text-[10px] text-primary">REMAINING TO TARGET</p>
              <p className="font-h3 text-[20px] text-primary">05h 15m</p>
            </div>
          </div>
        </div>

        {/* Widget 4: Financial Benefits */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-gutter">
          <div className="white-card flex-1 p-md rounded-xl flex items-center gap-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]">payments</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">CURRENT ENERGY PRICE</p>
              <p className="font-h1 text-[40px] font-bold text-on-primary-container leading-tight mb-3">$0.14 <span className="text-xl text-on-surface-variant font-normal">/ kWh</span></p>
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                <span className="text-xs font-label-caps">-12% Low Demand Period</span>
              </div>
            </div>
          </div>
          <div className="white-card flex-1 p-md pb-8 rounded-xl border-l-4 border-primary bg-primary/5">
            <div className="flex justify-between items-start mb-3">
              <p className="font-label-caps text-label-caps text-primary">V2G PROFIT EARNED (TOTAL)</p>
              <span className="material-symbols-outlined text-primary">verified</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <p className="font-stat-display text-[56px] font-bold text-primary leading-none">$124.50</p>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant mt-2">Your vehicle helped stabilize the grid for 14 hours this month.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
