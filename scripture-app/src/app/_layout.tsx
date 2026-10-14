import { Stack } from "expo-router";
import { AppProviders } from "@/providers";
import { useThemeColors } from "@/hooks/useThemeColors";

import "../../global.css";

function AppStack() {
  const { surface, text } = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: surface.card },
        headerTintColor: text.dark,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: surface.appGray },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="reading-fonts" options={{ headerShown: false }} />
      <Stack.Screen name="reading-plans" options={{ headerShown: false }} />
      <Stack.Screen name="note" options={{ headerShown: false }} />
      <Stack.Screen name="saved-verses" options={{ headerShown: false }} />
      <Stack.Screen name="[...unmatched]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppStack />
    </AppProviders>
  );
}