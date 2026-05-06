# Frontend - Digital Twin V2G

Frontend su dung Next.js 15 App Router, TypeScript strict, Tailwind CSS, Tremor, CesiumJS, deck.gl.

## Muc tieu

- 3D map interactive (Cesium base globe + terrain + building context).
- Dynamic layers (deck.gl): EV, power lines, heatmap.
- Dashboard cyberpunk cho KPI, load, simulation state.
- Realtime stream voi backend qua WebSocket.

## Scripts

- npm run dev: Chay local dev server.
- npm run build: Build production.
- npm run start: Start production server.
- npm run typecheck: Kiem tra TypeScript.

## Chay local nhanh

1. Copy env mau:

	Copy-Item .env.local.example .env.local

2. Cai dependencies:

	npm install

3. Chay dev server:

	npm run dev

4. Mo trinh duyet:

	http://localhost:3000

## Xu ly loi JSX trong editor

Neu gap loi JSX.IntrinsicElements:

1. npm install
2. TypeScript: Restart TS Server
3. Reload VS Code neu can

## Cau truc

Theo domain + feature:

- src/app: App Router entry.
- src/components: Components UI + map + dashboard.
- src/map: Cesium/deck helpers va bridge.
- src/services: REST/WS clients.
- src/stores: Zustand stores.
- src/domains: Entity-specific types/logic.
