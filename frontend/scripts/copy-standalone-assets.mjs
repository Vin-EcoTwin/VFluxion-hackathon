import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  console.warn("Standalone output was not found. Skipping asset copy.");
  process.exit(0);
}

const copies = [
  [path.join(root, "public"), path.join(standaloneDir, "public")],
  [path.join(root, ".next", "static"), path.join(standaloneDir, ".next", "static")]
];

for (const [source, target] of copies) {
  if (!existsSync(source)) {
    continue;
  }

  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
}
