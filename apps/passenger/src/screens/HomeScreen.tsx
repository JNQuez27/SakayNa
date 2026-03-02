import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  PanResponder,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { JEEPNEY_ROUTES, DAVAO_CENTER } from '../data/routes';
import type { JeepneyRoute } from '../data/routes';
import LeafletMap, { LeafletMapRef, MapRoute, MapMarker } from '../components/LeafletMap';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 90;
const SHEET_MIN = 80;
const SHEET_MID = height * 0.45;
const SHEET_MAX = height - HEADER_HEIGHT - 30;

type MapType = 'default' | 'satellite' | 'terrain';

const MAP_TYPE_OPTIONS: { key: MapType; label: string; icon: string }[] = [
  { key: 'default', label: 'Default', icon: '🗺️' },
  { key: 'satellite', label: 'Satellite', icon: '🛰️' },
  { key: 'terrain', label: 'Terrain', icon: '⛰️' },
];

export default function HomeScreen({
  onSelectRoute,
  onSettings,
  onLogout,
}: {
  onSelectRoute?: (route: JeepneyRoute) => void;
  onSettings?: () => void;
  onLogout?: () => void;
}) {
  const [searchText, setSearchText] = useState('');
  const [locationReady, setLocationReady] = useState(false);
  const [userLoc, setUserLoc] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMapTypeMenu, setShowMapTypeMenu] = useState(false);
  const [mapType, setMapType] = useState<MapType>('default');
  const mapRef = useRef<LeafletMapRef>(null);

  // ---------- bottom-sheet animation ----------
  const sheetHeight = useRef(new Animated.Value(SHEET_MID)).current;
  const lastSnap = useRef(SHEET_MID);
  const currentHeight = useRef(SHEET_MID);

  // Keep currentHeight in sync
  useEffect(() => {
    const id = sheetHeight.addListener(({ value }) => {
      currentHeight.current = value;
    });
    return () => sheetHeight.removeListener(id);
  }, []);

  const snapTo = useCallback(
    (to: number) => {
      lastSnap.current = to;
      Animated.spring(sheetHeight, {
        toValue: to,
        useNativeDriver: false,
        tension: 80,
        friction: 12,
      }).start();
    },
    [sheetHeight],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        // freeze current value
      },
      onPanResponderMove: (_, g) => {
        const next = lastSnap.current - g.dy; // drag down = negative dy → smaller sheet
        const clamped = Math.max(SHEET_MIN, Math.min(SHEET_MAX, next));
        sheetHeight.setValue(clamped);
      },
      onPanResponderRelease: (_, g) => {
        const cur = currentHeight.current;
        const vel = g.vy; // positive = downward flick

        // Flick detection
        if (vel > 0.5) {
          // flick down
          if (cur < (SHEET_MIN + SHEET_MID) / 2) snapTo(SHEET_MIN);
          else snapTo(SHEET_MID);
          return;
        }
        if (vel < -0.5) {
          // flick up
          if (cur > (SHEET_MID + SHEET_MAX) / 2) snapTo(SHEET_MAX);
          else snapTo(SHEET_MID);
          return;
        }

        // snap to closest
        const dMin = Math.abs(cur - SHEET_MIN);
        const dMid = Math.abs(cur - SHEET_MID);
        const dMax = Math.abs(cur - SHEET_MAX);
        if (dMin <= dMid && dMin <= dMax) snapTo(SHEET_MIN);
        else if (dMax <= dMid) snapTo(SHEET_MAX);
        else snapTo(SHEET_MID);
      },
    }),
  ).current;

  // ---------- header animation ----------
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      delay: 100,
    }).start();
  }, []);

  // ---------- location ----------
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setUserLoc(coords);
          setTimeout(() => {
            mapRef.current?.setUserLocation(coords.latitude, coords.longitude);
            mapRef.current?.animateTo(coords.latitude, coords.longitude, 16);
          }, 500);
          setLocationReady(true);
          // collapse sheet so map is fullscreen
          snapTo(SHEET_MIN);
        } catch {
          setLocationReady(false);
        }
      }
    })();
  }, [snapTo]);

  const handleLocateMe = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setUserLoc(coords);
      mapRef.current?.setUserLocation(coords.latitude, coords.longitude);
      mapRef.current?.animateTo(coords.latitude, coords.longitude, 16);
      setLocationReady(true);
      snapTo(SHEET_MIN);
    }
  };

  const handleMapTypeChange = (type: MapType) => {
    setMapType(type);
    mapRef.current?.setMapType(type);
    setShowMapTypeMenu(false);
  };

  // ---------- filtered routes ----------
  const filteredRoutes = JEEPNEY_ROUTES.filter(
    (r) =>
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.code.toLowerCase().includes(searchText.toLowerCase()) ||
      r.stops.some((s) => s.name.toLowerCase().includes(searchText.toLowerCase())),
  );

  // ---------- map data ----------
  const mapRoutes: MapRoute[] = JEEPNEY_ROUTES.map((r) => ({
    id: r.id,
    coordinates: r.coordinates,
    color: r.color,
  }));

  const mapMarkers: MapMarker[] = JEEPNEY_ROUTES.flatMap((r) =>
    r.stops.map((s, i) => ({
      id: `${r.id}-stop-${i}`,
      latitude: s.latitude,
      longitude: s.longitude,
      title: s.name,
      color: r.color,
    })),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* -------- Fixed header -------- */}
      <Animated.View style={[styles.topBar, { opacity: headerOpacity }]}>
        <View>
          <Text style={styles.greeting}>Magandang araw! 👋</Text>
          <Text style={styles.userName}>Pasahero</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => setShowProfileMenu(true)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>SN</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* -------- Profile Menu Modal -------- */}
      <Modal
        visible={showProfileMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowProfileMenu(false)}>
          <View style={[styles.profileMenu, Shadows.lg]}>
            <View style={styles.profileMenuHeader}>
              <View style={styles.profileMenuAvatar}>
                <Text style={styles.profileMenuInitials}>SN</Text>
              </View>
              <View>
                <Text style={styles.profileMenuName}>SakayNa User</Text>
                <Text style={styles.profileMenuSub}>Pasahero</Text>
              </View>
            </View>
            <View style={styles.profileMenuDivider} />
            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={() => {
                setShowProfileMenu(false);
                onSettings?.();
              }}
            >
              <Text style={styles.profileMenuIcon}>⚙️</Text>
              <Text style={styles.profileMenuLabel}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={() => {
                setShowProfileMenu(false);
                onLogout?.();
              }}
            >
              <Text style={styles.profileMenuIcon}>🚪</Text>
              <Text style={styles.profileMenuLabel}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* -------- Map fills remaining space above sheet -------- */}
      <View style={styles.mapContainer}>
        <LeafletMap
          ref={mapRef}
          center={DAVAO_CENTER}
          zoom={13}
          routes={mapRoutes}
          markers={mapMarkers}
          userLocation={userLoc}
          onRoutePress={(routeId) => {
            const r = JEEPNEY_ROUTES.find((rt) => rt.id === routeId);
            if (r) onSelectRoute?.(r);
          }}
        />

        {/* Map type toggle FAB */}
        <TouchableOpacity
          style={[styles.mapTypeFab, Shadows.md]}
          onPress={() => setShowMapTypeMenu(!showMapTypeMenu)}
          activeOpacity={0.8}
        >
          <Text style={styles.mapTypeFabIcon}>
            {MAP_TYPE_OPTIONS.find((o) => o.key === mapType)?.icon || '🗺️'}
          </Text>
        </TouchableOpacity>

        {/* Map type dropdown */}
        {showMapTypeMenu && (
          <View style={[styles.mapTypeDropdown, Shadows.lg]}>
            <Text style={styles.mapTypeTitle}>Map Type</Text>
            {MAP_TYPE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.mapTypeOption, mapType === opt.key && styles.mapTypeOptionActive]}
                onPress={() => handleMapTypeChange(opt.key)}
              >
                <Text style={styles.mapTypeOptionIcon}>{opt.icon}</Text>
                <Text
                  style={[
                    styles.mapTypeOptionLabel,
                    mapType === opt.key && styles.mapTypeOptionLabelActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Locate-me FAB */}
        <TouchableOpacity
          style={[styles.locateMeBtn, Shadows.md]}
          onPress={handleLocateMe}
          activeOpacity={0.8}
        >
          <Text style={styles.locateMeIcon}>{locationReady ? '📍' : '◎'}</Text>
        </TouchableOpacity>
      </View>

      {/* -------- Draggable bottom sheet -------- */}
      <Animated.View style={[styles.sheet, { height: sheetHeight }]}>
        {/* Drag handle area */}
        <View {...panResponder.panHandlers} style={styles.handleZone}>
          <View style={styles.handle} />
          <Text style={styles.handleHint}>
            {locationReady ? 'I-swipe pataas para sa mga ruta' : 'Mga Ruta ng Jeepney'}
          </Text>
        </View>

        {/* Scrollable route list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.sheetContent}
        >
          {/* Search */}
          <View
            style={[
              styles.searchWrapper,
              Shadows.sm,
              searchText ? { borderColor: Colors.primary } : null,
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Hanapin ang ruta o hintayan..."
              placeholderTextColor={Colors.gray400}
              selectionColor={Colors.primary}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Route cards */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mga Ruta ng Jeepney</Text>
            <Text style={styles.sectionCount}>{filteredRoutes.length} ruta</Text>
          </View>
          {filteredRoutes.map((route) => {
            const firstStop = route.stops[0]?.name || '';
            const lastStop = route.stops[route.stops.length - 1]?.name || '';
            return (
              <TouchableOpacity
                key={route.id}
                style={[styles.routeCard, Shadows.sm]}
                activeOpacity={0.7}
                onPress={() => onSelectRoute?.(route)}
              >
                <View style={[styles.routeColorBar, { backgroundColor: route.color }]} />
                <View style={styles.routeInfo}>
                  <View style={styles.routeHeaderRow}>
                    <View style={[styles.routeCodeBadge, { backgroundColor: route.color + '20' }]}>
                      <Text style={[styles.routeCode, { color: route.color }]}>{route.code}</Text>
                    </View>
                    <Text style={styles.routeName} numberOfLines={1}>
                      {route.name}
                    </Text>
                  </View>
                  <Text style={styles.routeDesc} numberOfLines={1}>
                    {route.description}
                  </Text>
                  <View style={styles.routeEndpoints}>
                    <View style={styles.endpointRow}>
                      <View style={[styles.endpointDot, { backgroundColor: Colors.success }]} />
                      <Text style={styles.endpointText} numberOfLines={1}>
                        {firstStop}
                      </Text>
                    </View>
                    <Text style={styles.endpointArrow}>|</Text>
                    <View style={styles.endpointRow}>
                      <View style={[styles.endpointDot, { backgroundColor: Colors.error }]} />
                      <Text style={styles.endpointText} numberOfLines={1}>
                        {lastStop}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.routeMeta}>
                    <Text style={styles.routeFreq}>🕐 {route.frequency}</Text>
                    <Text style={styles.routeStops}>📍 {route.stops.length} hintayan</Text>
                  </View>
                </View>
                <View style={styles.routeChevronBox}>
                  <View style={styles.chevron} />
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredRoutes.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🔎</Text>
              <Text style={styles.emptyText}>Walang nahanap na ruta</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/* ================================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  /* ---------- header ---------- */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.primary,
    zIndex: 10,
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
  avatarBtn: {},
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

  /* ---------- profile menu ---------- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 110 : 95,
    paddingRight: Spacing.lg,
  },
  profileMenu: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: 220,
    overflow: 'hidden',
  },
  profileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  profileMenuAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMenuInitials: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  profileMenuName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  profileMenuSub: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  profileMenuIcon: {
    fontSize: 18,
  },
  profileMenuLabel: {
    fontSize: Typography.fontSizes.md,
    color: Colors.gray700,
    fontWeight: Typography.fontWeights.medium,
  },

  /* ---------- map ---------- */
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapTypeFab: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTypeFabIcon: {
    fontSize: 20,
  },
  mapTypeDropdown: {
    position: 'absolute',
    right: Spacing.md,
    top: 64,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minWidth: 150,
    zIndex: 100,
  },
  mapTypeTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  mapTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  mapTypeOptionActive: {
    backgroundColor: Colors.primary + '15',
  },
  mapTypeOptionIcon: {
    fontSize: 18,
  },
  mapTypeOptionLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray600,
    fontWeight: Typography.fontWeights.medium,
  },
  mapTypeOptionLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  locateMeBtn: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateMeIcon: {
    fontSize: 22,
    color: Colors.primary,
  },

  /* ---------- bottom sheet ---------- */
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handleZone: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gray300,
  },
  handleHint: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    marginTop: 6,
    fontWeight: Typography.fontWeights.medium,
  },
  sheetContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },

  /* ---------- search ---------- */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.gray700,
    fontWeight: Typography.fontWeights.medium,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray400,
    paddingHorizontal: 4,
  },

  /* ---------- route list ---------- */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  sectionCount: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    fontWeight: Typography.fontWeights.medium,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    alignItems: 'center',
  },
  routeColorBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  routeInfo: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: 4,
  },
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  routeCode: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  routeName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  routeDesc: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  routeEndpoints: {
    marginTop: 4,
    gap: 1,
  },
  endpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  endpointDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  endpointText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray500,
    flex: 1,
  },
  endpointArrow: {
    fontSize: 8,
    color: Colors.gray300,
    paddingLeft: 2.5,
    lineHeight: 10,
  },
  routeMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 4,
  },
  routeFreq: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    fontWeight: Typography.fontWeights.medium,
  },
  routeStops: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    fontWeight: Typography.fontWeights.medium,
  },

  /* ---- chevron (replaces → character) ---- */
  routeChevronBox: {
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 10,
    height: 10,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: Colors.gray300,
    transform: [{ rotate: '45deg' }],
  },

  /* ---- empty state ---- */
  emptyBox: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray400,
  },
});
