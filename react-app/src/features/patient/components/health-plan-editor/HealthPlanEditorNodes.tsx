import {
  CalendarOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import Button from "antd/es/button";
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";
import Select from "antd/es/select";
import Switch from "antd/es/switch";
import type {
  HealthPlanEditorConditionNodeData,
  HealthPlanEditorTaskCategory,
  HealthPlanEditorTaskNodeData,
} from "../../../../types/healthPlanEditor";
import { healthPlanEditorContentOptions, healthPlanEditorSummaryTemplateOptions } from "../../../../data/healthPlanEditor";

type TaskNodeRuntimeData = HealthPlanEditorTaskNodeData & {
  connectedToSelectedEdge?: boolean;
  highlightedSourceHandleIds?: string[];
  highlightedTargetHandleIds?: string[];
  onChange: (patch: Partial<HealthPlanEditorTaskNodeData>) => void;
  onDelete: () => void;
};

type ConditionNodeRuntimeData = HealthPlanEditorConditionNodeData & {
  connectedToSelectedEdge?: boolean;
  highlightedSourceHandleIds?: string[];
  highlightedTargetHandleIds?: string[];
  onChangeCondition: (conditionId: string, label: string) => void;
  onAddCondition: () => void;
  onDeleteCondition: (conditionId: string) => void;
  onDelete: () => void;
};

const contentOptions = healthPlanEditorContentOptions.map((item) => ({ label: item, value: item }));
const summaryTemplateOptions = healthPlanEditorSummaryTemplateOptions.map((item) => ({ label: item, value: item }));
const { TextArea } = Input;

function getTaskCategoryIcon(category: HealthPlanEditorTaskCategory) {
  switch (category) {
    case "education":
    case "summary-report":
      return <FileTextOutlined />;
    case "medication-checkin":
      return <MedicineBoxOutlined />;
    case "follow-up":
      return <PhoneOutlined />;
    case "return-visit":
    default:
      return <CalendarOutlined />;
  }
}

export function HealthPlanStartNode() {
  return (
    <div className="health-plan-flow-start-node">
      <Handle className="health-plan-flow-start-handle" id="source" position={Position.Right} type="source" />
    </div>
  );
}

export function HealthPlanStartNodeWithHighlight({ data }: NodeProps<Node>) {
  const runtimeData = data as { connectedToSelectedEdge?: boolean; highlightedSourceHandleIds?: string[] };

  return (
    <div className={`health-plan-flow-start-node${runtimeData.connectedToSelectedEdge ? " is-edge-connected" : ""}`}>
      <Handle
        className={`health-plan-flow-start-handle${runtimeData.highlightedSourceHandleIds?.includes("source") ? " is-edge-selected" : ""}`}
        id="source"
        position={Position.Right}
        type="source"
      />
    </div>
  );
}

export function HealthPlanTaskNode({ data, selected }: NodeProps<Node>) {
  const runtimeData = data as TaskNodeRuntimeData;
  const [taskNameDraft, setTaskNameDraft] = useState(runtimeData.taskName);
  const [isTaskNameComposing, setIsTaskNameComposing] = useState(false);
  const isSummaryReport = runtimeData.category === "summary-report";
  const supportsRepeat = !isSummaryReport;
  const taskNamePlaceholder = runtimeData.category === "summary-report" ? "如“健康管理周报”" : "请输入任务名称";

  useEffect(() => {
    if (!isTaskNameComposing) {
      setTaskNameDraft(runtimeData.taskName);
    }
  }, [isTaskNameComposing, runtimeData.taskName]);

  const commitTaskNameDraft = () => {
    if (taskNameDraft !== runtimeData.taskName) {
      runtimeData.onChange({ taskName: taskNameDraft });
    }
  };

  return (
    <div
      className={`health-plan-flow-node health-plan-flow-task-node${selected ? " is-selected" : ""}${runtimeData.connectedToSelectedEdge ? " is-edge-connected" : ""}`}
    >
      <Handle
        className={`health-plan-flow-handle is-target${runtimeData.highlightedTargetHandleIds?.includes("left-target") ? " is-edge-selected" : ""}`}
        id="left-target"
        position={Position.Left}
        style={{ top: "50%" }}
        type="target"
      />

      <div className={`health-plan-node-card${runtimeData.connectedToSelectedEdge ? " is-edge-connected" : ""}`}>
        <header className="health-plan-node-head">
          <div className="health-plan-node-title-wrap">
            <span className={`health-plan-node-icon tone-${runtimeData.accent}`}>{getTaskCategoryIcon(runtimeData.category)}</span>
            <strong>{runtimeData.headerTitle}</strong>
          </div>

          <div className="health-plan-node-head-actions">
            <Button
              aria-label="删除任务"
              className="health-plan-node-action-button nodrag"
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              onClick={runtimeData.onDelete}
            />
          </div>
        </header>

        <section className="health-plan-node-section">
          <label className="health-plan-node-label" htmlFor={`task-name-${runtimeData.headerTitle}`}>
            <em>*</em> 任务名称
          </label>
          <Input
            className="nodrag nowheel"
            id={`task-name-${runtimeData.headerTitle}`}
            placeholder={taskNamePlaceholder}
            size="small"
            value={taskNameDraft}
            onBlur={commitTaskNameDraft}
            onChange={(event) => {
              const nextValue = event.target.value;
              setTaskNameDraft(nextValue);

              if (!isTaskNameComposing) {
                runtimeData.onChange({ taskName: nextValue });
              }
            }}
            onCompositionEnd={(event) => {
              const nextValue = event.currentTarget.value;
              setIsTaskNameComposing(false);
              setTaskNameDraft(nextValue);
              runtimeData.onChange({ taskName: nextValue });
            }}
            onCompositionStart={() => setIsTaskNameComposing(true)}
          />
        </section>

        {isSummaryReport ? (
          <>
            <section className="health-plan-node-section">
              <label className="health-plan-node-label" htmlFor={`task-summary-content-${runtimeData.headerTitle}`}>
                <em>*</em> 任务内容
              </label>
              <TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                className="health-plan-node-textarea nodrag nowheel"
                id={`task-summary-content-${runtimeData.headerTitle}`}
                placeholder="请输入总结内容"
                value={runtimeData.summaryContent ?? ""}
                onChange={(event) => runtimeData.onChange({ summaryContent: event.target.value })}
              />
            </section>

            <section className="health-plan-node-section">
              <label className="health-plan-node-label" htmlFor={`task-summary-template-${runtimeData.headerTitle}`}>
                <em>*</em> 选择模板
              </label>

              <div className="health-plan-node-inline-field">
                <Select
                  className="health-plan-node-select nodrag nowheel"
                  id={`task-summary-template-${runtimeData.headerTitle}`}
                  popupMatchSelectWidth={280}
                  optionFilterProp="label"
                  options={summaryTemplateOptions}
                  placeholder="请选项"
                  showSearch
                  size="small"
                  value={runtimeData.summaryTemplate ?? undefined}
                  onChange={(value) => runtimeData.onChange({ summaryTemplate: value })}
                />
                <Button aria-label="预览模板详情" className="health-plan-node-link-button nodrag" size="small" type="default">
                  预览
                </Button>
              </div>
            </section>

            <section className="health-plan-node-section health-plan-node-summary-hint-section">
              <div className="health-plan-node-summary-hint">任务开始后AI自动总结并按模板生成内容</div>
            </section>
          </>
        ) : (
          <section className="health-plan-node-section">
            <label className="health-plan-node-label" htmlFor={`task-content-${runtimeData.headerTitle}`}>
              <em>*</em> 任务内容
            </label>

            <div className="health-plan-node-inline-field">
              <Select
                className="health-plan-node-select nodrag nowheel"
                id={`task-content-${runtimeData.headerTitle}`}
                popupMatchSelectWidth={280}
                optionFilterProp="label"
                options={contentOptions}
                placeholder="请选择内容组件"
                showSearch
                size="small"
                value={runtimeData.contentLabel ?? undefined}
                onChange={(value) => runtimeData.onChange({ contentLabel: value })}
              />
              <Button
                aria-label="编辑内容模板"
                className="health-plan-node-link-button nodrag"
                icon={<DeploymentUnitOutlined />}
                size="small"
                type="default"
              />
            </div>
          </section>
        )}

        <section className="health-plan-node-section">
          <div className="health-plan-node-label">
            <em>*</em> 任务周期:
          </div>
          <div className="health-plan-node-period-line">
            计划启动后第
            <InputNumber
              className="health-plan-node-number nodrag nowheel"
              controls={false}
              min={0}
              size="small"
              value={runtimeData.startDay}
              onChange={(value) => runtimeData.onChange({ startDay: value == null ? null : Number(value) })}
            />
            天本任务开始
          </div>
          <div className="health-plan-node-period-line">
            并在
            <InputNumber
              className="health-plan-node-number nodrag nowheel"
              controls={false}
              min={1}
              size="small"
              value={runtimeData.durationDays}
              onChange={(value) => runtimeData.onChange({ durationDays: value == null ? null : Number(value) })}
            />
            天后结束
          </div>
        </section>

        {supportsRepeat ? (
          <section className="health-plan-node-section health-plan-node-repeat-section">
            <div className="health-plan-node-repeat-head">
              <span>重复执行</span>
              <Switch
                checked={runtimeData.repeatEnabled}
                className="nodrag"
                size="small"
                onChange={(checked) => runtimeData.onChange({ repeatEnabled: checked })}
              />
            </div>

            {runtimeData.repeatEnabled ? (
              <div className="health-plan-node-repeat-body">
                <div className="health-plan-node-period-line">
                  每隔
                  <InputNumber
                    className="health-plan-node-number nodrag nowheel"
                    controls={false}
                    min={1}
                    size="small"
                    value={runtimeData.repeatEveryDays}
                    onChange={(value) => runtimeData.onChange({ repeatEveryDays: value == null ? null : Number(value) })}
                  />
                  天重复一次
                </div>
                <div className="health-plan-node-period-line">
                  共重复
                  <InputNumber
                    className="health-plan-node-number nodrag nowheel"
                    controls={false}
                    min={1}
                    size="small"
                    value={runtimeData.repeatCount}
                    onChange={(value) => runtimeData.onChange({ repeatCount: value == null ? null : Number(value) })}
                  />
                  次
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

      </div>

      <Handle
        className={`health-plan-flow-handle is-source${runtimeData.highlightedSourceHandleIds?.includes("right-source") ? " is-edge-selected" : ""}`}
        id="right-source"
        position={Position.Right}
        style={{ top: "50%" }}
        type="source"
      />
    </div>
  );
}

export function HealthPlanConditionNode({ data, selected }: NodeProps<Node>) {
  const runtimeData = data as ConditionNodeRuntimeData;
  const canDeleteCondition = runtimeData.conditions.length >= 3;

  return (
    <div
      className={`health-plan-flow-node health-plan-flow-condition-node${selected ? " is-selected" : ""}${runtimeData.connectedToSelectedEdge ? " is-edge-connected" : ""}`}
    >
      <Handle
        className={`health-plan-flow-handle is-target${runtimeData.highlightedTargetHandleIds?.includes("left-target") ? " is-edge-selected" : ""}`}
        id="left-target"
        position={Position.Left}
        style={{ top: "50%" }}
        type="target"
      />

      <div className={`health-plan-node-card is-condition${runtimeData.connectedToSelectedEdge ? " is-edge-connected" : ""}`}>
        <header className="health-plan-node-head">
          <div className="health-plan-node-title-wrap">
            <span className="health-plan-node-icon tone-blue">
              <DeploymentUnitOutlined />
            </span>
            <strong>{runtimeData.headerTitle}</strong>
          </div>

          <div className="health-plan-node-head-actions">
            <Button
              aria-label="删除条件节点"
              className="health-plan-node-action-button nodrag"
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              onClick={runtimeData.onDelete}
            />
          </div>
        </header>

        <div className="health-plan-condition-list">
          {runtimeData.conditions.map((condition) => (
            <div className="health-plan-condition-item" key={condition.id}>
              <Input
                className="nodrag nowheel"
                placeholder="请输入条件内容"
                size="small"
                value={condition.label}
                onChange={(event) => runtimeData.onChangeCondition(condition.id, event.target.value)}
              />
              {canDeleteCondition ? (
                <Button
                  aria-label="删除条件选项"
                  className="health-plan-condition-delete-button nodrag"
                  icon={<DeleteOutlined />}
                  size="small"
                  type="text"
                  onClick={() => runtimeData.onDeleteCondition(condition.id)}
                />
              ) : null}
              <Handle
                className={`health-plan-flow-handle is-condition-source${runtimeData.highlightedSourceHandleIds?.includes(`source-${condition.id}`) ? " is-edge-selected" : ""}`}
                id={`source-${condition.id}`}
                position={Position.Right}
                style={{ top: "50%" }}
                type="source"
              />
            </div>
          ))}
        </div>

        <Button className="health-plan-condition-add-button nodrag" size="small" type="link" onClick={runtimeData.onAddCondition}>
          + 添加条件选项
        </Button>
      </div>
    </div>
  );
}

export const healthPlanEditorNodeTypes = {
  conditionNode: HealthPlanConditionNode,
  startNode: HealthPlanStartNodeWithHighlight,
  taskNode: HealthPlanTaskNode,
};
