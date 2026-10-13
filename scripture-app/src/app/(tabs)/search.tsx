import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, Chip, EmptyState, Screen, SectionLabel } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSettings } from '@/hooks/use-settings';
import { Scope, useDebounced, useKeywordSearch } from '@/hooks/use-keyword-search';
import { formatRef, parseReference } from '@/lib/bible/meta';

const TRENDING = ['love', 'light', 'shepherd', 'spirit', 'grace'];

const SCOPES: { key: Scope; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'OT', label: 'Old Testament' },
  { key: 'NT', label: 'New Testament' },
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function SearchScreen() {
  const t = useAppTheme();
  const router = useRouter();
  const { settings } = useSettings();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('all');

  const reference = useMemo(() => parseReference(query), [query]);
  const keywordQuery = useDebounced(reference?.chapter ? '' : query, 450);
  const search = useKeywordSearch(keywordQuery, scope, settings.translation);

  const trimmed = query.trim();
  const terms = useMemo(
    () => trimmed.toLowerCase().split(/\s+/).filter((w) => w.length > 0),
    [trimmed],
  );
  const matcher = useMemo(
    () => (terms.length ? new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi') : null),
    [terms],
  );

  const open = (book: string, chapter: number, verse?: number) =>
    router.push({
      pathname: '/read',
      params: { book, chapter: String(chapter), ...(verse ? { verse: String(verse) } : {}) },
    });

  const renderHighlighted = (text: string) => {
    if (!matcher) return text;
    return text.split(matcher).map((part, index) =>
      index % 2 === 1 ? (
        <Text key={index} style={{ backgroundColor: t.accent.soft, color: t.c.text, fontFamily: t.ui.semibold }}>
          {part}
        </Text>
      ) : (
        part
      ),
    );
  };

  const showKeyword = trimmed.length >= 3 && !reference?.chapter;

  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
      >
        <Text style={{ fontFamily: t.display.medium, fontSize: 32, color: t.c.text }}>Search</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
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
            placeholder="Search the Scriptures…"
            placeholderTextColor={t.c.placeholder}
            autoCorrect={false}
            returnKeyType="search"
            style={{
              flex: 1,
              paddingVertical: 14,
              fontFamily: t.ui.regular,
              fontSize: 15,
              color: t.c.text,
            }}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={t.c.faint} />
            </Pressable>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {SCOPES.map((s) => (
            <Chip key={s.key} label={s.label} active={scope === s.key} onPress={() => setScope(s.key)} />
          ))}
        </View>

        {!trimmed ? (
          <>
            <SectionLabel>Trending</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {TRENDING.map((word) => (
                <Chip key={word} label={word} serif onPress={() => setQuery(word)} />
              ))}
            </View>
            <EmptyState icon="search-outline" title="“Seek, and ye shall find.”" />
          </>
        ) : (
          <View style={{ marginTop: 20, gap: 10 }}>
            {reference ? (
              <Card
                onPress={() =>
                  open(reference.book.id, reference.chapter ?? 1, reference.verse)
                }
                style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}
              >
                <Ionicons name="book-outline" size={20} color={t.accent.main} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: t.display.medium, fontSize: 18, color: t.c.text }}>
                    {reference.chapter
                      ? formatRef(reference.book.name, reference.chapter, reference.verse)
                      : reference.book.name}
                  </Text>
                  <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted, marginTop: 2 }}>
                    Open passage
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={t.c.faint} />
              </Card>
            ) : null}

            {showKeyword
              ? search.hits.map((hit) => (
                  <Card
                    key={hit.id}
                    onPress={() => open(hit.book.id, hit.chapter, hit.verse)}
                    style={{ padding: 16 }}
                  >
                    <Text style={{ fontFamily: t.ui.semibold, fontSize: 12, color: t.accent.main }}>
                      {formatRef(hit.book.name, hit.chapter, hit.verse)}
                    </Text>
                    <Text
                      style={{
                        fontFamily: t.reading.regular,
                        fontSize: t.reading.size(15),
                        lineHeight: t.reading.lh(15),
                        color: t.c.body,
                        marginTop: 6,
                      }}
                    >
                      {renderHighlighted(hit.text)}
                    </Text>
                  </Card>
                ))
              : null}

            {showKeyword && search.running ? (
              <View style={{ alignItems: 'center', paddingVertical: 20, gap: 8 }}>
                <ActivityIndicator color={t.accent.main} />
                <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted }}>
                  Searched {search.scanned} of {search.total} chapters
                </Text>
              </View>
            ) : null}

            {showKeyword && search.canLoadMore ? (
              <Pressable
                onPress={search.loadMore}
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: t.accent.main,
                }}
              >
                <Text style={{ fontFamily: t.ui.semibold, fontSize: 13, color: t.accent.main }}>
                  Show more results
                </Text>
              </Pressable>
            ) : null}

            {showKeyword && !search.running && search.hits.length === 0 && keywordQuery === query ? (
              <EmptyState icon="search-outline" title="No verses found" body={`Nothing matched “${trimmed}”.`} />
            ) : null}

            {!showKeyword && !reference ? (
              <EmptyState icon="search-outline" title="Keep typing" body="Enter at least three letters." />
            ) : null}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
