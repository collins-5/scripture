import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLibrary } from '@/hooks/use-library';
import { formatRef } from '@/lib/bible/meta';

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
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const book = params.book as string | undefined;
  const bookName = params.bookName as string | undefined;
  const chapter = params.chapter ? Number(params.chapter) : undefined;
  const verse = params.verse ? Number(params.verse) : undefined;
  const quote = params.quote as string | undefined;

  const reference =
    bookName && chapter ? formatRef(bookName, chapter, verse) : null;

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 py-5"
          keyboardShouldPersistTaps="handled"
        >
          {reference ? (
            <View
              className="pl-3 mb-5 border-l-2"
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
                    {
                      fontSize: 14,
                      lineHeight: 21,
                      color: t.c.muted,
                    },
                  ]}
                >
                  {quote}
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
            className="min-h-[240px] rounded-2xl border p-4"
            style={{
              borderColor: t.c.border,
              backgroundColor: t.c.card,
              fontFamily: t.reading.regular,
              fontSize: t.reading.size(16),
              lineHeight: t.reading.lh(16),
              color: t.c.text,
            }}
          />
        </ScrollView>

        <View
          className="flex-row gap-2.5 px-5 py-3 border-t"
          style={{ borderTopColor: t.c.border, backgroundColor: t.c.bg }}
        >
          <Pressable
            onPress={submit}
            disabled={!body.trim() || saving}
            className="flex-1 min-h-[48px] rounded-2xl items-center justify-center"
            style={{
              backgroundColor: t.accent.main,
              opacity: !body.trim() || saving ? 0.4 : 1,
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
      </KeyboardAvoidingView>
    </Screen>
  );
}