import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '../components/TopAppBar';
import { FinancialRow } from '../components/FinancialRow';
import { mockEvOwnerSettings } from '../data/ev-owner';
import { colors, spacing, typography, radii, shadows } from '../theme';

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const settings = mockEvOwnerSettings;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopAppBar title="Settings" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
            <MaterialIcons name="person" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.rows}>
            <FinancialRow
              icon="account-circle"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Name"
              value={settings.accountName}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="directions-car"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Default Vehicle"
              value={settings.defaultVehicleName}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="public"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Home Grid"
              value={settings.homeGridRegion}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="attach-money"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Currency"
              value={settings.currency}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
          </View>
        </View>

        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <MaterialIcons name="tune" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.rows}>
            <FinancialRow
              icon="eco"
              iconBgColor={colors.secondaryContainer}
              iconColor={colors.onSecondaryContainer}
              label="Auto Optimize"
              value={settings.autoOptimizeEnabled ? 'On' : 'Off'}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
            <FinancialRow
              icon="sync"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Refresh Interval"
              value={`${settings.dataRefreshIntervalSec}s`}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
          </View>
        </View>

        <View style={[styles.card, shadows.atmospheric]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <MaterialIcons name="notifications" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.rows}>
            <FinancialRow
              icon="notifications-active"
              iconBgColor={colors.surfaceContainerHigh}
              iconColor={colors.onSurface}
              label="Enabled"
              value={settings.notificationsEnabled ? 'On' : 'Off'}
              valueColor={colors.onSurfaceVariant}
              valueStyle="normal"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  rows: {
    gap: spacing.sm,
  },
});
