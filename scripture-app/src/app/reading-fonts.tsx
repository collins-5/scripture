import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, Screen, ScreenHeader, SectionLabel } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSettings } from '@/hooks/use-settings';
import { FONT_OPTIONS, LINE_STEPS, SIZE_STEPS } from '@/lib/theme/fonts';

export default function ReadingFontsScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { settings, update } = useSettings();

  const stepButton = (name: 'remove' | 'add', disabled: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.c.card,
        borderWidth: 1,
        borderColor: t.c.border,
        opacity: disabled ? 0.35 : 1,
      }}
    >
      <Ionicons name={name} size={18} color={t.c.text} />
    </Pressable>
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Reading & fonts" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Card style={{ padding: 20 }}>
          <Text style={{ fontFamily: t.ui.medium, fontSize: 10, letterSpacing: 1.8, color: t.c.muted }}>
            PREVIEW
          </Text>
          <Text
            style={{
              fontFamily: t.reading.regular,
              fontSize: t.reading.size(19),
              lineHeight: t.reading.lh(19),
              color: t.c.body,
              marginTop: 12,
            }}
          >
            <Text style={{ fontFamily: t.ui.semibold, fontSize: t.reading.size(10), color: t.accent.main }}>
              3{' '}
            </Text>
            Jesus answered and said unto him,{' '}
            <Text style={settings.redLetters ? { color: t.c.jesus } : undefined}>
              Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of
              God.
            </Text>
          </Text>
        </Card>

        <SectionLabel>Typeface</SectionLabel>
        <Card>
          {FONT_OPTIONS.map((font, index) => {
            const active = settings.fontFamily === font.key;
            return (
              <Pressable
                key={font.key}
                onPress={() => update({ fontFamily: font.key })}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: index === FONT_OPTIONS.length - 1 ? 0 : 1,
                  borderBottomColor: t.c.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: font.regular, fontSize: 18, color: active ? t.accent.main : t.c.text }}>
                    {font.label}
                  </Text>
                  <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted, marginTop: 2 }}>
                    {font.description}
                  </Text>
                </View>
                {active ? <Ionicons name="checkmark" size={20} color={t.accent.main} /> : null}
              </Pressable>
            );
          })}
        </Card>

        <SectionLabel>Text size</SectionLabel>
        <Card style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 }}>
          {stepButton('remove', settings.sizeStep === 0, () => update({ sizeStep: settings.sizeStep - 1 }))}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {SIZE_STEPS.map((_, index) => (
              <Pressable key={index} onPress={() => update({ sizeStep: index })} hitSlop={8}>
                <View
                  style={{
                    width: index === settings.sizeStep ? 14 : 8,
                    height: index === settings.sizeStep ? 14 : 8,
                    borderRadius: 7,
                    backgroundColor: index <= settings.sizeStep ? t.accent.main : t.c.border,
                  }}
                />
              </Pressable>
            ))}
          </View>
          {stepButton('add', settings.sizeStep === SIZE_STEPS.length - 1, () =>
            update({ sizeStep: settings.sizeStep + 1 }),
          )}
        </Card>

        <SectionLabel>Line spacing</SectionLabel>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {LINE_STEPS.map((step, index) => {
            const active = settings.lineStep === index;
            return (
              <Pressable
                key={step.label}
                onPress={() => update({ lineStep: index })}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderWidth: active ? 1.5 : 1,
                  borderColor: active ? t.accent.main : t.c.border,
                  backgroundColor: active ? t.accent.soft : t.c.card,
                }}
              >
                <Text
                  style={{
                    fontFamily: t.ui.medium,
                    fontSize: 13,
                    color: active ? t.accent.main : t.c.body,
                  }}
                >
                  {step.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
