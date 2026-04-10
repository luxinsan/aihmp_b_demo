import type { ReportRecord } from "./report";

export type ScopeMode = "all" | "specific" | "prompt";

export type DraftConfig = {
  serviceId: ReportRecord["serviceId"];
  documentName: string;
  scope: ScopeMode;
  selectedSourceIds: string[];
  promptDescription: string;
};
