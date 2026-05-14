import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { OverviewScreen } from '../screens/OverviewScreen';
import { VehicleScreen } from '../screens/VehicleScreen';
import { FinancialsScreen } from '../screens/FinancialsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, spacing, typography, radii } from '../theme';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

type TabRouteName = 'Overview' | 'Vehicle' | 'Financials' | 'Settings';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<TabRouteName, MaterialIconName> = {
  Overview: 'dashboard',
  Vehicle: 'electric-car',
  Financials: 'payments',
  Settings: 'settings',
};

const TabButton = ({ accessibilityState, children, style, ...props }: any) => {
  const isActive = accessibilityState?.selected;

  return (
    <Pressable
      {...props}
      accessibilityState={accessibilityState}
      android_ripple={{ color: colors.primaryContainer, borderless: false }}
      style={[style, styles.tabButton, isActive && styles.activeTabButton]}
    >
      {children}
    </Pressable>
  );
};

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.onSecondaryContainer,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarItemStyle: styles.tabItem,
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarIcon: ({ color, size }) => {
          const routeName = route.name as TabRouteName;
          const iconName = TAB_ICONS[routeName];
          return <MaterialIcons name={iconName} size={size ?? 24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Vehicle" component={VehicleScreen} />
      <Tab.Screen name="Financials" component={FinancialsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    height: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 8,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
  },
  tabItem: {
    backgroundColor: 'transparent',
  },
  tabButton: {
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
  },
  activeTabButton: {
    backgroundColor: colors.secondaryContainer,
  },
  tabLabel: {
    ...typography.labelMd,
    marginTop: 2,
    textTransform: 'none',
  },
});
