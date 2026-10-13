import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, EmptyState, IconCircle, Screen } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Note, useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';
import { NoteDraft, NoteEditor } from '@/components/core/NoteEditor';

export default function NotesScreen() {
  const t = useAppTheme();
  const { notes } = useLibrary();
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<NoteDraft>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter((n) =>
      [n.body, n.quote ?? '', n.bookName ?? ''].some((field) => field.toLowerCase().includes(q)),
    );
  }, [notes, query]);

  const edit = (note: Note) => {
    setDraft(note);
    setOpen(true);
  };

  const create = () => {
    setDraft(null);
    setOpen(true);
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <Text style={{ fontFamily: t.display.medium, fontSize: 32, color: t.c.text }}>Notes</Text>
        <IconCircle name="add" size={44} filled onPress={create} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginHorizontal: 20,
          marginTop: 16,
          paddingHorizontal: 14,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: t.c.border,
          backgroundColor: t.c.card,
        }}
      >
        <Ionicons name="search-outline" size={16} color={t.c.faint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes…"
          placeholderTextColor={t.c.placeholder}
          style={{ flex: 1, paddingVertical: 13, fontFamily: t.ui.regular, fontSize: 15, color: t.c.text }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: 20, gap: 12, flexGrow: 1 }}
        ListEmptyComponent={
          notes.length === 0 ? (
            <EmptyState
              icon="journal-outline"
              title="No reflections yet"
              body="Tap a verse while reading and choose “Reflect” — or start one here."
            />
          ) : (
            <EmptyState icon="search-outline" title="No matching notes" />
          )
        }
        renderItem={({ item }) => (
          <Card onPress={() => edit(item)} style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: t.ui.semibold, fontSize: 12, color: t.accent.main }}>
                {item.bookName && item.chapter
                  ? formatRef(item.bookName, item.chapter, item.verse)
                  : 'Reflection'}
              </Text>
              <Text style={{ fontFamily: t.ui.regular, fontSize: 11, color: t.c.faint }}>
                {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            {item.quote ? (
              <Text
                numberOfLines={2}
                style={{
                  ...t.reading.italic,
                  fontSize: t.reading.size(14),
                  lineHeight: t.reading.lh(14),
                  color: t.c.muted,
                  marginTop: 8,
                }}
              >
                {item.quote}
              </Text>
            ) : null}
            <Text
              numberOfLines={4}
              style={{
                fontFamily: t.reading.regular,
                fontSize: t.reading.size(15),
                lineHeight: t.reading.lh(15),
                color: t.c.body,
                marginTop: 8,
              }}
            >
              {item.body}
            </Text>
          </Card>
        )}
      />

      <NoteEditor visible={open} draft={draft} onClose={() => setOpen(false)} />
    </Screen>
  );
}
