import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Alert from "antd/es/alert";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Tabs from "antd/es/tabs";
import { useState } from "react";
import type { AccountType, LoginFormValues, LoginTenantConfig } from "../types/login";

type PasswordLoginFormProps = {
  config: LoginTenantConfig;
  errorMessage: string;
  loading: boolean;
  onOpenAgreement: (kind: "userAgreement" | "privacyPolicy") => void;
  onSubmit: (values: LoginFormValues) => void;
};

const accountTypeItems = [
  { key: "phone", label: "手机号" },
  { key: "employeeNo", label: "工号" },
];

function normalizeNumericInput(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export function PasswordLoginForm({
  config,
  errorMessage,
  loading,
  onOpenAgreement,
  onSubmit,
}: PasswordLoginFormProps) {
  const [form] = Form.useForm<LoginFormValues>();
  const [accountType, setAccountType] = useState<AccountType>("phone");

  return (
    <div className="login-form-panel">
      <div className="login-form-brand">
        {config.logoUrl ? (
          <img alt={config.tenantName} src={config.logoUrl} />
        ) : (
          <div className="login-logo-placeholder is-form">租户 Logo 占位</div>
        )}
      </div>

      <Form
        autoComplete="off"
        className="password-login-form"
        form={form}
        initialValues={{ accountType, agreed: false }}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => onSubmit({ ...values, accountType })}
      >
        <Tabs
          activeKey={accountType}
          className="login-account-tabs"
          items={accountTypeItems}
          onChange={(key) => {
            const nextType = key as AccountType;
            setAccountType(nextType);
            form.setFieldsValue({ accountType: nextType, account: "" });
            form.setFields([{ name: "account", errors: [] }]);
          }}
        />

        {errorMessage ? (
          <Alert className="login-error-alert" message={errorMessage} showIcon type="error" />
        ) : null}

        <Form.Item
          name="account"
          rules={
            accountType === "phone"
              ? [
                  { required: true, message: "请输入手机号" },
                  { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
                ]
              : [
                  { required: true, message: "请输入工号" },
                  { pattern: /^\d{1,20}$/, message: "工号仅支持 20 位以内数字" },
                ]
          }
        >
          <Input
            allowClear
            className="login-input"
            inputMode="numeric"
            maxLength={accountType === "phone" ? 11 : 20}
            placeholder={accountType === "phone" ? "请输入手机号" : "请输入工号"}
            prefix={<UserOutlined />}
            size="large"
            onChange={(event) => {
              const maxLength = accountType === "phone" ? 11 : 20;
              const nextValue = normalizeNumericInput(event.target.value, maxLength);
              form.setFieldsValue({ account: nextValue });
            }}
          />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password
            className="login-input"
            placeholder="请输入密码"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          className="login-agreement-item"
          name="agreed"
          rules={[
            {
              validator: (_, checked) =>
                checked
                  ? Promise.resolve()
                  : Promise.reject(new Error("请先阅读并同意用户协议与隐私政策")),
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox>
            我已阅读并同意
            <button
              className="login-agreement-link"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onOpenAgreement("userAgreement");
              }}
            >
              {config.userAgreementTitle}
            </button>
            、
            <button
              className="login-agreement-link"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onOpenAgreement("privacyPolicy");
              }}
            >
              {config.privacyPolicyTitle}
            </button>
          </Checkbox>
        </Form.Item>

        <Button block className="login-submit-button" htmlType="submit" loading={loading} size="large" type="primary">
          立即登录
        </Button>
      </Form>

      <p className="login-form-hint">测试账号：手机号 13411111111 多院区；工号 2001001 单院区；密码：123456</p>
    </div>
  );
}
