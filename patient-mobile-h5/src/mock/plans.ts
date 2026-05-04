import type { HealthPlan, HealthPlanSummary, HealthTask } from "./types";

export const healthPlanSummary: HealthPlanSummary = {
  title: "今日健康计划",
  description: "先保留计划执行主流程，细节后续按新 H5 体系重做。",
  completionText: "保持当前节奏，晚间继续完成待执行事项。",
};

export const healthPlans: HealthPlan[] = [
  {
    id: "plan-90",
    title: "90 天代谢健康管理",
    period: "第 2 阶段 · 第 18 天",
    progress: 42,
    status: "进行中",
    focus: "稳定早餐结构，保持餐后血糖记录频率。",
    actions: ["早餐后血糖记录", "晚餐后步行 20 分钟", "睡前用药确认"],
  },
  {
    id: "plan-sleep",
    title: "睡眠节律改善计划",
    period: "7 天轻量执行",
    progress: 68,
    status: "跟进中",
    focus: "减少睡前屏幕刺激，观察入睡时长变化。",
    actions: ["23:00 前准备入睡", "记录夜醒次数", "晨起填写精神状态"],
  },
];

export const todayHealthTasks: HealthTask[] = [
  { id: "task-breakfast", title: "早餐后血糖记录", time: "08:30", status: "done" },
  { id: "task-walk", title: "晚餐后步行 20 分钟", time: "19:30", status: "todo" },
  { id: "task-medicine", title: "睡前用药确认", time: "22:00", status: "todo" },
];
