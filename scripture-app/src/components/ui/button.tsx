// components/ui/button/index.tsx
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import Icon, { IconProps } from "@/components/ui/icon";
import { Text, TextClassContext } from "@/components/ui/text";
import { useThemeColors } from "@/hooks/useThemeColors";
import { cn, withModifiedProps } from "@/lib/utils";

const buttonVariants = cva(
  "group flex items-center justify-center web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "web:hover:opacity-90 active:opacity-90",
        destructive: "web:hover:opacity-90 active:opacity-90",
        outline:
          "border-2 border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        secondary: "web:hover:opacity-80 active:opacity-80",
        ghost:
          "web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 px-3",
        lg: "h-11 px-8 native:h-14",
        icon: "p-[8px]",
      },
      width: {
        default: "w-fit",
        full: "w-full",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl", 
        "3xl": "rounded-3xl",  
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
      rounded: "default",
    },
  }
);

const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium web:transition-colors",
  {
    variants: {
      variant: {
        default: "", 
        destructive: "",
        outline: "group-active:text-accent-foreground",
        secondary: "group-active:text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: "group-active:underline",
      },
      size: {
        default: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    text?: string;
    textClassName?: string;
    leftIcon?: React.ReactElement<IconProps>;
    rightIcon?: React.ReactElement<IconProps>;
    iconProps?: IconProps;
    loading?: boolean;
    rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  };

function Button({
  ref,
  className,
  style,
  children,
  variant = "default",
  text,
  textClassName,
  width,
  size,
  rounded,
  iconProps,
  leftIcon,
  loading,
  rightIcon,
  ...props
}: ButtonProps) {
  const { brand, surface, border, text: themeText } = useThemeColors();
  
  const ButtonIconsProps = {
    size: 22,
  };

  const isVectorIcon = iconProps && "name" in iconProps;
  
  const textClasses = cn(
    "web:pointer-events-none",
    buttonTextVariants({ variant, size }),
    textClassName
  );
  
  const activityIndicatorColor =
    variant === "outline" || variant === "ghost" || variant === "link"
      ? brand.primary
      : "#FFFFFF";
      
  const resolvedStyle = () => {
    switch (variant) {
      case "default":
        return { backgroundColor: brand.primary };
      case "destructive":
        return { backgroundColor: '#dc2626' };
      case "outline":
        return { backgroundColor: surface.card, borderColor: border.medium };
      case "secondary":
        return { backgroundColor: surface.muted };
      case "ghost":
        return { backgroundColor: 'transparent' };
      case "link":
        return { backgroundColor: 'transparent' };
      default:
        return {};
    }
  };
        
  const pressableStyle = typeof style === 'function'
    ? (state: Parameters<typeof style>[0]) => [resolvedStyle(), style(state)]
    : [resolvedStyle(), style];

  const resolvedTextStyle = {
    color: 
      variant === "default" ? "#FFFFFF" :
      variant === "destructive" ? "#FFFFFF" : 
      variant === "outline" ? brand.primary :
      variant === "secondary" ? themeText.primary :
      variant === "ghost" ? brand.primary :
      variant === "link" ? brand.primary :
      themeText?.primary || "#000000"
  };

  return (
    <TextClassContext.Provider value={textClasses}>
      <Pressable
        className={cn(
          "flex-row gap-2",
          buttonVariants({ variant, size, width, rounded }),
          className,
          props.disabled && "opacity-50 web:pointer-events-none"
        )}
        ref={ref}
        style={pressableStyle}
        role="button"
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={activityIndicatorColor} />
        ) : (
          <>
            {leftIcon &&
              withModifiedProps<IconProps>(leftIcon, ButtonIconsProps)}
            
            {text && (
              <Text className={textClasses} style={resolvedTextStyle}>
                {text}
              </Text>
            )}
            
            {children}
            
            {rightIcon &&
              withModifiedProps<IconProps>(rightIcon, ButtonIconsProps)}
            
            {iconProps && (
              isVectorIcon ? (
                <Icon {...{ ...ButtonIconsProps, className, ...iconProps }} />
              ) : (
                <Icon {...{ className, ...iconProps }} />
              )
            )}
          </>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };