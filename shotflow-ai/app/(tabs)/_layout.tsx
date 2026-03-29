import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../hooks';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { FontSize, FontWeight } from '../../constants/theme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 30,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="scan" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="enhance"
        options={{
          title: 'Enhance',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="sparkle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="presets"
        options={{
          title: 'Styles',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="palette" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
