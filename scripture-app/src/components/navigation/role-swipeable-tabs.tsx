import React, { useRef, useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import Icon, { IconNames } from '@/components/ui/icon';

export interface RoleTabItem {
  key: string;
  label: string;
  icon: IconNames;
  component: ReactNode;
}

interface RoleSwipeableTabsProps {
  tabs: RoleTabItem[];
  initialIndex?: number;
}

export default function RoleSwipeableTabs({ tabs, initialIndex = 0 }: RoleSwipeableTabsProps) {
  const insets = useSafeAreaInsets();
  const { brand, text, surface, border } = useThemeColors();
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleTabPress = (index: number) => {
    if (index === activeIndex) return;
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e: any) => {
    setActiveIndex(e.nativeEvent.position);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: surface.appGray }}>
      <PagerView
        ref={pagerRef}
        initialPage={initialIndex}
        onPageSelected={handlePageSelected}
        style={{ flex: 1 }}
        overdrag={true}
      >
        {tabs.map((tab) => (
          <View key={tab.key} className="flex-1" collapsable={false}>
            {tab.component}
          </View>
        ))}
      </PagerView>

      <View
        className="flex-row absolute bottom-0 left-0 right-0"
        style={{
          backgroundColor: surface.card,
          borderTopWidth: 1,
          borderTopColor: border.light,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        }}
      >
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabPress(index)}
              className="flex-1 items-center py-1"
            >
              <Icon name={tab.icon} size={22} color={active ? brand.primary : text.muted} />
              <Text
                className="text-xs mt-1"
                style={{ color: active ? brand.primary : text.muted, fontWeight: active ? '600' : '400' }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}