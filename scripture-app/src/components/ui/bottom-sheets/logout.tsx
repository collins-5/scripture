import React, { useRef } from "react";
import { View, Text } from "react-native";
import {
  SheetDefinition,
  SheetManager,
  ScrollView,
} from "react-native-actions-sheet";
import SafeAreaBottomSheet from "@/components/ui/safe-area-bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { router } from "expo-router";

interface LogoutSheetProps {
  payload?: {
    onSuccess?: () => void;
  };
}

const LogoutSheet = ({ payload }: LogoutSheetProps) => {
  const scrollViewRef = useRef<any>(null);

  return (
    <SafeAreaBottomSheet
      id="logout-sheet"
      title="sheet"
      icon={<Icon name="delete-outline" size={24} color="#ef4444" />}
      iconBgColor="#fee2e2"
      showCloseButton={true}
      onClose={() => SheetManager.hide("logout-sheet")}
      keyboardHandlerEnabled={true}
      avoidKeyboard={true}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        style={{ maxHeight: "90%" }}
      >
        <View>
          <View className="mt-4">
            <Text className="text-sm text-destructive mt-2">
              Are You Sure You Want To Logout?
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 pt-2 mb-4">
          <Button
            onPress={() => SheetManager.hide("logout-sheet")}
            variant="outline"
            className="flex-1"
            text="Cancel"
          />
          <Button
            onPress={() => {
              // TODO: Add logout logic here
              router.replace("/(auth)/login"),
              SheetManager.hide("logout-sheet");
            }}
            variant="destructive"
            className="flex-1"
            text="Logout"
          />
        </View>
      </ScrollView>
    </SafeAreaBottomSheet>
  );
};

export type LogoutSheetDefinition = SheetDefinition<{
  payload?: {
    onSuccess?: () => void;
  };
}>;

export default LogoutSheet;
