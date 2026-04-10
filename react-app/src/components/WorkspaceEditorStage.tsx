import type { DraftState } from "../types/draftState";
import type { ReportDocumentDraft } from "../types/documentDraft";
import type { ReportRecord } from "../types/report";
import { EditorWorkspace } from "../features/editor/EditorWorkspace";

type WorkspaceEditorStageProps = {
  draft: ReportDocumentDraft | undefined;
  draftState?: DraftState;
  report: ReportRecord | null;
  onClose: () => void;
  onDiscard: () => void;
  onDraftChange: (nextDraft: ReportDocumentDraft) => void;
  onSave: () => void;
};

export function WorkspaceEditorStage({
  draft,
  draftState,
  report,
  onClose,
  onDiscard,
  onDraftChange,
  onSave,
}: WorkspaceEditorStageProps) {
  if (!report || !draft) {
    return null;
  }

  return (
    <EditorWorkspace
      report={report}
      draft={draft}
      isDirty={draftState?.dirty ?? false}
      onDraftChange={onDraftChange}
      onSave={onSave}
      onClose={onClose}
      onDiscard={onDiscard}
    />
  );
}
