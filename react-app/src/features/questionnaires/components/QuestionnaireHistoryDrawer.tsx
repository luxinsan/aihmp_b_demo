import Empty from "antd/es/empty";
import { SideDrawer480 } from "../../../components/design/SideDrawer480";
import type { QuestionnaireRecord } from "../../../types/questionnaire";

type QuestionnaireHistoryDrawerProps = {
  formName: string;
  historyRecords: QuestionnaireRecord[];
  onClose: () => void;
  onOpenDetail: (record: QuestionnaireRecord) => void;
  open: boolean;
};

export function QuestionnaireHistoryDrawer({
  formName,
  historyRecords,
  onClose,
  onOpenDetail,
  open,
}: QuestionnaireHistoryDrawerProps) {
  return (
    <SideDrawer480
      open={open}
      title="提交记录"
      withMask={false}
      onClose={onClose}
    >
      <div className="questionnaire-history">
        <div className="questionnaire-history-head">
          <h3>{formName}</h3>
          <span>共{historyRecords.length}次提交记录</span>
        </div>
        {historyRecords.length ? (
          historyRecords.map((record) => (
            <button
              className="questionnaire-history-card"
              key={record.id}
              type="button"
              onClick={() => {
                onOpenDetail(record);
                onClose();
              }}
            >
              <div className="questionnaire-history-copy">
                <strong>{record.submitted_at}</strong>
                <p>填写率 {record.completion_rate}%</p>
              </div>
              <span className="questionnaire-history-meta">查看详情</span>
            </button>
          ))
        ) : (
          <div className="questionnaire-history-empty">
            <Empty description="暂无提交记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    </SideDrawer480>
  );
}
