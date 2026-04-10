import { useEffect, useEffectEvent, useState } from "react";
import type { DraftState } from "../../types/draftState";
import type { GenerationSession } from "../../types/generationSession";
import type { ConfirmActionKind } from "../../types/modal";
import type { ReportRecord } from "../../types/report";
import { ReportPanelHeader } from "./components/ReportPanelHeader";
import { ReportListPanel } from "./components/ReportListPanel";

type ReportWorkspacePreviewProps = {
  reports: ReportRecord[];
  selectedReportId: string | null;
  draftStates: Record<string, DraftState>;
  generationSessions: GenerationSession[];
  generationSession: GenerationSession | null;
  onOpenGenerationStage: (reportId?: string) => void;
  onSelectReport: (reportId: string) => void;
  onOpenEdit: (reportId: string) => void;
  onOpenGenerate: () => void;
  onOpenGenerateForService: (serviceId: ReportRecord["serviceId"]) => void;
  onOpenPreview: (reportId: string) => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
};

export function ReportWorkspacePreview({
  reports,
  selectedReportId,
  draftStates,
  generationSessions,
  generationSession,
  onOpenGenerationStage,
  onSelectReport,
  onOpenEdit,
  onOpenGenerate,
  onOpenGenerateForService,
  onOpenPreview,
  onOpenConfirm,
}: ReportWorkspacePreviewProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const closeMenu = useEffectEvent(() => {
    setOpenMenuId(null);
  });

  useEffect(() => {
    if (!openMenuId) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest(".report-card-actions")) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId, closeMenu]);

  return (
    <section className="report-workspace">
      <section className="document-panel panel">
        <ReportPanelHeader
          generationSession={generationSession}
          onOpenGenerate={onOpenGenerate}
          onOpenGenerateForService={onOpenGenerateForService}
          onOpenGenerationStage={onOpenGenerationStage}
        />

        <ReportListPanel
          draftStates={draftStates}
          generationSessions={generationSessions}
          generationSession={generationSession}
          openMenuId={openMenuId}
          reports={reports}
          selectedReportId={selectedReportId}
          onCloseMenu={closeMenu}
          onOpenConfirm={onOpenConfirm}
          onOpenEdit={onOpenEdit}
          onOpenPreview={(reportId) => {
            onSelectReport(reportId);
            onOpenPreview(reportId);
          }}
          onToggleMenu={(reportId) => setOpenMenuId((current) => (current === reportId ? null : reportId))}
        />
      </section>
    </section>
  );
}
