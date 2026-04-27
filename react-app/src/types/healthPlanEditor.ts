import type { Edge, Node, XYPosition } from "@xyflow/react";

export type HealthPlanEditorSidebarTab = "basic-info" | "health-checkins" | "summary-report";

export type HealthPlanEditorCheckInType =
  | "diet"
  | "water"
  | "exercise"
  | "sleep"
  | "psychology"
  | "nutrition"
  | "weight"
  | "waist"
  | "hip"
  | "bodyFat"
  | "bloodPressure";

export type HealthPlanEditorCheckInFrequency = "daily" | "weekly";

export type HealthPlanEditorCheckInPlanItem = {
  id: string;
  name: string;
  type: HealthPlanEditorCheckInType;
  description: string;
  startDay: number;
  endDay: number;
  frequency: HealthPlanEditorCheckInFrequency;
  timesPerPeriod: number;
  pushEnabled: boolean;
  pushDays: number[];
  pushTimes: string[];
};

export type HealthPlanEditorPlanMeta = {
  name: string;
  alias: string;
  description: string;
  team: string;
  patientTag: string;
  baselineType: string;
};

export type HealthPlanEditorTaskCategory =
  | "education"
  | "summary-report"
  | "return-visit"
  | "follow-up";

export type HealthPlanEditorConditionOption = {
  id: string;
  label: string;
};

export type HealthPlanEditorTaskNodeData = {
  kind: "task";
  category: HealthPlanEditorTaskCategory;
  headerTitle: string;
  taskName: string;
  contentLabel: string | null;
  summaryContent?: string;
  summaryTemplate?: string | null;
  startDay: number | null;
  durationDays: number | null;
  repeatEnabled: boolean;
  repeatEveryDays: number | null;
  repeatCount: number | null;
  pushEnabled?: boolean;
  pushTime?: string | null;
  accent: "violet" | "blue" | "green" | "orange";
};

export type HealthPlanEditorConditionNodeData = {
  kind: "condition";
  headerTitle: string;
  conditions: HealthPlanEditorConditionOption[];
};

export type HealthPlanEditorStartNodeData = {
  kind: "start";
};

export type HealthPlanEditorNodeData =
  | HealthPlanEditorTaskNodeData
  | HealthPlanEditorConditionNodeData
  | HealthPlanEditorStartNodeData;

export type HealthPlanEditorNode = Node<HealthPlanEditorNodeData>;
export type HealthPlanEditorEdge = Edge;

export type HealthPlanEditorDraft = {
  meta: HealthPlanEditorPlanMeta;
  nodes: HealthPlanEditorNode[];
  edges: HealthPlanEditorEdge[];
  checkInPlanItems: HealthPlanEditorCheckInPlanItem[];
};

export type HealthPlanEditorLibraryItem = {
  id: string;
  title: string;
  description: string;
  kind: "task" | "condition";
  category?: HealthPlanEditorTaskCategory;
  nodeData: HealthPlanEditorTaskNodeData | HealthPlanEditorConditionNodeData;
  defaultPosition: XYPosition;
};
