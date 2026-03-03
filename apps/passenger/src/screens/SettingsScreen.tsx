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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onBack?: () => void;
}

export default function SettingsScreen({ onBack }: Props) {
  const { t, language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [liveTracking, setLiveTracking] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  const [darkMap, setDarkMap] = useState(false);

  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: t('settings_ok') }]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings_title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Map & Navigation ---- */}
        <Text style={styles.sectionLabel}>{t('settings_map_nav')}</Text>
        <View style={[styles.card, Shadows.sm]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="locate-outline"
                size={20}
                color={Colors.primary}
                style={styles.settingIconBox}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings_auto_center')}</Text>
                <Text style={styles.settingDesc}>{t('settings_auto_center_desc')}</Text>
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
              <Ionicons
                name="map-outline"
                size={20}
                color={Colors.primary}
                style={styles.settingIconBox}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings_show_routes')}</Text>
                <Text style={styles.settingDesc}>{t('settings_show_routes_desc')}</Text>
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
              <Ionicons
                name="moon-outline"
                size={20}
                color={Colors.primary}
                style={styles.settingIconBox}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings_dark_map')}</Text>
                <Text style={styles.settingDesc}>{t('settings_dark_map_desc')}</Text>
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
        <Text style={styles.sectionLabel}>{t('settings_tracking')}</Text>
        <View style={[styles.card, Shadows.sm]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="bus" size={20} color={Colors.primary} style={styles.settingIconBox} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings_live_tracking')}</Text>
                <Text style={styles.settingDesc}>{t('settings_live_tracking_desc')}</Text>
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
              <Ionicons
                name="notifications-outline"
                size={20}
                color={Colors.primary}
                style={styles.settingIconBox}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings_notifications')}</Text>
                <Text style={styles.settingDesc}>{t('settings_notifications_desc')}</Text>
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
        <Text style={styles.sectionLabel}>{t('settings_language')}</Text>
        <View style={[styles.card, Shadows.sm]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={Colors.primary}
                style={styles.settingIconBox}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings_lang_toggle')}</Text>
                <Text style={styles.settingDesc}>{t('settings_lang_desc')}</Text>
              </View>
            </View>
            <Switch
              value={language === 'bs'}
              onValueChange={(v) => setLanguage(v ? 'bs' : 'en')}
              trackColor={{ true: Colors.primary, false: Colors.gray300 }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* ---- Suggestions ---- */}
        <Text style={styles.sectionLabel}>{t('settings_suggestions')}</Text>
        <View style={[styles.card, Shadows.sm]}>
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() =>
              showInfo(t('settings_suggest_route_title'), t('settings_suggest_route_msg'))
            }
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={Colors.primary}
              style={styles.settingIconBox}
            />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('settings_suggest_route')}</Text>
              <Text style={styles.settingDesc}>{t('settings_suggest_route_desc')}</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() => showInfo(t('settings_report_title'), t('settings_report_msg'))}
          >
            <Ionicons
              name="warning-outline"
              size={20}
              color={Colors.primary}
              style={styles.settingIconBox}
            />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('settings_report')}</Text>
              <Text style={styles.settingDesc}>{t('settings_report_desc')}</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() => showInfo(t('settings_feature_title'), t('settings_feature_msg'))}
          >
            <Ionicons
              name="bulb-outline"
              size={20}
              color={Colors.primary}
              style={styles.settingIconBox}
            />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('settings_feature')}</Text>
              <Text style={styles.settingDesc}>{t('settings_feature_desc')}</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() => showInfo(t('settings_rate_title'), t('settings_rate_msg'))}
          >
            <Ionicons
              name="star-outline"
              size={20}
              color={Colors.primary}
              style={styles.settingIconBox}
            />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('settings_rate')}</Text>
              <Text style={styles.settingDesc}>{t('settings_rate_desc')}</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* ---- About ---- */}
        <Text style={styles.sectionLabel}>{t('settings_about')}</Text>
        <View style={[styles.card, Shadows.sm]}>
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() => showInfo(t('settings_about_sakayna'), t('settings_about_msg'))}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Colors.primary}
              style={styles.settingIconBox}
            />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('settings_about_sakayna')}</Text>
              <Text style={styles.settingDesc}>Version 1.0.0</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.suggestionRow}
            onPress={() => showInfo(t('settings_data_source'), t('settings_data_source_msg'))}
          >
            <Ionicons
              name="analytics-outline"
              size={20}
              color={Colors.primary}
              style={styles.settingIconBox}
            />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('settings_data_source')}</Text>
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
  settingIconBox: {
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
