import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  RichText,
  useEditorBridge,
  useBridgeState,
} from '@10play/tentap-editor';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';

export type RichTextEditorRef = {
  getHTML: () => Promise<string>;
  setContent: (html: string) => void;
  focus: () => void;
  blur: () => void;
};

type Props = {
  initialContent?: string;
  autofocus?: boolean;
  keyboardVerticalOffset?: number;
  onReady?: () => void;
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const RichTextEditor = forwardRef<RichTextEditorRef, Props>(
  (
    {
      initialContent = '<p></p>',
      autofocus = true,
      keyboardVerticalOffset = 0,
      onReady,
    },
    ref
  ) => {
    const t = useAppTheme();

    const editor = useEditorBridge({
      autofocus,
      avoidIosKeyboard: true,
      initialContent,
      theme: {
        webview: {
          backgroundColor: t.c.bg,
        },
      },
    });

    const state = useBridgeState(editor);

    useEffect(() => {
      onReady?.();
    }, [editor, onReady]);

    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => editor.getHTML(),
        setContent: (html: string) => editor.setContent(html),
        focus: () => editor.focus(),
        blur: () => editor.blur(),
      }),
      [editor]
    );

    const headingLevel = (state.headingLevel || 0) as number;

    const toolbarButtons = [
      {
        key: 'undo',
        icon: 'arrow-undo-outline' as const,
        label: undefined as string | undefined,
        disabled: false,
        active: false,
        onPress: () => {
          editor.undo();
        },
      },
      {
        key: 'redo',
        icon: 'arrow-redo-outline' as const,
        label: undefined as string | undefined,
        disabled: false,
        active: false,
        onPress: () => {
          editor.redo();
        },
      },
      {
        key: 'heading',
        icon: undefined as any,
        label: 'H',
        disabled: false,
        active: headingLevel > 0,
        onPress: () => {
          if (headingLevel === 0) {
            editor.toggleHeading(1);
          } else if (headingLevel < 6) {
            editor.toggleHeading((headingLevel + 1) as HeadingLevel);
          } else {
            editor.toggleHeading(6);
          }
        },
      },
      {
        key: 'underline',
        icon: undefined as any,
        label: 'U',
        disabled: false,
        active: state.isUnderlineActive,
        onPress: () => {
          editor.toggleUnderline();
        },
      },
      {
        key: 'bulletList',
        icon: 'list-outline' as const,
        label: undefined as string | undefined,
        disabled: false,
        active: state.isBulletListActive,
        onPress: () => {
          editor.toggleBulletList();
        },
      },
      {
        key: 'orderedList',
        icon: 'reorder-four-outline' as const,
        label: undefined as string | undefined,
        disabled: false,
        active: state.isOrderedListActive,
        onPress: () => {
          editor.toggleOrderedList();
        },
      },
      {
        key: 'link',
        icon: 'link-outline' as const,
        label: undefined as string | undefined,
        disabled: false,
        active: state.isLinkActive,
        onPress: () => {
          editor.setLink('https://');
        },
      },
    ];

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.editorWrapper}>
          <RichText editor={editor} />
        </View>

        <View
          style={[
            styles.toolbar,
            { backgroundColor: t.c.bg, borderTopColor: t.c.border },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolbarContent}
          >
            {toolbarButtons.map((btn) => (
              <Pressable
                key={btn.key}
                onPress={btn.onPress}
                disabled={btn.disabled}
                style={styles.toolbarButton}
              >
                {btn.label ? (
                  <Text
                    style={{
                      color: btn.disabled
                        ? t.c.muted
                        : btn.active
                        ? t.accent.main
                        : t.c.text,
                      fontSize: 16,
                      fontWeight: '600',
                      textDecorationLine:
                        btn.key === 'underline' ? 'underline' : 'none',
                    }}
                  >
                    {btn.label}
                  </Text>
                ) : (
                  <Ionicons
                    name={btn.icon}
                    size={22}
                    color={
                      btn.disabled
                        ? t.c.muted
                        : btn.active
                        ? t.accent.main
                        : t.c.text
                    }
                  />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  editorWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  toolbar: {
    height: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toolbarContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  toolbarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});