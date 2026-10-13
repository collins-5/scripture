import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/use-app-theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabDef = {
  name: string;
  title: string;
  icon: IoniconName;
  outline: IoniconName;
};

const TABS: TabDef[] = [
  { name: 'index', title: 'Home', icon: 'home', outline: 'home-outline' },
  { name: 'read', title: 'Read', icon: 'book', outline: 'book-outline' },
  { name: 'search', title: 'Search', icon: 'search', outline: 'search-outline' },
  { name: 'notes', title: 'Notes', icon: 'journal', outline: 'journal-outline' },
  { name: 'more', title: 'More', icon: 'menu', outline: 'menu-outline' },
];

export default function TabsLayout() {
  const t = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent.main,
        tabBarInactiveTintColor: t.c.faint,
        tabBarStyle: {
          backgroundColor: t.c.card,
          borderTopColor: t.c.border,
          borderTopWidth: 1,
        },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarLabelStyle: {
          fontFamily: t.ui.medium,
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? tab.icon : tab.outline}
                size={size - 2}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}