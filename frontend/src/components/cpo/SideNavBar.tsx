export function SideNavBar() {
  return (
    <nav className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-20 hover:w-64 transition-all duration-500 z-40 bg-surface-container-low/40 backdrop-blur-lg border-r border-outline-variant/10 shadow-xl flex-col py-md gap-widget-gap group ease-in-out hover:backdrop-blur-2xl hover:bg-surface-variant/30 overflow-hidden">

      {/* Header Info (Expanded) */}
      <div className="px-md flex items-center gap-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-48 whitespace-nowrap">
        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
        </div>
        <div>
          <div className="font-label-md text-label-md text-on-surface">CPO Admin</div>
          <div className="font-label-sm text-label-sm text-outline">Zone Alpha-7</div>
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/20 my-xs"></div>

      {/* Empty space since we removed other nav tabs for now */}
      <div className="flex-1"></div>

      <div className="mt-auto flex flex-col gap-xs w-full">
        <div className="w-full h-px bg-outline-variant/20 mb-xs"></div>
        <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary-fixed border-l-4 border-transparent hover:bg-surface-variant/50 w-full group/item transition-colors">
          <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
          <span className="font-label-md text-label-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Logs</span>
        </a>
        <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary-fixed border-l-4 border-transparent hover:bg-surface-variant/50 w-full group/item transition-colors">
          <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>help_center</span>
          <span className="font-label-md text-label-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Support</span>
        </a>

        {/* CTA Button (Expanded) */}
        <div className="px-md mt-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pb-md">
          <button className="w-full bg-error/10 border border-error/50 text-error hover:bg-error/20 font-label-sm text-label-sm py-xs rounded-DEFAULT transition-colors flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Emergency Shutdown
          </button>
        </div>
      </div>
    </nav>
  );
}
