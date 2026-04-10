import type { DraftState } from "../../types/draftState";
import type { DraftConfig } from "../../types/generation";
import type { GenerationSession } from "../../types/generationSession";
import type { ActiveModal, ConfirmActionKind } from "../../types/modal";
import type { ReportDocumentDraft } from "../../types/documentDraft";
import type { ReportRecord } from "../../types/report";
import { ConfigModalBody } from "./components/ConfigModalBody";
import { ConfirmModalBody } from "./components/ConfirmModalBody";
import { PreviewModalBody } from "./components/PreviewModalBody";
import { useModalDismiss } from "./hooks/useModalDismiss";
import {
  resolveConfirmReport,
  resolvePreviewReport,
  resolveSelectedReport,
} from "./utils/modalSelection";

type ModalHostProps = {
  activeModal: ActiveModal;
  reports: ReportRecord[];
  selectedReportId: string | null;
  draftConfig: DraftConfig;
  documentDrafts: Record<string, ReportDocumentDraft>;
  draftStates: Record<string, DraftState>;
  generationSessions: GenerationSession[];
  onClose: () => void;
  onConfirmAction: () => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
  onOpenConfig: () => void;
  onOpenGenerationStage: (reportId?: string) => void;
  onOpenPreviewFromSelection: () => void;
  onDraftConfigChange: (nextConfig: DraftConfig) => void;
  onStartGeneration: () => void;
  onEnterEdit: (reportId: string) => void;
};

export function ModalHost({
  activeModal,
  reports,
  selectedReportId,
  draftConfig,
  documentDrafts,
  draftStates,
  generationSessions,
  onClose,
  onConfirmAction,
  onOpenConfirm,
  onOpenConfig,
  onOpenGenerationStage,
  onOpenPreviewFromSelection,
  onDraftConfigChange,
  onStartGeneration,
  onEnterEdit,
}: ModalHostProps) {
  const closeModal = useModalDismiss(Boolean(activeModal), onClose);

  const selectedReport = resolveSelectedReport(reports, selectedReportId);
  const previewReport = resolvePreviewReport(activeModal, reports, selectedReport);
  const confirmReport = resolveConfirmReport(activeModal, reports, selectedReport);
  const confirmDraftState = confirmReport ? draftStates[confirmReport.id] : undefined;
  const confirmGenerationSession = confirmReport
    ? generationSessions.find((session) => session.reportId === confirmReport.id) ?? null
    : null;
  const previewDocumentDraft = previewReport ? documentDrafts[previewReport.id] : undefined;

  if (!activeModal) {
    return null;
  }

  const backdropId =
    activeModal.kind === "config"
      ? "configModal"
      : activeModal.kind === "preview"
        ? "previewModal"
        : "actionConfirmModal";

  return (
    <div className="modal-backdrop" id={backdropId} onClick={closeModal} role="presentation">
      {activeModal.kind === "config" ? (
        <ConfigModalBody
          draftConfig={draftConfig}
          onDraftConfigChange={onDraftConfigChange}
          onClose={closeModal}
          onStartGeneration={onStartGeneration}
        />
      ) : null}
      {activeModal.kind === "preview" ? (
        <PreviewModalBody
          draftState={previewReport ? draftStates[previewReport.id] : undefined}
          documentDraft={previewDocumentDraft}
          onClose={closeModal}
          onEnterEdit={onEnterEdit}
          onOpenGenerationStage={onOpenGenerationStage}
          onOpenConfirm={onOpenConfirm}
          report={previewReport}
        />
      ) : null}
      {activeModal.kind === "confirm" ? (
        <ConfirmModalBody
          action={activeModal.action}
          draftState={confirmDraftState}
          generationSession={confirmGenerationSession}
          report={confirmReport}
          onClose={closeModal}
          onConfirmAction={onConfirmAction}
        />
      ) : null}
    </div>
  );
}
