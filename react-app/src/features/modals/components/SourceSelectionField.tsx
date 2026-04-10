import { useDeferredValue, useState } from "react";
import { sourceOptions } from "../../../data/configOptions";

type SourceSelectionFieldProps = {
  selectedSourceIds: string[];
  onToggleSource: (sourceId: string) => void;
};

export function SourceSelectionField({
  selectedSourceIds,
  onToggleSource,
}: SourceSelectionFieldProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalized = deferredQuery.trim().toLowerCase();
  const filteredSources = !normalized
    ? sourceOptions
    : sourceOptions.filter((item) => `${item.name} ${item.meta}`.toLowerCase().includes(normalized));

  return (
    <div className="source-picker" id="reportSourceList">
      <div className="source-picker-head">
        <strong>选择档案资料</strong>
        <span id="selectedSourceCount">已选 {selectedSourceIds.length} 项</span>
      </div>
      <label className="source-search-field" htmlFor="sourceSearchInput">
        <input
          id="sourceSearchInput"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索档案名称、日期或类型"
        />
      </label>
      <div className="source-results" id="sourceResults">
        {filteredSources.length ? (
          filteredSources.map((item) => {
            const active = selectedSourceIds.includes(item.id);
            const dateLabel = item.meta.split("·")[0]?.trim() ?? "";

            return (
              <button
                className={`source-row${active ? " active" : ""}`}
                key={item.id}
                type="button"
                data-source-id={item.id}
                onClick={() => onToggleSource(item.id)}
              >
                <span className="source-check" aria-hidden="true">
                  {active ? "✓" : ""}
                </span>
                <span className="source-row-copy">
                  <strong>{item.name}</strong>
                  <span>{dateLabel}</span>
                </span>
              </button>
            );
          })
        ) : (
          <div className="source-row-copy">
            <strong>未找到匹配报告</strong>
            <span>请尝试调整搜索关键词。</span>
          </div>
        )}
      </div>
    </div>
  );
}
