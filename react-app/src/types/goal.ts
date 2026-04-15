export type GoalDimensionId =
  | "blood-pressure"
  | "blood-sugar"
  | "blood-lipid"
  | "uric-acid"
  | "body-shape";

export type GoalMetricLevel = "核心指标" | "辅助指标";

export type GoalMetricTemplate = {
  id: string;
  dimensionId: GoalDimensionId;
  dimensionLabel: string;
  level: GoalMetricLevel;
  label: string;
  unit: string;
  baseline: string;
  statusGuide: string[];
  dataSource: string;
  currentPlaceholder: string;
  targetPlaceholder: string;
  latestValue: string;
  latestRecordedAt: string;
  notes: string[];
};

export type PatientGoalConfig = {
  metricId: string;
  enabled: boolean;
  currentValue: string;
  targetValue: string;
};
