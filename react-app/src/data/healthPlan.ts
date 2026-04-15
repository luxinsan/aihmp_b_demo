import type {
  HealthPlanCheckIn,
  HealthPlanHeader,
  HealthPlanTask,
} from "../types/healthPlan";

export const healthPlanHeader: HealthPlanHeader = {
  title: "28天减重管理计划",
  status: "执行中",
  manager: "心血管健康管理组",
  description:
    "围绕体重下降、腰围控制和生活方式稳定三个方向制定 28 天干预计划，结合日常打卡、随访任务和阶段复盘，帮助患者逐步建立可持续的减重执行节奏。",
  summary:
    "患者近期体重控制良好，血压波动在正常范围内。建议继续保持当前饮食结构，可适当增加有氧运动时长。",
};

export const healthPlanCheckIns: HealthPlanCheckIn[] = [
  {
    id: "weight",
    title: "每日空腹体重打卡",
    description: "请在早晨空腹状态下测量并记录体重",
    schedule: "每日早晨一次",
    status: "执行中",
  },
  {
    id: "pressure",
    title: "每日血压打卡",
    description: "测量早晚血压并记录",
    schedule: "每日早晚各一次",
    status: "已结束",
  },
  {
    id: "sugar",
    title: "每日血糖打卡",
    description: "记录三餐前后血糖值",
    schedule: "每日早中晚各一次",
    status: "未开始",
  },
  {
    id: "medicine",
    title: "每日用药打卡",
    description: "确认是否按时服用降糖/降压药",
    schedule: "每日早晚各一次",
    status: "执行中",
  },
];

export const healthPlanTasks: HealthPlanTask[] = [
  {
    id: "visit-initial",
    category: "健康回访",
    categoryTone: "green",
    title: "首次建档随访",
    dateRange: "2025/03/01 至 2025/03/02",
    status: "已完成",
  },
  {
    id: "science-diet",
    category: "科普宣教",
    categoryTone: "purple",
    title: "糖尿病饮食指南",
    dateRange: "2025/03/05 至 2025/03/10",
    status: "已终止",
  },
  {
    id: "visit-week-1",
    category: "健康回访",
    categoryTone: "green",
    title: "减重术后第一周随访",
    dateRange: "2025/04/01 至 2025/04/05",
    status: "进行中",
    detail: "减重术后随访表",
    logs: [
      {
        id: "visit-week-1-log-1",
        time: "2025/04/01 08:00",
        actor: "系统",
        action: "生成随访任务",
      },
    ],
    actions: ["代填", "标记完成"],
    expanded: true,
  },
  {
    id: "exam-offline",
    category: "复诊提醒",
    categoryTone: "orange",
    title: "线下复诊化验",
    dateRange: "2025/04/15 至 2025/04/16",
    status: "未开始",
  },
];
