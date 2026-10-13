import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface CheckboxProps {
  id?: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function Checkbox({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  error,
  className
}: CheckboxProps) {
  const { brand, text, surface, border, red } = useThemeColors();

  return (
    <View className={cn('mb-2', className)}>
      <TouchableOpacity
        onPress={() => !disabled && onCheckedChange(!checked)}
        className={cn('flex-row items-center py-2', disabled && 'opacity-50')}
        activeOpacity={0.7}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: checked ? brand.primary : (disabled ? surface.gray100 : surface.card),
            borderColor: checked ? brand.primary : border.medium,
          }}
        >
          {checked && <Text className="text-white text-xs font-bold">✓</Text>}
        </View>
        <Text style={{ color: text.medium, fontSize: 16 }}>{label}</Text>
      </TouchableOpacity>
      {error && (
        <Text className="text-sm mt-1 ml-7" style={{ color: red.accent }}>{error}</Text>
      )}
    </View>
  );
}
