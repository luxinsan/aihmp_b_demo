import {
  checkInRecords,
  patientProfile,
  vitalMetrics,
} from "../mock";

type PatientMiniappProfile = {
  name: string;
  maskedName: string;
  avatar: string;
  gender: string;
  age: number;
  patientCode: string;
  phone: string;
};

type PatientMiniappPatient = {
  id: string;
  name: string;
  gender: string;
  age: number;
  relation: string;
};

type PatientMiniappNameValueItem = {
  id: string;
  label: string;
  value: string;
};

type PatientMiniappHomePageData = {
  teams: Array<{
    id: string;
    name: string;
  }>;
  patients: PatientMiniappPatient[];
  services: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  metrics: Array<{
    id: string;
    name: string;
    value: string;
    unit: string;
  }>;
  tasksByPatientId: Record<
    string,
    Array<{
      id: string;
      title: string;
      desc: string;
      status: string;
    }>
  >;
};

type PatientMiniappMinePageData = {
  profile: PatientMiniappProfile;
  shortcuts: PatientMiniappNameValueItem[];
  accountItems: PatientMiniappNameValueItem[];
  support: {
    title: string;
    description: string;
    actionText: string;
  };
};

const patientMiniappProfile = {
  name: patientProfile.identity.name,
  maskedName: patientProfile.identity.maskedName,
  avatar: patientProfile.identity.avatar,
  gender: patientProfile.identity.gender,
  age: patientProfile.identity.age,
  patientCode: patientProfile.identity.code,
  phone: patientProfile.identity.phone,
} satisfies PatientMiniappProfile;

const patientMiniappPatients = [
  {
    id: "p-001",
    name: patientProfile.identity.name,
    gender: patientProfile.identity.gender,
    age: patientProfile.identity.age,
    relation: "本人",
  },
  {
    id: "p-002",
    name: "李四",
    gender: "女",
    age: 63,
    relation: "配偶",
  },
  {
    id: "p-003",
    name: "王五",
    gender: "男",
    age: 71,
    relation: "父亲",
  },
] satisfies PatientMiniappPatient[];

export const patientMiniappHomePageData = {
  teams: [
    { id: "team-chronic", name: "瑞宁慢病管理团队" },
    { id: "team-follow-up", name: "康衡随访管理团队" },
    { id: "team-rehab", name: "嘉和术后康复团队" },
  ],
  patients: patientMiniappPatients,
  services: [
    { id: "pre-consult", name: "预问诊", icon: "问" },
    { id: "priority", name: "精准加号", icon: "号" },
    { id: "package", name: "健康服务包", icon: "包" },
    { id: "assessment", name: "健康评估", icon: "评" },
  ],
  metrics: [
    {
      id: "weight",
      name: "体重",
      value: vitalMetrics.find((metric) => metric.label === "体重")?.value.replace("kg", "") ?? "--",
      unit: "kg",
    },
    {
      id: "glucose",
      name: "血糖",
      value: "5.8",
      unit: "mmol/L",
    },
    {
      id: "pressure",
      name: "血压",
      value: vitalMetrics.find((metric) => metric.label === "血压")?.value.replace("mmHg", "") ?? "--",
      unit: "mmHg",
    },
  ],
  tasksByPatientId: {
    "p-001": [
      { id: "task-001", title: "早餐后血糖记录", desc: "今日 09:30 前完成一次录入", status: "待完成" },
      { id: "task-002", title: "降压药服药确认", desc: "午间用药后确认服药状态", status: "进行中" },
      { id: "task-003", title: "本周随访问卷", desc: "还剩 4 个问题待填写", status: "未开始" },
    ],
    "p-002": [
      { id: "task-004", title: "晨起血压打卡", desc: "今日需补充晨间血压数据", status: "待完成" },
      { id: "task-005", title: "饮食记录上传", desc: "晚餐后补充今日饮食照片", status: "进行中" },
      { id: "task-006", title: "步行训练提醒", desc: "建议完成 20 分钟轻量步行", status: "未开始" },
    ],
    "p-003": [
      { id: "task-007", title: "空腹血糖复测", desc: "明早 08:00 前完成并上传", status: "待完成" },
      { id: "task-008", title: "睡前血压确认", desc: "睡前补充一次血压测量", status: "未开始" },
      { id: "task-009", title: "康复训练反馈", desc: "今日训练后记录体感反馈", status: "进行中" },
    ],
  },
} satisfies PatientMiniappHomePageData;

export const patientMiniappMinePageData = {
  profile: patientMiniappProfile,
  shortcuts: [
    {
      id: "plan",
      label: "我的计划",
      value: "--",
    },
    {
      id: "checkin",
      label: "打卡记录",
      value: `${checkInRecords.length} 条`,
    },
    {
      id: "service",
      label: "服务记录",
      value: `${checkInRecords.length} 次`,
    },
  ],
  accountItems: [
    {
      id: "patient",
      label: "就诊人管理",
      value: `${patientMiniappPatients.length} 人`,
    },
    {
      id: "notification",
      label: "消息通知",
      value: "已开启",
    },
    {
      id: "privacy",
      label: "隐私与授权",
      value: "查看",
    },
  ],
  support: {
    title: "服务支持",
    description: "有打卡执行或服务订单问题时，可联系专属健康管家。",
    actionText: "联系健康管家",
  },
} satisfies PatientMiniappMinePageData;
