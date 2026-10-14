import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function NoteLayout() {
  const { text, surface } = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: surface.card },
        headerTintColor: text.dark,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: surface.appGray },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}