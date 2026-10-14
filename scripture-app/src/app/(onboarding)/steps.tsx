import React, { useState, useRef, useEffect } from "react";
import { View, Text, Animated, StatusBar } from "react-native";
import { router } from "expo-router";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { lightPalette, darkPalette } from '@/lib/theme/colors';
import { Button } from "@/components/ui/button";
import { Mascot, MascotPose } from "@/components/mascot/mascot";
import { useOnboardingStore } from "@/stores/onboardingStore";

const SLIDES: { verse: string; ref: string; title: string; pose: MascotPose }[] = [
  {
    verse: "Thy word is a lamp unto my feet, and a light unto my path.",
    ref: "Psalm 119:105",
    title: "Read with intention",
    pose: "read",
  },
  {
    verse: "Be still, and know that I am God.",
    ref: "Psalm 46:10",
    title: "Study in stillness",
    pose: "still",
  },
  {
    verse: "Let the word of Christ dwell in you richly.",
    ref: "Colossians 3:16",
    title: "Carry it with you",
    pose: "lantern",
  },
];

export default function OnboardingSteps() {
  const { isDark } = useThemePreference();
  const palette = isDark ? darkPalette : lightPalette;

  const markSeen = useOnboardingStore((s) => s.markSeen);

  const [step, setStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideYAnim = useRef(new Animated.Value(0)).current;
  const lastStepFade = useRef(new Animated.Value(0)).current;
  const backButtonWidth = useRef(new Animated.Value(0)).current;
  const backButtonOpacity = useRef(new Animated.Value(0)).current;

  const currentSlide = SLIDES[step];
  const isFirstStep = step === 0;
  const isLastStep = step === SLIDES.length - 1;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backButtonWidth, {
        toValue: isFirstStep ? 0 : 74,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(backButtonOpacity, {
        toValue: isFirstStep ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFirstStep]);

  useEffect(() => {
    if (isLastStep) {
      Animated.timing(lastStepFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      lastStepFade.setValue(0);
    }
  }, [isLastStep]);

  const handleContinue = () => {
    if (!isLastStep) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(slideYAnim, { toValue: -12, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        setStep((prev) => prev + 1);
        slideYAnim.setValue(12);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(slideYAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      });
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(slideYAnim, { toValue: 12, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        setStep((prev) => prev - 1);
        slideYAnim.setValue(-12);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(slideYAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      });
    }
  };

  const handleFinish = () => {
    markSeen();
    router.replace("/(auth)/login");
  };

  const handleGuest = () => {
    markSeen();
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 justify-between pb-12 pt-24" style={{ backgroundColor: palette.surface.page }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-1 justify-center items-center px-8">
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideYAnim }] }}
          className="w-full items-center"
        >
          <View className="mb-8">
            <Mascot pose={currentSlide.pose} size={170} />
          </View>
          <Text className="text-2xl text-center italic font-serif" style={{ color: palette.text.primary, lineHeight: 36 }}>
            “{currentSlide.verse}”
          </Text>
          <Text className="mt-4 text-xs font-medium tracking-widest uppercase text-center opacity-70" style={{ color: palette.text.muted }}>
            {currentSlide.ref}
          </Text>
          <Text className="mt-10 text-3xl font-bold text-center" style={{ color: palette.text.primary }}>
            {currentSlide.title}
          </Text>
        </Animated.View>
      </View>

      <View className="px-8 w-full">
        <View className="flex-row items-center w-full">
          <Animated.View
            style={{
              width: backButtonWidth,
              opacity: backButtonOpacity,
              marginRight: isFirstStep ? 0 : 12,
              overflow: 'hidden',
            }}
          >
            <Button
              variant="outline"
              size="lg"
              rounded="xl"
              iconProps={{ name: "arrow-left", size: 22 }}
              onPress={handleBack}
              disabled={isFirstStep}
            />
          </Animated.View>

          <View className="flex-1">
            <Button
              variant="default"
              size="lg"
              width="full"
              rounded="xl"
              text={isLastStep ? "Login" : "Continue"}
              rightIcon={!isLastStep ? <View><Text style={{ display: 'none' }} /></View> : undefined}
              iconProps={!isLastStep ? { name: "arrow-right", size: 22, color: isDark ? palette.brand.primaryDeep : '#FFFFFF' } : undefined}
              onPress={isLastStep ? handleFinish : handleContinue}
            />
          </View>
        </View>

        {isLastStep && (
          <Animated.View style={{ opacity: lastStepFade }} className="w-full items-center mt-4">
            <Button
              variant="link"
              text="Continue as guest"
              onPress={handleGuest}
              textClassName="underline"
            />
          </Animated.View>
        )}

        <View className="mt-8 flex-row justify-center items-center gap-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className="h-1 rounded-full"
              style={{
                width: i === step ? 24 : 6,
                backgroundColor: i === step ? palette.brand.primary : palette.border.medium,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}