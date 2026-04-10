import type { MigrationModule } from "../data/migrationModules";

type MigrationModuleGridProps = {
  modules: MigrationModule[];
};

export function MigrationModuleGrid({ modules }: MigrationModuleGridProps) {
  return (
    <section className="module-grid" aria-label="第一阶段拆分模块">
      {modules.map((module) => (
        <article className="module-card" key={module.name}>
          <p className="module-phase">{module.phase}</p>
          <h2>{module.name}</h2>
          <p>{module.summary}</p>
          <ul>
            {module.targets.map((target) => (
              <li key={target}>{target}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
