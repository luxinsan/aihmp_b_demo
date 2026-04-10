import type { ReactNode } from "react";
import { patientProfile } from "../../../data/patientProfile";
import type { ContentWidget } from "../../../types/contentWidget";
import type {
  ReportDocumentDraft,
  SectionBulletItem,
  SectionContentItem,
  SectionParagraphItem,
} from "../../../types/documentDraft";

type GenerationEditorCanvasProps = {
  activeSectionId: string | null;
  draft: ReportDocumentDraft;
  onActivateInsertionPoint: (sectionId: string, itemId: string) => void;
  onExtractChartData: (sectionId: string, widgetId: string) => void;
  onOpenChartData: (sectionId: string, widgetId: string) => void;
  onDraftChange: (nextDraft: ReportDocumentDraft) => void;
  onUpdateParagraphItem: (sectionId: string, itemId: string, value: string) => void;
  onUpdateBulletItem: (sectionId: string, itemId: string, value: string) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onUpdateWidget: (
    sectionId: string,
    widgetId: string,
    patch: Partial<ContentWidget>,
  ) => void;
};

export function GenerationEditorCanvas({
  activeSectionId,
  draft,
  onActivateInsertionPoint,
  onExtractChartData,
  onOpenChartData,
  onDraftChange,
  onUpdateParagraphItem,
  onUpdateBulletItem,
  onUpdateSectionTitle,
  onUpdateWidget,
}: GenerationEditorCanvasProps) {
  return (
    <>
      <section className="pdf-page pdf-cover">
        <span className="cover-bird" aria-hidden="true"></span>
        <span className="cover-flower top" aria-hidden="true"></span>
        <span className="cover-flower bottom" aria-hidden="true"></span>
        <div className="cover-content">
          <p className="cover-mark editable-block" contentEditable suppressContentEditableWarning>
            守护
          </p>
          <p
            className="cover-tagline editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              onDraftChange({
                ...draft,
                coverLine: event.currentTarget.textContent?.trim() || draft.coverLine,
              })
            }
          >
            {draft.coverLine}
          </p>
          <p
            className="cover-sub editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              onDraftChange({
                ...draft,
                coverEn: event.currentTarget.textContent?.trim() || draft.coverEn,
              })
            }
          >
            {draft.coverEn}
          </p>
          <p
            className="cover-document-name editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              onDraftChange({
                ...draft,
                title: event.currentTarget.textContent?.trim() || draft.title,
              })
            }
          >
            {draft.title}
          </p>
          <div className="cover-meta">
            <p className="editable-block" contentEditable suppressContentEditableWarning>
              用户编码：{patientProfile.identity.code}
            </p>
            <p className="editable-block" contentEditable suppressContentEditableWarning>
              日期：{draft.date}
            </p>
          </div>
        </div>
        <div className="cover-brand">
          春晓健康
          <span>CHUNXIAO HEALTH</span>
        </div>
      </section>

      <section className="pdf-page pdf-toc">
        <div className="toc-header">
          <h2 className="editable-block" contentEditable suppressContentEditableWarning>
            目录
          </h2>
        </div>
        <ol className="toc-list">
          {draft.sections.map((section, index) => (
            <li key={section.id}>
              <span>{section.title || `章节 ${index + 1}`}</span>
              <span>{index + 2}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="pdf-page pdf-body">
        <header className="doc-body-header">
          <h1
            className="editable-block document-title-main"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              onDraftChange({
                ...draft,
                title: event.currentTarget.textContent?.trim() || draft.title,
              })
            }
          >
            {draft.title}
          </h1>
          <p
            className="editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              onDraftChange({
                ...draft,
                bodyIntro: event.currentTarget.textContent?.trim() || draft.bodyIntro,
              })
            }
          >
            {draft.bodyIntro}
          </p>
        </header>

        <section className="doc-hero">
          <p className="editable-block" contentEditable suppressContentEditableWarning>
            患者：{patientProfile.identity.name}
          </p>
          <p
            className="editable-block"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              onDraftChange({
                ...draft,
                inputScope:
                  event.currentTarget.textContent?.replace(/^输入数据：/, "").trim() || draft.inputScope,
              })
            }
          >
            输入数据：{draft.inputScope}
          </p>
          <div className="doc-meta">
            <span>{draft.category}</span>
            <span>{draft.date}</span>
            <span>AI 生成初稿</span>
          </div>
        </section>

        <div className="doc-sections">
          {draft.sections.map((section, sectionIndex) => (
            <article
              className={`doc-section editor-section-card${activeSectionId === section.id ? " is-active" : ""}`}
              data-section-id={section.id}
              id={`editor-section-${section.id}`}
              key={section.id}
            >
              <h3
                className="doc-section-title editable-block"
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) =>
                  onUpdateSectionTitle(section.id, event.currentTarget.textContent?.trim() || section.title)
                }
              >
                {section.title || `章节 ${sectionIndex + 1}`}
              </h3>

              <div className="doc-section-body">
                <SectionContentFlow
                  items={section.contentItems}
                  sectionId={section.id}
                  onActivateInsertionPoint={onActivateInsertionPoint}
                  onExtractChartData={onExtractChartData}
                  onOpenChartData={onOpenChartData}
                  onUpdateBulletItem={onUpdateBulletItem}
                  onUpdateParagraphItem={onUpdateParagraphItem}
                  onUpdateWidget={onUpdateWidget}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionContentFlow({
  items,
  onActivateInsertionPoint,
  onExtractChartData,
  onOpenChartData,
  onUpdateBulletItem,
  onUpdateParagraphItem,
  onUpdateWidget,
  sectionId,
}: {
  items: SectionContentItem[];
  onActivateInsertionPoint: (sectionId: string, itemId: string) => void;
  onExtractChartData: (sectionId: string, widgetId: string) => void;
  onOpenChartData: (sectionId: string, widgetId: string) => void;
  onUpdateBulletItem: (sectionId: string, itemId: string, value: string) => void;
  onUpdateParagraphItem: (sectionId: string, itemId: string, value: string) => void;
  onUpdateWidget: (
    sectionId: string,
    widgetId: string,
    patch: Partial<ContentWidget>,
  ) => void;
  sectionId: string;
}) {
  const nodes: ReactNode[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item) {
      continue;
    }

    if (item.type === "bullet") {
      const bulletItems: SectionBulletItem[] = [item];
      while (items[index + 1]?.type === "bullet") {
        bulletItems.push(items[index + 1] as SectionBulletItem);
        index += 1;
      }

      nodes.push(
        <ul className="doc-list" key={`${sectionId}-bullets-${item.id}`}>
          {bulletItems.map((bulletItem) => (
            <li
              className="editable-block"
              contentEditable
              data-item-id={bulletItem.id}
              key={bulletItem.id}
              suppressContentEditableWarning
              onBlur={(event) =>
                onUpdateBulletItem(sectionId, bulletItem.id, event.currentTarget.textContent?.trim() || "")
              }
            >
              {bulletItem.text}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (item.type === "widget") {
      nodes.push(
        <GenerationEditorWidget
          key={item.id}
          onExtractChartData={onExtractChartData}
          onOpenChartData={onOpenChartData}
          sectionId={sectionId}
          widget={item.widget}
          onUpdateWidget={onUpdateWidget}
        />,
      );
      continue;
    }

    nodes.push(
      <ParagraphContentItem
        item={item}
        key={item.id}
        onActivateInsertionPoint={onActivateInsertionPoint}
        onUpdateParagraphItem={onUpdateParagraphItem}
        sectionId={sectionId}
      />,
    );
  }

  return <>{nodes}</>;
}

function ParagraphContentItem({
  item,
  onActivateInsertionPoint,
  onUpdateParagraphItem,
  sectionId,
}: {
  item: SectionParagraphItem;
  onActivateInsertionPoint: (sectionId: string, itemId: string) => void;
  onUpdateParagraphItem: (sectionId: string, itemId: string, value: string) => void;
  sectionId: string;
}) {
  const Tag = item.tagName ?? "p";
  const isEmpty = !item.text.trim();

  return (
    <Tag
      className={`editable-block${isEmpty ? " generation-empty-block" : ""}`}
      contentEditable
      data-item-id={item.id}
      suppressContentEditableWarning
      onClick={() => isEmpty && onActivateInsertionPoint(sectionId, item.id)}
      onFocus={() => isEmpty && onActivateInsertionPoint(sectionId, item.id)}
      onBlur={(event) =>
        onUpdateParagraphItem(sectionId, item.id, event.currentTarget.textContent?.trim() || "")
      }
    >
      {isEmpty ? <br /> : item.text}
    </Tag>
  );
}

function GenerationEditorWidget({
  onExtractChartData,
  onOpenChartData,
  sectionId,
  widget,
  onUpdateWidget,
}: {
  onExtractChartData: (sectionId: string, widgetId: string) => void;
  onOpenChartData: (sectionId: string, widgetId: string) => void;
  sectionId: string;
  widget: ContentWidget;
  onUpdateWidget: (
    sectionId: string,
    widgetId: string,
    patch: Partial<ContentWidget>,
  ) => void;
}) {
  if (widget.type === "image") {
    return (
      <figure className="editor-media-block content-block">
        <div className="editor-media-frame">
          {widget.assetSrc ? (
            <img src={widget.assetSrc} alt={widget.assetLabel || widget.title} />
          ) : (
            <div className="editor-media-placeholder">{widget.assetLabel || "等待上传图片素材"}</div>
          )}
        </div>
        <figcaption
          className="editable-block editor-figure-caption"
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) =>
            onUpdateWidget(sectionId, widget.id, {
              caption: event.currentTarget.textContent?.trim() || widget.caption,
            })
          }
        >
          {widget.caption || "图片说明"}
        </figcaption>
      </figure>
    );
  }

  if (widget.type === "table") {
    const columns = widget.columns ?? [];
    const rows = widget.rows ?? [];

    return (
      <div className="editor-table-block content-block" data-widget-id={widget.id}>
        <table className="editor-table">
          <tbody>
            {columns.length ? (
              <tr>
                {columns.map((column, columnIndex) => (
                  <th
                    className="editable-block editor-table-cell"
                    contentEditable
                    data-column-index={columnIndex}
                    data-row-index={0}
                    data-widget-id={widget.id}
                    key={`${widget.id}-column-${columnIndex}`}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      onUpdateWidget(sectionId, widget.id, {
                        columns: columns.map((item, index) =>
                          index === columnIndex ? event.currentTarget.textContent?.trim() || "" : item,
                        ),
                      })
                    }
                  >
                    {column}
                  </th>
                ))}
              </tr>
            ) : null}
            {rows.map((row, rowIndex) => (
              <tr key={`${widget.id}-row-${rowIndex}`}>
                {row.map((cell, columnIndex) => (
                  <td
                    className="editable-block editor-table-cell"
                    contentEditable
                    data-column-index={columnIndex}
                    data-row-index={rowIndex + 1}
                    data-widget-id={widget.id}
                    key={`${widget.id}-cell-${rowIndex}-${columnIndex}`}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      onUpdateWidget(sectionId, widget.id, {
                        rows: rows.map((rowItem, currentRowIndex) =>
                          currentRowIndex === rowIndex
                            ? rowItem.map((cellItem, currentColumnIndex) =>
                                currentColumnIndex === columnIndex
                                  ? event.currentTarget.textContent?.trim() || ""
                                  : cellItem,
                              )
                            : rowItem,
                        ),
                      })
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const metrics = widget.metrics ?? [];
  const completedMetrics = metrics.filter((item) => Number.isFinite(item.value));
  const score = completedMetrics.length
    ? Math.round(
        completedMetrics.reduce((sum, item) => sum + (item.value ?? 0), 0) / completedMetrics.length,
      )
    : null;
  const pending = completedMetrics.length === 0;

  return (
    <figure className="editor-chart-block content-block" data-chart-type="lifestyle">
      <div className="editor-chart-visual" data-chart-ready={String(!pending)}>
        {pending ? (
          <div className="editor-chart-empty">
            <div className="editor-chart-empty-copy">
              <strong>生活方式评估图</strong>
              <p>点击下方按钮，调用 AI 提取患者相关档案数据后生成图表。</p>
            </div>
            <button
              className="primary-button chart-extract-button"
              type="button"
              onClick={() => onExtractChartData(sectionId, widget.id)}
            >
              AI提取患者数据
            </button>
          </div>
        ) : (
          <>
            <button
              className="chart-edit-button"
              type="button"
              aria-label="编辑图表数据"
              onClick={() => onOpenChartData(sectionId, widget.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20h4l9.6-9.6a1.8 1.8 0 0 0 0-2.6l-1.4-1.4a1.8 1.8 0 0 0-2.6 0L4 16v4Z"></path>
                <path d="m12.8 7.2 4 4"></path>
              </svg>
            </button>
            <div className="editor-lifestyle-chart">
              <section className="editor-lifestyle-panel editor-lifestyle-summary">
                <h4 className="editor-chart-panel-title">测试报告总分表</h4>
                <div className="editor-chart-panel-subtitle">{resolveLifestyleLevel(score)}</div>
                <div className="editor-gauge-shell">
                  <svg viewBox="0 0 320 220" role="img" aria-label="生活方式评估总分">
                    <defs>
                      <linearGradient id={`editorLifestyleGauge-${widget.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6a55"></stop>
                        <stop offset="46%" stopColor="#ffb400"></stop>
                        <stop offset="100%" stopColor="#2ed37b"></stop>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 52 178 A 108 108 0 0 1 268 178"
                      fill="none"
                      stroke="#e8edf5"
                      strokeWidth="18"
                      strokeLinecap="round"
                      pathLength="100"
                    ></path>
                    {score !== null ? (
                      <path
                        d="M 52 178 A 108 108 0 0 1 268 178"
                        fill="none"
                        stroke={`url(#editorLifestyleGauge-${widget.id})`}
                        strokeWidth="18"
                        strokeLinecap="round"
                        pathLength="100"
                        strokeDasharray={`${Math.max(0, Math.min(score, 100))} 100`}
                      ></path>
                    ) : null}
                  </svg>
                  <div className="editor-gauge-score">{score ?? "—"}</div>
                </div>
                <div className="editor-gauge-scale" aria-hidden="true">
                  <span>低</span>
                  <span>0</span>
                  <span>100</span>
                  <span>高</span>
                </div>
                <div className="editor-gauge-done">{score === null ? "等待生成图表" : "评分已完成"}</div>
                <p className="editor-gauge-note">
                  {score === null
                    ? (
                        <>
                          请先点击 <strong>AI提取患者数据</strong>，系统会自动填入可识别的指标分值。
                        </>
                      )
                    : (
                        <>
                          您的生活方式健康水平综合评分结果为 <strong>{score}分</strong>
                        </>
                      )}
                </p>
                {metrics.length - completedMetrics.length > 0 ? (
                  <p className="editor-chart-missing-note">
                    当前仍有 {metrics.length - completedMetrics.length} 项指标缺少数据，可在图表编辑中手动补充。
                  </p>
                ) : null}
              </section>

              <section className="editor-lifestyle-panel editor-lifestyle-breakdown">
                <h4 className="editor-chart-panel-title">测试报告各项分数表</h4>
                <div className="editor-lifestyle-bar-chart">
                  <div className="editor-bar-axis">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>
                  <div className="editor-bar-columns">
                  {metrics.map((metric, index) => (
                    <div
                      className={`editor-bar-column${Number.isFinite(metric.value) ? "" : " is-missing"}`}
                      key={`${widget.id}-metric-${index}`}
                    >
                      <span className="editor-bar-value">{metric.value ?? "缺少数据"}</span>
                      <div className="editor-bar-track">
                        <span
                          className="editor-bar-fill"
                          style={{ height: `${Number.isFinite(metric.value) ? metric.value : 0}%` }}
                        />
                      </div>
                      <span className="editor-bar-label">
                        {resolveMetricLabelLines(metric.label).map((line) => (
                          <span key={`${metric.label}-${line}`}>{line}</span>
                        ))}
                      </span>
                    </div>
                  ))}
                  </div>
                </div>
                <p className="editor-chart-note">注：该评分来源于地中海饮食和美国居民心血管健康评价方法，仅供参考！</p>
              </section>
            </div>
          </>
        )}
      </div>
      <figcaption
        className="editable-block editor-chart-caption"
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) =>
          onUpdateWidget(sectionId, widget.id, {
            title: event.currentTarget.textContent?.trim() || widget.title,
          })
        }
      >
        {widget.title}
      </figcaption>
    </figure>
  );
}

function resolveLifestyleLevel(score: number | null) {
  if (score === null) {
    return "待提取";
  }

  if (score >= 80) {
    return "良好";
  }

  if (score >= 60) {
    return "中等";
  }

  return "偏低";
}

function resolveMetricLabelLines(label: string) {
  if (label === "身体活动") {
    return ["身体", "活动"];
  }

  if (label === "烟草暴露") {
    return ["烟草", "暴露"];
  }

  if (label === "睡眠健康") {
    return ["睡眠", "健康"];
  }

  if (label === "依从性") {
    return ["依从", "性"];
  }

  if (label.length >= 4) {
    return [label.slice(0, 2), label.slice(2)];
  }

  return [label];
}
