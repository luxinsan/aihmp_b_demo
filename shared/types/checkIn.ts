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
  aiOverview: string;
  doctorComment: string;
  nutritionMetrics: Array<{
    id: string;
    label: string;
    value: string;
    unit: string;
  }>;
  images: Array<{
    id: string;
    alt: string;
    src: string;
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
