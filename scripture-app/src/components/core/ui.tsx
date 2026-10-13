import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '@/hooks/use-app-theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Screen({
  children,
  edges = ['top'],
  style,
}: {
  children: ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}) {
  const t = useAppTheme();
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: t.c.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const t = useAppTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 4,
      }}
    >
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={10} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={22} color={t.c.text} />
        </Pressable>
      ) : null}
      <Text
        style={{
          flex: 1,
          fontFamily: t.display.medium,
          fontSize: 24,
          color: t.c.text,
          marginLeft: onBack ? 0 : 8,
        }}
      >
        {title}
      </Text>
      {right}
    </View>
  );
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useAppTheme();
  const base: ViewStyle = {
    backgroundColor: t.c.card,
    borderColor: t.c.border,
    borderWidth: 1,
    borderRadius: 16,
  };
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

export function SectionLabel({ children }: { children: string }) {
  const t = useAppTheme();
  return (
    <Text
      style={{
        fontFamily: t.ui.semibold,
        fontSize: 11,
        letterSpacing: 1.5,
        color: t.c.muted,
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 4,
      }}
    >
      {children}
    </Text>
  );
}

export function ListRow({
  icon,
  label,
  value,
  right,
  onPress,
  divider,
  chevron,
}: {
  icon?: IconName;
  label: string;
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  divider?: boolean;
  chevron?: IconName;
}) {
  const t = useAppTheme();
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
        gap: 12,
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: t.c.border,
      }}
    >
      {icon ? <Ionicons name={icon} size={18} color={t.c.muted} /> : null}
      <Text style={{ flex: 1, fontFamily: t.ui.medium, fontSize: 15, color: t.c.text }}>{label}</Text>
      {value ? (
        <Text style={{ fontFamily: t.ui.semibold, fontSize: 14, color: t.accent.main }}>{value}</Text>
      ) : null}
      {right}
      {chevron ? <Ionicons name={chevron} size={16} color={t.c.faint} /> : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {content}
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  serif,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  serif?: boolean;
}) {
  const t = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: active ? t.accent.main : t.c.card,
        borderWidth: 1,
        borderColor: active ? t.accent.main : t.c.border,
      }}
    >
      <Text
        style={{
          fontFamily: serif ? t.display.italic : t.ui.medium,
          fontSize: serif ? 15 : 13,
          color: active ? t.accent.on : t.c.body,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function IconCircle({
  name,
  size = 48,
  onPress,
  filled,
}: {
  name: IconName;
  size?: number;
  onPress?: () => void;
  filled?: boolean;
}) {
  const t = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: filled ? t.accent.main : t.c.card,
        borderWidth: filled ? 0 : 1,
        borderColor: t.c.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Ionicons name={name} size={size * 0.42} color={filled ? t.accent.on : t.c.text} />
    </Pressable>
  );
}

export function BottomSheet({
  visible,
  onClose,
  title,
  tall,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  tall?: boolean;
  children: ReactNode;
}) {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: t.c.overlay }}
        />
        <View
          style={{
            backgroundColor: t.c.sheet,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 16,
            height: tall ? '85%' : undefined,
            maxHeight: '90%',
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: t.c.border,
              marginBottom: 12,
            }}
          />
          {title ? (
            <Text style={{ fontFamily: t.display.medium, fontSize: 20, color: t.c.text, marginBottom: 12 }}>
              {title}
            </Text>
          ) : null}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export type SheetOption = { value: string; label: string; sub?: string };

export function OptionSheet({
  visible,
  onClose,
  title,
  options,
  value,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SheetOption[];
  value: string;
  onSelect: (value: string) => void;
}) {
  const t = useAppTheme();
  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              onSelect(option.value);
              onClose();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: t.c.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: selected ? t.ui.semibold : t.ui.medium,
                  fontSize: 16,
                  color: selected ? t.accent.main : t.c.text,
                }}
              >
                {option.label}
              </Text>
              {option.sub ? (
                <Text style={{ fontFamily: t.ui.regular, fontSize: 13, color: t.c.muted, marginTop: 2 }}>
                  {option.sub}
                </Text>
              ) : null}
            </View>
            {selected ? <Ionicons name="checkmark" size={20} color={t.accent.main} /> : null}
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}

export function ProgressRing({
  size,
  progress,
  stroke = 3,
  children,
}: {
  size: number;
  progress: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const t = useAppTheme();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={t.c.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={t.accent.main}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {children}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  danger,
  flex,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  flex?: boolean;
}) {
  const t = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        flex: flex ? 1 : undefined,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: danger ? 'transparent' : t.accent.main,
        borderWidth: danger ? 1 : 0,
        borderColor: t.c.danger,
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: t.ui.semibold,
          fontSize: 15,
          color: danger ? t.c.danger : t.accent.on,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: IconName;
  title: string;
  body?: string;
}) {
  const t = useAppTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32 }}>
      <Ionicons name={icon} size={36} color={t.c.faint} />
      <Text
        style={{
          fontFamily: t.display.italic,
          fontSize: 16,
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
