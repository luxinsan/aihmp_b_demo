import type { ReactNode } from "react";
import type { ResolvedPreviewDocument } from "../utils/resolvePreviewDocument";
import { getSectionContentCount } from "../utils/previewStructure";
import { PreviewWidgetBlock } from "./PreviewWidgetBlock";

type PreviewBodyPageProps = {
  bodyIntro: string;
  document: ResolvedPreviewDocument;
};

export function PreviewBodyPage({ bodyIntro, document }: PreviewBodyPageProps) {
  return (
    <section className="pdf-page pdf-body">
      <header className="doc-body-header">
        <h1 className="document-title-main">{document.title}</h1>
        <p>{bodyIntro}</p>
      </header>

      <section className="doc-hero">
        <p>患者：{document.patientName}</p>
        <p>输入数据：{document.inputScope}</p>
        <div className="doc-meta">
          <span>{document.category}</span>
          <span>{document.date}</span>
        </div>
      </section>

      <div className="doc-sections">
        {document.sections.map((block, index) => {
          const contentCount = getSectionContentCount(block);

          return (
            <section className="doc-section" key={block.title}>
              <h3 className="doc-section-title">{block.title}</h3>
              <div className="doc-section-body">
                {contentCount === 0 ? (
                  <p>本节内容待补充。</p>
                ) : null}
                {block.contentItems?.length ? (
                  <PreviewContentFlow items={block.contentItems} />
                ) : (
                  <>
                    {(block.paragraphs ?? []).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {block.bullets?.length ? (
                      <ul className="doc-list">
                        {block.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                    {block.widgets?.length ? (
                      <div className="content-block">
                        {block.widgets.map((widget) => (
                          <PreviewWidgetBlock key={widget.id} widget={widget} />
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function PreviewContentFlow({ items }: { items: ResolvedPreviewDocument["sections"][number]["contentItems"] }) {
  const nodes: ReactNode[] = [];
  const safeItems = items ?? [];

  for (let index = 0; index < safeItems.length; index += 1) {
    const item = safeItems[index];
    if (!item) {
      continue;
    }

    if (item.type === "bullet") {
      const bulletItems = [item];
      while (safeItems[index + 1]?.type === "bullet") {
        bulletItems.push(safeItems[index + 1] as typeof item);
        index += 1;
      }

      nodes.push(
        <ul className="doc-list" key={`preview-bullets-${item.id}`}>
          {bulletItems.map((bulletItem) => (
            <li key={bulletItem.id}>{bulletItem.text}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (item.type === "widget") {
      nodes.push(<PreviewWidgetBlock key={item.id} widget={item.widget} />);
      continue;
    }

    if (!item.text.trim()) {
      continue;
    }

    const Tag = item.tagName ?? "p";
    nodes.push(<Tag key={item.id}>{item.text}</Tag>);
  }

  return <>{nodes}</>;
}
