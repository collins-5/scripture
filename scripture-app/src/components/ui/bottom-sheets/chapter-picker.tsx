import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, SectionList, Text, View } from 'react-native';
import {
  SheetDefinition,
  SheetManager,
  ScrollView,
} from 'react-native-actions-sheet';
import SafeAreaBottomSheet from '@/components/ui/safe-area-bottom-sheet';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BookInfo, NEW_TESTAMENT, OLD_TESTAMENT } from '@/lib/bible/meta';
import { cn } from '@/lib/utils';

interface ChapterPickerProps {
  payload?: {
    currentBook: string;
    currentChapter: number;
    onSelect: (book: string, chapter: number) => void;
  };
}

const ChapterPicker = ({ payload }: ChapterPickerProps) => {
  const scrollViewRef = useRef<any>(null);
  const { brand, text, surface, border } = useThemeColors();
  const [picked, setPicked] = useState<BookInfo | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setPicked(null);
    setQuery('');
  }, [payload]);

  const currentBook = payload?.currentBook ?? '';
  const currentChapter = payload?.currentChapter ?? 1;

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filterBooks = (books: BookInfo[]) => {
      if (!q) return books;
      return books.filter((b) =>
        [b.name, b.id, (b as any).abbr ?? '']
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q)),
      );
    };

    const old = filterBooks(OLD_TESTAMENT);
    const nt = filterBooks(NEW_TESTAMENT);

    return [
      { title: 'Old Testament', data: old },
      { title: 'New Testament', data: nt },
    ].filter((s) => s.data.length > 0);
  }, [query]);

  const chapterNumbers = useMemo(() => {
    if (!picked) return [];
    const q = query.trim();
    const all = Array.from({ length: picked.chapters }, (_, i) => i + 1);
    if (!q) return all;
    return all.filter((n) => String(n).includes(q));
  }, [picked, query]);

  return (
    <SafeAreaBottomSheet
      id="chapter-picker"
      title={picked ? picked.name : 'Choose a book'}
      subtitle={picked ? `${picked.chapters} chapters` : undefined}
      icon={
        <Icon
          name="book"
          size={22}
          color={brand.primary}
        />
      }
      iconBgColor={`${brand.primary}18`}
      showCloseButton
      onClose={() => SheetManager.hide('chapter-picker')}
      keyboardHandlerEnabled
      avoidKeyboard
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        style={{ maxHeight: '90%' }}
      >
        {picked ? (
          <View>
            <Pressable
              onPress={() => {
                setPicked(null);
                setQuery('');
              }}
              className="flex-row items-center gap-1.5 mb-3"
            >
              <Icon name="chevron-left" size={20} color={brand.primary} />
              <Text
                className="text-sm font-medium"
                style={{ color: brand.primary }}
              >
                All books
              </Text>
            </Pressable>

            {chapterNumbers.length === 0 ? (
              <Text
                className="text-sm py-5"
                style={{ color: text.muted }}
              >
                No chapters match.
              </Text>
            ) : (
              <FlatList
                data={chapterNumbers}
                keyExtractor={(n) => String(n)}
                numColumns={5}
                columnWrapperStyle={{ gap: 10 }}
                contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const active =
                    picked.id === currentBook && item === currentChapter;
                  return (
                    <Pressable
                      onPress={() => {
                        payload?.onSelect(picked.id, item);
                        SheetManager.hide('chapter-picker');
                      }}
                      className="flex-1 aspect-square rounded-2xl h-12 items-center justify-center border"
                      style={{
                        backgroundColor: active ? brand.primary : surface.card,
                        borderColor: active ? brand.primary : border.medium,
                      }}
                    >
                      <Text
                        className="text-base font-semibold"
                        style={{ color: active ? '#FFFFFF' : text.dark }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        ) : (
          <View>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Search books"
              leftIcon={<Icon name="magnify" size={18} color={text.muted} />}
              autoCorrect={false}
              autoCapitalize="none"
              containerClassName="mb-3"
            />

            {sections.length === 0 ? (
              <Text
                className="text-sm py-5"
                style={{ color: text.muted }}
              >
                No books match.
              </Text>
            ) : (
              <SectionList
                sections={sections}
                keyExtractor={(b) => b.id}
                stickySectionHeadersEnabled={false}
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled"
                renderSectionHeader={({ section }) => (
                  <Text
                    className="text-[12px] font-semibold uppercase tracking-[1.5px] mt-3 mb-1.5"
                    style={{ color: text.muted }}
                  >
                    {section.title}
                  </Text>
                )}
                renderItem={({ item }) => {
                  const active = item.id === currentBook;
                  return (
                    <Pressable
                      onPress={() => {
                        setPicked(item);
                        setQuery('');
                      }}
                      className="flex-row items-center py-4 border-b"
                      style={{ borderBottomColor: border.medium }}
                    >
                      <Text
                        className={cn(
                          'flex-1 text-base',
                          active ? 'font-semibold' : 'font-medium',
                        )}
                        style={{ color: active ? brand.primary : text.dark }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className="text-xs mr-2"
                        style={{ color: text.placeholder }}
                      >
                        {item.chapters}
                      </Text>
                      <Icon
                        name="chevron-right"
                        size={16}
                        color={text.placeholder}
                      />
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaBottomSheet>
  );
};

export type ChapterPickerDefinition = SheetDefinition<{
  payload: {
    currentBook: string;
    currentChapter: number;
    onSelect: (book: string, chapter: number) => void;
  };
}>;

export default ChapterPicker;