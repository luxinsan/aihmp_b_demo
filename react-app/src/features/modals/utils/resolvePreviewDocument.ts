import { patientProfile } from "../../../data/patientProfile";
import { services } from "../../../data/services";
import type { ReportDocumentDraft, SectionContentItem } from "../../../types/documentDraft";
import type { ReportRecord } from "../../../types/report";
import type { ServiceBlock } from "../../../types/service";

export type PreviewSection = ServiceBlock & {
  contentItems?: SectionContentItem[];
};

export type PreviewDocumentSource = Pick<ReportRecord, "serviceId" | "title" | "date">;

export type ResolvedPreviewDocument = {
  category: string;
  coverEn: string;
  coverLine: string;
  date: string;
  inputScope: string;
  patientCode: string;
  patientName: string;
  sections: PreviewSection[];
  title: string;
};

export function resolvePreviewDocument(
  report: PreviewDocumentSource,
  documentDraft?: ReportDocumentDraft,
): ResolvedPreviewDocument {
  const service = services[report.serviceId];

  return {
    category: documentDraft?.category ?? service.category,
    coverEn: documentDraft?.coverEn ?? service.coverEn,
    coverLine: documentDraft?.coverLine ?? service.coverLine,
    date: report.date,
    inputScope: documentDraft?.inputScope ?? "全部档案数据",
    patientCode: patientProfile.identity.code,
    patientName: patientProfile.identity.name,
    sections:
      documentDraft?.sections.map((section) => ({
        title: section.title,
        paragraphs: section.paragraphs,
        bullets: section.bullets,
        widgets: section.widgets,
        contentItems: section.contentItems,
      })) ?? service.blocks,
    title: documentDraft?.title ?? report.title,
  };
}
