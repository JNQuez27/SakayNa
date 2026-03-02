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
  onBookRide?: () => void;
}

const quickDestinations = [
  { id: '1', label: 'Bahay', icon: '🏠', address: 'Blk 5 Lot 3, Matina' },
  { id: '2', label: 'Trabaho', icon: '🏢', address: 'Torres St, Davao' },
  { id: '3', label: 'SM Davao', icon: '🛍️', address: 'JP Laurel Ave' },
];

const recentTrips = [
  { id: '1', from: 'Matina', to: 'Ateneo de Davao', time: '2 oras na ang nakalipas', fare: '₱45' },
  { id: '2', from: 'SM Davao', to: 'Agdao Market', time: 'Kahapon', fare: '₱35' },
];

export default function HomeScreen({ onBookRide }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchScale = useRef(new Animated.Value(1)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(headerTranslate, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
        delay: 100,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: 100,
      }),
    ]).start();
  }, []);

  const onSearchFocus = () => {
    setSearchFocused(true);
    Animated.spring(searchScale, {
      toValue: 1.02,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const onSearchBlur = () => {
    setSearchFocused(false);
    Animated.spring(searchScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Top bar */}
      <Animated.View
        style={[
          styles.topBar,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <View>
          <Text style={styles.greeting}>Magandang umaga! 👋</Text>
          <Text style={styles.userName}>Kath Ramos</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>KR</Text>
          </View>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      {/* Map area */}
      <View style={styles.mapArea}>
        {/* Map placeholder — will be replaced with react-native-maps */}
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={styles.mapGridRow}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <View key={j} style={styles.mapGridCell} />
                ))}
              </View>
            ))}
          </View>
          {/* Mock road lines */}
          <View style={styles.roadH} />
          <View style={[styles.roadH, { top: '40%' }]} />
          <View style={[styles.roadH, { top: '70%' }]} />
          <View style={styles.roadV} />
          <View style={[styles.roadV, { left: '40%' }]} />
          <View style={[styles.roadV, { left: '70%' }]} />
          {/* Location pin */}
          <View style={styles.pinContainer}>
            <View style={styles.pinOuter}>
              <View style={styles.pinInner} />
            </View>
            <View style={styles.pinShadow} />
          </View>
          <Text style={styles.mapLabel}>📍 Ang iyong lokasyon</Text>
        </View>

        {/* Locate me button */}
        <TouchableOpacity style={[styles.locateMeBtn, Shadows.md]}>
          <Text style={styles.locateMeIcon}>◎</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomSheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.lg, paddingBottom: Spacing.xl }}
        >
          {/* Search bar */}
          <Animated.View
            style={[
              styles.searchWrapper,
              Shadows.sm,
              {
                transform: [{ scale: searchScale }],
                borderColor: searchFocused ? Colors.primary : Colors.gray200,
              },
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Saan ka pupunta?"
              placeholderTextColor={Colors.gray400}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              selectionColor={Colors.primary}
              onPressIn={onBookRide}
            />
            <TouchableOpacity style={styles.searchMic}>
              <Text>🎙️</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick destinations */}
          <View>
            <Text style={styles.sectionTitle}>Mabilis na Destinasyon</Text>
            <View style={styles.quickRow}>
              {quickDestinations.map((dest) => (
                <TouchableOpacity
                  key={dest.id}
                  style={[styles.quickCard, Shadows.sm]}
                  onPress={onBookRide}
                >
                  <View style={styles.quickIconBox}>
                    <Text style={styles.quickIcon}>{dest.icon}</Text>
                  </View>
                  <Text style={styles.quickLabel}>{dest.label}</Text>
                  <Text style={styles.quickAddress} numberOfLines={1}>
                    {dest.address}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Book ride CTA */}
          <TouchableOpacity style={[styles.bookBtn, Shadows.lg]} onPress={onBookRide}>
            <View style={styles.bookBtnLeft}>
              <View style={styles.bookBtnIconBox}>
                <Text style={styles.bookBtnIcon}>🛺</Text>
              </View>
              <View>
                <Text style={styles.bookBtnTitle}>Mag-book ng Tricycle</Text>
                <Text style={styles.bookBtnSub}>Makuha sa loob ng 3 minuto</Text>
              </View>
            </View>
            <View style={styles.bookBtnArrow}>
              <Text style={styles.bookBtnArrowText}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Recent trips */}
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nakaraang Biyahe</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Lahat</Text>
              </TouchableOpacity>
            </View>
            {recentTrips.map((trip) => (
              <TouchableOpacity key={trip.id} style={[styles.tripCard, Shadows.sm]}>
                <View style={styles.tripRoute}>
                  <View style={styles.tripDot} />
                  <View style={styles.tripLine} />
                  <View style={[styles.tripDot, { backgroundColor: Colors.secondary }]} />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripFrom}>{trip.from}</Text>
                  <Text style={styles.tripArrow}>↓</Text>
                  <Text style={styles.tripTo}>{trip.to}</Text>
                  <Text style={styles.tripTime}>{trip.time}</Text>
                </View>
                <View style={styles.tripFare}>
                  <Text style={styles.tripFareText}>{trip.fare}</Text>
                  <Text style={styles.tripRepeat}>Ulitin</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: Typography.fontWeights.medium,
  },
  userName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  avatarBtn: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitials: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  notifDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  mapArea: {
    height: height * 0.32,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#D6EAF8',
    overflow: 'hidden',
    position: 'relative',
  },
  mapGrid: {
    flex: 1,
    opacity: 0.5,
  },
  mapGridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mapGridCell: {
    flex: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(27,79,138,0.1)',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  pinContainer: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    alignItems: 'center',
  },
  pinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  pinInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  pinShadow: {
    width: 10,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 1,
  },
  mapLabel: {
    position: 'absolute',
    bottom: Spacing.sm,
    alignSelf: 'center',
    fontSize: Typography.fontSizes.xs,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium,
    width: '100%',
    textAlign: 'center',
  },
  locateMeBtn: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateMeIcon: {
    fontSize: 22,
    color: Colors.primary,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginTop: -Spacing.md,
    ...Shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray200,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    height: 52,
    gap: Spacing.sm,
  },
  searchIcon: { fontSize: 18 },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.gray700,
    fontWeight: Typography.fontWeights.medium,
  },
  searchMic: {
    padding: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 4,
  },
  quickIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickIcon: { fontSize: 18 },
  quickLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  quickAddress: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  bookBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bookBtnIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnIcon: { fontSize: 26 },
  bookBtnTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  bookBtnSub: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  bookBtnArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnArrowText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: Spacing.md,
    alignItems: 'center',
  },
  tripRoute: {
    alignItems: 'center',
    gap: 2,
  },
  tripDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  tripLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.gray200,
  },
  tripInfo: {
    flex: 1,
    gap: 2,
  },
  tripFrom: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  tripArrow: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
  },
  tripTo: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  tripTime: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  tripFare: {
    alignItems: 'flex-end',
    gap: 4,
  },
  tripFareText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.primary,
  },
  tripRepeat: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.semibold,
    backgroundColor: Colors.secondaryDark + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
});
