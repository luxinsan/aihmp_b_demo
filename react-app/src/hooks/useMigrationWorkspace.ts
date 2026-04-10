import { useState } from "react";
import { serviceOptions } from "../data/configOptions";
import { initialReports } from "../data/reports";
import { getSelectedReport } from "../utils/migrationWorkspace";
import { useDocumentDraftWorkspace } from "./useDocumentDraftWorkspace";
import { useDraftConfigState } from "./useDraftConfigState";
import { useGenerationWorkspace } from "./useGenerationWorkspace";
import { useModalSelectionState } from "./useModalSelectionState";
import { useReportConfirmActions } from "./useReportConfirmActions";

export function useMigrationWorkspace() {
  const [reports, setReports] = useState(initialReports);
  const {
    activeModal,
    closeModal,
    openConfirm,
    openPreview,
    selectedReportId,
    setActiveModal,
    setSelectedReportId,
  } = useModalSelectionState(initialReports[0]?.id ?? null);
  const { draftConfig, handleDraftConfigChange, openConfig, openConfigForService } = useDraftConfigState({
    defaultServiceId: serviceOptions[0]?.id ?? "risk",
    onOpenConfigModal: () => setActiveModal({ kind: "config" }),
  });
  const [actionMessage, setActionMessage] = useState(
    "当前模块已经接入统一弹窗宿主，报告区动作会通过同一套 React 状态流进入预览和确认弹窗。",
  );
  const {
    documentDrafts,
    draftStates,
    editingDraft,
    editingReport,
    handleCloseEditor,
    handleDiscardEditor,
    handleDraftChange,
    handleEnterEdit,
    handleRemoveDraftArtifacts,
    handleSaveEditor,
    registerGeneratedDraft,
  } = useDocumentDraftWorkspace({
    reports,
    setActionMessage,
    setActiveModal,
    setReports,
    setSelectedReportId,
  });

  const selectedReport = getSelectedReport(reports, selectedReportId);
  const {
    generationSessions,
    generationVisible,
    handleClearFinishedGenerations,
    handleBackgroundGeneration,
    handleDismissGeneration,
    generationSession,
    handleCloseGeneration,
    handleOpenGeneratedPreview,
    handleRemoveGenerationArtifacts,
    handleReturnGeneratedToList,
    handleShowGeneration,
    handleStartGeneration,
    handleStopGeneration,
  } = useGenerationWorkspace({
    draftConfig,
    setActionMessage,
    setActiveModal,
    setReports,
    setSelectedReportId,
    registerGeneratedDraft,
  });
  const { handleConfirmAction } = useReportConfirmActions({
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
  });

  return {
    actionMessage,
    activeModal,
    closeModal,
    documentDrafts,
    draftConfig,
    draftStates,
    editingDraft,
    editingReport,
    generationSessions,
    generationVisible,
    handleClearFinishedGenerations,
    handleBackgroundGeneration,
    handleDismissGeneration,
    generationSession,
    handleCloseEditor,
    handleCloseGeneration,
    handleConfirmAction,
    handleDiscardEditor,
    handleDraftChange,
    handleDraftConfigChange,
    handleEnterEdit,
    handleOpenGeneratedPreview,
    handleReturnGeneratedToList,
    handleSaveEditor,
    handleShowGeneration,
    handleStartGeneration,
    handleStopGeneration,
    openConfig,
    openConfigForService,
    openConfirm,
    openPreview,
    reports,
    selectedReport,
    selectedReportId,
    setSelectedReportId,
  };
}
