import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRoleStore } from "@/stores/role-store";
import Icon from "@/components/ui/icon";
import { DrawerActions, useNavigation } from "expo-router/react-navigation";

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { brand, text, surface, border } = useThemeColors();
  const roles = useRoleStore((s) => s.roles);
  const activeRole = useRoleStore((s) => s.activeRole);
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      className="flex-row items-center justify-between px-5 pb-3"
      style={{
        paddingTop: insets.top + 8,
        backgroundColor: surface.card,
        borderBottomWidth: 1,
        borderBottomColor: border.light,
      }}
    >
      <TouchableOpacity onPress={openDrawer}>
        <Icon name="menu" size={28} color={text.primary} />
      </TouchableOpacity>
      <Text className="text-xl font-bold" style={{ color: text.primary }}>
        {title}
      </Text>
    </View>
  );
}
