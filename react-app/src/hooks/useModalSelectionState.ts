import { useState } from "react";
import type { ActiveModal, ConfirmActionKind } from "../types/modal";

export function useModalSelectionState(initialSelectedReportId: string | null) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialSelectedReportId);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  function openPreview(reportId: string) {
    setSelectedReportId(reportId);
    setActiveModal({ kind: "preview", reportId });
  }

  function openConfirm(reportId: string, action: ConfirmActionKind) {
    setSelectedReportId(reportId);
    setActiveModal({ kind: "confirm", reportId, action });
  }

  function closeModal() {
    setActiveModal(null);
  }

  return {
    activeModal,
    closeModal,
    openConfirm,
    openPreview,
    selectedReportId,
    setActiveModal,
    setSelectedReportId,
  };
}
