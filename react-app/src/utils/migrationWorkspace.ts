import { sourceOptions } from "../data/configOptions";
import { patientProfile } from "../data/patientProfile";
import { services } from "../data/services";
import type { DraftState } from "../types/draftState";
import type { ReportDocumentDraft } from "../types/documentDraft";
import type { DraftConfig } from "../types/generation";
import type { ReportRecord, ReportStatus, ReportTone } from "../types/report";

function getReportTone(status: ReportStatus): ReportTone {
  return status === "已发布" ? "published" : "unpublished";
}

function formatToday() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("-", "/");
}

export function buildDocumentName(serviceId: ReportRecord["serviceId"]) {
  return `${patientProfile.identity.maskedName} · ${services[serviceId].label}`;
}

export function buildSelectedSources(config: DraftConfig) {
  if (config.scope === "prompt" && config.promptDescription.trim()) {
    return [`自然语言描述：${config.promptDescription.trim()}`];
  }

  if (config.scope === "specific" && config.selectedSourceIds.length) {
    return config.selectedSourceIds.map(
      (sourceId) => sourceOptions.find((item) => item.id === sourceId)?.name ?? sourceId,
    );
  }

  return ["全部档案数据"];
}

export function createInitialDraftConfig(defaultServiceId: ReportRecord["serviceId"]): DraftConfig {
  return {
    serviceId: defaultServiceId,
    documentName: buildDocumentName(defaultServiceId),
    scope: "all",
    selectedSourceIds: [],
    promptDescription: "",
  };
}

export function getSelectedReport(reports: ReportRecord[], reportId: string | null) {
  return reports.find((report) => report.id === reportId) ?? reports[0] ?? null;
}

export function getDraftStates(
  reports: ReportRecord[],
  documentDrafts: Record<string, ReportDocumentDraft>,
  savedDocumentDrafts: Record<string, ReportDocumentDraft>,
): Record<string, DraftState> {
  return Object.fromEntries(
    reports.map((report) => {
      const currentDraft = documentDrafts[report.id];
      const savedDraft = savedDocumentDrafts[report.id];
      const hasDraft = Boolean(currentDraft);
      const dirty = hasDraft && savedDraft ? JSON.stringify(currentDraft) !== JSON.stringify(savedDraft) : false;
      return [report.id, { hasDraft, dirty }];
    }),
  ) as Record<string, DraftState>;
}

export function createGeneratedReport(config: DraftConfig): ReportRecord {
  const trimmedName = config.documentName.trim() || buildDocumentName(config.serviceId);

  return {
    id: `draft-${Date.now()}`,
    title: trimmedName,
    subtitle: services[config.serviceId].label,
    serviceId: config.serviceId,
    status: "未发布",
    tone: "unpublished",
    date: formatToday(),
    content: "",
    selectedSources: buildSelectedSources(config),
  };
}

export function updateReportTitle(
  reports: ReportRecord[],
  reportId: string,
  title: string,
) {
  return reports.map((report) =>
    report.id === reportId
      ? {
          ...report,
          title,
        }
      : report,
  );
}

export function updateReportArtifacts(
  reports: ReportRecord[],
  reportId: string,
  patch: Partial<Pick<ReportRecord, "title" | "date" | "content" | "trace" | "generationState" | "savedDraft">>,
) {
  return reports.map((report) =>
    report.id === reportId
      ? {
          ...report,
          ...patch,
        }
      : report,
  );
}

export function toggleReportPublishState(
  reports: ReportRecord[],
  reportId: string,
  nextStatus: ReportStatus,
) {
  return reports.map((report) =>
    report.id === reportId
      ? {
          ...report,
          status: nextStatus,
          tone: getReportTone(nextStatus),
        }
      : report,
  );
}

export function removeReport(reports: ReportRecord[], reportId: string) {
  return reports.filter((report) => report.id !== reportId);
}
