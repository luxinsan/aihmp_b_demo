import type { ReactNode } from "react";
import { View } from "@tarojs/components";

type BasicProps = {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
};

type PageSectionProps = BasicProps & {
  padded?: boolean;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function PageContainer({ children, className, onClick }: BasicProps) {
  return (
    <View className={joinClassNames("page-container", className)} onClick={onClick}>
      {children}
    </View>
  );
}

export function PageSection({ children, className, onClick, padded = true }: PageSectionProps) {
  return (
    <View className={joinClassNames("page-section", padded ? "is-padded" : undefined, className)} onClick={onClick}>
      {children}
    </View>
  );
}

export function PageSectionRow({ children, className, onClick }: BasicProps) {
  return (
    <View className={joinClassNames("page-section-row", className)} onClick={onClick}>
      {children}
    </View>
  );
}

export function PageSectionCell({ children, className, onClick }: BasicProps) {
  return (
    <View className={joinClassNames("page-section-cell", className)} onClick={onClick}>
      {children}
    </View>
  );
}
