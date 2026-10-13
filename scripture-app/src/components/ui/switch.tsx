import React from 'react';
import { Switch as RNSwitch, type SwitchProps } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type ThemedSwitchProps = Omit<SwitchProps, 'trackColor' | 'thumbColor' | 'ios_backgroundColor'> & {
  activeTrackColor?: string;
};

export function Switch({ activeTrackColor, ...props }: ThemedSwitchProps) {
  const { brand, text, surface } = useThemeColors();
  const onTrackColor = activeTrackColor ?? brand.primary;

  return (
    <RNSwitch
      trackColor={{
        false: text.placeholder,
        true: onTrackColor,
      }}
      thumbColor="#ffffff"
      ios_backgroundColor={surface.muted}
      {...props}
    />
  );
}
