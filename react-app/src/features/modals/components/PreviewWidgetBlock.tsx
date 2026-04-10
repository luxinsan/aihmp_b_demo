import type { ContentWidget } from "../../../types/contentWidget";

type PreviewWidgetBlockProps = {
  widget: ContentWidget;
};

export function PreviewWidgetBlock({ widget }: PreviewWidgetBlockProps) {
  const tableColumns = widget.type === "table" ? widget.columns ?? [] : [];
  const tableRows = widget.type === "table" ? widget.rows ?? [] : [];

  if (widget.type === "image") {
    return (
      <figure className="editor-media-block content-block">
        <div className="editor-media-frame">
          {widget.assetSrc ? (
            <img src={widget.assetSrc} alt={widget.assetLabel ?? widget.title} />
          ) : (
            <div className="editor-media-placeholder">{widget.assetLabel ?? "等待上传图片素材"}</div>
          )}
        </div>
        <figcaption className="editor-figure-caption">{widget.caption || "图片说明"}</figcaption>
      </figure>
    );
  }

  if (widget.type === "table" && tableRows.length) {
    return (
      <div className="editor-table-block content-block" data-widget-id={widget.id}>
        <table className="editor-table">
          <tbody>
            {tableColumns.length ? (
              <tr>
                {tableColumns.map((column, columnIndex) => (
                  <th className="editor-table-cell" key={`${widget.id}-column-${columnIndex}`}>
                    {column}
                  </th>
                ))}
              </tr>
            ) : null}
            {tableRows.map((row, rowIndex) => (
              <tr key={`${widget.id}-row-${rowIndex}`}>
                {row.map((cell, columnIndex) => (
                  <td className="editor-table-cell" key={`${widget.id}-${columnIndex}-${rowIndex}`}>
                    {cell || <br />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (widget.type === "radar-chart" && widget.metrics?.length) {
    const averageScore = resolveAverageScoreValue(widget.metrics);

    return (
      <figure className="editor-chart-block content-block" data-chart-type="lifestyle">
        <div className="editor-chart-visual" data-chart-ready={String(averageScore !== null)}>
          {averageScore === null ? (
            <div className="editor-chart-empty">
              <div className="editor-chart-empty-copy">
                <strong>生活方式评估图</strong>
                <p>点击下方按钮，调用 AI 提取患者相关档案数据后生成图表。</p>
              </div>
              <button className="primary-button chart-extract-button" type="button">
                AI提取患者数据
              </button>
            </div>
          ) : (
            <div className="editor-lifestyle-chart">
              <section className="editor-lifestyle-panel editor-lifestyle-summary">
                <h4 className="editor-chart-panel-title">测试报告总分表</h4>
                <div className="editor-chart-panel-subtitle">{resolveLifestyleLevel(averageScore)}</div>
                <div className="editor-gauge-shell">
                  <div className="editor-gauge-score">{resolveAverageScore(widget.metrics)}</div>
                </div>
                <div className="editor-gauge-scale" aria-hidden="true">
                  <span>低</span>
                  <span>0</span>
                  <span>100</span>
                  <span>高</span>
                </div>
                <div className="editor-gauge-done">评分已完成</div>
                <p className="editor-gauge-note">
                  您的生活方式健康水平综合评分结果为 <strong>{resolveAverageScore(widget.metrics)}分</strong>
                </p>
                {widget.metrics.filter((metric) => metric.value === null).length ? (
                  <p className="editor-chart-missing-note">
                    当前仍有 {widget.metrics.filter((metric) => metric.value === null).length} 项指标缺少数据，可在图表编辑中手动补充。
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
                    {widget.metrics.map((metric) => (
                      <div
                        className={`editor-bar-column${metric.value === null ? " is-missing" : ""}`}
                        key={metric.label}
                      >
                        <span className="editor-bar-value">{metric.value ?? "缺少数据"}</span>
                        <div className="editor-bar-track">
                          <span
                            className="editor-bar-fill"
                            style={{ height: `${Math.max(0, Math.min(metric.value ?? 0, 100))}%` }}
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
          )}
        </div>
        <figcaption className="editor-chart-caption">{widget.title}</figcaption>
      </figure>
    );
  }

  return null;
}

function resolveAverageScore(metrics: NonNullable<ContentWidget["metrics"]>) {
  const average = resolveAverageScoreValue(metrics);
  return average === null ? "--" : Math.round(average).toString();
}

function resolveAverageScoreValue(metrics: NonNullable<ContentWidget["metrics"]>) {
  const validMetrics = metrics.filter((metric) => metric.value !== null);
  if (!validMetrics.length) {
    return null;
  }

  return validMetrics.reduce((sum, metric) => sum + (metric.value ?? 0), 0) / validMetrics.length;
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
  if (label === "依从性") {
    return ["依从", "性"];
  }

  if (label.length >= 4) {
    return [label.slice(0, 2), label.slice(2)];
  }

  return [label];
}
