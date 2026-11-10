import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 62;
export const TAB_BAR_GAP = 12;

export function useTabBarSpace(extra = 16): number {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, TAB_BAR_GAP) + TAB_BAR_HEIGHT + extra;
}