import { Drawer } from "expo-router/drawer";
import { AppProviders } from "@/providers";
import { CustomDrawerContent } from "@/components/core/custom-drawer-content";
import { useThemeColors } from "@/hooks/useThemeColors";

import "../../global.css";

function AppDrawer() {
  const { brand, surface, text } = useThemeColors();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: {
          backgroundColor: surface.card,
          width: 280,
        },
        drawerActiveBackgroundColor: brand.primary + "20",
        drawerActiveTintColor: brand.primary,
        drawerInactiveTintColor: text.muted,
      }}
    >
      <Drawer.Screen
        name="(onboarding)"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="(auth)"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="reading-fonts"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="reading-plans"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="saved-verses"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="[...unmatched]"
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppDrawer />
    </AppProviders>
  );
}