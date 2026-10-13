import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function AuthLayout() {
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
        name="login"
        options={{
          headerBackVisible: false,
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerBackVisible: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerBackVisible: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="verify-email"
        options={{
          headerBackVisible: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}