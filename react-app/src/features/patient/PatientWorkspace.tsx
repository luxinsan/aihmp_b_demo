import { PageSectionHeader } from "../../components/layout/PageSectionHeader";
import { PatientArchiveStage } from "./components/PatientArchiveStage";
import { PatientSidebarPanel } from "./components/PatientSidebarPanel";

export function PatientWorkspace() {
  return (
    <section className="patient-workspace" aria-label="患者档案 React 迁移模块">
      <PageSectionHeader
        className="patient-workspace-head"
        description="这部分开始按现有静态页面的数据结构复刻，后续可以逐步接入交互和编辑状态。"
        title="PatientWorkspace"
      />

      <div className="patient-workspace-grid">
        <PatientSidebarPanel activeTab="病历资料" onTabSelect={() => {}} />
        <PatientArchiveStage />
      </div>
    </section>
  );
}
