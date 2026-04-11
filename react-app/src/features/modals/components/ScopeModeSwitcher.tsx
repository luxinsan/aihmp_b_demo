import type { ScopeMode } from "../../../types/generation";

type ScopeModeSwitcherProps = {
  scope: ScopeMode;
  onChange: (scope: ScopeMode) => void;
};

export function ScopeModeSwitcher({ scope, onChange }: ScopeModeSwitcherProps) {
  return (
    <div className="scope-switcher" id="scopeSwitcher">
      <button className={`scope-chip${scope === "all" ? " active" : ""}`} type="button" data-scope="all" onClick={() => onChange("all")}>
        全部健康资料
      </button>
      <button
        className={`scope-chip${scope === "specific" ? " active" : ""}`}
        type="button"
        data-scope="specific"
        onClick={() => onChange("specific")}
      >
        指定病历资料
      </button>
    </div>
  );
}
