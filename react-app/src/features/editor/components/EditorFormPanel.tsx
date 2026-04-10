import type { SectionTemplateMode } from "../../../data/sectionTemplates";
import type { ReportDocumentDraft } from "../../../types/documentDraft";
import { EditorSectionCard } from "./EditorSectionCard";

type EditorFormPanelProps = {
  activeSectionId: string | null;
  collapsedCount: number;
  collapsedSectionIds: string[];
  onCollapseAllSections: () => void;
  onExpandAllSections: () => void;
  onAddSection: () => void;
  onAddSectionTemplate: (template: "intro" | "highlights" | "recommendations") => void;
  draft: ReportDocumentDraft;
  onDraftChange: (nextDraft: ReportDocumentDraft) => void;
  onInsertBulletBlock: (sectionId?: string) => void;
  onInsertImageBlock: (sectionId?: string) => void;
  onInsertParagraphBlock: (sectionId?: string) => void;
  onInsertRadarChartBlock: (sectionId?: string) => void;
  onRequestClose: () => void;
  onRequestSave: () => void;
  onInsertTableBlock: (sectionId?: string) => void;
  onApplySectionTemplate: (
    sectionId: string,
    template: Exclude<SectionTemplateMode, "blank">,
  ) => void;
  onDuplicateSection: (sectionId: string) => void;
  onRevealSection: (sectionId: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onToggleSectionCollapse: (sectionId: string) => void;
  onUpdateSection: (
    sectionId: string,
    patch: Partial<ReportDocumentDraft["sections"][number]>,
  ) => void;
};

export function EditorFormPanel({
  activeSectionId,
  collapsedCount,
  collapsedSectionIds,
  draft,
  onDraftChange,
  onCollapseAllSections,
  onExpandAllSections,
  onAddSection,
  onAddSectionTemplate,
  onInsertBulletBlock,
  onInsertImageBlock,
  onInsertParagraphBlock,
  onInsertRadarChartBlock,
  onRequestClose,
  onRequestSave,
  onInsertTableBlock,
  onApplySectionTemplate,
  onDuplicateSection,
  onRevealSection,
  onRemoveSection,
  onMoveSectionDown,
  onMoveSectionUp,
  onToggleSectionCollapse,
  onUpdateSection,
}: EditorFormPanelProps) {
  const activeSection = draft.sections.find((section) => section.id === activeSectionId) ?? null;
  void collapsedCount;
  void onCollapseAllSections;
  void onExpandAllSections;
  void onAddSection;
  void onAddSectionTemplate;
  void onInsertBulletBlock;
  void onInsertImageBlock;
  void onInsertParagraphBlock;
  void onInsertRadarChartBlock;
  void onRequestClose;
  void onRequestSave;
  void onInsertTableBlock;
  void onApplySectionTemplate;
  void onRevealSection;

  return (
    <div className="editor-form">
      <section className="doc-hero">
        <h1
          className="editable-block"
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) => onDraftChange({ ...draft, title: event.currentTarget.textContent?.trim() || draft.title })}
        >
          {draft.title}
        </h1>
        <p
          className="editable-block"
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) => onDraftChange({ ...draft, bodyIntro: event.currentTarget.textContent?.trim() || draft.bodyIntro })}
        >
          {draft.bodyIntro}
        </p>
        <div className="doc-meta">
          <span
            className="editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) => onDraftChange({ ...draft, inputScope: event.currentTarget.textContent?.trim() || draft.inputScope })}
          >
            {draft.inputScope}
          </span>
          <span>{draft.date}</span>
        </div>
      </section>

      <div className="doc-sections">
        {draft.sections.map((section, index) => (
          <EditorSectionCard
            key={section.id}
            isActive={activeSectionId === section.id}
            canRemove={draft.sections.length > 1}
            canMoveDown={index < draft.sections.length - 1}
            canMoveUp={index > 0}
            index={index}
            isCollapsed={collapsedSectionIds.includes(section.id)}
            onDuplicate={() => onDuplicateSection(section.id)}
            onMoveDown={() => onMoveSectionDown(section.id)}
            onMoveUp={() => onMoveSectionUp(section.id)}
            onRemove={() => onRemoveSection(section.id)}
            onToggleCollapse={() => onToggleSectionCollapse(section.id)}
            section={section}
            onInsertBulletBlock={onInsertBulletBlock}
            onInsertImageBlock={onInsertImageBlock}
            onInsertParagraphBlock={onInsertParagraphBlock}
            onInsertRadarChartBlock={onInsertRadarChartBlock}
            onInsertTableBlock={onInsertTableBlock}
            onApplyTemplate={onApplySectionTemplate}
            onUpdate={onUpdateSection}
          />
        ))}
      </div>
    </div>
  );
}
