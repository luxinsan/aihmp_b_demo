import type { ContentWidget, ContentWidgetMetric } from "../../../types/contentWidget";

type EditorWidgetCardProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  widget: ContentWidget;
  onRemove: () => void;
  onUpdate: (patch: Partial<ContentWidget>) => void;
};

export function EditorWidgetCard({
  canMoveDown,
  canMoveUp,
  index,
  onMoveDown,
  onMoveUp,
  widget,
  onRemove,
  onUpdate,
}: EditorWidgetCardProps) {
  void canMoveDown;
  void canMoveUp;
  void onMoveDown;
  void onMoveUp;

  return (
    <article className="editor-widget-card">
      <header className="editor-widget-head">
        <div className="editor-widget-title-group">
          <span className="editor-widget-index" hidden>
            模块 {index + 1}
          </span>
          <strong>{widget.title}</strong>
        </div>
        <div className="editor-widget-head-actions" hidden>
          <button
            className="editor-widget-shift"
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="上移模块"
          >
            上移
          </button>
          <button
            className="editor-widget-shift"
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="下移模块"
          >
            下移
          </button>
          <span className={`editor-widget-kind kind-${widget.type}`}>{resolveWidgetKind(widget.type)}</span>
          <button className="editor-widget-remove" type="button" onClick={onRemove}>
            删除
          </button>
        </div>
      </header>

      <label className="editor-field">
        <span hidden>块标题</span>
        <input
          className="react-input"
          placeholder="输入模块标题"
          value={widget.title}
          onChange={(event) => onUpdate({ title: event.target.value })}
        />
      </label>

      <label className="editor-field editor-field-full">
        <span hidden>块说明</span>
        <textarea
          className="react-input react-textarea"
          rows={3}
          placeholder="输入模块说明"
          value={widget.caption}
          onChange={(event) => onUpdate({ caption: event.target.value })}
        />
      </label>

      {widget.type === "image" ? (
        <label className="editor-field editor-field-full">
          <span hidden>图片占位说明</span>
          <input
            className="react-input"
            placeholder="输入图片说明"
            value={widget.assetLabel ?? ""}
            onChange={(event) => onUpdate({ assetLabel: event.target.value })}
          />
        </label>
      ) : null}

      {widget.type === "table" ? (
        <EditorTableWidget widget={widget} onUpdate={onUpdate} />
      ) : null}

      {widget.type === "radar-chart" ? (
        <EditorRadarWidget widget={widget} onUpdate={onUpdate} />
      ) : null}
    </article>
  );
}

function EditorTableWidget({
  widget,
  onUpdate,
}: {
  widget: ContentWidget;
  onUpdate: (patch: Partial<ContentWidget>) => void;
}) {
  const columns = widget.columns ?? [];
  const rows = widget.rows ?? [];

  function handleColumnChange(index: number, value: string) {
    onUpdate({
      columns: columns.map((column, columnIndex) => (columnIndex === index ? value : column)),
    });
  }

  function handleCellChange(rowIndex: number, columnIndex: number, value: string) {
    onUpdate({
      rows: rows.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((cell, currentColumnIndex) => (currentColumnIndex === columnIndex ? value : cell))
          : row,
      ),
    });
  }

  function handleAddColumn() {
    const nextColumns = [...columns, `新增列 ${columns.length + 1}`];
    onUpdate({
      columns: nextColumns,
      rows: rows.map((row) => [...row, ""]),
    });
  }

  function handleRemoveColumn() {
    if (columns.length <= 1) {
      return;
    }

    onUpdate({
      columns: columns.slice(0, -1),
      rows: rows.map((row) => row.slice(0, -1)),
    });
  }

  function handleAddRow() {
    onUpdate({
      rows: [...rows, columns.map(() => "")],
    });
  }

  function handleRemoveRow() {
    if (rows.length <= 1) {
      return;
    }

    onUpdate({
      rows: rows.slice(0, -1),
    });
  }

  return (
    <div className="editor-widget-grid">
      <div className="editor-widget-inline-actions" hidden>
        <button className="editor-chip-button" type="button" onClick={handleAddColumn}>
          + 列
        </button>
        <button className="editor-chip-button" type="button" onClick={handleRemoveColumn}>
          - 列
        </button>
        <button className="editor-chip-button" type="button" onClick={handleAddRow}>
          + 行
        </button>
        <button className="editor-chip-button" type="button" onClick={handleRemoveRow}>
          - 行
        </button>
      </div>

      <div className="editor-table-grid" role="group" aria-label="表格块编辑">
        <div className="editor-table-row is-head">
          {columns.map((column, index) => (
            <input
              key={`${widget.id}-head-${index}`}
              className="react-input editor-table-cell editor-table-head"
              value={column}
              onChange={(event) => handleColumnChange(index, event.target.value)}
            />
          ))}
        </div>

        {rows.map((row, rowIndex) => (
          <div className="editor-table-row" key={`${widget.id}-row-${rowIndex}`}>
            {columns.map((_, columnIndex) => (
              <input
                key={`${widget.id}-cell-${rowIndex}-${columnIndex}`}
                className="react-input editor-table-cell"
                value={row[columnIndex] ?? ""}
                onChange={(event) => handleCellChange(rowIndex, columnIndex, event.target.value)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorRadarWidget({
  widget,
  onUpdate,
}: {
  widget: ContentWidget;
  onUpdate: (patch: Partial<ContentWidget>) => void;
}) {
  const metrics = widget.metrics ?? [];

  function updateMetric(index: number, patch: Partial<ContentWidgetMetric>) {
    onUpdate({
      metrics: metrics.map((metric, metricIndex) =>
        metricIndex === index
          ? {
              ...metric,
              ...patch,
            }
          : metric,
      ),
    });
  }

  function addMetric() {
    onUpdate({
      metrics: [...metrics, { label: `新增指标 ${metrics.length + 1}`, value: null }],
    });
  }

  function removeMetric(index: number) {
    onUpdate({
      metrics: metrics.filter((_, metricIndex) => metricIndex !== index),
    });
  }

  return (
    <div className="editor-widget-grid">
      <div className="editor-widget-inline-actions" hidden>
        <button className="editor-chip-button" type="button" onClick={addMetric}>
          + 指标
        </button>
      </div>

      <div className="editor-metric-stack">
        {metrics.map((metric, index) => (
          <div className="editor-metric-row" key={`${widget.id}-metric-${index}`}>
            <input
              className="react-input"
              value={metric.label}
              onChange={(event) => updateMetric(index, { label: event.target.value })}
            />
            <input
              className="react-input"
              inputMode="numeric"
              value={metric.value ?? ""}
              onChange={(event) => {
                const rawValue = event.target.value.trim();
                const parsedValue = rawValue ? Number(rawValue) : null;
                const nextValue =
                  parsedValue === null || Number.isNaN(parsedValue)
                    ? null
                    : Math.max(0, Math.min(parsedValue, 100));

                updateMetric(index, { value: nextValue });
              }}
            />
            <button className="editor-widget-remove" type="button" onClick={() => removeMetric(index)}>
              删除
            </button>
          </div>
        ))}
      </div>

      <p className="editor-widget-helper">图表数值支持直接输入，留空时会在预览中显示为空。</p>
    </div>
  );
}

function resolveWidgetKind(type: ContentWidget["type"]) {
  if (type === "image") {
    return "图片";
  }

  if (type === "table") {
    return "表格";
  }

  return "图表";
}
