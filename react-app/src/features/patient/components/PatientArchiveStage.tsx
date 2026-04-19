import { PageSectionHeader } from "../../../components/layout/PageSectionHeader";
import { archiveSections, vitalMetrics } from "../../../../../shared/adapters/admin";
import { PatientArchiveSection } from "./PatientArchiveSection";
import { PatientMetricsPanel } from "./PatientMetricsPanel";

export function PatientArchiveStage() {
  return (
    <section className="patient-archive-stage" aria-label="患者档案详情 React 迁移模块">
      <PageSectionHeader
        className="patient-workspace-head"
        description="这里保留患者档案详情与指标概览，作为后续与正式页面做细节对齐的独立区块。"
        title="PatientArchive"
      />

      <div className="patient-main">
        <PatientMetricsPanel metrics={vitalMetrics} />
        {archiveSections.map((section) => (
          <PatientArchiveSection key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}
