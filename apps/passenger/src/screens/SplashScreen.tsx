import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(20)).current;
  const wave1Scale = useRef(new Animated.Value(0)).current;
  const wave2Scale = useRef(new Animated.Value(0)).current;
  const wave3Scale = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Waves ripple
      Animated.stagger(180, [
        Animated.spring(wave1Scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(wave2Scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(wave3Scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      ]),
    ]).start();

    // Logo pops in
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 300);

    // Tagline slides up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(taglineTranslate, { toValue: 0, useNativeDriver: true, tension: 70, friction: 9 }),
      ]).start();
    }, 700);

    // Exit fade
    setTimeout(() => {
      Animated.timing(exitOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        onFinish();
      });
    }, 2400);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Ripple waves */}
      <Animated.View style={[styles.wave, styles.wave3, { transform: [{ scale: wave3Scale }], opacity: wave3Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.1] }) }]} />
      <Animated.View style={[styles.wave, styles.wave2, { transform: [{ scale: wave2Scale }], opacity: wave2Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] }) }]} />
      <Animated.View style={[styles.wave, styles.wave1, { transform: [{ scale: wave1Scale }], opacity: wave1Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.28] }) }]} />

      <Animated.View style={[styles.content, { opacity: exitOpacity }]}>
        {/* Logo mark */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              {/* Tricycle icon using shapes */}
              <Text style={styles.logoIcon}>🛺</Text>
            </View>
          </View>
          <View style={styles.logoAccent} />
        </Animated.View>

        {/* Brand name */}
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }}>
          <Text style={styles.brandName}>
            Sakay<Text style={styles.brandAccent}>Na</Text>
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity, transform: [{ translateY: taglineTranslate }] }}>
          <Text style={styles.tagline}>Ang iyong maaasahang sakay</Text>
          <View style={styles.taglineDivider} />
        </Animated.View>
      </Animated.View>

      {/* Bottom pill */}
      <Animated.View style={[styles.bottomBadge, { opacity: taglineOpacity }]}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>Powered by SakayNa</Text>
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: Colors.white,
  },
  wave1: {
    width: width * 0.7,
    height: width * 0.7,
  },
  wave2: {
    width: width * 1.1,
    height: width * 1.1,
  },
  wave3: {
    width: width * 1.6,
    height: width * 1.6,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  logoOuter: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 44,
  },
  logoAccent: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  brandName: {
    fontSize: Typography.fontSizes['4xl'],
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.white,
    letterSpacing: -1,
    marginTop: Spacing.sm,
  },
  brandAccent: {
    color: Colors.secondary,
  },
  tagline: {
    fontSize: Typography.fontSizes.md,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontWeight: Typography.fontWeights.medium,
    marginTop: Spacing.xs,
  },
  taglineDivider: {
    width: 40,
    height: 3,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  bottomBadge: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  badgeText: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeights.medium,
  },
});