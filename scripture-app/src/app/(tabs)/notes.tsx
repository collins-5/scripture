import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, EmptyState, Screen } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Note, useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';
import { relativeTime } from '@/lib/utils/date';
import { stripHtml } from '@/lib/utils/html';
import { useRouter } from 'expo-router';

export default function NotesScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { notes, notesLoading, refreshNotes, deleteNote } = useLibrary();
  const [query, setQuery] = useState('');

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter((n) => {
      const body = stripHtml(n.body);
      return [body, n.quote ?? '', n.bookName ?? ''].some((field) =>
        field.toLowerCase().includes(q)
      );
    });
  }, [notes, query]);

  const edit = (note: Note) => {
    router.push({ pathname: '/note/[id]', params: { id: String(note.id) } });
  };

  const create = () => {
    router.push('/note/create');
  };

  const confirmDelete = (note: Note) => {
    Alert.alert('Delete reflection?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(note.id);
          } catch (e: any) {
            Alert.alert('Could not delete', e?.message ?? 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-5 pt-5 pb-2">
        <Text
          className="text-3xl"
          style={{ fontFamily: t.display.medium, color: t.c.text }}
        >
          Notes
        </Text>
        <Pressable
          onPress={create}
          hitSlop={8}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: t.accent.main }}
        >
          <Ionicons name="add" size={22} color={t.accent.on} />
        </Pressable>
      </View>

      <View className="mx-5 mt-4">
        <View
          className="flex-row items-center px-4 rounded-2xl border"
          style={{
            height: 48,
            borderColor: t.c.border,
            backgroundColor: t.c.card,
          }}
        >
          <Ionicons name="search-outline" size={18} color={t.c.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes…"
            placeholderTextColor={t.c.placeholder}
            className="flex-1 ml-2 text-[15px]"
            style={{
              fontFamily: t.ui.regular,
              color: t.c.text,
              paddingVertical: 0,
            }}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={t.c.faint} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(n) => String(n.id)}
        contentContainerClassName="p-5 gap-3"
        style={{ flexGrow: 1 }}
        ListEmptyComponent={
          notesLoading ? (
            <EmptyState icon="hourglass-outline" title="Loading reflections…" />
          ) : notes.length === 0 ? (
            <EmptyState
              icon="journal-outline"
              title="No reflections yet"
              body="Tap the + button to start one, or tap a verse while reading."
            />
          ) : (
            <EmptyState icon="search-outline" title="No matching notes" />
          )
        }
        renderItem={({ item }) => {
          const preview = stripHtml(item.body);
          const hasRef = !!(item.bookName && item.chapter);
          const refLabel = hasRef
            ? formatRef(item.bookName!, item.chapter!, item.verse)
            : 'Reflection';

          return (
            <Card onPress={() => edit(item)} className="p-4">
              <View className="flex-row items-center justify-between">
                <View
                  className="flex-row items-center px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: hasRef
                      ? `${t.accent.main}18`
                      : `${t.c.border}80`,
                  }}
                >
                  <Ionicons
                    name={hasRef ? 'book-outline' : 'create-outline'}
                    size={11}
                    color={hasRef ? t.accent.main : t.c.muted}
                  />
                  <Text
                    className="ml-1 text-[11px] font-semibold"
                    style={{
                      fontFamily: t.ui.semibold,
                      color: hasRef ? t.accent.main : t.c.muted,
                      letterSpacing: 0.3,
                    }}
                  >
                    {refLabel}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text
                    className="text-[11px]"
                    style={{ fontFamily: t.ui.regular, color: t.c.faint }}
                  >
                    {relativeTime(item.updatedAt)}
                  </Text>
                  <Pressable
                    onPress={() => confirmDelete(item)}
                    hitSlop={10}
                    className="ml-3"
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={16}
                      color={t.c.faint}
                    />
                  </Pressable>
                </View>
              </View>

              {item.quote ? (
                <View
                  className="mt-3 pl-2.5 border-l-2"
                  style={{ borderLeftColor: `${t.accent.main}55` }}
                >
                  <Text
                    numberOfLines={2}
                    style={[
                      t.reading.italic,
                      {
                        fontSize: t.reading.size(13),
                        lineHeight: t.reading.lh(13),
                      },
                      { color: t.c.muted },
                    ]}
                  >
                    {item.quote}
                  </Text>
                </View>
              ) : null}

              {preview.length > 0 ? (
                <Text
                  numberOfLines={4}
                  className="mt-3"
                  style={{
                    fontFamily: t.reading.regular,
                    fontSize: t.reading.size(15),
                    lineHeight: t.reading.lh(15),
                    color: t.c.body,
                  }}
                >
                  {preview}
                </Text>
              ) : (
                <Text
                  className="mt-3"
                  style={[
                    t.reading.italic,
                    {
                      fontSize: t.reading.size(14),
                      color: t.c.faint,
                    },
                  ]}
                >
                  Empty reflection
                </Text>
              )}
            </Card>
          );
        }}
      />
    </Screen>
  );
}