import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheet,
  Card,
  IconName,
  ListRow,
  OptionSheet,
  PrimaryButton,
  Screen,
  SectionLabel,
} from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSettings } from '@/hooks/use-settings';
import { useAuth } from '@/hooks/use-auth';
import { ThemeMode, useThemePreference } from '@/hooks/use-theme-preference';
import { ACCENTS, ACCENT_ORDER } from '@/lib/theme/accents';
import { TRANSLATIONS, translationLabel } from '@/lib/bible/translations';
import { cancelDailyVerse, scheduleDailyVerse } from '@/lib/reminders';

const TAB_BAR_HEIGHT = 62;
const TAB_BAR_GAP = 12;

const MODES: { key: ThemeMode; label: string; icon: IconName }[] = [
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  { key: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
];

function formatTime(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(h12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function resolveAccountName(
  user: { name?: string; firstName?: string; email?: string } | null,
): string {
  if (!user) return '';
  const named = user.name?.trim();
  if (named) return named;
  const first = user.firstName?.trim();
  if (first) return first;
  const email = user.email?.trim();
  if (email) {
    const local = email.split('@')[0];
    if (local) return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return '';
}

function Stepper({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  const t = useAppTheme();
  const button = {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: t.c.card,
    borderWidth: 1,
    borderColor: t.c.border,
  };
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Text style={{ fontFamily: t.ui.medium, fontSize: 11, letterSpacing: 1, color: t.c.muted }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable onPress={onMinus} style={button}>
          <Ionicons name="remove" size={18} color={t.c.text} />
        </Pressable>
        <Text
          style={{
            fontFamily: t.ui.semibold,
            fontSize: 22,
            color: t.c.text,
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {value}
        </Text>
        <Pressable onPress={onPlus} style={button}>
          <Ionicons name="add" size={18} color={t.c.text} />
        </Pressable>
      </View>
    </View>
  );
}

export default function MoreScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useThemePreference();
  const { settings, update } = useSettings();
  const { user } = useAuth();

  const accountName = resolveAccountName(user);
  const displayName = settings.name?.trim() || accountName || 'Friend';

  const [translationOpen, setTranslationOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(settings.name?.trim() || accountName || '');

  const [enabled, setEnabled] = useState(settings.reminderEnabled);
  const [hour12, setHour12] = useState(
    settings.reminderHour % 12 === 0 ? 12 : settings.reminderHour % 12,
  );
  const [minute, setMinute] = useState(settings.reminderMinute);
  const [pm, setPm] = useState(settings.reminderHour >= 12);

  const bottomPad =
    Math.max(insets.bottom, TAB_BAR_GAP) + TAB_BAR_HEIGHT + 24;

  const openReminder = () => {
    setEnabled(settings.reminderEnabled);
    setHour12(settings.reminderHour % 12 === 0 ? 12 : settings.reminderHour % 12);
    setMinute(settings.reminderMinute);
    setPm(settings.reminderHour >= 12);
    setReminderOpen(true);
  };

  const applyReminder = async () => {
    const hour24 = (hour12 % 12) + (pm ? 12 : 0);
    setReminderOpen(false);
    if (enabled) {
      const ok = await scheduleDailyVerse(hour24, minute);
      if (!ok) {
        update({ reminderEnabled: false, reminderHour: hour24, reminderMinute: minute });
        Alert.alert(
          'Notifications are off',
          'Allow notifications for this app in your device settings to receive a daily verse.',
        );
        return;
      }
    } else {
      await cancelDailyVerse();
    }
    update({ reminderEnabled: enabled, reminderHour: hour24, reminderMinute: minute });
  };

  const openName = () => {
    setNameDraft(settings.name?.trim() || accountName || '');
    setNameOpen(true);
  };

  const saveName = () => {
    update({ name: nameDraft.trim() });
    setNameOpen(false);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: bottomPad,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: t.display.medium, fontSize: 32, color: t.c.text }}>More</Text>

        <SectionLabel>Appearance</SectionLabel>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {MODES.map((m) => {
            const active = mode === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setMode(m.key)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderWidth: active ? 1.5 : 1,
                  borderColor: active ? t.accent.main : t.c.border,
                  backgroundColor: active ? t.accent.soft : t.c.card,
                }}
              >
                <Ionicons name={m.icon} size={18} color={active ? t.accent.main : t.c.muted} />
                <Text
                  style={{
                    fontFamily: t.ui.medium,
                    fontSize: 12,
                    color: active ? t.accent.main : t.c.body,
                  }}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Card style={{ marginTop: 10 }}>
          <ListRow
            label="Accent"
            right={
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {ACCENT_ORDER.map((key) => {
                  const color = t.isDark ? ACCENTS[key].dark : ACCENTS[key].light;
                  const active = settings.accent === key;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => update({ accent: key })}
                      hitSlop={6}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: active ? t.c.text : 'transparent',
                      }}
                    >
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          backgroundColor: color,
                        }}
                      />
                    </Pressable>
                  );
                })}
              </View>
            }
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <ListRow
            icon="text-outline"
            label="Reading & fonts"
            chevron="chevron-forward"
            onPress={() => router.push('/reading-fonts')}
          />
        </Card>

        <SectionLabel>Reading</SectionLabel>
        <Card>
          <ListRow
            label="Default translation"
            value={translationLabel(settings.translation)}
            chevron="chevron-down"
            divider
            onPress={() => setTranslationOpen(true)}
          />
          <ListRow
            label="Words of Jesus in red"
            right={
              <Switch
                value={settings.redLetters}
                onValueChange={(value) => update({ redLetters: value })}
                trackColor={{ false: t.c.border, true: t.accent.main }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <ListRow
            icon="list-outline"
            label="Reading plans"
            chevron="chevron-forward"
            onPress={() => router.push('/reading-plans')}
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <ListRow
            icon="bookmark-outline"
            label="Saved verses"
            chevron="chevron-forward"
            onPress={() => router.push('/saved-verses')}
          />
        </Card>

        <SectionLabel>Reminders</SectionLabel>
        <Card>
          <ListRow
            icon="notifications-outline"
            label="Daily verse"
            value={
              settings.reminderEnabled
                ? formatTime(settings.reminderHour, settings.reminderMinute)
                : 'Off'
            }
            right={<Ionicons name="time-outline" size={16} color={t.c.muted} />}
            onPress={openReminder}
          />
        </Card>

        <SectionLabel>Account</SectionLabel>
        <Card>
          <ListRow
            label="Name"
            right={
              <Text style={{ fontFamily: t.ui.semibold, fontSize: 14, color: t.c.text }}>
                {displayName}
              </Text>
            }
            onPress={openName}
          />
        </Card>
      </ScrollView>

      <OptionSheet
        visible={translationOpen}
        onClose={() => setTranslationOpen(false)}
        title="Default translation"
        value={settings.translation}
        options={TRANSLATIONS.map((tr) => ({ value: tr.id, label: tr.label, sub: tr.name }))}
        onSelect={(value) => update({ translation: value })}
      />

      <BottomSheet visible={reminderOpen} onClose={() => setReminderOpen(false)} title="Daily verse">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <Text style={{ fontFamily: t.ui.medium, fontSize: 15, color: t.c.text }}>
            Remind me every day
          </Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: t.c.border, true: t.accent.main }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            opacity: enabled ? 1 : 0.4,
          }}
        >
          <Stepper
            label="HOUR"
            value={String(hour12).padStart(2, '0')}
            onMinus={() => setHour12((h) => (h === 1 ? 12 : h - 1))}
            onPlus={() => setHour12((h) => (h === 12 ? 1 : h + 1))}
          />
          <Stepper
            label="MINUTE"
            value={String(minute).padStart(2, '0')}
            onMinus={() => setMinute((m) => (m + 55) % 60)}
            onPlus={() => setMinute((m) => (m + 5) % 60)}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 18 }}>
          {[false, true].map((isPm) => {
            const active = pm === isPm;
            return (
              <Pressable
                key={String(isPm)}
                onPress={() => setPm(isPm)}
                style={{
                  paddingHorizontal: 28,
                  paddingVertical: 10,
                  borderRadius: 999,
                  backgroundColor: active ? t.accent.main : t.c.card,
                  borderWidth: 1,
                  borderColor: active ? t.accent.main : t.c.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: t.ui.semibold,
                    fontSize: 13,
                    color: active ? t.accent.on : t.c.body,
                  }}
                >
                  {isPm ? 'PM' : 'AM'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ marginTop: 22 }}>
          <PrimaryButton label="Done" onPress={applyReminder} />
        </View>
      </BottomSheet>

      <BottomSheet visible={nameOpen} onClose={() => setNameOpen(false)} title="Your name">
        <TextInput
          value={nameDraft}
          onChangeText={setNameDraft}
          autoFocus
          maxLength={40}
          placeholder={accountName || 'Enter your name'}
          placeholderTextColor={t.c.placeholder}
          style={{
            borderWidth: 1,
            borderColor: t.c.border,
            backgroundColor: t.c.card,
            borderRadius: 14,
            padding: 14,
            fontFamily: t.ui.regular,
            fontSize: 16,
            color: t.c.text,
            marginBottom: 14,
          }}
        />
        <PrimaryButton label="Save" onPress={saveName} />
      </BottomSheet>
    </Screen>
  );
}