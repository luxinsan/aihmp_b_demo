import type { ReportRecord } from "./report";

export type ScopeMode = "all" | "specific";

export type DraftAttachment = {
  id: string;
  name: string;
  size: number;
};

export type DraftConfig = {
  serviceId: ReportRecord["serviceId"];
  documentName: string;
  sourceScope: ScopeMode;
  selectedSourceIds: string[];
  promptDescription: string;
  templateId: string;
  meetingFiles: DraftAttachment[];
};
