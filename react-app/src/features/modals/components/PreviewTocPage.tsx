import type { ResolvedPreviewDocument } from "../utils/resolvePreviewDocument";
import { getSectionContentCount } from "../utils/previewStructure";

type PreviewTocPageProps = {
  document: ResolvedPreviewDocument;
};

export function PreviewTocPage({ document }: PreviewTocPageProps) {
  return (
    <section className="pdf-page pdf-toc">
      <div className="toc-header">
        <h2>目录</h2>
      </div>
      <ol className="toc-list">
        {document.sections.map((block, index) => (
          <li key={block.title}>
            <span>{block.title}</span>
            <span>{index + 2}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
