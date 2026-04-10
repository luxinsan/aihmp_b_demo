import { archiveSections, vitalMetrics } from "../../../data/patientProfile";
import { PatientArchiveSection } from "./PatientArchiveSection";
import { PatientMetricsPanel } from "./PatientMetricsPanel";

export function PatientArchiveStage() {
  return (
    <section className="patient-archive-stage" aria-label="患者档案详情 React 迁移模块">
      <header className="preview-header patient-workspace-head">
        <div>
          <p className="eyebrow">Phase 1 Real Migration</p>
          <h2>PatientArchive</h2>
        </div>
        <p className="patient-workspace-copy">
          这里保留患者档案详情与指标概览，作为后续与正式页面做细节对齐的独立区块。
        </p>
      </header>

      <div className="patient-main">
        <PatientMetricsPanel metrics={vitalMetrics} />
        {archiveSections.map((section) => (
          <PatientArchiveSection key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}
