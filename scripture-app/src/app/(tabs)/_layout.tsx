import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/use-app-theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabDef = {
  name: string;
  title: string;
  icon: IoniconName;
  outline: IoniconName;
};

const TABS: TabDef[] = [
  { name: 'index', title: 'Home', icon: 'home', outline: 'home-outline' },
  { name: 'read', title: 'Read', icon: 'book', outline: 'book-outline' },
  { name: 'search', title: 'Search', icon: 'search', outline: 'search-outline' },
  { name: 'notes', title: 'Notes', icon: 'journal', outline: 'journal-outline' },
  { name: 'more', title: 'More', icon: 'menu', outline: 'menu-outline' },
];

const BAR_HEIGHT = 62;
const H_PADDING = 16;
const BOTTOM_GAP = 12;

const AnimatedText = Animated.createAnimatedComponent(Text);

function TabButton({
  tab,
  focused,
  onPress,
  t,
}: {
  tab: TabDef;
  focused: boolean;
  onPress: () => void;
  t: ReturnType<typeof useAppTheme>;
}) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 14,
      stiffness: 220,
      mass: 0.7,
    });
  }, [focused, progress]);

  const iconStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { scale: 0.9 + p * 0.1 },
        { translateY: -2 * p },
      ],
      opacity: 0.7 + p * 0.3,
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: 0.7 + p * 0.3,
    };
  });

  const color = focused ? t.accent.main : t.c.faint;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={styles.tabButton}
      android_ripple={{ color: `${t.accent.main}22`, borderless: true }}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? tab.icon : tab.outline}
          size={22}
          color={color}
        />
      </Animated.View>
      <AnimatedText
        style={[
          styles.tabLabel,
          labelStyle,
          {
            fontFamily: focused ? t.ui.semibold : t.ui.medium,
            color,
          },
        ]}
        numberOfLines={1}
      >
        {tab.title}
      </AnimatedText>
    </Pressable>
  );
}

export default function TabsLayout() {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const bottomOffset = Math.max(insets.bottom, BOTTOM_GAP);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.hiddenBar,
      }}
      tabBar={(props) => {
        const { state, navigation } = props;

        return (
          <View
            pointerEvents="box-none"
            style={[
              styles.barWrapper,
              { bottom: bottomOffset, paddingHorizontal: H_PADDING },
            ]}
          >
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: t.c.card,
                  borderColor: t.c.border,
                },
              ]}
            >
              {TABS.map((tab, index) => {
                const focused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: state.routes[index]?.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(tab.name);
                  }
                };

                return (
                  <TabButton
                    key={tab.name}
                    tab={tab}
                    focused={focused}
                    onPress={onPress}
                    t={t}
                  />
                );
              })}
            </View>
          </View>
        );
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  hiddenBar: {
    display: 'none',
  },
  barWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'stretch',
  },
  bar: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});