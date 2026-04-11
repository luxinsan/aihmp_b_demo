import type { PatientTabItem } from "../../../data/patientProfile";

type PatientTabsCardProps = {
  onTabSelect?: (tab: string) => void;
  tabs: readonly PatientTabItem[];
  activeTab: string;
};

export function PatientTabsCard({ tabs, activeTab, onTabSelect }: PatientTabsCardProps) {
  return (
    <article className="tab-card panel">
      {tabs.map((tab) => (
        <button
          className={`detail-link patient-tab-link${tab.label === activeTab ? " active" : ""}`}
          key={tab.label}
          type="button"
          onClick={() => onTabSelect?.(tab.label)}
        >
          <span className="patient-tab-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="patient-tab-label">{tab.label}</span>
        </button>
      ))}
    </article>
  );
}
