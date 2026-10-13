import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView, Dimensions
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";
import Icon from "@/components/ui/icon";
import { router, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetManager } from "react-native-actions-sheet";
import { Button } from "../ui/button";
import { Switch as ThemedSwitch } from "@/components/ui/switch";

const { width } = Dimensions.get("window");

export function CustomDrawerContent(props: any) {
  const { brand, text, surface, border, ui } = useThemeColors();
  const { isDark, mode, setMode } = useThemePreference();
  const pathname = usePathname();

  const toggleTheme = () => {
    if (mode === "system") {
      setMode(isDark ? "light" : "dark");
    } else {
      setMode(isDark ? "light" : "dark");
    }
  };

  const drawerItems = [
    { name: "Home", icon: "home-outline", route: "(tabs)" },
    { name: "Components", icon: "account-outline", route: "/(tabs)/sink" },
    { name: "Settings", icon: "cog-outline", route: "/settings" },
    { name: "Onboarding", icon: "book-open-variant", route: "/(onboarding)" },
  ];

  const isActive = (route: string) => {
    if (route === "(tabs)") {
      return pathname === "/" || pathname === "/(tabs)";
    }
    return pathname.includes(route.replace("/(tabs)", ""));
  };

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: surface.card }}
    >
      <ScrollView>
        <View 
          className="p-5 border-b mb-2.5"
          style={{ borderBottomColor: border.light }}
        >
          <View className="flex-row items-center gap-3">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: brand.primary + "20" }}
            >
              <Icon name="account-outline" size={30} color={brand.primary} />
            </View>
            <View>
              <Text 
                className="text-base font-semibold"
                style={{ color: text.primary }}
              >
                Guest User
              </Text>
              <Text 
                className="text-xs"
                style={{ color: text.muted }}
              >
                guest@example.com
              </Text>
            </View>
          </View>
        </View>

        <View className="px-3">
          {drawerItems.map((item) => {
            const active = isActive(item.route);
            return (
              <TouchableOpacity
                key={item.route}
                className="flex-row items-center py-3 px-4 rounded-xl gap-3 mb-0.5"
                style={{ 
                  backgroundColor: active ? brand.primary + "15" : "transparent"
                }}
                onPress={() => {
                  props.navigation.closeDrawer();
                  router.push(item.route as any);
                }}
              >
                <Icon 
                  name={item.icon as any} 
                  size={24} 
                  color={active ? brand.primary : text.muted} 
                />
                <Text 
                  className="text-base"
                  style={{ 
                    color: active ? brand.primary : text.primary,
                    fontWeight: active ? "600" : "400"
                  }}
                >
                  {item.name}
                </Text>
                {active && (
                  <View 
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: brand.primary }}
                  />
                )}
              </TouchableOpacity>
            );
          })}

          <View 
            className="flex-row items-center justify-between py-3 px-4 rounded-xl mt-2.5 border-t"
            style={{ borderTopColor: border.light }}
          >
            <View className="flex-row items-center gap-3">
              <Icon
                name={isDark ? "weather-night" : ("white-balance-sunny" as any)}
                size={24}
                color={text.muted}
              />
              <Text 
                className="text-base"
                style={{ color: text.primary }}
              >
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <ThemedSwitch
              value={isDark}
              onValueChange={toggleTheme}
              activeTrackColor={brand.primary}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-10">
        <Button
          variant="destructive"
          size="default"
          text="Logout"
          className="w-full"
          onPress={() => SheetManager.show("logout-sheet")}
          rounded="xl"
          leftIcon={<Icon name="logout" size={18} color={text.muted} />}
        />
      </View>

      <View 
        className="p-4 border-t"
        style={{ borderTopColor: border.light }}
      >
        <Text 
          className="text-xs text-center"
          style={{ color: text.placeholder }}
        >
          v1.0.0 • React Native App
        </Text>
      </View>
    </SafeAreaView>
  );
}