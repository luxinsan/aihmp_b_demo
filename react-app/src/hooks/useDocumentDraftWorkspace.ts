import { startTransition, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ReportDocumentDraft } from "../types/documentDraft";
import type { DraftState } from "../types/draftState";
import type { ActiveModal } from "../types/modal";
import type { ReportRecord } from "../types/report";
import { createDocumentDraft } from "../utils/documentDraft";
import { getDraftStates, getSelectedReport, updateReportTitle } from "../utils/migrationWorkspace";
import {
  getClosedEditMessage,
  getDiscardedEditMessage,
  getEnteredEditMessage,
  getSavedEditMessage,
} from "../utils/workspaceFeedback";

type UseDocumentDraftWorkspaceOptions = {
  reports: ReportRecord[];
  setActionMessage: Dispatch<SetStateAction<string>>;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
  setReports: Dispatch<SetStateAction<ReportRecord[]>>;
  setSelectedReportId: Dispatch<SetStateAction<string | null>>;
};

export function useDocumentDraftWorkspace({
  reports,
  setActionMessage,
  setActiveModal,
  setReports,
  setSelectedReportId,
}: UseDocumentDraftWorkspaceOptions) {
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [documentDrafts, setDocumentDrafts] = useState<Record<string, ReportDocumentDraft>>({});
  const [savedDocumentDrafts, setSavedDocumentDrafts] = useState<Record<string, ReportDocumentDraft>>({});

  const editingReport = getSelectedReport(reports, editingReportId);
  const editingDraft = editingReport ? documentDrafts[editingReport.id] : undefined;
  const draftStates = getDraftStates(reports, documentDrafts, savedDocumentDrafts) as Record<
    string,
    DraftState
  >;

  function registerGeneratedDraft(reportId: string, draft: ReportDocumentDraft) {
    setDocumentDrafts((current) => ({
      ...current,
      [reportId]: draft,
    }));
    setSavedDocumentDrafts((current) => ({
      ...current,
      [reportId]: draft,
    }));
  }

  function handleEnterEdit(reportId: string) {
    const report = reports.find((item) => item.id === reportId);
    if (!report) {
      return;
    }

    const baseDraft =
      documentDrafts[reportId] ??
      (report.savedDraft
        ? typeof structuredClone === "function"
          ? structuredClone(report.savedDraft)
          : JSON.parse(JSON.stringify(report.savedDraft))
        : createDocumentDraft(report));

    setDocumentDrafts((current) => ({
      ...current,
      [reportId]: current[reportId] ?? baseDraft,
    }));
    setSavedDocumentDrafts((current) => ({
      ...current,
      [reportId]: current[reportId] ?? baseDraft,
    }));
    setEditingReportId(reportId);
    setSelectedReportId(reportId);
    setActiveModal(null);
    setActionMessage(getEnteredEditMessage(report.title));
  }

  function handleDraftChange(reportId: string, nextDraft: ReportDocumentDraft) {
    setDocumentDrafts((current) => ({
      ...current,
      [reportId]: nextDraft,
    }));
  }

  function handleSaveEditor() {
    if (!editingReport || !editingDraft) {
      return;
    }

    startTransition(() => {
      setReports((current) => updateReportTitle(current, editingReport.id, editingDraft.title));
    });
    setSelectedReportId(editingReport.id);
    setSavedDocumentDrafts((current) => ({
      ...current,
      [editingReport.id]: editingDraft,
    }));
    setEditingReportId(null);
    setActionMessage(getSavedEditMessage(editingDraft.title));
    setActiveModal(null);
  }

  function handleCloseEditor() {
    if (!editingDraft) {
      setEditingReportId(null);
      return;
    }

    setEditingReportId(null);
    setActionMessage(getClosedEditMessage(editingDraft.title));
  }

  function handleDiscardEditor() {
    if (!editingReport) {
      setEditingReportId(null);
      return;
    }

    const savedDraft = savedDocumentDrafts[editingReport.id];
    if (savedDraft) {
      setDocumentDrafts((current) => ({
        ...current,
        [editingReport.id]: savedDraft,
      }));
    }

    setEditingReportId(null);
    setSelectedReportId(editingReport.id);
    setActiveModal(null);
    setActionMessage(getDiscardedEditMessage(editingReport.title));
  }

  function handleRemoveDraftArtifacts(reportId: string) {
    setDocumentDrafts((current) => {
      if (!(reportId in current)) {
        return current;
      }

      const nextDrafts = { ...current };
      delete nextDrafts[reportId];
      return nextDrafts;
    });

    setSavedDocumentDrafts((current) => {
      if (!(reportId in current)) {
        return current;
      }

      const nextDrafts = { ...current };
      delete nextDrafts[reportId];
      return nextDrafts;
    });

    setEditingReportId((current) => (current === reportId ? null : current));
  }

  return {
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
  };
}
