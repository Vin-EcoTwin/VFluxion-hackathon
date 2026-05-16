import type { ReactNode } from "react";
import { SideNavBar } from "@/components/ev-owner/SideNavBar";
import { TopNavBar } from "@/components/ev-owner/TopNavBar";

export default function EvOwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="light bg-background text-on-surface h-screen w-screen overflow-hidden flex font-body-md selection:bg-primary/20 selection:text-primary">
      <SideNavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
