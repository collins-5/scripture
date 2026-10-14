import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetManager } from 'react-native-actions-sheet';
import { Screen } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLibrary } from '@/hooks/use-library';
import { useSettings } from '@/hooks/use-settings';
import { useScripture } from '@/hooks/useScripture';
import { useTranslations } from '@/hooks/useVersions';
import { BOOK_MAP, formatRef, stepChapter } from '@/lib/bible/meta';
import { ChapterBlock, VerseBlock, chapterBlocks } from '@/lib/bible/text';
import { ReadingSkeleton } from '@/components/core/ReadingSkeleton';

type Paragraph = { key: string; heading?: string; verses: VerseBlock[] };

const TAB_BAR_HEIGHT = 62;
const TAB_BAR_GAP = 12;

function toParagraphs(blocks: ChapterBlock[]): Paragraph[] {
  const out: Paragraph[] = [];
  blocks.forEach((block) => {
    if (block.type === 'heading') {
      out.push({ key: block.key, heading: block.text, verses: [] });
      return;
    }
    let last = out[out.length - 1];
    if (!last) {
      last = { key: `p-${block.key}`, verses: [] };
      out.push(last);
    }
    last.verses.push(block);
  });
  return out;
}

export default function ReadScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    book?: string;
    chapter?: string;
    verse?: string;
  }>();
  const { settings, update } = useSettings();
  const { lastRead, setLastRead, markReadToday, toggleSaved, isSaved } =
    useLibrary();
  const { label: versionLabel } = useTranslations();

  const [book, setBook] = useState<string>(() =>
    params.book && BOOK_MAP[params.book] ? params.book : lastRead?.book ?? 'JHN',
  );
  const [chapter, setChapter] = useState<number>(() =>
    params.book && BOOK_MAP[params.book]
      ? Number(params.chapter) || 1
      : lastRead?.chapter ?? 3,
  );
  const [highlight, setHighlight] = useState<number | null>(
    params.verse ? Number(params.verse) : null,
  );
  const [selected, setSelected] = useState<VerseBlock | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const lastWrite = useRef(0);

  const tabBarSpace =
    Math.max(insets.bottom, TAB_BAR_GAP) + TAB_BAR_HEIGHT + 16;
  const bottomBarSpace = Math.max(insets.bottom, 12) + 76;

  useEffect(() => {
    if (params.book && BOOK_MAP[params.book]) {
      setBook(params.book);
      setChapter(Number(params.chapter) || 1);
      setHighlight(params.verse ? Number(params.verse) : null);
      setSelected(null);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [params.book, params.chapter, params.verse]);

  const bookInfo = BOOK_MAP[book] ?? BOOK_MAP.JHN;
  const { data, isLoading, isError, refetch } = useScripture(
    settings.translation,
    book,
    String(chapter),
  );

  const paragraphs = useMemo(
    () => toParagraphs(chapterBlocks(data?.chapterContent ?? [])),
    [data],
  );

  useEffect(() => {
    if (!data) return;
    markReadToday();
    setLastRead({ book, chapter, progress: 0 });
  }, [data, book, chapter, markReadToday, setLastRead]);

  const report = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>, force: boolean) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      if (contentSize.height <= 0) return;
      const now = Date.now();
      if (!force && now - lastWrite.current < 1200) return;
      lastWrite.current = now;
      const progress = Math.min(
        1,
        (contentOffset.y + layoutMeasurement.height) / contentSize.height,
      );
      setLastRead({ book, chapter, progress });
    },
    [book, chapter, setLastRead],
  );

  const go = (target: { book: string; chapter: number } | null) => {
    if (!target) return;
    setBook(target.book);
    setChapter(target.chapter);
    setSelected(null);
    setHighlight(null);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const prev = stepChapter(book, chapter, -1);
  const next = stepChapter(book, chapter, 1);

  const activeVerse = selected?.number ?? highlight;
  const saved = selected
    ? isSaved(book, chapter, selected.number, settings.translation)
    : false;

  const openChapterPicker = () => {
    SheetManager.show('chapter-picker', {
      payload: {
        currentBook: book,
        currentChapter: chapter,
        onSelect: (b, c) => go({ book: b, chapter: c }),
      },
    });
  };

  const openVersionSheet = () => {
    SheetManager.show('version-sheet', {
      payload: {
        value: settings.translation,
        onSelect: (value) => update({ translation: value }),
      },
    });
  };

  const reflect = () => {
    if (!selected) return;
    SheetManager.show('note-editor', {
      payload: {
        draft: {
          book,
          bookName: bookInfo.name,
          chapter,
          verse: selected.number,
          quote: selected.text,
          body: '',
        },
      },
    });
  };

  const share = () => {
    if (!selected) return;
    Share.share({
      message: `“${selected.text}” — ${formatRef(
        bookInfo.name,
        chapter,
        selected.number,
      )} (${versionLabel(settings.translation)})`,
    });
  };

  const bookmark = () => {
    if (!selected) return;
    toggleSaved({
      book,
      bookName: bookInfo.name,
      chapter,
      verse: selected.number,
      text: selected.text,
      translation: settings.translation,
    });
  };

  const bodySize = 19;

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: t.c.border,
        }}
      >
        <Pressable
          onPress={openChapterPicker}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}
        >
          <Text
            style={{
              fontFamily: t.display.medium,
              fontSize: 18,
              color: t.c.text,
            }}
          >
            {bookInfo.name} {chapter}
          </Text>
          <Ionicons name="chevron-down" size={14} color={t.c.muted} />
        </Pressable>
        <Pressable
          onPress={openVersionSheet}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginRight: 16,
          }}
        >
          <Text
            style={{
              fontFamily: t.ui.semibold,
              fontSize: 12,
              color: t.c.muted,
              letterSpacing: 0.5,
            }}
          >
            {versionLabel(settings.translation)}
          </Text>
          <Ionicons name="chevron-down" size={14} color={t.c.muted} />
        </Pressable>
        <Pressable onPress={() => router.push('/reading-fonts')} hitSlop={10}>
          <Ionicons name="text-outline" size={20} color={t.c.muted} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={200}
        onScroll={(e) => report(e, false)}
        onScrollEndDrag={(e) => report(e, true)}
        onMomentumScrollEnd={(e) => report(e, true)}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: selected ? bottomBarSpace : tabBarSpace,
        }}
      >
        <View
          style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 20 }}
        >
          <Text
            style={{
              fontFamily: t.ui.medium,
              fontSize: 11,
              letterSpacing: 2,
              color: t.c.muted,
            }}
          >
            {bookInfo.name.toUpperCase()}
          </Text>
          <Text
            style={{
              fontFamily: t.display.regular,
              fontSize: 60,
              lineHeight: 70,
              color: t.accent.main,
            }}
          >
            {chapter}
          </Text>
          <View
            style={{
              width: 28,
              height: 2,
              backgroundColor: t.accent.main,
              marginTop: 4,
            }}
          />
        </View>

        {isLoading ? (
          <ReadingSkeleton />
        ) : isError ? (
          <View style={{ alignItems: 'center', marginTop: 48, gap: 14 }}>
            <Text
              style={{
                fontFamily: t.ui.regular,
                fontSize: 14,
                color: t.c.danger,
              }}
            >
              This chapter could not be loaded.
            </Text>
            <Pressable
              onPress={() => refetch()}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: t.accent.main,
              }}
            >
              <Text style={{ fontFamily: t.ui.semibold, color: t.accent.on }}>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : (
          paragraphs.map((para) => (
            <View key={para.key} style={{ marginBottom: 16 }}>
              {para.heading ? (
                <Text
                  style={{
                    fontFamily: t.display.semibold,
                    fontSize: t.reading.size(15),
                    color: t.c.text,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {para.heading}
                </Text>
              ) : null}
              {para.verses.length > 0 ? (
                <Text
                  style={{
                    fontFamily: t.reading.regular,
                    fontSize: t.reading.size(bodySize),
                    lineHeight: t.reading.lh(bodySize),
                    color: t.c.body,
                  }}
                >
                  {para.verses.map((verse) => (
                    <Text
                      key={verse.key}
                      onPress={() =>
                        setSelected(
                          selected?.number === verse.number ? null : verse,
                        )
                      }
                      style={
                        activeVerse === verse.number
                          ? { backgroundColor: t.accent.soft }
                          : undefined
                      }
                    >
                      {verse.number > 1 ? (
                        <Text
                          style={{
                            fontFamily: t.ui.semibold,
                            fontSize: t.reading.size(10),
                            color: t.accent.main,
                          }}
                        >
                          {verse.number}{' '}
                        </Text>
                      ) : null}
                      {verse.segments.map((segment, index) => (
                        <Text
                          key={index}
                          style={
                            segment.jesus && settings.redLetters
                              ? { color: t.c.jesus }
                              : undefined
                          }
                        >
                          {segment.text}
                        </Text>
                      ))}{' '}
                    </Text>
                  ))}
                </Text>
              ) : null}
            </View>
          ))
        )}

        {!isLoading && !isError ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 24,
            }}
          >
            <Pressable
              disabled={!prev}
              onPress={() => go(prev)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: t.c.border,
                backgroundColor: t.c.card,
                opacity: prev ? 1 : 0.35,
              }}
            >
              <Ionicons name="chevron-back" size={16} color={t.c.text} />
              <Text
                style={{
                  fontFamily: t.ui.medium,
                  fontSize: 13,
                  color: t.c.text,
                }}
              >
                Previous
              </Text>
            </Pressable>
            <Pressable
              disabled={!next}
              onPress={() => go(next)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 999,
                backgroundColor: t.accent.main,
                opacity: next ? 1 : 0.35,
              }}
            >
              <Text
                style={{
                  fontFamily: t.ui.semibold,
                  fontSize: 13,
                  color: t.accent.on,
                }}
              >
                Next
              </Text>
              <Ionicons name="chevron-forward" size={16} color={t.accent.on} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {selected ? (
        <View
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: Math.max(insets.bottom, TAB_BAR_GAP) + TAB_BAR_HEIGHT + 12,
            backgroundColor: t.c.sheet,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: t.c.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontFamily: t.ui.semibold,
              fontSize: 13,
              color: t.c.text,
            }}
          >
            {formatRef(bookInfo.name, chapter, selected.number)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <Pressable onPress={reflect} hitSlop={8}>
              <Ionicons name="create-outline" size={22} color={t.c.text} />
            </Pressable>
            <Pressable onPress={bookmark} hitSlop={8}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={saved ? t.accent.main : t.c.text}
              />
            </Pressable>
            <Pressable onPress={share} hitSlop={8}>
              <Ionicons name="share-outline" size={22} color={t.c.text} />
            </Pressable>
            <Pressable onPress={() => setSelected(null)} hitSlop={8}>
              <Ionicons name="close" size={22} color={t.c.muted} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}