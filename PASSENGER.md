# SakayNa Passenger App

This document provides details about the Passenger mobile application in the SakayNa project.

## Structure

```
apps/passenger/
├── app.json
├── App.tsx
├── index.ts
├── package.json
├── tsconfig.json
├── assets/
└── src/
    ├── navigation/
    │   └── AppNavigator.tsx
    ├── screens/
    │   ├── BookingScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── OnboardingScreen.tsx
    │   ├── SplashScreen.tsx
    │   └── TrackingScreen.tsx
    └── theme/
        └── index.ts
```

## Key Files & Folders

- **App.tsx**: Main entry point for the passenger app.
- **index.ts**: App bootstrap file.
- **assets/**: Images, fonts, and other static resources.
- **src/navigation/AppNavigator.tsx**: Navigation stack and routing.
- **src/screens/**: Individual screens for user flows:
  - `BookingScreen.tsx`: Book a ride.
  - `HomeScreen.tsx`: Main dashboard.
  - `LoginScreen.tsx`: User authentication.
  - `OnboardingScreen.tsx`: First-time user experience.
  - `SplashScreen.tsx`: Initial loading screen.
  - `TrackingScreen.tsx`: Track ride status.
- **src/theme/index.ts**: Theme and styling configuration.

## How to Run

1. Navigate to `apps/passenger`.
2. Install dependencies: `npm install`.
3. Start the app:
   - For Expo: `npx expo start`
   - For React Native CLI: `npx react-native run-android` or `npx react-native run-ios`

## Development Notes

- Uses TypeScript for type safety.
- Follows modular folder structure for scalability.
- Shared code is in `packages/shared`.

## Contribution

- Make changes in a feature branch and submit a PR.
- Follow code style and commit guidelines.

---

For backend details, see the main [README.md](README.md).
