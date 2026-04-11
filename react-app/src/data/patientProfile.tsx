import type { ReactNode } from "react";
import type {
  PatientArchiveSection,
  PatientContactItem,
  PatientMetric,
  PatientProfile,
} from "../types/patient";

export type PatientTabItem = {
  label: string;
  icon: ReactNode;
};

export const patientProfile: PatientProfile = {
  identity: {
    name: "陈小楠",
    maskedName: "陈*",
    avatar: "陈",
    gender: "女",
    age: 60,
    code: "SZ2410010001",
    phone: "130 0000 0000",
    idCard: "440522********0002",
  },
  archive: {
    maritalStatus: "已婚",
    fertilityStatus: "已育",
    education: "/",
    birthplace: "/",
    residence: "深圳",
    currentIllness: "桥本甲状腺炎",
    medicationHistory:
      "氯雷他定（偶尔，晚上咳嗽不舒服时）、乙酰天麻素片（偶尔，替代谷维素片）、谷维素片（100mg/片，偶尔，帮助睡眠）、褪黑素（4 月份开始每日）、免疫细胞、干细胞、中药、生物同源性荷尔蒙等（零期）",
    supplementHistory:
      "综合消化酶（1 片/次）、甘氨酸、胆汁流动支持（1 片/次）、氨糖（1500mg）、硫酸软骨素钠、椰皮素（1 片/次）、N-乙酰半胱氨酸 NAC（8 克，1000mg/片）、NMN、L-谷氨酰胺、锌硒维生素（每 2 片含锌 15mg，硒 200mcg，另含多种维生素与植物成分）、维生素 C（100mg/片，2 片/次）",
    medicalHistory: "疱疹",
    familyHistory: "父亲肝癌",
    diet: "规律用餐，每餐 8 成饱；蔬菜较少；常用油为土榨菜籽油",
    sleep: "睡眠 6-7 小时，偶有失眠",
    exercise: "散步：每周 5 次以上，平均每天 6000 步以上；高尔夫：每周 5 次以上，每次 60 分钟以上",
    smokingHistory: "已戒烟 5 年",
    drinkingHistory: "/",
    mentalHealth: "曾确诊轻度抑郁、焦虑症",
    otherNotes: "自诉咽部长期不适影响睡眠",
    height: "181.4cm",
    weight: "71.2kg",
    bmi: "21.6",
    heartRate: "67 次/min",
    waist: "85cm",
    hip: "98cm",
    waistHipRatio: "0.87",
    bloodPressure: "129/78mmHg",
  },
};

export const patientTabs: readonly PatientTabItem[] = [
  {
    label: "基本信息",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="3.25" />
        <path d="M8.5 9h7" />
        <path d="M8.5 12h7" />
        <path d="M8.5 15h4.5" />
      </svg>
    ),
  },
  {
    label: "病历资料",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5.75h7.25l2.75 2.75v8.75a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z" />
        <path d="M15.25 5.75v3h3" />
        <path d="M9 12h6" />
        <path d="M9 15h4.5" />
      </svg>
    ),
  },
  {
    label: "健康计划",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19.25s-5.75-3.35-5.75-8.1A3.4 3.4 0 0 1 9.65 7.75c.98 0 1.93.43 2.35 1.18.42-.75 1.37-1.18 2.35-1.18a3.4 3.4 0 0 1 3.4 3.4c0 4.75-5.75 8.1-5.75 8.1Z" />
      </svg>
    ),
  },
  {
    label: "报告文档",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4.75" width="14" height="14.5" rx="2.75" />
        <path d="M8.5 9h7" />
        <path d="M8.5 12h7" />
        <path d="M8.5 15h5.25" />
      </svg>
    ),
  },
  {
    label: "量表记录",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="11.5" width="2.75" height="5.75" rx="1.25" />
        <rect x="10.625" y="8.25" width="2.75" height="9" rx="1.25" />
        <rect x="16.25" y="5" width="2.75" height="12.25" rx="1.25" />
      </svg>
    ),
  },
] as const;

export const patientContactItems: PatientContactItem[] = [
  {
    label: "联系电话",
    value: patientProfile.identity.phone,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 4.75h9a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2Z" />
        <path d="M9 7.75h6" />
        <path d="M11.2 16.75h1.6" />
      </svg>
    ),
  },
  {
    label: "身份证号",
    value: patientProfile.identity.idCard,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.75" y="6.25" width="14.5" height="11.5" rx="2.5" />
        <path d="M8 10h4.25" />
        <path d="M8 13.25h7.5" />
        <circle cx="16.6" cy="10.15" r="1.2" />
      </svg>
    ),
  },
];

export const vitalMetrics: PatientMetric[] = [
  { label: "身高", value: patientProfile.archive.height },
  { label: "体重", value: patientProfile.archive.weight },
  { label: "BMI", value: patientProfile.archive.bmi },
  { label: "心率", value: patientProfile.archive.heartRate },
  { label: "血压", value: patientProfile.archive.bloodPressure },
  { label: "腰臀比", value: patientProfile.archive.waistHipRatio },
];

export const archiveSections: PatientArchiveSection[] = [
  {
    title: "基础档案",
    fields: [
      { label: "客户编号", value: patientProfile.identity.code },
      { label: "婚育情况", value: `${patientProfile.archive.maritalStatus} / ${patientProfile.archive.fertilityStatus}` },
      { label: "常住地", value: patientProfile.archive.residence },
      { label: "现病史", value: patientProfile.archive.currentIllness },
      { label: "既往史", value: patientProfile.archive.medicalHistory },
      { label: "家族史", value: patientProfile.archive.familyHistory },
    ],
  },
  {
    title: "生活方式",
    fields: [
      { label: "饮食", value: patientProfile.archive.diet },
      { label: "睡眠", value: patientProfile.archive.sleep },
      { label: "运动", value: patientProfile.archive.exercise },
      { label: "吸烟史", value: patientProfile.archive.smokingHistory },
      { label: "饮酒史", value: patientProfile.archive.drinkingHistory },
      { label: "心理健康", value: patientProfile.archive.mentalHealth },
    ],
  },
  {
    title: "当前补充信息",
    fields: [
      { label: "用药史", value: patientProfile.archive.medicationHistory },
      { label: "补充剂", value: patientProfile.archive.supplementHistory },
      { label: "其他备注", value: patientProfile.archive.otherNotes },
    ],
  },
];
