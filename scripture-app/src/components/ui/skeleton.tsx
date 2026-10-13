import * as React from "react";
import { Animated, View, ViewStyle } from "react-native";

import { cn } from "@/lib/utils";
import { useThemeColors } from "@/hooks/useThemeColors";

const duration = 1000;

function Skeleton({
  className,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof View> & { style?: ViewStyle }) {
  const opacity = React.useRef(new Animated.Value(1)).current;
  const { border } = useThemeColors();

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ opacity, backgroundColor: border.medium }, style]}
      className={cn("rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
