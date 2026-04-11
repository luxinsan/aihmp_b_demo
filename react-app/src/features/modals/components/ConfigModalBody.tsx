import { UploadOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Upload from "antd/es/upload";
import type { UploadFile, UploadProps } from "antd";
import { patientProfile } from "../../../data/patientProfile";
import { ModalFrame } from "../../../components/design/ModalFrame";
import { configTemplateOptions } from "../../../data/configOptions";
import { services } from "../../../data/services";
import type { DraftAttachment, DraftConfig } from "../../../types/generation";
import { ScopeModeSwitcher } from "./ScopeModeSwitcher";
import { SourceSelectionField } from "./SourceSelectionField";

type ConfigModalBodyProps = {
  draftConfig: DraftConfig;
  onDraftConfigChange: (nextConfig: DraftConfig) => void;
  onClose: () => void;
  onStartGeneration: () => void;
};

export function ConfigModalBody({
  draftConfig,
  onDraftConfigChange,
  onClose,
  onStartGeneration,
}: ConfigModalBodyProps) {
  const { TextArea } = Input;
  const service = services[draftConfig.serviceId];
  const dialogTitle = `AI ${service.label}`;
  const templates = configTemplateOptions[draftConfig.serviceId];
  const supportsTemplateSelection = draftConfig.serviceId === "plan";
  const supportsSourceSelection = draftConfig.serviceId === "risk";
  const supportsMeetingUpload = draftConfig.serviceId === "plan";

  function updateConfig(patch: Partial<DraftConfig>) {
    onDraftConfigChange({
      ...draftConfig,
      ...patch,
    });
  }

  function toggleSource(sourceId: string) {
    const current = draftConfig.selectedSourceIds;
    updateConfig({
      selectedSourceIds: current.includes(sourceId) ? [] : [sourceId],
    });
  }

  const uploadFileList: UploadFile[] = draftConfig.meetingFiles.map((file) => ({
    uid: file.id,
    name: file.name,
    size: file.size,
    status: "done",
  }));

  const uploadProps: UploadProps = {
    accept: ".pdf,.doc,.docx,.txt,.md",
    beforeUpload: () => false,
    fileList: uploadFileList,
    multiple: true,
    onChange: ({ fileList }) => {
      const nextFiles: DraftAttachment[] = fileList.map((file) => ({
        id: file.uid,
        name: file.name,
        size: file.size ?? 0,
      }));

      updateConfig({ meetingFiles: nextFiles });
    },
    showUploadList: {
      extra: (file) => (
        <span className="ds-upload-extra">
          {`${((file.size ?? 0) / 1024 / 1024).toFixed(2)}MB`}
        </span>
      ),
      showDownloadIcon: false,
      showPreviewIcon: false,
      showRemoveIcon: true,
    },
  };

  return (
    <ModalFrame
      closeButtonId="configClose"
      footer={(
        <footer className="config-modal-footer">
          <p className="config-hint" id="configHint" hidden>
            {""}
          </p>
          <div className="config-actions">
            <button className="primary-button" id="startDirect" type="button" onClick={onStartGeneration}>
              开始生成
            </button>
          </div>
        </footer>
      )}
      onClose={onClose}
      title={dialogTitle}
      titleId="configTitle"
    >
        <div className="config-patient-trigger">
          <span className="config-patient-badge" aria-hidden="true">AI</span>
          <div className="avatar small" id="modalAvatar">{patientProfile.identity.avatar}</div>
          <div className="config-patient-copy">
            <div className="config-patient-main">
              <strong id="modalPatientName">{patientProfile.identity.name}</strong>
              <span id="modalPatientMeta">
                {patientProfile.identity.gender} {patientProfile.identity.age}岁
              </span>
            </div>
          </div>
        </div>

        <p className="config-intro-copy">AI 助手将综合客户的多维健康数据生成内容</p>

        {supportsTemplateSelection ? (
          <div className="config-section">
            <div className="section-title-row">
              <h3>文档模板</h3>
            </div>
            <Radio.Group
              className="template-option-list"
              value={draftConfig.templateId}
              onChange={(event) => updateConfig({ templateId: event.target.value })}
            >
              {templates.map((template) => (
                <Radio
                  className="template-option-card"
                  key={template.id}
                  value={template.id}
                >
                  <span className="template-option-check" aria-hidden="true">
                    ✓
                  </span>
                  <span className="template-option-copy">
                    <strong>{template.label}</strong>
                  </span>
                </Radio>
              ))}
            </Radio.Group>
          </div>
        ) : null}

        <div className="config-section">
          <div className="section-title-row">
            <h3>文档名称</h3>
          </div>
          <Input
            autoComplete="off"
            className="ds-antd-config-input"
            id="documentNameInput"
            placeholder="请输入文档名称"
            value={draftConfig.documentName}
            onChange={(event) => updateConfig({ documentName: event.target.value })}
          />
        </div>

        {supportsSourceSelection ? (
          <div className="config-section config-section-scope">
            <h3>输入数据</h3>
            <div className="scope-composer">
              <ScopeModeSwitcher
                scope={draftConfig.sourceScope}
                onChange={(sourceScope) => updateConfig({ sourceScope, selectedSourceIds: sourceScope === "all" ? [] : draftConfig.selectedSourceIds })}
              />
              <div hidden={draftConfig.sourceScope !== "specific"}>
                <SourceSelectionField
                  selectedSourceIds={draftConfig.selectedSourceIds}
                  onToggleSource={toggleSource}
                />
              </div>
            </div>
          </div>
        ) : null}

        {supportsMeetingUpload ? (
          <div className="config-section">
            <div className="section-title-row">
              <h3>上传附件</h3>
            </div>
            <p className="config-field-hint">最多可上传5个参考文件</p>
            <div className="config-upload-shell">
              <Upload className="ds-antd-config-upload" {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传附件</Button>
              </Upload>
            </div>
          </div>
        ) : null}

        <div className="config-section">
          <div className="section-title-row">
            <h3>补充指令</h3>
          </div>
          <p className="config-field-hint">AI助手将重点结合您的补充指令进行文档生成</p>
          <TextArea
            autoComplete="off"
            className="ds-antd-config-textarea"
            id="scopePromptInput"
            rows={4}
            value={draftConfig.promptDescription}
            onChange={(event) => updateConfig({ promptDescription: event.target.value })}
            placeholder="例如：请突出异常指标与后续建议，语言更适合面向客户沟通；若涉及慢病风险，请给出更明确的随访节奏。"
          />
        </div>
    </ModalFrame>
  );
}
