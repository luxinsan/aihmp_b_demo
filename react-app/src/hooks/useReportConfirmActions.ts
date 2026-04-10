import { startTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ActiveModal } from "../types/modal";
import type { GenerationSession } from "../types/generationSession";
import type { ReportRecord } from "../types/report";
import { isGenerationLocked } from "../features/reports/utils/reportPresentation";
import { removeReport, toggleReportPublishState } from "../utils/migrationWorkspace";
import {
  getDeletedMessage,
  getLockedConfirmMessage,
  getPublishedMessage,
} from "../utils/workspaceFeedback";

type UseReportConfirmActionsOptions = {
  activeModal: ActiveModal;
  draftStates: Record<string, { hasDraft: boolean; dirty: boolean }>;
  generationSessions: GenerationSession[];
  handleRemoveDraftArtifacts: (reportId: string) => void;
  handleRemoveGenerationArtifacts: (reportId: string) => void;
  reports: ReportRecord[];
  selectedReportId: string | null;
  setActionMessage: Dispatch<SetStateAction<string>>;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
  setReports: Dispatch<SetStateAction<ReportRecord[]>>;
  setSelectedReportId: Dispatch<SetStateAction<string | null>>;
};

export function useReportConfirmActions({
  activeModal,
  draftStates,
  generationSessions,
  handleRemoveDraftArtifacts,
  handleRemoveGenerationArtifacts,
  reports,
  selectedReportId,
  setActionMessage,
  setActiveModal,
  setReports,
  setSelectedReportId,
}: UseReportConfirmActionsOptions) {
  function handleConfirmAction() {
    if (!activeModal || activeModal.kind !== "confirm") {
      return;
    }

    const reportSession = generationSessions.find((session) => session.reportId === activeModal.reportId) ?? null;
    if (isGenerationLocked(reportSession)) {
      const lockedReportTitle = reports.find((item) => item.id === activeModal.reportId)?.title ?? activeModal.reportId;
      setActionMessage(
        getLockedConfirmMessage(lockedReportTitle, activeModal.action),
      );
      setActiveModal(null);
      return;
    }

    if (activeModal.action === "toggle-publish") {
      const report = reports.find((item) => item.id === activeModal.reportId);
      const nextStatus = report?.status === "已发布" ? "未发布" : "已发布";

      startTransition(() => {
        setReports((current) => toggleReportPublishState(current, activeModal.reportId, nextStatus));
      });

      setActionMessage(
        getPublishedMessage(report?.title ?? activeModal.reportId, nextStatus),
      );
      setActiveModal(null);
      return;
    }

    if (activeModal.action === "delete") {
      const reportToDelete = reports.find((item) => item.id === activeModal.reportId) ?? null;
      const nextReports = removeReport(reports, activeModal.reportId);
      const hasDirtyDraft = Boolean(draftStates[activeModal.reportId]?.dirty);
      const hasGenerationRecord = generationSessions.some((session) => session.reportId === activeModal.reportId);

      startTransition(() => {
        setReports(nextReports);
      });
      handleRemoveDraftArtifacts(activeModal.reportId);
      handleRemoveGenerationArtifacts(activeModal.reportId);

      if (selectedReportId === activeModal.reportId) {
        setSelectedReportId(nextReports[0]?.id ?? null);
      }

      setActionMessage(
        getDeletedMessage(reportToDelete?.title ?? activeModal.reportId, hasDirtyDraft, hasGenerationRecord),
      );
      setActiveModal(null);
    }
  }

  return {
    handleConfirmAction,
  };
}
