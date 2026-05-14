# VFluxion GridFlow Mobile

VFluxion GridFlow Mobile is the React Native and Expo application for EV owners in the VFluxion ecosystem. It helps users monitor vehicle battery status, session timelines, V2G energy flow, and financial outcomes from bidirectional charging.

## Features

| Area | Description |
| --- | --- |
| Overview | Real-time state of charge, power flow, session progress, and quick V2G financial summary. |
| Vehicle | Vehicle health, estimated range, charge power, VIN display, charger status, and diagnostics. |
| Financials | Charging costs, V2G earnings, exported energy, session history, and payout estimates. |
| Settings | Account preferences, grid region, notifications, auto-optimization, and refresh interval. |

## Tech Stack

- React Native with Expo SDK 54
- TypeScript
- React Navigation with native stack and bottom tabs
- `react-native-svg` for gauges and chart visuals
- Space Grotesk via Expo Google Fonts
- Material Icons via `@expo/vector-icons`

## Project Structure

```text
mobile/
├── src/
│   ├── components/        # Reusable UI components
│   ├── data/              # Mock EV owner data and interfaces
│   ├── navigation/        # Root stack and bottom tab navigation
│   ├── screens/           # Login, Overview, Vehicle, Financials, Settings
│   └── theme/             # Color, spacing, radius, shadow, typography tokens
├── App.tsx                # Expo application root
├── app.json               # Expo app configuration
├── package.json           # Scripts and dependencies
└── README.md
```

## Installation

Run commands from the repository root unless noted otherwise.

```bash
cd mobile
npm install
```

## Development

Start the Expo development server:

```bash
npm start
```

Common launch targets:

```bash
npm run android
npm run ios
npm run web
```

You can also run:

```bash
npx expo start
```

Then scan the QR code with Expo Go on a physical device, open an emulator, or press `w` in the terminal for a web preview.

## Configuration

The Expo app is configured in `app.json` with:

- App name: `VFluxion GridFlow`
- Slug: `vfluxion-gridflow-ev-owner`
- iOS bundle identifier: `com.vfluxion.gridflow`
- Android package: `com.vfluxion.gridflow`

## Branding

All mobile views should use the footer credit:

```text
POWERED BY VFLUXION TEAM
```

## Notes

- Bottom tab navigation uses a rounded active indicator for a softer modern tab state.
- Mock data lives in `src/data/ev-owner.ts` and is shaped to align with future VFluxion backend API responses.

POWERED BY VFLUXION TEAM
