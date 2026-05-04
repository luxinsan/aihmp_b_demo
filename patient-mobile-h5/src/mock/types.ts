export type Team = {
  id: string;
  name: string;
};

export type Service = {
  id: string;
  name: string;
  icon: string;
};

export type HealthPlan = {
  id: string;
  title: string;
  period: string;
  progress: number;
  status: string;
  focus: string;
  actions: string[];
};

export type HealthTask = {
  id: string;
  title: string;
  time: string;
  status: "done" | "todo";
};

export type HealthPlanSummary = {
  title: string;
  description: string;
  completionText: string;
};

export type MineProfile = {
  name: string;
  gender: string;
  age: number;
  code: string;
  phone: string;
};

export type MineShortcut = {
  id: string;
  label: string;
  value: string;
};

export type MineCell = {
  id: string;
  label: string;
  value?: string;
  icon: string;
};

export type MineSupport = {
  title: string;
  description: string;
  actionText: string;
};
