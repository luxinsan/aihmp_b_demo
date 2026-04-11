export type QuestionnaireSceneLabel =
  | "基础健康信息采集"
  | "自行健康评估"
  | "健康计划任务";

export const questionnaireSceneOptions: Array<{
  label: QuestionnaireSceneLabel;
  value: QuestionnaireSceneLabel;
}> = [
  { label: "基础健康信息采集", value: "基础健康信息采集" },
  { label: "自行健康评估", value: "自行健康评估" },
  { label: "健康计划任务", value: "健康计划任务" },
];

export type QuestionnaireQuestionType =
  | "single-choice"
  | "multiple-choice"
  | "text"
  | "short-text"
  | "long-text"
  | "number"
  | "rating"
  | "boolean"
  | "date";

export type QuestionnaireOption = {
  label: string;
  value: string;
};

export type QuestionnaireRatingItemAnswer = {
  label: string;
  score: number;
};

export type QuestionnaireRatingAnswer = {
  items: QuestionnaireRatingItemAnswer[];
  maxScore: number;
  minLabel?: string;
  maxLabel?: string;
};

export type QuestionnaireQuestionSnapshot = {
  question_id: string;
  question_title: string;
  question_type: QuestionnaireQuestionType;
  options?: QuestionnaireOption[];
  answer: string | string[] | number | boolean | QuestionnaireRatingAnswer | null;
  answer_text?: string;
  required?: boolean;
};

export type QuestionnaireSnapshot = {
  form_name: string;
  scene_label: QuestionnaireSceneLabel;
  submitted_at: string;
  completion_rate: number;
  questions: QuestionnaireQuestionSnapshot[];
};

export type QuestionnaireRecord = {
  id: string;
  patient_id: string;
  form_id: string;
  form_name: string;
  scene_label: QuestionnaireSceneLabel;
  submitted_at: string;
  updated_at: string;
  completion_rate: number;
  question_count: number;
  answered_count: number;
  snapshot: QuestionnaireSnapshot;
};

export type QuestionnaireSummary = {
  patient_id: string;
  form_id: string;
  form_name: string;
  scene_label: QuestionnaireSceneLabel;
  latest_completion_rate: number;
  latest_updated_at: string;
  submission_count: number;
};
