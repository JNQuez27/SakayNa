import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const slides = [
  {
    id: '1',
    icon: '🛺',
    title: 'Book a Ride\nAnytime',
    subtitle: 'Hanapin ang pinakamalapit na\ntricycle sa iyong lokasyon.',
    accent: Colors.secondary,
    bg: Colors.backgroundLight,
    iconBg: Colors.primary,
  },
  {
    id: '2',
    icon: '📍',
    title: 'Real-Time\nTracking',
    subtitle: 'Subaybayan ang iyong driver\nsa mapa nang live.',
    accent: Colors.primaryLight,
    bg: '#EBF5FB',
    iconBg: Colors.secondary,
  },
  {
    id: '3',
    icon: '⭐',
    title: 'Safe &\nAffordable',
    subtitle: 'Ang ligtas at abot-kayang\nsakay para sa lahat.',
    accent: Colors.primary,
    bg: Colors.backgroundLight,
    iconBg: Colors.primaryDark,
  },
];

export default function OnboardingScreen({ onFinish }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setActiveIndex(next);
    } else {
      onFinish();
    }
  };

  const pressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={onFinish}>
        <Text style={styles.skipText}>Preskip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.slide, { backgroundColor: slide.bg }]}>
            {/* Decorative circles */}
            <View style={[styles.decorCircleLarge, { backgroundColor: slide.accent + '15' }]} />
            <View style={[styles.decorCircleSmall, { backgroundColor: slide.accent + '20' }]} />

            {/* Icon card */}
            <View style={styles.iconWrapper}>
              <View style={[styles.iconCardOuter, Shadows.lg]}>
                <View style={[styles.iconCardInner, { backgroundColor: slide.iconBg }]}>
                  <Text style={styles.slideIcon}>{slide.icon}</Text>
                </View>
              </View>
              {/* Floating badge */}
              <View style={[styles.floatingBadge, { backgroundColor: slide.accent }]}>
                <Text style={styles.floatingBadgeText}>{index + 1}/3</Text>
              </View>
            </View>

            {/* Text */}
            <View style={styles.textBlock}>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
              <View style={[styles.accentLine, { backgroundColor: slide.accent }]} />
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity: dotOpacity, backgroundColor: Colors.primary },
                ]}
              />
            );
          })}
        </View>

        {/* CTA Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleNext}
            onPressIn={pressIn}
            onPressOut={pressOut}
            activeOpacity={1}
          >
            <Text style={styles.ctaText}>
              {activeIndex < slides.length - 1 ? 'Susunod →' : 'Magsimula'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Login link */}
        <TouchableOpacity onPress={onFinish} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>
            May account na? <Text style={styles.loginLinkBold}>Mag-login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: Spacing.lg,
    zIndex: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(27,79,138,0.08)',
    borderRadius: BorderRadius.full,
  },
  skipText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
    fontWeight: Typography.fontWeights.medium,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    overflow: 'hidden',
  },
  decorCircleLarge: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width * 0.55,
    top: -width * 0.4,
    alignSelf: 'center',
  },
  decorCircleSmall: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 80,
    right: -60,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: Spacing['2xl'],
  },
  iconCardOuter: {
    width: 160,
    height: 160,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCardInner: {
    width: 128,
    height: 128,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideIcon: {
    fontSize: 64,
  },
  floatingBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  floatingBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  slideTitle: {
    fontSize: Typography.fontSizes['3xl'],
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.primaryDark,
    textAlign: 'center',
    lineHeight: Typography.fontSizes['3xl'] * 1.2,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: Typography.fontSizes.md * 1.6,
    marginTop: Spacing.xs,
  },
  accentLine: {
    width: 48,
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.md,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    paddingTop: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    width: width - Spacing.xl * 2,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  ctaText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  loginLink: {
    paddingVertical: Spacing.xs,
  },
  loginLinkText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
  },
  loginLinkBold: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
});
