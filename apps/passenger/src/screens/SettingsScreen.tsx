import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

interface Props {
  onBack?: () => void;
}

export default function SettingsScreen({ onBack }: Props) {
  const [notifications, setNotifications] = useState(true);
  const [liveTracking, setLiveTracking] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  const [darkMap, setDarkMap] = useState(false);
  const [tagalog, setTagalog] = useState(true);

  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Map & Navigation ---- */}
        <Text style={styles.sectionLabel}>MAP & NAVIGATION</Text>
        <View style={[styles.card, Shadows.sm]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>📍</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto-Center on Location</Text>
                <Text style={styles.settingDesc}>
                  Automatically center the map on your current location when the app starts
                </Text>
              </View>
            </View>
            <Switch
              value={autoCenter}
              onValueChange={setAutoCenter}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🗺️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Show All Routes on Map</Text>
                <Text style={styles.settingDesc}>
                  Display all jeepney routes on the home map. Turn off to reduce clutter
                </Text>
              </View>
            </View>
            <Switch
              value={showAllRoutes}
              onValueChange={setShowAllRoutes}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Map Theme</Text>
                <Text style={styles.settingDesc}>
                  Use a darker map style for better visibility at night
                </Text>
              </View>
            </View>
            <Switch
              value={darkMap}
              onValueChange={setDarkMap}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* ---- Tracking ---- */}
        <Text style={styles.sectionLabel}>TRACKING</Text>
        <View style={[styles.card, Shadows.sm]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🚌</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Live Jeepney Tracking</Text>
                <Text style={styles.settingDesc}>
                  Enable real-time jeepney position updates when tracking a route
                </Text>
              </View>
            </View>
            <Switch
              value={liveTracking}
              onValueChange={setLiveTracking}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDesc}>
                  Get notified when a jeepney is approaching your stop
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* ---- Language ---- */}
        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <View style={[styles.card, Shadows.sm]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌐</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Filipino / Tagalog</Text>
                <Text style={styles.settingDesc}>
                  Use Filipino labels for stops, buttons, and instructions
                </Text>
              </View>
            </View>
            <Switch
              value={tagalog}
              onValueChange={setTagalog}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* ---- Suggestions ---- */}
        <Text style={styles.sectionLabel}>SUGGESTIONS</Text>
        <View style={[styles.card, Shadows.sm]}>
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(
                'Suggest a Route',
                'Know a jeepney route that is not listed? Send us the route name, stops, and any details so we can add it to SakayNa!',
              )
            }
          >
            <Text style={styles.settingIcon}>➕</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Suggest a New Route</Text>
              <Text style={styles.settingDesc}>Help us add more jeepney routes to the app</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(
                'Report Route Issue',
                'If a route has incorrect stops, outdated information, or wrong coordinates, please let us know so we can fix it.',
              )
            }
          >
            <Text style={styles.settingIcon}>⚠️</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Report Route Issue</Text>
              <Text style={styles.settingDesc}>
                Report wrong stops, outdated info, or incorrect route paths
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(
                'Feature Request',
                "Have an idea to improve SakayNa? We'd love to hear it! Suggestions like fare calculator, trip planner, or favorite routes are welcome.",
              )
            }
          >
            <Text style={styles.settingIcon}>💡</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Request a Feature</Text>
              <Text style={styles.settingDesc}>
                Suggest new features like fare calculator, trip planner, or favorites
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(
                'Rate SakayNa',
                'If you find SakayNa helpful, please rate us on the app store! Your feedback helps us improve.',
              )
            }
          >
            <Text style={styles.settingIcon}>⭐</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Rate SakayNa</Text>
              <Text style={styles.settingDesc}>
                Love the app? Give us a rating to help other commuters find us
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* ---- About ---- */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={[styles.card, Shadows.sm]}>
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(
                'About SakayNa',
                'SakayNa is a jeepney transit tracker for Davao City. It helps commuters find routes, track jeepneys, and navigate the city.\n\nRoute data sourced from commutedavao.com\n\nVersion 1.0.0',
              )
            }
          >
            <Text style={styles.settingIcon}>ℹ️</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>About SakayNa</Text>
              <Text style={styles.settingDesc}>Version 1.0.0</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(
                'Data Source',
                'Jeepney route data is sourced from commutedavao.com, an open-source project by Tatskiee that maps Davao City jeepney routes using OSRM and Leaflet.\n\nGitHub: github.com/Tatskiee/Commutedavao',
              )
            }
          >
            <Text style={styles.settingIcon}>📊</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Data Source</Text>
              <Text style={styles.settingDesc}>commutedavao.com</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: Typography.fontSizes.xl,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.gray400,
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  settingIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  settingDesc: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginLeft: 56,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.gray300,
    transform: [{ rotate: '45deg' }],
  },
});
