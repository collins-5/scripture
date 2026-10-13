import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, SectionList, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { BookInfo, NEW_TESTAMENT, OLD_TESTAMENT } from '@/lib/bible/meta';

export function ChapterPicker({
  visible,
  onClose,
  onSelect,
  currentBook,
  currentChapter,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (book: string, chapter: number) => void;
  currentBook: string;
  currentChapter: number;
}) {
  const t = useAppTheme();
  const [picked, setPicked] = useState<BookInfo | null>(null);

  useEffect(() => {
    if (!visible) setPicked(null);
  }, [visible]);

  const sections = [
    { title: 'Old Testament', data: OLD_TESTAMENT },
    { title: 'New Testament', data: NEW_TESTAMENT },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose} tall>
      {picked ? (
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setPicked(null)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}
          >
            <Ionicons name="chevron-back" size={20} color={t.accent.main} />
            <Text style={{ fontFamily: t.display.medium, fontSize: 22, color: t.c.text }}>{picked.name}</Text>
          </Pressable>
          <FlatList
            data={Array.from({ length: picked.chapters }, (_, i) => i + 1)}
            keyExtractor={(n) => String(n)}
            numColumns={5}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
            renderItem={({ item }) => {
              const active = picked.id === currentBook && item === currentChapter;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(picked.id, item);
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    aspectRatio: 1,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? t.accent.main : t.c.card,
                    borderWidth: 1,
                    borderColor: active ? t.accent.main : t.c.border,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: t.ui.semibold,
                      fontSize: 16,
                      color: active ? t.accent.on : t.c.text,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(b) => b.id}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text
              style={{
                fontFamily: t.ui.semibold,
                fontSize: 11,
                letterSpacing: 1.5,
                color: t.c.muted,
                textTransform: 'uppercase',
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => {
            const active = item.id === currentBook;
            return (
              <Pressable
                onPress={() => setPicked(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 13,
                  borderBottomWidth: 1,
                  borderBottomColor: t.c.border,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: active ? t.ui.semibold : t.ui.medium,
                    fontSize: 16,
                    color: active ? t.accent.main : t.c.text,
                  }}
                >
                  {item.name}
                </Text>
                <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.faint, marginRight: 8 }}>
                  {item.chapters}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={t.c.faint} />
              </Pressable>
            );
          }}
        />
      )}
    </BottomSheet>
  );
}
