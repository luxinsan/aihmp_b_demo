import type { SectionTemplateMode } from "../../../data/sectionTemplates";
import type { ReportDocumentDraft } from "../../../types/documentDraft";
import { EditorWidgetCard } from "./EditorWidgetCard";

type EditorSectionCardProps = {
  isActive: boolean;
  canRemove: boolean;
  canMoveDown: boolean;
  canMoveUp: boolean;
  index: number;
  isCollapsed: boolean;
  onDuplicate: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  onToggleCollapse: () => void;
  section: ReportDocumentDraft["sections"][number];
  onInsertBulletBlock: (sectionId: string) => void;
  onInsertImageBlock: (sectionId: string) => void;
  onInsertParagraphBlock: (sectionId: string) => void;
  onInsertRadarChartBlock: (sectionId: string) => void;
  onInsertTableBlock: (sectionId: string) => void;
  onApplyTemplate: (sectionId: string, template: Exclude<SectionTemplateMode, "blank">) => void;
  onUpdate: (
    sectionId: string,
    patch: Partial<ReportDocumentDraft["sections"][number]>,
  ) => void;
};

export function EditorSectionCard({
  isActive,
  canRemove,
  canMoveDown,
  canMoveUp,
  index,
  isCollapsed,
  onDuplicate,
  onMoveDown,
  onMoveUp,
  onRemove,
  onToggleCollapse,
  section,
  onInsertBulletBlock,
  onInsertImageBlock,
  onInsertParagraphBlock,
  onInsertRadarChartBlock,
  onInsertTableBlock,
  onApplyTemplate,
  onUpdate,
}: EditorSectionCardProps) {
  function updateParagraph(index: number, value: string) {
    onUpdate(section.id, {
      paragraphs: section.paragraphs.map((paragraph, paragraphIndex) =>
        paragraphIndex === index ? value : paragraph,
      ),
    });
  }

  function updateBullet(index: number, value: string) {
    onUpdate(section.id, {
      bullets: section.bullets.map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)),
    });
  }

  void onApplyTemplate;

  function handleUpdateWidget(
    widgetId: string,
    patch: Partial<ReportDocumentDraft["sections"][number]["widgets"][number]>,
  ) {
    onUpdate(section.id, {
      widgets: section.widgets.map((widget) => (widget.id === widgetId ? { ...widget, ...patch } : widget)),
    });
  }

  function handleRemoveWidget(widgetId: string) {
    onUpdate(section.id, {
      widgets: section.widgets.filter((widget) => widget.id !== widgetId),
    });
  }

  function handleMoveWidget(widgetId: string, direction: "up" | "down") {
    const currentIndex = section.widgets.findIndex((widget) => widget.id === widgetId);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= section.widgets.length) {
      return;
    }

    const nextWidgets = [...section.widgets];
    const [targetWidget] = nextWidgets.splice(currentIndex, 1);
    if (!targetWidget) {
      return;
    }

    nextWidgets.splice(nextIndex, 0, targetWidget);

    onUpdate(section.id, {
      widgets: nextWidgets,
    });
  }

  return (
    <article
      className={`doc-section editor-section-card${isActive ? " is-active" : ""}`}
      id={`editor-section-${section.id}`}
      data-section-id={section.id}
    >
      <div className="editor-section-order-actions" hidden>
        <button className="editor-widget-shift" type="button" onClick={onToggleCollapse}>
          {isCollapsed ? "展开" : "折叠"}
        </button>
        <button className="editor-widget-shift" type="button" onClick={onDuplicate}>
          复制
        </button>
        <button className="editor-widget-shift" type="button" onClick={onMoveUp} disabled={!canMoveUp}>
          上移
        </button>
        <button className="editor-widget-shift" type="button" onClick={onMoveDown} disabled={!canMoveDown}>
          下移
        </button>
        <button className="editor-widget-remove" type="button" onClick={onRemove} disabled={!canRemove}>
          删除
        </button>
      </div>

      {isCollapsed ? null : (
        <>
          <h3
            className="doc-section-title editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) => onUpdate(section.id, { title: event.currentTarget.textContent?.trim() || section.title })}
          >
            {section.title || `章节 ${index + 1}`}
          </h3>

          <div className="doc-section-body">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                className="editable-block"
                contentEditable
                suppressContentEditableWarning
                key={`${section.id}-paragraph-${paragraphIndex}`}
                onBlur={(event) => updateParagraph(paragraphIndex, event.currentTarget.textContent?.trim() || "")}
              >
                {paragraph}
              </p>
            ))}

            {section.bullets.length ? (
              <ul className="doc-list">
                {section.bullets.map((bullet, bulletIndex) => (
                  <li
                    className="editable-block"
                    contentEditable
                    suppressContentEditableWarning
                    key={`${section.id}-bullet-${bulletIndex}`}
                    onBlur={(event) => updateBullet(bulletIndex, event.currentTarget.textContent?.trim() || "")}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="editor-section-actions" hidden>
            <button className="editor-chip-button" type="button" onClick={() => onInsertParagraphBlock(section.id)}>
              插入段落
            </button>
            <button className="editor-chip-button" type="button" onClick={() => onInsertBulletBlock(section.id)}>
              插入要点
            </button>
            <button className="editor-chip-button" type="button" onClick={() => onInsertImageBlock(section.id)}>
              插入图片
            </button>
            <button className="editor-chip-button" type="button" onClick={() => onInsertTableBlock(section.id)}>
              插入表格
            </button>
            <button className="editor-chip-button" type="button" onClick={() => onInsertRadarChartBlock(section.id)}>
              生活方式评估图
            </button>
          </div>

          {section.widgets.length ? (
            <div className="editor-widget-stack">
              {section.widgets.map((widget, widgetIndex) => (
                <EditorWidgetCard
                  key={widget.id}
                  canMoveDown={widgetIndex < section.widgets.length - 1}
                  canMoveUp={widgetIndex > 0}
                  index={widgetIndex}
                  widget={widget}
                  onMoveDown={() => handleMoveWidget(widget.id, "down")}
                  onMoveUp={() => handleMoveWidget(widget.id, "up")}
                  onRemove={() => handleRemoveWidget(widget.id)}
                  onUpdate={(patch) => handleUpdateWidget(widget.id, patch)}
                />
              ))}
            </div>
          ) : (
            <div className="doc-section-body">
              <p className="editable-block">本节内容待补充。</p>
            </div>
          )}
        </>
      )}
    </article>
  );
}
