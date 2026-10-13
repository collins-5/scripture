import React from 'react';
import { TextInput, View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputHeight?: number;
  inputRadius?: number;
  labelClassName?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      description,
      required,
      containerClassName,
      className,
      leftIcon,
      rightIcon,
      inputHeight = 48,
      inputRadius = 8,
      labelClassName,
      secureTextEntry,
      multiline,
      onFocus,
      onBlur,
      onContentSizeChange,
      ...props
    },
    ref
  ) => {
    const { brand, text, red, surface, border } = useThemeColors();
    const [focused, setFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [contentHeight, setContentHeight] = React.useState(inputHeight);

    // Determine if this is a password field
    const isPasswordField = secureTextEntry === true;
    
    // Set the actual secureTextEntry value based on showPassword state
    const finalSecureTextEntry = isPasswordField ? !showPassword : secureTextEntry;
    
    // Create password toggle icon if this is a password field and no custom rightIcon provided
    const finalRightIcon = isPasswordField ? (
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Icon
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={20}
          color={text.dark}
        />
      </TouchableOpacity>
    ) : rightIcon;

    // Calculate dynamic height for multiline - starts at inputHeight, expands up to 6 lines max
    const getHeight = () => {
      if (!multiline) return inputHeight;
      // Maximum height for 6 lines (assuming ~22px per line + some padding)
      const maxHeight = 140; // Fixed max height for 6 lines
      return Math.min(Math.max(contentHeight, inputHeight), maxHeight);
    };

    const dynamicHeight = getHeight();

    return (
      <View className={cn('mb-3', containerClassName)}>
        {label && (
          <View className="flex-row mb-1.5">
            <Text className={cn("text-sm font-medium", labelClassName)} style={{ color: text.dark }}>
              {label}
            </Text>
            {required && (
              <Text className="text-sm ml-1" style={{ color: red.accent }}>*</Text>
            )}
          </View>
        )}

        <View
          style={{
            minHeight: dynamicHeight,
            borderRadius: inputRadius,
            borderWidth: focused ? 1.5 : 1,
            borderColor: error
              ? red.accent
              : focused
              ? brand.primary
              : text.placeholder,
            backgroundColor: surface.card,
          }}
          className={`flex-row ${multiline ? 'items-start' : 'items-center'} bg-card`}
        >
          {leftIcon && (
            <View className={`pl-3 ${multiline ? 'mt-2.5' : ''}`}>
              {leftIcon}
            </View>
          )}
          <TextInput
            ref={ref}
            secureTextEntry={finalSecureTextEntry}
            style={{
              minHeight: dynamicHeight,
              paddingTop: 0,
              paddingBottom: 0,
              textAlignVertical: multiline ? 'top' : 'center',
              color: text.dark,
            }}
            className={cn('flex-1 px-3 text-base', className)}
            placeholderTextColor={text.placeholder}
            underlineColorAndroid="transparent"
            multiline={multiline}
            onContentSizeChange={(e) => {
              if (multiline) {
                const newHeight = e.nativeEvent.contentSize.height;
                // Only update if within bounds
                if (newHeight <= 140) {
                  setContentHeight(newHeight);
                }
              }
              onContentSizeChange?.(e);
            }}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {finalRightIcon && (
            <View className={`pr-3 ${multiline ? 'mt-2.5' : ''}`}>
              {finalRightIcon}
            </View>
          )}
        </View>

        {description && !error && (
          <Text className="text-xs mt-1.5" style={{ color: text.muted }}>{description}</Text>
        )}

        {error && (
          <Text className="text-xs mt-1.5" style={{ color: red.accent }}>{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
