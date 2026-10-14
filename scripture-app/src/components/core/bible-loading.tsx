import { useAppTheme } from '@/hooks/use-app-theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View as RNView } from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

export type BibleLoadingProps = {
  text?: string;
  size?: number;
  textSize?: number;
  textColor?: string;
  letterSpacing?: number;
  marginBottom?: number;
  showText?: boolean;
  accentColor?: string;
  outlineColor?: string;
  pageColor?: string;
  pageEdgeColor?: string;
  backgroundColor?: string;
};

export function BibleLoading({
  text = 'Scripture',
  size = 130,
  textSize = 22,
  textColor,
  letterSpacing = 3,
  marginBottom = 20,
  showText = true,
  accentColor,
  outlineColor,
  pageColor,
  pageEdgeColor,
  backgroundColor,
}: BibleLoadingProps) {
  const t = useAppTheme();

  const accent = accentColor ?? t.accent.main;
  const outline = outlineColor ?? t.c.text;
  const page = pageColor ?? t.c.card;
  const pageEdge = pageEdgeColor ?? t.c.border;
  const bg = backgroundColor ?? t.c.bg;
  const labelColor = textColor ?? t.c.text;

  const page1 = useRef(new Animated.Value(0)).current;
  const page2 = useRef(new Animated.Value(0)).current;
  const page3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runFlip = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(300),
        ]),
      );

    const p1 = runFlip(page1, 0);
    const p2 = runFlip(page2, 900);
    const p3 = runFlip(page3, 1800);

    p1.start();
    p2.start();
    p3.start();
    return () => {
      p1.stop();
      p2.stop();
      p3.stop();
    };
  }, [page1, page2, page3]);

  const makeRotate = (v: Animated.Value) =>
    v.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-160deg'],
    });

  const makeOpacity = (v: Animated.Value) =>
    v.interpolate({
      inputRange: [0, 0.15, 0.85, 1],
      outputRange: [0, 0.85, 0.6, 0],
    });

  return (
    <RNView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
      }}
    >
      <RNView style={{ alignItems: 'center' }}>
        {showText ? (
          <Text
            style={{
              fontFamily: t.display.semibold,
              fontSize: textSize,
              letterSpacing,
              color: labelColor,
              marginBottom,
              textTransform: 'uppercase',
            }}
          >
            {text}
          </Text>
        ) : null}

        <RNView
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg width={size} height={size} viewBox="0 0 96 96">
            <Defs>
              <LinearGradient id="bl-pageGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={page} stopOpacity="1" />
                <Stop offset="85%" stopColor={page} stopOpacity="0.95" />
                <Stop offset="100%" stopColor={pageEdge} stopOpacity="0.35" />
              </LinearGradient>
              <LinearGradient id="bl-coverGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={outline} stopOpacity="1" />
                <Stop offset="55%" stopColor={outline} stopOpacity="0.92" />
                <Stop offset="100%" stopColor={outline} stopOpacity="0.78" />
              </LinearGradient>
              <LinearGradient id="bl-coverGradRight" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={outline} stopOpacity="0.88" />
                <Stop offset="55%" stopColor={outline} stopOpacity="0.78" />
                <Stop offset="100%" stopColor={outline} stopOpacity="0.62" />
              </LinearGradient>
            </Defs>

            <G>
              <Path
                d="M 10 28 C 22 22, 40 22, 48 26 L 48 74 C 40 70, 22 70, 10 76 Z"
                fill="url(#bl-coverGrad)"
                stroke={outline}
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              <Path
                d="M 86 28 C 74 22, 56 22, 48 26 L 48 74 C 56 70, 74 70, 86 76 Z"
                fill="url(#bl-coverGradRight)"
                stroke={outline}
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              <Path
                d="M 11 32 C 22 26, 40 26, 47 30 L 47 74 C 40 70, 22 70, 11 75 Z"
                fill="url(#bl-pageGrad)"
                stroke={pageEdge}
                strokeWidth={0.6}
                strokeLinejoin="round"
                opacity={0.95}
              />
              <Path
                d="M 85 32 C 74 26, 56 26, 49 30 L 49 74 C 56 70, 74 70, 85 75 Z"
                fill="url(#bl-pageGrad)"
                stroke={pageEdge}
                strokeWidth={0.6}
                strokeLinejoin="round"
                opacity={0.95}
              />
              <Path
                d="M 48 26 L 48 74"
                stroke={outline}
                strokeWidth={1.2}
                strokeLinecap="round"
                opacity={0.7}
              />
              <Rect x={16} y={36} width={24} height={1.4} rx={0.7} fill={outline} opacity={0.55} />
              <Rect x={16} y={41} width={26} height={1.4} rx={0.7} fill={outline} opacity={0.42} />
              <Rect x={16} y={46} width={22} height={1.4} rx={0.7} fill={outline} opacity={0.32} />
              <Rect x={16} y={51} width={24} height={1.4} rx={0.7} fill={outline} opacity={0.28} />
              <Rect x={16} y={56} width={20} height={1.4} rx={0.7} fill={outline} opacity={0.22} />
              <Rect x={16} y={61} width={22} height={1.4} rx={0.7} fill={outline} opacity={0.18} />
              <Rect x={56} y={36} width={24} height={1.4} rx={0.7} fill={outline} opacity={0.55} />
              <Rect x={54} y={41} width={26} height={1.4} rx={0.7} fill={outline} opacity={0.42} />
              <Rect x={58} y={46} width={22} height={1.4} rx={0.7} fill={outline} opacity={0.32} />
              <Rect x={56} y={51} width={24} height={1.4} rx={0.7} fill={outline} opacity={0.28} />
              <Rect x={60} y={56} width={20} height={1.4} rx={0.7} fill={outline} opacity={0.22} />
              <Rect x={58} y={61} width={22} height={1.4} rx={0.7} fill={outline} opacity={0.18} />
              <Path
                d="M 10 28 C 22 22, 40 22, 48 26"
                stroke={accent}
                strokeWidth={1.4}
                fill="none"
                opacity={0.6}
              />
              <Path
                d="M 86 28 C 74 22, 56 22, 48 26"
                stroke={accent}
                strokeWidth={1.4}
                fill="none"
                opacity={0.6}
              />
            </G>
          </Svg>

          <RNView
            style={{
              position: 'absolute',
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                width: size * 0.4,
                height: size * 0.5,
                opacity: makeOpacity(page3),
                transform: [
                  { perspective: 1400 },
                  { translateX: size * 0.1 },
                  { rotateY: makeRotate(page3) },
                ],
                transformOrigin: 'left center',
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 4,
              }}
            >
              <Svg width={size * 0.4} height={size * 0.5} viewBox="0 0 40 50">
                <Defs>
                  <LinearGradient id="bl-flipPage3" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor={page} stopOpacity="1" />
                    <Stop offset="55%" stopColor={page} stopOpacity="0.96" />
                    <Stop offset="100%" stopColor={pageEdge} stopOpacity="0.5" />
                  </LinearGradient>
                  <LinearGradient id="bl-flipShade3" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor="#000" stopOpacity="0" />
                    <Stop offset="100%" stopColor="#000" stopOpacity="0.12" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3 L 40 47 C 30 43, 12 43, 0 46 Z"
                  fill="url(#bl-flipPage3)"
                  stroke={pageEdge}
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3 L 40 47 C 30 43, 12 43, 0 46 Z"
                  fill="url(#bl-flipShade3)"
                />
                <Rect x={6} y={12} width={30} height={1.2} rx={0.6} fill={outline} opacity={0.38} />
                <Rect x={6} y={17} width={26} height={1.2} rx={0.6} fill={outline} opacity={0.3} />
                <Rect x={6} y={22} width={30} height={1.2} rx={0.6} fill={outline} opacity={0.34} />
                <Rect x={6} y={27} width={24} height={1.2} rx={0.6} fill={outline} opacity={0.28} />
                <Rect x={6} y={32} width={28} height={1.2} rx={0.6} fill={outline} opacity={0.3} />
                <Rect x={6} y={37} width={22} height={1.2} rx={0.6} fill={outline} opacity={0.24} />
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3"
                  stroke={accent}
                  strokeWidth={1}
                  fill="none"
                  opacity={0.55}
                />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                width: size * 0.4,
                height: size * 0.5,
                opacity: makeOpacity(page2),
                transform: [
                  { perspective: 1400 },
                  { translateX: size * 0.1 },
                  { rotateY: makeRotate(page2) },
                ],
                transformOrigin: 'left center',
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 7,
                shadowOffset: { width: 0, height: 2 },
                elevation: 5,
              }}
            >
              <Svg width={size * 0.4} height={size * 0.5} viewBox="0 0 40 50">
                <Defs>
                  <LinearGradient id="bl-flipPage2" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor={page} stopOpacity="1" />
                    <Stop offset="55%" stopColor={page} stopOpacity="0.96" />
                    <Stop offset="100%" stopColor={pageEdge} stopOpacity="0.5" />
                  </LinearGradient>
                  <LinearGradient id="bl-flipShade2" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor="#000" stopOpacity="0" />
                    <Stop offset="100%" stopColor="#000" stopOpacity="0.12" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3 L 40 47 C 30 43, 12 43, 0 46 Z"
                  fill="url(#bl-flipPage2)"
                  stroke={pageEdge}
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3 L 40 47 C 30 43, 12 43, 0 46 Z"
                  fill="url(#bl-flipShade2)"
                />
                <Rect x={6} y={12} width={30} height={1.2} rx={0.6} fill={outline} opacity={0.38} />
                <Rect x={6} y={17} width={26} height={1.2} rx={0.6} fill={outline} opacity={0.3} />
                <Rect x={6} y={22} width={30} height={1.2} rx={0.6} fill={outline} opacity={0.34} />
                <Rect x={6} y={27} width={24} height={1.2} rx={0.6} fill={outline} opacity={0.28} />
                <Rect x={6} y={32} width={28} height={1.2} rx={0.6} fill={outline} opacity={0.3} />
                <Rect x={6} y={37} width={22} height={1.2} rx={0.6} fill={outline} opacity={0.24} />
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3"
                  stroke={accent}
                  strokeWidth={1}
                  fill="none"
                  opacity={0.55}
                />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                width: size * 0.4,
                height: size * 0.5,
                opacity: makeOpacity(page1),
                transform: [
                  { perspective: 1400 },
                  { translateX: size * 0.1 },
                  { rotateY: makeRotate(page1) },
                ],
                transformOrigin: 'left center',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 6,
              }}
            >
              <Svg width={size * 0.4} height={size * 0.5} viewBox="0 0 40 50">
                <Defs>
                  <LinearGradient id="bl-flipPage1" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor={page} stopOpacity="1" />
                    <Stop offset="55%" stopColor={page} stopOpacity="0.96" />
                    <Stop offset="100%" stopColor={pageEdge} stopOpacity="0.5" />
                  </LinearGradient>
                  <LinearGradient id="bl-flipShade1" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor="#000" stopOpacity="0" />
                    <Stop offset="100%" stopColor="#000" stopOpacity="0.12" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3 L 40 47 C 30 43, 12 43, 0 46 Z"
                  fill="url(#bl-flipPage1)"
                  stroke={pageEdge}
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3 L 40 47 C 30 43, 12 43, 0 46 Z"
                  fill="url(#bl-flipShade1)"
                />
                <Rect x={6} y={12} width={30} height={1.2} rx={0.6} fill={outline} opacity={0.38} />
                <Rect x={6} y={17} width={26} height={1.2} rx={0.6} fill={outline} opacity={0.3} />
                <Rect x={6} y={22} width={30} height={1.2} rx={0.6} fill={outline} opacity={0.34} />
                <Rect x={6} y={27} width={24} height={1.2} rx={0.6} fill={outline} opacity={0.28} />
                <Rect x={6} y={32} width={28} height={1.2} rx={0.6} fill={outline} opacity={0.3} />
                <Rect x={6} y={37} width={22} height={1.2} rx={0.6} fill={outline} opacity={0.24} />
                <Path
                  d="M 0 2 C 12 -1, 30 -1, 40 3"
                  stroke={accent}
                  strokeWidth={1}
                  fill="none"
                  opacity={0.55}
                />
              </Svg>
            </Animated.View>
          </RNView>
        </RNView>
      </RNView>
    </RNView>
  );
}