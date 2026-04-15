export type CheckInRecordType = "饮食打卡" | "运动打卡" | "用药打卡" | "体征打卡";

type CheckInRecordBase = {
  id: string;
  date: string;
  submittedAt: string;
  title: string;
  type: CheckInRecordType;
  summary: string;
};

export type DietCheckInRecord = CheckInRecordBase & {
  type: "饮食打卡";
  period: string;
  aiOverview: string;
  doctorComment: string;
  nutritionMetrics: Array<{
    id: string;
    label: string;
    value: string;
    unit: string;
    tone: "orange" | "blue" | "amber" | "green";
  }>;
  meals: Array<{
    id: string;
    label: string;
    time: string;
    note: string;
    dishes: string[];
    image: string;
  }>;
};

export type ExerciseCheckInRecord = CheckInRecordBase & {
  type: "运动打卡";
  duration: string;
  intensity: string;
  caloriesBurned: string;
  heartRateRange: string;
  items: string[];
  coachComment: string;
};

export type MedicationCheckInRecord = CheckInRecordBase & {
  type: "用药打卡";
  adherence: string;
  effectFeedback: string;
  riskFlag: string;
  items: Array<{
    id: string;
    name: string;
    dose: string;
    time: string;
    status: string;
  }>;
};

export type VitalsCheckInRecord = CheckInRecordBase & {
  type: "体征打卡";
  measurementWindow: string;
  trend: string;
  note: string;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    status: string;
  }>;
};

export type CheckInRecord =
  | DietCheckInRecord
  | ExerciseCheckInRecord
  | MedicationCheckInRecord
  | VitalsCheckInRecord;

function createMealImage(label: string, emoji: string, topColor: string, bottomColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${topColor}" />
          <stop offset="100%" stop-color="${bottomColor}" />
        </linearGradient>
        <radialGradient id="plate" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="78%" stop-color="#f4f1ea" />
          <stop offset="100%" stop-color="#ddd7ce" />
        </radialGradient>
      </defs>
      <rect width="640" height="420" rx="40" fill="url(#bg)" />
      <ellipse cx="320" cy="220" rx="170" ry="128" fill="url(#plate)" />
      <ellipse cx="320" cy="220" rx="132" ry="94" fill="#fbfaf7" />
      <circle cx="260" cy="190" r="34" fill="#e55c3c" />
      <circle cx="312" cy="180" r="30" fill="#5fae4d" />
      <circle cx="360" cy="214" r="38" fill="#f0c24d" />
      <circle cx="286" cy="248" r="28" fill="#7c4f35" />
      <circle cx="338" cy="254" r="31" fill="#f59a4a" />
      <circle cx="386" cy="174" r="22" fill="#74bf62" />
      <circle cx="236" cy="230" r="20" fill="#88c96b" />
      <circle cx="404" cy="240" r="18" fill="#cc5137" />
      <text x="320" y="232" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="84">${emoji}</text>
      <rect x="28" y="28" width="164" height="42" rx="21" fill="rgba(255,255,255,0.22)" />
      <text x="110" y="56" text-anchor="middle" fill="#ffffff" font-size="20" font-family="Arial, sans-serif">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const checkInRecords: CheckInRecord[] = [
  {
    id: "diet-2026-04-15",
    date: "2026-04-15",
    submittedAt: "2026-04-15 19:18",
    title: "三餐饮食记录",
    type: "饮食打卡",
    summary: "完成早餐、午餐、晚餐上传，整体热量控制良好。",
    period: "全天饮食",
    aiOverview: "糙米饭与鸡胸肉提供了较稳定的优质碳水和蛋白质来源，蔬菜摄入较充足，整体结构均衡，晚餐主食量偏少。",
    doctorComment: "整体执行较好，建议晚餐补充少量粗粮或豆类，避免夜间过度饥饿；早餐可继续维持高蛋白组合。",
    nutritionMetrics: [
      { id: "calories", label: "热量", value: "1555", unit: "Kcal", tone: "orange" },
      { id: "protein", label: "蛋白质", value: "82", unit: "g", tone: "blue" },
      { id: "fat", label: "脂肪", value: "46", unit: "g", tone: "amber" },
      { id: "carb", label: "碳水", value: "168", unit: "g", tone: "green" },
    ],
    meals: [
      {
        id: "breakfast",
        label: "早餐",
        time: "07:32",
        note: "优先补充蛋白质和膳食纤维。",
        dishes: ["水煮蛋 1 个", "全麦吐司 2 片", "牛油果番茄沙拉", "无糖豆浆 1 杯"],
        image: createMealImage("轻食沙拉", "🍳", "#8dbb8b", "#4d7c67"),
      },
      {
        id: "lunch",
        label: "午餐",
        time: "12:11",
        note: "主食比例控制正常，肉类较清淡。",
        dishes: ["糙米饭 1 小碗", "清蒸鳕鱼", "西兰花炒菌菇", "紫菜豆腐汤"],
        image: createMealImage("均衡午餐", "🍱", "#f2c078", "#c97a3d"),
      },
      {
        id: "dinner",
        label: "晚餐",
        time: "18:24",
        note: "晚餐量偏轻，适合当前减重阶段。",
        dishes: ["鸡胸肉蔬菜卷", "凉拌秋葵", "玉米半根", "奇异果 1 个"],
        image: createMealImage("低脂晚餐", "🍽️", "#6aa6d8", "#335f95"),
      },
    ],
  },
  {
    id: "exercise-2026-04-14",
    date: "2026-04-14",
    submittedAt: "2026-04-14 20:42",
    title: "晚间有氧训练",
    type: "运动打卡",
    summary: "完成快走与拉伸，训练节奏稳定。",
    duration: "45 分钟",
    intensity: "中等强度",
    caloriesBurned: "约 286 kcal",
    heartRateRange: "112 - 136 bpm",
    items: ["快走 35 分钟", "下肢拉伸 10 分钟", "训练后补水 500 ml"],
    coachComment: "心率区间控制较理想，可逐步加入 10 分钟上肢力量训练。",
  },
  {
    id: "medication-2026-04-12",
    date: "2026-04-12",
    submittedAt: "2026-04-12 20:06",
    title: "早晚用药确认",
    type: "用药打卡",
    summary: "早晚两次均已完成，未见漏服。",
    adherence: "100%",
    effectFeedback: "上午血压较稳定，未出现头晕或心悸。",
    riskFlag: "无异常提醒",
    items: [
      { id: "m-1", name: "缬沙坦胶囊", dose: "80mg", time: "07:40", status: "已服用" },
      { id: "m-2", name: "二甲双胍缓释片", dose: "500mg", time: "07:40", status: "已服用" },
      { id: "m-3", name: "二甲双胍缓释片", dose: "500mg", time: "20:05", status: "已服用" },
    ],
  },
  {
    id: "vitals-2026-04-10",
    date: "2026-04-10",
    submittedAt: "2026-04-10 07:18",
    title: "晨间体征测量",
    type: "体征打卡",
    summary: "体重与血压均较上周平稳，空腹血糖轻微偏高。",
    measurementWindow: "晨起空腹",
    trend: "体重连续 7 天下降 0.6 kg",
    note: "建议本周维持当前作息，晚餐后加 15 分钟步行。",
    metrics: [
      { id: "v-1", label: "体重", value: "70.4 kg", status: "达标" },
      { id: "v-2", label: "血压", value: "126/79 mmHg", status: "稳定" },
      { id: "v-3", label: "空腹血糖", value: "6.3 mmol/L", status: "偏高" },
      { id: "v-4", label: "静息心率", value: "69 次/min", status: "正常" },
    ],
  },
  {
    id: "diet-2026-04-08",
    date: "2026-04-08",
    submittedAt: "2026-04-08 18:47",
    title: "午晚餐饮食记录",
    type: "饮食打卡",
    summary: "午餐外食，晚餐按计划执行。",
    period: "午餐 + 晚餐",
    aiOverview: "外食场景下依然控制了主食和油脂比例，晚餐更偏轻食结构，但午餐蔬菜种类略少，纤维补充不足。",
    doctorComment: "本次外食控制意识较强，建议后续外食优先补充深色蔬菜，并减少酱汁使用。",
    nutritionMetrics: [
      { id: "calories", label: "热量", value: "1320", unit: "Kcal", tone: "orange" },
      { id: "protein", label: "蛋白质", value: "68", unit: "g", tone: "blue" },
      { id: "fat", label: "脂肪", value: "39", unit: "g", tone: "amber" },
      { id: "carb", label: "碳水", value: "141", unit: "g", tone: "green" },
    ],
    meals: [
      {
        id: "lunch-2",
        label: "午餐",
        time: "12:36",
        note: "外食场景下仍保持主食减半。",
        dishes: ["藜麦鸡肉能量碗", "清炒时蔬", "黑咖啡 1 杯"],
        image: createMealImage("外食能量碗", "🥙", "#c7a16e", "#80573c"),
      },
      {
        id: "dinner-2",
        label: "晚餐",
        time: "18:41",
        note: "晚餐较清淡，适合控制夜间负担。",
        dishes: ["番茄虾仁意面小份", "羽衣甘蓝沙拉", "无糖酸奶"],
        image: createMealImage("居家轻晚餐", "🍝", "#d99889", "#925b53"),
      },
    ],
  },
];
