import { useCallback, useEffect, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import Card from "antd/es/card";
import Col from "antd/es/col";
import Form from "antd/es/form";
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";
import Modal from "antd/es/modal";
import Row from "antd/es/row";
import Select from "antd/es/select";
import Space from "antd/es/space";
import TimePicker from "antd/es/time-picker";
import message from "antd/es/message";
import dayjs, { type Dayjs } from "dayjs";

type CheckinCycleType = "daily" | "weekly";

type CheckinPushStrategy = {
  relative_day: number | null;
  push_time: string;
  push_message: string;
};

type CheckinScenario = {
  scenario_label: string;
  push_strategies: CheckinPushStrategy[];
};

export type CheckinConfigValue = {
  service_id: string;
  base_rule: {
    cycle_type: CheckinCycleType;
    checkin_frequency: number;
  };
  scenarios: CheckinScenario[];
};

type CheckinConfigFormValue = {
  service_id: string;
  base_rule: {
    cycle_type: CheckinCycleType;
    checkin_frequency: number;
  };
  scenarios: Array<{
    scenario_label: string;
    push_strategies: Array<{
      relative_day: number | null;
      push_time: Dayjs | null;
      push_message: string;
    }>;
  }>;
};

type CheckinConfigModalProps = {
  open?: boolean;
  visible?: boolean;
  initialValues?: CheckinConfigValue | null;
  onCancel: () => void;
  onOk?: (values: CheckinConfigValue) => void;
};

const serviceTypeOptions = [
  { label: "饮食", value: "diet" },
  { label: "体重", value: "weight" },
  { label: "饮水", value: "water" },
  { label: "运动", value: "exercise" },
  { label: "用药", value: "medication" },
  { label: "其他", value: "other" },
];

const cycleTypeOptions = [
  { label: "每日", value: "daily" },
  { label: "每周", value: "weekly" },
];

const weeklyDayOptions = Array.from({ length: 7 }, (_, index) => ({
  label: `第${index + 1}天`,
  value: index + 1,
}));

const createEmptyPushStrategy = () => ({
  relative_day: null as number | null,
  push_time: null as Dayjs | null,
  push_message: "",
});

const createEmptyScenario = () => ({
  scenario_label: "",
  push_strategies: [createEmptyPushStrategy()],
});

const defaultModalValues: CheckinConfigFormValue = {
  service_id: "diet",
  base_rule: {
    cycle_type: "daily",
    checkin_frequency: 1,
  },
  scenarios: [createEmptyScenario()],
};

function toFormValues(values?: CheckinConfigValue | null): CheckinConfigFormValue {
  if (!values) {
    return defaultModalValues;
  }

  const checkinFrequency = Math.max(1, Number(values.base_rule?.checkin_frequency ?? 1));
  const scenarios = values.scenarios?.map((scenario) => ({
    scenario_label: scenario.scenario_label ?? "",
    push_strategies:
      scenario.push_strategies?.length > 0
        ? scenario.push_strategies.map((strategy) => ({
            relative_day: strategy.relative_day ?? null,
            push_time: strategy.push_time ? dayjs(strategy.push_time, "HH:mm") : null,
            push_message: strategy.push_message ?? "",
          }))
        : [createEmptyPushStrategy()],
  })) ?? [];

  while (scenarios.length < checkinFrequency) {
    scenarios.push(createEmptyScenario());
  }

  return {
    service_id: values.service_id ?? "diet",
    base_rule: {
      cycle_type: values.base_rule?.cycle_type ?? "daily",
      checkin_frequency: checkinFrequency,
    },
    scenarios,
  };
}

function toSubmitValues(values: CheckinConfigFormValue): CheckinConfigValue {
  const cycleType = values.base_rule.cycle_type;

  return {
    service_id: values.service_id,
    base_rule: {
      cycle_type: cycleType,
      checkin_frequency: Math.max(1, Number(values.base_rule.checkin_frequency ?? 1)),
    },
    scenarios: (values.scenarios ?? []).map((scenario) => ({
      scenario_label: (scenario.scenario_label ?? "").trim(),
      push_strategies: (scenario.push_strategies ?? []).map((strategy) => ({
        relative_day: cycleType === "weekly" ? strategy.relative_day ?? null : null,
        push_time: strategy.push_time?.format("HH:mm") ?? "",
        push_message: (strategy.push_message ?? "").trim(),
      })),
    })),
  };
}

export function CheckinConfigModal({
  open,
  visible,
  initialValues,
  onCancel,
  onOk,
}: CheckinConfigModalProps) {
  const [form] = Form.useForm<CheckinConfigFormValue>();
  const resolvedOpen = open ?? visible ?? false;
  const isEditMode = Boolean(initialValues);
  const checkinFrequency = Form.useWatch(["base_rule", "checkin_frequency"], form) ?? 1;
  const cycleType = Form.useWatch(["base_rule", "cycle_type"], form) ?? "daily";
  const scenarioCount = Math.max(1, Number(checkinFrequency || 1));

  useEffect(() => {
    if (!resolvedOpen) {
      return;
    }
    form.setFieldsValue(toFormValues(initialValues));
  }, [form, initialValues, resolvedOpen]);

  useEffect(() => {
    if (!resolvedOpen) {
      return;
    }
    const currentScenarios = form.getFieldValue("scenarios") ?? [];
    const nextScenarios = Array.from({ length: scenarioCount }, (_, index) => {
      const currentScenario = currentScenarios[index];
      if (!currentScenario) {
        return createEmptyScenario();
      }
      if (!currentScenario.push_strategies?.length) {
        return { ...currentScenario, push_strategies: [createEmptyPushStrategy()] };
      }
      return currentScenario;
    });

    if (currentScenarios.length !== nextScenarios.length) {
      form.setFieldValue("scenarios", nextScenarios);
    }
  }, [form, resolvedOpen, scenarioCount]);

  useEffect(() => {
    if (!resolvedOpen || cycleType !== "daily") {
      return;
    }
    const currentScenarios = form.getFieldValue("scenarios") ?? [];
    const nextScenarios = currentScenarios.map((scenario: CheckinConfigFormValue["scenarios"][number]) => ({
      ...scenario,
      push_strategies: (scenario.push_strategies ?? []).map((strategy) => ({
        ...strategy,
        relative_day: null,
      })),
    }));
    form.setFieldValue("scenarios", nextScenarios);
  }, [cycleType, form, resolvedOpen]);

  const handleSubmit = useCallback(async () => {
    const validatedValues = await form.validateFields();
    const submitValues = toSubmitValues(validatedValues);
    console.log("[CheckinConfigModal] submit values", submitValues);
    onOk?.(submitValues);
    message.success("配置保存成功");
  }, [form, onOk]);

  const scenarioIndices = useMemo(() => Array.from({ length: scenarioCount }, (_, index) => index), [scenarioCount]);

  return (
    <Modal
      centered
      className="ds-modal-content-viewport"
      destroyOnHidden
      title="打卡任务配置"
      width={960}
      open={resolvedOpen}
      onCancel={onCancel}
      onOk={handleSubmit}
      cancelText="取消"
      okText="确定"
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        className="health-plan-checkin-config-modal-form"
      >
        <Form.Item
          label="打卡类型"
          name="service_id"
          rules={[{ required: true, message: "请选择业务类型" }]}
          className="health-plan-checkin-config-modal-type"
        >
          <Select options={serviceTypeOptions} disabled={isEditMode} placeholder="请选择业务类型" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="打卡周期"
              name={["base_rule", "cycle_type"]}
              rules={[{ required: true, message: "请选择打卡周期" }]}
            >
              <Select options={cycleTypeOptions} placeholder="请选择打卡周期" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="要求次数 N"
              name={["base_rule", "checkin_frequency"]}
              rules={[{ required: true, message: "请输入要求次数" }]}
            >
              <InputNumber min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <div className="health-plan-checkin-config-modal-cards">
          {scenarioIndices.map((scenarioIndex) => (
            <Card
              key={scenarioIndex}
              type="inner"
              title={`打卡场景 ${scenarioIndex + 1}`}
              className="health-plan-checkin-scenario-card"
            >
              <Form.Item
                label="场景标签"
                name={["scenarios", scenarioIndex, "scenario_label"]}
                rules={[{ required: true, message: "请输入场景标签" }]}
              >
                <Input placeholder="例如：早餐 / 空腹 / 饮水目标" />
              </Form.Item>

              <Form.List
                name={["scenarios", scenarioIndex, "push_strategies"]}
                rules={[
                  {
                    validator: async (_, value) => {
                      if (!value || value.length < 1) {
                        return Promise.reject(new Error("请至少添加一条推送策略"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <div className="health-plan-checkin-push-list">
                    {fields.map((field, rowIndex) => (
                      <div key={field.key} className="health-plan-checkin-push-row">
                        {cycleType === "weekly" ? (
                          <Form.Item
                            label="推送日期"
                            name={[field.name, "relative_day"]}
                            className="health-plan-checkin-push-day"
                            rules={[{ required: true, message: "请选择推送日期" }]}
                          >
                            <Select options={weeklyDayOptions} placeholder="选择日期" />
                          </Form.Item>
                        ) : null}
                        <Form.Item
                          label="推送时间"
                          name={[field.name, "push_time"]}
                          className="health-plan-checkin-push-time"
                          rules={[{ required: true, message: "请选择推送时间" }]}
                        >
                          <TimePicker format="HH:mm" minuteStep={5} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                          label="推送文案"
                          name={[field.name, "push_message"]}
                          className="health-plan-checkin-push-message"
                          rules={[{ required: true, message: "请输入推送文案" }]}
                        >
                          <Input placeholder="请输入推送文案" maxLength={60} />
                        </Form.Item>
                        <div className="health-plan-checkin-push-remove-wrap">
                          <Button type="link" danger disabled={fields.length <= 1} onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        </div>
                        {rowIndex < fields.length - 1 ? <div className="health-plan-checkin-push-divider" /> : null}
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => add(createEmptyPushStrategy())}
                    >
                      添加推送策略
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </div>
                )}
              </Form.List>
            </Card>
          ))}
        </div>
      </Form>
    </Modal>
  );
}
