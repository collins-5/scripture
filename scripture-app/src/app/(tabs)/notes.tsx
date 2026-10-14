import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, EmptyState, Screen } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Note, useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';
import { useRouter } from 'expo-router';

export default function NotesScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { notes, notesLoading, refreshNotes } = useLibrary();
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('[Notes] MOUNT');
    refreshNotes();
  }, [refreshNotes]);

  useEffect(() => {
    console.log('[Notes] notes updated', { count: notes.length });
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter((n) =>
      [n.body, n.quote ?? '', n.bookName ?? ''].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [notes, query]);

  const edit = (note: Note) => {
    console.log('[Notes] tap edit', { id: note.id });
    router.push({ pathname: '/note/[id]', params: { id: String(note.id) } });
  };

  const create = () => {
    console.log('[Notes] tap create');
    router.push('/note/create');
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
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
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
        renderItem={({ item }) => (
          <Card onPress={() => edit(item)} className="p-4">
            <View className="flex-row justify-between items-center">
              <Text
                className="text-xs font-semibold"
                style={{ fontFamily: t.ui.semibold, color: t.accent.main }}
              >
                {item.bookName && item.chapter
                  ? formatRef(item.bookName, item.chapter, item.verse)
                  : 'Reflection'}
              </Text>
              <Text
                className="text-[11px]"
                style={{ fontFamily: t.ui.regular, color: t.c.faint }}
              >
                {new Date(item.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            {item.quote ? (
              <Text
                numberOfLines={2}
                className="mt-2"
                style={[
                  t.reading.italic,
                  {
                    fontSize: t.reading.size(14),
                    lineHeight: t.reading.lh(14),
                    color: t.c.muted,
                  },
                ]}
              >
                {item.quote}
              </Text>
            ) : null}
            <Text
              numberOfLines={4}
              className="mt-2"
              style={{
                fontFamily: t.reading.regular,
                fontSize: t.reading.size(15),
                lineHeight: t.reading.lh(15),
                color: t.c.body,
              }}
            >
              {item.body}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}