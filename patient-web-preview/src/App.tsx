import { useMemo, useState } from "react";

type PatientPreviewTab = "home" | "health-plan" | "mine";

const tabs: Array<{ id: PatientPreviewTab; label: string; icon: string }> = [
  { id: "home", label: "首页", icon: "⌂" },
  { id: "health-plan", label: "健康计划", icon: "≣" },
  { id: "mine", label: "我的", icon: "○" },
];

function useInitialTab(): PatientPreviewTab {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return "home";
    }

    const currentTab = new URLSearchParams(window.location.search).get("tab");
    return currentTab === "health-plan" || currentTab === "mine" ? currentTab : "home";
  }, []);
}

export default function App() {
  const initialTab = useInitialTab();
  const [activeTab, setActiveTab] = useState<PatientPreviewTab>(initialTab);

  return (
    <main className="miniapp-preview-shell">
      <section className="miniapp-preview-phone">
        <section className="miniapp-preview-nav">
          <div className="miniapp-preview-status-spacer" />
          <header className="miniapp-preview-header">
            <h1>{tabs.find((tab) => tab.id === activeTab)?.label ?? "首页"}</h1>
            <div className="miniapp-preview-capsule" aria-hidden="true" />
          </header>
        </section>

        <section className="miniapp-preview-body" />

        <nav className="miniapp-preview-tabbar" aria-label="患者端预览导航">
          {tabs.map((tab) => (
            <button
              className={`miniapp-preview-tab${tab.id === activeTab ? " active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="miniapp-preview-tab-icon" aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}
