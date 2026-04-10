import type { ReportDocumentDraft } from "../types/documentDraft";

export type SectionTemplateMode = "blank" | "intro" | "highlights" | "recommendations";

type SectionTemplateDefinition = {
  label: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export const sectionTemplates: Record<Exclude<SectionTemplateMode, "blank">, SectionTemplateDefinition> = {
  intro: {
    label: "前言模板",
    title: "前言",
    paragraphs: ["请在此补充本节的背景说明、解读范围和整体判断。"],
    bullets: [],
  },
  highlights: {
    label: "重点信息模板",
    title: "重点信息",
    paragraphs: [],
    bullets: ["请补充关键指标变化。", "请补充需要优先关注的风险。"],
  },
  recommendations: {
    label: "建议模板",
    title: "管理建议",
    paragraphs: [],
    bullets: ["请补充近期干预建议。", "请补充后续随访安排。"],
  },
};

export function createSectionTemplateDraft(
  reportId: string,
  nextIndex: number,
  mode: SectionTemplateMode,
): ReportDocumentDraft["sections"][number] {
  const sectionId = `${reportId}-section-extra-${nextIndex}`;
  const baseSection = {
    id: sectionId,
    title: `新增章节 ${nextIndex}`,
    paragraphs: [] as string[],
    bullets: [] as string[],
    widgets: [],
    contentItems: [
      {
        id: `${sectionId}-paragraph-trailing`,
        type: "paragraph" as const,
        text: "",
        tagName: "p" as const,
      },
    ],
  };

  if (mode === "blank") {
    return baseSection;
  }

  const template = sectionTemplates[mode];
  return {
    ...baseSection,
    title: template.title,
    paragraphs: [...template.paragraphs],
    bullets: [...template.bullets],
    contentItems: [
      ...template.paragraphs.map((paragraph, index) => ({
        id: `${sectionId}-paragraph-${index}`,
        type: "paragraph" as const,
        text: paragraph,
        tagName: "p" as const,
      })),
      ...template.bullets.map((bullet, index) => ({
        id: `${sectionId}-bullet-${index}`,
        type: "bullet" as const,
        text: bullet,
      })),
      {
        id: `${sectionId}-paragraph-trailing`,
        type: "paragraph" as const,
        text: "",
        tagName: "p" as const,
      },
    ],
  };
}
