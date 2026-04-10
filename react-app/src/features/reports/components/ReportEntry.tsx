import type { DraftState } from "../../../types/draftState";
import type { GenerationSession } from "../../../types/generationSession";
import type { ConfirmActionKind } from "../../../types/modal";
import type { ReportRecord } from "../../../types/report";
import { ReportServiceIcon } from "./ReportServiceIcon";
import {
  getReportCardTitle,
  getReportVisualType,
  getLockedActionLabel,
  isGenerationLocked,
} from "../utils/reportPresentation";

type ReportEntryProps = {
  generationSession?: GenerationSession | null;
  report: ReportRecord;
  isActive: boolean;
  isMenuOpen: boolean;
  draftState?: DraftState;
  onToggleMenu: (reportId: string) => void;
  onOpenEdit: (reportId: string) => void;
  onOpenPreview: (reportId: string) => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
  onCloseMenu: () => void;
};

export function ReportEntry({
  generationSession,
  report,
  isActive,
  isMenuOpen,
  draftState,
  onToggleMenu,
  onOpenEdit,
  onOpenPreview,
  onOpenConfirm,
  onCloseMenu,
}: ReportEntryProps) {
  void draftState;
  const generationLocked = isGenerationLocked(generationSession);
  const reportCardTitle = getReportCardTitle(report);
  const visualType = getReportVisualType(report);
  const publishLabel = report.status === "已发布" ? "撤销发布" : "发布";
  return (
    <article
      className={`report-card interactive${isMenuOpen ? " menu-open" : ""}`}
      data-report-id={report.id}
      role="button"
      tabIndex={0}
      aria-label={`预览 ${reportCardTitle}`}
      onClick={() => onOpenPreview(report.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenPreview(report.id);
        }
      }}
    >
      <div className="report-card-top">
        <div className="doc-icon" data-service={visualType} aria-hidden="true">
          <ReportServiceIcon visualType={visualType} />
        </div>
        <div className="report-chip" data-tone={report.tone}>
          {report.status}
        </div>

        <div className="report-card-actions">
          <button
            className="more-button"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu(report.id);
            }}
            aria-label="更多操作"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </button>

          <div className="report-more-menu" role="menu" hidden={!isMenuOpen}>
              <button
                className="report-menu-item"
                type="button"
                data-action="toggle-publish"
                disabled={generationLocked}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenConfirm(report.id, "toggle-publish");
                  onCloseMenu();
                }}
              >
                {generationLocked ? getLockedActionLabel("toggle-publish") : publishLabel}
              </button>
              <button
                className="report-menu-item"
                type="button"
                data-action="export"
                disabled
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                导出
              </button>
              <button
                className="report-menu-item"
                type="button"
                data-action="edit"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenEdit(report.id);
                  onCloseMenu();
                }}
              >
                编辑
              </button>
              <button
                className="report-menu-item danger"
                type="button"
                data-action="delete"
                disabled={generationLocked}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenConfirm(report.id, "delete");
                  onCloseMenu();
                }}
              >
                {generationLocked ? getLockedActionLabel("delete") : "删除"}
              </button>
            </div>
        </div>

      </div>

      <div className="report-content">
        <h3 className="report-title">{reportCardTitle}</h3>
        <p className="report-subtitle" hidden>
          {""}
        </p>
      </div>

      <div className="report-footer">
        <span className="time-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 7v5l3 2" />
            <circle cx="12" cy="12" r="8" />
          </svg>
        </span>
        <span className="report-date">{report.date}</span>
      </div>
    </article>
  );
}
