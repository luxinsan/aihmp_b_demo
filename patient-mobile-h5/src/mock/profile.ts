import type { MineCell, MineProfile, MineShortcut, MineSupport } from "./types";

export const mineProfile: MineProfile = {
  name: "陈小楠",
  gender: "女",
  age: 60,
  code: "SZ2410010001",
  phone: "130 0000 0000",
};

export const mineShortcuts: MineShortcut[] = [
  { id: "plans", label: "我的计划", value: "2" },
  { id: "checkins", label: "打卡记录", value: "18" },
  { id: "services", label: "服务记录", value: "6" },
];

export const mineCells: MineCell[] = [
  { id: "patients", label: "就诊人管理", value: "3 人", icon: "friends-o" },
  { id: "notification", label: "消息通知", value: "已开启", icon: "bell" },
  { id: "privacy", label: "隐私与授权", value: "查看", icon: "shield-o" },
  { id: "support", label: "联系健康管家", icon: "service-o" },
];

export const mineSupport: MineSupport = {
  title: "服务支持",
  description: "有打卡执行或服务订单问题时，可联系专属健康管家。",
  actionText: "联系健康管家",
};
