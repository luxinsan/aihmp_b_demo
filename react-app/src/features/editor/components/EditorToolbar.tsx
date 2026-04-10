import { sectionTemplates, type SectionTemplateMode } from "../../../data/sectionTemplates";

type EditorToolbarProps = {
  activeSectionTitle: string | null;
  collapsedCount: number;
  onCollapseAllSections: () => void;
  onExpandAllSections: () => void;
  onAddSection: () => void;
  onAddSectionTemplate: (template: Exclude<SectionTemplateMode, "blank">) => void;
  onInsertBulletBlock: () => void;
  onInsertImageBlock: () => void;
  onInsertParagraphBlock: () => void;
  onInsertRadarChartBlock: () => void;
  onInsertTableBlock: () => void;
};

export function EditorToolbar({
  activeSectionTitle,
  collapsedCount,
  onCollapseAllSections,
  onExpandAllSections,
  onAddSection,
  onAddSectionTemplate,
  onInsertBulletBlock,
  onInsertImageBlock,
  onInsertParagraphBlock,
  onInsertRadarChartBlock,
  onInsertTableBlock,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="文档编辑工具">
      <div className="editor-toolbar-group">
        <button className="editor-toolbar-button" type="button" onClick={onAddSection}>
          新增章节
        </button>
        {(
          Object.entries(sectionTemplates) as Array<
            [Exclude<SectionTemplateMode, "blank">, (typeof sectionTemplates)[keyof typeof sectionTemplates]]
          >
        ).map(([templateKey, template]) => (
          <button
            key={templateKey}
            className="editor-toolbar-button"
            type="button"
            onClick={() => onAddSectionTemplate(templateKey)}
          >
            {template.label}
          </button>
        ))}
      </div>

      <div className="editor-toolbar-group">
        <button className="editor-toolbar-button" type="button" onClick={onInsertParagraphBlock}>
          插入段落
        </button>
        <button className="editor-toolbar-button" type="button" onClick={onInsertBulletBlock}>
          插入要点
        </button>
        <button className="editor-toolbar-button" type="button" onClick={onInsertImageBlock}>
          插入图片
        </button>
        <button className="editor-toolbar-button" type="button" onClick={onInsertTableBlock}>
          插入表格
        </button>
        <button className="editor-toolbar-button" type="button" onClick={onInsertRadarChartBlock}>
          插入图表
        </button>
      </div>

      <div className="editor-toolbar-note">
        当前章节：{activeSectionTitle ?? "未选择章节"}，已折叠 {collapsedCount} 节。
        <button className="editor-toolbar-link" type="button" onClick={onCollapseAllSections}>
          全部折叠
        </button>
        <button className="editor-toolbar-link" type="button" onClick={onExpandAllSections}>
          全部展开
        </button>
      </div>
    </div>
  );
}
