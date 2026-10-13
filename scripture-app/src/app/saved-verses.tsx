import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, EmptyState, Screen, ScreenHeader } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLibrary } from '@/hooks/use-library';
import { useTranslations } from '@/hooks/useVersions';
import { formatRef } from '@/lib/bible/meta';

export default function SavedVersesScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { saved, removeSaved } = useLibrary();
  const { label: versionLabel } = useTranslations();

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Saved verses" onBack={() => router.back()} />
      <FlatList
        data={saved}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No saved verses yet"
            body="Tap a verse while reading and choose the bookmark to keep it here."
          />
        }
        renderItem={({ item }) => (
          <Card
            onPress={() =>
              router.push({
                pathname: '/read',
                params: { book: item.book, chapter: String(item.chapter), verse: String(item.verse) },
              })
            }
            style={{ padding: 16 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: t.ui.semibold, fontSize: 12, color: t.accent.main }}>
                {formatRef(item.bookName, item.chapter, item.verse)} · {versionLabel(item.translation)}
              </Text>
              <Pressable onPress={() => removeSaved(item.id)} hitSlop={10}>
                <Ionicons name="trash-outline" size={18} color={t.c.faint} />
              </Pressable>
            </View>
            <Text
              style={{
                fontFamily: t.reading.regular,
                fontSize: t.reading.size(16),
                lineHeight: t.reading.lh(16),
                color: t.c.body,
                marginTop: 8,
              }}
            >
              {item.text}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}