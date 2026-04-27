import { useMemo, useState } from "react";
import {
  AimOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Button from "antd/es/button";
import Dropdown from "antd/es/dropdown";
import type { MenuProps } from "antd";
import {
  healthPlanHeader,
  healthPlanTasks,
} from "../../../../../shared/adapters/admin";
import { PatientTabPageFrame } from "../../../components/layout/PatientTabPageFrame";
import { Modal960 } from "../../../components/design/Modal960";
import { goalMetricTemplates, initialPatientGoalConfigs } from "../../../data/goalMetricTemplates";
import { HealthGoalConfigModal } from "./HealthGoalConfigModal";
import type {
  HealthPlanCheckInStatus,
  HealthPlanTask,
  HealthPlanTaskStatus,
} from "../../../types/healthPlan";
import type {
  HealthPlanEditorCheckInType,
  HealthPlanEditorDraft,
} from "../../../types/healthPlanEditor";
import type { GoalMetricTemplate, PatientGoalConfig } from "../../../types/goal";

const progressText = `进度 ${healthPlanTasks.filter((task) => task.status === "已完成").length}/${healthPlanTasks.length}`;
const healthPlanMoreMenuItems: MenuProps["items"] = [
  { key: "create", label: "新建健康计划" },
  { key: "history", label: "历史健康计划" },
];

const presetPlanTemplates = [
  {
    id: "template-weight",
    title: "28天减重管理计划",
    description: "专为超重人群设计的科学减重方案，结合饮食控制与适度运动，28天建立健康生活节奏。",
    team: "内分泌科体重管理团队",
    taskCount: 3,
  },
  {
    id: "template-diabetes",
    title: "糖尿病管理计划",
    description: "针对2型糖尿病患者的综合管理方案，涵盖血糖监测、饮食指导及用药提醒。",
    team: "内分泌科糖尿病管理团队",
    taskCount: 5,
  },
  {
    id: "template-hypertension",
    title: "高血压管理计划",
    description: "心血管专科制定的高血压日常管理计划，包含血压监测、低盐饮食与规律随访。",
    team: "心血管内科慢病管理团队",
    taskCount: 4,
  },
];

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.75 3.75 10 8.6 5.2 10.25 10 12l1.75 4.8L13.5 12l4.8-1.75-4.8-1.65-1.75-4.85Z" />
      <path d="m17.3 14.25-.75 2.1-2.05.75 2.05.75.75 2.05.7-2.05 2.1-.75-2.1-.75-.7-2.1Z" />
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

function HealthPlanCheckInIcon({ type }: { type: HealthPlanEditorCheckInType }) {
  switch (type) {
    case "diet":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v8" />
          <path d="M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
          <path d="M7 11v10" />
          <path d="M15 3v18" />
          <path d="M15 3c3 1.5 4.5 4.5 4 8h-4" />
        </svg>
      );
    case "water":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z" />
          <path d="M9.5 15.5a3 3 0 0 0 4 1.8" />
        </svg>
      );
    case "exercise":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="13" cy="5" r="2" />
          <path d="m8 21 3-6" />
          <path d="m16 21-2-5-4-3 2-4" />
          <path d="m7 10 4-1 3 3 4 1" />
        </svg>
      );
    case "bloodPressure":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 12a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0v-3Z" />
          <path d="M12 7v10" />
          <path d="M16 20c2.2-.8 3.5-2.6 3.5-5" />
          <path d="M8 20c-2.2-.8-3.5-2.6-3.5-5" />
        </svg>
      );
    case "sleep":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 15.5A7 7 0 0 1 8.5 6a7.5 7.5 0 1 0 9.5 9.5Z" />
        </svg>
      );
    case "psychology":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4c-2.8 2.2-4 4.5-4 7a4 4 0 0 0 8 0c0-2.5-1.2-4.8-4-7Z" />
          <path d="M6 20h12" />
          <path d="M12 15v5" />
        </svg>
      );
    case "bodyFat":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-7" />
          <path d="M4 19h16" />
        </svg>
      );
    case "nutrition":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 13a4 4 0 1 1 8 0c0 2.5-2 4-4 6-2-2-4-3.5-4-6Z" />
          <path d="M12 9v5" />
          <path d="M9.5 11.5h5" />
        </svg>
      );
    case "weight":
    case "waist":
    case "hip":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 9a7 7 0 0 1 14 0v9H5V9Z" />
          <path d="M9 9a3 3 0 0 1 6 0" />
          <path d="M12 9l2-2" />
        </svg>
      );
  }
}

const overviewCheckInTypeOrder: HealthPlanEditorCheckInType[] = [
  "diet",
  "water",
  "exercise",
  "sleep",
  "psychology",
  "nutrition",
  "weight",
  "waist",
  "hip",
  "bodyFat",
  "bloodPressure",
];

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

export function PatientHealthPlanStage({
  draft,
  onEditPlan,
  onCreateAiPlan,
  onCreateDirectPlan,
  onOpenCheckInRecords,
}: {
  draft: HealthPlanEditorDraft;
  onEditPlan: () => void;
  onCreateAiPlan: () => void;
  onCreateDirectPlan: () => void;
  onOpenCheckInRecords: () => void;
}) {
  const [goalConfigs, setGoalConfigs] = useState(initialPatientGoalConfigs);
  const [goalOverview, setGoalOverview] = useState(
    "围绕体重控制、代谢改善和生活方式稳定三项重点，设置重点监测指标并持续追踪患者阶段变化。",
  );
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const planTitle = draft.meta.name || healthPlanHeader.title;
  const planManager = draft.meta.team || healthPlanHeader.manager;
  const planDescription = draft.meta.description || healthPlanHeader.description;

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
  const visibleCheckIns = useMemo(() => {
    const orderMap = new Map(overviewCheckInTypeOrder.map((type, index) => [type, index]));
    return [...draft.checkInPlanItems.map((item, index) => ({ item, index }))]
      .sort((left, right) => {
        const leftOrder = orderMap.get(left.item.type) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = orderMap.get(right.item.type) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder === rightOrder ? left.index - right.index : leftOrder - rightOrder;
      })
      .map(({ item }) => item);
  }, [draft.checkInPlanItems]);

  function handleDirectCreatePlan() {
    setCreatePlanModalOpen(false);
    onCreateDirectPlan();
  }

  function handleAiCreatePlan() {
    setCreatePlanModalOpen(false);
    onCreateAiPlan();
  }

  return (
    <>
      <PatientTabPageFrame
        actions={
          <div className="actions">
            <Dropdown
              menu={{
                items: healthPlanMoreMenuItems,
                onClick: ({ key }) => {
                  setMoreMenuOpen(false);
                  if (key === "create") {
                    setCreatePlanModalOpen(true);
                  }
                },
              }}
              open={moreMenuOpen}
              overlayClassName="health-plan-more-menu"
              placement="bottomRight"
              trigger={["click"]}
              onOpenChange={setMoreMenuOpen}
            >
              <button className="more-button" type="button" aria-label="更多操作">
                <MoreIcon />
              </button>
            </Dropdown>
          </div>
        }
        bodyClassName="health-plan-stage"
        title="健康计划"
      >
        <section className="health-plan-hero">
        <div className="health-plan-hero-orb health-plan-hero-orb-left" aria-hidden="true" />
        <div className="health-plan-hero-orb health-plan-hero-orb-right" aria-hidden="true" />

        <div className="health-plan-head-actions">
          <Button className="ds-antd-health-action-button" icon={<EditOutlined />} type="default" onClick={onEditPlan}>
            编辑当前计划
          </Button>
        </div>

        <div className="health-plan-hero-head">
          <div className="health-plan-title-block">
            <div className="health-plan-title-row">
              <h2>{planTitle}</h2>
              <PlanStatusTag status={healthPlanHeader.status} />
            </div>
            <p className="health-plan-manager">健康管理团队：{planManager}</p>
            <p className="health-plan-description">健康计划简介：{planDescription}</p>
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
          {visibleCheckIns.length ? (
            visibleCheckIns.map((checkIn) => (
              <article className="health-checkin-card" key={checkIn.id}>
                <PlanStatusTag status="执行中" />
                <div className="health-checkin-card-head">
                  <span className={`health-plan-checkin-config-card-icon type-${checkIn.type}`}>
                    <HealthPlanCheckInIcon type={checkIn.type} />
                  </span>
                  <div className="health-checkin-card-copy">
                    <h4>{checkIn.name}</h4>
                    <p title={checkIn.description}>{checkIn.description}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="health-checkin-empty">暂未配置打卡任务</div>
          )}
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

      <Modal960
        open={createPlanModalOpen}
        title="为张患者 制定健康管理计划"
        onClose={() => setCreatePlanModalOpen(false)}
      >
        <div className="health-plan-create-modal">
          <div className="health-plan-create-grid">
            <button className="health-plan-create-entry is-direct" type="button" onClick={handleDirectCreatePlan}>
              <div className="health-plan-create-entry-center">
                <span className="health-plan-create-entry-icon">
                  <PlusOutlined />
                </span>
                <strong>直接新建</strong>
              </div>
            </button>

            <button className="health-plan-create-entry is-ai" type="button" onClick={handleAiCreatePlan}>
              <div className="health-plan-create-entry-center">
                <span className="health-plan-create-entry-icon">
                  <SparkIcon />
                </span>
                <strong>AI智能生成</strong>
                <p>基于患者健康档案生成个性化健康计划</p>
              </div>
            </button>

            {presetPlanTemplates.map((template) => (
              <article className="health-plan-create-template" key={template.id}>
                <header>
                  <strong>{template.title}</strong>
                  <span>模板</span>
                </header>
                <p>{template.description}</p>
                <div className="health-plan-create-template-meta">
                  <span><TeamOutlined /> {template.team}</span>
                  <span><UnorderedListOutlined /> 包含 {template.taskCount} 个任务</span>
                </div>
                <footer>
                  <button type="button">预览</button>
                  <button type="button" onClick={handleAiCreatePlan}>使用</button>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </Modal960>
    </>
  );
}
