export type PatientIdentity = {
  name: string;
  maskedName: string;
  avatar: string;
  gender: string;
  age: number;
  code: string;
  phone: string;
  idCard: string;
};

export type PatientArchive = {
  maritalStatus: string;
  fertilityStatus: string;
  education: string;
  birthplace: string;
  residence: string;
  currentIllness: string;
  medicationHistory: string;
  supplementHistory: string;
  medicalHistory: string;
  familyHistory: string;
  diet: string;
  sleep: string;
  exercise: string;
  smokingHistory: string;
  drinkingHistory: string;
  mentalHealth: string;
  otherNotes: string;
  height: string;
  weight: string;
  bmi: string;
  heartRate: string;
  waist: string;
  hip: string;
  waistHipRatio: string;
  bloodPressure: string;
};

export type PatientProfile = {
  identity: PatientIdentity;
  archive: PatientArchive;
};

export type PatientMetric = {
  label: string;
  value: string;
};

export type PatientArchiveField = {
  label: string;
  value: string;
};

export type PatientArchiveSection = {
  title: string;
  fields: PatientArchiveField[];
};

export type SharedPatientTabId =
  | "basic-info"
  | "archive"
  | "health-plan"
  | "reports"
  | "questionnaires";

export type SharedPatientTab = {
  id: SharedPatientTabId;
  label: string;
};

export type SharedPatientContactItem = {
  id: "phone" | "id-card";
  label: string;
  value: string;
};
