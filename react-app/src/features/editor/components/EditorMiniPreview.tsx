import type { ReportDocumentDraft } from "../../../types/documentDraft";
import {
  getSectionLead,
} from "../utils/editorStructure";

type EditorMiniPreviewProps = {
  activeSectionId: string | null;
  draft: ReportDocumentDraft;
};

export function EditorMiniPreview({ activeSectionId, draft }: EditorMiniPreviewProps) {
  const activeSection = draft.sections.find((section) => section.id === activeSectionId) ?? draft.sections[0] ?? null;
  const previewSections = activeSection
    ? [activeSection, ...draft.sections.filter((section) => section.id !== activeSection.id)].slice(0, 3)
    : draft.sections.slice(0, 3);

  return (
    <>
      <section className="review-card review-status-card editor-preview-pane">
        <div className="review-status-top">
          <div className="thinking-status-group">
            <div className="thinking-status-pill">
              <span className="thinking-pulse is-still" aria-hidden="true"></span>
              <span>已进入编辑</span>
            </div>
          </div>
          <p className="thinking-notice">
            {activeSection ? `正在编辑：${activeSection.title || "未命名章节"}` : "正在整理文档内容"}
          </p>
        </div>
        <div className="stage-strip">
          {draft.sections.slice(0, 5).map((section) => (
            <span
              className="stage-card"
              data-status={activeSection?.id === section.id ? "running" : section.paragraphs.length || section.bullets.length || section.widgets.length ? "done" : "pending"}
              key={section.id}
            >
              <strong>{section.title || "未命名章节"}</strong>
              <span>{getSectionLead(section)}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="review-card reference-card">
        <div className="reference-section">
          <div className="reference-patient">
            <div className="avatar small">{draft.title.slice(0, 1) || "文"}</div>
            <div className="reference-patient-copy">
              <div className="reference-patient-inline">
                <strong>{draft.title}</strong>
                <em>{draft.sections.length} 个章节</em>
              </div>
            </div>
          </div>
        </div>
        <div className="reference-section">
          <span className="reference-section-label">当前内容</span>
          <div className="reference-source-list">
            {previewSections.map((section) => (
              <span className="reference-source-chip" key={section.id}>
                {section.title || "未命名章节"}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="review-card log-card">
        <div className="review-card-head">
          <strong>编辑信息链</strong>
          <span>当前文档结构与内容摘要</span>
        </div>
        <ul className="process-log">
          {previewSections.map((section) => (
            <li
              className="log-entry"
              data-kind={activeSection?.id === section.id ? "searching" : "system"}
              key={section.id}
            >
              <span className="log-marker" aria-hidden="true"></span>
              <div className="log-entry-body">
                <div className="log-entry-head">
                  <div className="log-entry-meta">
                    <span className="log-source">
                      {activeSection?.id === section.id
                        ? "当前章节"
                        : `章节 ${draft.sections.findIndex((item) => item.id === section.id) + 1}`}
                    </span>
                  </div>
                </div>
                <ul className="log-entry-tasks">
                  <li className="log-entry-copy-item">
                    <span className="log-entry-copy-status" data-kind={activeSection?.id === section.id ? "searching" : "system"} aria-hidden="true"></span>
                    <span className="log-entry-copy-text">{getSectionLead(section)}</span>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
