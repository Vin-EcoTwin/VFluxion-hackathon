import Link from "next/link";

export function TopNavBar() {
  return (
    <header className="bg-white border-b border-outline-variant/30 shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4">
      <div className="flex items-center gap-8">
        <img src="/images/logo.png" alt="V-fluxion Logo" className="h-8 w-auto" />
        <nav className="hidden lg:flex gap-6 items-center">
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-body-md">Technology</Link>
          <Link href="/ev-owner/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md">EV Owners</Link>
          <Link href="/cpo/live-map" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-body-md">CPO</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined p-2 hover:bg-primary/10 rounded-lg cursor-pointer transition-all text-on-surface-variant">light_mode</span>
        <button className="bg-primary px-6 py-2 rounded-lg text-white font-bold hover:brightness-95 transition-all active:scale-95 duration-150 font-body-md shadow-sm">
          Join the Network
        </button>
      </div>
    </header>
  );
}
