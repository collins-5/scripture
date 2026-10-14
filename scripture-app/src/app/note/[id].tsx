import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';
import {
  RichTextEditor,
  RichTextEditorRef,
} from '@/components/core/rich-text-editor';

export default function NotePage() {
  const t = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const isNew = !params.id || params.id === 'new';

  const { notes, notesLoading, refreshNotes, saveNote, deleteNote } = useLibrary();
  const existing = isNew ? null : notes.find((n) => n.id === params.id) ?? null;

  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const editorRef = useRef<RichTextEditorRef>(null);

  useEffect(() => {
    if (isNew) {
      setLoaded(true);
      return;
    }
    if (existing) {
      setBody(existing.body);
      setNotFound(false);
      setLoaded(true);
      return;
    }
    if (notes.length === 0 && !notesLoading) {
      refreshNotes();
    } else if (!notesLoading) {
      setNotFound(true);
    }
  }, [isNew, existing, notes.length, notesLoading, refreshNotes]);

  useEffect(() => {
    if (loaded && existing?.body && editorRef.current) {
      editorRef.current.setContent(existing.body);
    }
  }, [loaded, existing?.body]);

  const reference =
    existing?.bookName && existing.chapter
      ? formatRef(existing.bookName, existing.chapter, existing.verse)
      : null;

  const submit = async () => {
    if (saving || !editorRef.current) return;

    try {
      const html = await editorRef.current.getHTML();
      const trimmed = html?.trim();

      if (!trimmed || trimmed === '<p></p>') return;

      setSaving(true);
      await saveNote({ ...(existing ?? {}), body: trimmed });
      router.back();
    } catch (error: any) {
      Alert.alert('Could not save', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing?.id) {
      router.back();
      return;
    }
    setSaving(true);
    try {
      await deleteNote(existing.id);
      router.back();
    } catch (error: any) {
      Alert.alert('Could not delete', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete reflection?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: remove },
    ]);
  };

  if (!isNew && notesLoading && !existing) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={t.accent.main} />
        </View>
      </Screen>
    );
  }

  if (notFound) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-8">
          <Text
            className="text-base text-center"
            style={{ fontFamily: t.ui.regular, color: t.c.muted }}
          >
            This reflection could not be found.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 px-5 py-3 rounded-full"
            style={{ backgroundColor: t.accent.main }}
          >
            <Text
              className="font-semibold"
              style={{ fontFamily: t.ui.semibold, color: t.accent.on }}
            >
              Go back
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View
        className="flex-row items-center px-3 py-2.5 border-b"
        style={{ borderBottomColor: t.c.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10} className="p-2">
          <Ionicons name="chevron-back" size={22} color={t.c.text} />
        </Pressable>
        <Text
          className="flex-1 text-lg ml-1"
          style={{ fontFamily: t.display.medium, color: t.c.text }}
        >
          {isNew ? 'New reflection' : 'Edit reflection'}
        </Text>
        {!isNew ? (
          <Pressable onPress={confirmDelete} hitSlop={10} className="p-2">
            <Ionicons name="trash-outline" size={20} color={t.c.danger} />
          </Pressable>
        ) : null}
      </View>

      {reference ? (
        <View
          className="pl-3 mx-5 mt-4 mb-2 border-l-2"
          style={{ borderLeftColor: t.accent.main }}
        >
          <Text
            className="text-xs font-semibold tracking-wide"
            style={{ fontFamily: t.ui.semibold, color: t.accent.main }}
          >
            {reference}
          </Text>
          {existing?.quote ? (
            <Text
              numberOfLines={6}
              className="mt-1.5"
              style={[
                t.reading.italic,
                { fontSize: 14, lineHeight: 21, color: t.c.muted },
              ]}
            >
              {existing.quote}
            </Text>
          ) : null}
        </View>
      ) : null}

      <RichTextEditor
        ref={editorRef}
        initialContent={existing?.body ?? ''}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      />

      <View
        className="flex-row gap-2.5 px-5 py-3 border-t"
        style={{ borderTopColor: t.c.border, backgroundColor: t.c.bg }}
      >
        <Pressable
          onPress={submit}
          disabled={saving}
          className="flex-1 min-h-[48px] rounded-2xl items-center justify-center"
          style={{
            backgroundColor: t.accent.main,
            opacity: saving ? 0.4 : 1,
          }}
        >
          <Text
            className="text-[15px] font-semibold"
            style={{ fontFamily: t.ui.semibold, color: t.accent.on }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}