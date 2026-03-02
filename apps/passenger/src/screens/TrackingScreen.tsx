import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onCancel?: () => void;
  onComplete?: () => void;
}

const statuses = [
  { id: 'searching', label: 'Naghahanap ng driver', icon: '🔍', done: true },
  { id: 'accepted', label: 'Driver ay papunta na', icon: '🛺', done: true },
  { id: 'arrived', label: 'Driver ay dumating na', icon: '📍', done: false },
  { id: 'ongoing', label: 'Nasa biyahe', icon: '🚀', done: false },
  { id: 'done', label: 'Naabot na ang destinasyon', icon: '✅', done: false },
];

export default function TrackingScreen({ onCancel, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const slideUp = useRef(new Animated.Value(100)).current;
  const slideOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const driverRotate = useRef(new Animated.Value(0)).current;
  const etaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Panel slide up
    Animated.parallel([
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(slideOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();

    // Pulse animation for driver pin
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ).start();

    // Driver icon wobble
    Animated.loop(
      Animated.sequence([
        Animated.timing(driverRotate, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(driverRotate, { toValue: -1, duration: 300, useNativeDriver: true }),
        Animated.timing(driverRotate, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ).start();

    // ETA fade in
    setTimeout(() => {
      Animated.timing(etaOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 600);
  }, []);

  const rotateInterp = driverRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />

      {/* Map */}
      <View style={styles.mapArea}>
        <View style={styles.mapBg}>
          {/* Road grid */}
          <View style={[styles.roadH, { top: '25%' }]} />
          <View style={[styles.roadH, { top: '55%' }]} />
          <View style={[styles.roadH, { top: '80%' }]} />
          <View style={[styles.roadV, { left: '20%' }]} />
          <View style={[styles.roadV, { left: '55%' }]} />
          <View style={[styles.roadV, { left: '80%' }]} />

          {/* Route */}
          <View style={styles.routeDot1} />
          <View style={styles.routeDot2} />
          <View style={styles.routeDot3} />
          <View style={styles.routeLine} />

          {/* Driver pulse */}
          <View style={styles.driverContainer}>
            <Animated.View style={[styles.driverPulse, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[styles.driverBubble, { transform: [{ rotate: rotateInterp }] }]}>
              <Text style={styles.driverEmoji}>🛺</Text>
            </Animated.View>
          </View>

          {/* Destination */}
          <View style={styles.destContainer}>
            <View style={styles.destPin}>
              <Text style={styles.destPinIcon}>📍</Text>
            </View>
          </View>
        </View>

        {/* ETA chip */}
        <Animated.View style={[styles.etaChip, Shadows.md, { opacity: etaOpacity }]}>
          <View style={styles.etaDot} />
          <Text style={styles.etaText}>
            ETA: <Text style={styles.etaBold}>3 minuto</Text>
          </Text>
        </Animated.View>
      </View>

      {/* Bottom panel */}
      <Animated.View
        style={[styles.panel, { opacity: slideOpacity, transform: [{ translateY: slideUp }] }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
        >
          {/* Status header */}
          <View style={styles.statusHeader}>
            <View style={styles.statusBadge}>
              <View style={styles.statusPulse} />
              <Text style={styles.statusText}>Papunta na ang iyong driver</Text>
            </View>
            <Text style={styles.statusSub}>Handa sa pickup point mo</Text>
          </View>

          {/* Driver card */}
          <View style={[styles.driverCard, Shadows.sm]}>
            <View style={styles.driverLeft}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>RP</Text>
                <View style={styles.onlineDot} />
              </View>
              <View>
                <Text style={styles.driverName}>Rolando P.</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.ratingText}>4.9</Text>
                  <Text style={styles.tripCount}>• 342 biyahe</Text>
                </View>
                <Text style={styles.vehicleInfo}>🛺 ABC-1234 • Itim/Dilaw</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Status steps */}
          <View style={[styles.stepsCard, Shadows.sm]}>
            <Text style={styles.stepsTitle}>Status ng Biyahe</Text>
            {statuses.map((step, idx) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepCircle,
                      idx < currentStep && styles.stepCircleDone,
                      idx === currentStep && styles.stepCircleActive,
                    ]}
                  >
                    {idx < currentStep ? (
                      <Text style={styles.stepCheckmark}>✓</Text>
                    ) : (
                      <Text style={styles.stepIcon}>{step.icon}</Text>
                    )}
                  </View>
                  {idx < statuses.length - 1 && (
                    <View
                      style={[styles.stepConnector, idx < currentStep && styles.stepConnectorDone]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    idx < currentStep && styles.stepLabelDone,
                    idx === currentStep && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Trip info row */}
          <View style={[styles.tripInfoCard, Shadows.sm]}>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoIcon}>📏</Text>
              <Text style={styles.tripInfoLabel}>Distansya</Text>
              <Text style={styles.tripInfoValue}>2.3 km</Text>
            </View>
            <View style={styles.tripInfoDivider} />
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoIcon}>⏱️</Text>
              <Text style={styles.tripInfoLabel}>Oras</Text>
              <Text style={styles.tripInfoValue}>~8 min</Text>
            </View>
            <View style={styles.tripInfoDivider} />
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoIcon}>💵</Text>
              <Text style={styles.tripInfoLabel}>Bayad</Text>
              <Text style={styles.tripInfoValue}>₱48.40</Text>
            </View>
          </View>

          {/* Cancel */}
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>I-cancel ang Biyahe</Text>
          </TouchableOpacity>

          <Text style={styles.cancelNote}>
            Maaaring may bayad kung magkansela pagkatapos na matanggap ng driver.
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  mapArea: {
    height: height * 0.42,
    position: 'relative',
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#D6EAF8',
    overflow: 'hidden',
    position: 'relative',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  routeLine: {
    position: 'absolute',
    top: '23%',
    left: '18%',
    width: 180,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '8deg' }],
    opacity: 0.7,
  },
  routeDot1: {
    position: 'absolute',
    top: '21%',
    left: '17%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  routeDot2: {
    position: 'absolute',
    top: '24%',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  routeDot3: {
    position: 'absolute',
    top: '26%',
    left: '75%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  driverContainer: {
    position: 'absolute',
    top: '17%',
    left: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(27,79,138,0.2)',
  },
  driverBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  driverEmoji: {
    fontSize: 22,
  },
  destContainer: {
    position: 'absolute',
    top: '24%',
    left: '74%',
    alignItems: 'center',
  },
  destPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.error,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  destPinIcon: {
    fontSize: 18,
  },
  etaChip: {
    position: 'absolute',
    top: Spacing.lg,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  etaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  etaText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray600,
    fontWeight: Typography.fontWeights.medium,
  },
  etaBold: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  panel: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    ...Shadows.lg,
  },
  statusHeader: {
    marginBottom: Spacing.md,
    gap: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },
  statusSub: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
    paddingLeft: Spacing.lg,
  },
  driverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  driverAvatarText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  driverName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  starIcon: { fontSize: 13 },
  ratingText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray700,
  },
  tripCount: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
  },
  vehicleInfo: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray500,
    marginTop: 3,
  },
  driverActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  actionIcon: { fontSize: 20 },
  stepsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  stepsTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepLeft: {
    alignItems: 'center',
    width: 28,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray100,
    borderWidth: 2,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  stepCheckmark: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  stepIcon: {
    fontSize: 13,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: Colors.gray200,
    marginVertical: 2,
  },
  stepConnectorDone: {
    backgroundColor: Colors.primary,
  },
  stepLabel: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray400,
    paddingTop: 5,
    fontWeight: Typography.fontWeights.medium,
  },
  stepLabelDone: {
    color: Colors.gray500,
    textDecorationLine: 'line-through',
  },
  stepLabelActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.fontWeights.bold,
  },
  tripInfoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  tripInfoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tripInfoIcon: { fontSize: 20 },
  tripInfoLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    fontWeight: Typography.fontWeights.medium,
  },
  tripInfoValue: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  tripInfoDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing.xs,
  },
  cancelBtn: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cancelText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.error,
  },
  cancelNote: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: 16,
  },
});
