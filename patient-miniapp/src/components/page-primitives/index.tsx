import type { ReactNode } from "react";
import { Text, View } from "@tarojs/components";

type Tone = "blue" | "green" | "purple" | "orange" | "red" | "gray";

type BasicProps = {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
};

type PageBadgeProps = BasicProps & {
  tone?: Tone;
};

type PageActionProps = BasicProps & {
  disabled?: boolean;
};

type PageListItemProps = {
  label: ReactNode;
  value?: ReactNode;
  showArrow?: boolean;
  className?: string;
  onClick?: () => void;
};

type PageChipProps = {
  label: ReactNode;
  meta?: ReactNode;
  avatar?: ReactNode;
  active?: boolean;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
};

type PageMetricCardProps = {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  className?: string;
};

type PageSectionHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

type PageTaskCardProps = {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  statusTone?: Tone;
  className?: string;
};

function joinClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function PageBadge({ children, className, tone = "gray" }: PageBadgeProps) {
  return <Text className={joinClassNames("page-badge", `tone-${tone}`, className)}>{children}</Text>;
}

export function PageAction({ children, className, disabled, onClick }: PageActionProps) {
  return (
    <View
      className={joinClassNames("page-action", disabled ? "is-disabled" : undefined, className)}
      onClick={disabled ? undefined : onClick}
    >
      <Text className="page-action-text">{children}</Text>
    </View>
  );
}

export function PageListItem({ label, value, showArrow = true, className, onClick }: PageListItemProps) {
  return (
    <View className={joinClassNames("page-list-item", className)} onClick={onClick}>
      <Text className="page-list-item-label">{label}</Text>
      <View className="page-list-item-side">
        {value ? <Text className="page-list-item-value">{value}</Text> : null}
        {showArrow ? <Text className="page-list-item-arrow">›</Text> : null}
      </View>
    </View>
  );
}

export function PageChip({ label, meta, avatar, active, compact = true, className, onClick }: PageChipProps) {
  return (
    <View
      className={joinClassNames(
        "page-chip",
        compact ? "is-compact" : undefined,
        active ? "is-active" : undefined,
        className,
      )}
      onClick={onClick}
    >
      {avatar ? <View className="page-chip-avatar">{avatar}</View> : null}
      <View className="page-chip-copy">
        <Text className="page-chip-label">{label}</Text>
        {meta ? <Text className="page-chip-meta">{meta}</Text> : null}
      </View>
    </View>
  );
}

export function PageMetricCard({ label, value, unit, className }: PageMetricCardProps) {
  return (
    <View className={joinClassNames("page-metric-card", className)}>
      <Text className="page-metric-card-label">{label}</Text>
      <View className="page-metric-card-value-row">
        <Text className="page-metric-card-value">{value}</Text>
        {unit ? <Text className="page-metric-card-unit">{unit}</Text> : null}
      </View>
    </View>
  );
}

export function PageSectionHeader({ title, subtitle, className }: PageSectionHeaderProps) {
  return (
    <View className={joinClassNames("page-section-header", className)}>
      <View className="page-section-header-copy">
        <Text className="page-section-header-title">{title}</Text>
        {subtitle ? <Text className="page-section-header-subtitle">{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function PageTaskCard({ title, description, status, statusTone = "blue", className }: PageTaskCardProps) {
  return (
    <View className={joinClassNames("page-task-card", className)}>
      <View className="page-task-card-head">
        <Text className="page-task-card-title">{title}</Text>
        {status ? <PageBadge tone={statusTone}>{status}</PageBadge> : null}
      </View>
      {description ? <Text className="page-task-card-description">{description}</Text> : null}
    </View>
  );
}
