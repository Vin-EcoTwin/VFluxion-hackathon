import { redirect } from "next/navigation";

export default function HomePage() {
  // Public-facing entry point: send first-time visitors straight to the CPO live map.
  // If an auth guard is added later, keep /cpo/live-map in its public allowlist.
  redirect("/cpo/live-map");
}

