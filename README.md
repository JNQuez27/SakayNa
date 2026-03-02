# SakayNa Project

Our mission is to modernize Davao City’s jeepney network through real-time data connectivity empowering commuters with reliable arrival information and equipping drivers with demand insights, ensuring faster trips, safer travel, and increased daily earnings.

Features for the app

1. Startup Economics: Pricing & Revenue
SakayNa! operates on a two-sided freemium model. Both the passenger app and the driver app are free to download, with optional premium upgrades available for power users. This removes all adoption barriers while creating multiple revenue streams that grow with the user base. Revenue is also generated independently from cooperative fleet subscriptions and hyperlocal business advertising meaning the platform earns even when individual users remain on the free tier.

Included Modules

For Drivers
Free Tier (Basic)
Real-time nearby passenger view (limited stops ahead)
Basic route tracking (current road position only)
Paid Tier (Premium)
Full passenger heatmap across entire route
High-demand area alerts
Weekly route profitability analytics
Optional Add-ons
Route history reports

For Passengers
Free Tier (Core)
Select jeepney route
Real-time jeepney tracking on live map
Anonymous location sharing to driver heatmap
Basic push notifications when a jeepney is approaching
Premium Tier (Optional)
Ad-free experience
Priority notifications (jeepney 2–3 minutes away)
Save multiple favorite stops/routes
Predictive passenger flow analytics



## Workspace Structure



```
SakayNa/
├── apps/
│   ├── driver/
│   │   ├── app.json
│   │   ├── App.tsx
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── assets/
│   └── passenger/
│       ├── app.json
│       ├── App.tsx
│       ├── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       ├── assets/
│       └── src/
│           ├── navigation/
│           │   └── AppNavigator.tsx
│           ├── screens/
│           │   ├── BookingScreen.tsx
│           │   ├── HomeScreen.tsx
│           │   ├── LoginScreen.tsx
│           │   ├── OnboardingScreen.tsx
│           │   ├── SplashScreen.tsx
│           │   └── TrackingScreen.tsx
│           └── theme/
│               └── index.ts
├── backend/
│   ├── nodemon.json
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── sockets/
│       └── types/
└── packages/
    └── shared/
        ├── package.json
        └── src/
            ├── index.ts
            ├── constants/
            │   └── index.ts
            ├── types/
            │   └── index.ts
            └── utils/
                └── index.ts
```

## Folder Details

### apps/

Contains the mobile applications for both driver and passenger roles.

- **driver/**: Driver app source code and assets.
- **passenger/**: Passenger app source code, navigation, screens, and theme. See [PASSENGER.md](PASSENGER.md) for more details.

### backend/

Node.js backend server for APIs, sockets, and business logic.

- **src/**: Main backend source code, organized by feature (controllers, services, routes, etc).

### packages/

Shared code and utilities for use across apps and backend.

- **shared/**: Common types, constants, and utility functions.

## Getting Started

1. Install dependencies in each folder (`npm install`).
2. Run backend: `npm start` in backend folder.
3. Run apps: Use React Native CLI or Expo for driver/passenger apps.

## Contribution

- Fork the repo, create a feature branch, and submit a PR.
- See folder-specific README files for more details.

---

For more details on the passenger app, see [PASSENGER.md](PASSENGER.md).
