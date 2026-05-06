"use client";

import type { ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUIStore } from "@/stores/ui.store";
import type { UIState } from "@/stores/ui.store";

type ResizableSplitPaneProps = {
  left: ReactNode;
  right: ReactNode;
};

export function ResizableSplitPane({ left, right }: ResizableSplitPaneProps) {
  const hiddenPane = useUIStore((state: UIState) => state.hiddenPane);
  const resetPane = useUIStore((state: UIState) => state.resetPane);

  if (hiddenPane === "map") {
    return (
      <section className="relative h-[calc(100vh-4rem)] w-full">
        {right}
        <button
          type="button"
          onClick={resetPane}
          className="absolute bottom-4 right-4 rounded-md border border-[color:var(--app-border-strong)] bg-[var(--panel-background)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--text-primary)]"
        >
          Restore Split
        </button>
      </section>
    );
  }

  if (hiddenPane === "dashboard") {
    return (
      <section className="relative h-[calc(100vh-4rem)] w-full">
        {left}
        <button
          type="button"
          onClick={resetPane}
          className="absolute bottom-4 right-4 rounded-md border border-[color:var(--app-border-strong)] bg-[var(--panel-background)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--text-primary)]"
        >
          Restore Split
        </button>
      </section>
    );
  }

  return (
    <section className="h-[calc(100vh-4rem)] w-full">
      <PanelGroup autoSaveId="main-split-pane" direction="horizontal">
        <Panel className="overflow-hidden" defaultSize={60} minSize={30}>
          {left}
        </Panel>

        <PanelResizeHandle className="group relative w-2 bg-[color:var(--app-border)] transition-colors hover:bg-[color:var(--app-border-strong)]">
          <span className="absolute left-1/2 top-1/2 h-14 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-primary)]/60 shadow-neon" />
        </PanelResizeHandle>

        <Panel className="overflow-hidden" defaultSize={40} minSize={25}>
          {right}
        </Panel>
      </PanelGroup>
    </section>
  );
}
