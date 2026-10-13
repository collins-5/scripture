import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { BottomSheet, PrimaryButton } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Note, useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';

export type NoteDraft = Partial<Note> | null;

export function NoteEditor({
  visible,
  draft,
  onClose,
}: {
  visible: boolean;
  draft: NoteDraft;
  onClose: () => void;
}) {
  const t = useAppTheme();
  const { saveNote, deleteNote } = useLibrary();
  const [body, setBody] = useState('');

  useEffect(() => {
    if (visible) setBody(draft?.body ?? '');
  }, [visible, draft]);

  const editing = !!draft?.id;
  const reference =
    draft?.bookName && draft.chapter ? formatRef(draft.bookName, draft.chapter, draft.verse) : null;

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    saveNote({ ...(draft ?? {}), body: trimmed });
    onClose();
  };

  const remove = () => {
    if (draft?.id) deleteNote(draft.id);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={editing ? 'Edit reflection' : 'New reflection'}>
      {reference ? (
        <View
          style={{
            borderLeftWidth: 3,
            borderLeftColor: t.accent.main,
            paddingLeft: 12,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontFamily: t.ui.semibold, fontSize: 12, color: t.accent.main, letterSpacing: 0.5 }}>
            {reference}
          </Text>
          {draft?.quote ? (
            <Text
              numberOfLines={4}
              style={{
                ...t.reading.italic,
                fontSize: 14,
                lineHeight: 21,
                color: t.c.muted,
                marginTop: 4,
              }}
            >
              {draft.quote}
            </Text>
          ) : null}
        </View>
      ) : null}
      <TextInput
        value={body}
        onChangeText={setBody}
        multiline
        autoFocus
        placeholder="Write your reflection…"
        placeholderTextColor={t.c.placeholder}
        textAlignVertical="top"
        style={{
          minHeight: 140,
          maxHeight: 260,
          borderWidth: 1,
          borderColor: t.c.border,
          backgroundColor: t.c.card,
          borderRadius: 14,
          padding: 14,
          fontFamily: t.reading.regular,
          fontSize: t.reading.size(16),
          lineHeight: t.reading.lh(16),
          color: t.c.text,
        }}
      />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        {editing ? <PrimaryButton label="Delete" danger onPress={remove} /> : null}
        <PrimaryButton label="Save" flex disabled={!body.trim()} onPress={submit} />
      </View>
    </BottomSheet>
  );
}
