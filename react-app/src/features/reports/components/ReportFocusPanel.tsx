import type { DraftState } from "../../../types/draftState";
import type { GenerationSession } from "../../../types/generationSession";
import type { ReportRecord } from "../../../types/report";
import {
  getDraftStatusLabel,
  getGenerationDetailSummary,
  getGenerationHeadline,
  getGenerationSourceSummary,
  getGenerationSummary,
  getGenerationUpdatedLabel,
  getReportIconLabel,
  getServiceLabel,
} from "../utils/reportPresentation";

type ReportFocusPanelProps = {
  actionMessage: string;
  draftState?: DraftState;
  generationSessions: GenerationSession[];
  generationSession: GenerationSession | null;
  onOpenGenerationStage: (reportId?: string) => void;
  report: ReportRecord | null;
};

export function ReportFocusPanel({
  report,
  actionMessage,
  draftState,
  generationSessions,
  generationSession,
  onOpenGenerationStage,
}: ReportFocusPanelProps) {
  if (!report) {
    return <p className="muted">当前没有可展示的报告。</p>;
  }

  const reportSession =
    generationSessions.find((session) => session.reportId === report.id) ??
    (generationSession?.reportId === report.id ? generationSession : null);
  const matchesGeneration = Boolean(reportSession);
  const generationLabel = getGenerationHeadline(reportSession);
  const generationSummary = getGenerationSummary(reportSession);

  return (
    <div className="report-focus">
      <div className="focus-hero">
        <span className="report-entry-icon large" data-service={report.serviceId}>
          {getReportIconLabel(report.serviceId)}
        </span>
        <div className="focus-hero-copy">
          <strong>{report.title}</strong>
          <p>{report.subtitle}</p>
          <div className="focus-hero-meta">
            <span>{getServiceLabel(report.serviceId)}</span>
            <span>{report.status}</span>
            <span>{report.date}</span>
          </div>
        </div>
      </div>

      <dl className="focus-meta">
        <div>
          <dt>更新日期</dt>
          <dd>{report.date}</dd>
        </div>
        <div>
          <dt>文档状态</dt>
          <dd>{report.status}</dd>
        </div>
        <div>
          <dt>服务类型</dt>
          <dd>{getServiceLabel(report.serviceId)}</dd>
        </div>
        <div>
          <dt>草稿状态</dt>
          <dd>{getDraftStatusLabel(draftState)}</dd>
        </div>
        <div>
          <dt>生成状态</dt>
          <dd>{getGenerationDetailSummary(reportSession)}</dd>
        </div>
        <div>
          <dt>输入来源</dt>
          <dd>{getGenerationSourceSummary(reportSession, report)}</dd>
        </div>
        <div>
          <dt>任务更新时间</dt>
          <dd>{getGenerationUpdatedLabel(reportSession)}</dd>
        </div>
      </dl>

      {matchesGeneration && generationLabel ? (
        <div className="focus-job-card">
          <div className="focus-job-copy">
            <strong>{generationLabel}</strong>
            <p>{reportSession?.overallStatus}</p>
            <span className="focus-job-progress">
              {generationSummary ?? `${reportSession?.progress}% · ${reportSession?.briefTitle}`}
            </span>
            <div className="focus-job-meta">
              <span>{getGenerationSourceSummary(reportSession, report)}</span>
              <span>{getGenerationUpdatedLabel(reportSession)}</span>
            </div>
          </div>
          <button
            className="ghost-button focus-job-button"
            type="button"
            onClick={() => onOpenGenerationStage(reportSession?.reportId)}
          >
            查看任务
          </button>
        </div>
      ) : null}

      {(reportSession?.selectedSources.length || report.selectedSources?.length) ? (
        <div className="focus-source-list">
          {(reportSession?.selectedSources ?? report.selectedSources ?? []).map((source) => (
            <span className="focus-source-chip" key={source}>
              {source}
            </span>
          ))}
        </div>
      ) : null}

      <div className="focus-note">
        <strong>当前迁移进度</strong>
        <p>{actionMessage}</p>
      </div>
    </div>
  );
}
