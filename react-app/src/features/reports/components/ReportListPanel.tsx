import type { ConfirmActionKind } from "../../../types/modal";
import type { DraftState } from "../../../types/draftState";
import type { GenerationSession } from "../../../types/generationSession";
import type { ReportRecord } from "../../../types/report";
import { ReportEntry } from "./ReportEntry";

type ReportListPanelProps = {
  draftStates: Record<string, DraftState>;
  generationSessions: GenerationSession[];
  generationSession: GenerationSession | null;
  openMenuId: string | null;
  reports: ReportRecord[];
  selectedReportId: string | null;
  onCloseMenu: () => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
  onOpenEdit: (reportId: string) => void;
  onOpenPreview: (reportId: string) => void;
  onToggleMenu: (reportId: string) => void;
};

export function ReportListPanel({
  draftStates,
  generationSessions,
  generationSession,
  openMenuId,
  reports,
  selectedReportId,
  onCloseMenu,
  onOpenConfirm,
  onOpenEdit,
  onOpenPreview,
  onToggleMenu,
}: ReportListPanelProps) {
  return (
    <div className="report-grid" id="reportGrid">
      {reports.map((report) => {
        const reportSession =
          generationSessions.find((session) => session.reportId === report.id) ??
          (generationSession?.reportId === report.id ? generationSession : null);

        return (
          <ReportEntry
            key={report.id}
            generationSession={reportSession}
            report={report}
            isActive={selectedReportId === report.id}
            isMenuOpen={openMenuId === report.id}
            draftState={draftStates[report.id]}
            onToggleMenu={onToggleMenu}
            onOpenEdit={onOpenEdit}
            onOpenPreview={onOpenPreview}
            onOpenConfirm={onOpenConfirm}
            onCloseMenu={onCloseMenu}
          />
        );
      })}
    </div>
  );
}
