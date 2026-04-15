import { useEffect, useMemo, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox";
import Empty from "antd/es/empty";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Tag from "antd/es/tag";
import Tooltip from "antd/es/tooltip";
import Tree from "antd/es/tree";
import Typography from "antd/es/typography";
import type { GoalMetricTemplate, PatientGoalConfig } from "../../../types/goal";

type HealthGoalConfigModalProps = {
  overviewValue: string;
  open: boolean;
  templates: GoalMetricTemplate[];
  value: PatientGoalConfig[];
  onClose: () => void;
  onSave: (nextValue: PatientGoalConfig[], nextOverview: string) => void;
};

function buildConfigMap(configs: PatientGoalConfig[]) {
  return new Map(configs.map((config) => [config.metricId, config]));
}

function getMetricAssessment(template: GoalMetricTemplate, value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (template.id === "blood-pressure") {
    const [systolicRaw, diastolicRaw] = trimmedValue.split("/");
    const systolic = Number(systolicRaw);
    const diastolic = Number(diastolicRaw);

    if (Number.isNaN(systolic) || Number.isNaN(diastolic)) {
      return null;
    }

    if (systolic >= 140 || diastolic >= 90) {
      return { label: "偏高", tone: "error" as const };
    }

    if (systolic < 120 && diastolic < 80) {
      return { label: "正常", tone: "success" as const };
    }

    return { label: "偏高", tone: "warning" as const };
  }

  const numericValue = Number(trimmedValue);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  switch (template.id) {
    case "fasting-glucose":
      if (numericValue < 3.9) return { label: "偏低", tone: "warning" as const };
      if (numericValue <= 6.0) return { label: "正常", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "hba1c":
      if (numericValue < 6.0) return { label: "正常", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "ldl-c":
      if (numericValue < 3.4) return { label: "正常", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "tg":
      if (numericValue < 1.7) return { label: "正常", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "sua":
      if (numericValue < 420) return { label: "正常", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "bmi":
      if (numericValue < 18.5) return { label: "偏低", tone: "warning" as const };
      if (numericValue <= 23.9) return { label: "正常", tone: "success" as const };
      return { label: "偏高", tone: "warning" as const };
    case "waist":
      if (numericValue < 80) return { label: "正常", tone: "success" as const };
      if (numericValue < 85) return { label: "偏高", tone: "warning" as const };
      return { label: "过高", tone: "error" as const };
    default:
      return null;
  }
}

export function HealthGoalConfigModal({
  overviewValue,
  open,
  templates,
  value,
  onClose,
  onSave,
}: HealthGoalConfigModalProps) {
  const { TextArea } = Input;
  const [draftConfigs, setDraftConfigs] = useState<PatientGoalConfig[]>(value);
  const [draftOverview, setDraftOverview] = useState(overviewValue);
  const [activeMetricId, setActiveMetricId] = useState<string>("blood-pressure");
  const [loadingMetricId, setLoadingMetricId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraftConfigs(value);
    setDraftOverview(overviewValue);
    setActiveMetricId("blood-pressure");
    setLoadingMetricId(null);
  }, [open, overviewValue, value]);

  const groupedTemplates = useMemo(() => {
    const groupMap = new Map<string, GoalMetricTemplate[]>();

    templates.forEach((template) => {
      const current = groupMap.get(template.dimensionId) ?? [];
      current.push(template);
      groupMap.set(template.dimensionId, current);
    });

    return Array.from(groupMap.entries()).map(([dimensionId, items]) => ({
      dimensionId,
      dimensionLabel: items[0]?.dimensionLabel ?? "",
      items,
    }));
  }, [templates]);

  const draftConfigMap = useMemo(() => buildConfigMap(draftConfigs), [draftConfigs]);
  const activeTemplate = templates.find((template) => template.id === activeMetricId) ?? templates[0];

  function updateMetric(metricId: string, patch: Partial<PatientGoalConfig>) {
    setDraftConfigs((current) =>
      current.map((config) =>
        config.metricId === metricId
          ? {
              ...config,
              ...patch,
            }
          : config,
        ),
    );
  }

  const dimensionLabelMap: Record<string, string> = {
    "blood-pressure": "血压管理",
    "blood-sugar": "血糖管理",
    "blood-lipid": "血脂管理",
    "uric-acid": "尿酸管理",
    "body-shape": "体重形态",
  };

  const treeData = groupedTemplates.map((group) => ({
    key: group.dimensionId,
    title: <span className="health-goal-tree-dimension">{dimensionLabelMap[group.dimensionId] ?? group.dimensionLabel}</span>,
    selectable: false,
    children: group.items.map((item) => ({
      key: item.id,
      title: (
        <div className="health-goal-tree-metric-row">
          <Checkbox
            checked={draftConfigMap.get(item.id)?.enabled ?? false}
            onChange={(event) => updateMetric(item.id, { enabled: event.target.checked })}
            onClick={(event) => event.stopPropagation()}
          />
          <span className="health-goal-tree-metric">{item.label}</span>
        </div>
      ),
      isLeaf: true,
    })),
  }));
  const expandedKeys = groupedTemplates.map((group) => group.dimensionId);

  function refetchMetric(metricId: string, latestValue: string) {
    setLoadingMetricId(metricId);

    window.setTimeout(() => {
      updateMetric(metricId, { currentValue: latestValue });
      setLoadingMetricId((current) => (current === metricId ? null : current));
    }, 700);
  }

  return (
    <Modal
      centered
      className="ds-antd-modal-panel"
      closable={false}
      closeIcon={null}
      destroyOnHidden
      footer={null}
      keyboard
      maskClosable
      onCancel={onClose}
      open={open}
      rootClassName="ds-antd-modal-root health-goal-modal-root"
      styles={{
        body: { padding: 0 },
        container: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
        },
        mask: { background: "rgba(16, 28, 49, 0.28)", backdropFilter: "blur(12px)" },
      }}
      title={null}
      width={720}
    >
      <section className="health-goal-modal-shell" onClick={(event) => event.stopPropagation()}>
        <header className="health-goal-modal-shell-header">
          <div className="health-goal-modal-shell-title">
            <h2>设置健康管理目标</h2>
          </div>
          <button className="modal-close" type="button" aria-label="关闭设置目标弹窗" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 18 18"></path>
              <path d="M18 6 6 18"></path>
            </svg>
          </button>
        </header>

        <div className="health-goal-modal">
          <section className="health-goal-overview-section">
            <div className="health-goal-overview-head">
              <h3>健康管理目标概述</h3>
              <p>AI基于患者健康档案数据自动总结，支持自定义</p>
            </div>

            <TextArea
              className="ds-antd-goal-textarea"
              placeholder="请自定义数据"
              rows={4}
              value={draftOverview}
              onChange={(event) => setDraftOverview(event.target.value)}
            />
          </section>

          <div className="health-goal-overview-head health-goal-inline-head">
            <h3>重点监测指标设置</h3>
            <p>设置重点监测指标目标值，将在患者端可视化展示</p>
          </div>

          <div className="health-goal-config-layout">
            <aside className="health-goal-config-sidebar">
              <Tree
                blockNode
                className="health-goal-dimension-tree"
                defaultExpandAll
                expandedKeys={expandedKeys}
                onSelect={(selectedKeys) => {
                  const [selectedKey] = selectedKeys;
                  if (!selectedKey) {
                    return;
                  }

                  const selectedTemplate = templates.find((template) => template.id === String(selectedKey));
                  if (selectedTemplate) {
                    setActiveMetricId(selectedTemplate.id);
                  }
                }}
                selectedKeys={activeTemplate ? [activeTemplate.id] : []}
                showIcon={false}
                switcherIcon={null}
                treeData={treeData}
              />
            </aside>

            <section className="health-goal-config-detail">
              {activeTemplate ? (
                (() => {
                  const config = draftConfigMap.get(activeTemplate.id);
                  const enabled = config?.enabled ?? false;
                  const assessment = config?.currentValue
                    ? getMetricAssessment(activeTemplate, config.currentValue)
                    : null;

                  return (
                    <article className={`health-goal-metric-panel${enabled ? " is-enabled" : ""}`}>
                      <div className="health-goal-metric-panel-head">
                        <div className="health-goal-metric-panel-title">
                          <Checkbox
                            checked={enabled}
                            onChange={(event) => updateMetric(activeTemplate.id, { enabled: event.target.checked })}
                          >
                          <Typography.Text strong>{activeTemplate.label}</Typography.Text>
                          </Checkbox>
                          <Typography.Text type="secondary">{activeTemplate.level}</Typography.Text>
                        </div>
                      </div>

                      <div className="health-goal-metric-panel-fields">
                        <div className="health-goal-field-block">
                          <div className="health-goal-field-label-row">
                            <Typography.Text>现状值</Typography.Text>
                            <Tooltip title="如有数据则自动从健康档案数据提取">
                              <InfoCircleOutlined />
                            </Tooltip>
                            <Button
                              loading={loadingMetricId === activeTemplate.id}
                              size="small"
                              type="link"
                              onClick={() => refetchMetric(activeTemplate.id, activeTemplate.latestValue)}
                            >
                              重新获取
                            </Button>
                          </div>
                          <Input
                            addonAfter={activeTemplate.unit}
                            className="ds-antd-goal-input"
                            placeholder={activeTemplate.currentPlaceholder}
                            value={config?.currentValue ?? ""}
                            onChange={(event) =>
                              updateMetric(activeTemplate.id, { currentValue: event.target.value })
                            }
                          />
                          <Typography.Text className="health-goal-field-meta" type="secondary">
                            数据更新时间：{activeTemplate.latestRecordedAt}
                          </Typography.Text>
                          <div className="health-goal-field-feedback">
                            {assessment ? (
                              <Tag
                                className={`health-goal-assessment-tag tone-${assessment.tone}`}
                                bordered={false}
                              >
                                {assessment.label}
                              </Tag>
                            ) : null}
                            {!config?.currentValue ? (
                              <Typography.Text className="health-goal-field-hint" type="danger">
                                暂未提取有效数据
                              </Typography.Text>
                            ) : null}
                          </div>
                        </div>

                        <div className="health-goal-field-block">
                          <div className="health-goal-field-label-row">
                            <Typography.Text>目标基线</Typography.Text>
                            <Tooltip title="自动根据客户信息填充正常值范围，可结合实际调整">
                              <InfoCircleOutlined />
                            </Tooltip>
                          </div>
                          <Input
                            addonAfter={activeTemplate.unit}
                            className="ds-antd-goal-input"
                            readOnly
                            value={config?.targetValue || activeTemplate.baseline}
                          />
                          <div className="health-goal-field-feedback" />
                        </div>
                      </div>

                      <div className="health-goal-metric-panel-notes">
                        <Typography.Text strong>指标说明</Typography.Text>
                        <ul>
                          {activeTemplate.notes.map((note) => (
                            <li key={note}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  );
                })()
              ) : (
                <Empty description="暂无可配置指标" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </section>
          </div>

          <footer className="health-goal-modal-footer">
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={() => onSave(draftConfigs, draftOverview)}>
              保存目标
            </Button>
          </footer>
        </div>
      </section>
    </Modal>
  );
}
