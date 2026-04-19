import { useMemo, useState } from "react";
import {
  AimOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Button from "antd/es/button";
import {
  healthPlanCheckIns,
  healthPlanHeader,
  healthPlanTasks,
} from "../../../../../shared/adapters/admin";
import { PatientTabPageFrame } from "../../../components/layout/PatientTabPageFrame";
import { goalMetricTemplates, initialPatientGoalConfigs } from "../../../data/goalMetricTemplates";
import { HealthGoalConfigModal } from "./HealthGoalConfigModal";
import type {
  HealthPlanCheckInStatus,
  HealthPlanTask,
  HealthPlanTaskStatus,
} from "../../../types/healthPlan";
import type { GoalMetricTemplate, PatientGoalConfig } from "../../../types/goal";

const progressText = `进度 ${healthPlanTasks.filter((task) => task.status === "已完成").length}/${healthPlanTasks.length}`;

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.75 3.75 10 8.6 5.2 10.25 10 12l1.75 4.8L13.5 12l4.8-1.75-4.8-1.65-1.75-4.85Z" />
      <path d="m17.3 14.25-.75 2.1-2.05.75 2.05.75.75 2.05.7-2.05 2.1-.75-2.1-.75-.7-2.1Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7.25" />
      <path d="M12 8.5v4.25l2.75 1.75" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="1.35" />
      <circle cx="12" cy="12" r="1.35" />
      <circle cx="18" cy="12" r="1.35" />
    </svg>
  );
}

function PlanStatusTag({ status }: { status: HealthPlanCheckInStatus | HealthPlanTaskStatus | string }) {
  const toneClass =
    status === "执行中" || status === "进行中"
      ? "is-running"
      : status === "已结束" || status === "已完成"
        ? "is-done"
        : status === "已终止"
          ? "is-stopped"
          : "is-pending";

  return <span className={`health-plan-status-tag ${toneClass}`}>{status}</span>;
}

function formatGoalValue(value: string, unit: string) {
  if (!value) {
    return "--";
  }

  return value;
}

function getGoalStatus(metricId: string, value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (metricId === "blood-pressure") {
    const [systolicRaw, diastolicRaw] = trimmedValue.split("/");
    const systolic = Number(systolicRaw);
    const diastolic = Number(diastolicRaw);

    if (Number.isNaN(systolic) || Number.isNaN(diastolic)) {
      return null;
    }

    if (systolic >= 140 || diastolic >= 90) {
      return { label: "偏高", tone: "danger" as const };
    }

    if (systolic < 120 && diastolic < 80) {
      return { label: "达标", tone: "success" as const };
    }

    return { label: "偏高", tone: "warning" as const };
  }

  const numericValue = Number(trimmedValue);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  switch (metricId) {
    case "fasting-glucose":
      if (numericValue < 3.9) return { label: "偏低", tone: "warning" as const };
      if (numericValue <= 6.0) return { label: "达标", tone: "success" as const };
      return { label: "偏高", tone: "danger" as const };
    case "hba1c":
      return numericValue < 6.0
        ? { label: "达标", tone: "success" as const }
        : { label: "偏高", tone: "danger" as const };
    case "ldl-c":
      return numericValue < 3.4
        ? { label: "达标", tone: "success" as const }
        : { label: "偏高", tone: "danger" as const };
    case "tg":
      return numericValue < 1.7
        ? { label: "达标", tone: "success" as const }
        : { label: "偏高", tone: "warning" as const };
    case "sua":
      return numericValue < 420
        ? { label: "达标", tone: "success" as const }
        : { label: "偏高", tone: "warning" as const };
    case "bmi":
      if (numericValue < 18.5) return { label: "偏低", tone: "warning" as const };
      if (numericValue <= 23.9) return { label: "达标", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "waist":
      if (numericValue < 80) return { label: "达标", tone: "success" as const };
      if (numericValue < 85) return { label: "偏高", tone: "warning" as const };
      return { label: "偏高", tone: "danger" as const };
    default:
      return null;
  }
}

function GoalCard({
  config,
  template,
}: {
  config: PatientGoalConfig;
  template: GoalMetricTemplate;
}) {
  const status = getGoalStatus(template.id, config.currentValue);

  return (
    <article className="health-goal-card">
      {status ? <em className={`health-goal-data-badge is-corner tone-${status.tone}`}>{status.label}</em> : null}
      <header className="health-goal-card-head">
        <div className="health-goal-card-head-copy">
          <strong>{template.label}</strong>
          <p>
            <span>{template.unit}</span>
          </p>
        </div>
      </header>

      <div className="health-goal-card-metrics">
        <div className="health-goal-card-metric">
          <span>目标基线</span>
          <div className="health-goal-card-value">
            <strong>{formatGoalValue(config.targetValue || template.baseline, template.unit)}</strong>
          </div>
        </div>
        <div className="health-goal-card-metric align-end">
          <span>最新数据</span>
          {config.currentValue ? (
            <div className="health-goal-card-value is-inline">
              <strong className={`tone-${status?.tone ?? "neutral"}`}>
                {formatGoalValue(config.currentValue, template.unit)}
              </strong>
            </div>
          ) : (
            <div className="health-goal-card-empty">暂无数据</div>
          )}
        </div>
      </div>
    </article>
  );
}

function TaskCard({ task }: { task: HealthPlanTask }) {
  return (
    <article className={`health-task-card${task.expanded ? " expanded" : ""}`}>
      <div className="health-task-rail" aria-hidden="true">
        <span className="health-task-dot" />
      </div>

      <div className="health-task-main">
        <header className="health-task-summary">
          <div className="health-task-summary-main">
            <div className="health-task-title-row">
              <span className={`health-task-category tone-${task.categoryTone}`}>{task.category}</span>
              <h4>{task.title}</h4>
            </div>
            <p>{task.dateRange}</p>
          </div>

          <div className="health-task-summary-side">
            <PlanStatusTag status={task.status} />
            <button className="health-task-toggle" type="button" aria-label={`${task.title}详情`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={task.expanded ? "m8.5 14.5 3.5-3.5 3.5 3.5" : "m8.5 9.5 3.5 3.5 3.5-3.5"} />
              </svg>
            </button>
          </div>
        </header>

        {task.expanded ? (
          <div className="health-task-body">
            <section className="health-task-content-panel">
              <div className="health-task-body-row">
                <span>任务内容：</span>
                <strong>{task.detail}</strong>
              </div>

              <div className="health-task-body-row logs">
                <span>执行记录：</span>
                <div className="health-task-log-list">
                  {task.logs?.map((log) => (
                    <div className="health-task-log-entry" key={log.id}>
                      <strong>{log.time}</strong>
                      <span>{log.actor}</span>
                      <span>{log.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="health-task-actions">
                {task.actions?.map((action, index) => (
                  <button
                    className={index === task.actions!.length - 1 ? "primary-button" : "ghost-button"}
                    key={action}
                    type="button"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function PatientHealthPlanStage({ onOpenCheckInRecords }: { onOpenCheckInRecords: () => void }) {
  const [goalConfigs, setGoalConfigs] = useState(initialPatientGoalConfigs);
  const [goalOverview, setGoalOverview] = useState(
    "围绕体重控制、代谢改善和生活方式稳定三项重点，设置重点监测指标并持续追踪患者阶段变化。",
  );
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  const goalTemplateMap = useMemo(
    () => new Map(goalMetricTemplates.map((template) => [template.id, template])),
    [],
  );

  const visibleGoals = useMemo(
    () =>
      goalConfigs
        .filter((config) => config.enabled)
        .map((config) => ({
          config,
          template: goalTemplateMap.get(config.metricId),
        }))
        .filter((item): item is { config: PatientGoalConfig; template: GoalMetricTemplate } => Boolean(item.template)),
    [goalConfigs, goalTemplateMap],
  );

  return (
    <PatientTabPageFrame
      actions={
        <div className="actions">
          <button className="more-button" type="button" aria-label="更多操作">
            <MoreIcon />
          </button>
        </div>
      }
      bodyClassName="health-plan-stage"
      title="健康计划"
    >
      <section className="health-plan-hero">
        <div className="health-plan-hero-orb health-plan-hero-orb-left" aria-hidden="true" />
        <div className="health-plan-hero-orb health-plan-hero-orb-right" aria-hidden="true" />

        <div className="health-plan-head-actions">
          <Button className="ds-antd-health-action-button" icon={<EditOutlined />} type="default">
            编辑当前计划
          </Button>
        </div>

        <div className="health-plan-hero-head">
          <div className="health-plan-title-block">
            <div className="health-plan-title-row">
              <h2>{healthPlanHeader.title}</h2>
              <PlanStatusTag status={healthPlanHeader.status} />
            </div>
            <p className="health-plan-manager">健康管理团队：{healthPlanHeader.manager}</p>
            <p className="health-plan-description">健康计划简介：{healthPlanHeader.description}</p>
          </div>
        </div>

        <div className="health-plan-summary-banner">
          <div className="health-plan-summary-icon">
            <SparkIcon />
          </div>
          <div className="health-plan-summary-copy">
            <strong>AI 阶段总结</strong>
            <p>{healthPlanHeader.summary}</p>
          </div>
        </div>
      </section>

      <section className="health-plan-block">
        <div className="health-plan-block-head">
          <h3>健康目标</h3>
          <Button
            className="ds-antd-health-action-button"
            icon={<AimOutlined />}
            type="default"
            onClick={() => setGoalModalOpen(true)}
          >
            设置目标
          </Button>
        </div>
        <div className="health-plan-block-overview">
          <strong>健康管理目标概述</strong>
          <p>{goalOverview}</p>
        </div>
        <div className="health-plan-goals">
          {visibleGoals.map(({ config, template }) => (
            <GoalCard config={config} key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="health-plan-block">
        <div className="health-plan-block-head">
          <h3>日常打卡</h3>
          <Button className="ds-antd-health-action-button" type="default" onClick={onOpenCheckInRecords}>
            查看打卡记录
          </Button>
        </div>
        <div className="health-checkin-grid">
          {healthPlanCheckIns.map((checkIn) => (
            <article className="health-checkin-card" key={checkIn.id}>
              <div className="health-checkin-card-head">
                <div>
                  <h4>{checkIn.title}</h4>
                  <p>{checkIn.description}</p>
                </div>
                <PlanStatusTag status={checkIn.status} />
              </div>
              <div className="health-checkin-schedule">
                <ClockIcon />
                <span>{checkIn.schedule}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="health-plan-block health-task-block">
        <div className="health-task-block-head">
          <h3>健康任务</h3>
          <span className="health-task-progress">{progressText}</span>
        </div>

        <div className="health-task-list">
          {healthPlanTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <p className="health-task-footer-note">
          <SparkIcon />
          <span>后续任务将根据患者健康情况动态生成</span>
        </p>
      </section>

      <HealthGoalConfigModal
        overviewValue={goalOverview}
        open={goalModalOpen}
        templates={goalMetricTemplates}
        value={goalConfigs}
        onClose={() => setGoalModalOpen(false)}
        onSave={(nextValue, nextOverview) => {
          setGoalConfigs(nextValue);
          setGoalOverview(nextOverview);
          setGoalModalOpen(false);
        }}
      />
    </PatientTabPageFrame>
  );
}
