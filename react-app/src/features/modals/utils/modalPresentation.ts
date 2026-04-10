import type { DraftState } from "../../../types/draftState";
import type { GenerationSession } from "../../../types/generationSession";

export function getPreviewStatusSummary(title: string, status: string, draftState?: DraftState) {
  const draftLabel = draftState?.dirty ? "草稿未保存" : draftState?.hasDraft ? "草稿已同步" : "未创建草稿";
  return `${title} · ${status} · ${draftLabel}`;
}

export function getGenerationStatusLabel(session?: GenerationSession | null) {
  if (!session) {
    return null;
  }

  if (session.status === "processing") {
    return "生成中";
  }

  if (session.status === "completed") {
    return "已生成";
  }

  return "已终止";
}

export function getPreviewGenerationSummary(session?: GenerationSession | null) {
  if (!session) {
    return null;
  }

  return `${getGenerationStatusLabel(session)} · ${session.progress}% · ${session.overallStatus}`;
}
