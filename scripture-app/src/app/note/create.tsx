import React, { useRef, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
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

const RichTextEditorMemo = React.memo(RichTextEditor);

export default function CreateNotePage() {
  const t = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    book?: string;
    bookName?: string;
    chapter?: string;
    verse?: string;
    quote?: string;
  }>();

  const { saveNote } = useLibrary();
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<RichTextEditorRef>(null);

  const book = params.book as string | undefined;
  const bookName = params.bookName as string | undefined;
  const chapter = params.chapter ? Number(params.chapter) : undefined;
  const verse = params.verse ? Number(params.verse) : undefined;
  const quote = params.quote as string | undefined;

  const reference =
    bookName && chapter ? formatRef(bookName, chapter, verse) : null;

  const submit = async () => {
    console.log('[Submit] A: pressed, saving:', saving, 'ref:', !!editorRef.current);
    if (saving || !editorRef.current) return;

    try {
      console.log('[Submit] B: about to getHTML');
      const html = await editorRef.current.getHTML();
      console.log('[Submit] C: html:', JSON.stringify(html));

      const trimmed = html?.trim();
      console.log('[Submit] D: trimmed:', JSON.stringify(trimmed));

      if (!trimmed || trimmed === '<p></p>') {
        console.log('[Submit] E: empty, returning early');
        Alert.alert('Nothing to save', 'Write something first.');
        return;
      }

      setSaving(true);
      await saveNote({
        book,
        bookName,
        chapter,
        verse,
        quote,
        body: trimmed,
      });
      router.back();
    } catch (error: any) {
      console.log('[Submit] error:', error);
      Alert.alert('Could not save', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
          New reflection
        </Text>
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
          {quote ? (
            <Text
              numberOfLines={6}
              className="mt-1.5"
              style={[
                t.reading.italic,
                { fontSize: 14, lineHeight: 21, color: t.c.muted },
              ]}
            >
              {quote}
            </Text>
          ) : null}
        </View>
      ) : null}

      <RichTextEditorMemo
        ref={editorRef}
        initialContent=""
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      />

      <View
        className="flex-row px-5 py-3 border-t"
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