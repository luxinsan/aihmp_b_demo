import type { DraftState } from "../../../types/draftState";
import type { GenerationSession, GenerationStatus } from "../../../types/generationSession";
import type { ReportRecord } from "../../../types/report";
import { services } from "../../../data/services";

export function getReportIconLabel(serviceId: ReportRecord["serviceId"]) {
  if (serviceId === "plan") return "方案";
  if (serviceId === "exam") return "体检";
  return "风险";
}

export function getReportCardTitle(report: Pick<ReportRecord, "title" | "subtitle">) {
  const rawTitle = report.title.trim();
  const strippedPrefix = rawTitle.replace(/^[^·]+ ·\s*/, "").trim();
  const strippedPatient = strippedPrefix.replace(/-[^-]+-\d{8}-\d{4}$/, "").trim();

  if (strippedPatient) {
    return strippedPatient;
  }

  return report.subtitle.trim() || "报告文档";
}

export function getReportVisualType(report: Pick<ReportRecord, "title" | "subtitle" | "serviceId">) {
  const title = `${report.title} ${report.subtitle}`;

  if (title.includes("90天健康管理方案")) {
    return "plan-90";
  }

  if (title.includes("体检方案")) {
    return "exam-plan";
  }

  if (title.includes("报告与建议") || title.includes("报告及建议")) {
    return "risk-advice";
  }

  if (title.includes("健康风险评估报告") || title.includes("风险评估报告")) {
    return "risk";
  }

  if (report.serviceId === "exam") {
    return "exam-plan";
  }

  if (report.serviceId === "plan") {
    return "plan-90";
  }

  return "risk";
}

export function getServiceLabel(serviceId: ReportRecord["serviceId"]) {
  return services[serviceId].label;
}

export function getDraftHintLabel(draftState?: DraftState) {
  if (!draftState?.hasDraft) {
    return null;
  }

  return draftState.dirty ? "草稿未保存" : "草稿已同步";
}

export function getDraftStatusLabel(draftState?: DraftState) {
  if (!draftState?.hasDraft) {
    return "未创建";
  }

  return draftState.dirty ? "未保存" : "已同步";
}

export function getGenerationStatusLabel(status?: GenerationStatus | null) {
  if (status === "processing") {
    return "生成中";
  }

  if (status === "completed") {
    return "已生成";
  }

  if (status === "stopped") {
    return "已终止";
  }

  return null;
}

export function getGenerationStatusTone(status?: GenerationStatus | null) {
  if (status === "processing") {
    return "processing";
  }

  if (status === "completed") {
    return "completed";
  }

  if (status === "stopped") {
    return "stopped";
  }

  return null;
}

export function getGenerationSummary(session?: GenerationSession | null) {
  if (!session) {
    return null;
  }

  const label = getGenerationStatusLabel(session.status);
  if (!label) {
    return null;
  }

  return `${label} · ${session.progress}% · ${session.reportTitle}`;
}

export function getGenerationDetailSummary(session?: GenerationSession | null) {
  if (!session) {
    return "当前没有进行中的生成任务";
  }

  return `${getGenerationStatusLabel(session.status)} · ${session.progress}% · ${session.briefTitle}`;
}

export function getGenerationSourceSummary(
  session?: GenerationSession | null,
  report?: Pick<ReportRecord, "selectedSources"> | null,
) {
  const sourceCount = session?.selectedSources.length ?? report?.selectedSources?.length ?? 0;

  if (!sourceCount) {
    return "未关联输入来源";
  }

  return `${sourceCount} 个输入来源`;
}

export function getGenerationUpdatedLabel(session?: GenerationSession | null) {
  if (!session) {
    return "任务未启动";
  }

  const formatter = new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `最近更新 ${formatter.format(session.updatedAt)}`;
}

export function getGenerationHeadline(session?: GenerationSession | null) {
  if (!session) {
    return null;
  }

  if (session.status === "processing") {
    return "后台任务进行中";
  }

  if (session.status === "completed") {
    return "后台任务已完成";
  }

  return "后台任务已终止";
}

export function isGenerationLocked(
  input?: GenerationSession | Pick<GenerationSession, "status"> | GenerationStatus | null,
) {
  if (!input) {
    return false;
  }

  const status = typeof input === "string" ? input : input.status;
  return status === "processing";
}

export function getLockedActionLabel(action: "toggle-publish" | "delete") {
  return action === "delete" ? "生成中暂不可删除" : "生成中暂不可发布";
}

export function getLockedActionMessage(action: "toggle-publish" | "delete") {
  return `当前后台生成仍在进行中，已阻止本次${action === "delete" ? "删除" : "发布状态切换"}操作。`;
}
