import type { PatientMetric } from "../../../types/patient";

type PatientMetricsPanelProps = {
  metrics: PatientMetric[];
};

export function PatientMetricsPanel({ metrics }: PatientMetricsPanelProps) {
  return (
    <article className="migration-panel">
      <header className="section-head">
        <div>
          <p className="eyebrow">Identity Snapshot</p>
          <h3>档案概览</h3>
        </div>
        <span className="status-pill">React 已接管结构</span>
      </header>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
    </article>
  );
}
