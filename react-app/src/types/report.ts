import type { ReportDocumentDraft } from "./documentDraft";

export type ReportStatus = "已发布" | "未发布";

export type ReportTone = "published" | "unpublished";

export type ReportRecord = {
  id: string;
  title: string;
  subtitle: string;
  serviceId: "plan" | "risk" | "exam";
  status: ReportStatus;
  tone: ReportTone;
  date: string;
  content: string;
  selectedSources?: string[];
  retrievedGuides?: string[];
  trace?: Array<{
    id: string;
    text: string;
    tone?: "normal" | "accent" | "agent";
    source?: string;
    stage?: string;
    status?: "running" | "done" | null;
    time?: string;
  }>;
  generationState?: {
    status: "processing" | "completed" | "stopped";
    modeLabel: string;
    briefTitle: string;
    briefText: string;
    overallStatus: string;
    progress: number;
    retrievedGuides?: string[];
    stages: Array<{
      id: string;
      label: string;
      desc: string;
      status: "pending" | "running" | "done";
    }>;
  };
  savedDraft?: ReportDocumentDraft;
};
