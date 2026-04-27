export type BodyMetricSource = "manual" | "check-in" | "device" | "imported";

export type WeightRecord = {
  id: string;
  patientId: string;
  recordedAt: string;
  valueKg: number;
  source: BodyMetricSource;
  note?: string;
};

export type HeightRecord = {
  id: string;
  patientId: string;
  recordedAt: string;
  valueCm: number;
  source: BodyMetricSource;
  note?: string;
};
