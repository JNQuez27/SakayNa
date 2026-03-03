# SakayNa — Davao City Jeepney Transit Platform

> Real-time jeepney tracking and route discovery for Davao City commuters and drivers.

Our mission is to modernize Davao City's jeepney network through real-time data connectivity — empowering commuters with reliable arrival information and equipping drivers with demand insights, ensuring faster trips, safer travel, and increased daily earnings.

Route data sourced from [commutedavao.com](https://commutedavao.com) (Tatskiee/Commutedavao on GitHub).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [App Flows](#app-flows)
5. [Internationalization (i18n)](#internationalization-i18n)
6. [Iconography](#iconography)
7. [Theme System](#theme-system)
8. [Location-Based Route Sorting](#location-based-route-sorting)
9. [Map Integration](#map-integration)
10. [Backend](#backend)
11. [Shared Package](#shared-package)
12. [Recent Improvements](#recent-improvements)
13. [Business Model](#business-model)
14. [Contributing](#contributing)

---

## Tech Stack

| Layer            | Technology                         | Version                 |
| ---------------- | ---------------------------------- | ----------------------- |
| Mobile Framework | React Native (Expo)                | RN 0.83.2 / Expo SDK 55 |
| Language         | TypeScript                         | 5.9                     |
| Maps             | Leaflet via `react-native-webview` | Leaflet 1.9.4           |
| GPS              | `expo-location`                    | ~55.x                   |
| Icons            | Ionicons (`@expo/vector-icons`)    | —                       |
| Backend          | Express + Socket.IO                | Node.js                 |
| Monorepo         | npm Workspaces                     | —                       |

---

## Project Structure

```
SakayNa/
├── apps/
│   ├── driver/                        # Driver mobile app
│   │   ├── App.tsx                    # Root — wraps with LanguageProvider
│   │   ├── app.json                   # Expo config
│   │   ├── index.ts                   # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── assets/                    # Splash images, icons
│   │   └── src/
│   │       ├── components/
│   │       │   └── LeafletMap.tsx      # WebView-based Leaflet map with SVG markers
│   │       ├── data/
│   │       │   └── routes.ts          # Real Davao jeepney routes (GPS coords)
│   │       ├── i18n/
│   │       │   ├── translations.ts    # English + Bisaya string tables
│   │       │   └── LanguageContext.tsx # React Context provider + useLanguage hook
│   │       ├── navigation/
│   │       │   └── AppNavigator.tsx   # State-machine navigator
│   │       ├── screens/
│   │       │   ├── SplashScreen.tsx
│   │       │   ├── LoginScreen.tsx
│   │       │   ├── HomeScreen.tsx
│   │       │   ├── RouteDetailScreen.tsx
│   │       │   ├── PassengerTrackingScreen.tsx
│   │       │   └── SettingsScreen.tsx
│   │       └── theme/
│   │           └── index.ts           # Colors, Typography, Spacing, Shadows
│   │
│   └── passenger/                     # Passenger mobile app
│       ├── App.tsx                    # Root — wraps with LanguageProvider
│       ├── app.json
│       ├── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       ├── assets/
│       └── src/
│           ├── components/
│           │   └── LeafletMap.tsx      # WebView-based Leaflet map with SVG markers
│           ├── data/
│           │   └── routes.ts          # Same route data set
│           ├── i18n/
│           │   ├── translations.ts    # English + Bisaya string tables
│           │   └── LanguageContext.tsx # React Context provider + useLanguage hook
│           ├── navigation/
│           │   └── AppNavigator.tsx   # State-machine navigator
│           ├── screens/
│           │   ├── SplashScreen.tsx
│           │   ├── OnboardingScreen.tsx
│           │   ├── LoginScreen.tsx
│           │   ├── HomeScreen.tsx
│           │   ├── BookingScreen.tsx
│           │   ├── TrackingScreen.tsx
│           │   └── SettingsScreen.tsx
│           └── theme/
│               └── index.ts
│
├── backend/                           # Node.js API server
│   ├── package.json
│   ├── nodemon.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                   # Express + Socket.IO entry
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── sockets/
│       └── types/
│
├── packages/
│   └── shared/                        # Shared types, constants, utils
│       ├── package.json
│       └── src/
│           ├── index.ts
│           ├── constants/index.ts     # API_BASE_URL, SOCKET_EVENTS, MAP_CONFIG
│           ├── types/index.ts         # User, Location, Trip interfaces
│           └── utils/index.ts
│
├── package.json                       # Workspace root (npm workspaces)
├── tsconfig.json                      # Root TypeScript config
├── DRIVER.md                          # Driver app documentation
└── PASSENGER.md                       # Passenger app documentation
```

### Folder Roles

| Folder                   | Purpose                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `apps/driver/`           | Driver-facing app — route selection, passenger tracking, trip management |
| `apps/passenger/`        | Commuter-facing app — route discovery, booking, live jeepney tracking    |
| `apps/*/src/i18n/`       | Bilingual language system (English + Bisaya)                             |
| `apps/*/src/components/` | Reusable UI components (LeafletMap)                                      |
| `apps/*/src/data/`       | Static route data with real Davao City GPS coordinates                   |
| `apps/*/src/navigation/` | Screen navigation via state machine                                      |
| `apps/*/src/screens/`    | All app screens                                                          |
| `apps/*/src/theme/`      | Design tokens — colors, typography, spacing, shadows                     |
| `backend/`               | Express API + Socket.IO for real-time events                             |
| `packages/shared/`       | Cross-app types (`User`, `Trip`, `Location`), constants, utilities       |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (`npx expo`)
- Android Emulator or iOS Simulator (or Expo Go on a physical device)

### Install

```bash
# Clone the repo
git clone https://github.com/JNQuez27/SakayNa.git
cd SakayNa

# Install all workspace dependencies
npm install
```

### Run

```bash
# Start the passenger app
npm run passenger

# Start the driver app
npm run driver

# Start the backend server
npm run backend

# Start backend + passenger together
npm run dev
```

Or navigate into an app folder directly:

```bash
cd apps/passenger
npx expo start
```

---

## App Flows

### Driver App

```
SplashScreen --> LoginScreen --> HomeScreen --> RouteDetailScreen --> PassengerTrackingScreen
                                    |                                        |
                                    +--- SettingsScreen                      |
                                    +<-----------------<---------------------+
```

| Screen                      | Description                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| **SplashScreen**            | Animated brand intro with bus icon and tagline                                                   |
| **LoginScreen**             | Phone + password authentication                                                                  |
| **HomeScreen**              | Map view of Davao with all routes, location-sorted route list, search, map type FAB              |
| **RouteDetailScreen**       | Route stops, passenger count badges, "Start Trip" button                                         |
| **PassengerTrackingScreen** | Live trip simulation — animated jeepney along route, passenger pickup, pause/resume, finish trip |
| **SettingsScreen**          | Map toggles, notifications, dark mode, language switch (Bisaya), about section                   |

### Passenger App

```
SplashScreen --> OnboardingScreen --> LoginScreen --> HomeScreen --> BookingScreen --> TrackingScreen
                                                         |                               |
                                                         +--- SettingsScreen              |
                                                         +<--------------<----------------+
```

| Screen               | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| **SplashScreen**     | Animated brand splash                                                        |
| **OnboardingScreen** | 3-slide intro (bus, location, star) with skip/next                           |
| **LoginScreen**      | Phone authentication with guest mode                                         |
| **HomeScreen**       | Interactive map, draggable route panel, search, nearby route badges          |
| **BookingScreen**    | Route detail view — stops list, frequency, status, "Track Jeepney" button    |
| **TrackingScreen**   | Real-time jeepney simulation on map, nearest stop indicator, ETA chip        |
| **SettingsScreen**   | Map, tracking, notification preferences, language toggle, suggestions, about |

### Navigation Pattern

Both apps use a **state-machine navigator** — no React Navigation dependency. The `AppNavigator.tsx` in each app holds a `useState<Screen>` and conditionally renders the active screen component. This keeps the navigation tree flat and predictable.

```tsx
// Example from driver AppNavigator.tsx
type Screen = 'splash' | 'login' | 'home' | 'routeDetail' | 'tracking' | 'settings';
const [screen, setScreen] = useState<Screen>('splash');
```

---

## Internationalization (i18n)

Both apps support **English** and **Bisaya (Cebuano)** via a lightweight context-based system.

### Architecture

```
src/i18n/
├── translations.ts      # { en: { key: 'English' }, bs: { key: 'Bisaya' } }
└── LanguageContext.tsx   # LanguageProvider + useLanguage() hook
```

### Usage in a Screen

```tsx
import { useLanguage } from '../i18n/LanguageContext';

export default function MyScreen() {
  const { t, language, setLanguage } = useLanguage();

  return <Text>{t('home_greeting')}</Text>;
}
```

### Parameterized Strings

Use `{param}` placeholders in translation values:

```ts
// translations.ts
home_routes_count: ('{count} routes',
  // Screen
  t('home_routes_count', { count: filteredRoutes.length }));
// -> "5 routes"
```

### Switching Languages

The Settings screen in both apps has a toggle switch. When enabled, the language context switches to `'bs'` (Bisaya). The change is reactive — all `t()` calls re-render immediately.

```tsx
<Switch value={language === 'bs'} onValueChange={(v) => setLanguage(v ? 'bs' : 'en')} />
```

### Adding a New Language

1. Add the language code to the `Language` type in `translations.ts`:
   ```ts
   export type Language = 'en' | 'bs' | 'tl'; // Add Tagalog
   ```
2. Add a full translation object for the new language in the `translations` record.
3. Update the Settings toggle UI to support the new option.

### Translation Key Naming Convention

Keys follow a `screen_element` pattern:

```
home_greeting          # HomeScreen greeting text
login_phone_label      # LoginScreen phone input label
settings_language      # SettingsScreen language section
tracking_eta_near      # TrackingScreen ETA nearby text
booking_stop_label     # BookingScreen stop type label
```

---

## Iconography

All UI icons use **[Ionicons](https://ionic.io/ionicons)** via `@expo/vector-icons` (bundled with Expo). No emoji characters are used in any screen.

### Usage

```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="bus" size={24} color={Colors.primary} />
<Ionicons name="settings-outline" size={20} color={Colors.gray700} />
```

### Commonly Used Icons

| Icon Name                   | Used For             |
| --------------------------- | -------------------- |
| `bus`                       | Jeepney / vehicle    |
| `person` / `person-outline` | Passenger            |
| `location-outline`          | Stops / location     |
| `time-outline`              | Frequency / schedule |
| `search-outline`            | Search               |
| `settings-outline`          | Settings             |
| `arrow-back`                | Back navigation      |
| `navigate`                  | Nearby badge         |
| `map-outline`               | Map type             |
| `globe-outline`             | Language             |
| `notifications-outline`     | Notifications        |
| `log-out-outline`           | Logout               |

### Map Markers (LeafletMap)

Map markers inside the WebView use inline **SVG icons** (not Ionicons, since it runs in HTML context). The `makeIcon()` function maps string keys to SVG paths:

```js
// Inside LeafletMap.tsx HTML template
var ICON_SVG = {
  person: '<svg ...>...</svg>',
  bus: '<svg ...>...</svg>',
};
```

Pass the icon key via the `emoji` prop on a marker:

```tsx
const markers: MapMarker[] = [
  {
    id: 'jeepney',
    latitude: 7.07,
    longitude: 125.61,
    title: 'Jeepney 01C',
    emoji: 'bus', // Renders SVG bus icon in a colored circle
    color: '#E74C3C',
  },
];
```

---

## Theme System

Each app has its own theme file at `src/theme/index.ts` exporting `Colors`, `Typography`, `Spacing`, `BorderRadius`, and `Shadows`.

### Driver Theme (60/30/10 Rule)

| Role              | Color         | Hex       | Usage                                 |
| ----------------- | ------------- | --------- | ------------------------------------- |
| **60% Primary**   | Bright Yellow | `#FFC107` | Backgrounds, headers, primary buttons |
| **30% Secondary** | Royal Blue    | `#1A3D8F` | Accents, badges, secondary elements   |
| **10% Accent**    | Dark Charcoal | `#222222` | Text, icons, subtle borders           |

Background light: `#FFFDE7`

### Passenger Theme (60/30/10 Rule)

| Role              | Color              | Hex                   | Usage                                  |
| ----------------- | ------------------ | --------------------- | -------------------------------------- |
| **60% Primary**   | Deep Blue          | `#1B4F8A`             | Headers, primary buttons, map overlays |
| **30% Secondary** | Golden Yellow      | `#F5C518`             | Accents, highlights, badges            |
| **10% Accent**    | White / Light Blue | `#FFFFFF` / `#E8F4FD` | Backgrounds, cards                     |

Background light: `#E8F4FD`

### Usage

```tsx
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
});
```

---

## Location-Based Route Sorting

Both HomeScreens use `expo-location` to get the user's GPS position and sort routes by proximity.

### How It Works

1. On mount, `Location.requestForegroundPermissionsAsync()` is called.
2. The user's coordinates are stored in state (`userLoc`).
3. `filteredRoutes` is sorted by the **minimum distance** from the user to any stop on each route:
   ```ts
   filteredRoutes.sort((a, b) => {
     const distA = Math.min(
       ...a.stops.map((s) => Math.sqrt((s.latitude - lat) ** 2 + (s.longitude - lng) ** 2)),
     );
     const distB = Math.min(
       ...b.stops.map((s) => Math.sqrt((s.latitude - lat) ** 2 + (s.longitude - lng) ** 2)),
     );
     return distA - distB;
   });
   ```
4. Routes within ~1 km (threshold `0.01` in coordinate distance) show a **"Nearby"** badge with a navigate icon.

---

## Map Integration

The `LeafletMap` component renders an interactive map inside a `WebView` using Leaflet 1.9.4.

### Features

- Multiple **tile layers**: Default (OSM), Satellite (ArcGIS), Terrain (OpenTopoMap)
- Polyline **route rendering** with configurable color and width
- **Stop markers** with color-coded dots (green = start, red = end, route color = intermediate)
- **Jeepney marker** animation (smooth position updates via `updateMarker()`)
- **User location** pulse dot
- **Imperative API** via ref:

```tsx
const leafletRef = useRef<LeafletMapRef>(null);

// Fly to a location
leafletRef.current?.animateTo(7.07, 125.61, 16);

// Fit map to show all route coordinates
leafletRef.current?.fitBounds(route.coordinates);

// Move jeepney marker in real-time
leafletRef.current?.updateMarker('jeepney', lat, lng);

// Switch tile layer
leafletRef.current?.setMapType('satellite');
```

### Map Type Options

| Key         | Source               | Best For               |
| ----------- | -------------------- | ---------------------- |
| `default`   | OpenStreetMap        | Street-level detail    |
| `satellite` | ArcGIS World Imagery | Aerial view            |
| `terrain`   | OpenTopoMap          | Elevation / topography |

---

## Backend

Express + Socket.IO server at `backend/`. Provides REST endpoints and real-time WebSocket events.

### Structure

```
backend/src/
├── index.ts         # Server entry — Express + Socket.IO setup
├── config/          # Environment and app configuration
├── controllers/     # Request handlers
├── middleware/       # Auth, validation, error handling
├── routes/          # Express route definitions
├── services/        # Business logic
├── sockets/         # Socket.IO event handlers
└── types/           # Server-side type definitions
```

### Socket Events (defined in `packages/shared`)

| Event             | Direction        | Description                      |
| ----------------- | ---------------- | -------------------------------- |
| `trip:request`    | Client -> Server | Passenger requests a trip        |
| `trip:accepted`   | Server -> Client | Driver accepts a trip            |
| `trip:cancelled`  | Bidirectional    | Trip cancellation                |
| `driver:location` | Client -> Server | Driver sends GPS position update |
| `trip:completed`  | Server -> Client | Trip finished                    |

### Running

```bash
npm run backend
# or
cd backend && npm run dev
```

Default port: `3000` (configurable via `.env`)

---

## Shared Package

`packages/shared/` contains types and constants used by both apps and the backend.

### Types (`types/index.ts`)

```ts
interface User {
  id: string;
  name: string;
  phone: string;
  role: 'passenger' | 'driver';
}

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  pickup: Location;
  dropoff: Location;
  status: string;
  createdAt: Date;
}
```

### Constants (`constants/index.ts`)

```ts
API_BASE_URL = 'http://localhost:3000';

SOCKET_EVENTS = {
  TRIP_REQUEST: 'trip:request',
  TRIP_ACCEPTED: 'trip:accepted',
  TRIP_CANCELLED: 'trip:cancelled',
  DRIVER_LOCATION: 'driver:location',
  TRIP_COMPLETED: 'trip:completed',
};

MAP_CONFIG = {
  DEFAULT_LATITUDE: 7.1907, // Davao City center
  DEFAULT_LONGITUDE: 125.4553,
  DEFAULT_ZOOM: 13,
};
```

---

## Route Data Format

Route data lives in `apps/*/src/data/routes.ts`. Each route follows the `JeepneyRoute` interface:

```ts
interface JeepneyRoute {
  id: string;
  name: string; // "Ecoland - SM City Davao"
  code: string; // "01C"
  color: string; // "#4CAF50" (route line color on map)
  frequency: string; // "Every 5-10 min"
  description: string; // "Major route connecting..."
  stops: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
  coordinates: Array<{
    // Full polyline path
    latitude: number;
    longitude: number;
  }>;
}
```

`DAVAO_CENTER` is exported as `{ latitude: 7.0731, longitude: 125.6127 }` and used as the default map center.

---

## Recent Improvements

### Ionicons Migration

- Replaced **all emoji characters** (30+ unique) across 13+ screen files with [Ionicons](https://ionic.io/ionicons)
- Removed **corrupted Unicode characters** (U+FFFD) in 4 files
- Map markers migrated from emoji text to **inline SVG icons** in the Leaflet WebView

### Bilingual Language System

- Added **English** and **Bisaya (Cebuano)** support to both apps
- Created `i18n/translations.ts` (~160 keys per app) and `LanguageContext.tsx`
- All hardcoded text replaced with `t()` translation calls
- Language toggle switch in both Settings screens

### Location-Aware Route Discovery

- HomeScreen routes sorted by **proximity to user's GPS position**
- Routes within ~1 km display a **"Nearby"** badge with a navigate icon
- Uses `expo-location` for foreground permissions and live coordinates

### Driver Theme Redesign

- Primary color changed from blue to **Bright Yellow (#FFC107)**
- Secondary color set to **Royal Blue (#1A3D8F)**
- Strict **60/30/10 color rule** applied across all driver screens

### Navigation & UX

- **Back buttons** added to all screens that require them (consistent Ionicons `arrow-back`)
- State-machine navigation — flat, predictable, zero external navigation dependencies

---

## Business Model

SakayNa operates on a **two-sided freemium model**. Both apps are free to download with optional premium upgrades.

### Driver Tiers

| Tier        | Features                                                                              |
| ----------- | ------------------------------------------------------------------------------------- |
| **Free**    | Real-time nearby passenger view (limited stops ahead), basic route tracking           |
| **Premium** | Full passenger heatmap, high-demand area alerts, weekly route profitability analytics |
| **Add-ons** | Route history reports                                                                 |

### Passenger Tiers

| Tier        | Features                                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| **Free**    | Route selection, real-time jeepney tracking, anonymous location sharing, basic push notifications               |
| **Premium** | Ad-free experience, priority notifications (2-3 min ETA), save favorite stops/routes, predictive flow analytics |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test both apps
4. Submit a Pull Request

### Code Conventions

- **TypeScript** for all source files
- **Ionicons** for all icons — never use emoji in UI code
- **`t()` function** for all user-facing strings — never hardcode text
- **Theme tokens** (`Colors`, `Typography`, `Spacing`) — never use raw hex/numbers in styles
- Keep screens self-contained — each file handles its own styles via `StyleSheet.create()`

### File Naming

| Type          | Convention | Example           |
| ------------- | ---------- | ----------------- |
| Screens       | PascalCase | `HomeScreen.tsx`  |
| Components    | PascalCase | `LeafletMap.tsx`  |
| Data / Config | camelCase  | `routes.ts`       |
| i18n          | camelCase  | `translations.ts` |

---

For detailed app-specific documentation, see:

- [DRIVER.md](DRIVER.md) — Driver app screens and behavior
- [PASSENGER.md](PASSENGER.md) — Passenger app screens and behavior
