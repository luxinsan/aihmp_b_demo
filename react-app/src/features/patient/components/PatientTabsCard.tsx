import type {
  AdminPatientTabIconId,
  AdminPatientTabItem,
} from "../../../../../shared/adapters/admin";

function renderTabIcon(iconId: AdminPatientTabIconId) {
  switch (iconId) {
    case "basic-info":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="3.25" />
          <path d="M8.5 9h7" />
          <path d="M8.5 12h7" />
          <path d="M8.5 15h4.5" />
        </svg>
      );
    case "archive":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.75h7.25l2.75 2.75v8.75a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z" />
          <path d="M15.25 5.75v3h3" />
          <path d="M9 12h6" />
          <path d="M9 15h4.5" />
        </svg>
      );
    case "health-plan":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19.25s-5.75-3.35-5.75-8.1A3.4 3.4 0 0 1 9.65 7.75c.98 0 1.93.43 2.35 1.18.42-.75 1.37-1.18 2.35-1.18a3.4 3.4 0 0 1 3.4 3.4c0 4.75-5.75 8.1-5.75 8.1Z" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="4.75" width="14" height="14.5" rx="2.75" />
          <path d="M8.5 9h7" />
          <path d="M8.5 12h7" />
          <path d="M8.5 15h5.25" />
        </svg>
      );
    case "questionnaires":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="11.5" width="2.75" height="5.75" rx="1.25" />
          <rect x="10.625" y="8.25" width="2.75" height="9" rx="1.25" />
          <rect x="16.25" y="5" width="2.75" height="12.25" rx="1.25" />
        </svg>
      );
  }
}

type PatientTabsCardProps = {
  onTabSelect?: (tab: string) => void;
  tabs: readonly AdminPatientTabItem[];
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
            {renderTabIcon(tab.iconId)}
          </span>
          <span className="patient-tab-label">{tab.label}</span>
        </button>
      ))}
    </article>
  );
}
