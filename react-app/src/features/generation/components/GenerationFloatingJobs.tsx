import { memo, useMemo } from "react";
import type { GenerationSession } from "../../../types/generationSession";
import {
  buildFloatingJobsSummary,
  getJobNote,
  getRunningStageLabel,
} from "../generationPresentation";

type GenerationFloatingJobsProps = {
  activeReportId: string | null;
  jobsOpen: boolean;
  onClearFinished: () => void;
  onDismiss: (reportId: string) => void;
  onOpenPreview: (reportId?: string) => void;
  onOpenStage: (reportId?: string) => void;
  onToggleOpen: () => void;
  sessions: GenerationSession[];
};

export const GenerationFloatingJobs = memo(function GenerationFloatingJobs({
  activeReportId,
  jobsOpen,
  onClearFinished,
  onDismiss,
  sessions,
  onOpenPreview,
  onOpenStage,
  onToggleOpen,
}: GenerationFloatingJobsProps) {
  const { jobsHeadline, jobsSubline, orderedSessions } = useMemo(
    () => buildFloatingJobsSummary(sessions, activeReportId),
    [activeReportId, sessions],
  );
  void onClearFinished;
  void onDismiss;

  return (
    <div className="floating-jobs" id="floatingJobs" hidden={sessions.length === 0}>
      <button
        className="floating-jobs-toggle"
        id="jobsToggle"
        type="button"
        aria-expanded={jobsOpen}
        aria-controls="jobsPanel"
        onClick={onToggleOpen}
      >
        <span className="jobs-toggle-copy">
          <strong id="jobsHeadline">{jobsHeadline}</strong>
          <span id="jobsSubline">{jobsSubline}</span>
        </span>
        <span className="jobs-count" id="jobsCount">{sessions.length}</span>
      </button>

      <div className="floating-jobs-panel" id="jobsPanel" hidden={!jobsOpen}>
          <div className="floating-head">
            <div>
              <h3>后台生成任务</h3>
              <p>显示文档名称与整体进度</p>
            </div>
          </div>

          <div className="jobs-list" id="jobsList">
            {orderedSessions.map((session) => (
              <article className="job-item" key={session.reportId}>
                <div className="job-item-head">
                  <div>
                    <h4 className="job-title">{session.reportTitle}</h4>
                    <p className="job-note">{getJobNote(session)}</p>
                  </div>
                  <span className="job-percent">{session.progress}%</span>
                </div>
                <div className="job-marquee">
                  <span className="job-current-step">{getRunningStageLabel(session)}</span>
                </div>
                <div className="job-progress">
                  <span style={{ width: `${session.progress}%` }}></span>
                </div>
                <div className="job-item-actions">
                  <button className="inline-link-button job-toggle" type="button" onClick={() => onOpenStage(session.reportId)}>
                    查看进度
                  </button>
                  {session.status !== "processing" ? (
                    <button className="ghost-button job-review" type="button" onClick={() => onOpenPreview(session.reportId)}>
                      立即审阅
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
    </div>
  );
});
