import type { TextProps, ViewProps } from 'react-native';

import * as React from 'react';
import { Text, View } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/lib/utils';

import { Separator } from './separator';

function Card({
  className,
  style,
  children,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
  children?: React.ReactNode;
}) {
  const { surface, border } = useThemeColors();

  return (
    <View
      className={cn(
        'rounded-lg border border-border bg-card py-4 shadow-sm shadow-black/70',
        className
      )}
      style={[{ backgroundColor: surface.card, borderColor: border.medium }, style]}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <Text>{child}</Text>;
        }
        return child;
      })}
    </View>
  );
}

function CardHeader({
  className,
  withSeparator,
  children,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
  withSeparator?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <>
      <View className={cn('flex flex-col space-y-1.5 px-4', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (typeof child === 'string') {
            return <Text>{child}</Text>;
          }
          return child;
        })}
      </View>
      {withSeparator && <Separator orientation="horizontal" />}
    </>
  );
}

function CardTitle({
  className,
  ...props
}: TextProps & {
  ref?: React.RefObject<Text>;
}) {
  return (
    <Text
      role="heading"
      aria-level={3}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight text-card-foreground',
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: TextProps & {
  ref?: React.RefObject<Text>;
}) {
  return <Text className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function CardContent({
  className,
  children,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
  children?: React.ReactNode;
}) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View className={cn('px-4 pt-0', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (typeof child === 'string') {
            return <Text>{child}</Text>;
          }
          return child;
        })}
      </View>
    </TextClassContext.Provider>
  );
}

function CardFooter({
  className,
  children,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
  children?: React.ReactNode;
}) {
  return (
    <View className={cn('flex flex-row items-center px-4', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <Text>{child}</Text>;
        }
        return child;
      })}
    </View>
  );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };