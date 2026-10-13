import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '@/lib/utils';
import { createContext, useContext } from 'react';

export const TextClassContext = createContext<string | undefined>(undefined);

export interface TextProps extends RNTextProps {
  className?: string;
}

const Text = React.forwardRef<RNText, TextProps>(
  ({ className, children, ...props }, ref) => {
    const contextClass = useContext(TextClassContext);
    
    return (
      <RNText
        ref={ref}
        className={cn('text-foreground', contextClass, className)}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';

export { Text };