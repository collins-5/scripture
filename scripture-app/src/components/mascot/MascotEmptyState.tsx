import React from 'react';
import { Text, View } from 'react-native';
import { Mascot, MascotPose } from '@/components/mascot/mascot';
import { useAppTheme } from '@/hooks/use-app-theme';

export function MascotEmptyState({
  pose = 'sleep',
  title,
  body,
  size = 140,
}: {
  pose?: MascotPose;
  title: string;
  body?: string;
  size?: number;
}) {
  const t = useAppTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 }}>
      <Mascot pose={pose} size={size} />
      <Text
        style={{
          fontFamily: t.display.italic,
          fontSize: 17,
          color: t.c.muted,
          marginTop: 12,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {body ? (
        <Text
          style={{
            fontFamily: t.ui.regular,
            fontSize: 13,
            lineHeight: 19,
            color: t.c.faint,
            marginTop: 6,
            textAlign: 'center',
          }}
        >
          {body}
        </Text>
      ) : null}
    </View>
  );
}