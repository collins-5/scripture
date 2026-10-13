import * as SeparatorPrimitive from '@rn-primitives/separator';
import { SlottableViewProps, ViewRef } from '@rn-primitives/types';
import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type VerticalType = { orientation?: 'vertical' };

type HorizontalType = { orientation?: 'horizontal'; text?: string };

/**
 * @param className - Additional class names to apply to the separator.
 * @param orientation - The orientation of the separator, either 'horizontal' or 'vertical'. Defaults to 'horizontal'.
 * @param decorative - If true, the separator is decorative and will be hidden from assistive technologies. Defaults to true.
 * @param ref - Optional ref to the underlying SeparatorPrimitive.Root element.
 * @param text - Optional text to display between two horizontal separators.
 * @param props - Additional props passed to the SeparatorPrimitive.Root component.
 *
 * @remarks
 * - When `orientation` is 'horizontal' and `text` is provided, the separator will render text between two horizontal lines.
 */
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SlottableViewProps & {
  ref?: React.RefObject<SeparatorPrimitive.RootRef>;
  decorative?: boolean;
} & (HorizontalType | VerticalType)) {
  const isHorizontal = orientation === 'horizontal';

  let text;
  if ('text' in props) {
    text = (props as HorizontalType).text;
  }

  return (
    <View className={cn(isHorizontal ? 'flex flex-row items-center gap-1' : '')}>
      <SeparatorPrimitive.Root
        decorative={decorative}
        orientation={orientation}
        className={cn(
          'bg-muted-foreground shrink-0',
          orientation === 'horizontal' ? 'h-[1px] flex-1' : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
      {isHorizontal && text && (
        <>
          <Text className="text-muted-foreground">{text}</Text>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn(
              'bg-muted-foreground shrink-0',
              isHorizontal ? 'h-[1px] flex-1' : 'h-full w-[1px]',
              className
            )}
            {...props}
          />
        </>
      )}
    </View>
  );
}

export { Separator };
