import { useState } from "react";
import { Text, View } from "@tarojs/components";
import { PageContainer, PageSection } from "../../components/page-container";
import { PageBottomSheet, PageFloatingAction } from "../../components/page-overlay";
import { PageChip, PageMetricCard, PageSectionHeader, PageTaskCard } from "../../components/page-primitives";
import { PageShell } from "../../components/page-shell";
import { patientMiniappHomePageData } from "../../shared/patientData";
import "./index.scss";

const homePageData = patientMiniappHomePageData;
const defaultPatient = homePageData.patients[0]!;

export default function HomePage() {
  const [teamIndex, setTeamIndex] = useState(0);
  const [activePatientId, setActivePatientId] = useState(defaultPatient.id);
  const [isTeamSheetOpen, setIsTeamSheetOpen] = useState(false);
  const activePatient = homePageData.patients.find((patient) => patient.id === activePatientId) ?? defaultPatient;
  const activePatientTasks =
    homePageData.tasksByPatientId[activePatient.id as keyof typeof homePageData.tasksByPatientId] ?? [];

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
          <PageFloatingAction icon="＋" label="记录" />
          {isTeamSheetOpen ? (
            <PageBottomSheet title="切换管理团队" onMaskClick={closeTeamSheet}>
              <View className="home-page-team-sheet-list">
                {homePageData.teams.map((team, index) => {
                  const isActive = index === teamIndex;

                  return (
                    <View
                      key={team.id}
                      className={`home-page-team-sheet-item${isActive ? " is-active" : ""}`}
                      onClick={() => handleSelectTeam(index)}
                    >
                      <Text className="home-page-team-sheet-item-label">{team.name}</Text>
                      {isActive ? <Text className="home-page-team-sheet-item-check">✓</Text> : null}
                    </View>
                  );
                })}
              </View>
            </PageBottomSheet>
          ) : null}
        </>
      }
    >
      <PageContainer>
        <View className="home-page-floating-filter">
          <View className="home-page-team-switch" onClick={openTeamSheet}>
            <Text className="home-page-team-switch-label">{homePageData.teams[teamIndex]?.name}</Text>
            <Text className="home-page-team-switch-icon">∨</Text>
          </View>
        </View>
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
        <PageSection className="home-page-service-section">
          <PageSectionHeader title="健康服务" />
          <View className="home-page-service-grid">
            {homePageData.services.map((service) => (
              <View key={service.id} className="home-page-service-item">
                <View className="home-page-service-icon">{service.icon}</View>
                <Text className="home-page-service-name">{service.name}</Text>
              </View>
            ))}
          </View>
        </PageSection>
        <View className="home-page-patient-chip-list home-page-data-patient-list">
          {homePageData.patients.map((patient) => {
            const isActive = patient.id === activePatientId;

            return (
              <PageChip
                key={patient.id}
                className="home-page-patient-chip"
                active={isActive}
                avatar={patient.name.slice(0, 1)}
                label={patient.name}
                meta={isActive ? `${patient.gender} ${patient.age}岁` : undefined}
                onClick={() => setActivePatientId(patient.id)}
              />
            );
          })}
        </View>
        <PageSection className="home-page-data-section">
          <PageSectionHeader title="健康数据" />
          <View className="home-page-data-grid">
            {homePageData.metrics.map((metric) => (
              <PageMetricCard key={metric.id} label={metric.name} value={metric.value} unit={metric.unit} />
            ))}
          </View>
        </PageSection>
        <PageSection className="home-page-task-section">
          <PageSectionHeader title="健康任务" subtitle={`${activePatient.name}的当前待跟进任务`} />
          <View className="home-page-task-list">
            {activePatientTasks.map((task) => (
              <PageTaskCard key={task.id} title={task.title} status={task.status} description={task.desc} />
            ))}
          </View>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
