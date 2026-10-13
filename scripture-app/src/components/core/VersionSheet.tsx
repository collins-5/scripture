import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '@/components/core/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslations } from '@/hooks/useVersions';
import { Translation } from '@/lib/bible/translations';

const FULL_BIBLE_BOOKS = 66;

export function VersionSheet({
  visible,
  onClose,
  value,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  value: string;
  onSelect: (id: string) => void;
}) {
  const t = useAppTheme();
  const { versions, isLoading, isError, refetch } = useTranslations();
  const [query, setQuery] = useState('');
  const [fullOnly, setFullOnly] = useState(true);

  const { sections, total } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groups = new Map<string, Translation[]>();
    let count = 0;

    versions.forEach((v) => {
      const isSelected = v.id === value;
      if (fullOnly && (v.books ?? FULL_BIBLE_BOOKS) < FULL_BIBLE_BOOKS && !isSelected) return;
      if (
        q &&
        ![v.id, v.label, v.name, v.language ?? ''].some((field) => field.toLowerCase().includes(q))
      ) {
        return;
      }
      const key = v.language ?? 'Other';
      const bucket = groups.get(key);
      if (bucket) bucket.push(v);
      else groups.set(key, [v]);
      count += 1;
    });

    const keys = Array.from(groups.keys()).sort((a, b) => {
      if (a === 'English') return -1;
      if (b === 'English') return 1;
      return a.localeCompare(b);
    });

    return {
      total: count,
      sections: keys.map((key) => ({
        title: key,
        data: (groups.get(key) ?? []).sort(
          (a, b) => (b.books ?? 0) - (a.books ?? 0) || a.name.localeCompare(b.name),
        ),
      })),
    };
  }, [versions, query, fullOnly, value]);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Bible version" tall>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: t.c.border,
            backgroundColor: t.c.card,
          }}
        >
          <Ionicons name="search-outline" size={16} color={t.c.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name, language or code"
            placeholderTextColor={t.c.placeholder}
            autoCorrect={false}
            autoCapitalize="none"
            style={{ flex: 1, paddingVertical: 11, fontFamily: t.ui.regular, fontSize: 14, color: t.c.text }}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={t.c.faint} />
            </Pressable>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 4,
          }}
        >
          <Pressable
            onPress={() => setFullOnly((v) => !v)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <Ionicons
              name={fullOnly ? 'checkbox' : 'square-outline'}
              size={20}
              color={fullOnly ? t.accent.main : t.c.muted}
            />
            <Text style={{ fontFamily: t.ui.medium, fontSize: 13, color: t.c.body }}>Full Bible only</Text>
          </Pressable>
          <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted }}>{total} versions</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={t.accent.main} style={{ marginVertical: 32 }} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(v) => v.id}
            keyboardShouldPersistTaps="handled"
            stickySectionHeadersEnabled={false}
            initialNumToRender={20}
            ListHeaderComponent={
              isError ? (
                <Pressable onPress={() => refetch()} style={{ paddingVertical: 8 }}>
                  <Text style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.danger }}>
                    Could not load all versions. Showing defaults. Tap to retry.
                  </Text>
                </Pressable>
              ) : null
            }
            ListEmptyComponent={
              <Text style={{ fontFamily: t.ui.regular, fontSize: 14, color: t.c.muted, paddingVertical: 20 }}>
                No versions match.
              </Text>
            }
            renderSectionHeader={({ section }) => (
              <Text
                style={{
                  fontFamily: t.ui.semibold,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: t.c.muted,
                  textTransform: 'uppercase',
                  marginTop: 14,
                  marginBottom: 4,
                }}
              >
                {section.title}
              </Text>
            )}
            renderItem={({ item }) => {
              const selected = item.id === value;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: t.c.border,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: selected ? t.ui.semibold : t.ui.medium,
                        fontSize: 15,
                        color: selected ? t.accent.main : t.c.text,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{ fontFamily: t.ui.regular, fontSize: 12, color: t.c.muted, marginTop: 2 }}
                    >
                      {item.name}
                      {item.books ? ` · ${item.books} books` : ''}
                    </Text>
                  </View>
                  {selected ? <Ionicons name="checkmark" size={20} color={t.accent.main} /> : null}
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </BottomSheet>
  );
}