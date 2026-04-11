import Empty from "antd/es/empty";
import { lazy, Suspense, useMemo, useState } from "react";
import { SearchField } from "../../components/design/SearchField";
import { SelectField } from "../../components/design/SelectField";
import { StandardPageFrame } from "../../components/layout/StandardPageFrame";
import { patientProfile } from "../../data/patientProfile";
import {
  getQuestionnaireHistory,
  getQuestionnaireSummaries,
} from "../../data/questionnaireRecords";
import {
  questionnaireSceneOptions,
  type QuestionnaireRecord,
  type QuestionnaireSceneLabel,
} from "../../types/questionnaire";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sceneFilter, setSceneFilter] = useState<QuestionnaireSceneLabel | undefined>(undefined);
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
  const filteredSummaries = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    return summaries.filter((summary) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        summary.form_name.toLowerCase().includes(normalizedKeyword);
      const matchesScene = !sceneFilter || summary.scene_label === sceneFilter;

      return matchesKeyword && matchesScene;
    });
  }, [sceneFilter, searchKeyword, summaries]);

  function openDetail(record: QuestionnaireRecord) {
    setDetailRecord(record);
  }

  function openHistory(formId: string) {
    setHistoryFormId(formId);
  }

  return (
    <>
      <StandardPageFrame
        className="questionnaire-panel"
        description="展示当前患者已填写并提交的量表记录和详情"
        title="量表记录"
      >
        <div className="questionnaire-filters">
          <SearchField
            placeholder="搜索量表名称"
            value={searchKeyword}
            onChange={setSearchKeyword}
          />
          <SelectField<QuestionnaireSceneLabel>
            options={questionnaireSceneOptions}
            placeholder="来源场景"
            value={sceneFilter}
            onChange={setSceneFilter}
          />
        </div>
        <div className="questionnaire-table-shell">
          {filteredSummaries.length === 0 ? (
            <div className="questionnaire-card-empty">
              <Empty
                description="暂无符合条件的量表记录"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <div className="questionnaire-card-list">
              {filteredSummaries.map((summary) => {
                const latestRecord = latestRecordMap.get(summary.form_id) ?? null;

                return (
                  <article className="questionnaire-summary-card" key={summary.form_id}>
                    <header className="questionnaire-summary-head">
                      <span className="questionnaire-summary-decor" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      <div className="questionnaire-summary-title-wrap">
                        <h3 className="questionnaire-summary-title">{summary.form_name}</h3>
                      </div>
                    </header>
                    <div className="questionnaire-summary-rate">已填写 {summary.latest_completion_rate}%</div>
                    <div className="questionnaire-summary-info">
                      <p>
                        来源场景：{summary.scene_label}
                      </p>
                      <p>
                        更新时间：{summary.latest_updated_at}
                      </p>
                    </div>
                    <div className="questionnaire-summary-actions">
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
                        onClick={() => openHistory(summary.form_id)}
                      >
                        提交记录
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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
