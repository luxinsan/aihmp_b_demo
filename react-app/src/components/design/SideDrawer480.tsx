import Drawer from "antd/es/drawer";
import type { ReactNode } from "react";

type SideDrawer480Props = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
  withMask?: boolean;
};

export function SideDrawer480({
  children,
  onClose,
  open,
  title,
  withMask = true,
}: SideDrawer480Props) {
  return (
    <Drawer
      className="ds-antd-drawer-panel"
      closeIcon={null}
      destroyOnHidden
      extra={
        <button className="modal-close" type="button" aria-label="关闭侧窗" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
      }
      footer={null}
      mask={withMask}
      onClose={onClose}
      open={open}
      placement="right"
      rootClassName="ds-antd-drawer-root"
      styles={{
        body: { padding: 0 },
        content: { background: "rgba(255, 255, 255, 0.98)" },
        header: {
          padding: "24px 28px 18px",
          borderBottom: "1px solid rgba(225, 231, 240, 0.92)",
        },
        mask: withMask
          ? { background: "rgba(15, 23, 42, 0.18)" }
          : undefined,
      }}
      title={
        <div className="ds-overlay-title-wrap">
          <h2>{title}</h2>
        </div>
      }
      width={480}
    >
      {children}
    </Drawer>
  );
}
