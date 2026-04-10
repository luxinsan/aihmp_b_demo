import type { ResolvedPreviewDocument } from "../utils/resolvePreviewDocument";

type PreviewCoverPageProps = {
  document: ResolvedPreviewDocument;
};

export function PreviewCoverPage({ document }: PreviewCoverPageProps) {
  return (
    <section className="pdf-page pdf-cover">
      <span className="cover-bird" aria-hidden="true"></span>
      <span className="cover-flower top" aria-hidden="true"></span>
      <span className="cover-flower bottom" aria-hidden="true"></span>
      <div className="cover-content">
        <p className="cover-mark">守护</p>
        <p className="cover-tagline">{document.coverLine}</p>
        <p className="cover-sub">{document.coverEn}</p>
        <p className="cover-document-name">{document.title}</p>
        <div className="cover-meta">
          <p>用户编码：{document.patientCode}</p>
          <p>日期：{document.date}</p>
        </div>
      </div>
      <div className="cover-brand">
        春晓健康
        <span>CHUNXIAO HEALTH</span>
      </div>
    </section>
  );
}
