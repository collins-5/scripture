import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, type ViewStyle } from 'react-native';
import PagerView from 'react-native-pager-view';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

export interface TabItem {
  key: string;
  label: string;
  component: ReactNode;
  badge?: number;
}

interface SwipeableTabsProps {
  tabs: TabItem[];
  initialTab?: string;
  onTabChange?: (tabKey: string, index: number) => void;
  headerClassName?: string;
  headerStyle?: ViewStyle;
  tabButtonClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
  usePagerView?: boolean;
  swipeEnabled?: boolean;
  showBadges?: boolean;
}

export default function SwipeableTabs({
  tabs,
  initialTab,
  onTabChange,
  headerClassName,
  headerStyle,
  tabButtonClassName,
  activeTabClassName,
  contentClassName,
  usePagerView = true,
  swipeEnabled = true,
  showBadges = true,
}: SwipeableTabsProps) {
  const { surface, border, brand, text } = useThemeColors();
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    if (initialTab) {
      const index = tabs.findIndex(tab => tab.key === initialTab);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (initialTab) {
      const index = tabs.findIndex(tab => tab.key === initialTab);
      if (index >= 0 && index !== activeIndex) {
        setActiveIndex(index);
        if (usePagerView) {
          pagerRef.current?.setPage(index);
        } else {
          scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
        }
      }
    }
  }, [initialTab]);

  const handleTabPress = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    if (usePagerView) {
      pagerRef.current?.setPage(index);
    } else {
      scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    }
    onTabChange?.(tabs[index].key, index);
  };

  const handlePageSelected = (event: any) => {
    const position = event.nativeEvent.position;
    if (position !== activeIndex) {
      setActiveIndex(position);
      onTabChange?.(tabs[position].key, position);
    }
  };

  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
      onTabChange?.(tabs[index].key, index);
    }
  };

  const renderTabs = () => (
    <View
      className={cn('flex-row px-2', headerClassName)}
      style={[{ borderBottomWidth: 1, borderBottomColor: border.medium }, headerStyle]}
    >
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handleTabPress(index)}
            className={cn('flex-1 px-4 py-3 items-center', tabButtonClassName)}
            style={isActive ? { borderBottomWidth: 2, borderBottomColor: brand.primary } : undefined}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-1">
              <Text
                className={cn('text-md font-medium', activeTabClassName)}
                style={{ color: isActive ? brand.primary : text.muted }}
              >
                {tab.label}
              </Text>
              {showBadges && tab.badge !== undefined && tab.badge > 0 && (
                <View className="rounded-full px-1.5 py-0.5">
                  <Text className="text-xs font-medium" style={{ color: text.dark }}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderContent = () => {
    if (usePagerView) {
      return (
        <PagerView
          ref={pagerRef}
          initialPage={activeIndex}
          onPageSelected={handlePageSelected}
          style={{ flex: 1, backgroundColor: surface.appGray }}
          overdrag={true}
          scrollEnabled={swipeEnabled}
        >
          {tabs.map((tab, index) => (
            <View
              key={tab.key}
              className="flex-1"
              style={{ backgroundColor: surface.appGray }}
              collapsable={false}
            >
              {tab.component}
            </View>
          ))}
        </PagerView>
      );
    }

    return (
      <ScrollView
        ref={scrollViewRef}
        style={{ backgroundColor: surface.appGray }}
        contentContainerStyle={{ backgroundColor: surface.appGray }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        scrollEnabled={swipeEnabled}
      >
        {tabs.map((tab, index) => (
          <View key={tab.key} style={{ width: screenWidth, flex: 1, backgroundColor: surface.appGray }}>
            {tab.component}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View
      className={cn('flex-1', contentClassName)}
      style={{ backgroundColor: surface.appGray }}
    >
      {renderTabs()}
      {renderContent()}
    </View>
  );
}
