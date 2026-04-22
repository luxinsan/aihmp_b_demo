import { useState } from "react";
import { Text, View } from "@tarojs/components";
import { PageContainer, PageSection } from "../../components/page-container";
import { PageShell } from "../../components/page-shell";
import "./index.scss";

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
  {
    id: "p-001",
    name: "张三",
    gender: "男",
    age: 58,
    relation: "本人",
  },
  {
    id: "p-002",
    name: "李四",
    gender: "女",
    age: 63,
    relation: "配偶",
  },
  {
    id: "p-003",
    name: "王五",
    gender: "男",
    age: 71,
    relation: "父亲",
  },
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

export default function HomePage() {
  const [teamIndex, setTeamIndex] = useState(0);
  const [activePatientId, setActivePatientId] = useState<PatientOption["id"]>(defaultPatient.id);
  const [isTeamSheetOpen, setIsTeamSheetOpen] = useState(false);
  const activePatient = patientOptions.find((patient) => patient.id === activePatientId) ?? defaultPatient;
  const activePatientTasks = healthTasksByPatientId[activePatient.id];

  function openTeamSheet() {
    setIsTeamSheetOpen(true);
  }

  function closeTeamSheet() {
    setIsTeamSheetOpen(false);
  }

  function handleSelectTeam(index: number) {
    setTeamIndex(index);
    closeTeamSheet();
  }

  return (
    <PageShell
      title="首页"
      bodyClassName="home-page"
      overlaySlot={
        <>
          <View className="home-page-record-fab">
            <View className="home-page-record-fab-icon">＋</View>
            <Text className="home-page-record-fab-label">记录</Text>
          </View>
          {isTeamSheetOpen ? (
            <View className="home-page-team-sheet">
              <View className="home-page-team-sheet-mask" onClick={closeTeamSheet} />
              <View className="home-page-team-sheet-panel">
                <View className="home-page-team-sheet-handle" />
                <Text className="home-page-team-sheet-title">切换管理团队</Text>
                <View className="home-page-team-sheet-list">
                  {teamOptions.map((team, index) => {
                    const isActive = index === teamIndex;

                    return (
                      <View
                        key={team}
                        className={`home-page-team-sheet-item${isActive ? " is-active" : ""}`}
                        onClick={() => handleSelectTeam(index)}
                      >
                        <Text className="home-page-team-sheet-item-label">{team}</Text>
                        {isActive ? <Text className="home-page-team-sheet-item-check">✓</Text> : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : null}
        </>
      }
    >
      <PageContainer>
        <View className="home-page-floating-filter">
          <View className="home-page-team-switch" onClick={openTeamSheet}>
            <Text className="home-page-team-switch-label">{teamOptions[teamIndex]}</Text>
            <Text className="home-page-team-switch-icon">∨</Text>
          </View>
        </View>
        <PageSection className="home-page-patient-switcher">
        </PageSection>
        <View className="home-page-ai-assistant">
          <View className="home-page-ai-assistant-input">
            <View className="home-page-ai-assistant-inline">
              <View className="home-page-ai-assistant-badge">AI</View>
              <Text className="home-page-ai-assistant-title">AI 助手</Text>
            </View>
            <View className="home-page-ai-assistant-row">
              <Text className="home-page-ai-assistant-placeholder">请输入你想咨询的问题</Text>
              <View className="home-page-ai-assistant-send">➤</View>
            </View>
          </View>
        </View>
        <View className="home-page-service-section">
          <View className="home-page-service-header">
            <Text className="home-page-service-title">健康服务</Text>
          </View>
          <View className="home-page-service-grid">
            {healthServices.map((service) => (
              <View key={service.id} className="home-page-service-item">
                <View className="home-page-service-icon">{service.icon}</View>
                <Text className="home-page-service-name">{service.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="home-page-patient-chip-list home-page-data-patient-list">
          {patientOptions.map((patient) => {
            const isActive = patient.id === activePatientId;

            return (
              <View
                key={patient.id}
                className={`home-page-patient-chip home-page-patient-chip-compact${isActive ? " is-active" : ""}`}
                onClick={() => setActivePatientId(patient.id)}
              >
                <View className="home-page-patient-chip-avatar">{patient.name.slice(0, 1)}</View>
                <View className="home-page-patient-chip-text">
                  <Text className="home-page-patient-chip-name">{patient.name}</Text>
                  {isActive ? (
                    <Text className="home-page-patient-chip-meta">
                      {patient.gender} {patient.age}岁
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
        <View className="home-page-data-section">
          <View className="home-page-service-header">
            <Text className="home-page-service-title">健康数据</Text>
          </View>
          <View className="home-page-data-grid">
            {healthMetrics.map((metric) => (
              <View key={metric.id} className="home-page-data-card">
                <Text className="home-page-data-label">{metric.name}</Text>
                <View className="home-page-data-value-row">
                  <Text className="home-page-data-value">{metric.value}</Text>
                  <Text className="home-page-data-unit">{metric.unit}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="home-page-task-section">
          <View className="home-page-service-header home-page-task-header">
            <View>
              <Text className="home-page-service-title">健康任务</Text>
              <Text className="home-page-task-caption">{activePatient.name}的当前待跟进任务</Text>
            </View>
          </View>
          <View className="home-page-task-list">
            {activePatientTasks.map((task) => (
              <View key={task.id} className="home-page-task-card">
                <View className="home-page-task-card-top">
                  <Text className="home-page-task-title">{task.title}</Text>
                  <Text className="home-page-task-status">{task.status}</Text>
                </View>
                <Text className="home-page-task-desc">{task.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </PageContainer>
    </PageShell>
  );
}
