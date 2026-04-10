import type { ReactNode } from "react";

type ModalFrameProps = {
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  closeButtonId?: string;
  footer?: ReactNode;
  onClose: () => void;
  title: string;
  titleId?: string;
};

export function ModalFrame({
  bodyClassName = "config-modal-body",
  children,
  className = "config-modal",
  closeButtonId,
  footer,
  onClose,
  title,
  titleId,
}: ModalFrameProps) {
  return (
    <section
      className={className}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={titleId ? undefined : title}
      onClick={(event) => event.stopPropagation()}
    >
      <header className="config-modal-header">
        <div className="config-head">
          <h2 id={titleId}>{title}</h2>
        </div>
        <button
          className="modal-close"
          id={closeButtonId}
          type="button"
          aria-label="关闭配置弹窗"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
      </header>
      <div className={bodyClassName}>{children}</div>
      {footer}
    </section>
  );
}
