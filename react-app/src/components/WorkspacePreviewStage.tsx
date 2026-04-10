import type { DraftState } from "../types/draftState";
import type { ReportDocumentDraft } from "../types/documentDraft";
import type { DraftConfig } from "../types/generation";
import type { GenerationSession } from "../types/generationSession";
import type { ActiveModal, ConfirmActionKind } from "../types/modal";
import type { ReportRecord } from "../types/report";
import { ModalHost } from "../features/modals/ModalHost";

type WorkspacePreviewStageProps = {
  activeModal: ActiveModal;
  documentDrafts: Record<string, ReportDocumentDraft>;
  draftConfig: DraftConfig;
  draftStates: Record<string, DraftState>;
  generationSessions: GenerationSession[];
  reports: ReportRecord[];
  selectedReportId: string | null;
  onClose: () => void;
  onConfirmAction: () => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
  onDraftConfigChange: (nextConfig: DraftConfig) => void;
  onEnterEdit: (reportId: string) => void;
  onOpenConfig: () => void;
  onOpenGenerationStage: (reportId?: string) => void;
  onOpenPreviewFromSelection: () => void;
  onStartGeneration: () => void;
};

export function WorkspacePreviewStage({
  activeModal,
  documentDrafts,
  draftConfig,
  draftStates,
  generationSessions,
  reports,
  selectedReportId,
  onClose,
  onConfirmAction,
  onOpenConfirm,
  onDraftConfigChange,
  onEnterEdit,
  onOpenConfig,
  onOpenGenerationStage,
  onOpenPreviewFromSelection,
  onStartGeneration,
}: WorkspacePreviewStageProps) {
  return (
    <ModalHost
      activeModal={activeModal}
      reports={reports}
      selectedReportId={selectedReportId}
      draftConfig={draftConfig}
      documentDrafts={documentDrafts}
      draftStates={draftStates}
      generationSessions={generationSessions}
      onClose={onClose}
      onConfirmAction={onConfirmAction}
      onOpenConfirm={onOpenConfirm}
      onOpenConfig={onOpenConfig}
      onOpenGenerationStage={onOpenGenerationStage}
      onOpenPreviewFromSelection={onOpenPreviewFromSelection}
      onDraftConfigChange={onDraftConfigChange}
      onStartGeneration={onStartGeneration}
      onEnterEdit={onEnterEdit}
    />
  );
}
