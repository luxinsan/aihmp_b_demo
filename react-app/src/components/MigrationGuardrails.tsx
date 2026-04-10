const guardrails = [
  "当前线上入口仍然是仓库根目录下的 index.html。",
  "当前重构代码放在 react-app/，不会影响现有 GitHub Pages 发布。",
  "迁移时先拆页面结构和组件边界，再逐步挪交互逻辑。",
  "只有确认 React 版本稳定复刻后，才考虑切换正式发布入口。",
];

export function MigrationGuardrails() {
  return (
    <section className="guardrails" aria-label="迁移保护原则">
      <div>
        <p className="eyebrow">Guardrails</p>
        <h2>零影响当前页面</h2>
      </div>
      <ul className="guardrail-list">
        {guardrails.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
