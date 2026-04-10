import type { ReportDocumentDraft } from "../../../types/documentDraft";

type EditorMetadataFieldsProps = {
  draft: ReportDocumentDraft;
  onDraftChange: (nextDraft: ReportDocumentDraft) => void;
};

export function EditorMetadataFields({
  draft,
  onDraftChange,
}: EditorMetadataFieldsProps) {
  return (
    <div className="editor-form-grid">
      <label className="editor-field">
        <span>文档标题</span>
        <input
          className="react-input"
          value={draft.title}
          onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
        />
      </label>

      <label className="editor-field">
        <span>封面主文案</span>
        <input
          className="react-input"
          value={draft.coverLine}
          onChange={(event) => onDraftChange({ ...draft, coverLine: event.target.value })}
        />
      </label>

      <label className="editor-field editor-field-full">
        <span>正文导语</span>
        <textarea
          className="react-input react-textarea"
          rows={4}
          value={draft.bodyIntro}
          onChange={(event) => onDraftChange({ ...draft, bodyIntro: event.target.value })}
        />
      </label>

      <label className="editor-field editor-field-full">
        <span>输入数据说明</span>
        <textarea
          className="react-input react-textarea"
          rows={3}
          value={draft.inputScope}
          onChange={(event) => onDraftChange({ ...draft, inputScope: event.target.value })}
        />
      </label>
    </div>
  );
}
