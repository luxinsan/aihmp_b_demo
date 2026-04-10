type PatientTabsCardProps = {
  onTabSelect?: (tab: string) => void;
  tabs: readonly string[];
  activeTab: string;
};

export function PatientTabsCard({ tabs, activeTab, onTabSelect }: PatientTabsCardProps) {
  return (
    <article className="tab-card panel">
      {tabs.map((tab) => (
        <button
          className={`detail-link${tab === activeTab ? " active" : ""}`}
          key={tab}
          type="button"
          onClick={() => onTabSelect?.(tab)}
        >
          {tab}
        </button>
      ))}
    </article>
  );
}
