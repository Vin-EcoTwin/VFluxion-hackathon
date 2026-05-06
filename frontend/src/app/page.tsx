"use client";

import { useAppPreferences } from "@/hooks/useAppPreferences";
import { DigitalTwinWorkbench } from "@/features/digitalTwin/components/DigitalTwinWorkbench";

export default function HomePage() {
  useAppPreferences();
  return <DigitalTwinWorkbench />;
}
