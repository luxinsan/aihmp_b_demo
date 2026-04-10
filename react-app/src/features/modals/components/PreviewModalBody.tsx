import type { DraftState } from "../../../types/draftState";
import type { ReportDocumentDraft } from "../../../types/documentDraft";
import type { ConfirmActionKind } from "../../../types/modal";
import type { ReportRecord } from "../../../types/report";
import { getReportCardTitle } from "../../reports/utils/reportPresentation";
import { PreviewDocument } from "./PreviewDocument";

type PreviewModalBodyProps = {
  draftState?: DraftState;
  documentDraft?: ReportDocumentDraft;
  onClose: () => void;
  onEnterEdit: (reportId: string) => void;
  onOpenGenerationStage: (reportId?: string) => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
  report: ReportRecord | null;
};

export function PreviewModalBody({
  draftState,
  documentDraft,
  onClose,
  onEnterEdit,
  onOpenGenerationStage,
  onOpenConfirm,
  report,
}: PreviewModalBodyProps) {
  void draftState;
  void onOpenGenerationStage;
  void onOpenConfirm;

  return (
    <div className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="previewTitle" onClick={(event) => event.stopPropagation()}>
      <header className="preview-modal-header">
        <div className="preview-head">
          <h2 id="previewTitle">{report ? getReportCardTitle(report) : "文档预览"}</h2>
          <div className="preview-head-meta">
            {report ? (
              <span className="preview-status" id="previewStatus" data-tone={report.tone}>
                {report.status}
              </span>
            ) : null}
            {report ? <span className="preview-date" id="previewDate">更新于 {report.date}</span> : null}
          </div>
        </div>
        <button className="modal-close" id="previewClose" type="button" aria-label="关闭预览弹窗" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
      </header>

      <div className="preview-modal-body">
        <div className="preview-surface">
          <article className="preview-canvas">
            <PreviewDocument report={report} documentDraft={documentDraft} />
          </article>
        </div>
      </div>

      <footer className="preview-modal-footer">
        <div className="preview-modal-actions">
          <button className="ghost-button" id="previewCancel" type="button" onClick={onClose}>
            关闭
          </button>
          <button
            className="primary-button"
            id="previewEdit"
            type="button"
            onClick={() => {
              if (report) {
                onEnterEdit(report.id);
              }
            }}
          >
            进入编辑
          </button>
        </div>
      </footer>
    </div>
  );
}
