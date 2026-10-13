import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function ForgotPassword() {
  const { text, brand } = useThemeColors();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendReset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/verify-email');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <View className="items-center mb-8">
            <Icon name="lock-reset" size={64} color={brand.primary} />
            <Text className="text-2xl font-bold mt-4" style={{ color: text.primary }}>
              Forgot Password
            </Text>
            <Text className="text-center mt-2" style={{ color: text.muted }}>
              Enter your email and we'll send you a link to reset your password
            </Text>
          </View>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Icon name="email-outline" size={20} />}
          />

          <Button
            text="Send Reset Link"
            onPress={handleSendReset}
            loading={loading}
            variant="default"
            size="lg"
            width="full"
            rounded="xl"
            className="mt-6"
          />

          <TouchableOpacity 
            onPress={() => router.replace('/(auth)/login')}
            className="items-center mt-4"
          >
            <Text className="text-sm" style={{ color: brand.primary }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}