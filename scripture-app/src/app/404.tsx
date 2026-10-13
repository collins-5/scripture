import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemePreference } from '@/hooks/use-theme-preference';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function NotFoundScreen() {
  const { isDark } = useThemePreference();
  const { brand, text, surface } = useThemeColors();

  return (
    <View className="flex-1" style={{ backgroundColor: surface.appGray }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={surface.appGray} />
      
      <View className="flex-1 justify-center items-center px-6">
        <View className="mb-8">
          <View className="p-6 rounded-full" style={{ backgroundColor: brand.primary + '15' }}>
            <Icon name="alert-circle-outline" size={80} color={brand.primary} />
          </View>
        </View>

        <Text className="text-6xl font-bold mb-2" style={{ color: brand.primary }}>
          404
        </Text>
        <Text className="text-2xl font-bold mb-2" style={{ color: text.primary }}>
          Page Not Found
        </Text>
        <Text className="text-base text-center mb-8" style={{ color: text.muted }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Text>

        <View className="w-full max-w-sm gap-3">
          <Button
            text="Go Back"
            onPress={() => router.back()}
            variant="default"
            size="lg"
            width="full"
            rounded="xl"
            leftIcon={<Icon name="arrow-left" size={20} color="#FFFFFF" />}
          />

          <Button
            text="Return to Dashboard"
            onPress={() => router.replace('/(app)/')}
            variant="default"
            size="lg"
            width="full"
            rounded="xl"
            leftIcon={<Icon name="home-heart" size={20} color="#FFFFFF" />}
          />

        </View>

        <View className="absolute bottom-8 items-center">
          <Text className="text-xs" style={{ color: text.placeholder }}>
            If you think this is an error, please contact support
          </Text>
        </View>
      </View>
    </View>
  );
}