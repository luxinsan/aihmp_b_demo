import Button from "antd/es/button";
import Modal from "antd/es/modal";

type AgreementModalProps = {
  content: string;
  open: boolean;
  title: string;
  onClose: () => void;
};

export function AgreementModal({ content, open, title, onClose }: AgreementModalProps) {
  return (
    <Modal
      centered
      className="login-agreement-modal"
      footer={null}
      open={open}
      title={title}
      width={720}
      onCancel={onClose}
    >
      <div className="login-agreement-content">
        <p>{content}</p>
        <p>
          本页面当前用于前端流程演示。正式上线前应替换为经业务、法务和租户确认后的完整文本。
        </p>
        <Button className="login-agreement-confirm" type="primary" onClick={onClose}>
          我已阅读
        </Button>
      </div>
    </Modal>
  );
}
