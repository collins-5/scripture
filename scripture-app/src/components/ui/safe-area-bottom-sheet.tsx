import React, { useRef } from 'react';
import { View, Keyboard, Text as RNText } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemePreference } from '@/hooks/use-theme-preference';
import { lightPalette, darkPalette } from '@/lib/theme/colors';
import ActionSheet from 'react-native-actions-sheet';
import { Button } from './button';

interface SafeAreaBottomSheetProps {
  id: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  loading?: boolean;
  gestureEnabled?: boolean;
  closeOnTouchBackdrop?: boolean;
  keyboardHandlerEnabled?: boolean;
  customPaddingBottom?: number;
  avoidKeyboard?: boolean;
  snapPoints?: number[];
  initialSnapIndex?: number;
}

const SafeAreaBottomSheet: React.FC<SafeAreaBottomSheetProps> = ({
  id,
  children,
  title,
  subtitle,
  icon,
  iconColor,
  iconBgColor,
  showCloseButton = true,
  onClose,
  loading = false,
  gestureEnabled = true,
  closeOnTouchBackdrop = true,
  keyboardHandlerEnabled = true,
  customPaddingBottom,
  avoidKeyboard = true,
  snapPoints,
  initialSnapIndex = 0,
}) => {
  const { isDark } = useThemePreference();
  const palette = isDark ? darkPalette : lightPalette;
  const insets = useSafeAreaInsets();
  const actionSheetRef = useRef<any>(null);

  const resolvedIconColor = iconColor ?? palette.brand.primary;
  const resolvedIconBgColor = iconBgColor ?? palette.brand.primaryFaint;

  const handleClose = () => {
    Keyboard.dismiss();
    if (onClose) onClose();
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={id}
      gestureEnabled={!loading && gestureEnabled}
      closeOnTouchBackdrop={!loading && closeOnTouchBackdrop}
      backgroundInteractionEnabled={false}
      keyboardHandlerEnabled={keyboardHandlerEnabled}
      isModal={false}
      {...(snapPoints && snapPoints.length > 0
        ? {
            snapPoints,
            initialSnapIndex,
            defaultOverlayOpacity: 0.3,
          }
        : {})}
      containerStyle={{
        paddingBottom:
          customPaddingBottom !== undefined
            ? customPaddingBottom
            : insets.bottom,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: palette.surface.card,
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        elevation: 0,
      }}
      indicatorStyle={{
        width: 50,
        height: 5,
        backgroundColor: palette.brand.primaryDark,
      }}
    >
      {(title || showCloseButton) && (
        <View
          className="flex-row items-center justify-between px-6 pt-5 pb-4"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: palette.border.medium,
          }}
        >
          <View className="flex-row items-center gap-3">
            {icon && (
              <View
                className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: resolvedIconBgColor }}
              >
                {icon}
              </View>
            )}
            <View>
              {title && (
                <RNText
                  className="text-lg font-bold"
                  style={{ color: palette.text.dark }}
                >
                  {title}
                </RNText>
              )}
              {subtitle && (
                <RNText
                  className="text-[13px] mt-0.5"
                  style={{ color: palette.text.muted }}
                  numberOfLines={1}
                >
                  {subtitle}
                </RNText>
              )}
            </View>
          </View>

          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              onPress={handleClose}
              disabled={loading}
              iconProps={{
                name: 'close',
                size: 22,
                color: palette.text.dark,
              }}
            />
          )}
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 0,
        }}
      >
        {children}
      </View>
    </ActionSheet>
  );
};

export default SafeAreaBottomSheet;