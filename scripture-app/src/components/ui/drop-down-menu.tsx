import { Picker } from "@react-native-picker/picker";
import { View, StyleProp, ViewStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";

// Define variants for the wrapper View (using ViewStyle for NativeWind)
const dropdownMenuVariants = cva(
  "border border-input bg-background rounded-md",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-input bg-transparent",
      },
      size: {
        default: "py-2 px-3",
        sm: "py-1 px-2",
        lg: "py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define props interface
interface DropdownMenuProps extends VariantProps<typeof dropdownMenuVariants> {
  items: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const DropdownMenu = forwardRef<Picker<string>, DropdownMenuProps>(
  (
    {
      items,
      selectedValue,
      onSelect,
      placeholder = "Select an option",
      className,
      accessibilityLabel,
      variant,
      size,
      style,
    },
    ref
  ) => {
    const { text } = useThemeColors();

    return (
      <View
        className={cn(dropdownMenuVariants({ variant, size }), className)}
        style={style}
      >
        <Picker
          ref={ref}
          selectedValue={selectedValue}
          onValueChange={(value) => onSelect(value)}
          style={{ width: "100%", color: text.dark }}
          dropdownIconColor={text.dark}
          accessibilityLabel={accessibilityLabel}
        >
          <Picker.Item label={placeholder} value="" enabled={false} />
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

export { DropdownMenu };
