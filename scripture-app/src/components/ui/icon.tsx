import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ImageProps } from "expo-image";
import { Text as RNText } from "react-native";
import { cn } from "@/lib/utils";

export type IconNames = Extract<
  keyof typeof MaterialCommunityIcons.glyphMap,
  | "book-open-variant"
  | "translate"
  | "bell-ring-outline"
  | "notebook-edit-outline"
  | "bookmark-check-outline"
  | "check-circle-outline"
  | "eye-outline"
  | "eye-off-outline"
  | "magnify"
  | "arrow-left"
  | "arrow-right"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "chevron-up"
  | "close"
  | "plus"
  | "pencil"
  | "trash-can-outline"
  | "cog-outline"
  | "account-outline"
  | "lock-outline"
  | "email-outline"
  | "logout"
  | "delete-outline"
  | "menu"
  | "home"
  | "book"
  | "search"
  | "journal"
  | "alert-circle-outline"
  | "home-heart"
>;

type ImageIconProps = {
  name: IconNames;
  size?: number;
  className?: string;
  color?: string;
};

export type IconProps = ImageIconProps | ImageProps;

export default function Icon({ className, ...props }: IconProps) {
  const isVectorIcon = "name" in props;
  const isImageIcon = "source" in props;

  const { width = 24, height = 24 } = props as any;

  if (isVectorIcon) {
    const { color: propColor, size = 24, name, ...rest } = props as ImageIconProps;
    
    return (
      <RNText
        className={cn(className)}
        style={{ 
          backgroundColor: 'transparent', 
          lineHeight: size,
        }}
      >
        <MaterialCommunityIcons 
          name={name}
          size={size}
          color={propColor}
          {...rest}
        />
      </RNText>
    );
  }

  if (isImageIcon) {
    return (
      <Image
        {...(props as ImageProps)}
        style={{
          width,
          height,
        }}
      />
    );
  }

  return null;
}
