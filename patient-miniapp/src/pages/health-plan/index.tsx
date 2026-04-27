import { useState } from "react";
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { PageBottomDock, PageContainer, PageSection } from "../../components/page-container";
import { PageShell } from "../../components/page-shell";
import { patientMiniappHealthPlanPageData } from "../../shared/patientData";
import "./index.scss";

export default function HealthPlanPage() {
  const [tasks, setTasks] = useState(patientMiniappHealthPlanPageData.tasks);
  const completedCount = tasks.filter((task) => task.status === "已完成").length;
  const actionableCount = tasks.filter((task) => task.status === "进行中" || task.status === "未开始").length;

  function handleCompleteTask(taskId: string) {
    let updatedTitle = "";
    let hasChanged = false;

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (task.status === "已完成" || task.status === "已终止") {
          return task;
        }

        updatedTitle = task.title;
        hasChanged = true;

        return {
          ...task,
          status: "已完成",
        };
      }),
    );

    if (hasChanged) {
      Taro.showToast({
        title: `${updatedTitle}已完成`,
        icon: "success",
      });
    }
  }

  return (
    <PageShell
      title="健康计划"
      bodyClassName="health-plan-page"
      bottomSlot={
        <PageBottomDock className="health-plan-page-dock">
          <View className="health-plan-page-dock-section">
            <View>
              <Text className="health-plan-page-dock-label">当前待完成任务</Text>
              <Text className="health-plan-page-dock-value">{actionableCount} 项</Text>
            </View>
            <View className="health-plan-page-dock-progress">
              <Text className="health-plan-page-dock-progress-text">
                已完成 {completedCount}/{tasks.length}
              </Text>
            </View>
          </View>
        </PageBottomDock>
      }
    >
      <PageContainer>
        <PageSection className="health-plan-page-summary">
          <View className="health-plan-page-summary-head">
            <View className="health-plan-page-summary-copy">
              <Text className="health-plan-page-summary-title">
                {patientMiniappHealthPlanPageData.overview.title}
              </Text>
              <Text className="health-plan-page-summary-desc">
                {patientMiniappHealthPlanPageData.overview.description}
              </Text>
            </View>
            <Text className="health-plan-page-summary-status">
              {patientMiniappHealthPlanPageData.overview.status}
            </Text>
          </View>

          <View className="health-plan-page-summary-metrics">
            <View className="health-plan-page-summary-metric">
              <Text className="health-plan-page-summary-metric-label">管理团队</Text>
              <Text className="health-plan-page-summary-metric-value">
                {patientMiniappHealthPlanPageData.overview.manager}
              </Text>
            </View>
            <View className="health-plan-page-summary-metric">
              <Text className="health-plan-page-summary-metric-label">任务进度</Text>
              <Text className="health-plan-page-summary-metric-value">{completedCount}/{tasks.length}</Text>
            </View>
          </View>

          <View className="health-plan-page-progress">
            <View className="health-plan-page-progress-track">
              <View
                className="health-plan-page-progress-fill"
                style={{
                  width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`,
                }}
              />
            </View>
            <Text className="health-plan-page-progress-text">
              {patientMiniappHealthPlanPageData.overview.summary}
            </Text>
          </View>
        </PageSection>

        <PageSection className="health-plan-page-task-group">
          <View className="health-plan-page-task-header">
            <View>
              <Text className="health-plan-page-task-title">计划任务</Text>
              <Text className="health-plan-page-task-subtitle">先展示健康管理计划编排出来的执行任务</Text>
            </View>
          </View>

          <View className="health-plan-page-task-list">
            {tasks.map((task) => {
              const isDone = task.status === "已完成";
              const isStopped = task.status === "已终止";
              const canComplete = !isDone && !isStopped;

              return (
                <View className="health-plan-page-task-card" key={task.id}>
                  <View className="health-plan-page-task-card-head">
                    <View className="health-plan-page-task-card-main">
                      <View className="health-plan-page-task-card-meta">
                        <Text className={`health-plan-page-task-category tone-${task.categoryTone}`}>
                          {task.category}
                        </Text>
                        <Text className={`health-plan-page-task-status status-${task.status}`}>
                          {task.status}
                        </Text>
                      </View>
                      <Text className="health-plan-page-task-card-title">{task.title}</Text>
                      <Text className="health-plan-page-task-card-date">{task.dateRange}</Text>
                      {task.detail ? (
                        <Text className="health-plan-page-task-card-detail">{task.detail}</Text>
                      ) : null}
                    </View>

                    <View
                      className={`health-plan-page-task-action${canComplete ? "" : " is-disabled"}`}
                      onClick={canComplete ? () => handleCompleteTask(task.id) : undefined}
                    >
                      <Text className="health-plan-page-task-action-text">
                        {isDone ? "已完成" : isStopped ? "已终止" : "完成"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
