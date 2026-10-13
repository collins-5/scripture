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
import { useLogin } from "@/hooks/useLogin";

export default function Login() {
  const { isDark } = useThemePreference();
  const palette = isDark ? darkPalette : lightPalette;

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useLogin();

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
              Scripture
            </Text>
            <Text
              className="text-base mt-2 text-center"
              style={{ color: palette.text.muted }}
            >
              Dwell in the word richly. Sign in to your spiritual journal.
            </Text>
          </View>

          <View className="w-full">
            {error && (
              <View
                className="w-full p-3 rounded-lg mb-2"
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
                  {error}
                </Text>
              </View>
            )}

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={palette.text.placeholder}
              style={{ color: palette.text.primary, borderColor: palette.border.medium }}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={palette.text.placeholder}
              style={{ color: palette.text.primary, borderColor: palette.border.medium }}
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              className="items-end mb-6"
            >
              <Text className="text-sm font-medium" style={{ color: palette.brand.primary }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              text="Sign In"
              onPress={handleLogin}
              loading={loading}
              variant="default"
              size="lg"
              width="full"
              rounded="xl"
            />
          </View>

          <View className="flex-row justify-center items-center mt-8">
            <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
              <Text className="text-sm" style={{ color: palette.text.muted }}>
                New to Scripture?{" "}
                <Text style={{ color: palette.brand.primary, fontWeight: "600" }}>
                  Create an Account
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}