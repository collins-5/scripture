import type { RootProps } from "@rn-primitives/tabs";
import * as TabsPrimitive from "@rn-primitives/tabs";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, PressableStateCallbackType } from "react-native";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const PrimitiveTabs = TabsPrimitive.Root;

function Tabs({ className, ...props }: RootProps) {
  return (
    <PrimitiveTabs
      className={cn(
        "flex-1 mx-auto w-full max-w-[400px] flex-col items-center gap-1.5",
        className
      )}
      {...props}
    />
  );
}

const tabListVariants = cva(
  "native:h-12 native:px-1.5 h-10 flex-row items-center p-1 web:inline-flex",
  {
    variants: {
      variant: {
        pills: "rounded-full bg-muted",
        noPills: "border-b border-border w-full",
      },
      align: {
        center: "self-center",
        start: "self-start",
      },
    },
    defaultVariants: {
      variant: "pills",
      align: "center",
    },
  }
);

type VariantContextType = {
  variant: "pills" | "noPills";
};

const VariantContext = React.createContext<VariantContextType>({
  variant: "pills",
});

const useVariantContext = () => React.useContext(VariantContext);

interface TabsListProps extends TabsPrimitive.ListProps {
  variant?: "pills" | "noPills";
  align?: "center" | "start";
  className?: string;
  children?: React.ReactNode;
}

function TabsList({
  className,
  variant = "pills",
  align = "center",
  children,
  ...props
}: TabsListProps) {
  const alignment = variant === "noPills" && !align ? "start" : align;

  return (
    <VariantContext.Provider value={{ variant }}>
      <TabsPrimitive.List
        className={cn(
          tabListVariants({ variant, align: alignment }),
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    </VariantContext.Provider>
  );
}

const tabTriggerVariants = cva(
  "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium shadow-none web:whitespace-nowrap web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        pills: "rounded-full",
        noPills: "bg-transparent pb-2",
      },
      disabled: {
        true: "opacity-50 web:pointer-events-none",
      },
      active: {
        true: "shadow-foreground/10",
      },
    },
    compoundVariants: [
      {
        variant: "pills",
        active: true,
        class: "bg-primary",
      },
      {
        variant: "noPills",
        active: true,
        class: "border-b-2 border-primary -mb-0.5",
      },
    ],
    defaultVariants: {
      variant: "pills",
      active: false,
    },
  }
);

const tabTriggerTextVariants = cva(
  "text-sm native:text-base font-medium text-muted-foreground web:transition-all",
  {
    variants: {
      variant: {
        pills: "",
        noPills: "",
      },
      active: {
        true: "text-primary shadow-lg shadow-foreground/10",
      },
    },
    compoundVariants: [
      {
        variant: "pills",
        active: true,
        class: "text-primary-foreground",
      },
      {
        variant: "noPills",
        active: true,
        class: "text-primary",
      },
    ],
    defaultVariants: {
      variant: "pills",
      active: false,
    },
  }
);

interface TabsTriggerProps extends TabsPrimitive.TriggerProps {
  children: React.ReactNode;
}

function TabsTrigger({ className, children, ...props }: TabsTriggerProps) {
  const { value } = TabsPrimitive.useRootContext();
  const { variant } = useVariantContext();

  const disabled = props.disabled;
  const active = props.value === value;

  const renderChildren = (
    child:
      | React.ReactNode
      | ((state: PressableStateCallbackType) => React.ReactNode)
  ) => {
    if (typeof child === "function") {
      return child({ pressed: false });
    }
    return child;
  };

  return (
    <TextClassContext.Provider
      value={cn(tabTriggerTextVariants({ variant, active }))}
    >
      <TabsPrimitive.Trigger
        className={cn(
          tabTriggerVariants({ variant, disabled, active }),
          className
        )}
        {...props}
      >
        <Text>{renderChildren(children)}</Text>
      </TabsPrimitive.Trigger>
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.ContentProps & {
  ref?: React.RefObject<TabsPrimitive.ContentRef>;
}) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "flex-1",
        "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };