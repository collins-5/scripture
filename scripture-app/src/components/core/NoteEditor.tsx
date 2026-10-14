import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { BottomSheet } from '@/components/core/ui';
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setBody(draft?.body ?? '');
  }, [visible, draft]);

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
      onClose();
    } catch (error: any) {
      Alert.alert('Could not save', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft?.id) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await deleteNote(draft.id);
      onClose();
    } catch (error: any) {
      Alert.alert('Could not delete', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Edit reflection' : 'New reflection'}
    >
      {reference ? (
        <View
          style={{
            borderLeftWidth: 3,
            borderLeftColor: t.accent.main,
            paddingLeft: 12,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontFamily: t.ui.semibold,
              fontSize: 12,
              color: t.accent.main,
              letterSpacing: 0.5,
            }}
          >
            {reference}
          </Text>
          {draft?.quote ? (
            <Text
              numberOfLines={4}
              style={[
                t.reading.italic,
                {
                  fontSize: 14,
                  lineHeight: 21,
                  color: t.c.muted,
                  marginTop: 4,
                },
              ]}
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
          maxHeight: 220,
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

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 8 }}>
        {editing ? (
          <Pressable
            onPress={remove}
            disabled={saving}
            style={{
              width: 100,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: t.c.danger,
              opacity: saving ? 0.4 : 1,
            }}
          >
            <Text
              style={{
                fontFamily: t.ui.semibold,
                fontSize: 15,
                color: t.c.danger,
              }}
            >
              Delete
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={!body.trim() || saving}
          style={{
            flex: 1,
            minHeight: 48,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.accent.main,
            opacity: !body.trim() || saving ? 0.4 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: t.ui.semibold,
              fontSize: 15,
              color: t.accent.on,
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}