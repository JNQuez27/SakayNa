import React, { useState } from 'react';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import TrackingScreen from '../screens/TrackingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type { JeepneyRoute } from '../data/routes';

type Screen = 'splash' | 'onboarding' | 'login' | 'home' | 'booking' | 'tracking' | 'settings';

export default function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedRoute, setSelectedRoute] = useState<JeepneyRoute | null>(null);

  switch (screen) {
    case 'splash':
      return <SplashScreen onFinish={() => setScreen('onboarding')} />;
    case 'onboarding':
      return <OnboardingScreen onFinish={() => setScreen('login')} />;
    case 'login':
      return <LoginScreen onFinish={() => setScreen('home')} />;
    case 'home':
      return (
        <HomeScreen
          onSelectRoute={(route: JeepneyRoute) => {
            setSelectedRoute(route);
            setScreen('booking');
          }}
          onSettings={() => setScreen('settings')}
          onLogout={() => setScreen('login')}
        />
      );
    case 'booking':
      return (
        <BookingScreen
          route={selectedRoute!}
          onTrack={() => setScreen('tracking')}
          onBack={() => setScreen('home')}
        />
      );
    case 'tracking':
      return <TrackingScreen route={selectedRoute!} onStop={() => setScreen('home')} />;
    case 'settings':
      return <SettingsScreen onBack={() => setScreen('home')} />;
    default:
      return <SplashScreen onFinish={() => setScreen('onboarding')} />;
  }
}
