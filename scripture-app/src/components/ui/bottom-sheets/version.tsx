import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  View,
} from 'react-native';
import {
  SheetDefinition,
  SheetManager,
  ScrollView,
} from 'react-native-actions-sheet';
import SafeAreaBottomSheet from '@/components/ui/safe-area-bottom-sheet';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslations } from '@/hooks/useVersions';
import type { Translation } from '@/lib/bible/translations';
import { cn } from '@/lib/utils';

const FULL_BIBLE_BOOKS = 66;

interface VersionSheetProps {
  payload?: {
    value: string;
    onSelect: (id: string) => void;
  };
}

const VersionSheet = ({ payload }: VersionSheetProps) => {
  const scrollViewRef = useRef<any>(null);
  const { brand, text, surface, border, red } = useThemeColors();
  const { versions, isLoading, isError, refetch } = useTranslations();
  const [query, setQuery] = useState('');
  const [fullOnly, setFullOnly] = useState(true);

  const value = payload?.value ?? '';

  const { sections, total } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groups = new Map<string, Translation[]>();
    let count = 0;

    versions.forEach((v) => {
      const isSelected = v.id === value;
      if (fullOnly && (v.books ?? FULL_BIBLE_BOOKS) < FULL_BIBLE_BOOKS && !isSelected) return;
      if (
        q &&
        ![v.id, v.label, v.name, v.language ?? ''].some((field) =>
          field.toLowerCase().includes(q),
        )
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
    <SafeAreaBottomSheet
      id="version-sheet"
      title="Bible version"
      subtitle={`${total} versions`}
      iconBgColor={`${brand.primary}18`}
      showCloseButton
      onClose={() => SheetManager.hide('version-sheet')}
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
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, language or code"
          leftIcon={<Icon name="magnify" size={18} color={text.muted} />}
          autoCorrect={false}
          autoCapitalize="none"
          containerClassName="mb-3"
        />

        {isLoading ? (
          <ActivityIndicator color={brand.primary} style={{ marginVertical: 32 }} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(v) => v.id}
            keyboardShouldPersistTaps="handled"
            stickySectionHeadersEnabled={false}
            scrollEnabled={false}
            initialNumToRender={20}
            ListHeaderComponent={
              isError ? (
                <Pressable onPress={() => refetch()} className="py-2">
                  <Text className="text-xs" style={{ color: red.accent }}>
                    Could not load all versions. Showing defaults. Tap to retry.
                  </Text>
                </Pressable>
              ) : null
            }
            ListEmptyComponent={
              <Text
                className="text-sm py-5"
                style={{ color: text.muted }}
              >
                No versions match.
              </Text>
            }
            renderSectionHeader={({ section }) => (
              <Text
                className="text-[11px] font-semibold uppercase tracking-[1.5px] mt-4 mb-1"
                style={{ color: text.muted }}
              >
                {section.title}
              </Text>
            )}
            renderItem={({ item }) => {
              const selected = item.id === value;
              return (
                <Pressable
                  onPress={() => {
                    payload?.onSelect(item.id);
                    SheetManager.hide('version-sheet');
                  }}
                  className={cn(
                    'flex-row items-center py-3 border-b',
                  )}
                  style={{ borderBottomColor: border.medium }}
                >
                  <View className="flex-1">
                    <Text
                      className={cn(
                        'text-[15px]',
                        selected ? 'font-semibold' : 'font-medium',
                      )}
                      style={{ color: selected ? brand.primary : text.dark }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className="text-xs mt-0.5"
                      style={{ color: text.muted }}
                    >
                      {item.name}
                      {item.books ? ` · ${item.books} books` : ''}
                    </Text>
                  </View>
                  {selected ? (
                    <Icon name="check" size={20} color={brand.primary} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        )}
      </ScrollView>
    </SafeAreaBottomSheet>
  );
};

export type VersionSheetDefinition = SheetDefinition<{
  payload: {
    value: string;
    onSelect: (id: string) => void;
  };
}>;

export default VersionSheet;