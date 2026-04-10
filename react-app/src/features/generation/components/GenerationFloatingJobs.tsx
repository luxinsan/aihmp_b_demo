import { useMemo } from "react";
import type { GenerationSession } from "../../../types/generationSession";

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

export function GenerationFloatingJobs({
  activeReportId,
  jobsOpen,
  onClearFinished,
  onDismiss,
  sessions,
  onOpenPreview,
  onOpenStage,
  onToggleOpen,
}: GenerationFloatingJobsProps) {
  const orderedSessions = useMemo(
    () =>
      [...sessions].sort((left, right) => {
        if (left.reportId === activeReportId) {
          return -1;
        }
        if (right.reportId === activeReportId) {
          return 1;
        }
        if (left.status === "processing" && right.status !== "processing") {
          return -1;
        }
        if (right.status === "processing" && left.status !== "processing") {
          return 1;
        }
        return right.updatedAt - left.updatedAt;
      }),
    [activeReportId, sessions],
  );
  const primarySession =
    orderedSessions.find((session) => session.reportId === activeReportId) ??
    orderedSessions.find((session) => session.status === "processing") ??
    orderedSessions[0] ??
    null;
  const jobsHeadline = primarySession?.status === "processing" ? "正在生成中" : "任务中心";
  const jobsSubline = primarySession
    ? `${primarySession.patientName} · ${primarySession.reportTitle}${
        primarySession.status === "completed" ? " 已可审阅" : ""
      }`
    : "查看文档生成进度";
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
                    <p className="job-note">
                      {session.status === "processing"
                        ? "显示文档名称与整体进度"
                        : session.status === "completed"
                          ? "后台生成已完成，文档已加入列表"
                          : "当前流程已终止"}
                    </p>
                  </div>
                  <span className="job-percent">{session.progress}%</span>
                </div>
                <div className="job-marquee">
                  <span className="job-current-step">
                    {session.stages.find((stage) => stage.status === "running")?.label ??
                      (session.status === "completed" ? "已完成全部步骤" : "等待继续处理")}
                  </span>
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
}
