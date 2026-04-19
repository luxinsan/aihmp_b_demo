import type { ReportRecord } from "./report";

export type GenerationStatus = "processing" | "completed" | "stopped";

export type GenerationStageStatus = "pending" | "running" | "done";

export type GenerationStageItem = {
  id: string;
  label: string;
  desc: string;
  status: GenerationStageStatus;
};

export type GenerationLogEntry = {
  id: string;
  text: string;
  tone?: "normal" | "accent" | "agent";
  source?: string;
  stage?: string;
  status?: "running" | "done" | null;
  time?: string;
};

export type GenerationSession = {
  reportId: string;
  reportTitle: string;
  reportDate: string;
  createdAt: number;
  updatedAt: number;
  serviceId: ReportRecord["serviceId"];
  patientName: string;
  patientMeta: string;
  patientAvatar: string;
  selectedSources: string[];
  retrievedGuides: string[];
  status: GenerationStatus;
  modeLabel: string;
  briefTitle: string;
  briefText: string;
  overallStatus: string;
  progress: number;
  stages: GenerationStageItem[];
  logs: GenerationLogEntry[];
};
