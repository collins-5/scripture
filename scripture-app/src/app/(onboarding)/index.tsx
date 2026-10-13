import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useThemePreference } from '@/hooks/use-theme-preference';
import { lightPalette, darkPalette } from '@/lib/theme/colors';
import Icon from '@/components/ui/icon';

export default function OnboardingIndex() {
  const { isDark } = useThemePreference();
  const palette = isDark ? darkPalette : lightPalette;

  return (
    <View className="flex-1" style={{ backgroundColor: palette.surface.page }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-8">
          <View className="p-6 rounded-full mb-6" style={{ backgroundColor: palette.brand.primary + '1A' }}>
            <Icon name="book-open-variant" size={80} color={palette.brand.primary} />
          </View>

          <Text className="text-3xl font-bold text-center" style={{ color: palette.text.primary }}>
            Welcome to Scripture
          </Text>

          <Text className="text-base text-center mt-2 px-3" style={{ color: palette.text.muted }}>
            Engage with God's word daily, track your reading plans, and store personal reflections all in one place
          </Text>
        </View>

        <Button
          text="Get Started"
          onPress={() => router.push('/(onboarding)/steps')}
          variant="default"
          size="lg"
          width="full"
          rounded="xl"
        />

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="mt-4"
        >
          <Text className="text-sm" style={{ color: palette.text.muted }}>
            Already have an account? <Text style={{ color: palette.brand.primary, fontWeight: '600' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}