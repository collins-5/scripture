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
import Mascot from '@/components/mascot/mascot';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
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

  const dailyPreview = useMemo(() => {
    const blocks = chapterBlocks(data?.chapterContent ?? []);
    const first = blocks.find((b) => b.type === 'verse');
    return first && first.type === 'verse' ? first.text : '';
  }, [data]);

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

  const accountName = resolveAccountName(user);
  const preferred = settings.name?.trim();
  const name = preferred || accountName || 'Friend';

  const streakSubtitle =
    streak > 0
      ? `You're on a ${streak}-day streak. Keep the flame alive.`
      : "Let's begin today's reading.";

  const openRead = (book: string, chapter: number, verse?: number) =>
    router.push({
      pathname: '/read',
      params: { book, chapter: String(chapter), ...(verse ? { verse: String(verse) } : {}) },
    });

  const beginToday = () => {
    const first = today[0];
    if (first) {
      const bookId = typeof first.book === 'string' ? first.book : first.book.id;
      openRead(bookId, first.chapter);
    } else {
      openRead('JHN', 1);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="px-5 pt-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Text
            className="text-[10px] tracking-[2px] font-medium"
            style={{ fontFamily: t.ui.medium, color: t.c.muted }}
          >
            {dateLabel}
          </Text>

          <View className="flex-row items-center gap-3">
            {streak > 0 ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="flame" size={14} color={t.accent.main} />
                <Text
                  className="text-[13px] font-semibold"
                  style={{ fontFamily: t.ui.semibold, color: t.accent.main }}
                >
                  {streak}
                </Text>
              </View>
            ) : null}

            <Pressable onPress={() => signOut()} hitSlop={10}>
              <Ionicons name="log-out-outline" size={18} color={t.c.muted} />
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-end justify-between mt-3">
          <View className="flex-1 pr-3">
            <Text
              className="text-sm tracking-[0.3px] font-medium"
              style={{ fontFamily: t.ui.medium, color: t.c.muted }}
            >
              {greeting()},
            </Text>
            <Text
              className="text-[34px] leading-[40px] mt-0.5"
              style={{ fontFamily: t.display.medium, color: t.c.text }}
            >
              {name}
            </Text>
            <Text
              className="text-[13px] mt-2"
              style={{ fontFamily: t.ui.regular, color: t.c.muted }}
            >
              {streakSubtitle}
            </Text>
          </View>

          <View className="mb-1">
            <Mascot size={72} />
          </View>
        </View>

        <Pressable
          onPress={() => openRead(daily.book, daily.chapter, daily.verse)}
          className="rounded-3xl p-6 mt-7 overflow-hidden"
          style={{
            backgroundColor: t.accent.main,
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 8,
          }}
        >
          <Text
            className="absolute -top-[30px] left-1 text-[140px] leading-[140px] text-white opacity-[0.12]"
            style={{ fontFamily: t.display.semibold }}
          >
            "
          </Text>

          <View
            className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-white opacity-[0.06]"
          />

          <Text
            className="text-[10px] tracking-[2px] font-semibold text-white opacity-75"
            style={{ fontFamily: t.ui.semibold }}
          >
            VERSE OF THE DAY
          </Text>

          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" style={{ marginVertical: 28 }} />
          ) : (
            <Text
              className="mt-3.5 text-white"
              style={{
                fontFamily: t.reading.regular,
                fontSize: t.reading.size(20),
                lineHeight: t.reading.lh(20),
                textShadowColor: 'rgba(0,0,0,0.12)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
              }}
            >
              {dailyText ? `"${dailyText}"` : "Tap to read today's verse."}
            </Text>
          )}

          <View className="flex-row items-center justify-between mt-5">
            <View
              className="px-3 py-1.5 rounded-full border"
              style={{
                borderColor: 'rgba(255,255,255,0.28)',
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Text
                className="text-[11px] tracking-[0.5px] font-semibold text-white"
                style={{ fontFamily: t.ui.semibold }}
              >
                {formatRef(dailyBook?.name ?? daily.book, daily.chapter, daily.verse)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Text
                className="text-xs font-semibold text-white opacity-90"
                style={{ fontFamily: t.ui.semibold }}
              >
                Read chapter
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          </View>
        </Pressable>

        <Card
          onPress={() =>
            resume ? openRead(resume.book.id, resume.chapter) : openRead('JHN', 1)
          }
          className="flex-row items-center gap-4 p-4 mt-5"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
          }}
        >
          <ProgressRing size={56} progress={resume?.progress ?? 0}>
            <Text
              className="text-[11px] font-semibold"
              style={{ fontFamily: t.ui.semibold, color: t.c.text }}
            >
              {Math.round((resume?.progress ?? 0) * 100)}%
            </Text>
          </ProgressRing>

          <View className="flex-1">
            <Text
              className="text-[10px] tracking-[1.6px] font-semibold uppercase"
              style={{ fontFamily: t.ui.semibold, color: t.c.muted }}
            >
              {resume ? 'Continue reading' : 'Start reading'}
            </Text>
            <Text
              className="text-xl mt-1"
              style={{ fontFamily: t.display.medium, color: t.c.text }}
            >
              {resume ? `${resume.book.name} ${resume.chapter}` : 'John 1'}
            </Text>
            {resume && dailyPreview ? (
              <Text
                numberOfLines={1}
                className="text-xs italic mt-1"
                style={{ fontFamily: t.reading.regular, color: t.c.muted }}
              >
                {dailyPreview}
              </Text>
            ) : null}
          </View>

          <Ionicons name="chevron-forward" size={18} color={t.c.faint} />
        </Card>

        <View className="flex-row justify-between mt-7 px-1">
          {[
            { label: 'Read', icon: 'book-outline', onPress: () => router.push('/read') },
            { label: 'Search', icon: 'search-outline', onPress: () => router.push('/search') },
            { label: 'Notes', icon: 'journal-outline', onPress: () => router.push('/notes') },
            { label: 'Saved', icon: 'bookmark-outline', onPress: () => router.push('/saved-verses') },
            { label: 'Plans', icon: 'list-outline', onPress: () => router.push('/reading-plans') },
          ].map((action) => (
            <View key={action.label} className="items-center gap-2">
              <IconCircle name={action.icon as any} size={52} onPress={action.onPress} />
              <Text
                className="text-[11px]"
                style={{ fontFamily: t.ui.medium, color: t.c.muted }}
              >
                {action.label}
              </Text>
            </View>
          ))}
        </View>

        <Card className="p-5 mt-7">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className="text-lg"
                style={{ fontFamily: t.display.medium, color: t.c.text }}
              >
                Bible in a Year
              </Text>
              <Text
                className="text-xs mt-0.5"
                style={{ fontFamily: t.ui.regular, color: t.c.muted }}
              >
                Day {day} of {PLAN_DAYS}
              </Text>
            </View>

            {streak > 0 ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="flame" size={14} color={t.accent.main} />
                <Text
                  className="text-[13px] font-semibold"
                  style={{ fontFamily: t.ui.semibold, color: t.accent.main }}
                >
                  {streak}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            className="h-1.5 rounded-full mt-4 overflow-hidden"
            style={{ backgroundColor: t.c.border }}
          >
            <View
              className="h-full"
              style={{
                width: `${Math.max(2, (day / PLAN_DAYS) * 100)}%`,
                backgroundColor: t.accent.main,
              }}
            />
          </View>

          <Text
            className="text-[10px] tracking-[1.4px] font-semibold uppercase mt-4"
            style={{ fontFamily: t.ui.semibold, color: t.c.muted }}
          >
            Today
          </Text>
          <Text
            className="text-base mt-1"
            style={{ fontFamily: t.display.regular, color: t.c.text }}
          >
            {todayLabel}
          </Text>

          <Pressable
            onPress={beginToday}
            className="mt-4 py-3 rounded-2xl flex-row items-center justify-center gap-2"
            style={{ backgroundColor: t.accent.main }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ fontFamily: t.ui.semibold, color: t.accent.on }}
            >
              Begin today's reading
            </Text>
            <Ionicons name="arrow-forward" size={16} color={t.accent.on} />
          </Pressable>
        </Card>

        <View className="mt-7 px-1">
          <Text
            className="text-[10px] tracking-[1.8px] font-semibold uppercase"
            style={{ fontFamily: t.ui.semibold, color: t.c.muted }}
          >
            Reflection
          </Text>
          <Text
            className="text-base italic mt-2 leading-6"
            style={{ fontFamily: t.display.regular, color: t.c.body }}
          >
            "What does stillness mean to you today?"
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}