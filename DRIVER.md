# SakayNa Driver App — Jeepney Driver Tracker

> A real-time passenger tracker for jeepney drivers in **Davao City**, Philippines.

## Overview

The SakayNa Driver app is a **map-centric tracker** designed specifically for jeepney drivers operating in Davao City. Unlike traditional taxi-booking apps, this app focuses on helping drivers see where passengers are waiting along their designated jeepney routes.

### Key Concept
- **Drivers don't accept individual ride requests.** Instead, they view their jeepney route on a map and see real-time markers of passengers waiting at stops along that route.
- The app mirrors the passenger app's map experience but from the driver's perspective — showing **waiting passengers as markers** on the Davao City jeepney route network.
- Route data is sourced from [commutedavao.com](https://commutedavao.com/), covering **23 real jeepney routes** in Davao City.

---

## App Structure

```
apps/driver/
+-- app.json                    # Expo config with location permissions
+-- App.tsx                     # Root component (SafeAreaProvider wrapper)
+-- index.ts                    # Entry point
+-- package.json                # Dependencies (expo-location, react-native-webview)
+-- tsconfig.json               # TypeScript config
+-- src/
    +-- components/
    |   +-- LeafletMap.tsx       # WebView-based Leaflet.js map component
    +-- data/
    |   +-- routes.ts           # 23 Davao City jeepney routes (from commutedavao.com)
    +-- navigation/
    |   +-- AppNavigator.tsx    # Screen flow controller (useState-based)
    +-- screens/
    |   +-- HomeScreen.tsx      # Map dashboard with all routes + passenger markers
    |   +-- RouteDetailScreen.tsx    # Single route view with stops + waiting passengers
    |   +-- PassengerTrackingScreen.tsx  # Live tracking simulation along a route
    |   +-- SettingsScreen.tsx  # App settings (map, notifications, etc.)
    |   +-- LoginScreen.tsx     # Driver login (phone + password)
    |   +-- SplashScreen.tsx    # Animated splash screen
    +-- theme/
        +-- index.ts            # Colors, Typography, Spacing, BorderRadius, Shadows
```

---

## Navigation Flow

```
SplashScreen --> LoginScreen --> HomeScreen (map dashboard)
                                    |
                                    +--> RouteDetailScreen (select a route)
                                    |        |
                                    |        +--> PassengerTrackingScreen (drive the route)
                                    |                    |
                                    |                    +--> HomeScreen (trip complete)
                                    |
                                    +--> SettingsScreen
                                    +--> Logout --> LoginScreen
```

Navigation uses a simple **useState-based screen router** (no react-navigation library). The `AppNavigator` component manages screen state and passes callbacks to each screen.

---

## Screens

### 1. HomeScreen (Map Dashboard)
- **Full-screen Leaflet map** showing all 23 Davao City jeepney routes
- **Online/Offline toggle** — when Online, shows simulated waiting passengers (🧑 markers) at stops
- **Bottom sheet** (draggable) with:
  - Search bar to filter routes by name, code, or stop name
  - Route cards showing code, name, stops count, frequency, and passenger count
- **Map controls**: map type switcher (Default/Satellite/Terrain), locate-me button
- **Profile menu** (modal) with Settings and Logout options
- Tapping a route card or route on map navigates to **RouteDetailScreen**

### 2. RouteDetailScreen
- Shows a **single selected route** on the map with all stops and waiting passengers
- **Header** with route color, code, name, and passenger count badge
- **Stats row**: stops count, waiting passengers, frequency
- **Stops timeline** with indicators showing which stops have waiting passengers
- **"Simulan ang Pagbiyahe" button** to start tracking/driving the route

### 3. PassengerTrackingScreen
- **Simulates driving** along the route coordinates (animated jeepney 🚌 marker)
- **Progress bar** showing completion percentage
- **Auto-pickup**: when the jeepney passes near a waiting passenger, that passenger is "picked up" (marker removed, counter incremented)
- **Nearest stop indicator** when close to a stop
- **Controls**: Pause/Resume simulation, Finish trip button
- **Stats**: progress %, waiting passengers remaining, passengers picked up

### 4. SettingsScreen
- **Profile card** showing driver info
- **Map settings**: Show passengers toggle, show all routes, auto-zoom
- **Notifications**: Push notification toggle
- **Appearance**: Dark mode (coming soon)
- **About section**: App name, version, location (Davao City), data source
- **Suggestion card** for feedback
- **Logout button**

### 5. LoginScreen
- Phone number (+63) and password login
- Animated card with shake effect on error
- Simulated 1.5s API call
- Branding: 🚌 SakayNa — Jeepney Driver Tracker

### 6. SplashScreen
- Animated splash with 🚌 emoji
- "Jeepney Driver Tracker" tagline
- "Tracker ng Pasahero sa Davao" badge
- Auto-navigates to LoginScreen after animation

---

## Components

### LeafletMap
A **WebView-based Leaflet.js map** component that renders OpenStreetMap tiles. Identical to the passenger app's LeafletMap with an added `removeMarker` capability.

**Props:**
- `center`: `{ latitude, longitude }` — initial map center
- `zoom`: number — initial zoom level
- `routes`: `MapRoute[]` — polylines to draw on the map
- `markers`: `MapMarker[]` — point markers (stops, passengers)
- `userLocation`: user's GPS coordinates
- `onRoutePress`: callback when a route polyline is tapped

**Imperative methods** (via ref):
- `animateTo(lat, lng, zoom)` — smoothly pan/zoom
- `fitBounds(south, west, north, east)` — fit map to bounds
- `updateMarker(id, lat, lng, title, emoji)` — update/create a marker
- `setUserLocation(lat, lng)` — show blue user location dot
- `addMarker(marker)` — add a new marker
- `removeMarker(id)` — remove a marker by ID
- `setMapType(type)` — switch tile layer (default/satellite/terrain)

---

## Route Data

The app includes **23 real jeepney routes** from Davao City, sourced from [commutedavao.com](https://commutedavao.com/). Each route contains:

| Field         | Description                                     |
|---------------|-------------------------------------------------|
| `id`        | Unique route identifier (e.g., `route-01a`)   |
| `name`      | Full route name (e.g., `Toril - Davao City`)  |
| `code`      | Short code (e.g., `01A`)                       |
| `color`     | Hex color for map rendering                      |
| `frequency` | How often is the route (e.g., `Every 5-10 min`)|
| `description`| Route description                               |
| `stops[]`   | Array of stops with lat/lng and names            |
| `coordinates[]` | Full GPS waypoints for the route path        |

**Map center:** Davao City (7.0731, 125.6127)

---

## How It Connects to the Passenger App

The driver and passenger apps share:
1. **Same route data** (`routes.ts`) — same 23 Davao City jeepney routes
2. **Same LeafletMap component** pattern — WebView + Leaflet.js
3. **Same theme system** — Colors, Typography, Spacing

**The connection concept:**
- **Passenger app**: Passengers search routes, book, and track jeepneys
- **Driver app**: Drivers see which passengers are waiting at stops along their route
- In the current version, passengers are **simulated** (randomly generated at stops)
- When the backend is implemented, real passenger locations will be pushed via **Socket.IO** from the shared backend

---

## Backend Integration (Future)

The backend is **not coded yet** for the driver app. Currently all passenger data is simulated on the client side. When ready:

1. **Socket.IO events** (defined in `packages/shared/src/constants/index.ts`):
   - `DRIVER_LOCATION_UPDATE` — driver sends GPS position
   - `PASSENGER_WAITING` — passenger broadcasts they're waiting at a stop
   - `PASSENGER_PICKUP` — driver confirms passenger pickup
   - `TRIP_START` / `TRIP_END` — route tracking

2. **API endpoints** (backend in `backend/src/`):
   - Driver authentication
   - Route assignment
   - Real-time passenger locations

---

## Dependencies

| Package                      | Purpose                          |
|------------------------------|----------------------------------|
| `expo` ~55.0.4             | Expo framework                   |
| `expo-location`            | GPS location access              |
| `expo-status-bar`          | Status bar control               |
| `react-native-webview`     | Leaflet map rendering            |
| `react-native-safe-area-context` | Safe area handling         |
| `react-native-screens`     | Native screen containers         |
| `socket.io-client`         | Real-time communication (future) |

---

## Running the App

```bash
# From the monorepo root
cd apps/driver

# Install dependencies
npm install

# Start Expo dev server
npm start

# Or run on specific platform
npm run android
npm run ios
npm run web
```

---

## Language & Localization

The app uses **Filipino (Tagalog)** for user-facing text, matching the passenger app:
- "Magandang araw, Drayber!" — greeting
- "Naghihintay" — waiting
- "Pasahero" — passenger
- "Hintayan" — stop/waiting area
- "Simulan ang Pagbiyahe" — Start the trip
- "Bumibiyahe" — Traveling/Driving
- "Tapusin" — Finish

---

## Design Philosophy

1. **Map-first**: The home screen IS the map — not a dashboard with stats
2. **Route-centric**: Jeepneys follow fixed routes, not on-demand destinations
3. **Passenger visibility**: Drivers see where passengers are waiting to optimize their route
4. **Davao City focused**: All routes, stops, and coordinates are real Davao City data
5. **No taxi paradigm**: No ride requests, no surge pricing, no individual bookings — this is public transport
