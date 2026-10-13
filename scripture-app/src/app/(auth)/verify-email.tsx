import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function VerifyEmail() {
  const { text, brand } = useThemeColors();
  const [resending, setResending] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => setResending(false), 1500);
  };

  const handleVerify = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center px-6" style={{ backgroundColor: text.muted }}>
      <View className="items-center mb-8">
        <Icon name="email-open-outline" size={80} color={brand.primary} />
        <Text className="text-2xl font-bold mt-4" style={{ color: text.primary }}>
          Verify Your Email
        </Text>
        <Text className="text-center mt-2" style={{ color: text.muted }}>
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </Text>
      </View>

      <Button
        text="I've Verified My Email"
        onPress={handleVerify}
        variant="default"
        size="lg"
        width="full"
        rounded="xl"
      />

      <TouchableOpacity 
        onPress={handleResend}
        className="items-center mt-4"
        disabled={resending}
      >
        <Text className="text-sm" style={{ color: resending ? text.muted : brand.primary }}>
          {resending ? 'Sending...' : "Didn't receive the email? Resend"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/(auth)/login')}
        className="items-center mt-2"
      >
        <Text className="text-sm" style={{ color: text.muted }}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}