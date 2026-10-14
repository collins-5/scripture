import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useAppTheme } from '@/hooks/use-app-theme';

export type MascotPose = 'wave' | 'read' | 'still' | 'lantern' | 'cheer' | 'sleep';

type Eyes = 'open' | 'down' | 'closed' | 'happy';
type Mouth = 'smile' | 'open' | 'soft';

const POSE_FACE: Record<MascotPose, { eyes: Eyes; mouth: Mouth }> = {
  wave: { eyes: 'open', mouth: 'smile' },
  read: { eyes: 'down', mouth: 'soft' },
  still: { eyes: 'closed', mouth: 'soft' },
  lantern: { eyes: 'open', mouth: 'smile' },
  cheer: { eyes: 'happy', mouth: 'open' },
  sleep: { eyes: 'closed', mouth: 'soft' },
};

const BODY: [number, number, number][] = [
  [100, 124, 38],
  [68, 128, 25],
  [132, 128, 25],
  [76, 104, 22],
  [124, 104, 22],
  [100, 102, 26],
];

const TUFT: [number, number, number][] = [
  [86, 55, 11],
  [100, 49, 13],
  [114, 55, 11],
];

type MascotProps = {
  pose?: MascotPose;
  size?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Mascot({ pose = 'wave', size = 160, animated = true, style }: MascotProps) {
  const t = useAppTheme();
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      bob.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: -6,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, bob]);

  const ink = t.isDark ? '#120A0C' : '#3D2A18';
  const wool = t.isDark ? '#FBF3E4' : '#FFFFFF';
  const skin = '#EBCBA4';
  const page = '#FFFDF7';
  const gold = '#F2C14E';
  const blush = '#F2A7A0';
  const accent = t.accent.main;

  const arm = (key: string, x1: number, y1: number, x2: number, y2: number) => (
    <G key={key}>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={15} strokeLinecap="round" />
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={skin} strokeWidth={9} strokeLinecap="round" />
    </G>
  );

  const hand = (key: string, cx: number, cy: number) => (
    <Circle key={key} cx={cx} cy={cy} r={7} fill={skin} stroke={ink} strokeWidth={3} />
  );

  const face = POSE_FACE[pose];

  let behind: React.ReactNode = null;
  let arms: React.ReactNode = null;
  let props: React.ReactNode = null;
  let top: React.ReactNode = null;

  if (pose === 'wave') {
    arms = [arm('l', 72, 118, 62, 142), arm('r', 128, 118, 154, 90)];
    props = [
      hand('lh', 62, 145),
      hand('rh', 156, 87),
      <Path key="m1" d="M167 78 Q174 86 167 94" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />,
      <Path key="m2" d="M175 72 Q187 86 175 100" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />,
    ];
  } else if (pose === 'read') {
    arms = [arm('l', 72, 118, 66, 146), arm('r', 128, 118, 134, 146)];
    props = [
      <Path
        key="cover"
        d="M56 134 Q80 124 100 135 Q120 124 144 134 L144 168 Q120 158 100 169 Q80 158 56 168 Z"
        fill={accent}
        stroke={ink}
        strokeWidth={3}
        strokeLinejoin="round"
      />,
      <Path
        key="pl"
        d="M61 138 Q80 130 98 140 L98 164 Q80 156 61 164 Z"
        fill={page}
        stroke={ink}
        strokeWidth={2}
        strokeLinejoin="round"
      />,
      <Path
        key="pr"
        d="M139 138 Q120 130 102 140 L102 164 Q120 156 139 164 Z"
        fill={page}
        stroke={ink}
        strokeWidth={2}
        strokeLinejoin="round"
      />,
      <Path key="l1" d="M68 147 Q80 143 91 148" stroke={ink} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />,
      <Path key="l2" d="M68 154 Q80 150 91 155" stroke={ink} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />,
      <Path key="l3" d="M132 147 Q120 143 109 148" stroke={ink} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />,
      <Path key="l4" d="M132 154 Q120 150 109 155" stroke={ink} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />,
      hand('lh', 62, 151),
      hand('rh', 138, 151),
    ];
  } else if (pose === 'still') {
    arms = [arm('l', 72, 118, 94, 131), arm('r', 128, 118, 106, 131)];
    props = [hand('clasp', 100, 132)];
    top = (
      <Ellipse cx={100} cy={26} rx={21} ry={6} stroke={gold} strokeWidth={5} fill="none" />
    );
  } else if (pose === 'lantern') {
    behind = [
      <Circle key="g1" cx={156} cy={133} r={40} fill={gold} opacity={0.16} />,
      <Circle key="g2" cx={156} cy={133} r={26} fill={gold} opacity={0.26} />,
    ];
    arms = [arm('l', 72, 118, 62, 142), arm('r', 128, 118, 152, 116)];
    props = [
      <Path key="handle" d="M148 120 Q156 106 164 120" stroke={ink} strokeWidth={3} fill="none" strokeLinecap="round" />,
      <Rect key="cap" x={146} y={119} width={20} height={6} rx={2.5} fill={ink} />,
      <Rect key="lamp" x={148} y={124} width={16} height={22} rx={5} fill={gold} stroke={ink} strokeWidth={3} />,
      <Rect key="base" x={146} y={145} width={20} height={6} rx={2.5} fill={ink} />,
      <Path key="flame" d="M156 129 Q160 134 156 140 Q152 134 156 129 Z" fill="#FFF3C4" />,
      hand('lh', 62, 145),
      hand('rh', 156, 113),
    ];
  } else if (pose === 'cheer') {
    arms = [arm('l', 72, 118, 46, 84), arm('r', 128, 118, 154, 84)];
    props = [hand('lh', 44, 80), hand('rh', 156, 80)];
    const confetti: [number, number, string][] = [
      [28, 44, accent],
      [172, 48, gold],
      [20, 112, gold],
      [180, 108, accent],
      [56, 22, '#8FB8E8'],
      [146, 20, '#F29BAA'],
    ];
    top = confetti.map(([cx, cy, fill], i) =>
      i % 2 === 0 ? (
        <Circle key={`c${i}`} cx={cx} cy={cy} r={4} fill={fill} />
      ) : (
        <G key={`c${i}`} rotation={30} origin={`${cx}, ${cy}`}>
          <Rect x={cx - 4} y={cy - 4} width={8} height={8} rx={1.5} fill={fill} />
        </G>
      ),
    );
  } else {
    arms = [arm('l', 72, 118, 62, 142), arm('r', 128, 118, 138, 142)];
    props = [
      hand('lh', 62, 145),
      hand('rh', 138, 145),
      <SvgText key="z1" x={140} y={58} fontSize={24} fontWeight="bold" fill={accent}>
        Z
      </SvgText>,
      <SvgText key="z2" x={158} y={38} fontSize={17} fontWeight="bold" fill={accent} opacity={0.75}>
        z
      </SvgText>,
    ];
  }

  const eyes = () => {
    if (face.eyes === 'closed') {
      return [
        <Path key="el" d="M84 80 Q90 85 96 80" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />,
        <Path key="er" d="M104 80 Q110 85 116 80" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />,
      ];
    }
    if (face.eyes === 'happy') {
      return [
        <Path key="el" d="M84 82 Q90 75 96 82" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />,
        <Path key="er" d="M104 82 Q110 75 116 82" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />,
      ];
    }
    const dy = face.eyes === 'down' ? 3 : 0;
    return [
      <Circle key="el" cx={90} cy={80 + dy} r={3.6} fill={ink} />,
      <Circle key="er" cx={110} cy={80 + dy} r={3.6} fill={ink} />,
      <Circle key="hl" cx={91.2} cy={78.8 + dy} r={1.2} fill="#FFFFFF" />,
      <Circle key="hr" cx={111.2} cy={78.8 + dy} r={1.2} fill="#FFFFFF" />,
    ];
  };

  const mouth = () => {
    if (face.mouth === 'open') {
      return (
        <Path
          d="M92 92 Q100 107 108 92 Z"
          fill="#B5473F"
          stroke={ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      );
    }
    if (face.mouth === 'soft') {
      return <Path d="M95 93 Q100 96.5 105 93" stroke={ink} strokeWidth={2.6} strokeLinecap="round" fill="none" />;
    }
    return <Path d="M93 93 Q100 100 107 93" stroke={ink} strokeWidth={2.8} strokeLinecap="round" fill="none" />;
  };

  return (
    <Animated.View style={[{ width: size, height: size, transform: [{ translateY: bob }] }, style]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Ellipse cx={100} cy={180} rx={54} ry={8} fill="#000000" opacity={0.12} />

        {behind}

        <Rect x={80} y={150} width={14} height={28} rx={7} fill={skin} stroke={ink} strokeWidth={3} />
        <Rect x={106} y={150} width={14} height={28} rx={7} fill={skin} stroke={ink} strokeWidth={3} />

        {BODY.map(([cx, cy, r], i) => (
          <Circle key={`bs${i}`} cx={cx} cy={cy} r={r} fill={wool} stroke={ink} strokeWidth={6} />
        ))}
        {BODY.map(([cx, cy, r], i) => (
          <Circle key={`bf${i}`} cx={cx} cy={cy} r={r} fill={wool} />
        ))}

        {arms}

        <G rotation={-25} origin="68, 78">
          <Ellipse cx={68} cy={78} rx={14} ry={8} fill={skin} stroke={ink} strokeWidth={3} />
          <Ellipse cx={68} cy={78} rx={7} ry={3.6} fill={blush} opacity={0.8} />
        </G>
        <G rotation={25} origin="132, 78">
          <Ellipse cx={132} cy={78} rx={14} ry={8} fill={skin} stroke={ink} strokeWidth={3} />
          <Ellipse cx={132} cy={78} rx={7} ry={3.6} fill={blush} opacity={0.8} />
        </G>

        <Ellipse cx={100} cy={80} rx={30} ry={27} fill={skin} stroke={ink} strokeWidth={3} />

        {TUFT.map(([cx, cy, r], i) => (
          <Circle key={`ts${i}`} cx={cx} cy={cy} r={r} fill={wool} stroke={ink} strokeWidth={6} />
        ))}
        {TUFT.map(([cx, cy, r], i) => (
          <Circle key={`tf${i}`} cx={cx} cy={cy} r={r} fill={wool} />
        ))}

        <Rect x={76} y={103} width={48} height={11} rx={5.5} fill={accent} stroke={ink} strokeWidth={3} />
        <G rotation={8} origin="115, 110">
          <Rect x={109} y={110} width={11} height={20} rx={4} fill={accent} stroke={ink} strokeWidth={3} />
        </G>

        <Circle cx={79} cy={90} r={5} fill={blush} opacity={0.75} />
        <Circle cx={121} cy={90} r={5} fill={blush} opacity={0.75} />

        {eyes()}
        <Ellipse cx={100} cy={87.5} rx={4.2} ry={3} fill={ink} />
        {mouth()}

        {props}
        {top}
      </Svg>
    </Animated.View>
  );
}