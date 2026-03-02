import React, { useRef, useEffect } from 'react';
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
import type { JeepneyRoute } from '../data/routes';
import LeafletMap, { LeafletMapRef, MapRoute, MapMarker } from '../components/LeafletMap';

const { width, height } = Dimensions.get('window');

interface Props {
  route: JeepneyRoute;
  onTrack?: () => void;
  onBack?: () => void;
}

export default function BookingScreen({ route, onTrack, onBack }: Props) {
  const slideUp = useRef(new Animated.Value(80)).current;
  const slideOpacity = useRef(new Animated.Value(0)).current;
  const confirmScale = useRef(new Animated.Value(1)).current;
  const leafletRef = useRef<LeafletMapRef>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideUp, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(slideOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Fit map to route
    setTimeout(() => {
      if (leafletRef.current && route.coordinates.length > 0) {
        leafletRef.current.fitBounds(route.coordinates);
      }
    }, 800);
  }, []);

  const pressIn = () =>
    Animated.spring(confirmScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.spring(confirmScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

  const midIdx = Math.floor(route.coordinates.length / 2);

  const mapRoutes: MapRoute[] = [
    { id: route.id, coordinates: route.coordinates, color: route.color, width: 5 },
  ];

  const mapMarkers: MapMarker[] = route.stops.map((stop, idx) => ({
    id: `stop-${idx}`,
    latitude: stop.latitude,
    longitude: stop.longitude,
    title: stop.name,
    color: idx === 0 ? Colors.success : idx === route.stops.length - 1 ? Colors.error : route.color,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Map header */}
      <View style={styles.mapArea}>
        <LeafletMap
          ref={leafletRef}
          center={route.coordinates[midIdx]}
          zoom={14}
          routes={mapRoutes}
          markers={mapMarkers}
        />

        {/* Back button */}
        <TouchableOpacity style={[styles.backBtn, Shadows.md]} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            opacity: slideOpacity,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: Spacing.lg,
            paddingBottom: Spacing.xl,
          }}
        >
          {/* Route header */}
          <View style={styles.routeHeader}>
            <View style={[styles.routeCodeBadge, { backgroundColor: route.color + '20' }]}>
              <Text style={[styles.routeCode, { color: route.color }]}>{route.code}</Text>
            </View>
            <View style={styles.routeHeaderText}>
              <Text style={styles.routeTitle}>{route.name}</Text>
              <Text style={styles.routeDesc}>{route.description}</Text>
            </View>
          </View>

          {/* Route info */}
          <View style={[styles.infoCard, Shadows.sm]}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🕐</Text>
              <Text style={styles.infoLabel}>Dalas</Text>
              <Text style={styles.infoValue}>{route.frequency}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoLabel}>Mga Hintayan</Text>
              <Text style={styles.infoValue}>{route.stops.length}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🚌</Text>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: Colors.success }]}>Aktibo</Text>
            </View>
          </View>

          {/* Stops list */}
          <View style={[styles.stopsCard, Shadows.sm]}>
            <Text style={styles.stopsTitle}>Mga Hintayan ng Ruta</Text>
            {route.stops.map((stop, idx) => (
              <View key={`stop-list-${idx}`} style={styles.stopRow}>
                <View style={styles.stopLeft}>
                  <View
                    style={[
                      styles.stopDot,
                      idx === 0 && {
                        backgroundColor: Colors.success,
                      },
                      idx === route.stops.length - 1 && {
                        backgroundColor: Colors.error,
                      },
                      idx > 0 &&
                        idx < route.stops.length - 1 && {
                          backgroundColor: route.color,
                        },
                    ]}
                  />
                  {idx < route.stops.length - 1 && (
                    <View style={[styles.stopLine, { backgroundColor: route.color + '40' }]} />
                  )}
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopType}>
                    {idx === 0
                      ? 'Simula ng Ruta'
                      : idx === route.stops.length - 1
                        ? 'Dulo ng Ruta'
                        : 'Hintayan'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Track button */}
          <Animated.View style={{ transform: [{ scale: confirmScale }] }}>
            <TouchableOpacity
              style={[styles.trackBtn, Shadows.lg]}
              onPress={onTrack}
              onPressIn={pressIn}
              onPressOut={pressOut}
              activeOpacity={1}
            >
              <View>
                <Text style={styles.trackBtnTitle}>Subaybayan ang Jeepney</Text>
                <Text style={styles.trackBtnSub}>Real-time tracking sa mapa</Text>
              </View>
              <View style={styles.trackBtnArrow}>
                <Text style={styles.trackBtnArrowText}>→</Text>
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
    height: height * 0.35,
    position: 'relative',
    backgroundColor: Colors.primary,
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
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  routeCodeBadge: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeCode: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.extrabold,
  },
  routeHeaderText: {
    flex: 1,
    gap: 2,
  },
  routeTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },
  routeDesc: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  infoIcon: { fontSize: 20 },
  infoLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    fontWeight: Typography.fontWeights.medium,
  },
  infoValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  infoDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing.xs,
  },
  stopsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  stopsTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stopLeft: {
    alignItems: 'center',
    width: 20,
  },
  stopDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stopLine: {
    width: 2,
    height: 28,
    marginVertical: 2,
  },
  stopInfo: {
    flex: 1,
    paddingBottom: Spacing.sm,
  },
  stopName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  stopType: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    marginTop: 1,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  trackBtnTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  trackBtnSub: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  trackBtnArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnArrowText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
});
