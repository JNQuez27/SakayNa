# SakayNa Project

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
