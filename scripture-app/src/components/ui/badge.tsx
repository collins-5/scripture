import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';
import Icon from './icon';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  icon?: string;
}

const Badge = ({ children, variant = 'default', icon, className, style, ...props }: BadgeProps) => {
  const { brand, surface, border, text, green, red } = useThemeColors();

  const getVariantStyle = () => {
    switch (variant) {
      case 'default':
        return { backgroundColor: brand.primary };
      case 'secondary':
        return { backgroundColor: surface.muted };
      case 'destructive':
        return { backgroundColor: red.accent };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: border.medium };
      case 'success':
        return { backgroundColor: green.light };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'default':
      case 'destructive':
        return '#FFFFFF';
      case 'secondary':
        return text.muted;
      case 'outline':
        return text.dark;
      case 'success':
        return green.accent;
    }
  };

  const getIconColor = () => getTextColor();

  const textColor = getTextColor();

  return (
    <View
      className={cn('px-2 py-1 rounded-md items-center justify-center flex-row gap-1', className)}
      style={[getVariantStyle(), style]}
      {...props}
    >
      {icon && <Icon name={icon as any} size={12} color={getIconColor()} />}
      <Text className="text-xs font-semibold" style={{ color: textColor }}>
        {children}
      </Text>
    </View>
  );
};

export { Badge };
