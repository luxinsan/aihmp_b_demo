import { useMemo, useState } from "react";

type PatientPreviewTab = "home" | "health-plan" | "mine";

const tabs: Array<{ id: PatientPreviewTab; label: string }> = [
  { id: "home", label: "首页" },
  { id: "health-plan", label: "健康计划" },
  { id: "mine", label: "我的" },
];

const teamOptions = ["瑞宁慢病管理团队", "康衡随访管理团队", "嘉和术后康复团队"];

type PatientOption = {
  id: "p-001" | "p-002" | "p-003";
  name: string;
  gender: string;
  age: number;
  relation: string;
};

type HealthTask = {
  id: string;
  title: string;
  desc: string;
  status: string;
};

const patientOptions: PatientOption[] = [
  { id: "p-001", name: "张三", gender: "男", age: 58, relation: "本人" },
  { id: "p-002", name: "李四", gender: "女", age: 63, relation: "配偶" },
  { id: "p-003", name: "王五", gender: "男", age: 71, relation: "父亲" },
];

const defaultPatient: PatientOption = patientOptions[0]!;

const healthServices = [
  { id: "pre-consult", name: "预问诊", icon: "问" },
  { id: "priority", name: "精准加号", icon: "号" },
  { id: "package", name: "健康服务包", icon: "包" },
  { id: "assessment", name: "健康评估", icon: "评" },
];

const healthMetrics = [
  { id: "weight", name: "体重", value: "68.5", unit: "kg" },
  { id: "glucose", name: "血糖", value: "5.8", unit: "mmol/L" },
  { id: "pressure", name: "血压", value: "126/82", unit: "mmHg" },
];

const healthTasksByPatientId: Record<PatientOption["id"], HealthTask[]> = {
  "p-001": [
    { id: "task-001", title: "早餐后血糖记录", desc: "今日 09:30 前完成一次录入", status: "待完成" },
    { id: "task-002", title: "降压药服药确认", desc: "午间用药后确认服药状态", status: "进行中" },
    { id: "task-003", title: "本周随访问卷", desc: "还剩 4 个问题待填写", status: "未开始" },
  ],
  "p-002": [
    { id: "task-004", title: "晨起血压打卡", desc: "今日需补充晨间血压数据", status: "待完成" },
    { id: "task-005", title: "饮食记录上传", desc: "晚餐后补充今日饮食照片", status: "进行中" },
    { id: "task-006", title: "步行训练提醒", desc: "建议完成 20 分钟轻量步行", status: "未开始" },
  ],
  "p-003": [
    { id: "task-007", title: "空腹血糖复测", desc: "明早 08:00 前完成并上传", status: "待完成" },
    { id: "task-008", title: "睡前血压确认", desc: "睡前补充一次血压测量", status: "未开始" },
    { id: "task-009", title: "康复训练反馈", desc: "今日训练后记录体感反馈", status: "进行中" },
  ],
};

function useInitialTab(): PatientPreviewTab {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return "home";
    }

    const currentTab = new URLSearchParams(window.location.search).get("tab");
    return currentTab === "health-plan" || currentTab === "mine" ? currentTab : "home";
  }, []);
}

function TabIcon({ tabId }: { tabId: PatientPreviewTab }) {
  if (tabId === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.75 10.25 12 5l6.25 5.25v7a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5v-7Z" />
        <path d="M9.5 18.75v-4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4.5" />
      </svg>
    );
  }

  if (tabId === "health-plan") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="4.75" width="12" height="14.5" rx="2.25" />
        <path d="M9 9h6" />
        <path d="M9 12.25h6" />
        <path d="M9 15.5h3.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="3.25" />
      <path d="M6.75 18a5.25 5.25 0 0 1 10.5 0" />
    </svg>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <section className="miniapp-preview-card">
        <p className="miniapp-preview-kicker">Container Only</p>
        <h2>{title}</h2>
        <p>当前仅保留页面骨架，这个 tab 的具体内容后续再单独构建。</p>
      </section>
      <section className="miniapp-preview-card miniapp-preview-card-large" />
      <section className="miniapp-preview-card" />
    </>
  );
}

type HomePageProps = {
  teamIndex: number;
  onOpenTeamSheet: () => void;
};

function HomePage({ teamIndex, onOpenTeamSheet }: HomePageProps) {
  const [activePatientId, setActivePatientId] = useState<PatientOption["id"]>("p-001");
  const activePatient = patientOptions.find((patient) => patient.id === activePatientId) ?? defaultPatient;
  const activePatientTasks = healthTasksByPatientId[activePatient.id];

  return (
    <>
      <div className="miniapp-preview-floating-filter">
        <button className="miniapp-preview-team-switch" type="button" onClick={onOpenTeamSheet}>
          <span>{teamOptions[teamIndex]}</span>
          <span>∨</span>
        </button>
      </div>

      <section className="miniapp-preview-card miniapp-preview-patient-switcher" />
      <section className="miniapp-preview-ai-inline">
        <div className="miniapp-preview-ai-inline-input">
          <div className="miniapp-preview-ai-inline-label">
            <div className="miniapp-preview-ai-assistant-badge">AI</div>
            <strong>AI 助手</strong>
          </div>
          <div className="miniapp-preview-ai-inline-row">
            <span>请输入你想咨询的问题</span>
            <div className="miniapp-preview-ai-inline-send">➤</div>
          </div>
        </div>
      </section>
      <section className="miniapp-preview-service-section">
        <div className="miniapp-preview-service-header">
          <strong>健康服务</strong>
        </div>
        <div className="miniapp-preview-service-grid">
          {healthServices.map((service) => (
            <div className="miniapp-preview-service-item" key={service.id}>
              <div className="miniapp-preview-service-icon">{service.icon}</div>
              <span>{service.name}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="miniapp-preview-patient-chip-list miniapp-preview-data-patient-list">
        {patientOptions.map((patient) => {
          const isActive = patient.id === activePatientId;

          return (
            <button
              className={`miniapp-preview-patient-chip miniapp-preview-patient-chip-compact${isActive ? " active" : ""}`}
              key={patient.id}
              type="button"
              onClick={() => setActivePatientId(patient.id)}
            >
              <div className="miniapp-preview-patient-chip-avatar">{patient.name.slice(0, 1)}</div>
              <div className="miniapp-preview-patient-chip-text">
                <strong>{patient.name}</strong>
                {isActive ? <span>{patient.gender} {patient.age}岁</span> : null}
              </div>
            </button>
          );
        })}
      </div>
      <section className="miniapp-preview-service-section">
        <div className="miniapp-preview-service-header">
          <strong>健康数据</strong>
        </div>
        <div className="miniapp-preview-data-grid">
          {healthMetrics.map((metric) => (
            <div className="miniapp-preview-data-card" key={metric.id}>
              <span className="miniapp-preview-data-label">{metric.name}</span>
              <div className="miniapp-preview-data-value-row">
                <strong className="miniapp-preview-data-value">{metric.value}</strong>
                <span className="miniapp-preview-data-unit">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="miniapp-preview-service-section miniapp-preview-task-section">
        <div className="miniapp-preview-service-header miniapp-preview-task-header">
          <div className="miniapp-preview-task-heading">
            <strong>健康任务</strong>
            <p>{activePatient.name}的当前待跟进任务</p>
          </div>
        </div>
        <div className="miniapp-preview-task-list">
          {activePatientTasks.map((task) => (
            <div className="miniapp-preview-task-card" key={task.id}>
              <div className="miniapp-preview-task-card-top">
                <strong>{task.title}</strong>
                <span>{task.status}</span>
              </div>
              <p>{task.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function App() {
  const initialTab = useInitialTab();
  const [activeTab, setActiveTab] = useState<PatientPreviewTab>(initialTab);
  const [teamIndex, setTeamIndex] = useState(0);
  const [isTeamSheetOpen, setIsTeamSheetOpen] = useState(false);
  const currentTitle = tabs.find((tab) => tab.id === activeTab)?.label ?? "首页";

  return (
    <main className="miniapp-preview-shell">
      <section className="miniapp-preview-phone">
        <div className="miniapp-preview-notch" aria-hidden="true" />
        <section className="miniapp-preview-nav">
          <div className="miniapp-preview-status-spacer" />
          <header className="miniapp-preview-header">
            <h1>{currentTitle}</h1>
            <div className="miniapp-preview-capsule" aria-hidden="true" />
          </header>
        </section>

        <section className="miniapp-preview-body">
          <div className="miniapp-preview-scroll">
            {activeTab === "home" ? (
              <HomePage teamIndex={teamIndex} onOpenTeamSheet={() => setIsTeamSheetOpen(true)} />
            ) : (
              <PlaceholderPage title={currentTitle} />
            )}
            <div className="miniapp-preview-scroll-spacer" aria-hidden="true" />
          </div>
        </section>

        {activeTab === "home" && isTeamSheetOpen ? (
          <section className="miniapp-preview-team-sheet">
            <button className="miniapp-preview-team-sheet-mask" type="button" aria-label="关闭团队选择" onClick={() => setIsTeamSheetOpen(false)} />
            <div className="miniapp-preview-team-sheet-panel">
              <div className="miniapp-preview-team-sheet-handle" aria-hidden="true" />
              <h2>切换管理团队</h2>
              <div className="miniapp-preview-team-sheet-list">
                {teamOptions.map((team, index) => (
                  <button
                    className={`miniapp-preview-team-sheet-item${index === teamIndex ? " active" : ""}`}
                    key={team}
                    type="button"
                    onClick={() => {
                      setTeamIndex(index);
                      setIsTeamSheetOpen(false);
                    }}
                  >
                    <span>{team}</span>
                    {index === teamIndex ? <strong>✓</strong> : null}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "home" ? (
          <button className="miniapp-preview-record-fab" type="button">
            <span className="miniapp-preview-record-fab-icon">＋</span>
            <span className="miniapp-preview-record-fab-label">记录</span>
          </button>
        ) : null}

        <nav className="miniapp-preview-tabbar" aria-label="患者端预览导航">
          {tabs.map((tab) => (
            <button
              className={`miniapp-preview-tab${tab.id === activeTab ? " active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="miniapp-preview-tab-icon" aria-hidden="true">
                <TabIcon tabId={tab.id} />
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="miniapp-preview-home-indicator" aria-hidden="true" />
      </section>
    </main>
  );
}
