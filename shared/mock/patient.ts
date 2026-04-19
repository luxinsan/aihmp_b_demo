import type {
  PatientArchiveSection,
  PatientMetric,
  PatientProfile,
  SharedPatientContactItem,
  SharedPatientTab,
} from "../types/patient";
import patientProfileData from "./patient-profile.json";

export const patientProfile: PatientProfile = patientProfileData as PatientProfile;

export const sharedPatientTabs: readonly SharedPatientTab[] = [
  { id: "basic-info", label: "基本信息" },
  { id: "archive", label: "病历资料" },
  { id: "health-plan", label: "健康计划" },
  { id: "reports", label: "报告文档" },
  { id: "questionnaires", label: "量表记录" },
] as const;

export const sharedPatientContactItems: SharedPatientContactItem[] = [
  { id: "phone", label: "联系电话", value: patientProfile.identity.phone },
  { id: "id-card", label: "身份证号", value: patientProfile.identity.idCard },
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
