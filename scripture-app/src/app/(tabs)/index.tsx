import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSettings } from '@/hooks/use-settings';
import { useLibrary } from '@/hooks/use-library';
import { useScripture } from '@/hooks/useScripture';
import { useAuth } from '@/hooks/use-auth';
import { BOOK_MAP, formatRef } from '@/lib/bible/meta';
import { chapterBlocks } from '@/lib/bible/text';
import { verseOfTheDay } from '@/lib/daily-verse';
import { PLAN_DAYS, describeReading, planDay, readingForDay } from '@/lib/plan';
import { Card, IconCircle, ProgressRing, Screen } from '@/components/core/ui';
import { useDoubleBackExit } from '@/hooks/useDoubleBackExit';
import { Button } from '@/components/ui/button';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function displayName(user: { name?: string; email?: string } | null): string {
  if (!user) return 'friend';
  const named = user.name?.trim();
  if (named) return named;
  const email = user.email?.trim();
  if (email) {
    const local = email.split('@')[0];
    if (local) return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return 'friend';
}

export default function HomeScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { settings } = useSettings();
  const { lastRead, streak, planStart } = useLibrary();
  const { user, signOut } = useAuth();

  useDoubleBackExit();

  const daily = useMemo(() => verseOfTheDay(), []);
  const dailyBook = BOOK_MAP[daily.book];
  const { data, isLoading } = useScripture(settings.translation, daily.book, String(daily.chapter));

  const dailyText = useMemo(() => {
    const block = chapterBlocks(data?.chapterContent ?? []).find(
      (b) => b.type === 'verse' && b.number === daily.verse,
    );
    return block && block.type === 'verse' ? block.text : '';
  }, [data, daily.verse]);

  const dateLabel = new Date()
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();

  const resumeBook = lastRead ? BOOK_MAP[lastRead.book] : null;
  const resume =
    lastRead && resumeBook
      ? { book: resumeBook, chapter: lastRead.chapter, progress: lastRead.progress }
      : null;

  const day = planDay(planStart);
  const today = readingForDay(day);
  const todayLabel = describeReading(today);

  const openRead = (book: string, chapter: number, verse?: number) =>
    router.push({
      pathname: '/read',
      params: { book, chapter: String(chapter), ...(verse ? { verse: String(verse) } : {}) },
    });

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: t.ui.medium,
              fontSize: 11,
              letterSpacing: 1.6,
              color: t.c.muted,
            }}
          >
            {dateLabel}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="flame-outline" size={15} color={t.accent.main} />
              <Text
                style={{
                  fontFamily: t.ui.semibold,
                  fontSize: 13,
                  color: t.accent.main,
                }}
              >
                {streak}
              </Text>
            </View>

            <Pressable onPress={() => signOut()} hitSlop={10}>
              <Ionicons name="log-out-outline" size={18} color={t.c.muted} />
            </Pressable>
          </View>
        </View>

        <Text
          style={{
            fontFamily: t.display.medium,
            fontSize: 32,
            lineHeight: 38,
            color: t.c.text,
            marginTop: 6,
          }}
        >
          {greeting()},{'\n'}
          {displayName(user)}
        </Text>

        <Pressable
          onPress={() => openRead(daily.book, daily.chapter, daily.verse)}
          style={{
            backgroundColor: t.c.verseBg,
            borderRadius: 20,
            padding: 24,
            marginTop: 24,
          }}
        >
          <Text
            style={{
              fontFamily: t.ui.medium,
              fontSize: 10,
              letterSpacing: 1.8,
              color: t.c.verseMuted,
            }}
          >
            VERSE OF THE DAY
          </Text>
          {isLoading ? (
            <ActivityIndicator color={t.c.verseText} style={{ marginVertical: 28 }} />
          ) : (
            <Text
              style={{
                fontFamily: t.reading.regular,
                fontSize: t.reading.size(20),
                lineHeight: t.reading.lh(20),
                color: t.c.verseText,
                marginTop: 14,
              }}
            >
              {dailyText ? `“${dailyText}”` : 'Tap to read today’s verse.'}
            </Text>
          )}
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 }}
          >
            <View style={{ width: 28, height: 2, backgroundColor: t.accent.main }} />
            <Text
              style={{
                fontFamily: t.ui.semibold,
                fontSize: 12,
                color: t.c.verseMuted,
              }}
            >
              {formatRef(dailyBook?.name ?? daily.book, daily.chapter, daily.verse)}
            </Text>
          </View>
        </Pressable>

        <Card
          onPress={() =>
            resume ? openRead(resume.book.id, resume.chapter) : openRead('JHN', 1)
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            padding: 16,
            marginTop: 16,
          }}
        >
          <ProgressRing size={52} progress={resume?.progress ?? 0}>
            <Text
              style={{
                fontFamily: t.ui.semibold,
                fontSize: 11,
                color: t.c.text,
              }}
            >
              {Math.round((resume?.progress ?? 0) * 100)}%
            </Text>
          </ProgressRing>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted }}>
              {resume ? 'Continue reading' : 'Start reading'}
            </Text>
            <Text
              style={{
                fontFamily: t.display.medium,
                fontSize: 20,
                color: t.c.text,
                marginTop: 2,
              }}
            >
              {resume ? `${resume.book.name} ${resume.chapter}` : 'John 1'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={t.c.faint} />
        </Card>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
            paddingHorizontal: 8,
          }}
        >
          {[
            { label: 'Read', icon: 'book-outline', onPress: () => router.push('/read') },
            { label: 'Search', icon: 'search-outline', onPress: () => router.push('/search') },
            { label: 'Notes', icon: 'journal-outline', onPress: () => router.push('/notes') },
            { label: 'Saved', icon: 'bookmark-outline', onPress: () => router.push('/saved-verses') },
          ].map((action) => (
            <View key={action.label} style={{ alignItems: 'center', gap: 8 }}>
              <IconCircle name={action.icon as any} size={52} onPress={action.onPress} />
              <Text style={{ fontFamily: t.ui.medium, fontSize: 12, color: t.c.muted }}>
                {action.label}
              </Text>
            </View>
          ))}
        </View>

        <Card
          onPress={() => router.push('/reading-plans')}
          style={{ padding: 18, marginTop: 24 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ fontFamily: t.display.medium, fontSize: 17, color: t.c.text }}
            >
              Bible in a Year
            </Text>
            <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted }}>
              Day {day} of {PLAN_DAYS}
            </Text>
          </View>
          <View
            style={{
              height: 5,
              borderRadius: 3,
              backgroundColor: t.c.border,
              marginTop: 14,
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
          <Text
            style={{
              fontFamily: t.ui.regular,
              fontSize: 12,
              color: t.c.muted,
              marginTop: 10,
            }}
          >
            Today · {todayLabel}
          </Text>
        </Card>
        <Button text="onboarding" onPress={() => router.navigate('/(onboarding)')}/>
      </ScrollView>
    </Screen>
  );
}