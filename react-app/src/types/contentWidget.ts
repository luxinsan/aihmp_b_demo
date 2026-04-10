export type ContentWidgetType = "image" | "table" | "radar-chart";

export type ContentWidgetMetric = {
  label: string;
  value: number | null;
};

export type ContentWidget = {
  id: string;
  type: ContentWidgetType;
  title: string;
  caption: string;
  assetLabel?: string;
  assetSrc?: string;
  columns?: string[];
  rows?: string[][];
  metrics?: ContentWidgetMetric[];
};
