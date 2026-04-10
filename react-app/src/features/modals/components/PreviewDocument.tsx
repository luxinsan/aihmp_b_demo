import { services } from "../../../data/services";
import type { ReportDocumentDraft } from "../../../types/documentDraft";
import type { ReportRecord } from "../../../types/report";
import { PreviewBodyPage } from "./PreviewBodyPage";
import { PreviewCoverPage } from "./PreviewCoverPage";
import { PreviewTocPage } from "./PreviewTocPage";
import { resolvePreviewDocument } from "../utils/resolvePreviewDocument";

type PreviewDocumentProps = {
  report: ReportRecord | null;
  documentDraft?: ReportDocumentDraft;
};

export function PreviewDocument({ report, documentDraft }: PreviewDocumentProps) {
  if (!report) {
    return null;
  }

  const service = services[report.serviceId];
  const bodyIntro = documentDraft?.bodyIntro ?? service.bodyIntro;
  const resolvedDocument = resolvePreviewDocument(report, documentDraft);

  return (
    <>
      <PreviewCoverPage document={resolvedDocument} />
      <PreviewTocPage document={resolvedDocument} />
      <PreviewBodyPage bodyIntro={bodyIntro} document={resolvedDocument} />
    </>
  );
}
