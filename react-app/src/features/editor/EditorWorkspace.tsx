import { useState } from "react";
import { createSectionTemplateDraft, type SectionTemplateMode } from "../../data/sectionTemplates";
import type { ContentWidgetType } from "../../types/contentWidget";
import type { ReportDocumentDraft } from "../../types/documentDraft";
import type { ReportRecord } from "../../types/report";
import { createWidgetBlock } from "../../utils/documentDraft";
import { EditorFormPanel } from "./components/EditorFormPanel";
import { EditorMiniPreview } from "./components/EditorMiniPreview";

type EditorWorkspaceProps = {
  report: ReportRecord;
  draft: ReportDocumentDraft;
  isDirty: boolean;
  onDraftChange: (nextDraft: ReportDocumentDraft) => void;
  onDiscard: () => void;
  onSave: () => void;
  onClose: () => void;
};

export function EditorWorkspace({
  report,
  draft,
  isDirty,
  onDraftChange,
  onDiscard,
  onSave,
  onClose,
}: EditorWorkspaceProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(draft.sections[0]?.id ?? null);
  const [pendingAction, setPendingAction] = useState<"save" | "close" | null>(null);
  const [collapsedSectionIds, setCollapsedSectionIds] = useState<string[]>([]);

  function updateSection(
    sectionId: string,
    patch: Partial<ReportDocumentDraft["sections"][number]>,
  ) {
    onDraftChange({
      ...draft,
      sections: draft.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              ...patch,
            }
          : section,
      ),
    });
  }

  function handleInsertParagraphBlock(sectionId?: string) {
    updateDraftSection(sectionId, (section) => ({
      ...section,
      paragraphs: [...section.paragraphs, "新增段落内容"],
    }));
  }

  function handleInsertBulletBlock(sectionId?: string) {
    updateDraftSection(sectionId, (section) => ({
      ...section,
      bullets: [...section.bullets, "新增要点内容"],
    }));
  }

  function handleInsertImageBlock(sectionId?: string) {
    handleInsertWidgetBlock("image", sectionId);
  }

  function handleInsertTableBlock(sectionId?: string) {
    handleInsertWidgetBlock("table", sectionId);
  }

  function handleInsertRadarChartBlock(sectionId?: string) {
    handleInsertWidgetBlock("radar-chart", sectionId);
  }

  function handleMoveSection(sectionId: string, direction: "up" | "down") {
    const currentIndex = draft.sections.findIndex((section) => section.id === sectionId);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= draft.sections.length) {
      return;
    }

    const nextSections = [...draft.sections];
    const [targetSection] = nextSections.splice(currentIndex, 1);
    if (!targetSection) {
      return;
    }

    nextSections.splice(nextIndex, 0, targetSection);
    onDraftChange({
      ...draft,
      sections: nextSections,
    });
    setActiveSectionId(sectionId);
  }

  function handleToggleSectionCollapse(sectionId: string) {
    setActiveSectionId(sectionId);
    setCollapsedSectionIds((current) =>
      current.includes(sectionId) ? current.filter((item) => item !== sectionId) : [...current, sectionId],
    );
  }

  function handleRevealSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setCollapsedSectionIds((current) => current.filter((item) => item !== sectionId));
  }

  function handleCollapseAllSections() {
    setCollapsedSectionIds(draft.sections.map((section) => section.id));
  }

  function handleExpandAllSections() {
    setCollapsedSectionIds([]);
  }

  function handleAddSection() {
    const nextIndex = draft.sections.length + 1;
    const nextSection = createSectionTemplateDraft(report.id, nextIndex, "blank");
    onDraftChange({
      ...draft,
      sections: [...draft.sections, nextSection],
    });
    setActiveSectionId(nextSection.id);
    setCollapsedSectionIds((current) => current.filter((item) => item !== nextSection.id));
  }

  function handleAddSectionTemplate(template: Exclude<SectionTemplateMode, "blank">) {
    const nextIndex = draft.sections.length + 1;
    const nextSection = createSectionTemplateDraft(report.id, nextIndex, template);
    onDraftChange({
      ...draft,
      sections: [...draft.sections, nextSection],
    });
    setActiveSectionId(nextSection.id);
    setCollapsedSectionIds((current) => current.filter((item) => item !== nextSection.id));
  }

  function handleApplySectionTemplate(
    sectionId: string,
    template: Exclude<SectionTemplateMode, "blank">,
  ) {
    const targetSection = draft.sections.find((section) => section.id === sectionId);
    if (!targetSection) {
      return;
    }

    const templateDraft = createSectionTemplateDraft(report.id, draft.sections.length + 1, template);
    updateSection(sectionId, {
      title: templateDraft.title,
      paragraphs: templateDraft.paragraphs,
      bullets: templateDraft.bullets,
    });
    setActiveSectionId(sectionId);
  }

  function handleRemoveSection(sectionId: string) {
    if (draft.sections.length <= 1) {
      return;
    }

    onDraftChange({
      ...draft,
      sections: draft.sections.filter((section) => section.id !== sectionId),
    });
    setActiveSectionId((current) => {
      if (current !== sectionId) {
        return current;
      }

      return draft.sections.find((section) => section.id !== sectionId)?.id ?? null;
    });
    setCollapsedSectionIds((current) => current.filter((item) => item !== sectionId));
  }

  function handleDuplicateSection(sectionId: string) {
    const currentIndex = draft.sections.findIndex((section) => section.id === sectionId);
    if (currentIndex === -1) {
      return;
    }

    const targetSection = draft.sections[currentIndex];
    if (!targetSection) {
      return;
    }

    const nextSeed = draft.sections.length + 1;
    const nextSectionId = `${report.id}-section-extra-${nextSeed}`;
    const nextSection = {
      ...targetSection,
      id: nextSectionId,
      title: `${targetSection.title}（副本）`,
      paragraphs: [...targetSection.paragraphs],
      bullets: [...targetSection.bullets],
      widgets: targetSection.widgets.map((widget, widgetIndex) => ({
        ...widget,
        id: `${nextSectionId}-${widget.type}-${widgetIndex + 1}`,
        columns: widget.columns ? [...widget.columns] : undefined,
        metrics: widget.metrics ? widget.metrics.map((metric) => ({ ...metric })) : undefined,
        rows: widget.rows ? widget.rows.map((row) => [...row]) : undefined,
      })),
    };

    const nextSections = [...draft.sections];
    nextSections.splice(currentIndex + 1, 0, nextSection);
    onDraftChange({
      ...draft,
      sections: nextSections,
    });
    setActiveSectionId(nextSection.id);
    setCollapsedSectionIds((current) => current.filter((item) => item !== nextSection.id));
  }

  function handleRequestClose() {
    if (!isDirty) {
      onClose();
      return;
    }

    setPendingAction("close");
  }

  function handleRequestSave() {
    setPendingAction("save");
  }

  function handleConfirmPendingAction() {
    if (pendingAction === "save") {
      onSave();
    }

    if (pendingAction === "close") {
      onClose();
    }

    setPendingAction(null);
  }

  function handleInsertWidgetBlock(type: ContentWidgetType, sectionId?: string) {
    updateDraftSection(sectionId, (section) => ({
      ...section,
      widgets: [...section.widgets, createWidgetBlock(type, `${section.id}-${type}-${section.widgets.length + 1}`)],
    }));
  }

  function updateDraftSection(
    sectionId: string | undefined,
    transform: (section: ReportDocumentDraft["sections"][number]) => ReportDocumentDraft["sections"][number],
  ) {
    const targetSectionId = sectionId ?? draft.sections[draft.sections.length - 1]?.id;
    if (!targetSectionId) {
      return;
    }

    const targetSection = draft.sections.find((section) => section.id === targetSectionId);
    if (!targetSection) {
      return;
    }

    onDraftChange({
      ...draft,
      sections: draft.sections.map((section) =>
        section.id === targetSectionId ? transform(section) : section,
      ),
    });
    setActiveSectionId(targetSectionId);
  }

  return (
    <section className="generation-screen" data-view="editing">
      <header className="generation-shell-header">
        <div className="generation-shell-left">
          <button className="generation-exit" type="button" onClick={handleRequestClose}>
            <span aria-hidden="true">×</span>
            <span>退出</span>
          </button>
          <div className="generation-shell-title">
            <h2>{report.title}</h2>
            <p hidden>左侧可核对原始数据，右侧可直接编辑 AI 生成内容。</p>
          </div>
        </div>

        <div className="generation-shell-actions">
          <button className="primary-button" type="button" onClick={handleRequestSave}>
            保存
          </button>
        </div>
      </header>

      <div className="review-shell-body">
        <section className="editor-pane">
          <div className="editor-pane-head">
            <div>
              <strong>报告草稿</strong>
              <p>左侧可核对原始数据，右侧可直接编辑 AI 生成内容。</p>
            </div>
          </div>
          <div className="editor-surface">
            <article className="document-canvas">
              <EditorFormPanel
                activeSectionId={activeSectionId}
                collapsedCount={collapsedSectionIds.length}
                collapsedSectionIds={collapsedSectionIds}
                onAddSection={handleAddSection}
                onAddSectionTemplate={handleAddSectionTemplate}
                onCollapseAllSections={handleCollapseAllSections}
                draft={draft}
                onExpandAllSections={handleExpandAllSections}
                onDraftChange={onDraftChange}
                onInsertBulletBlock={handleInsertBulletBlock}
                onInsertImageBlock={handleInsertImageBlock}
                onInsertParagraphBlock={handleInsertParagraphBlock}
                onInsertRadarChartBlock={handleInsertRadarChartBlock}
                onInsertTableBlock={handleInsertTableBlock}
                onApplySectionTemplate={handleApplySectionTemplate}
                onDuplicateSection={handleDuplicateSection}
                onRevealSection={handleRevealSection}
                onRemoveSection={handleRemoveSection}
                onMoveSectionDown={(sectionId) => handleMoveSection(sectionId, "down")}
                onMoveSectionUp={(sectionId) => handleMoveSection(sectionId, "up")}
                onToggleSectionCollapse={handleToggleSectionCollapse}
                onRequestClose={handleRequestClose}
                onRequestSave={handleRequestSave}
                onUpdateSection={updateSection}
              />
            </article>
          </div>

          <div className="selection-toolbar" hidden>
            <div className="selection-tool-group"></div>
          </div>
          <div className="block-inserter" hidden>
            <button className="block-inserter-toggle" type="button" aria-label="添加内容">+</button>
            <div className="block-inserter-menu" hidden>
              <button className="block-inserter-item" type="button">插入图片</button>
              <button className="block-inserter-item" type="button">插入表格</button>
              <button className="block-inserter-item" type="button">生活方式评估图</button>
            </div>
          </div>
          <div className="table-toolbar" hidden>
            <button className="selection-tool" type="button">加行</button>
            <button className="selection-tool" type="button">加列</button>
            <button className="selection-tool" type="button">删行</button>
            <button className="selection-tool" type="button">删列</button>
            <button className="selection-tool" type="button">合并右侧</button>
          </div>
          <input type="file" accept="image/*" hidden />
        </section>

        <aside className="review-sidebar">
          <EditorMiniPreview activeSectionId={activeSectionId} draft={draft} />
        </aside>
      </div>

      {pendingAction ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setPendingAction(null)}>
          <div
            className="save-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editorConfirmTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="save-confirm-header">
              <div className="save-confirm-copy">
                <h2 id="editorConfirmTitle">{pendingAction === "save" ? "确认保存" : "确认退出"}</h2>
                <p>
                  {pendingAction === "save"
                    ? "确认保存当前编辑内容，并返回报告文档列表？"
                    : "当前仍有未保存改动，确认退出编辑吗？"}
                </p>
              </div>
              <button className="modal-close" type="button" aria-label="关闭保存确认弹窗" onClick={() => setPendingAction(null)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6 18 18"></path>
                  <path d="M18 6 6 18"></path>
                </svg>
              </button>
            </header>

            <div className="save-confirm-body">
              <p>
                {pendingAction === "save"
                  ? "保存后将同步更新当前文档，并退出编辑页返回列表。"
                  : "退出后当前未保存改动仍会保留，你可以稍后回来继续编辑。"}
              </p>
            </div>

            <footer className="save-confirm-footer">
              <div className="save-confirm-actions">
                <button className="ghost-button" type="button" onClick={() => setPendingAction(null)}>
                  取消
                </button>
                {pendingAction === "close" ? (
                  <button className="ghost-button editor-danger-button" type="button" onClick={onDiscard}>
                    放弃改动
                  </button>
                ) : null}
                <button className="primary-button" type="button" onClick={handleConfirmPendingAction}>
                  {pendingAction === "save" ? "确认保存" : "保留草稿并退出"}
                </button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
