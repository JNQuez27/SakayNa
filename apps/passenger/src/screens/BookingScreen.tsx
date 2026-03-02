import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onConfirm?: () => void;
  onBack?: () => void;
}

const rideTypes = [
  {
    id: 'regular',
    name: 'Regular',
    icon: '🛺',
    desc: '1–3 pasahero',
    eta: '3 min',
    fare: '₱35–₱50',
    recommended: false,
  },
  {
    id: 'padyak',
    name: 'Padyak',
    icon: '🚲',
    desc: '1 pasahero',
    eta: '5 min',
    fare: '₱20–₱30',
    recommended: false,
  },
  {
    id: 'express',
    name: 'Express',
    icon: '⚡',
    desc: '1–2 pasahero',
    eta: '2 min',
    fare: '₱55–₱75',
    recommended: true,
  },
];

export default function BookingScreen({ onConfirm, onBack }: Props) {
  const [selectedRide, setSelectedRide] = useState('express');
  const [pickup, setPickup] = useState('Ang iyong kasalukuyang lokasyon');
  const [dropoff, setDropoff] = useState('');
  const slideUp = useRef(new Animated.Value(80)).current;
  const slideOpacity = useRef(new Animated.Value(0)).current;
  const confirmScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(slideOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const pressIn = () =>
    Animated.spring(confirmScale, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(confirmScale, { toValue: 1, useNativeDriver: true }).start();

  const selected = rideTypes.find((r) => r.id === selectedRide)!;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Map header */}
      <View style={styles.mapArea}>
        <View style={styles.mapBg}>
          <View style={styles.mapOverlay} />
          <View style={[styles.roadH, { top: '30%' }]} />
          <View style={[styles.roadH, { top: '60%' }]} />
          <View style={[styles.roadV, { left: '30%' }]} />
          <View style={[styles.roadV, { left: '65%' }]} />

          {/* Route line simulation */}
          <View style={styles.routeLine} />

          {/* Origin pin */}
          <View style={[styles.pin, styles.originPin]}>
            <View style={styles.originDot} />
          </View>

          {/* Destination pin */}
          {dropoff ? (
            <View style={[styles.pin, styles.destPin]}>
              <View style={styles.destDot} />
              <View style={styles.destPinTail} />
            </View>
          ) : null}
        </View>

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom panel */}
      <Animated.View
        style={[styles.panel, { opacity: slideOpacity, transform: [{ translateY: slideUp }] }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.lg, paddingBottom: Spacing.xl }}
        >
          {/* Location inputs */}
          <View style={[styles.locationCard, Shadows.sm]}>
            <View style={styles.locationRow}>
              <View style={styles.locDotGreen} />
              <TextInput
                style={styles.locationInput}
                value={pickup}
                onChangeText={setPickup}
                placeholder="Pickup location"
                placeholderTextColor={Colors.gray400}
                selectionColor={Colors.primary}
              />
            </View>
            <View style={styles.locationDivider}>
              <View style={styles.locationLine} />
            </View>
            <View style={styles.locationRow}>
              <View style={styles.locDotRed} />
              <TextInput
                style={[styles.locationInput, !dropoff && styles.locationInputEmpty]}
                value={dropoff}
                onChangeText={setDropoff}
                placeholder="Saan ka pupunta?"
                placeholderTextColor={Colors.gray400}
                selectionColor={Colors.primary}
                autoFocus
              />
              {dropoff ? (
                <TouchableOpacity onPress={() => setDropoff('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Ride type selector */}
          <View>
            <Text style={styles.sectionLabel}>Piliin ang Sasakyan</Text>
            <View style={styles.rideRow}>
              {rideTypes.map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  style={[
                    styles.rideCard,
                    selectedRide === ride.id && styles.rideCardSelected,
                    Shadows.sm,
                  ]}
                  onPress={() => setSelectedRide(ride.id)}
                >
                  {ride.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Best</Text>
                    </View>
                  )}
                  <Text style={styles.rideIcon}>{ride.icon}</Text>
                  <Text
                    style={[styles.rideName, selectedRide === ride.id && styles.rideNameSelected]}
                  >
                    {ride.name}
                  </Text>
                  <Text style={styles.rideDesc}>{ride.desc}</Text>
                  <View style={styles.rideEtaBadge}>
                    <Text style={styles.rideEta}>{ride.eta}</Text>
                  </View>
                  <Text
                    style={[styles.rideFare, selectedRide === ride.id && styles.rideFareSelected]}
                  >
                    {ride.fare}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fare breakdown */}
          <View style={[styles.fareCard, Shadows.sm]}>
            <Text style={styles.sectionLabel}>Detalye ng Bayad</Text>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base fare</Text>
              <Text style={styles.fareValue}>₱25.00</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Distansya (2.3 km)</Text>
              <Text style={styles.fareValue}>₱18.40</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Convenience fee</Text>
              <Text style={styles.fareValue}>₱5.00</Text>
            </View>
            <View style={[styles.fareRow, styles.fareTotalRow]}>
              <Text style={styles.fareTotalLabel}>Kabuuan</Text>
              <Text style={styles.fareTotalValue}>₱48.40</Text>
            </View>
          </View>

          {/* Payment method */}
          <TouchableOpacity style={[styles.paymentRow, Shadows.sm]}>
            <Text style={styles.paymentIcon}>💵</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>Cash</Text>
              <Text style={styles.paymentSub}>Bayad sa driver</Text>
            </View>
            <Text style={styles.paymentChevron}>›</Text>
          </TouchableOpacity>

          {/* Confirm button */}
          <Animated.View style={{ transform: [{ scale: confirmScale }] }}>
            <TouchableOpacity
              style={[styles.confirmBtn, !dropoff && styles.confirmBtnDisabled, Shadows.lg]}
              onPress={dropoff ? onConfirm : undefined}
              onPressIn={pressIn}
              onPressOut={pressOut}
              activeOpacity={1}
            >
              <View>
                <Text style={styles.confirmBtnTitle}>Kumpirmahin ang Booking</Text>
                <Text style={styles.confirmBtnSub}>
                  ETA: {selected.eta} • {selected.fare}
                </Text>
              </View>
              <View style={styles.confirmArrow}>
                <Text style={styles.confirmArrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
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
    height: height * 0.28,
    position: 'relative',
    backgroundColor: Colors.primary,
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#D6EAF8',
    overflow: 'hidden',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232,244,253,0.6)',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  routeLine: {
    position: 'absolute',
    top: '28%',
    left: '28%',
    width: 130,
    height: 3,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '15deg' }],
    borderRadius: 2,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  originPin: {
    top: '22%',
    left: '26%',
  },
  destPin: {
    top: '30%',
    left: '62%',
  },
  originDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  destDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  destPinTail: {
    width: 2,
    height: 8,
    backgroundColor: Colors.error,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  backIcon: {
    fontSize: Typography.fontSizes.xl,
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
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  locDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  locDotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInput: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.gray700,
    fontWeight: Typography.fontWeights.medium,
    paddingVertical: 4,
  },
  locationInputEmpty: {
    color: Colors.gray400,
  },
  locationDivider: {
    paddingLeft: 5,
    paddingVertical: 2,
  },
  locationLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.gray200,
    borderStyle: 'dashed',
    marginLeft: 1,
  },
  clearIcon: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray400,
    padding: Spacing.xs,
  },
  sectionLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  rideRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rideCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray200,
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  rideCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.overlayLight,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
  },
  rideIcon: {
    fontSize: 28,
    marginTop: 8,
  },
  rideName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray600,
  },
  rideNameSelected: {
    color: Colors.primary,
  },
  rideDesc: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
  },
  rideEtaBadge: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  rideEta: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray500,
    fontWeight: Typography.fontWeights.medium,
  },
  rideFare: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray600,
    marginTop: 2,
  },
  rideFareSelected: {
    color: Colors.primary,
  },
  fareCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: Spacing.sm,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
  },
  fareValue: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray700,
    fontWeight: Typography.fontWeights.medium,
  },
  fareTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  fareTotalLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  fareTotalValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: Spacing.sm,
  },
  paymentIcon: { fontSize: 24 },
  paymentInfo: { flex: 1 },
  paymentLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  paymentSub: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
  },
  paymentChevron: {
    fontSize: Typography.fontSizes.xl,
    color: Colors.gray400,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.gray300,
  },
  confirmBtnTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  confirmBtnSub: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  confirmArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmArrowText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
});
