import React, { useRef } from 'react';
import { View, Keyboard, Text as RNText, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actions-sheet';
import { useAppTheme } from '@/hooks/use-app-theme';

export interface SafeAreaBottomSheetProps {
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
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const actionSheetRef = useRef<any>(null);

  const resolvedIconColor = iconColor ?? t.accent.main;
  const resolvedIconBgColor = iconBgColor ?? t.accent.soft;

  const bottomPadding =
    customPaddingBottom !== undefined
      ? customPaddingBottom
      : Math.max(insets.bottom, 16) + 16;

  const handleClose = () => {
    Keyboard.dismiss();
    if (onClose) onClose();
    actionSheetRef.current?.hide();
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
            defaultOverlayOpacity: 0.35,
          }
        : {})}
      containerStyle={{
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: t.c.sheet,
        borderTopWidth: 1,
        borderTopColor: t.c.border,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -8 },
        elevation: 16,
      }}
      indicatorStyle={{
        width: 44,
        height: 4,
        borderRadius: 2,
        backgroundColor: t.c.faint,
        marginTop: 6,
      }}
    >
      {(title || showCloseButton) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: t.c.border,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              flex: 1,
            }}
          >
            {icon ? (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: resolvedIconBgColor,
                }}
              >
                {icon}
              </View>
            ) : null}
            <View style={{ flex: 1 }}>
              {title ? (
                <RNText
                  style={{
                    fontFamily: t.display.medium,
                    fontSize: 18,
                    color: t.c.text,
                  }}
                  numberOfLines={1}
                >
                  {title}
                </RNText>
              ) : null}
              {subtitle ? (
                <RNText
                  style={{
                    fontFamily: t.ui.regular,
                    fontSize: 13,
                    color: t.c.muted,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {subtitle}
                </RNText>
              ) : null}
            </View>
          </View>

          {showCloseButton ? (
            <Pressable
              onPress={handleClose}
              disabled={loading}
              hitSlop={10}
              style={({ pressed }) => ({
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? t.c.border : 'transparent',
                opacity: loading ? 0.4 : 1,
              })}
            >
              <Ionicons name="close" size={20} color={t.c.text} />
            </Pressable>
          ) : null}
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: bottomPadding,
        }}
      >
        {children}
      </View>
    </ActionSheet>
  );
};

export default SafeAreaBottomSheet;