import { FlashList, type FlashListProps, type FlashListRef } from '@shopify/flash-list';
import React, { forwardRef, type Ref } from 'react';
import { StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

/**
 * Generic wrapper component for FlashList with standardized usage patterns.
 *
 * @template ItemT - The type of items in the list data array
 *
 * @example
 * ```typescript
 * interface TodoItem {
 *   id: string;
 *   title: string;
 *   completed: boolean;
 * }
 *
 * <List
 *   data={todos}
 *   renderItem={({ item }) => <TodoItemComponent item={item} />}
 *   keyExtractor={(item) => item.id}
 *   ListEmptyComponent={isLoading ? <SkeletonList/> : error ? <ErrorIllustration /> : <EmptyState />}
 *   ListFooterComponent={isLoading ? <LoadingSkeleton /> : null}
 * />
 * ```
 *
 * @remarks
 * **Required Usage Patterns:**
 *
 * 1. **ListEmptyComponent** - MUST be used for all empty states:
 *    - Skeleton loading state when initially loading data
 *    - Error state when data fetch fails
 *    - Empty state when no data exists
 *    - Use conditional rendering based on your loading/error states
 *
 * 2. **ListFooterComponent** - MUST be used for pagination loading:
 *    - Show a single item loading skeleton when `hasNextPage` or similar is true
 *    - Should only render when there's more data to load
 *    - Keep it minimal - typically just one skeleton item
 *
 * 3. **Performance Considerations:**
 *    - Always provide `keyExtractor` for optimal performance
 *    - Consider setting `estimatedItemSize` for better initial render
 *    - Use `getEstimatedItemSize` if items have varying heights
 *
 * @param props - All flashlist props with ItemT generic type
 */
function ListInner<ItemT>(props: FlashListProps<ItemT>, ref: Ref<FlashListRef<ItemT>>) {
  const { surface } = useThemeColors();
  const {
    contentContainerStyle,
    style,
    ...rest
  } = props;

  return (
    <FlashList
      {...rest}
      ref={ref}
      style={StyleSheet.flatten([{ backgroundColor: surface.appGray }, style])}
      contentContainerStyle={StyleSheet.flatten([
        { backgroundColor: surface.appGray },
        contentContainerStyle,
      ])}
    />
  );
}

const List = forwardRef(ListInner) as <ItemT>(
  props: FlashListProps<ItemT> & React.RefAttributes<FlashListRef<ItemT>>
) => React.ReactElement;

export default List;
