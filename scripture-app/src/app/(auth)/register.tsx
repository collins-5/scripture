import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { lightPalette, darkPalette } from "@/lib/theme/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useRegister } from "@/hooks/useRegister";

export default function Register() {
  const { isDark } = useThemePreference();
  const palette = isDark ? darkPalette : lightPalette;

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    errors,
    handleRegister,
  } = useRegister();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: palette.surface.page }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 py-12">
          <View className="items-center mb-10">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: palette.brand.primary + "1A" }}
            >
              <Icon name="book-open-variant" size={40} color={palette.brand.primary} />
            </View>
            <Text
              className="text-3xl font-bold font-serif italic tracking-tight"
              style={{ color: palette.text.primary }}
            >
              Create Account
            </Text>
            <Text
              className="text-base mt-2 text-center"
              style={{ color: palette.text.muted }}
            >
              Start your journey. Begin documenting your insights and tracking reflections.
            </Text>
          </View>

          <View className="w-full">
            {errors.server && (
              <View
                className="w-full p-3 rounded-lg mb-4"
                style={{
                  backgroundColor: palette.red.light + "20",
                  borderWidth: 1,
                  borderColor: palette.red.accent + "40",
                }}
              >
                <Text
                  className="text-sm py-1 font-semibold text-center"
                  style={{ color: palette.red.accent }}
                >
                  {errors.server}
                </Text>
              </View>
            )}

            <View className="mb-1">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                placeholderTextColor={palette.text.placeholder}
                style={{
                  color: palette.text.primary,
                  borderColor: errors.firstName ? palette.red.accent : palette.border.medium,
                }}
              />
              {errors.firstName && (
                <Text
                  className="text-xs font-medium mt-1 pl-1"
                  style={{ color: palette.red.accent }}
                >
                  {errors.firstName}
                </Text>
              )}
            </View>

            <View className="mb-1">
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                placeholderTextColor={palette.text.placeholder}
                style={{
                  color: palette.text.primary,
                  borderColor: errors.lastName ? palette.red.accent : palette.border.medium,
                }}
              />
              {errors.lastName && (
                <Text
                  className="text-xs font-medium mt-1 pl-1"
                  style={{ color: palette.red.accent }}
                >
                  {errors.lastName}
                </Text>
              )}
            </View>

            <View className="mb-1">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={palette.text.placeholder}
                style={{
                  color: palette.text.primary,
                  borderColor: errors.email ? palette.red.accent : palette.border.medium,
                }}
              />
              {errors.email && (
                <Text
                  className="text-xs font-medium mt-1 pl-1"
                  style={{ color: palette.red.accent }}
                >
                  {errors.email}
                </Text>
              )}
            </View>

            <View className="mb-1">
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={palette.text.placeholder}
                style={{
                  color: palette.text.primary,
                  borderColor: errors.password ? palette.red.accent : palette.border.medium,
                }}
              />
              {errors.password && (
                <Text
                  className="text-xs font-medium mt-1 pl-1"
                  style={{ color: palette.red.accent }}
                >
                  {errors.password}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={palette.text.placeholder}
                style={{
                  color: palette.text.primary,
                  borderColor: errors.confirmPassword
                    ? palette.red.accent
                    : palette.border.medium,
                }}
              />
              {errors.confirmPassword && (
                <Text
                  className="text-xs font-medium mt-1 pl-1"
                  style={{ color: palette.red.accent }}
                >
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <View className="mt-4">
              <Button
                text="Sign Up"
                onPress={handleRegister}
                loading={loading}
                variant="default"
                size="lg"
                width="full"
                rounded="xl"
              />
            </View>
          </View>

          <View className="flex-row justify-center items-center mt-8">
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text className="text-sm" style={{ color: palette.text.muted }}>
                Already have an account?{" "}
                <Text style={{ color: palette.brand.primary, fontWeight: "600" }}>
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}