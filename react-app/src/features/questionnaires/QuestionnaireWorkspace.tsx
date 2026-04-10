import Empty from "antd/es/empty";
import Table from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import { lazy, Suspense, useMemo, useState } from "react";
import { StandardPageFrame } from "../../components/layout/StandardPageFrame";
import { patientProfile } from "../../data/patientProfile";
import {
  getQuestionnaireHistory,
  getQuestionnaireSummaries,
} from "../../data/questionnaireRecords";
import type { QuestionnaireRecord, QuestionnaireSummary } from "../../types/questionnaire";

const QuestionnaireDetailModal = lazy(() =>
  import("./components/QuestionnaireDetailModal").then((module) => ({
    default: module.QuestionnaireDetailModal,
  })),
);

const QuestionnaireHistoryDrawer = lazy(() =>
  import("./components/QuestionnaireHistoryDrawer").then((module) => ({
    default: module.QuestionnaireHistoryDrawer,
  })),
);

export function QuestionnaireWorkspace() {
  const summaries = useMemo(
    () => getQuestionnaireSummaries(patientProfile.identity.code),
    [],
  );
  const latestRecordMap = useMemo(
    () =>
      new Map(
        summaries.map((summary) => [
          summary.form_id,
          getQuestionnaireHistory(patientProfile.identity.code, summary.form_id)[0] ?? null,
        ]),
      ),
    [summaries],
  );
  const [detailRecord, setDetailRecord] = useState<QuestionnaireRecord | null>(null);
  const [historyFormId, setHistoryFormId] = useState<string | null>(null);

  const historyRecords = historyFormId
    ? getQuestionnaireHistory(patientProfile.identity.code, historyFormId)
    : [];

  const historyFormName =
    summaries.find((summary) => summary.form_id === historyFormId)?.form_name ?? "历史提交记录";
  const activeHistoryRecordId =
    detailRecord && detailRecord.form_id === historyFormId ? detailRecord.id : historyRecords[0]?.id ?? null;

  function openDetail(record: QuestionnaireRecord) {
    setDetailRecord(record);
  }

  function openHistory(formId: string) {
    setHistoryFormId(formId);
  }

  const columns = useMemo<ColumnsType<QuestionnaireSummary>>(
    () => [
      {
        title: "量表名称",
        dataIndex: "form_name",
        key: "form_name",
        render: (value: QuestionnaireSummary["form_name"]) => (
          <span className="questionnaire-primary-text">{value}</span>
        ),
      },
      {
        title: "来源场景",
        dataIndex: "scene_label",
        key: "scene_label",
      },
      {
        title: "填写率",
        dataIndex: "latest_completion_rate",
        key: "latest_completion_rate",
        width: 120,
        render: (value: QuestionnaireSummary["latest_completion_rate"]) => `${value}%`,
      },
      {
        title: "最近更新时间",
        dataIndex: "latest_updated_at",
        key: "latest_updated_at",
        width: 180,
      },
      {
        title: "操作",
        key: "action",
        align: "right",
        width: 180,
        render: (_: unknown, record: QuestionnaireSummary) => {
          const latestRecord = latestRecordMap.get(record.form_id) ?? null;

          return (
            <div className="questionnaire-row-actions">
              <button
                className="questionnaire-action-link"
                type="button"
                onClick={() => latestRecord && openDetail(latestRecord)}
              >
                查看详情
              </button>
              <button
                className="questionnaire-action-link"
                type="button"
                onClick={() => openHistory(record.form_id)}
              >
                提交记录
              </button>
            </div>
          );
        },
      },
    ],
    [latestRecordMap],
  );

  return (
    <>
      <StandardPageFrame className="questionnaire-panel" title="量表记录">
        <div className="questionnaire-table-shell">
          <Table<QuestionnaireSummary>
            className="questionnaire-antd-table"
            columns={columns}
            dataSource={summaries}
            locale={{
              emptyText: (
                <Empty
                  description="暂无量表记录"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={false}
            rowKey="form_id"
          />
        </div>
      </StandardPageFrame>

      <Suspense fallback={null}>
        <QuestionnaireDetailModal
          onClose={() => setDetailRecord(null)}
          record={detailRecord}
        />
      </Suspense>

      <Suspense fallback={null}>
        <QuestionnaireHistoryDrawer
          activeRecordId={activeHistoryRecordId}
          formName={historyFormName}
          historyRecords={historyRecords}
          onClose={() => setHistoryFormId(null)}
          onOpenDetail={openDetail}
          open={Boolean(historyFormId)}
        />
      </Suspense>
    </>
  );
}
