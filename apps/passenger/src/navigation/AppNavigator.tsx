import React, { useState } from 'react';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import TrackingScreen from '../screens/TrackingScreen';

type Screen = 'splash' | 'onboarding' | 'login' | 'home' | 'booking' | 'tracking';

export default function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('splash');

  switch (screen) {
    case 'splash':
      return <SplashScreen onFinish={() => setScreen('onboarding')} />;
    case 'onboarding':
      return <OnboardingScreen onFinish={() => setScreen('login')} />;
    case 'login':
      return <LoginScreen onFinish={() => setScreen('home')} />;
    case 'home':
      return <HomeScreen onBookRide={() => setScreen('booking')} />;
    case 'booking':
      return (
        <BookingScreen
          onConfirm={() => setScreen('tracking')}
          onBack={() => setScreen('home')}
        />
      );
    case 'tracking':
      return (
        <TrackingScreen
          onCancel={() => setScreen('home')}
          onComplete={() => setScreen('home')}
        />
      );
    default:
      return <SplashScreen onFinish={() => setScreen('onboarding')} />;
  }
}
