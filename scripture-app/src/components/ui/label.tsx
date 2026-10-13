import * as LabelPrimitive from '@rn-primitives/label';
import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface LabelProps extends LabelPrimitive.TextProps {
  ref?: React.RefObject<LabelPrimitive.TextRef>;
  required?: boolean;
}

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <View className="flex-row items-center">
        <LabelPrimitive.Text
          className={cn(
            'text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70',
            className
          )}
          {...props}
        >
          {children}
        </LabelPrimitive.Text>
        {required && (
          <Text className="text-red-500 ml-1 text-sm">*</Text>
        )}
      </View>
    </LabelPrimitive.Root>
  );
}

export { Label };