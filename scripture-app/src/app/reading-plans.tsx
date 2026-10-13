import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, PrimaryButton, Screen, ScreenHeader, SectionLabel } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';
import { PLAN_DAYS, describeReading, planDay, readingForDay } from '@/lib/plan';

export default function ReadingPlansScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { planStart, restartPlan } = useLibrary();

  const day = planDay(planStart);
  const today = readingForDay(day);
  const upcoming = Array.from({ length: 7 }, (_, i) => day + i + 1).filter((d) => d <= PLAN_DAYS);

  const open = (book: string, chapter: number) =>
    router.push({ pathname: '/read', params: { book, chapter: String(chapter) } });

  const confirmRestart = () =>
    Alert.alert('Restart plan', 'Start Bible in a Year again from day 1?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Restart', style: 'destructive', onPress: restartPlan },
    ]);

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Reading plans" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Card style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: t.display.medium, fontSize: 20, color: t.c.text }}>Bible in a Year</Text>
            <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted }}>
              Day {day} of {PLAN_DAYS}
            </Text>
          </View>
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: t.c.border,
              marginTop: 16,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${Math.max(2, (day / PLAN_DAYS) * 100)}%`,
                height: '100%',
                backgroundColor: t.accent.main,
              }}
            />
          </View>
        </Card>

        <SectionLabel>Today</SectionLabel>
        <Card>
          {today.map((item, index) => (
            <Card
              key={`${item.book.id}-${item.chapter}`}
              onPress={() => open(item.book.id, item.chapter)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 0,
                borderRadius: 0,
                borderBottomWidth: index === today.length - 1 ? 0 : 1,
                borderBottomColor: t.c.border,
                backgroundColor: 'transparent',
              }}
            >
              <Text style={{ flex: 1, fontFamily: t.ui.medium, fontSize: 15, color: t.c.text }}>
                {formatRef(item.book.name, item.chapter)}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={t.c.faint} />
            </Card>
          ))}
        </Card>

        {upcoming.length > 0 ? (
          <>
            <SectionLabel>Coming up</SectionLabel>
            <Card>
              {upcoming.map((d, index) => (
                <View
                  key={d}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    gap: 14,
                    borderBottomWidth: index === upcoming.length - 1 ? 0 : 1,
                    borderBottomColor: t.c.border,
                  }}
                >
                  <Text style={{ width: 52, fontFamily: t.ui.medium, fontSize: 12, color: t.c.muted }}>
                    Day {d}
                  </Text>
                  <Text style={{ flex: 1, fontFamily: t.ui.regular, fontSize: 14, color: t.c.body }}>
                    {describeReading(readingForDay(d))}
                  </Text>
                </View>
              ))}
            </Card>
          </>
        ) : null}

        <View style={{ marginTop: 28 }}>
          <PrimaryButton label="Restart plan" danger onPress={confirmRestart} />
        </View>
      </ScrollView>
    </Screen>
  );
}
