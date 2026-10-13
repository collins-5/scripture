import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'large', color, className }: LoadingSpinnerProps) {
  const { brand } = useThemeColors();
  const resolvedColor = color ?? brand.blue;
  return (
    <View className={cn('items-center justify-center', className)}>
      <ActivityIndicator size={size} color={resolvedColor} />
    </View>
  );
}