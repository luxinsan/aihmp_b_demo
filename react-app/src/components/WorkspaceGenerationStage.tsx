import { GenerationWorkspace } from "../features/generation/GenerationWorkspace";
import type { ReportDocumentDraft } from "../types/documentDraft";
import type { GenerationSession } from "../types/generationSession";

type WorkspaceGenerationStageProps = {
  documentDraft?: ReportDocumentDraft;
  session: GenerationSession | null;
  onBackground: () => void;
  onClose: () => void;
  onOpenPreview: () => void;
  onReturnToList: (draft?: ReportDocumentDraft, contentHtml?: string) => void;
  onStop: () => void;
};

export function WorkspaceGenerationStage({
  documentDraft,
  session,
  onBackground,
  onClose,
  onOpenPreview,
  onReturnToList,
  onStop,
}: WorkspaceGenerationStageProps) {
  if (!session) {
    return null;
  }

  return (
    <GenerationWorkspace
      documentDraft={documentDraft}
      session={session}
      onBackground={onBackground}
      onClose={onClose}
      onOpenPreview={onOpenPreview}
      onReturnToList={onReturnToList}
      onStop={onStop}
    />
  );
}
