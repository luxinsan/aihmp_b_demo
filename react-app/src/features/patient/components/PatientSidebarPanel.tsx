import { patientContactItems, patientProfile, patientTabs } from "../../../../../shared/adapters/admin";
import { PatientProfileCard } from "./PatientProfileCard";
import { PatientTabsCard } from "./PatientTabsCard";

type PatientSidebarPanelProps = {
  activeTab: string;
  onTabSelect: (tab: string) => void;
};

export function PatientSidebarPanel({ activeTab, onTabSelect }: PatientSidebarPanelProps) {
  return (
    <aside className="patient-panel">
      <PatientProfileCard contactItems={patientContactItems} identity={patientProfile.identity} />
      <PatientTabsCard tabs={patientTabs} activeTab={activeTab} onTabSelect={onTabSelect} />
    </aside>
  );
}
