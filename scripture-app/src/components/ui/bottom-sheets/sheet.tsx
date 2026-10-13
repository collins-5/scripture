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

interface SheetProps {
  payload?: {
    onSuccess?: () => void;
  };
}

const IndexSheet = ({ payload }: SheetProps) => {
  const scrollViewRef = useRef<any>(null);

  return (
    <SafeAreaBottomSheet
      id="index-sheet"
      title="sheet"
      icon={<Icon name="delete-outline" size={24} color="#ef4444" />}
      iconBgColor="#fee2e2"
      showCloseButton={true}
      onClose={() => SheetManager.hide("index-sheet")}
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
            <Input
              label={`Type "DELETE" to confirm`}
              placeholder="DELETE"
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View className="flex-row gap-3 pt-2 mb-4">
          <Button variant="outline" className="flex-1" text="Cancel" />
          <Button
            variant="destructive"
            className="flex-1"
            text="Delete Account"
          />
        </View>
      </ScrollView>
    </SafeAreaBottomSheet>
  );
};

export type IndexSheetDefinition = SheetDefinition<{
  payload?: {
    onSuccess?: () => void;
  };
}>;

export default IndexSheet;
