import Link from "next/link";

export function SideNavBar() {
  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-white border-r border-outline-variant/30 py-md z-50">
      <div className="px-6 mb-10">
        <img src="/images/logo.png" alt="V-fluxion Logo" className="h-10 w-auto" />
        <p className="font-label-caps text-label-caps text-primary/60 mt-1 uppercase tracking-widest">Bidirectional Energy</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        <Link href="/ev-owner/dashboard" className="bg-primary/10 text-primary border-l-4 border-primary px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Overview</span>
        </Link>
        <Link href="#" className="text-on-surface-variant hover:text-primary px-4 py-3 flex items-center gap-3 transition-all hover:bg-primary/5 hover:translate-x-1">
          <span className="material-symbols-outlined">electric_car</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Vehicle Status</span>
        </Link>
        <Link href="#" className="text-on-surface-variant hover:text-primary px-4 py-3 flex items-center gap-3 transition-all hover:bg-primary/5 hover:translate-x-1">
          <span className="material-symbols-outlined">bolt</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Power Flow</span>
        </Link>
        <Link href="#" className="text-on-surface-variant hover:text-primary px-4 py-3 flex items-center gap-3 transition-all hover:bg-primary/5 hover:translate-x-1">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Financials</span>
        </Link>
        <Link href="#" className="text-on-surface-variant hover:text-primary px-4 py-3 flex items-center gap-3 transition-all hover:bg-primary/5 hover:translate-x-1">
          <span className="material-symbols-outlined">hub</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Network Control</span>
        </Link>
      </nav>
      
      <div className="px-4 mb-lg">
        <button className="w-full py-3 bg-primary text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:brightness-95 active:scale-95 transition-all shadow-sm">
          <span className="material-symbols-outlined">add</span>
          <span className="font-label-caps text-label-caps">Add Node</span>
        </button>
      </div>
      
      <footer className="mt-auto pt-md border-t border-outline-variant/30">
        <Link href="#" className="text-on-surface-variant hover:text-primary px-4 py-3 flex items-center gap-3 transition-all">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-caps text-label-caps uppercase">Settings</span>
        </Link>
        <Link href="#" className="text-on-surface-variant hover:text-primary px-4 py-3 flex items-center gap-3 transition-all">
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-caps text-label-caps uppercase">Support</span>
        </Link>
        <div className="flex items-center gap-3 px-4 mt-4 mb-4">
          <div className="w-8 h-8 rounded-full border border-primary/20 bg-primary-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[16px]">person</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface">EV_OWNER</span>
            <span className="font-label-caps text-[8px] text-primary">SECURE LINE</span>
          </div>
        </div>
      </footer>
    </aside>
  );
}
