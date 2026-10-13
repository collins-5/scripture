import type { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/components/ui/icon';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  rightElement?: ReactNode;
  onBack?: () => void;
  insetTop?: number;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  iconColor,
  rightElement,
  onBack,
  insetTop = 0,
}: PageHeaderProps) {
  const { brand, text, surface, border } = useThemeColors();
  const resolvedIconColor = iconColor ?? brand.primary;
  const hasLeftBadge = onBack || icon;

  return (
    <View
      className="pb-4 px-6 flex-row items-center"
      style={{
        backgroundColor: surface.card,
        borderBottomWidth: 1,
        borderBottomColor: border.light,
        paddingTop: insetTop,
        gap: hasLeftBadge ? 14 : 0,
      }}
    >
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
          style={{ backgroundColor: surface.muted }}
        >
          <Icon name="arrow-left" size={20} color={text.dark} />
        </TouchableOpacity>
      )}

      {!onBack && icon && (
        <View
          className="w-11 h-11 rounded-[14px] items-center justify-center shrink-0"
          style={{ backgroundColor: `${resolvedIconColor}18` }}
        >
          <Icon name={icon as any} size={22} color={resolvedIconColor} />
        </View>
      )}

      <View className="flex-1">
        <Text
          className={`font-bold ${onBack ? 'text-lg leading-6' : 'text-xl leading-7'}`}
          style={{ color: text.dark, letterSpacing: -0.3 }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-[13px] mt-[3px] leading-[18px]" style={{ color: text.muted }}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightElement && (
        <View className="shrink-0 rounded-full">
          {rightElement}
        </View>
      )}

      {onBack && !rightElement && <View className="w-10" />}
    </View>
  );
}
