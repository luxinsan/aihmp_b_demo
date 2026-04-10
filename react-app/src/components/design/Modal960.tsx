import Modal from "antd/es/modal";
import type { ReactNode } from "react";
import { ModalFrame } from "./ModalFrame";

type Modal960Props = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Modal960({ children, onClose, open, title }: Modal960Props) {
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
      rootClassName="ds-antd-modal-root"
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
      width={960}
    >
      <ModalFrame
        bodyClassName="config-modal-body modal-960-body"
        className="config-modal modal-960"
        onClose={onClose}
        title={title}
      >
        {children}
      </ModalFrame>
    </Modal>
  );
}
