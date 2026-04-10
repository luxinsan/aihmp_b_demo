import { Modal960 } from "../../../components/design/Modal960";
import type {
  QuestionnaireOption,
  QuestionnaireRatingAnswer,
  QuestionnaireQuestionSnapshot,
  QuestionnaireRecord,
} from "../../../types/questionnaire";

function isRatingAnswer(
  answer: QuestionnaireQuestionSnapshot["answer"],
): answer is QuestionnaireRatingAnswer {
  return Boolean(answer && typeof answer === "object" && "items" in answer);
}

function isAnswered(question: QuestionnaireQuestionSnapshot) {
  if (Array.isArray(question.answer)) {
    return question.answer.length > 0;
  }

  if (isRatingAnswer(question.answer)) {
    return question.answer.items.some((item) => item.score > 0);
  }

  if (typeof question.answer === "string") {
    return question.answer.trim().length > 0;
  }

  if (typeof question.answer === "number" || typeof question.answer === "boolean") {
    return true;
  }

  return false;
}

function isOptionSelected(
  question: QuestionnaireQuestionSnapshot,
  option: QuestionnaireOption,
) {
  if (Array.isArray(question.answer)) {
    return question.answer.indexOf(option.value) !== -1;
  }

  return question.answer === option.value;
}

function renderChoiceOptions(question: QuestionnaireQuestionSnapshot) {
  if (!question.options?.length) {
    return null;
  }

  return (
    <div className="questionnaire-option-list">
      {question.options.map((option) => (
        <div
          className={`questionnaire-option-item${
            isOptionSelected(question, option) ? " is-selected" : ""
          }`}
          key={option.value}
        >
          <span
            className={`questionnaire-option-indicator questionnaire-option-indicator--${
              question.question_type === "multiple-choice" ? "checkbox" : "radio"
            }`}
            aria-hidden="true"
          />
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}

function renderRatingAnswer(answer: QuestionnaireRatingAnswer) {
  const scores = Array.from({ length: answer.maxScore }, (_, index) => index + 1);

  return (
    <div className="questionnaire-rating">
      <div className="questionnaire-rating-scale">
        <span>{answer.minLabel ?? "低"}</span>
        <span>{answer.maxLabel ?? "高"}</span>
      </div>
      <div className="questionnaire-rating-list">
        {answer.items.map((item) => (
          <div className="questionnaire-rating-item" key={item.label}>
            <strong>{item.label}</strong>
            <div className="questionnaire-rating-stars" aria-label={`${item.label} ${item.score}分`}>
              {scores.map((score) => (
                <span
                  className={`questionnaire-rating-star${score <= item.score ? " is-active" : ""}`}
                  key={score}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderAnswer(question: QuestionnaireQuestionSnapshot) {
  if (Array.isArray(question.answer)) {
    return (
      <div className="questionnaire-answer-tags">
        {question.answer.map((item) => (
          <span className="questionnaire-answer-tag" key={item}>
            {question.options?.find((option) => option.value === item)?.label ?? item}
          </span>
        ))}
      </div>
    );
  }

  if (isRatingAnswer(question.answer)) {
    return renderRatingAnswer(question.answer);
  }

  if (typeof question.answer === "boolean") {
    return (
      <div className="questionnaire-answer-field questionnaire-answer-field--short">
        <strong>{question.answer ? "是" : "否"}</strong>
      </div>
    );
  }

  if (typeof question.answer === "number") {
    return (
      <div className="questionnaire-answer-field questionnaire-answer-field--short">
        <strong>{question.answer}</strong>
      </div>
    );
  }

  if (question.question_type === "long-text") {
    return (
      <div className="questionnaire-answer-field questionnaire-answer-field--long">
        <span>{question.answer_text || (typeof question.answer === "string" ? question.answer : "未填写")}</span>
      </div>
    );
  }

  return (
    <div className="questionnaire-answer-field questionnaire-answer-field--short">
      <span>{question.answer_text || (typeof question.answer === "string" ? question.answer : "未填写")}</span>
    </div>
  );
}

type QuestionnaireDetailModalProps = {
  onClose: () => void;
  record: QuestionnaireRecord | null;
};

export function QuestionnaireDetailModal({
  onClose,
  record,
}: QuestionnaireDetailModalProps) {
  return (
    <Modal960
      open={Boolean(record)}
      title="填写详情"
      onClose={onClose}
    >
      {record ? (
        <div className="questionnaire-detail">
          <div className="questionnaire-detail-toolbar">
            <div className="questionnaire-detail-meta-band">
              <article>
                <span>来源场景</span>
                <strong>{record.scene_label}</strong>
              </article>
              <article>
                <span>填写率</span>
                <strong>{record.completion_rate}%</strong>
              </article>
              <article>
                <span>最近更新时间</span>
                <strong>{record.updated_at}</strong>
              </article>
              <article>
                <span>题目数量</span>
                <strong>{record.question_count} 题</strong>
              </article>
            </div>
          </div>
          <div className="questionnaire-detail-hero">
            <h3>{record.form_name}</h3>
            <p>
              专为患者健康管理场景设计的量表记录，本次展示的是最近一次已提交的填写快照，
              可用于查看量表作答内容、回看健康评估结果与后续追踪。
            </p>
          </div>

          <div className="questionnaire-detail-list">
            {record.snapshot.questions.map((question, index) => (
              <article className="questionnaire-question-card" key={question.question_id}>
                <div className="questionnaire-question-head">
                  <span>Q{index + 1}</span>
                  <div className="questionnaire-question-copy">
                    <strong>
                      {question.required ? <i>*</i> : null}
                      {question.question_title}
                    </strong>
                  </div>
                </div>
                {(question.question_type === "single-choice" ||
                  question.question_type === "multiple-choice") &&
                question.options?.length ? (
                  <div className="questionnaire-question-section">
                    {renderChoiceOptions(question)}
                  </div>
                ) : null}
                <div className="questionnaire-question-section">
                  <div
                    className={`questionnaire-question-answer${
                      isAnswered(question) ? "" : " is-empty"
                    }`}
                  >
                    {renderAnswer(question)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </Modal960>
  );
}
