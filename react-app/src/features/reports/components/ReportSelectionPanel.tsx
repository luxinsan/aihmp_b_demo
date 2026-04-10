import type { DraftState } from "../../../types/draftState";
import type { GenerationSession } from "../../../types/generationSession";
import type { ReportRecord } from "../../../types/report";
import {
  getDraftStatusLabel,
  getGenerationSourceSummary,
  getGenerationStatusLabel,
  getServiceLabel,
} from "../utils/reportPresentation";
import { ReportFocusPanel } from "./ReportFocusPanel";

type ReportSelectionPanelProps = {
  actionMessage: string;
  draftState?: DraftState;
  generationSessions: GenerationSession[];
  generationSession: GenerationSession | null;
  onOpenGenerationStage: (reportId?: string) => void;
  report: ReportRecord | null;
};

export function ReportSelectionPanel({
  actionMessage,
  draftState,
  generationSessions,
  generationSession,
  onOpenGenerationStage,
  report,
}: ReportSelectionPanelProps) {
  const reportSession =
    generationSessions.find((session) => session.reportId === report?.id) ??
    (generationSession?.reportId === report?.id ? generationSession : null);

  return (
    <article className="migration-panel">
      <header className="section-head">
        <div>
          <p className="eyebrow">Selection State</p>
          <h3>当前聚焦文档</h3>
        </div>
        {report ? (
          <span className="status-pill" data-tone={report.tone}>
            {report.status}
          </span>
        ) : null}
      </header>

      {report ? (
        <div className="panel-summary-strip">
          <span className="panel-summary-chip">{getServiceLabel(report.serviceId)}</span>
          <span className="panel-summary-chip">{getDraftStatusLabel(draftState)}</span>
          <span className="panel-summary-chip">
            {getGenerationSourceSummary(reportSession, report)}
          </span>
          {reportSession ? (
            <span className={`panel-summary-chip ${reportSession.status}`}>
              {getGenerationStatusLabel(reportSession.status)}
            </span>
          ) : null}
        </div>
      ) : null}

      <ReportFocusPanel
        report={report}
        actionMessage={actionMessage}
        draftState={draftState}
        generationSessions={generationSessions}
        generationSession={generationSession}
        onOpenGenerationStage={onOpenGenerationStage}
      />
    </article>
  );
}
