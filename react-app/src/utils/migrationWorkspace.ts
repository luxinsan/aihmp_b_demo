import { configTemplateOptions, sourceOptions } from "../data/configOptions";
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

function formatCompactToday() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("/", "")
    .replaceAll("-", "");
}

export function buildDocumentName(serviceId: ReportRecord["serviceId"]) {
  const dateLabel = formatCompactToday();

  if (serviceId === "exam") {
    return `体检方案-${dateLabel}`;
  }

  if (serviceId === "plan") {
    return `健康管理方案-${dateLabel}`;
  }

  return `健康风险评估与建议-${dateLabel}`;
}

export function getDefaultTemplateId(serviceId: ReportRecord["serviceId"]) {
  if (serviceId !== "plan") {
    return "";
  }

  return configTemplateOptions[serviceId][0]?.id ?? "";
}

export function buildSelectedSources(config: DraftConfig) {
  const sources: string[] = [];

  if (config.serviceId === "risk") {
    if (config.sourceScope === "specific" && config.selectedSourceIds.length) {
      sources.push(
        ...config.selectedSourceIds.map(
          (sourceId) => sourceOptions.find((item) => item.id === sourceId)?.name ?? sourceId,
        ),
      );
    } else {
      sources.push("全部健康档案资料");
    }
  } else {
    sources.push("全部健康档案资料");
  }

  if (config.meetingFiles.length) {
    sources.push(...config.meetingFiles.map((file) => `会议纪要附件：${file.name}`));
  }

  if (config.serviceId === "plan" && config.templateId) {
    const template = configTemplateOptions[config.serviceId].find((item) => item.id === config.templateId);
    if (template) {
      sources.push(`选用模板：${template.label}`);
    }
  }

  if (config.promptDescription.trim()) {
    sources.push(`补充说明：${config.promptDescription.trim()}`);
  }

  return sources;
}

export function createInitialDraftConfig(defaultServiceId: ReportRecord["serviceId"]): DraftConfig {
  return {
    serviceId: defaultServiceId,
    documentName: buildDocumentName(defaultServiceId),
    sourceScope: "all",
    selectedSourceIds: [],
    promptDescription: "",
    templateId: getDefaultTemplateId(defaultServiceId),
    meetingFiles: [],
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
