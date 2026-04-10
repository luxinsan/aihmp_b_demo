import { PatientArchiveStage } from "./components/PatientArchiveStage";
import { PatientSidebarPanel } from "./components/PatientSidebarPanel";

export function PatientWorkspace() {
  return (
    <section className="patient-workspace" aria-label="患者档案 React 迁移模块">
      <header className="preview-header patient-workspace-head">
        <div>
          <p className="eyebrow">Phase 1 Real Migration</p>
          <h2>PatientWorkspace</h2>
        </div>
        <p className="patient-workspace-copy">
          这部分开始按现有静态页面的数据结构复刻，后续可以逐步接入交互和编辑状态。
        </p>
      </header>

      <div className="patient-workspace-grid">
        <PatientSidebarPanel activeTab="病历资料" onTabSelect={() => {}} />
        <PatientArchiveStage />
      </div>
    </section>
  );
}
