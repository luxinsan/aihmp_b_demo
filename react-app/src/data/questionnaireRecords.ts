import { patientProfile } from "./patientProfile";
import type {
  QuestionnaireQuestionSnapshot,
  QuestionnaireRecord,
  QuestionnaireSummary,
} from "../types/questionnaire";

function buildRecord(
  id: string,
  formId: string,
  formName: string,
  sceneLabel: QuestionnaireRecord["scene_label"],
  submittedAt: string,
  updatedAt: string,
  questions: QuestionnaireQuestionSnapshot[],
): QuestionnaireRecord {
  const answeredCount = questions.filter((question) => {
    if (Array.isArray(question.answer)) {
      return question.answer.length > 0;
    }

    if (
      question.answer &&
      typeof question.answer === "object" &&
      "items" in question.answer
    ) {
      return question.answer.items.some((item) => item.score > 0);
    }

    if (typeof question.answer === "string") {
      return question.answer.trim().length > 0;
    }

    if (typeof question.answer === "number") {
      return true;
    }

    if (typeof question.answer === "boolean") {
      return true;
    }

    return false;
  }).length;

  const questionCount = questions.length;
  const completionRate = Math.round((answeredCount / questionCount) * 100);

  return {
    id,
    patient_id: patientProfile.identity.code,
    form_id: formId,
    form_name: formName,
    scene_label: sceneLabel,
    submitted_at: submittedAt,
    updated_at: updatedAt,
    completion_rate: completionRate,
    question_count: questionCount,
    answered_count: answeredCount,
    snapshot: {
      form_name: formName,
      scene_label: sceneLabel,
      submitted_at: submittedAt,
      completion_rate: completionRate,
      questions,
    },
  };
}

export const questionnaireRecords: QuestionnaireRecord[] = [
  buildRecord(
    "qr-001",
    "form-diabetes-foot-check",
    "糖尿病足自检表",
    "基础健康信息采集",
    "2026/04/09 09:12",
    "2026/04/09 09:12",
    [
      {
        question_id: "q-1",
        question_title: "最近一周，您是否每天监测过足部皮肤状况？",
        question_type: "single-choice",
        required: true,
        options: [
          { label: "每天检查", value: "daily" },
          { label: "偶尔检查", value: "sometimes" },
          { label: "很少检查", value: "rarely" },
          { label: "从不检查", value: "never" },
        ],
        answer: "sometimes",
        answer_text: "偶尔检查",
      },
      {
        question_id: "q-2",
        question_title: "您是否出现过以下足部问题？",
        question_type: "multiple-choice",
        required: true,
        options: [
          { label: "脚上有破皮或溃疡", value: "ulcer" },
          { label: "脚趾间发红或流水", value: "redness" },
          { label: "脚部有异常肿胀", value: "swelling" },
          { label: "脚部感觉麻木或刺痛", value: "numbness" },
          { label: "脚部有异味或分泌物", value: "secretion" },
          { label: "没有异常", value: "normal" },
        ],
        answer: ["numbness"],
        answer_text: "脚部感觉麻木或刺痛",
      },
      {
        question_id: "q-3",
        question_title: "最近一次空腹血糖值",
        question_type: "short-text",
        answer: "7.2 mmol/L",
        answer_text: "7.2 mmol/L",
      },
      {
        question_id: "q-4",
        question_title: "请描述当前足部护理习惯或特殊情况",
        question_type: "long-text",
        answer: "每天洗脚后会检查脚趾缝和足底，近期右脚前掌偶有麻木感，暂无破损渗液。",
        answer_text: "每天洗脚后会检查脚趾缝和足底，近期右脚前掌偶有麻木感，暂无破损渗液。",
      },
      {
        question_id: "q-5",
        question_title: "日常活动能力（1分表示完全不能，5分表示完全正常）",
        question_type: "rating",
        answer: {
          minLabel: "非常不满意",
          maxLabel: "非常满意",
          maxScore: 5,
          items: [
            { label: "站立10分钟", score: 3 },
            { label: "步行500米", score: 4 },
          ],
        },
        answer_text: "站立10分钟：3分；步行500米：4分",
      },
    ],
  ),
  buildRecord(
    "qr-002",
    "form-diabetes-foot-check",
    "糖尿病足自检表",
    "基础健康信息采集",
    "2026/03/12 16:18",
    "2026/03/12 16:18",
    [
      {
        question_id: "q-1",
        question_title: "最近一周，您是否每天监测过足部皮肤状况？",
        question_type: "single-choice",
        required: true,
        options: [
          { label: "每天检查", value: "daily" },
          { label: "偶尔检查", value: "sometimes" },
          { label: "很少检查", value: "rarely" },
          { label: "从不检查", value: "never" },
        ],
        answer: "daily",
        answer_text: "每天检查",
      },
      {
        question_id: "q-2",
        question_title: "您是否出现过以下足部问题？",
        question_type: "multiple-choice",
        required: true,
        options: [
          { label: "脚上有破皮或溃疡", value: "ulcer" },
          { label: "脚趾间发红或流水", value: "redness" },
          { label: "脚部有异常肿胀", value: "swelling" },
          { label: "脚部感觉麻木或刺痛", value: "numbness" },
          { label: "脚部有异味或分泌物", value: "secretion" },
          { label: "没有异常", value: "normal" },
        ],
        answer: ["normal"],
        answer_text: "没有异常",
      },
      {
        question_id: "q-3",
        question_title: "最近一次空腹血糖值",
        question_type: "short-text",
        answer: "6.8 mmol/L",
        answer_text: "6.8 mmol/L",
      },
      {
        question_id: "q-4",
        question_title: "请描述当前足部护理习惯或特殊情况",
        question_type: "long-text",
        answer: "每日洗脚后使用保湿霜，外出会避免赤脚行走，目前无不适。",
        answer_text: "每日洗脚后使用保湿霜，外出会避免赤脚行走，目前无不适。",
      },
      {
        question_id: "q-5",
        question_title: "日常活动能力（1分表示完全不能，5分表示完全正常）",
        question_type: "rating",
        answer: {
          minLabel: "非常不满意",
          maxLabel: "非常满意",
          maxScore: 5,
          items: [
            { label: "站立10分钟", score: 4 },
            { label: "步行500米", score: 5 },
          ],
        },
        answer_text: "站立10分钟：4分；步行500米：5分",
      },
    ],
  ),
  buildRecord(
    "qr-003",
    "form-chronic-history",
    "慢病与既往病史采集表",
    "基础健康信息采集",
    "2026/04/02 11:04",
    "2026/04/02 11:04",
    [
      {
        question_id: "q-1",
        question_title: "是否确诊过甲状腺相关疾病？",
        question_type: "boolean",
        answer: true,
        answer_text: "是",
      },
      {
        question_id: "q-2",
        question_title: "当前长期服用药物或补充剂",
        question_type: "short-text",
        answer: "谷维素片、褪黑素、综合消化酶",
        answer_text: "谷维素片、褪黑素、综合消化酶",
      },
      {
        question_id: "q-3",
        question_title: "家族中是否有肿瘤病史？",
        question_type: "boolean",
        answer: true,
        answer_text: "是",
      },
      {
        question_id: "q-4",
        question_title: "补充说明",
        question_type: "long-text",
        answer: null,
      },
    ],
  ),
  buildRecord(
    "qr-004",
    "form-self-sleep",
    "睡眠质量自评问卷",
    "自行健康评估",
    "2026/04/08 20:36",
    "2026/04/08 20:36",
    [
      {
        question_id: "q-1",
        question_title: "过去一周入睡困难频率",
        question_type: "single-choice",
        options: [
          { label: "从不", value: "never" },
          { label: "偶尔", value: "sometimes" },
          { label: "经常", value: "often" },
        ],
        answer: "often",
        answer_text: "经常",
      },
      {
        question_id: "q-2",
        question_title: "总体睡眠满意度",
        question_type: "rating",
        answer: 2,
        answer_text: "2 / 5",
      },
      {
        question_id: "q-3",
        question_title: "夜间觉醒后再次入睡情况",
        question_type: "single-choice",
        options: [
          { label: "容易", value: "easy" },
          { label: "一般", value: "normal" },
          { label: "困难", value: "difficult" },
        ],
        answer: null,
      },
    ],
  ),
  buildRecord(
    "qr-005",
    "form-self-sleep",
    "睡眠质量自评问卷",
    "自行健康评估",
    "2026/03/21 21:15",
    "2026/03/21 21:15",
    [
      {
        question_id: "q-1",
        question_title: "过去一周入睡困难频率",
        question_type: "single-choice",
        options: [
          { label: "从不", value: "never" },
          { label: "偶尔", value: "sometimes" },
          { label: "经常", value: "often" },
        ],
        answer: "sometimes",
        answer_text: "偶尔",
      },
      {
        question_id: "q-2",
        question_title: "总体睡眠满意度",
        question_type: "rating",
        answer: 3,
        answer_text: "3 / 5",
      },
      {
        question_id: "q-3",
        question_title: "夜间觉醒后再次入睡情况",
        question_type: "single-choice",
        options: [
          { label: "容易", value: "easy" },
          { label: "一般", value: "normal" },
          { label: "困难", value: "difficult" },
        ],
        answer: "normal",
        answer_text: "一般",
      },
    ],
  ),
  buildRecord(
    "qr-006",
    "form-self-mood",
    "情绪与压力自评问卷",
    "自行健康评估",
    "2026/03/30 08:42",
    "2026/03/30 08:42",
    [
      {
        question_id: "q-1",
        question_title: "最近两周情绪低落频率",
        question_type: "single-choice",
        options: [
          { label: "从不", value: "never" },
          { label: "数天", value: "days" },
          { label: "超过一半时间", value: "half" },
        ],
        answer: "days",
        answer_text: "数天",
      },
      {
        question_id: "q-2",
        question_title: "最近一周压力感评分",
        question_type: "rating",
        answer: 4,
        answer_text: "4 / 5",
      },
      {
        question_id: "q-3",
        question_title: "主要压力来源",
        question_type: "multiple-choice",
        options: [
          { label: "睡眠", value: "sleep" },
          { label: "健康担忧", value: "health" },
          { label: "家庭", value: "family" },
          { label: "工作", value: "work" },
        ],
        answer: ["sleep", "health"],
        answer_text: "睡眠、健康担忧",
      },
    ],
  ),
  buildRecord(
    "qr-007",
    "form-plan-diet",
    "饮食执行反馈表",
    "健康计划任务",
    "2026/04/07 18:20",
    "2026/04/07 18:20",
    [
      {
        question_id: "q-1",
        question_title: "过去 7 天是否按计划完成早餐？",
        question_type: "single-choice",
        options: [
          { label: "全部完成", value: "all" },
          { label: "部分完成", value: "partial" },
          { label: "未完成", value: "none" },
        ],
        answer: "partial",
        answer_text: "部分完成",
      },
      {
        question_id: "q-2",
        question_title: "过去 7 天含糖饮料摄入次数",
        question_type: "number",
        answer: 2,
        answer_text: "2",
      },
      {
        question_id: "q-3",
        question_title: "本周执行困难说明",
        question_type: "long-text",
        answer: null,
      },
    ],
  ),
  buildRecord(
    "qr-008",
    "form-plan-diet",
    "饮食执行反馈表",
    "健康计划任务",
    "2026/03/24 17:54",
    "2026/03/24 17:54",
    [
      {
        question_id: "q-1",
        question_title: "过去 7 天是否按计划完成早餐？",
        question_type: "single-choice",
        options: [
          { label: "全部完成", value: "all" },
          { label: "部分完成", value: "partial" },
          { label: "未完成", value: "none" },
        ],
        answer: "all",
        answer_text: "全部完成",
      },
      {
        question_id: "q-2",
        question_title: "过去 7 天含糖饮料摄入次数",
        question_type: "number",
        answer: 0,
        answer_text: "0",
      },
      {
        question_id: "q-3",
        question_title: "本周执行困难说明",
        question_type: "long-text",
        answer: "整体执行较顺利。",
        answer_text: "整体执行较顺利。",
      },
    ],
  ),
  buildRecord(
    "qr-009",
    "form-plan-exercise",
    "运动执行反馈表",
    "健康计划任务",
    "2026/04/05 19:40",
    "2026/04/05 19:40",
    [
      {
        question_id: "q-1",
        question_title: "过去 7 天运动完成天数",
        question_type: "number",
        answer: 5,
        answer_text: "5",
      },
      {
        question_id: "q-2",
        question_title: "本周完成的运动类型",
        question_type: "multiple-choice",
        options: [
          { label: "散步", value: "walk" },
          { label: "高尔夫", value: "golf" },
          { label: "力量训练", value: "strength" },
        ],
        answer: ["walk", "golf"],
        answer_text: "散步、高尔夫",
      },
      {
        question_id: "q-3",
        question_title: "本周主观运动负担感",
        question_type: "rating",
        answer: null,
      },
    ],
  ),
  buildRecord(
    "qr-010",
    "form-self-nutrition",
    "营养摄入自评问卷",
    "自行健康评估",
    "2026/04/01 10:26",
    "2026/04/01 10:26",
    [
      {
        question_id: "q-1",
        question_title: "您每天摄入蔬菜的情况",
        question_type: "single-choice",
        options: [
          { label: "每餐都有", value: "all" },
          { label: "部分餐次", value: "partial" },
          { label: "较少摄入", value: "low" },
        ],
        answer: "partial",
        answer_text: "部分餐次",
      },
      {
        question_id: "q-2",
        question_title: "您是否关注脂肪摄入类型？",
        question_type: "boolean",
        answer: true,
        answer_text: "是",
      },
      {
        question_id: "q-3",
        question_title: "请填写您常用的食用油类型",
        question_type: "short-text",
        answer: "",
      },
    ],
  ),
];

export function getQuestionnaireSummaries(patientId: string): QuestionnaireSummary[] {
  const patientRecords = questionnaireRecords
    .filter((record) => record.patient_id === patientId)
    .sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime());

  const summaryMap = new Map<string, QuestionnaireSummary>();

  patientRecords.forEach((record) => {
    const existing = summaryMap.get(record.form_id);
    if (!existing) {
      summaryMap.set(record.form_id, {
        patient_id: record.patient_id,
        form_id: record.form_id,
        form_name: record.form_name,
        scene_label: record.scene_label,
        latest_completion_rate: record.completion_rate,
        latest_updated_at: record.updated_at,
        submission_count: 1,
      });
      return;
    }

    summaryMap.set(record.form_id, {
      ...existing,
      submission_count: existing.submission_count + 1,
    });
  });

  return Array.from(summaryMap.values()).sort(
    (left, right) => new Date(right.latest_updated_at).getTime() - new Date(left.latest_updated_at).getTime(),
  );
}

export function getQuestionnaireHistory(patientId: string, formId: string) {
  return questionnaireRecords
    .filter((record) => record.patient_id === patientId && record.form_id === formId)
    .sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime());
}
