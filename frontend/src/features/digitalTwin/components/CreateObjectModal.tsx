"use client";

import { useMemo, useState } from "react";
import type { CreateObjectPayload, CreateObjectType, LngLatAlt } from "@/features/digitalTwin/types/twin";

type CreateObjectModalProps = {
  open: boolean;
  coordinate: LngLatAlt | null;
  isValidPosition?: boolean;
  onClose: () => void;
  onCreate: (payload: CreateObjectPayload) => Promise<void>;
};

export function CreateObjectModal({ open, coordinate, isValidPosition, onClose, onCreate }: CreateObjectModalProps) {
  const [type, setType] = useState<CreateObjectType>("EV");
  const [name, setName] = useState("New object");
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [capacity, setCapacity] = useState(4);
  const [maxMw, setMaxMw] = useState(9);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState(0);

  const title = useMemo(() => {
    if (type === "EV") {
      return "Create Electric Car";
    }
    if (type === "CHARGING_STATION") {
      return "Create Charging Station";
    }
    return "Create Power Substation";
  }, [type]);

  if (!open || !coordinate) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-xl border border-[color:var(--app-border-strong)] bg-[var(--panel-background)] p-4 text-[var(--text-primary)] shadow-panel backdrop-blur-md">
        <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[0.16em]">{title}</h3>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Position: {coordinate[0].toFixed(6)}, {coordinate[1].toFixed(6)}
        </p>

        {isValidPosition === false && (
          <div className="mt-2 rounded border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-400">
            Vị trí đè lên công trình khác
          </div>
        )}

        <div className="mt-3 space-y-3 text-sm">
          <label className="flex flex-col gap-1">
            Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value as CreateObjectType)}
              className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] px-2 py-1 outline-none"
            >
              <option value="EV">Electric Car</option>
              <option value="CHARGING_STATION">Charging Station</option>
              <option value="POWER_SUBSTATION">Power Substation</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] px-2 py-1 outline-none"
            />
          </label>

          {type === "EV" && (
            <label className="flex flex-col gap-1">
              Battery Level (%)
              <input
                type="number"
                min={1}
                max={100}
                value={batteryLevel}
                onChange={(event) => setBatteryLevel(Number(event.target.value))}
                className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] px-2 py-1 outline-none"
              />
            </label>
          )}

          {type === "CHARGING_STATION" && (
            <>
              <label className="flex flex-col gap-1">
                Heading (degrees)
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={heading}
                    onChange={(event) => setHeading(Number(event.target.value))}
                    className="flex-1 rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] outline-none"
                  />
                  <span className="w-8 text-right text-xs text-[var(--text-muted)]">{heading}°</span>
                </div>
              </label>

              <label className="flex flex-col gap-1">
                Capacity (ports)
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={capacity}
                  onChange={(event) => setCapacity(Number(event.target.value))}
                  className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] px-2 py-1 outline-none"
                />
              </label>
            </>
          )}

          {type === "POWER_SUBSTATION" && (
            <label className="flex flex-col gap-1">
              Max Capacity (MW)
              <input
                type="number"
                min={1}
                max={50}
                value={maxMw}
                onChange={(event) => setMaxMw(Number(event.target.value))}
                className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] px-2 py-1 outline-none"
              />
            </label>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[color:var(--app-border)] px-3 py-1 text-xs uppercase tracking-[0.12em]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || isValidPosition === false}
            onClick={async () => {
              setSaving(true);
              try {
                await onCreate({
                  type,
                  name: name.trim() || "Unnamed",
                  position: coordinate,
                  heading,
                  batteryLevel,
                  capacity,
                  maxMw
                });
                onClose();
              } finally {
                setSaving(false);
              }
            }}
            className="rounded border border-[color:var(--app-border-strong)] bg-[var(--surface-soft)] px-3 py-1 text-xs uppercase tracking-[0.12em]"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
