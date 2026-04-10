type ModalLauncherPanelProps = {
  onClear: () => void;
  onOpenConfig: () => void;
  onOpenPreview: () => void;
};

export function ModalLauncherPanel({
  onClear,
  onOpenConfig,
  onOpenPreview,
}: ModalLauncherPanelProps) {
  return (
    <article className="migration-panel">
      <div className="modal-launchers">
        <button className="primary-button" type="button" onClick={onOpenConfig}>
          打开配置弹窗
        </button>
        <button className="secondary-button react-secondary" type="button" onClick={onOpenPreview}>
          打开预览弹窗
        </button>
        <button className="ghost-button react-secondary" type="button" onClick={onClear}>
          清空弹窗状态
        </button>
      </div>
      <p className="muted">
        当前 React 版本已经统一了三种核心弹窗类型，后续只需要把真正的业务内容逐步替换进去。
      </p>
    </article>
  );
}
