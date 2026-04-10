import type { DraftState } from "../../../types/draftState";
import type { GenerationSession } from "../../../types/generationSession";
import type { ConfirmActionKind } from "../../../types/modal";
import type { ReportRecord } from "../../../types/report";
import { getLockedActionLabel, getLockedActionMessage } from "../../reports/utils/reportPresentation";

function getConfirmContent(action: ConfirmActionKind, report: ReportRecord | null) {
  if (action === "toggle-publish") {
    const nextStatus = report?.status === "已发布" ? "未发布" : "已发布";
    return {
      title: nextStatus === "已发布" ? "发布" : "撤销发布",
      description: nextStatus === "已发布" ? "发布后患者可在患者端查看和下载文档详情内容" : "撤销后患者不可在线查看",
      detail: nextStatus === "已发布" ? "确认发布当前文档？" : "确认撤销当前文档的发布状态？",
      submitLabel: "确定",
    };
  }

  return {
    title: "删除",
    description: "删除后数据不可恢复，请谨慎操作！",
    detail: "确认删除当前文档？",
    submitLabel: "确定",
  };
}

type ConfirmModalBodyProps = {
  action: ConfirmActionKind;
  draftState?: DraftState;
  generationSession?: GenerationSession | null;
  report: ReportRecord | null;
  onClose: () => void;
  onConfirmAction: () => void;
};

export function ConfirmModalBody({
  action,
  draftState,
  generationSession,
  report,
  onClose,
  onConfirmAction,
}: ConfirmModalBodyProps) {
  void draftState;
  const content = getConfirmContent(action, report);
  const isProcessing = generationSession?.status === "processing";
  const detail = isProcessing ? getLockedActionMessage(action) : content.detail;

  return (
    <div className="save-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="actionConfirmTitle" onClick={(event) => event.stopPropagation()}>
      <header className="save-confirm-header">
        <div className="save-confirm-copy">
          <h2 id="actionConfirmTitle">{content.title}</h2>
          <p id="actionConfirmMessage">{content.description}</p>
        </div>
        <button className="modal-close" id="actionConfirmClose" type="button" aria-label="关闭确认弹窗" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
      </header>

      <div className="save-confirm-body">
        <p id="actionConfirmDetail">{detail}</p>
      </div>

      <footer className="save-confirm-footer">
        <div className="save-confirm-actions">
          <button className="ghost-button" id="actionConfirmCancel" type="button" onClick={onClose}>
            取消
          </button>
          <button className="primary-button" id="actionConfirmSubmit" type="button" disabled={isProcessing} onClick={onConfirmAction}>
            {isProcessing ? getLockedActionLabel(action) : content.submitLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}
