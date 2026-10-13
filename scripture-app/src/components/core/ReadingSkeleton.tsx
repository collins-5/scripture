import * as React from "react";
import { View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppTheme } from "@/hooks/use-app-theme";

type Line = number;

const PARAGRAPHS: Line[][] = [
  [100, 96, 88],
  [100, 92],
  [100, 98, 94, 60],
  [100, 88],
  [100, 96, 90, 45],
  [100, 94],
  [100, 99, 92, 70],
];

export function ReadingSkeleton() {
  const t = useAppTheme();

  return (
    <View>
      {PARAGRAPHS.map((lines, pi) => (
        <View key={pi} style={{ marginBottom: 20 }}>
          {lines.map((pct, li) => (
            <Skeleton
              key={li}
              style={{
                width: `${pct}%`,
                height: t.reading.size(14),
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
          ))}
        </View>
      ))}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <Skeleton style={{ width: 110, height: 38, borderRadius: 19 }} />
        <Skeleton style={{ width: 90, height: 38, borderRadius: 19 }} />
      </View>
    </View>
  );
}