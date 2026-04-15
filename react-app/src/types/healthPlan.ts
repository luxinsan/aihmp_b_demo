export type HealthPlanStatus = "执行中" | "已结束" | "未开始";

export type HealthPlanCheckInStatus = "执行中" | "已结束" | "未开始";

export type HealthPlanTaskStatus = "已完成" | "已终止" | "进行中" | "未开始";

export type HealthPlanHeader = {
  title: string;
  status: HealthPlanStatus;
  manager: string;
  description: string;
  summary: string;
};

export type HealthPlanCheckIn = {
  id: string;
  title: string;
  description: string;
  schedule: string;
  status: HealthPlanCheckInStatus;
};

export type HealthPlanLogEntry = {
  id: string;
  time: string;
  actor: string;
  action: string;
};

export type HealthPlanTask = {
  id: string;
  category: string;
  categoryTone: "green" | "purple" | "orange";
  title: string;
  dateRange: string;
  status: HealthPlanTaskStatus;
  detail?: string;
  logs?: HealthPlanLogEntry[];
  actions?: string[];
  expanded?: boolean;
};
