import React from 'react';
import { View, Image, Text, ViewProps, ImageProps } from 'react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface AvatarProps extends ViewProps {
  size?: 'sm' | 'default' | 'lg';
}

export function Avatar({ className, size = 'default', style, ...props }: AvatarProps) {
  const { surface } = useThemeColors();
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  return (
    <View
      className={cn(
        'relative rounded-full overflow-hidden',
        sizeClasses[size],
        className
      )}
      style={[{ backgroundColor: surface.muted }, style]}
      {...props}
    />
  );
}

export function AvatarImage({ className, ...props }: ImageProps) {
  return (
    <Image
      className={cn('w-full h-full', className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, style, ...props }: ViewProps) {
  const { text, surface } = useThemeColors();

  return (
    <View
      className={cn('flex-1 items-center justify-center', className)}
      style={[{ backgroundColor: surface.gray100 }, style]}
      {...props}
    >
      <Text className="text-sm font-medium" style={{ color: text.muted }}>
        {children}
      </Text>
    </View>
  );
}
