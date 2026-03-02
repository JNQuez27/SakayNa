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
import type { JeepneyRoute } from '../data/routes';
import LeafletMap, { LeafletMapRef, MapRoute, MapMarker } from '../components/LeafletMap';

const { width, height } = Dimensions.get('window');

interface Props {
  route: JeepneyRoute;
  onStop?: () => void;
}

export default function TrackingScreen({ route, onStop }: Props) {
  const [jeepneyIndex, setJeepneyIndex] = useState(0);
  const [nearestStop, setNearestStop] = useState(route.stops[0]?.name || '');
  const slideUp = useRef(new Animated.Value(100)).current;
  const slideOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const etaOpacity = useRef(new Animated.Value(0)).current;
  const leafletRef = useRef<LeafletMapRef>(null);

  // Simulated jeepney movement along route
  useEffect(() => {
    const interval = setInterval(() => {
      setJeepneyIndex((prev) => {
        const next = (prev + 1) % route.coordinates.length;
        const pos = route.coordinates[next];
        // Update the jeepney marker on the map
        leafletRef.current?.updateMarker('jeepney', pos.latitude, pos.longitude);
        // Find nearest stop
        let minDist = Infinity;
        let closest = route.stops[0]?.name || '';
        for (const stop of route.stops) {
          const d = Math.sqrt(
            Math.pow(stop.latitude - pos.latitude, 2) + Math.pow(stop.longitude - pos.longitude, 2),
          );
          if (d < minDist) {
            minDist = d;
            closest = stop.name;
          }
        }
        setNearestStop(closest);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [route]);

  useEffect(() => {
    // Panel slide up
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

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // ETA fade in
    setTimeout(() => {
      Animated.timing(etaOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 600);

    // Fit map to route
    setTimeout(() => {
      if (leafletRef.current && route.coordinates.length > 0) {
        leafletRef.current.fitBounds(route.coordinates);
      }
    }, 800);
  }, []);

  const jeepneyPosition = route.coordinates[jeepneyIndex] || route.coordinates[0];

  const midIdx = Math.floor(route.coordinates.length / 2);

  const mapRoutes: MapRoute[] = [
    { id: route.id, coordinates: route.coordinates, color: route.color, width: 5 },
  ];

  const mapMarkers: MapMarker[] = [
    // Stop markers
    ...route.stops.map((stop, idx) => ({
      id: `stop-${idx}`,
      latitude: stop.latitude,
      longitude: stop.longitude,
      title: stop.name,
      color:
        idx === 0 ? Colors.success : idx === route.stops.length - 1 ? Colors.error : route.color,
    })),
    // Jeepney marker (will be moved via updateMarker)
    {
      id: 'jeepney',
      latitude: route.coordinates[0].latitude,
      longitude: route.coordinates[0].longitude,
      title: `Jeepney ${route.code}`,
      emoji: '🚌',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />

      {/* Map */}
      <View style={styles.mapArea}>
        <LeafletMap
          ref={leafletRef}
          center={route.coordinates[midIdx]}
          zoom={14}
          routes={mapRoutes}
          markers={mapMarkers}
        />

        {/* ETA chip */}
        <Animated.View style={[styles.etaChip, Shadows.md, { opacity: etaOpacity }]}>
          <View style={styles.etaDot} />
          <Text style={styles.etaText}>
            Malapit sa: <Text style={styles.etaBold}>{nearestStop}</Text>
          </Text>
        </Animated.View>
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
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
        >
          {/* Status header */}
          <View style={styles.statusHeader}>
            <View style={styles.statusBadge}>
              <View style={styles.statusPulse} />
              <Text style={styles.statusText}>Live Tracking</Text>
            </View>
            <Text style={styles.statusSub}>
              Ruta {route.code}: {route.name}
            </Text>
          </View>

          {/* Jeepney info card */}
          <View style={[styles.jeepneyCard, Shadows.sm]}>
            <View style={styles.jeepneyLeft}>
              <View style={[styles.jeepneyAvatar, { backgroundColor: route.color }]}>
                <Text style={styles.jeepneyAvatarText}>🚌</Text>
              </View>
              <View>
                <Text style={styles.jeepneyName}>Jeepney {route.code}</Text>
                <Text style={styles.jeepneyRoute}>{route.name}</Text>
                <Text style={styles.jeepneyStatus}>🟢 Aktibong bumabiyahe</Text>
              </View>
            </View>
          </View>

          {/* Trip info */}
          <View style={[styles.tripInfoCard, Shadows.sm]}>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoIcon}>📍</Text>
              <Text style={styles.tripInfoLabel}>Mga Hintayan</Text>
              <Text style={styles.tripInfoValue}>{route.stops.length}</Text>
            </View>
            <View style={styles.tripInfoDivider} />
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoIcon}>🕐</Text>
              <Text style={styles.tripInfoLabel}>Dalas</Text>
              <Text style={styles.tripInfoValue}>{route.frequency}</Text>
            </View>
            <View style={styles.tripInfoDivider} />
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoIcon}>🚌</Text>
              <Text style={styles.tripInfoLabel}>Status</Text>
              <Text style={[styles.tripInfoValue, { color: Colors.success }]}>Aktibo</Text>
            </View>
          </View>

          {/* Stops progress */}
          <View style={[styles.stopsCard, Shadows.sm]}>
            <Text style={styles.stopsTitle}>Mga Hintayan sa Ruta</Text>
            {route.stops.map((stop, idx) => (
              <View key={`step-${idx}`} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepCircle,
                      nearestStop === stop.name && styles.stepCircleActive,
                      idx === 0 && {
                        borderColor: Colors.success,
                      },
                      idx === route.stops.length - 1 && {
                        borderColor: Colors.error,
                      },
                    ]}
                  >
                    {nearestStop === stop.name ? (
                      <Text style={styles.stepActiveIcon}>●</Text>
                    ) : (
                      <Text style={styles.stepIcon}>
                        {idx === 0 ? '🟢' : idx === route.stops.length - 1 ? '🔴' : '○'}
                      </Text>
                    )}
                  </View>
                  {idx < route.stops.length - 1 && (
                    <View style={[styles.stepConnector, { backgroundColor: route.color + '30' }]} />
                  )}
                </View>
                <Text
                  style={[styles.stepLabel, nearestStop === stop.name && styles.stepLabelActive]}
                >
                  {stop.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Stop tracking */}
          <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
            <Text style={styles.stopBtnText}>Itigil ang Tracking</Text>
          </TouchableOpacity>
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
  jeepneyMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  jeepneyEmoji: {
    fontSize: 20,
  },
  etaChip: {
    position: 'absolute',
    top: 52,
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
  jeepneyCard: {
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
  jeepneyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  jeepneyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jeepneyAvatarText: {
    fontSize: 24,
  },
  jeepneyName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  jeepneyRoute: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
    marginTop: 1,
  },
  jeepneyStatus: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.success,
    marginTop: 2,
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
  stopsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
  stepCircleActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  stepActiveIcon: {
    fontSize: 10,
    color: Colors.primary,
  },
  stepIcon: {
    fontSize: 10,
  },
  stepConnector: {
    width: 2,
    height: 24,
    marginVertical: 2,
  },
  stepLabel: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray400,
    paddingTop: 5,
    fontWeight: Typography.fontWeights.medium,
  },
  stepLabelActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.fontWeights.bold,
  },
  stopBtn: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.gray600,
  },
});
