import type { HeightRecord, WeightRecord } from "../types/bodyMetrics";

export const weightRecords: WeightRecord[] = [
  {
    id: "weight-2026-03-27",
    patientId: "p-001",
    recordedAt: "2026-03-27T07:20:00+08:00",
    valueKg: 66.4,
    source: "check-in",
    note: "管理前基线体重",
  },
  {
    id: "weight-2026-04-02",
    patientId: "p-001",
    recordedAt: "2026-04-02T07:16:00+08:00",
    valueKg: 65.8,
    source: "check-in",
  },
  {
    id: "weight-2026-04-08",
    patientId: "p-001",
    recordedAt: "2026-04-08T07:10:00+08:00",
    valueKg: 64.9,
    source: "check-in",
  },
  {
    id: "weight-2026-04-14",
    patientId: "p-001",
    recordedAt: "2026-04-14T07:18:00+08:00",
    valueKg: 64.1,
    source: "check-in",
  },
  {
    id: "weight-2026-04-21",
    patientId: "p-001",
    recordedAt: "2026-04-21T07:12:00+08:00",
    valueKg: 63.6,
    source: "check-in",
  },
  {
    id: "weight-2026-04-28",
    patientId: "p-001",
    recordedAt: "2026-04-28T07:09:00+08:00",
    valueKg: 62.7,
    source: "check-in",
  },
  {
    id: "weight-2026-05-05",
    patientId: "p-001",
    recordedAt: "2026-05-05T07:21:00+08:00",
    valueKg: 61.9,
    source: "check-in",
  },
  {
    id: "weight-2026-05-12",
    patientId: "p-001",
    recordedAt: "2026-05-12T07:13:00+08:00",
    valueKg: 61.2,
    source: "check-in",
  },
  {
    id: "weight-2026-05-19",
    patientId: "p-001",
    recordedAt: "2026-05-19T07:15:00+08:00",
    valueKg: 60.3,
    source: "check-in",
  },
  {
    id: "weight-2026-05-26",
    patientId: "p-001",
    recordedAt: "2026-05-26T07:11:00+08:00",
    valueKg: 59.8,
    source: "check-in",
    note: "当前体重",
  },
];

export const heightRecords: HeightRecord[] = [
  {
    id: "height-2026-03-27",
    patientId: "p-001",
    recordedAt: "2026-03-27T09:00:00+08:00",
    valueCm: 170.2,
    source: "manual",
    note: "管理前身高记录",
  },
  {
    id: "height-2026-04-21",
    patientId: "p-001",
    recordedAt: "2026-04-21T09:00:00+08:00",
    valueCm: 170.2,
    source: "manual",
  },
];
