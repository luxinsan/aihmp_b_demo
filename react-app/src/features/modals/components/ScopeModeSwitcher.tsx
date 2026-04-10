import type { ScopeMode } from "../../../types/generation";

type ScopeModeSwitcherProps = {
  scope: ScopeMode;
  onChange: (scope: ScopeMode) => void;
};

export function ScopeModeSwitcher({ scope, onChange }: ScopeModeSwitcherProps) {
  return (
    <div className="scope-switcher" id="scopeSwitcher">
      <button className={`scope-chip${scope === "all" ? " active" : ""}`} type="button" data-scope="all" onClick={() => onChange("all")}>
        全部档案数据
      </button>
      <button
        className={`scope-chip${scope === "specific" ? " active" : ""}`}
        type="button"
        data-scope="specific"
        onClick={() => onChange("specific")}
      >
        指定档案资料
      </button>
      <button className={`scope-chip${scope === "prompt" ? " active" : ""}`} type="button" data-scope="prompt" onClick={() => onChange("prompt")}>
        自然语言描述
      </button>
    </div>
  );
}
