import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  SheetDefinition,
  SheetManager,
  ScrollView,
} from 'react-native-actions-sheet';
import SafeAreaBottomSheet from '@/components/ui/safe-area-bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Note, useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';

export type NoteDraft = Partial<Note> | null;

interface NoteEditorProps {
  payload?: {
    draft: NoteDraft;
  };
}

const NoteEditor = ({ payload }: NoteEditorProps) => {
  const scrollViewRef = useRef<any>(null);
  const t = useAppTheme();
  const { saveNote, deleteNote } = useLibrary();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const draft = payload?.draft ?? null;

  useEffect(() => {
    setBody(draft?.body ?? '');
  }, [draft]);

  const editing = !!draft?.id;
  const reference =
    draft?.bookName && draft.chapter
      ? formatRef(draft.bookName, draft.chapter, draft.verse)
      : null;

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      await saveNote({ ...(draft ?? {}), body: trimmed });
      SheetManager.hide('note-editor');
    } catch (error: any) {
      Alert.alert('Could not save', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft?.id) {
      SheetManager.hide('note-editor');
      return;
    }
    setSaving(true);
    try {
      await deleteNote(draft.id);
      SheetManager.hide('note-editor');
    } catch (error: any) {
      Alert.alert('Could not delete', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaBottomSheet
      id="note-editor"
      title={editing ? 'Edit reflection' : 'New reflection'}
      showCloseButton
      onClose={() => SheetManager.hide('note-editor')}
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
        {reference ? (
          <View
            className="pl-3 mb-3.5"
            style={{ borderLeftWidth: 3, borderLeftColor: t.accent.main }}
          >
            <Text
              className="text-xs font-semibold tracking-wide"
              style={{ color: t.accent.main }}
            >
              {reference}
            </Text>
            {draft?.quote ? (
              <Text
                numberOfLines={4}
                className="text-sm mt-1"
                style={[t.reading.italic, { color: t.c.muted }]}
              >
                {draft.quote}
              </Text>
            ) : null}
          </View>
        ) : null}

        <Input
          value={body}
          onChangeText={setBody}
          placeholder="Write your reflection…"
          multiline
          autoFocus
          textAlignVertical="top"
        />

        <View className="flex-row gap-2.5 mt-4 mb-4">
          {editing ? (
            <Button
              onPress={remove}
              disabled={saving}
              variant="outline"
              className="w-[100px]"
              text="Delete"
            />
          ) : null}

          <Button
            onPress={submit}
            disabled={!body.trim() || saving}
            className="flex-1"
            text={saving ? 'Saving…' : 'Save'}
          />
        </View>
      </ScrollView>
    </SafeAreaBottomSheet>
  );
};

export type NoteEditorDefinition = SheetDefinition<{
  payload: {
    draft: NoteDraft;
  };
}>;

export default NoteEditor;