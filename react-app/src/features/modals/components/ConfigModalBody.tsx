import { patientProfile } from "../../../data/patientProfile";
import { ModalFrame } from "../../../components/design/ModalFrame";
import { services } from "../../../data/services";
import type { DraftConfig } from "../../../types/generation";
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
  const service = services[draftConfig.serviceId];
  const dialogTitle = `AI 生成${service.label}`;
  const scopeDescription =
    draftConfig.scope === "specific"
      ? "仅纳入本次需要参考的档案资料。"
      : draftConfig.scope === "prompt"
        ? "通过自然语言描述本次需要纳入的数据范围与分析要求。"
        : "自动纳入患者全部健康数据。";

  function updateConfig(patch: Partial<DraftConfig>) {
    onDraftConfigChange({
      ...draftConfig,
      ...patch,
    });
  }

  function toggleSource(sourceId: string) {
    const current = draftConfig.selectedSourceIds;
    updateConfig({
      selectedSourceIds: current.includes(sourceId) ? current.filter((item) => item !== sourceId) : [...current, sourceId],
    });
  }

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

        <div className="config-section">
          <div className="section-title-row">
            <h3>文档名称</h3>
            <span className="sub-note" hidden>
              默认规则：报告类型 + 患者姓名 + 当前日期 + 四位随机数
            </span>
          </div>
            <label className="document-name-field" htmlFor="documentNameInput">
              <input
                id="documentNameInput"
                type="text"
                autoComplete="off"
                placeholder="请输入文档名称"
              value={draftConfig.documentName}
              onChange={(event) => updateConfig({ documentName: event.target.value })}
            />
          </label>
        </div>

        <div className="config-section config-section-scope">
          <h3>输入数据</h3>
          <div className="scope-composer">
            <ScopeModeSwitcher scope={draftConfig.scope} onChange={(scope) => updateConfig({ scope })} />
            <p className="scope-description" id="scopeDescription">
              {scopeDescription}
            </p>

            <div className="scope-prompt-field" id="scopePromptField" hidden={draftConfig.scope !== "prompt"}>
              <label className="source-search-field scope-prompt-input" htmlFor="scopePromptInput">
                <textarea
                  id="scopePromptInput"
                  autoComplete="off"
                  rows={3}
                  value={draftConfig.promptDescription}
                  onChange={(event) => updateConfig({ promptDescription: event.target.value })}
                  placeholder="如结合客户近三年的健康档案数据进行评估"
                />
              </label>
            </div>

            <div hidden={draftConfig.scope !== "specific"}>
              <SourceSelectionField
                selectedSourceIds={draftConfig.selectedSourceIds}
                onToggleSource={toggleSource}
              />
            </div>

          </div>
        </div>
    </ModalFrame>
  );
}
