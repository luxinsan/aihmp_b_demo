const patientProfile = {
  identity: {
    name: "陈小楠",
    maskedName: "陈*",
    avatar: "陈",
    gender: "女",
    age: 60,
    code: "SZ2410010001",
    phone: "130 0000 0000",
    idCard: "440522********0002",
  },
  archive: {
    maritalStatus: "已婚",
    fertilityStatus: "已育",
    education: "/",
    birthplace: "/",
    residence: "深圳",
    currentIllness: "桥本甲状腺炎",
    medicationHistory:
      "氯雷他定（偶尔，晚上咳嗽不舒服时）、乙酰天麻素片（偶尔，替代谷维素片）、谷维素片（100mg/片，偶尔，帮助睡眠）、褪黑素（4 月份开始每日）、免疫细胞、干细胞、中药、生物同源性荷尔蒙等（零期）",
    supplementHistory:
      "综合消化酶（1 片/次）、甘氨酸、胆汁流动支持（1 片/次）、氨糖（1500mg）、硫酸软骨素钠、椰皮素（1 片/次）、N-乙酰半胱氨酸 NAC（8 克，1000mg/片）、NMN、L-谷氨酰胺、锌硒维生素（每 2 片含锌 15mg，硒 200mcg，另含多种维生素与植物成分）、维生素 C（100mg/片，2 片/次）",
    medicalHistory: "疱疹",
    familyHistory: "父亲肝癌",
    diet: "规律用餐，每餐 8 成饱；蔬菜较少；常用油为土榨菜籽油",
    sleep: "睡眠 6-7 小时，偶有失眠",
    exercise: "散步：每周 5 次以上，平均每天 6000 步以上；高尔夫：每周 5 次以上，每次 60 分钟以上",
    smokingHistory: "已戒烟 5 年",
    drinkingHistory: "/",
    mentalHealth: "曾确诊轻度抑郁、焦虑症",
    otherNotes: "自诉咽部长期不适影响睡眠",
    height: "181.4cm",
    weight: "71.2kg",
    bmi: "21.6",
    heartRate: "67 次/min",
    waist: "85cm",
    hip: "98cm",
    waistHipRatio: "0.87",
    bloodPressure: "129/78mmHg",
  },
};

const patientIdentity = patientProfile.identity;
const patientArchive = patientProfile.archive;

function getPatientMetaText() {
  return `${patientIdentity.gender} ${patientIdentity.age}岁`;
}

const services = {
  "risk-basic": {
    label: "健康风险评估",
    category: "健康风险评估",
    description: "识别患者当前健康风险、异常指标与重点危险因素，输出结构化的风险评估文档。",
    brief: "面向健康档案解读与慢病管理场景，聚焦患者体检异常与风险判断，输出正式可交付的健康风险评估文档。",
    coverLine: "春意盎然的健康人生",
    coverEn: "HEALTHY LIFE",
    bodyIntro:
      "本报告围绕患者近期病历资料、随访记录与体检指标进行综合研判，帮助医护团队快速识别主要风险暴露点，并形成结构化评估结论。",
    blocks: [
      {
        title: "前言",
        paragraphs: [
          "当前患者存在体重管理、代谢异常与生活方式不规律等叠加风险。通过对近期体检报告、随访记录和既往干预方案的交叉分析，可见其心血管代谢负担正处于需要尽早干预的阶段。",
        ],
      },
      {
        title: "重要信息",
        paragraphs: ["1. 当前主要风险识别"],
        bullets: [
          "空腹血糖与甘油三酯持续偏高，提示代谢综合征风险正在增加。",
          "BMI 超出理想范围，伴随久坐与睡眠不足，长期会进一步推高心血管风险。",
          "近期随访中出现间歇性胸闷主诉，建议结合心电检查进一步排查。",
        ],
      },
      {
        title: "风险等级与依据",
        paragraphs: [
          "综合评估结果显示：代谢风险等级为中高，心血管事件风险等级为中。主要依据包括血脂谱异常、腰围超标、运动不足以及近期症状反馈。",
        ],
      },
      {
        title: "后续随访安排",
        paragraphs: [
          "建议第 2 周复核关键实验室指标，第 4 周回顾生活方式执行情况，第 8 周输出阶段性风险复评结果，并根据新数据动态调整管理动作。",
        ],
      },
    ],
  },
  risk: {
    label: "健康风险评估报告及建议",
    category: "健康风险评估报告及建议",
    description: "识别患者当前健康风险、异常指标与重点危险因素，输出正式交付版评估与建议文档。",
    brief: "面向健康档案解读与慢病管理场景，聚焦患者体检异常、风险判断与后续干预建议，输出正式可交付的健康风险评估文档。",
    coverLine: "春意盎然的健康人生",
    coverEn: "HEALTHY LIFE",
    bodyIntro:
      "本报告围绕患者近期病历资料、随访记录与体检指标进行综合研判，帮助医护团队快速识别主要风险暴露点，并形成可执行的管理建议。",
    blocks: [
      {
        title: "前言",
        paragraphs: [
          "当前患者存在体重管理、代谢异常与生活方式不规律等叠加风险。通过对近期体检报告、随访记录和既往干预方案的交叉分析，可见其心血管代谢负担正处于需要尽早干预的阶段。",
        ],
      },
      {
        title: "重要信息",
        paragraphs: ["1. 当前主要风险识别"],
        bullets: [
          "空腹血糖与甘油三酯持续偏高，提示代谢综合征风险正在增加。",
          "BMI 超出理想范围，伴随久坐与睡眠不足，长期会进一步推高心血管风险。",
          "近期随访中出现间歇性胸闷主诉，建议结合心电检查进一步排查。",
        ],
      },
      {
        title: "风险等级与依据",
        paragraphs: [
          "综合评估结果显示：代谢风险等级为中高，心血管事件风险等级为中。主要依据包括血脂谱异常、腰围超标、运动不足以及近期症状反馈。",
        ],
      },
      {
        title: "管理建议",
        bullets: [
          "建议 2 周内完成空腹血糖、糖化血红蛋白及血脂四项复查。",
          "启动 6 周体重与睡眠联合干预，优先建立规律作息和稳定运动节奏。",
          "如胸闷症状持续或频次增加，应尽快安排心电图及专科评估。",
        ],
      },
      {
        title: "后续随访安排",
        paragraphs: [
          "建议第 2 周复核关键实验室指标，第 4 周回顾生活方式执行情况，第 8 周输出阶段性风险复评结果，并根据新数据动态调整管理动作。",
        ],
      },
    ],
  },
  plan: {
    label: "健康管理方案",
    category: "健康管理方案",
    description: "围绕患者当前风险等级、依从性和既往随访结果，生成阶段性健康管理方案。",
    brief: "以患者随访和体检结果为基础，整理阶段性干预目标、执行动作与复盘节点，形成医护可直接交付的健康管理方案。",
    coverLine: "春意盎然的健康人生",
    coverEn: "HEALTHY LIFE",
    bodyIntro:
      "本方案将患者当前健康风险、依从性表现与近期随访结果统一纳入评估，形成一份可执行、可追踪、可复盘的阶段性健康管理计划。",
    blocks: [
      {
        title: "前言",
        paragraphs: [
          "本次方案聚焦体重控制、代谢改善和睡眠节律建立三项核心目标，强调在可执行的日常场景中逐步改善长期指标暴露与干预依从性。",
        ],
      },
      {
        title: "阶段目标",
        paragraphs: ["1. 未来 8 周管理重点"],
        bullets: [
          "第 1-2 周完成基线评估补齐，建立饮食、睡眠与运动记录。",
          "第 3-5 周强化生活方式干预，观察体重、睡眠和主诉变化。",
          "第 6-8 周根据复查结果优化管理强度，形成阶段总结。",
        ],
      },
      {
        title: "执行建议",
        bullets: [
          "每周至少 4 次 30 分钟中等强度运动，优先快走或固定自行车。",
          "建立 23:00 前入睡目标，减少晚间高糖或高脂加餐。",
          "每周固定一次线上随访，重点追踪胸闷、睡眠、体重和用药依从性。",
        ],
      },
      {
        title: "风险提醒",
        paragraphs: [
          "如出现持续胸闷、心悸或血糖异常波动，应及时暂停当前强化运动计划，并安排医生复评。医护团队在每轮随访中应主动追问上述异常信号。",
        ],
      },
      {
        title: "效果评估方式",
        paragraphs: [
          "建议以体重变化、血脂复查结果、睡眠时长稳定性与随访执行率作为本轮方案的主要评估指标，用于判断方案是否达成阶段目标。",
        ],
      },
    ],
  },
  exam: {
    label: "体检报告解读",
    category: "体检报告解读",
    description: "根据患者当前体检结果与健康档案，生成正式的体检报告解读文档。",
    brief: "结合体检报告、病历资料与随访情况，对本次体检结果进行结构化解读，形成贴近患者交付场景的正式文档。",
    coverLine: "春意盎然的健康人生",
    coverEn: "HEALTHY LIFE",
    bodyIntro:
      "本报告基于患者本次体检结果及既往健康档案进行解读，帮助医护团队快速归纳异常指标含义、风险方向与后续建议，形成可对外交付的正式文档。",
    blocks: [
      {
        title: "前言",
        paragraphs: [
          "体检报告不仅用于识别单项异常，更重要的是帮助患者理解这些数据背后的健康趋势。本次解读将围绕代谢、心血管与生活方式相关指标展开，帮助明确下一步重点关注方向。",
        ],
      },
      {
        title: "重点信息",
        paragraphs: ["1. 主要异常指标解读"],
        bullets: [
          "空腹血糖偏高，提示糖代谢负担增加，建议结合饮食、运动和复查进一步判断是否存在持续异常。",
          "甘油三酯及总胆固醇处于偏高区间，提示血脂管理需要尽快纳入日常健康计划。",
          "腰围及 BMI 超出理想范围，说明当前体重控制仍是后续干预重点。",
        ],
      },
      {
        title: "风险提示",
        paragraphs: [
          "如长期不控制体重、血脂和血糖，上述异常可能进一步增加心脑血管事件风险。现阶段虽然尚未见到严重器质性结论，但已具备需要尽早干预的典型特征。",
        ],
      },
      {
        title: "建议措施",
        bullets: [
          "建议 2-4 周内复查空腹血糖、糖化血红蛋白与血脂四项。",
          "近期以减盐、控制精制糖摄入、规律运动和保证睡眠时长为核心干预动作。",
          "如伴随胸闷、心悸等主诉，建议同步安排心电图等进一步检查。",
        ],
      },
      {
        title: "医护随访建议",
        paragraphs: [
          "建议在后续随访中重点追踪患者体重变化、运动执行率、饮食结构调整情况以及复查结果，用于判断本次体检异常是否得到有效控制。",
        ],
      },
    ],
  },
};

const sourceReports = [
  { id: "exam-2026-q1", name: "2026 Q1 入院体检报告", meta: "2026/03/28 · 128 项指标 · 入院体检" },
  { id: "review-2026-followup", name: "2026/03 随访复查摘要", meta: "2026/03/23 · 线上随访 · 复查摘要" },
  { id: "exam-2025-annual", name: "2025 年度体检报告", meta: "2025/12/19 · 年度归档 · 常规体检" },
  { id: "exam-2025-cardiac", name: "2025 心血管专项检查", meta: "2025/11/06 · 专项检查 · 心电与血脂" },
  { id: "exam-2025-metabolism", name: "2025 代谢复查报告", meta: "2025/09/14 · 复查报告 · 血糖与肝肾" },
  { id: "exam-2025-physical", name: "2025 入职体检报告", meta: "2025/08/03 · 入职体检 · 常规项目" },
  { id: "exam-2024-q4", name: "2024 Q4 慢病随访体检", meta: "2024/12/08 · 随访体检 · 慢病管理" },
];

const riskAdviceAttachmentTemplate = {
  coverTitle: "健康风险评估报告及建议",
  coverCode: "SZ2504010001",
  coverDate: "2025年5月19日",
  tocItems: [
    { text: "一、前言", page: "1" },
    { text: "二、健康档案信息", page: "2" },
    { text: "三、体检报告解读及建议", page: "4" },
    { text: "四、历年体检异常指标对比", page: "6" },
    { text: "五、体检异常项解读", page: "9" },
    { text: "5.1 血脂异常", page: "9", depth: 1 },
    { text: "5.2 桥本甲状腺炎、甲状腺多发结节", page: "9", depth: 1 },
    { text: "5.3 糖化血红蛋白 5.7%", page: "10", depth: 1 },
    { text: "5.4 血抗β糖蛋白1抗体偏高", page: "10", depth: 1 },
    { text: "5.5 EB病毒阳性", page: "11", depth: 1 },
    { text: "六、健康风险评估及建议", page: "12" },
    { text: "6.1 重大疾病风险评估", page: "12", depth: 1 },
    { text: "6.2 生活方式指数评估", page: "12", depth: 1 },
    { text: "七、生活方式改善建议", page: "14" },
    { text: "7.1 饮食建议", page: "14", depth: 1 },
    { text: "7.2 环境重金属管理建议", page: "17", depth: 1 },
    { text: "八、免责声明", page: "18" },
  ],
  profileItems: [
    ["姓名", patientIdentity.name],
    ["性别", patientIdentity.gender],
    ["年龄", `${patientIdentity.age}岁`],
    ["婚姻状况", patientArchive.maritalStatus],
    ["生育状况", patientArchive.fertilityStatus],
    ["常住地", patientArchive.residence],
    ["现病史", patientArchive.currentIllness],
    ["家族史", patientArchive.familyHistory],
  ],
  lifestyleItems: [
    ["睡眠", patientArchive.sleep],
    ["运动", "散步、高尔夫等中低强度运动"],
    ["血压", patientArchive.bloodPressure],
    ["身高 / 体重 / BMI", `${patientArchive.height.replace("cm", " cm")} / ${patientArchive.weight.replace("kg", " kg")} / ${patientArchive.bmi}`],
  ],
  archiveTable: {
    basicInfoRows: [
      [["姓名", patientIdentity.name], ["性别", patientIdentity.gender], ["年龄", String(patientIdentity.age)], ["婚姻状况", patientArchive.maritalStatus]],
      [["生育状况", patientArchive.fertilityStatus], ["文化程度", patientArchive.education], ["出生地", patientArchive.birthplace], ["常住地", patientArchive.residence]],
    ],
    healthInfoRows: [
      { label: "现病史", value: patientArchive.currentIllness },
      {
        label: "用药史",
        value: patientArchive.medicationHistory,
      },
      {
        label: "营养补充剂",
        value: patientArchive.supplementHistory,
      },
      { label: "既往病史", value: patientArchive.medicalHistory },
      { label: "家族史", value: patientArchive.familyHistory },
    ],
    lifestyleRows: [
      { label: "饮食情况", value: patientArchive.diet },
      { label: "睡眠情况", value: patientArchive.sleep },
      { label: "运动情况", value: patientArchive.exercise },
    ],
    smokingDrinking: [
      ["吸烟史", patientArchive.smokingHistory],
      ["饮酒史", patientArchive.drinkingHistory],
    ],
    psych: patientArchive.mentalHealth,
    other: patientArchive.otherNotes,
    physiologyRows: [
      [["身高", patientArchive.height], ["体重", patientArchive.weight], ["BMI", patientArchive.bmi], ["心率", patientArchive.heartRate]],
      [["腰围", patientArchive.waist], ["臀围", patientArchive.hip], ["腰臀比", patientArchive.waistHipRatio], ["血压", patientArchive.bloodPressure]],
    ],
  },
  comparisonHeaders: ["指标", "2023", "2024", "2025", "趋势"],
  comparisonRows: [
    ["空腹血糖", "5.5", "5.6", "5.7", "持续升高"],
    ["总胆固醇", "5.38", "5.62", "5.79", "偏高"],
    ["甘油三酯", "1.64", "1.88", "2.06", "波动升高"],
    ["TSH", "2.61", "3.44", "4.12", "升高"],
    ["糖化血红蛋白", "5.5%", "5.6%", "5.7%", "临界偏高"],
    ["抗β糖蛋白1抗体", "阴性", "轻度升高", "偏高", "需随访"],
  ],
};

const referenceMetricsByService = {
  risk: [
    { label: "空腹血糖", value: "6.9 mmol/L", flag: "偏高", abnormal: true },
    { label: "甘油三酯", value: "2.41 mmol/L", flag: "偏高", abnormal: true },
    { label: "BMI", value: "27.3", flag: "超重", abnormal: true },
    { label: "收缩压", value: "148 mmHg", flag: "偏高", abnormal: true },
    { label: "睡眠时长", value: "5.8 小时", flag: "不足", abnormal: true },
    { label: "每周运动", value: "1 次", flag: "偏低", abnormal: true },
  ],
  plan: [
    { label: "体重", value: "81 kg", flag: "需控制", abnormal: true },
    { label: "腰围", value: "96 cm", flag: "偏高", abnormal: true },
    { label: "睡眠节律", value: "23:50-06:00", flag: "不稳定", abnormal: true },
    { label: "运动依从性", value: "42%", flag: "待提升", abnormal: true },
    { label: "饮食记录", value: "最近 7 天", flag: "已同步", abnormal: false },
  ],
  exam: [
    { label: "空腹血糖", value: "6.9 mmol/L", flag: "偏高", abnormal: true },
    { label: "总胆固醇", value: "5.92 mmol/L", flag: "偏高", abnormal: true },
    { label: "甘油三酯", value: "2.41 mmol/L", flag: "偏高", abnormal: true },
    { label: "腰围", value: "96 cm", flag: "超标", abnormal: true },
    { label: "心电图", value: "窦性心律", flag: "建议结合主诉复核", abnormal: false },
  ],
};

const stageDefinitions = [
  { id: "read", label: "读取健康档案", desc: "汇总患者基础资料" },
  { id: "parse", label: "数据解析", desc: "解析体检指标与病历" },
  { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息" },
  { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板" },
  { id: "generate", label: "内容生成", desc: "组织报告草稿内容" },
  { id: "layout", label: "文档排版", desc: "生成正式文档版式" },
  { id: "complete", label: "完成输出", desc: "进入可视化编辑" },
];

const baseAgents = [
  { id: "requirement", name: "需求理解 Agent", note: "等待任务", status: "pending" },
  { id: "archive-read", name: "档案数据读取 Agent", note: "等待任务", status: "pending" },
  { id: "archive-parse", name: "档案数据解析 Agent", note: "等待任务", status: "pending" },
  { id: "data-validate", name: "必要数据校验 Agent", note: "等待任务", status: "pending" },
  { id: "knowledge", name: "知识库检索 Agent", note: "等待任务", status: "pending" },
  { id: "risk", name: "健康风险评估 Agent", note: "等待任务", status: "pending" },
  { id: "lifestyle", name: "生活方式评估 Agent", note: "等待任务", status: "pending" },
  { id: "essential8", name: "生命八要素评估 Agent", note: "等待任务", status: "pending" },
  { id: "advice", name: "健康建议 Agent", note: "等待任务", status: "pending" },
  { id: "compose", name: "文档内容编排 Agent", note: "等待任务", status: "pending" },
  { id: "quality", name: "内容质量检验 Agent", note: "等待任务", status: "pending" },
];

let reports = [
  { id: "seed-1", title: `${patientIdentity.maskedName} · 90天健康管理方案`, subtitle: "90天健康管理方案", serviceId: "plan", status: "未发布", tone: "unpublished", date: "2026/03/31", content: "" },
  { id: "seed-2", title: `${patientIdentity.maskedName} · 90天健康管理方案`, subtitle: "90天健康管理方案", serviceId: "plan", status: "已发布", tone: "published", date: "2026/03/28", content: "" },
  { id: "seed-3", title: `${patientIdentity.maskedName} · 健康风险评估报告`, subtitle: "健康风险评估报告", serviceId: "risk", status: "未发布", tone: "unpublished", date: "2026/03/31", content: "" },
  { id: "seed-4", title: `${patientIdentity.maskedName} · 健康风险评估报告与建议`, subtitle: "健康风险评估报告与建议", serviceId: "risk", status: "已发布", tone: "published", date: "2026/03/27", content: "" },
  { id: "seed-5", title: `${patientIdentity.maskedName} · 体检方案`, subtitle: "体检方案", serviceId: "exam", status: "未发布", tone: "unpublished", date: "2026/03/26", content: "" },
  { id: "seed-6", title: `${patientIdentity.maskedName} · 健康风险评估报告`, subtitle: "健康风险评估报告", serviceId: "risk", status: "未发布", tone: "unpublished", date: "2026/03/24", content: "" },
  { id: "seed-7", title: `${patientIdentity.maskedName} · 体检方案`, subtitle: "体检方案", serviceId: "exam", status: "已发布", tone: "published", date: "2026/03/20", content: "" },
  { id: "seed-8", title: `${patientIdentity.maskedName} · 健康风险评估报告与建议`, subtitle: "健康风险评估报告与建议", serviceId: "risk", status: "未发布", tone: "unpublished", date: "2026/03/18", content: "" },
  { id: "seed-9", title: `${patientIdentity.maskedName} · 健康风险评估报告`, subtitle: "健康风险评估报告", serviceId: "risk", status: "已发布", tone: "published", date: "2025/04/10", content: "" },
];

let backgroundJobs = [];
let currentServiceId = null;
let activeSession = null;
let sessionSeed = 0;
let currentScope = "all";
let selectedSourceIds = new Set();
let activeEditableBlock = null;
let activeSelectionRange = null;
let currentInsertionBlock = null;
let activeTableCell = null;
let currentPreviewReportId = null;
let currentChartBlock = null;
let pendingActionConfirm = null;
let editorHistory = [];
let editorHistoryIndex = -1;
let editorSnapshotTimer = null;

const refs = {
  listScreen: document.querySelector("#listScreen"),
  reportGrid: document.querySelector("#reportGrid"),
  reportTemplate: document.querySelector("#reportCardTemplate"),
  aiButton: document.querySelector("#aiButton"),
  aiMenu: document.querySelector("#aiMenu"),
  menuItems: document.querySelectorAll(".ai-menu-item"),
  floatingJobs: document.querySelector("#floatingJobs"),
  jobsToggle: document.querySelector("#jobsToggle"),
  jobsPanel: document.querySelector("#jobsPanel"),
  jobsCount: document.querySelector("#jobsCount"),
  jobsHeadline: document.querySelector("#jobsHeadline"),
  jobsSubline: document.querySelector("#jobsSubline"),
  jobsList: document.querySelector("#jobsList"),
  jobItemTemplate: document.querySelector("#jobItemTemplate"),
  configModal: document.querySelector("#configModal"),
  configClose: document.querySelector("#configClose"),
  startDirect: document.querySelector("#startDirect"),
  configTitle: document.querySelector("#configTitle"),
  configDescription: document.querySelector("#configDescription"),
  configHint: document.querySelector("#configHint"),
  reportSourceList: document.querySelector("#reportSourceList"),
  scopePromptField: document.querySelector("#scopePromptField"),
  scopeSwitcher: document.querySelector("#scopeSwitcher"),
  scopeDescription: document.querySelector("#scopeDescription"),
  scopePromptInput: document.querySelector("#scopePromptInput"),
  selectedSourceCount: document.querySelector("#selectedSourceCount"),
  sourceSearchInput: document.querySelector("#sourceSearchInput"),
  sourceResults: document.querySelector("#sourceResults"),
  documentNameInput: document.querySelector("#documentNameInput"),
  patientAvatar: document.querySelector("#patientAvatar"),
  patientName: document.querySelector("#patientName"),
  patientMetaText: document.querySelector("#patientMetaText"),
  patientPhone: document.querySelector("#patientPhone"),
  patientIdCard: document.querySelector("#patientIdCard"),
  modalPatientName: document.querySelector("#modalPatientName"),
  modalPatientMeta: document.querySelector("#modalPatientMeta"),
  modalAvatar: document.querySelector("#modalAvatar"),
  generationScreen: document.querySelector("#generationScreen"),
  generationTitle: document.querySelector("#generationTitle"),
  generationMeta: document.querySelector("#generationMeta"),
  generationModeLabel: document.querySelector("#generationModeLabel"),
  selectedDataScope: document.querySelector("#selectedDataScope"),
  generationPatientName: document.querySelector("#generationPatientName"),
  generationPatientMeta: document.querySelector("#generationPatientMeta"),
  referenceSources: document.querySelector("#referenceSources"),
  referenceMetrics: document.querySelector("#referenceMetrics"),
  overallProgressBar: document.querySelector("#overallProgressBar"),
  overallProgressText: document.querySelector("#overallProgressText"),
  overallStatusText: document.querySelector("#overallStatusText"),
  stageStrip: document.querySelector("#stageStrip"),
  processLog: document.querySelector("#processLog"),
  documentCanvas: document.querySelector("#documentCanvas"),
  saveDocument: document.querySelector("#saveDocument"),
  backToList: document.querySelector("#backToList"),
  stopGeneration: document.querySelector("#stopGeneration"),
  thinkingPanel: document.querySelector("#thinkingPanel"),
  thinkingBriefToggle: document.querySelector("#thinkingBriefToggle"),
  thinkingBriefText: document.querySelector("#thinkingBriefText"),
  thinkingBriefDetail: document.querySelector("#thinkingBriefDetail"),
  selectionToolbar: document.querySelector("#selectionToolbar"),
  textStyleTrigger: document.querySelector("#textStyleTrigger"),
  textStyleLabel: document.querySelector("#textStyleLabel"),
  textStyleMenu: document.querySelector("#textStyleMenu"),
  textStyleItems: document.querySelectorAll("[data-style-value]"),
  alignTrigger: document.querySelector("#alignTrigger"),
  alignLabel: document.querySelector("#alignLabel"),
  alignMenu: document.querySelector("#alignMenu"),
  alignItems: document.querySelectorAll("[data-align-value]"),
  orderedList: document.querySelector("#orderedList"),
  unorderedList: document.querySelector("#unorderedList"),
  textColorSelect: document.querySelector("#textColorSelect"),
  highlightColorSelect: document.querySelector("#highlightColorSelect"),
  blockInserter: document.querySelector("#blockInserter"),
  blockInserterToggle: document.querySelector("#blockInserterToggle"),
  blockInserterMenu: document.querySelector("#blockInserterMenu"),
  blockInserterItems: document.querySelectorAll(".block-inserter-item"),
  tableToolbar: document.querySelector("#tableToolbar"),
  addRow: document.querySelector("#addRow"),
  addCol: document.querySelector("#addCol"),
  deleteRow: document.querySelector("#deleteRow"),
  deleteCol: document.querySelector("#deleteCol"),
  mergeCell: document.querySelector("#mergeCell"),
  imageUploadInput: document.querySelector("#imageUploadInput"),
  toastStack: document.querySelector("#toastStack"),
  previewModal: document.querySelector("#previewModal"),
  previewTitle: document.querySelector("#previewTitle"),
  previewStatus: document.querySelector("#previewStatus"),
  previewDate: document.querySelector("#previewDate"),
  previewCanvas: document.querySelector("#previewCanvas"),
  previewClose: document.querySelector("#previewClose"),
  previewCancel: document.querySelector("#previewCancel"),
  previewEdit: document.querySelector("#previewEdit"),
  chartDataModal: document.querySelector("#chartDataModal"),
  chartDataClose: document.querySelector("#chartDataClose"),
  chartDataCancel: document.querySelector("#chartDataCancel"),
  chartDataExtract: document.querySelector("#chartDataExtract"),
  chartDataSave: document.querySelector("#chartDataSave"),
  chartDataTableBody: document.querySelector("#chartDataTableBody"),
  chartDataTitle: document.querySelector("#chartDataTitle"),
  saveConfirmModal: document.querySelector("#saveConfirmModal"),
  saveConfirmClose: document.querySelector("#saveConfirmClose"),
  saveConfirmCancel: document.querySelector("#saveConfirmCancel"),
  saveConfirmSubmit: document.querySelector("#saveConfirmSubmit"),
  actionConfirmModal: document.querySelector("#actionConfirmModal"),
  actionConfirmTitle: document.querySelector("#actionConfirmTitle"),
  actionConfirmMessage: document.querySelector("#actionConfirmMessage"),
  actionConfirmDetail: document.querySelector("#actionConfirmDetail"),
  actionConfirmClose: document.querySelector("#actionConfirmClose"),
  actionConfirmCancel: document.querySelector("#actionConfirmCancel"),
  actionConfirmSubmit: document.querySelector("#actionConfirmSubmit"),
  sectionTriggers: document.querySelectorAll(".section-trigger"),
};

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function formatChineseDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

function compactDate(date = new Date()) {
  return formatDate(date).replaceAll("/", "");
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function showToast(title, message, action = null) {
  if (!refs.toastStack) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-copy">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;

  if (action?.label) {
    const button = document.createElement("button");
    button.className = "toast-action";
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      action.onClick?.();
      toast.remove();
    });
    toast.appendChild(button);
  }

  refs.toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

function getReferenceMetrics(config) {
  return referenceMetricsByService[config.serviceId] || referenceMetricsByService.risk;
}

function renderReferenceData(config) {
  refs.referenceSources.innerHTML = "";
  if (refs.referenceMetrics) {
    refs.referenceMetrics.innerHTML = "";
  }

  const sourceFragment = document.createDocumentFragment();
  config.selectedSources.forEach((source) => {
    const chip = document.createElement("span");
    chip.className = "reference-source-chip";
    chip.textContent = source;
    sourceFragment.appendChild(chip);
  });
  refs.referenceSources.appendChild(sourceFragment);

  if (refs.referenceMetrics) {
    const metricsFragment = document.createDocumentFragment();
    getReferenceMetrics(config).forEach((metric) => {
      const item = document.createElement("article");
      item.className = `metric-card${metric.abnormal ? " abnormal" : ""}`;
      item.innerHTML = `
        <strong>${escapeHtml(metric.label)}</strong>
        <span class="metric-value">${escapeHtml(metric.value)}</span>
        <span class="metric-flag">${escapeHtml(metric.flag)}</span>
      `;
      metricsFragment.appendChild(item);
    });
    refs.referenceMetrics.appendChild(metricsFragment);
  }
}

function buildJobSteps(config) {
  const sourceLabel =
    config.scope === "all"
      ? "患者全量健康数据"
      : config.scope === "prompt"
        ? "自然语言描述指定的数据范围"
        : `${config.selectedSources.length} 份档案资料`;
  return [
    `正在读取 ${patientIdentity.name} 的 ${sourceLabel}...`,
    "正在解析病历摘要与异常指标...",
    "正在匹配慢病干预知识库与模板结构...",
    "正在撰写最终报告草稿...",
    "正在校正文档版式与重点高亮...",
    "即将完成，请前往审阅...",
  ];
}

function inferReportServiceId(report) {
  if (report.serviceId && services[report.serviceId]) {
    return report.serviceId;
  }

  const source = `${report.title || ""} ${report.subtitle || ""}`;
  if (source.includes("健康管理")) {
    return "plan";
  }

  if (source.includes("体检")) {
    return "exam";
  }

  return "risk";
}

function getReportCardTitle(report) {
  const rawTitle = (report.title || "").trim();
  const strippedPrefix = rawTitle.replace(/^[^·]+ ·\s*/, "").trim();
  const strippedPatient = strippedPrefix
    .replace(new RegExp(`-${patientIdentity.name}-\\d{8}-\\d{4}$`), "")
    .replace(new RegExp(`-${patientIdentity.maskedName}-\\d{8}-\\d{4}$`), "")
    .trim();

  if (strippedPatient) {
    return strippedPatient;
  }

  return report.subtitle || services[inferReportServiceId(report)]?.label || "报告文档";
}

function getReportStatus(report) {
  return report.status === "已发布" ? "已发布" : "未发布";
}

function getReportTone(report) {
  return getReportStatus(report) === "已发布" ? "published" : "unpublished";
}

function getReportVisualType(report) {
  const title = `${report.title || ""} ${report.subtitle || ""}`;

  if (title.includes("90天健康管理方案")) {
    return "plan-90";
  }

  if (title.includes("体检方案")) {
    return "exam-plan";
  }

  if (title.includes("报告与建议") || title.includes("报告及建议")) {
    return "risk-advice";
  }

  if (title.includes("健康风险评估报告") || title.includes("风险评估报告")) {
    return "risk";
  }

  if (report.serviceId === "exam") {
    return "exam-plan";
  }

  if (report.serviceId === "plan") {
    return "plan-90";
  }

  return "risk";
}

function getReportIconSvg(visualType) {
  if (visualType === "plan-90") {
    return `
      <svg viewBox="0 0 24 24">
        <path d="M7 4.75h7.4l3.1 3.08V18a2 2 0 0 1-2 2H7.8a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2Z"></path>
        <path d="M14.4 4.85V8h3.05"></path>
        <path d="M8.4 10h6.4"></path>
        <path d="M8.4 13h4.5"></path>
        <path d="m8.4 16.1 1.3 1.25 2.4-2.7"></path>
      </svg>
    `;
  }

  if (visualType === "exam-plan") {
    return `
      <svg viewBox="0 0 24 24">
        <rect x="4.75" y="5.25" width="14.5" height="13.5" rx="3"></rect>
        <path d="M8 9h8"></path>
        <path d="M8 12.5h5"></path>
        <path d="M8 16h4"></path>
        <path d="M15.2 13.7h3.1"></path>
        <path d="M16.75 12.15v3.1"></path>
      </svg>
    `;
  }

  if (visualType === "risk-advice") {
    return `
      <svg viewBox="0 0 24 24">
        <path d="M12 4.75 18.3 7.1v5.05c0 4-2.42 6.62-6.3 8.15-3.88-1.53-6.3-4.15-6.3-8.15V7.1L12 4.75Z"></path>
        <path d="M8.75 12.4h2.35l1.2-2.2 1.4 4.4 1.2-2.2h1.95"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24">
      <path d="M12 4.75 18.3 7.1v5.05c0 4-2.42 6.62-6.3 8.15-3.88-1.53-6.3-4.15-6.3-8.15V7.1L12 4.75Z"></path>
      <path d="M12 8.7v5.8"></path>
      <path d="M9.15 11.6H14.85"></path>
      <circle cx="12" cy="15.95" r="0.9"></circle>
    </svg>
  `;
}

function sanitizeFilename(value) {
  return (value || "report").replace(/[\\/:*?"<>|]+/g, "-");
}

function renderEditableNode(tagName, className, text) {
  return `<${tagName} class="${className} editable-block" contenteditable="false">${escapeHtml(text)}</${tagName}>`;
}

function renderEditableList(items, ordered = false) {
  const tagName = ordered ? "ol" : "ul";
  return `<${tagName} class="doc-list template-list">${items
    .map((item) => `<li class="editable-block" contenteditable="false">${escapeHtml(item)}</li>`)
    .join("")}</${tagName}>`;
}

function renderRichLine(segments) {
  return `
    <p class="attachment-rich-line editable-block" contenteditable="false">
      ${segments
        .map((segment) => {
          if (typeof segment === "string") {
            return escapeHtml(segment);
          }
          return `<span class="risk-tone risk-tone-${segment.tone || "normal"}">${escapeHtml(segment.text)}</span>`;
        })
        .join("")}
    </p>
  `;
}

function renderRichLines(lines) {
  return `<div class="attachment-rich-lines">${lines.map((line) => renderRichLine(line)).join("")}</div>`;
}

function renderAttachmentInfoGrid(items) {
  return `
    <div class="attachment-info-grid">
      ${items
        .map(
          ([label, value]) => `
            <div class="attachment-info-item">
              <span>${escapeHtml(label)}</span>
              <strong class="editable-block" contenteditable="false">${escapeHtml(value)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAttachmentMetricRows(items) {
  return `
    <div class="attachment-inline-metrics">
      ${items
        .map(
          ([label, value]) => `
            <div class="attachment-inline-item">
              <span>${escapeHtml(label)}</span>
              <strong class="editable-block" contenteditable="false">${escapeHtml(value)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderArchiveKvCells(items) {
  return items
    .map(
      ([label, value]) => `
        <td class="archive-kv-cell editable-block" contenteditable="false">
          <span class="archive-kv-label">${escapeHtml(label)}：</span>
          <strong>${escapeHtml(value)}</strong>
        </td>
      `,
    )
    .join("");
}

function renderArchiveSectionRows(rows) {
  return rows
    .map(
      (row) => `
        <tr>
          <th class="archive-side-label">${escapeHtml(row.label)}</th>
          <td class="archive-side-value editable-block" contenteditable="false" colspan="3">${escapeHtml(row.value)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderAttachmentProfileTable(table) {
  return `
    <div class="attachment-table-wrap attachment-profile-table-wrap">
      <table class="attachment-table attachment-profile-table">
        <tbody>
          <tr><th class="archive-section-head" colspan="4">基本信息</th></tr>
          ${table.basicInfoRows.map((row) => `<tr>${renderArchiveKvCells(row)}</tr>`).join("")}
          <tr><th class="archive-section-head" colspan="4">健康信息</th></tr>
          ${renderArchiveSectionRows(table.healthInfoRows)}
          <tr><th class="archive-section-head" colspan="4">生活习惯</th></tr>
          ${renderArchiveSectionRows(table.lifestyleRows)}
          <tr>
            <td class="archive-kv-cell editable-block" contenteditable="false" colspan="2">
              <span class="archive-kv-label">${escapeHtml(table.smokingDrinking[0][0])}：</span>
              <strong>${escapeHtml(table.smokingDrinking[0][1])}</strong>
            </td>
            <td class="archive-kv-cell editable-block" contenteditable="false" colspan="2">
              <span class="archive-kv-label">${escapeHtml(table.smokingDrinking[1][0])}：</span>
              <strong>${escapeHtml(table.smokingDrinking[1][1])}</strong>
            </td>
          </tr>
          <tr>
            <td class="archive-full-row editable-block" contenteditable="false" colspan="4">
              <span class="archive-kv-label">心理健康：</span>
              <strong>${escapeHtml(table.psych)}</strong>
            </td>
          </tr>
          <tr>
            <td class="archive-full-row editable-block" contenteditable="false" colspan="4">
              <span class="archive-kv-label">其他：</span>
              <strong>${escapeHtml(table.other)}</strong>
            </td>
          </tr>
          <tr><th class="archive-section-head" colspan="4">生理指标</th></tr>
          ${table.physiologyRows.map((row) => `<tr>${renderArchiveKvCells(row)}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAttachmentTable(headers, rows) {
  return `
    <div class="attachment-table-wrap">
      <table class="attachment-table">
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  ${row
                    .map((cell) => `<td class="editable-block" contenteditable="false">${escapeHtml(cell)}</td>`)
                    .join("")}
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildRiskAdviceAttachmentHtml() {
  const tocItems = riskAdviceAttachmentTemplate.tocItems
    .map(
      (item) => `
        <li${item.depth ? ` data-depth="${item.depth}"` : ""}>
          <span>${escapeHtml(item.text)}</span>
          <span>${escapeHtml(item.page)}</span>
        </li>
      `,
    )
    .join("");

  return `
    <section class="pdf-page pdf-cover pdf-cover-attachment">
      <span class="cover-bird" aria-hidden="true"></span>
      <span class="cover-flower top" aria-hidden="true"></span>
      <span class="cover-flower bottom" aria-hidden="true"></span>
      <div class="cover-content cover-content-attachment">
        <p class="cover-mark editable-block" contenteditable="false">守护</p>
        <p class="cover-tagline editable-block" contenteditable="false">春意盎然的健康人生</p>
        <p class="cover-sub editable-block" contenteditable="false">HEALTHY LIFE</p>
        <p class="cover-document-name cover-document-name-attachment editable-block" contenteditable="false">${escapeHtml(
          riskAdviceAttachmentTemplate.coverTitle,
        )}</p>
      </div>
      <div class="cover-lower">
        <div class="cover-meta cover-meta-attachment">
          <p class="editable-block" contenteditable="false">用户编号：${escapeHtml(riskAdviceAttachmentTemplate.coverCode)}</p>
          <p class="editable-block" contenteditable="false">日期：${escapeHtml(riskAdviceAttachmentTemplate.coverDate)}</p>
        </div>
        <div class="cover-brand">
          春晓健康
          <span>CHUNXIAO HEALTH</span>
        </div>
      </div>
    </section>

    <section class="pdf-page pdf-toc pdf-toc-attachment">
      <div class="toc-header">
        <h2 class="editable-block" contenteditable="false">目录</h2>
      </div>
      <ol class="toc-list toc-list-attachment">
        ${tocItems}
      </ol>
    </section>

    <section class="pdf-page pdf-body attachment-page">
      <section class="doc-section attachment-section attachment-archive-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">一、前言</h3>
        <div class="doc-section-body">
          <p class="editable-block" contenteditable="false">本次《健康风险评估报告及建议》依据客户近三年体检报告、专项检查结果、病历资料与随访记录整理完成。整体解读重点放在体检异常项的纵向变化、桥本甲状腺炎与甲状腺结节进展、糖代谢临界变化以及免疫相关异常风险，并结合当前生活方式给出后续管理建议。</p>
          <p class="editable-block" contenteditable="false">报告遵循正式交付版排版方式，依次呈现健康档案信息、体检报告解读及建议、历年异常指标对比、异常项解读、健康风险评估与生活方式改善建议，用于医护团队内部审阅及对患者输出。</p>
        </div>
      </section>

      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">二、健康档案信息</h3>
        <div class="doc-section-body">
          ${renderAttachmentProfileTable(riskAdviceAttachmentTemplate.archiveTable)}
          <p class="editable-block" contenteditable="false">健康档案提示：当前最需要关注的主线包括桥本甲状腺炎持续管理、糖脂代谢风险的早期干预、既往体检异常项的连续随访，以及环境与免疫因素对整体健康状态的叠加影响。</p>
        </div>
      </section>
    </section>

    <section class="pdf-page pdf-body attachment-page">
      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">三、体检报告解读及建议</h3>
        <div class="doc-section-body">
          ${renderEditableList([
            "桥本甲状腺炎与甲状腺多发结节：建议继续内分泌科随访，采用 AIP 饮食管理思路，并定期复查 TSH、FT3、FT4、甲状腺抗体与甲状腺彩超。",
            "糖化血红蛋白 5.7%：提示糖尿病前期风险，建议结合 24 小时动态血糖监测或进一步内分泌科评估，尽早开展饮食与运动干预。",
            "EB 病毒阳性：建议耳鼻喉科结合临床症状评估，必要时进一步复查或随访，排查慢性炎症持续刺激因素。",
            "脂肪肝、胆囊息肉、慢性胃炎 / 胃息肉、肺结节等既往异常项仍需延续复查路径，避免仅关注单次体检结论。",
            "营养素干预建议重点围绕鱼油、益生菌及当前营养组合的重新评估展开，不建议长期沿用既有方案而缺乏阶段性复盘。"
          ])}
          ${renderRichLines([
            [
              { tone: "high", text: "高危关注：" },
              { tone: "high", text: "桥本甲状腺炎、糖化血红蛋白 5.7%、血抗β糖蛋白1抗体偏高、EB 病毒阳性" },
            ],
            [
              { tone: "normal", text: "常规关注：" },
              { tone: "normal", text: "血脂异常、脂肪肝、胆囊息肉、慢性胃炎、肺结节、筛窦炎" },
            ],
          ])}
        </div>
      </section>

      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">四、历年体检异常指标对比</h3>
        <div class="doc-section-body">
          <p class="editable-block" contenteditable="false">基于 2023-2025 年体检结果整理的重点异常指标变化如下，用于观察糖脂代谢、甲状腺功能和免疫相关指标的长期趋势。</p>
          ${renderAttachmentTable(riskAdviceAttachmentTemplate.comparisonHeaders, riskAdviceAttachmentTemplate.comparisonRows)}
        </div>
      </section>
    </section>

    <section class="pdf-page pdf-body attachment-page">
      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">五、体检异常项解读</h3>
        <div class="doc-section-body">
          <h4 class="attachment-subtitle editable-block" contenteditable="false">5.1 血脂异常</h4>
          <p class="editable-block" contenteditable="false">总胆固醇、甘油三酯持续处于偏高区间，提示长期饮食结构、运动量及代谢调节能力存在问题。当前阶段建议将高血脂管理作为基础任务，与糖代谢风险控制协同推进。</p>
          <h4 class="attachment-subtitle editable-block" contenteditable="false">5.2 桥本甲状腺炎、甲状腺多发结节</h4>
          <p class="editable-block" contenteditable="false">结合既往病史和当前体检结果，桥本甲状腺炎仍为需要长期管理的主病线。建议持续观察甲状腺功能、炎症相关指标及结节变化，避免在症状不明显时中断随访。</p>
          <h4 class="attachment-subtitle editable-block" contenteditable="false">5.3 糖化血红蛋白 5.7%</h4>
          <p class="editable-block" contenteditable="false">该结果提示已进入糖尿病前期风险边缘，需要重点关注主食结构、餐后波动和运动执行率。若后续复查仍维持在当前水平或继续升高，建议尽快转入更密集的代谢管理。</p>
        </div>
      </section>
    </section>

    <section class="pdf-page pdf-body attachment-page">
      <section class="doc-section attachment-section">
        <div class="doc-section-body">
          <h4 class="attachment-subtitle editable-block" contenteditable="false">5.4 血抗β糖蛋白1抗体偏高</h4>
          <p class="editable-block" contenteditable="false">该项异常提示存在免疫相关风险信号，需结合临床症状、既往病史与复查结果综合判断。建议保留专项复查记录，并在后续健康评估中持续纳入观察。</p>
          <h4 class="attachment-subtitle editable-block" contenteditable="false">5.5 EB 病毒阳性</h4>
          <p class="editable-block" contenteditable="false">EB 病毒相关结果阳性需要结合耳鼻喉、口腔或慢性炎症表现综合评估，不建议孤立解读。若伴随乏力、慢性咽部不适或鼻咽症状，应进一步就诊排查。</p>
        </div>
      </section>

      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">六、健康风险评估及建议</h3>
        <div class="doc-section-body">
          <h4 class="attachment-subtitle editable-block" contenteditable="false">6.1 重大疾病风险评估</h4>
          <p class="editable-block" contenteditable="false">当前综合风险主要集中在代谢性疾病进展、甲状腺相关疾病长期管理和免疫异常持续随访三条主线。短期内未见需要急诊处理的重症信号，但若忽视干预，后续并发风险将逐步累积。</p>
          <h4 class="attachment-subtitle editable-block" contenteditable="false">6.2 生活方式指数评估</h4>
          <p class="editable-block" contenteditable="false">睡眠、饮食结构、饮酒频率和运动节律仍有优化空间。生活方式因素与当前糖脂代谢异常及炎症风险高度相关，应作为管理计划的核心抓手，而非仅作为辅助建议处理。</p>
          ${renderRichLines([
            [{ tone: "high", text: "高风险：" }, { tone: "high", text: "糖尿病前期风险、桥本甲状腺炎持续进展、免疫异常持续暴露" }],
            [{ tone: "normal", text: "常规风险：" }, { tone: "normal", text: "血脂异常、睡眠不足、饮食结构失衡、运动节律不稳定" }],
          ])}
        </div>
      </section>
    </section>

    <section class="pdf-page pdf-body attachment-page">
      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">七、生活方式改善建议</h3>
        <div class="doc-section-body">
          <h4 class="attachment-subtitle editable-block" contenteditable="false">7.1 饮食建议</h4>
          ${renderEditableList([
            "采用以 AIP 饮食管理为基础的阶段性调整策略，优先减少精制糖、反式脂肪与高频外食。",
            "控制高脂高盐摄入，优化日常食用油结构，增加深海鱼、蔬果、优质蛋白和高纤维主食比例。",
            "限制饮酒频率与总量，避免因酒精摄入加重脂代谢、肝脏负担与炎症反应。",
            "保持规律饮水，减少高糖饮料与夜间加餐。"
          ])}
          <h4 class="attachment-subtitle editable-block" contenteditable="false">7.2 环境重金属管理建议</h4>
          ${renderEditableList([
            "结合既往环境暴露史与免疫相关风险，建议在后续专项评估中考虑环境重金属筛查。",
            "减少来源不明保健品、长期高频海产品和潜在污染环境暴露，定期复盘居住与工作场景中的风险因素。",
            "如后续检测提示暴露风险升高，可在专业指导下进行针对性的营养支持与管理。"
          ])}
        </div>
      </section>
    </section>

    <section class="pdf-page pdf-body attachment-page attachment-page-last">
      <section class="doc-section attachment-section">
        <h3 class="doc-section-title editable-block" contenteditable="false">八、免责声明</h3>
        <div class="doc-section-body">
          <p class="editable-block" contenteditable="false">本报告依据当前提供的体检结果、健康档案资料与随访信息整理生成，仅作为健康管理与临床沟通的辅助参考，不替代专科医生面诊、影像判断及实验室正式诊断意见。</p>
          <p class="editable-block" contenteditable="false">若后续新增检查结果、症状变化或专科诊断结论，应以新的医学资料为准，并及时更新本报告中的风险判断与管理建议。</p>
        </div>
      </section>
    </section>
  `;
}

function getReportConfig(report) {
  const serviceId = inferReportServiceId(report);
  const promptSource = report.selectedSources?.find((item) => item.startsWith("自然语言描述："));
  return {
    serviceId,
    service: services[serviceId],
    documentName: report.title || getReportCardTitle(report),
    scope: promptSource ? "prompt" : report.selectedSources?.[0] === "全部档案数据" ? "all" : "specific",
    selectedSources: report.selectedSources?.length ? report.selectedSources : ["全部档案数据"],
    promptDescription: promptSource ? promptSource.replace("自然语言描述：", "") : "",
  };
}

function buildPreviewHtml(report) {
  const config = getReportConfig(report);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = report.content || buildDocumentHtml(config);
  wrapper.querySelectorAll(".editable-block").forEach((node) => {
    node.setAttribute("contenteditable", "false");
    node.removeAttribute("spellcheck");
  });
  return wrapper.innerHTML;
}

function ensureReportContent(reportId) {
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    return null;
  }

  if (report.content) {
    return report;
  }

  const config = getReportConfig(report);
  const content = buildDocumentHtml(config);

  reports = reports.map((item) =>
    item.id === reportId
      ? {
          ...item,
          content,
          serviceId: config.serviceId,
          selectedSources: item.selectedSources?.length ? item.selectedSources : config.selectedSources,
          needsReveal: false,
        }
      : item,
  );

  return reports.find((item) => item.id === reportId) || null;
}

function closeReportMenus() {
  refs.reportGrid.querySelectorAll(".report-card").forEach((card) => {
    const menu = card.querySelector(".report-more-menu");
    const button = card.querySelector(".more-button");
    card.classList.remove("menu-open");
    if (menu) {
      menu.hidden = true;
    }
    if (button) {
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function toggleReportMenu(card) {
  const menu = card.querySelector(".report-more-menu");
  const button = card.querySelector(".more-button");
  if (!menu || !button) {
    return;
  }

  const nextExpanded = button.getAttribute("aria-expanded") !== "true";
  closeReportMenus();
  menu.hidden = !nextExpanded;
  button.setAttribute("aria-expanded", String(nextExpanded));
  card.classList.toggle("menu-open", nextExpanded);
}

function exportReport(reportId) {
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    return;
  }

  const preparedReport = ensureReportContent(reportId) || report;
  const body = buildPreviewHtml(preparedReport);
  const title = preparedReport.title || getReportCardTitle(preparedReport);
  const stylesheetUrl = new URL("./styles.css", window.location.href).href;
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");

  if (!printWindow) {
    showToast("无法打开导出窗口", "请允许当前页面打开新窗口后重试导出。");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="${stylesheetUrl}">
    <style>
      @page { size: A4; margin: 0; }
      body {
        margin: 0;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .preview-export-shell {
        padding: 24px 0;
        background: #ffffff;
      }
      .preview-export-shell .pdf-page {
        width: 210mm !important;
        min-height: 297mm;
        margin: 0 auto 12mm !important;
        box-shadow: none !important;
      }
      .preview-export-shell .editable-block {
        outline: none !important;
      }
      @media print {
        .preview-export-shell {
          padding: 0;
        }
        .preview-export-shell .pdf-page {
          margin: 0 auto !important;
          break-after: page;
        }
        .preview-export-shell .pdf-page:last-child {
          break-after: auto;
        }
      }
    </style>
  </head>
  <body>
    <main class="preview-export-shell">${body}</main>
  </body>
</html>`);
  printWindow.document.close();

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
    showToast("已进入导出流程", `${getReportCardTitle(preparedReport)} 已打开 PDF 导出窗口。`);
  };

  if (printWindow.document.readyState === "complete") {
    window.setTimeout(triggerPrint, 180);
  } else {
    printWindow.addEventListener("load", () => {
      window.setTimeout(triggerPrint, 180);
    }, { once: true });
  }
}

function openActionConfirmModal(options) {
  pendingActionConfirm = typeof options.onConfirm === "function" ? options.onConfirm : null;
  refs.actionConfirmTitle.textContent = options.title;
  refs.actionConfirmMessage.textContent = options.message;
  refs.actionConfirmDetail.textContent = options.detail;
  refs.actionConfirmSubmit.textContent = options.submitLabel || "确定";
  refs.actionConfirmModal.hidden = false;
}

function closeActionConfirmModal() {
  pendingActionConfirm = null;
  refs.actionConfirmModal.hidden = true;
}

function confirmActionModal() {
  const callback = pendingActionConfirm;
  closeActionConfirmModal();
  if (callback) {
    callback();
  }
}

function handleReportMenuAction(reportId, action) {
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    return;
  }

  if (action === "toggle-publish") {
    const nextStatus = getReportStatus(report) === "已发布" ? "未发布" : "已发布";
    openActionConfirmModal({
      title: nextStatus === "已发布" ? "发布" : "撤销发布",
      message: nextStatus === "已发布" ? "发布后患者可在患者端查看和下载文档详情内容" : "撤销后患者不可在线查看",
      detail: nextStatus === "已发布" ? "确认发布当前文档？" : "确认撤销当前文档的发布状态？",
      onConfirm: () => {
        reports = reports.map((item) =>
          item.id === reportId
            ? { ...item, status: nextStatus, tone: nextStatus === "已发布" ? "published" : "unpublished" }
            : item,
        );
        renderReports();
        showToast(nextStatus === "已发布" ? "已发布文档" : "已撤销发布", `${getReportCardTitle(report)} 状态已更新为${nextStatus}。`);
      },
    });
    return;
  }

  if (action === "export") {
    exportReport(reportId);
    return;
  }

  if (action === "edit") {
    openSavedReport(reportId);
    return;
  }

  if (action === "delete") {
    openActionConfirmModal({
      title: "删除",
      message: "删除后数据不可恢复，请谨慎操作！",
      detail: "确认删除当前文档？",
      onConfirm: () => {
        reports = reports.filter((item) => item.id !== reportId);
        renderReports();
        showToast("已删除文档", `${getReportCardTitle(report)} 已从列表移除。`);
      },
    });
  }
}

function renderReports() {
  if (!refs.reportGrid || !refs.reportTemplate) {
    return;
  }

  refs.reportGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  reports.forEach((report) => {
    const card = refs.reportTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.reportId = report.id;
    const visualType = getReportVisualType(report);
    const status = getReportStatus(report);
    const moreMenu = card.querySelector(".report-more-menu");
    const togglePublishItem = card.querySelector('[data-action="toggle-publish"]');

    card.classList.add("interactive");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `预览 ${getReportCardTitle(report)}`);

    card.querySelector(".doc-icon").dataset.service = visualType;
    card.querySelector(".doc-icon").innerHTML = getReportIconSvg(visualType);
    card.querySelector(".report-title").textContent = getReportCardTitle(report);
    card.querySelector(".report-subtitle").hidden = true;
    card.querySelector(".report-subtitle").textContent = "";
    card.querySelector(".report-chip").textContent = status;
    card.querySelector(".report-chip").dataset.tone = getReportTone(report);
    togglePublishItem.textContent = status === "已发布" ? "撤销发布" : "发布";
    moreMenu.hidden = true;
    card.querySelector(".report-date").textContent = report.date;
    fragment.appendChild(card);
  });

  refs.reportGrid.appendChild(fragment);
}

function closePreviewModal() {
  currentPreviewReportId = null;
  refs.previewModal.hidden = true;
  refs.previewCanvas.innerHTML = "";
}

function closeChartModal() {
  closeChartDataModal();
}

function openSaveConfirmModal() {
  if (!activeSession || activeSession.status !== "complete") {
    return;
  }

  refs.saveConfirmModal.hidden = false;
}

function closeSaveConfirmModal() {
  refs.saveConfirmModal.hidden = true;
}

function confirmSaveAndReturn() {
  const reportId = saveActiveDocument({ silent: true });
  if (!reportId) {
    closeSaveConfirmModal();
    return;
  }

  closeSaveConfirmModal();
  returnToList();
  showToast("文档已保存", "当前编辑内容已保存，并已返回报告文档列表。");
}

function toggleSidebarSection(trigger) {
  const section = trigger.closest(".nav-section");
  if (!section || !section.querySelector(".section-children")) {
    return;
  }

  const expanded = section.classList.toggle("expanded");
  trigger.setAttribute("aria-expanded", String(expanded));
}

function openPreviewModal(reportId) {
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    return;
  }

  currentPreviewReportId = reportId;
  refs.previewTitle.textContent = getReportCardTitle(report);
  refs.previewStatus.textContent = getReportStatus(report);
  refs.previewStatus.dataset.tone = getReportTone(report);
  refs.previewDate.textContent = `更新于 ${report.date}`;
  refs.previewCanvas.innerHTML = buildPreviewHtml(report);
  refs.previewModal.hidden = false;
}

function enterPreviewEdit() {
  if (!currentPreviewReportId) {
    return;
  }

  const reportId = currentPreviewReportId;
  closePreviewModal();
  openSavedReport(reportId);
}

function generateDocumentName(service) {
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${service.label}-${patientIdentity.name}-${compactDate()}-${random}`;
}

function renderSourceOptions(query = "") {
  refs.sourceResults.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = sourceReports.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    return `${item.name} ${item.meta}`.toLowerCase().includes(normalizedQuery);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "source-row-copy";
    empty.innerHTML = "<strong>未找到匹配报告</strong><span>请尝试调整搜索关键词。</span>";
    refs.sourceResults.appendChild(empty);
    updateSelectedSourceCount();
    return;
  }

  filtered.forEach((item) => {
    const dateLabel = item.meta.split("·")[0]?.trim() || "";
    const button = document.createElement("button");
    button.className = `source-row${selectedSourceIds.has(item.id) ? " active" : ""}`;
    button.type = "button";
    button.dataset.sourceId = item.id;
    button.innerHTML = `
      <span class="source-check">${selectedSourceIds.has(item.id) ? "✓" : ""}</span>
      <span class="source-row-copy">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(dateLabel)}</span>
      </span>
    `;
    fragment.appendChild(button);
  });

  refs.sourceResults.appendChild(fragment);
  updateSelectedSourceCount();
}

function closeMenu() {
  refs.aiButton.setAttribute("aria-expanded", "false");
  refs.aiMenu.hidden = true;
}

function toggleMenu() {
  const expanded = refs.aiButton.getAttribute("aria-expanded") === "true";
  refs.aiButton.setAttribute("aria-expanded", String(!expanded));
  refs.aiMenu.hidden = expanded;
}

function openConfigModal(serviceId) {
  currentServiceId = serviceId;
  const service = services[serviceId];

  refs.configTitle.textContent = `AI 生成${service.label}`;
  refs.configDescription.textContent = service.description;
  renderPatientViews();
  refs.documentNameInput.value = generateDocumentName(service);
  refs.configHint.textContent = "";

  resetSourceSelection();
  setScope("all");
  refs.configModal.hidden = false;
  closeMenu();
}

function closeConfigModal() {
  refs.configModal.hidden = true;
  refs.configHint.textContent = "";
}

function updateSelectedSourceCount() {
  refs.selectedSourceCount.textContent = `已选 ${selectedSourceIds.size} 项`;
}

function renderPatientViews() {
  if (refs.patientAvatar) {
    refs.patientAvatar.textContent = patientIdentity.avatar;
  }
  if (refs.patientName) {
    refs.patientName.textContent = patientIdentity.name;
  }
  if (refs.patientMetaText) {
    refs.patientMetaText.textContent = getPatientMetaText();
  }
  if (refs.patientPhone) {
    refs.patientPhone.textContent = patientIdentity.phone;
  }
  if (refs.patientIdCard) {
    refs.patientIdCard.textContent = patientIdentity.idCard;
  }
  if (refs.modalPatientName) {
    refs.modalPatientName.textContent = patientIdentity.name;
  }
  if (refs.modalPatientMeta) {
    refs.modalPatientMeta.textContent = getPatientMetaText();
  }
  if (refs.modalAvatar) {
    refs.modalAvatar.textContent = patientIdentity.avatar;
  }
  if (refs.generationPatientName) {
    refs.generationPatientName.textContent = patientIdentity.name;
  }
  if (refs.generationPatientMeta) {
    refs.generationPatientMeta.textContent = getPatientMetaText();
  }
}

function resetSourceSelection() {
  selectedSourceIds = new Set();
  refs.sourceSearchInput.value = "";
  refs.scopePromptInput.value = "";
  renderSourceOptions();
}

function setScope(scope) {
  currentScope = scope;

  refs.scopeSwitcher.querySelectorAll(".scope-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.scope === scope);
  });

  const isSpecific = scope === "specific";
  const isPrompt = scope === "prompt";
  refs.reportSourceList.hidden = !isSpecific;
  refs.scopePromptField.hidden = !isPrompt;
  refs.scopeDescription.textContent = isSpecific
    ? "仅纳入本次需要参考的档案资料。"
    : isPrompt
      ? "通过自然语言描述本次需要纳入的数据范围与分析要求。"
      : "自动纳入患者全部健康数据。";
  updateSelectedSourceCount();
}

function toggleSourceSelection(sourceId) {
  if (selectedSourceIds.has(sourceId)) {
    selectedSourceIds.delete(sourceId);
  } else {
    selectedSourceIds.add(sourceId);
  }

  renderSourceOptions(refs.sourceSearchInput.value);
}

function collectConfig() {
  if (!currentServiceId) {
    return null;
  }

  const documentName = refs.documentNameInput.value.trim();
  if (!documentName) {
    refs.configHint.textContent = "请先填写文档名称。";
    return null;
  }

  const promptDescription = refs.scopePromptInput.value.trim();

  const chosenSourceIds = Array.from(selectedSourceIds);
  if (currentScope === "specific" && chosenSourceIds.length === 0) {
    refs.configHint.textContent = "请选择至少一份体检报告。";
    return null;
  }

  if (currentScope === "prompt" && !promptDescription) {
    refs.configHint.textContent = "请先填写自然语言描述。";
    return null;
  }

  const selectedSources =
    currentScope === "all"
      ? ["全部档案数据"]
      : currentScope === "prompt"
        ? [`自然语言描述：${promptDescription}`]
        : sourceReports.filter((item) => chosenSourceIds.includes(item.id)).map((item) => item.name);

  return {
    serviceId: currentServiceId,
    service: services[currentServiceId],
    documentName,
    scope: currentScope,
    selectedSources,
    promptDescription,
  };
}

function createSession(config) {
  return {
    id: `session-${++sessionSeed}`,
    config,
    progress: 0,
    stageStates: stageDefinitions.map((stage) => ({ ...stage, status: "pending" })),
    agents: baseAgents.map((agent) => ({ ...agent })),
    logs: [],
    status: "running",
    backgroundized: false,
    savedReportId: null,
  };
}

function renderStageStrip(session) {
  refs.stageStrip.innerHTML = "";
  const fragment = document.createDocumentFragment();

  session.stageStates.forEach((stage) => {
    const card = document.createElement("article");
    card.className = "stage-card";
    card.dataset.status = stage.status;
    card.innerHTML = `<strong>${escapeHtml(stage.label)}</strong><span>${escapeHtml(stage.desc)}</span>`;
    fragment.appendChild(card);
  });

  refs.stageStrip.appendChild(fragment);
}

function renderAgents(session) {
  return session;
}

function getCurrentStage(session) {
  if (!session?.stageStates?.length) {
    return null;
  }

  const runningStage = session.stageStates.find((stage) => stage.status === "running");
  if (runningStage) {
    return runningStage;
  }

  const completedStage = [...session.stageStates].reverse().find((stage) => stage.status === "done");
  return completedStage || session.stageStates[0];
}

function resetDocumentCanvas() {
  refs.documentCanvas.innerHTML = `
    <div class="document-placeholder">
      <div class="placeholder-line wide"></div>
      <div class="placeholder-line"></div>
      <div class="placeholder-line short"></div>
      <div class="placeholder-line wide"></div>
      <div class="placeholder-line"></div>
    </div>
  `;
}

function parseLogPresentation(entry) {
  const text = entry.text;
  const tone = entry.tone || "default";

  if (tone === "agent") {
    return {
      kind: entry.status === "done" ? "done" : "agent",
      label: entry.status === "done" ? "已完成" : "协同中",
      body: text,
    };
  }

  if (text.startsWith("[√]")) {
    return {
      kind: "done",
      label: "已完成",
      body: text.replace("[√]", "").trim(),
    };
  }

  if (text.startsWith("[*]")) {
    return {
      kind: "checking",
      label: "校验中",
      body: text.replace("[*]", "").trim(),
    };
  }

  if (text.startsWith("[↻]")) {
    return {
      kind: "searching",
      label: "检索中",
      body: text.replace("[↻]", "").trim(),
    };
  }

  if (text.startsWith("[等待]")) {
    return {
      kind: "waiting",
      label: "等待中",
      body: text.replace("[等待]", "").trim(),
    };
  }

  if (tone === "accent") {
    return {
      kind: "system",
      label: "系统",
      body: text,
    };
  }

  return {
    kind: "default",
    label: "处理中",
    body: text,
  };
}

function getLogStatusIcon(kind) {
  switch (kind) {
    case "done":
      return "✓";
    case "system":
      return "•";
    default:
      return "";
  }
}

function buildLogGroups(logs) {
  const groups = [];

  logs.forEach((item) => {
    const meta = parseLogPresentation(item);
    const previousGroup = groups[groups.length - 1];
    const canMerge =
      item.tone === "agent" &&
      previousGroup &&
      previousGroup.tone === item.tone &&
      previousGroup.source === item.source &&
      previousGroup.stage === item.stage &&
      previousGroup.status === item.status &&
      previousGroup.kind === meta.kind;

    if (canMerge) {
      previousGroup.items.push(item);
      previousGroup.bodies.push(meta.body);
      previousGroup.time = item.time;
      return;
    }

    groups.push({
      id: item.id,
      tone: item.tone,
      kind: meta.kind,
      label: meta.label,
      source: item.source || "AI",
      stage: item.stage || "处理中",
      status: item.status || null,
      time: item.time,
      items: [item],
      bodies: [meta.body],
    });
  });

  return groups;
}

function renderProcessLog(session, options = {}) {
  const { animateLast = false } = options;
  refs.processLog.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const groups = buildLogGroups(session.logs);

  groups.forEach((group, index) => {
    const entry = document.createElement("li");
    entry.className = "log-entry";
    entry.dataset.tone = group.tone;
    entry.dataset.kind = group.kind;
    if (animateLast && index === groups.length - 1) {
      entry.classList.add("is-entering");
    }
    const taskIcon = getLogStatusIcon(group.kind);
    const bodyHtml = `
      <ul class="log-entry-tasks">
        ${group.bodies
          .map(
            (body) => `
              <li class="log-entry-copy-item">
                <span class="log-entry-copy-status" data-kind="${escapeHtml(group.kind)}" aria-label="${escapeHtml(group.label)}" title="${escapeHtml(group.label)}">${escapeHtml(taskIcon)}</span>
                <span class="log-entry-copy-text">${escapeHtml(body)}</span>
              </li>`,
          )
          .join("")}
      </ul>
    `;

    entry.innerHTML = `
      <span class="log-marker" aria-hidden="true"></span>
      <div class="log-entry-body">
        <div class="log-entry-head">
          <div class="log-entry-meta">
            <span class="log-source">${escapeHtml(group.source)}</span>
          </div>
          <strong class="log-entry-time">${escapeHtml(group.time)}</strong>
        </div>
        ${bodyHtml}
      </div>
    `;
    fragment.appendChild(entry);
  });

  refs.processLog.appendChild(fragment);
  refs.processLog.scrollTop = refs.processLog.scrollHeight;
}

function settleOpenAgentEntries(session, source) {
  if (!session?.logs?.length || !source) {
    return;
  }

  session.logs = session.logs.map((item) => {
    if (item.tone === "agent" && item.source === source && item.status !== "done") {
      return { ...item, status: "done" };
    }
    return item;
  });
}

function appendTraceEntry(session, entry, options = {}) {
  const currentStage = getCurrentStage(session);
  const time =
    entry.time ||
    new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  if (entry.tone === "agent" && entry.source) {
    settleOpenAgentEntries(session, entry.source);
  }

  session.logs.push({
    id: entry.id || `${session.id}-${session.logs.length + 1}`,
    text: entry.text,
    tone: entry.tone || "default",
    time,
    source: entry.source || "AI 思考",
    stage: entry.stage || currentStage?.label || "处理中",
    status: entry.status || null,
  });

  renderProcessLog(session, { animateLast: options.animate !== false });
}

function appendLog(session, text, tone = "default", options = {}) {
  appendTraceEntry(session, {
    text,
    tone,
    source: tone === "accent" ? "系统" : "AI 思考",
  }, options);
}

function appendAgentTrace(session, agentName, status, note, options = {}) {
  if (!note) {
    return;
  }

  appendTraceEntry(session, {
    text: note,
    tone: "agent",
    source: agentName,
    status,
  }, options);
}

function getAgentName(agentId) {
  return activeSession?.agents.find((agent) => agent.id === agentId)?.name || baseAgents.find((agent) => agent.id === agentId)?.name || "协同 Agent";
}

async function emitAgentTasks(session, tasks, delay = 110) {
  for (const task of tasks) {
    if (!isCurrentSession(session)) {
      return false;
    }

    const agentName = task.agentName || getAgentName(task.agentId);

    if (task.updateState && task.agentId) {
      updateAgentStatus(session, task.agentId, task.status || "running", task.note);
    } else {
      appendAgentTrace(session, agentName, task.status || "running", task.note);
    }

    if (task.thought) {
      appendLog(session, task.thought);
    }

    if (delay > 0) {
      await sleep(delay);
    }
  }

  return true;
}

async function replayTraceEntries(session, trace, delay = 90) {
  for (const step of trace) {
    if (!isCurrentSession(session)) {
      return;
    }

    if (typeof step === "string") {
      appendLog(session, step, "default");
    } else {
      appendTraceEntry(session, step);
    }

    await sleep(delay);
  }
}

function updateStageStatus(session, stageId, status) {
  session.stageStates = session.stageStates.map((stage) => {
    if (stage.id === stageId) {
      return { ...stage, status };
    }
    return stage;
  });

  renderStageStrip(session);
}

function updateAgentStatus(session, agentId, status, note) {
  const previousAgent = session.agents.find((agent) => agent.id === agentId);
  session.agents = session.agents.map((agent) => {
    if (agent.id === agentId) {
      return { ...agent, status, note };
    }
    return agent;
  });

  if (previousAgent && (previousAgent.status !== status || previousAgent.note !== note)) {
    appendAgentTrace(session, previousAgent.name, status, note);
  }

  renderAgents(session);
}

function updateOverallProgress(session, progress, statusText) {
  session.progress = progress;
  refs.overallProgressBar.style.width = `${progress}%`;
  refs.overallProgressText.textContent = `${progress}%`;
  refs.overallStatusText.textContent = statusText;
}

function setThinkingExpanded(expanded) {
  refs.thinkingBriefToggle.setAttribute("aria-expanded", String(expanded));
  refs.thinkingBriefDetail.hidden = !expanded;
  const action = refs.thinkingBriefToggle.querySelector(".thinking-brief-action");
  if (action) {
    action.textContent = expanded ? "收起" : "展开";
  }
}

function buildScopeText(config) {
  if (config.scope === "all") {
    return "全部档案数据";
  }

  if (config.scope === "prompt") {
    return "自然语言描述";
  }

  return `指定 ${config.selectedSources.length} 份档案资料`;
}

function buildThinkingBrief(config) {
  const sources =
    config.scope === "all"
      ? "已读取患者全量健康数据，包括病历、随访记录与既往体检信息。"
      : config.scope === "prompt"
        ? `已按自然语言描述理解数据范围与分析要求：${config.promptDescription || "本次按描述限定输入数据。"}`
        : `已限定读取 ${config.selectedSources.length} 份档案资料，减少无关信息干扰。`;

  return `${config.service.brief}${sources}`;
}

function updateGenerationButtons(isComplete) {
  refs.saveDocument.disabled = !isComplete;
  refs.stopGeneration.hidden = isComplete;
}

function setGenerationView(view) {
  refs.generationScreen.dataset.view = view;
}

function showGenerationScreen(config, options = {}) {
  refs.listScreen.hidden = true;
  refs.generationScreen.hidden = false;
  document.body.classList.add("mode-generation");
  setGenerationView(options.mode === "view" ? "editing" : "processing");

  refs.generationTitle.textContent = config.documentName;
  refs.generationMeta.hidden = true;
  refs.generationMeta.textContent =
    options.mode === "view"
      ? "当前为已生成文档查看与编辑状态，可直接在页面中修改指定内容块。"
      : "采用标准化生成页展示模型处理过程、协同轨迹与正式文档输出。";
  refs.generationModeLabel.textContent = options.mode === "view" ? "已完成输出" : "AI 正在生成中…";
  if (refs.selectedDataScope) {
    refs.selectedDataScope.textContent = buildScopeText(config);
  }
  renderPatientViews();
  refs.thinkingBriefText.textContent = buildThinkingBrief(config);
  refs.backToList.disabled = false;
  refs.stopGeneration.disabled = false;
  renderReferenceData(config);
  updateGenerationButtons(Boolean(options.mode === "view"));
  setThinkingExpanded(true);
  clearSelectionRange();
  hideSelectionToolbar();
  hideBlockInserter();
  hideTableToolbar();
  resetDocumentCanvas();
}

function showListScreen() {
  refs.generationScreen.hidden = true;
  refs.listScreen.hidden = false;
  document.body.classList.remove("mode-generation");
  clearSelectionRange();
  hideSelectionToolbar();
  hideBlockInserter();
  hideTableToolbar();
}

function buildDocumentScaffold(config) {
  const inputScope = config.selectedSources.join("、");
  const tocItems = config.service.blocks
    .map((block, index) => {
      const page = index + 2;
      return `<li><span>${escapeHtml(block.title)}</span><span>${page}</span></li>`;
    })
    .join("");

  return `
    <section class="pdf-page pdf-cover">
      <span class="cover-bird" aria-hidden="true"></span>
      <span class="cover-flower top" aria-hidden="true"></span>
      <span class="cover-flower bottom" aria-hidden="true"></span>
      <div class="cover-content">
        <p class="cover-mark editable-block" contenteditable="false">守护</p>
        <p class="cover-tagline editable-block" contenteditable="false">${escapeHtml(config.service.coverLine)}</p>
        <p class="cover-sub editable-block" contenteditable="false">${escapeHtml(config.service.coverEn)}</p>
        <p class="cover-document-name editable-block" contenteditable="false">${escapeHtml(config.documentName)}</p>
        <div class="cover-meta">
          <p class="editable-block" contenteditable="false">用户编码：${escapeHtml(patientIdentity.code)}</p>
          <p class="editable-block" contenteditable="false">日期：${escapeHtml(formatChineseDate())}</p>
        </div>
      </div>
      <div class="cover-brand">
        春晓健康
        <span>CHUNXIAO HEALTH</span>
      </div>
    </section>

    <section class="pdf-page pdf-toc">
      <div class="toc-header">
        <h2 class="editable-block" contenteditable="false">目录</h2>
      </div>
      <ol class="toc-list">
        ${tocItems}
      </ol>
    </section>

    <section class="pdf-page pdf-body">
      <header class="doc-body-header">
        <h1 class="editable-block document-title-main" contenteditable="false">${escapeHtml(config.documentName)}</h1>
        <p class="editable-block" contenteditable="false">${escapeHtml(config.service.bodyIntro)}</p>
      </header>

      <section class="doc-hero">
        <p class="editable-block" contenteditable="false">患者：${escapeHtml(patientIdentity.name)}</p>
        <p class="editable-block" contenteditable="false">输入数据：${escapeHtml(inputScope)}</p>
        <div class="doc-meta">
          <span>${escapeHtml(config.service.category)}</span>
          <span>${escapeHtml(formatDate())}</span>
          <span>AI 生成初稿</span>
        </div>
      </section>

      <div class="doc-sections"></div>
    </section>
  `;
}

function buildDocumentHtml(config) {
  if (config.serviceId === "risk") {
    return buildRiskAdviceAttachmentHtml();
  }

  const sections = config.service.blocks
    .map((block) => {
      const paragraphs = (block.paragraphs || [])
        .map((text) => `<p class="editable-block" contenteditable="false">${escapeHtml(text)}</p>`)
        .join("");
      const bullets = block.bullets
        ? `<ul class="doc-list">${block.bullets
            .map((text) => `<li class="editable-block" contenteditable="false">${escapeHtml(text)}</li>`)
            .join("")}</ul>`
        : "";

      return `
        <section class="doc-section">
          <h3 class="doc-section-title editable-block" contenteditable="false">${escapeHtml(block.title)}</h3>
          <div class="doc-section-body">
            ${paragraphs}
            ${bullets}
          </div>
        </section>
      `;
    })
    .join("");

  return buildDocumentScaffold(config).replace('<div class="doc-sections"></div>', `<div class="doc-sections">${sections}</div>`);
}

function renderDocumentSkeleton(config) {
  refs.documentCanvas.innerHTML = buildDocumentScaffold(config);
}

function createDocumentSection(block) {
  const root = document.createElement("section");
  root.className = "doc-section";

  const title = document.createElement("h3");
  title.className = "doc-section-title editable-block";
  title.setAttribute("contenteditable", "false");

  const body = document.createElement("div");
  body.className = "doc-section-body";

  root.append(title, body);
  return { root, title, body };
}

function isCurrentSession(session) {
  return Boolean(activeSession && activeSession.id === session.id && session.status === "running");
}

async function typeText(target, text, session, delay = 14) {
  for (const char of text) {
    if (!isCurrentSession(session)) {
      return false;
    }

    target.textContent += char;
    await sleep(delay);
  }

  return true;
}

async function typeTextStatic(target, text, delay = 6) {
  const chunkSize = text.length > 120 ? 8 : text.length > 60 ? 6 : text.length > 24 ? 4 : 2;

  for (let index = 0; index < text.length; index += chunkSize) {
    target.textContent += text.slice(index, index + chunkSize);
    await sleep(delay);
  }
}

async function streamDocument(session) {
  renderDocumentSkeleton(session.config);
  const sectionsRoot = refs.documentCanvas.querySelector(".doc-sections");

  for (let index = 0; index < session.config.service.blocks.length; index += 1) {
    if (!isCurrentSession(session)) {
      return;
    }

    const block = session.config.service.blocks[index];
    const section = createDocumentSection(block);
    sectionsRoot.appendChild(section.root);
    appendTraceEntry(session, {
      text: `开始输出「${block.title}」内容块。`,
      tone: "agent",
      source: "文档内容编排 Agent",
      stage: "内容输出",
      status: "running",
    });

    const titleDone = await typeText(section.title, block.title, session, 15);
    if (!titleDone) {
      return;
    }

    if (block.paragraphs) {
      for (const paragraphText of block.paragraphs) {
        if (!isCurrentSession(session)) {
          return;
        }

        const paragraph = document.createElement("p");
        paragraph.className = "editable-block";
        paragraph.setAttribute("contenteditable", "false");
        section.body.appendChild(paragraph);

        const paragraphDone = await typeText(paragraph, paragraphText, session, 12);
        if (!paragraphDone) {
          return;
        }
      }
    }

    if (block.bullets) {
      const list = document.createElement("ul");
      list.className = "doc-list";
      section.body.appendChild(list);

      for (const bulletText of block.bullets) {
        if (!isCurrentSession(session)) {
          return;
        }

        const item = document.createElement("li");
        item.className = "editable-block";
        item.setAttribute("contenteditable", "false");
        list.appendChild(item);

        const bulletDone = await typeText(item, bulletText, session, 11);
        if (!bulletDone) {
          return;
        }
      }
    }

    updateOverallProgress(
      session,
      54 + Math.round(((index + 1) / session.config.service.blocks.length) * 24),
      `正在输出正式文档 · ${block.title}`,
    );
    await sleep(260);
  }
}

function enableEditing() {
  refs.documentCanvas.querySelectorAll(".editable-block").forEach((node) => {
    node.setAttribute("contenteditable", "true");
    node.spellcheck = false;
  });
  refreshFloatingEditorUI();
}

function normalizeBlockText(text) {
  return text.replace(/\s+/g, " ").trim();
}

const normalRiskTerms = ["空腹血糖", "甘油三酯", "总胆固醇", "BMI", "腰围", "胸闷", "收缩压", "血脂", "常规风险", "常规关注"];
const highRiskTerms = [
  "高危关注",
  "高风险",
  "高危",
  "糖尿病前期风险",
  "糖化血红蛋白 5.7%",
  "糖化血红蛋白5.7%",
  "桥本甲状腺炎",
  "甲状腺多发结节",
  "血抗β糖蛋白1抗体偏高",
  "EB 病毒阳性",
  "EB病毒阳性",
  "免疫异常持续暴露",
  "重大疾病风险",
];

function applyTermHighlights(text, terms, className, sourceHtml) {
  const tokens = [];
  let html = sourceHtml;
  const sortedTerms = [...new Set(terms)].sort((left, right) => right.length - left.length);

  sortedTerms.forEach((term) => {
    const escapedTerm = escapeHtml(term);
    const token = `__hl_${className}_${tokens.length}__`;
    const pattern = new RegExp(escapeRegExp(escapedTerm), "g");

    if (!pattern.test(html)) {
      return;
    }

    tokens.push({
      token,
      html: `<span class="${className}">${escapedTerm}</span>`,
    });
    html = html.replace(pattern, token);
  });

  tokens.forEach((item) => {
    html = html.replaceAll(item.token, item.html);
  });

  return html;
}

function decorateEditableBlock(block) {
  if (!block) {
    return;
  }

  if (block.dataset.userStyled === "true" || block.querySelector("img, svg, table")) {
    return;
  }

  const text = normalizeBlockText(block.textContent);
  const escaped = escapeHtml(text);
  const withHighRisk = applyTermHighlights(text, highRiskTerms, "risk-inline-high", escaped);
  const highlighted = applyTermHighlights(text, normalRiskTerms, "data-highlight", withHighRisk);

  block.innerHTML = highlighted || "&nbsp;";
}

function applyDataHighlights(root) {
  root.querySelectorAll(".editable-block").forEach((block) => {
    decorateEditableBlock(block);
  });
}

function getEditorSurface() {
  return refs.documentCanvas.closest(".editor-surface");
}

function clearSelectionRange() {
  activeSelectionRange = null;
}

function hideSelectionToolbar() {
  refs.selectionToolbar.hidden = true;
  if (refs.textStyleMenu && refs.alignMenu) {
    closeSelectionMenus();
  }
}

function hideBlockInserter() {
  currentInsertionBlock = null;
  refs.blockInserter.hidden = true;
  refs.blockInserterMenu.hidden = true;
  refs.blockInserterToggle.setAttribute("aria-expanded", "false");
}

function hideTableToolbar() {
  activeTableCell = null;
  refs.tableToolbar.hidden = true;
}

function isSelectionInsideCanvas(selection) {
  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
  return Boolean(container && refs.documentCanvas.contains(container));
}

function getClosestEditableBlock(node) {
  if (!node) {
    return null;
  }

  const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  return element?.closest?.(".editable-block") || null;
}

function getClosestTableCell(node) {
  if (!node) {
    return null;
  }

  const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  return element?.closest?.(".editor-table td, .editor-table th") || null;
}

function isEditableBlock(target) {
  return Boolean(target && target.classList.contains("editable-block") && target.getAttribute("contenteditable") === "true");
}

function isEmptyEditableBlock(target) {
  return isEditableBlock(target) && normalizeBlockText(target.textContent || "") === "" && !target.querySelector("img, svg, table");
}

function canShowBlockInserter(target) {
  return isEmptyEditableBlock(target) && /^(P|H1|H2|H3)$/.test(target.tagName) && !target.closest(".editor-table");
}

function positionFloatingElement(element, rect, placement = "top") {
  element.hidden = false;
  const margin = 16;
  const width = element.offsetWidth || 320;
  const height = element.offsetHeight || 48;
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const centeredLeft = rect.left + rect.width / 2 - width / 2;
  const left = Math.min(Math.max(margin, centeredLeft), maxLeft);
  let top = placement === "bottom" ? rect.bottom + 12 : rect.top - height - 12;

  if (placement === "top" && top < margin) {
    top = rect.bottom + 12;
  }

  element.style.left = `${left}px`;
  element.style.top = `${Math.max(margin, top)}px`;
}

function getBlockStyleValue(target) {
  if (!target) {
    return "p";
  }

  const tag = target.tagName.toLowerCase();
  return ["p", "h1", "h2", "h3"].includes(tag) ? tag : "p";
}

function getTextStyleLabel(value) {
  return {
    p: "正文",
    h1: "一级标题",
    h2: "二级标题",
    h3: "三级标题",
  }[value] || "正文";
}

function getAlignLabel(value) {
  return {
    left: "左对齐",
    center: "居中对齐",
    right: "右对齐",
  }[value] || "左对齐";
}

function syncSelectionMenuItems(styleValue, alignValue) {
  refs.textStyleLabel.textContent = getTextStyleLabel(styleValue);
  refs.alignLabel.textContent = getAlignLabel(alignValue);
  refs.textStyleItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.styleValue === styleValue);
  });
  refs.alignItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.alignValue === alignValue);
  });
}

function syncSelectionToolbar(target) {
  syncSelectionMenuItems(getBlockStyleValue(target), target?.style?.textAlign || "left");
}

function positionSelectionToolbar(range) {
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) {
    return;
  }

  positionFloatingElement(refs.selectionToolbar, rect, "top");
}

function updateBlockInserter() {
  if (refs.generationScreen.hidden || refs.generationScreen.dataset.view !== "editing" || !canShowBlockInserter(activeEditableBlock)) {
    hideBlockInserter();
    return;
  }

  currentInsertionBlock = activeEditableBlock;
  const rect = activeEditableBlock.getBoundingClientRect();
  refs.blockInserter.hidden = false;
  refs.blockInserter.style.left = `${Math.max(18, rect.left - 52)}px`;
  refs.blockInserter.style.top = `${Math.max(88, rect.top + rect.height / 2 - 18)}px`;
}

function updateTableToolbar() {
  if (
    refs.generationScreen.hidden ||
    refs.generationScreen.dataset.view !== "editing" ||
    !activeTableCell ||
    !refs.documentCanvas.contains(activeTableCell)
  ) {
    refs.tableToolbar.hidden = true;
    return;
  }

  const table = activeTableCell.closest(".editor-table");
  if (!table) {
    refs.tableToolbar.hidden = true;
    return;
  }

  const rect = table.getBoundingClientRect();
  positionFloatingElement(refs.tableToolbar, rect, "top");
}

function focusEditableBlock(target) {
  if (!isEditableBlock(target)) {
    activeEditableBlock = null;
    hideBlockInserter();
    updateTableToolbar();
    return;
  }

  activeEditableBlock = target;
  activeTableCell = getClosestTableCell(target);
  updateBlockInserter();
  updateTableToolbar();
}

function placeCaretAtEnd(target) {
  if (!target) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function createEditableTextBlock(tagName = "p", html = "<br>") {
  const node = document.createElement(tagName);
  node.className = "editable-block";
  node.setAttribute("contenteditable", "true");
  node.spellcheck = false;
  node.innerHTML = html;
  return node;
}

function recordEditorSnapshot(force = false) {
  if (!refs.documentCanvas || refs.generationScreen.dataset.view !== "editing") {
    return;
  }

  const html = refs.documentCanvas.innerHTML;
  if (!html.trim()) {
    return;
  }

  if (!force && editorHistory[editorHistoryIndex] === html) {
    return;
  }

  if (editorHistoryIndex < editorHistory.length - 1) {
    editorHistory = editorHistory.slice(0, editorHistoryIndex + 1);
  }

  editorHistory.push(html);
  if (editorHistory.length > 60) {
    editorHistory.shift();
  }
  editorHistoryIndex = editorHistory.length - 1;
}

function scheduleEditorSnapshot() {
  window.clearTimeout(editorSnapshotTimer);
  editorSnapshotTimer = window.setTimeout(() => {
    recordEditorSnapshot();
  }, 220);
}

function seedEditorHistory() {
  editorHistory = [];
  editorHistoryIndex = -1;
  recordEditorSnapshot(true);
}

function restoreEditorSnapshot() {
  if (editorHistoryIndex <= 0) {
    return;
  }

  editorHistoryIndex -= 1;
  refs.documentCanvas.innerHTML = editorHistory[editorHistoryIndex];
  hydrateEmbeddedChartBlocks(refs.documentCanvas);
  enableEditing();
  activeEditableBlock = null;
  activeTableCell = null;
  currentInsertionBlock = null;
  clearSelectionRange();
  hideSelectionToolbar();
  hideBlockInserter();
  hideTableToolbar();
}

function replaceInsertAnchor(node, options = {}) {
  const { focusTarget = null, appendTrailingParagraph = true } = options;
  const anchor = currentInsertionBlock && refs.documentCanvas.contains(currentInsertionBlock) ? currentInsertionBlock : activeEditableBlock;
  const trailingBlock = appendTrailingParagraph ? createEditableTextBlock("p") : null;

  if (anchor?.parentElement) {
    anchor.replaceWith(node);
    if (trailingBlock) {
      node.after(trailingBlock);
    }
  } else {
    refs.documentCanvas.appendChild(node);
    if (trailingBlock) {
      refs.documentCanvas.appendChild(trailingBlock);
    }
  }

  const nextFocus = focusTarget || trailingBlock;
  if (nextFocus) {
    nextFocus.focus();
    placeCaretAtEnd(nextFocus);
    focusEditableBlock(nextFocus);
  }

  recordEditorSnapshot();
}

function getSelectionRange() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !isSelectionInsideCanvas(selection)) {
    return null;
  }

  return selection.getRangeAt(0);
}

function getSelectedEditableBlocks(range = null) {
  const selectionRange = range || getSelectionRange();
  if (!selectionRange) {
    return activeEditableBlock ? [activeEditableBlock] : [];
  }

  return Array.from(refs.documentCanvas.querySelectorAll(".editable-block")).filter((block) => {
    if (!selectionRange.intersectsNode(block)) {
      return false;
    }
    if (!isEditableBlock(block)) {
      return false;
    }
    if (block.closest(".editor-table")) {
      return false;
    }
    return true;
  });
}

function restoreSelectionRange() {
  if (!activeSelectionRange) {
    return false;
  }

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(activeSelectionRange);
  return true;
}

function markSelectionBlocksStyled(range = null) {
  const selectionRange = range || getSelectionRange();
  if (!selectionRange) {
    return;
  }

  [selectionRange.startContainer, selectionRange.endContainer].forEach((node) => {
    const block = getClosestEditableBlock(node);
    if (block) {
      block.dataset.userStyled = "true";
    }
  });
}

function handleSelectionChange() {
  if (refs.generationScreen.hidden || refs.generationScreen.dataset.view !== "editing") {
    hideSelectionToolbar();
    return;
  }

  const selection = window.getSelection();
  const range = getSelectionRange();
  const anchorBlock = getClosestEditableBlock(selection?.anchorNode);
  const anchorCell = getClosestTableCell(selection?.anchorNode);

  if (anchorBlock) {
    activeEditableBlock = anchorBlock;
  }
  activeTableCell = anchorCell || null;
  updateTableToolbar();

  if (!range || selection.isCollapsed || !anchorBlock || normalizeBlockText(selection.toString()) === "") {
    hideSelectionToolbar();
    updateBlockInserter();
    return;
  }

  activeSelectionRange = range.cloneRange();
  syncSelectionToolbar(anchorBlock);
  positionSelectionToolbar(range);
}

function transformBlockTag(target, tagName) {
  if (!isEditableBlock(target) || target.closest(".editor-table")) {
    return;
  }

  const normalizedTag = tagName.toLowerCase();
  if (target.tagName.toLowerCase() === normalizedTag) {
    return;
  }

  const next = createEditableTextBlock(normalizedTag, target.innerHTML || "<br>");
  next.dataset.userStyled = "true";
  next.style.cssText = target.style.cssText;

  if (target.tagName === "LI" && target.parentElement?.matches("ul, ol")) {
    const list = target.parentElement;
    if (list.children.length === 1) {
      list.replaceWith(next);
    } else {
      list.parentElement.insertBefore(next, list.nextSibling);
      target.remove();
    }
  } else {
    target.replaceWith(next);
  }

  next.focus();
  placeCaretAtEnd(next);
  focusEditableBlock(next);
}

function applyBlockStyle(tagName) {
  const range = getSelectionRange();
  const blocks = getSelectedEditableBlocks(range);

  if (blocks.length === 0) {
    return;
  }

  blocks.forEach((block, index) => {
    transformBlockTag(index === 0 ? block : getClosestEditableBlock(block), tagName);
  });
  recordEditorSnapshot();
}

function applyAlignment(value) {
  const blocks = getSelectedEditableBlocks();
  if (blocks.length === 0) {
    return;
  }

  blocks.forEach((target) => {
    target.dataset.userStyled = "true";
    target.style.textAlign = value;
  });
  focusEditableBlock(blocks[0]);
  recordEditorSnapshot();
}

function applyListType(listTag) {
  const blocks = getSelectedEditableBlocks().filter((block) => !block.closest(".editor-table"));
  if (blocks.length === 0) {
    return;
  }

  const target = blocks[0];

  if (target.tagName === "LI" && target.parentElement?.tagName.toLowerCase() === listTag) {
    return;
  }

  if (blocks.length > 1) {
    const list = document.createElement(listTag);
    list.className = "doc-list";
    blocks.forEach((block, index) => {
      const item = createEditableTextBlock("li", block.innerHTML || "<br>");
      item.dataset.userStyled = "true";
      list.appendChild(item);
      if (index === 0) {
        block.replaceWith(list);
      } else {
        block.remove();
      }
    });
    const firstItem = list.querySelector("li");
    if (firstItem) {
      firstItem.focus();
      placeCaretAtEnd(firstItem);
      focusEditableBlock(firstItem);
    }
    recordEditorSnapshot();
    return;
  }

  if (target.tagName === "LI" && target.parentElement?.matches("ul, ol")) {
    const currentList = target.parentElement;
    const nextList = document.createElement(listTag);
    nextList.className = "doc-list";
    Array.from(currentList.children).forEach((item) => {
      if (item.tagName === "LI") {
        item.classList.add("editable-block");
        item.setAttribute("contenteditable", "true");
        item.spellcheck = false;
        item.dataset.userStyled = "true";
        nextList.appendChild(item);
      }
    });
    currentList.replaceWith(nextList);
    const nextTarget = nextList.querySelector("li");
    if (nextTarget) {
      nextTarget.focus();
      placeCaretAtEnd(nextTarget);
      focusEditableBlock(nextTarget);
    }
    recordEditorSnapshot();
    return;
  }

  const list = document.createElement(listTag);
  list.className = "doc-list";
  const item = createEditableTextBlock("li", target.innerHTML || "<br>");
  item.dataset.userStyled = "true";
  list.appendChild(item);
  target.replaceWith(list);
  item.focus();
  placeCaretAtEnd(item);
  focusEditableBlock(item);
  recordEditorSnapshot();
}

function applyInlineStyle(command, value) {
  if (!restoreSelectionRange()) {
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return;
  }

  document.execCommand("styleWithCSS", false, true);
  document.execCommand(command, false, value);
  if (command === "hiliteColor") {
    document.execCommand("backColor", false, value || "transparent");
  }

  markSelectionBlocksStyled(selection.getRangeAt(0));
  handleSelectionChange();
  recordEditorSnapshot();
}

function createImageBlock(src, alt = "插入图片") {
  const figure = document.createElement("figure");
  figure.className = "editor-media-block content-block";
  figure.innerHTML = `
    <div class="editor-media-frame">
      <img src="${src}" alt="${escapeHtml(alt)}">
    </div>
    <figcaption class="editable-block editor-figure-caption" contenteditable="true">图片说明</figcaption>
  `;
  figure.querySelector(".editor-figure-caption").spellcheck = false;
  return figure;
}

function createTableCell() {
  const cell = document.createElement("td");
  cell.className = "editable-block editor-table-cell";
  cell.setAttribute("contenteditable", "true");
  cell.spellcheck = false;
  cell.innerHTML = "<br>";
  return cell;
}

function createTableBlock(rows = 3, columns = 2) {
  const wrap = document.createElement("div");
  wrap.className = "editor-table-block content-block";
  const table = document.createElement("table");
  table.className = "editor-table";
  const body = document.createElement("tbody");

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const row = document.createElement("tr");
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      row.appendChild(createTableCell());
    }
    body.appendChild(row);
  }

  table.appendChild(body);
  wrap.appendChild(table);
  return wrap;
}

const lifestyleChartMetricDefs = [
  { key: "diet", label: ["饮食"] },
  { key: "activity", label: ["身体", "活动"] },
  { key: "tobacco", label: ["烟草", "暴露"] },
  { key: "sleep", label: ["睡眠", "健康"] },
  { key: "weight", label: ["体重"] },
  { key: "lipids", label: ["血脂"] },
  { key: "glucose", label: ["血糖"] },
  { key: "pressure", label: ["血压"] },
];

function createEmptyLifestyleChartData() {
  return lifestyleChartMetricDefs.map((item) => ({
    key: item.key,
    label: item.label,
    value: null,
  }));
}

function getLifestyleChartDataFromBlock(block) {
  if (!block?.dataset.chartData) {
    return createEmptyLifestyleChartData();
  }

  try {
    const parsed = JSON.parse(block.dataset.chartData);
    return lifestyleChartMetricDefs.map((item) => {
      const existing = parsed.find((entry) => entry.key === item.key) || {};
      return {
        key: item.key,
        label: item.label,
        value: Number.isFinite(Number(existing.value)) ? Number(existing.value) : null,
      };
    });
  } catch {
    return createEmptyLifestyleChartData();
  }
}

function setLifestyleChartData(block, data) {
  block.dataset.chartData = JSON.stringify(
    data.map((item) => ({
      key: item.key,
      value: Number.isFinite(Number(item.value)) ? Number(item.value) : null,
    })),
  );
}

function computeLifestyleLevel(score) {
  if (!Number.isFinite(score)) {
    return "待提取";
  }
  if (score >= 80) {
    return "良好";
  }
  if (score >= 60) {
    return "中等";
  }
  return "偏低";
}

function computeLifestyleTotalScore(data) {
  const values = data.map((item) => item.value).filter((value) => Number.isFinite(value));
  if (!values.length) {
    return null;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function normalizeLifestyleScore(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

function extractLifestyleChartData() {
  const metrics = referenceMetricsByService.risk || [];
  const findMetric = (keyword) => metrics.find((item) => item.label.includes(keyword)) || null;
  const bmiValue = Number.parseFloat(patientArchive.bmi);
  const pressureTop = Number.parseFloat((patientArchive.bloodPressure || "").split("/")[0]);
  const glucoseValue = Number.parseFloat((findMetric("空腹血糖")?.value || "").replace(/[^\d.]/g, ""));
  const lipidValue = Number.parseFloat((findMetric("甘油三酯")?.value || "").replace(/[^\d.]/g, ""));

  const scoreMap = {
    diet: patientArchive.diet ? 25 : null,
    activity: patientArchive.exercise ? 100 : null,
    tobacco: patientArchive.smokingHistory ? 75 : null,
    sleep: patientArchive.sleep ? 70 : null,
    weight: Number.isFinite(bmiValue) ? (bmiValue <= 24 ? 100 : bmiValue <= 28 ? 70 : 40) : null,
    lipids: Number.isFinite(lipidValue) ? (lipidValue <= 1.7 ? 100 : lipidValue <= 2.3 ? 70 : 40) : null,
    glucose: Number.isFinite(glucoseValue) ? (glucoseValue <= 6.1 ? 100 : glucoseValue <= 7 ? 75 : 40) : null,
    pressure: Number.isFinite(pressureTop) ? (pressureTop < 130 ? 75 : pressureTop < 140 ? 60 : 40) : null,
  };

  return lifestyleChartMetricDefs.map((item) => ({
    key: item.key,
    label: item.label,
    value: scoreMap[item.key] ?? null,
  }));
}

function renderLifestyleChartMarkup(data) {
  const totalScore = computeLifestyleTotalScore(data);
  const level = computeLifestyleLevel(totalScore);
  const completeCount = data.filter((item) => Number.isFinite(item.value)).length;
  const missingCount = data.length - completeCount;
  const gaugeValue = Number.isFinite(totalScore) ? Math.max(0, Math.min(100, totalScore)) : 0;

  return `
    <div class="editor-lifestyle-chart">
      <section class="editor-lifestyle-panel editor-lifestyle-summary">
        <h4 class="editor-chart-panel-title">测试报告总分表</h4>
        <div class="editor-chart-panel-subtitle">${level}</div>
        <div class="editor-gauge-shell">
          <svg viewBox="0 0 320 220" role="img" aria-label="生活方式评估总分">
            <defs>
              <linearGradient id="editorLifestyleGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff6a55"></stop>
                <stop offset="46%" stop-color="#ffb400"></stop>
                <stop offset="100%" stop-color="#2ed37b"></stop>
              </linearGradient>
            </defs>
            <path
              d="M 52 178 A 108 108 0 0 1 268 178"
              fill="none"
              stroke="#e8edf5"
              stroke-width="18"
              stroke-linecap="round"
              pathLength="100"
            ></path>
            ${
              Number.isFinite(totalScore)
                ? `<path
                    d="M 52 178 A 108 108 0 0 1 268 178"
                    fill="none"
                    stroke="url(#editorLifestyleGauge)"
                    stroke-width="18"
                    stroke-linecap="round"
                    pathLength="100"
                    stroke-dasharray="${gaugeValue} 100"
                  ></path>`
                : ""
            }
          </svg>
          <div class="editor-gauge-score">${Number.isFinite(totalScore) ? totalScore : "—"}</div>
        </div>
        <div class="editor-gauge-scale" aria-hidden="true">
          <span>低</span>
          <span>0</span>
          <span>100</span>
          <span>高</span>
        </div>
        <div class="editor-gauge-done">${Number.isFinite(totalScore) ? "评分已完成" : "等待生成图表"}</div>
        <p class="editor-gauge-note">
          ${
            Number.isFinite(totalScore)
              ? `您的生活方式健康水平综合评分结果为 <strong>${totalScore}分</strong>`
              : `请先点击 <strong>AI提取患者数据</strong>，系统会自动填入可识别的指标分值。`
          }
        </p>
        ${
          missingCount > 0
            ? `<p class="editor-chart-missing-note">当前仍有 ${missingCount} 项指标缺少数据，可在图表编辑中手动补充。</p>`
            : ""
        }
      </section>

      <section class="editor-lifestyle-panel editor-lifestyle-breakdown">
        <h4 class="editor-chart-panel-title">测试报告各项分数表</h4>
        <div class="editor-lifestyle-bar-chart">
          <div class="editor-bar-axis">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          <div class="editor-bar-columns">
            ${data
              .map(
                (item) => `
                  <div class="editor-bar-column${Number.isFinite(item.value) ? "" : " is-missing"}">
                    <span class="editor-bar-value">${Number.isFinite(item.value) ? item.value : "缺少数据"}</span>
                    <div class="editor-bar-track">
                      <span class="editor-bar-fill" style="height:${Number.isFinite(item.value) ? item.value : 0}%"></span>
                    </div>
                    <span class="editor-bar-label">${item.label.map((line) => `<span>${line}</span>`).join("")}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <p class="editor-chart-note">注：该评分来源于地中海饮食和美国居民心血管健康评价方法，仅供参考！</p>
      </section>
    </div>
  `;
}

function renderLifestyleChartPendingMarkup() {
  return `
    <div class="editor-chart-empty">
      <div class="editor-chart-empty-copy">
        <strong>生活方式评估图</strong>
        <p>点击下方按钮，调用 AI 提取患者相关档案数据后生成图表。</p>
      </div>
      <button class="primary-button chart-extract-button" type="button">AI提取患者数据</button>
    </div>
  `;
}

function renderChartEditButtonMarkup() {
  return `
    <button class="chart-edit-button" type="button" aria-label="编辑图表数据">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4l9.6-9.6a1.8 1.8 0 0 0 0-2.6l-1.4-1.4a1.8 1.8 0 0 0-2.6 0L4 16v4Z"></path>
        <path d="m12.8 7.2 4 4"></path>
      </svg>
    </button>
  `;
}

function renderLifestyleChartBlock(block, options = {}) {
  const visual = block.querySelector(".editor-chart-visual");
  if (!visual) {
    return;
  }

  const data = getLifestyleChartDataFromBlock(block);
  const hasAnyValue = data.some((item) => Number.isFinite(item.value));
  const shouldShowPending = options.pending || !hasAnyValue;

  visual.dataset.chartReady = String(!shouldShowPending);
  visual.innerHTML = shouldShowPending
    ? renderLifestyleChartPendingMarkup()
    : `${renderChartEditButtonMarkup()}${renderLifestyleChartMarkup(data)}`;
}

function renderChartDataTable(data) {
  refs.chartDataTableBody.innerHTML = data
    .map(
      (item) => `
        <tr data-key="${escapeHtml(item.key)}">
          <td>${escapeHtml(item.label.join(""))}</td>
          <td>
            <input
              class="chart-data-input"
              type="number"
              min="0"
              max="100"
              step="1"
              value="${Number.isFinite(item.value) ? item.value : ""}"
              placeholder="缺少数据"
            >
          </td>
        </tr>
      `,
    )
    .join("");
}

function openChartDataModal(block) {
  currentChartBlock = block;
  refs.chartDataTitle.textContent = "编辑图表数据";
  renderChartDataTable(getLifestyleChartDataFromBlock(block));
  refs.chartDataModal.hidden = false;
}

function closeChartDataModal() {
  currentChartBlock = null;
  refs.chartDataModal.hidden = true;
  refs.chartDataTableBody.innerHTML = "";
}

function applyExtractedLifestyleData(block) {
  setLifestyleChartData(block, extractLifestyleChartData());
  renderLifestyleChartBlock(block);
  recordEditorSnapshot(true);
}

function saveChartDataModal() {
  if (!currentChartBlock) {
    return;
  }

  const nextData = Array.from(refs.chartDataTableBody.querySelectorAll("tr")).map((row) => {
    const key = row.dataset.key;
    const metric = lifestyleChartMetricDefs.find((item) => item.key === key);
    const input = row.querySelector("input");
    const rawValue = input?.value?.trim?.() || "";
    return {
      key,
      label: metric?.label || [key],
      value: rawValue === "" ? null : normalizeLifestyleScore(rawValue),
    };
  });

  setLifestyleChartData(currentChartBlock, nextData);
  renderLifestyleChartBlock(currentChartBlock);
  closeChartDataModal();
  recordEditorSnapshot(true);
}

function createChartBlock(type) {
  const figure = document.createElement("figure");
  figure.className = "editor-chart-block content-block";
  figure.dataset.chartType = "lifestyle";
  setLifestyleChartData(figure, createEmptyLifestyleChartData());
  const title = "生活方式评估图";
  figure.innerHTML = `
    <div class="editor-chart-visual"></div>
    <figcaption class="editable-block editor-chart-caption" contenteditable="true">${title}</figcaption>
  `;
  figure.querySelector(".editor-chart-caption").spellcheck = false;
  renderLifestyleChartBlock(figure, { pending: true });
  return figure;
}

function handleInsertContent(type, fileData = null) {
  if (!currentInsertionBlock || !refs.documentCanvas.contains(currentInsertionBlock)) {
    return;
  }

  if (type === "image" && fileData) {
    replaceInsertAnchor(createImageBlock(fileData.result, fileData.name));
    return;
  }

  if (type === "table") {
    const tableBlock = createTableBlock();
    const firstCell = tableBlock.querySelector("td");
    replaceInsertAnchor(tableBlock, { focusTarget: firstCell });
    activeTableCell = firstCell;
    updateTableToolbar();
    return;
  }

  if (type === "radar-chart") {
    replaceInsertAnchor(createChartBlock(type));
  }
}

function handleDocumentKeydown(event) {
  const block = event.target.closest(".editable-block");

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    restoreEditorSnapshot();
    return;
  }

  if (!isEditableBlock(block) || block.closest(".editor-table")) {
    return;
  }

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const nextTag = block.tagName === "LI" ? "li" : "p";
    const nextBlock = createEditableTextBlock(nextTag);
    block.after(nextBlock);
    nextBlock.focus();
    placeCaretAtEnd(nextBlock);
    focusEditableBlock(nextBlock);
    recordEditorSnapshot();
  }
}

function handleDocumentInput(event) {
  const block = event.target.closest(".editable-block");
  if (!block) {
    return;
  }

  block.dataset.userStyled = "true";
  activeEditableBlock = block;
  activeTableCell = getClosestTableCell(block);
  updateBlockInserter();
  updateTableToolbar();
  scheduleEditorSnapshot();
}

function toggleBlockInserterMenu() {
  const expanded = refs.blockInserterToggle.getAttribute("aria-expanded") === "true";
  refs.blockInserterToggle.setAttribute("aria-expanded", String(!expanded));
  refs.blockInserterMenu.hidden = expanded;
}

function toggleSelectionMenu(type) {
  if (type === "style") {
    const expanded = refs.textStyleTrigger.getAttribute("aria-expanded") === "true";
    refs.alignMenu.hidden = true;
    refs.alignTrigger.setAttribute("aria-expanded", "false");
    refs.textStyleMenu.hidden = expanded;
    refs.textStyleTrigger.setAttribute("aria-expanded", String(!expanded));
    return;
  }

  const expanded = refs.alignTrigger.getAttribute("aria-expanded") === "true";
  refs.textStyleMenu.hidden = true;
  refs.textStyleTrigger.setAttribute("aria-expanded", "false");
  refs.alignMenu.hidden = expanded;
  refs.alignTrigger.setAttribute("aria-expanded", String(!expanded));
}

function closeSelectionMenus() {
  refs.textStyleMenu.hidden = true;
  refs.alignMenu.hidden = true;
  refs.textStyleTrigger.setAttribute("aria-expanded", "false");
  refs.alignTrigger.setAttribute("aria-expanded", "false");
}

function handleTextStyleMenuClick(event) {
  const actionButton = event.target.closest("[data-style-value]");
  if (!actionButton?.dataset.styleValue) {
    return;
  }

  applyBlockStyle(actionButton.dataset.styleValue);
  refs.textStyleMenu.hidden = true;
  refs.textStyleTrigger.setAttribute("aria-expanded", "false");
}

function handleAlignMenuClick(event) {
  const actionButton = event.target.closest("[data-align-value]");
  if (!actionButton?.dataset.alignValue) {
    return;
  }

  applyAlignment(actionButton.dataset.alignValue);
  refs.alignMenu.hidden = true;
  refs.alignTrigger.setAttribute("aria-expanded", "false");
}

function handleBlockInserterClick(event) {
  const actionButton = event.target.closest(".block-inserter-item");
  if (!actionButton?.dataset.insert) {
    return;
  }

  refs.blockInserterMenu.hidden = true;
  refs.blockInserterToggle.setAttribute("aria-expanded", "false");

  if (actionButton.dataset.insert === "image") {
    refs.imageUploadInput.click();
    return;
  }

  handleInsertContent(actionButton.dataset.insert);
}

function handleImageSelected(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    handleInsertContent("image", {
      result: reader.result,
      name: file.name,
    });
  });
  reader.readAsDataURL(file);
  event.target.value = "";
}

function getCurrentTable() {
  return activeTableCell?.closest(".editor-table") || null;
}

function insertTableRow() {
  if (!activeTableCell) {
    return;
  }

  const row = activeTableCell.parentElement;
  const nextRow = document.createElement("tr");
  Array.from(row.cells).forEach(() => {
    nextRow.appendChild(createTableCell());
  });
  row.after(nextRow);
  const nextCell = nextRow.querySelector("td");
  if (nextCell) {
    nextCell.focus();
    placeCaretAtEnd(nextCell);
    focusEditableBlock(nextCell);
  }
  recordEditorSnapshot();
}

function insertTableColumn() {
  if (!activeTableCell) {
    return;
  }

  const table = getCurrentTable();
  const cellIndex = activeTableCell.cellIndex;
  Array.from(table.rows).forEach((row) => {
    const cell = createTableCell();
    if (row.cells[cellIndex]) {
      row.cells[cellIndex].after(cell);
    } else {
      row.appendChild(cell);
    }
  });
  const nextCell = activeTableCell.parentElement.cells[cellIndex + 1];
  if (nextCell) {
    nextCell.focus();
    placeCaretAtEnd(nextCell);
    focusEditableBlock(nextCell);
  }
  recordEditorSnapshot();
}

function deleteTableRow() {
  if (!activeTableCell) {
    return;
  }

  const table = getCurrentTable();
  if (table.rows.length <= 1) {
    return;
  }

  const row = activeTableCell.parentElement;
  const fallback = row.nextElementSibling?.cells[activeTableCell.cellIndex] || row.previousElementSibling?.cells[activeTableCell.cellIndex] || row.nextElementSibling?.cells[0] || row.previousElementSibling?.cells[0];
  row.remove();
  if (fallback) {
    fallback.focus();
    placeCaretAtEnd(fallback);
    focusEditableBlock(fallback);
  }
  recordEditorSnapshot();
}

function deleteTableColumn() {
  if (!activeTableCell) {
    return;
  }

  const table = getCurrentTable();
  if (!table || table.rows[0]?.cells.length <= 1) {
    return;
  }

  const cellIndex = activeTableCell.cellIndex;
  Array.from(table.rows).forEach((row) => {
    row.cells[cellIndex]?.remove();
  });
  const fallback = table.rows[0]?.cells[Math.max(0, cellIndex - 1)] || table.rows[0]?.cells[0];
  if (fallback) {
    fallback.focus();
    placeCaretAtEnd(fallback);
    focusEditableBlock(fallback);
  }
  recordEditorSnapshot();
}

function mergeTableCellRight() {
  if (!activeTableCell) {
    return;
  }

  const nextCell = activeTableCell.nextElementSibling;
  if (!nextCell) {
    return;
  }

  const divider = normalizeBlockText(activeTableCell.textContent || "") && normalizeBlockText(nextCell.textContent || "") ? "<br>" : "";
  activeTableCell.innerHTML = `${activeTableCell.innerHTML}${divider}${nextCell.innerHTML}`;
  activeTableCell.colSpan = (activeTableCell.colSpan || 1) + (nextCell.colSpan || 1);
  nextCell.remove();
  activeTableCell.focus();
  placeCaretAtEnd(activeTableCell);
  focusEditableBlock(activeTableCell);
  recordEditorSnapshot();
}

function refreshFloatingEditorUI() {
  if (activeSelectionRange) {
    positionSelectionToolbar(activeSelectionRange);
  }
  updateBlockInserter();
  updateTableToolbar();
}

async function revealDocumentWithTypewriter(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  wrapper.querySelectorAll("mark.data-highlight").forEach((mark) => {
    mark.replaceWith(document.createTextNode(mark.textContent || ""));
  });

  const pages = Array.from(wrapper.querySelectorAll(".pdf-page"));
  refs.documentCanvas.innerHTML = "";

  for (const page of pages) {
    const pageClone = page.cloneNode(true);
    const blocks = Array.from(pageClone.querySelectorAll(".editable-block"));
    const texts = blocks.map((block) => block.textContent || "");

    blocks.forEach((block) => {
      block.textContent = "";
      block.setAttribute("contenteditable", "false");
    });

    pageClone.classList.add("is-rendering");
    refs.documentCanvas.appendChild(pageClone);
    refs.documentCanvas.closest(".editor-surface")?.scrollTo({
      top: refs.documentCanvas.scrollHeight,
      behavior: "smooth",
    });
    await sleep(160);

    for (const [index, block] of blocks.entries()) {
      const delay = texts[index].length > 80 ? 13 : texts[index].length > 28 ? 16 : 20;
      await typeTextStatic(block, texts[index], delay);
      await sleep(texts[index].length > 48 ? 42 : 28);
    }

    pageClone.classList.remove("is-rendering");
    if (page !== pages[pages.length - 1]) {
      await sleep(220);
    }
  }
}

function hydrateEmbeddedChartBlocks(root = refs.documentCanvas) {
  root.querySelectorAll(".editor-chart-block[data-chart-type=\"lifestyle\"]").forEach((block) => {
    renderLifestyleChartBlock(block);
  });
}

function renderDocumentInstant(html) {
  refs.documentCanvas.innerHTML = html;
  hydrateEmbeddedChartBlocks(refs.documentCanvas);
}

function createReportRecord(config, options = {}) {
  return {
    id: options.id || `report-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: options.title || config.documentName,
    subtitle: options.subtitle || config.service.category,
    status: options.status || "未发布",
    tone: options.tone || "unpublished",
    date: options.date || formatDate(),
    content: options.content || "",
    serviceId: config.serviceId,
    selectedSources: options.selectedSources || config.selectedSources,
    needsReveal: options.needsReveal ?? true,
    trace: options.trace || [],
  };
}

function getEditedDocumentTitle() {
  return refs.documentCanvas.querySelector(".document-title-main")?.textContent?.trim() || activeSession?.config.documentName || "";
}

function saveActiveDocument(options = {}) {
  if (!activeSession || activeSession.status !== "complete") {
    return null;
  }

  const content = refs.documentCanvas.innerHTML;
  const title = getEditedDocumentTitle();

  if (!activeSession.savedReportId) {
    const report = createReportRecord(activeSession.config, {
      status: options.status || "未发布",
      tone: options.tone || "unpublished",
      content,
      title,
      trace: activeSession.logs.map((item) => ({ ...item })),
    });

    reports.unshift(report);
    activeSession.savedReportId = report.id;
  } else {
    reports = reports.map((report) => {
      if (report.id === activeSession.savedReportId) {
        return {
          ...report,
          title,
          content,
          status: options.status || report.status,
          tone: options.tone || report.tone,
          date: formatDate(),
          needsReveal: false,
          trace: activeSession.logs.map((item) => ({ ...item })),
        };
      }
      return report;
    });
  }

  activeSession.config.documentName = title;
  refs.generationTitle.textContent = title;
  renderReports();

  if (!options.silent) {
    showToast("文档已保存", "当前结果已保存到报告文档列表，可继续编辑或返回列表。");
  }

  return activeSession.savedReportId;
}

function returnToList() {
  if (!activeSession) {
    return;
  }

  hideSelectionToolbar();
  if (activeSession.status === "running") {
    activeSession.status = "stopped";
    activeSession = null;
    showListScreen();
    showToast("已退出生成页", "当前生成流程已停止。");
    return;
  }

  activeSession = null;
  showListScreen();
}

function renderBackgroundJobs() {
  const runningJobs = backgroundJobs.filter((job) => !job.done);
  refs.jobsList.innerHTML = "";

  if (backgroundJobs.length === 0) {
    refs.floatingJobs.hidden = true;
    refs.jobsPanel.hidden = true;
    refs.jobsToggle.setAttribute("aria-expanded", "false");
    return;
  }

  refs.floatingJobs.hidden = false;
  refs.jobsCount.textContent = String(runningJobs.length);
  const primaryJob = runningJobs[0] || backgroundJobs[0];
  refs.jobsHeadline.textContent = primaryJob?.done ? "任务中心" : "正在生成中";
  refs.jobsSubline.textContent = primaryJob
    ? `${patientIdentity.name} · ${primaryJob.title}${primaryJob.done ? " 已可审阅" : ""}`
    : "查看文档生成进度";

  const fragment = document.createDocumentFragment();

  backgroundJobs.forEach((job) => {
    const item = refs.jobItemTemplate.content.firstElementChild.cloneNode(true);
    item.dataset.jobId = job.id;
    item.querySelector(".job-title").textContent = job.title;
    item.querySelector(".job-note").textContent = job.note;
    item.querySelector(".job-percent").textContent = `${job.progress}%`;
    item.querySelector(".job-current-step").textContent = job.currentStep;
    item.querySelector(".job-progress span").style.width = `${job.progress}%`;

    const stepList = item.querySelector(".job-step-list");
    stepList.hidden = !job.expanded;
    stepList.innerHTML = job.history
      .slice(-4)
      .reverse()
      .map((step) => `<div class="job-step-item">${escapeHtml(step)}</div>`)
      .join("");

    const toggleButton = item.querySelector(".job-toggle");
    toggleButton.textContent = job.expanded ? "收起进度" : "查看进度";

    const reviewButton = item.querySelector(".job-review");
    if (job.done) {
      reviewButton.hidden = false;
      reviewButton.dataset.reportId = job.reportId || "";
    }

    fragment.appendChild(item);
  });

  refs.jobsList.appendChild(fragment);
}

function finishBackgroundJob(jobId) {
  const target = backgroundJobs.find((job) => job.id === jobId);
  if (!target) {
    return;
  }

  target.done = true;
  target.note = "后台生成已完成，文档已加入列表";
  target.progress = 100;
  target.currentStep = "报告草稿已完成，可立即前往审阅。";
  target.history.push(target.currentStep);
  renderBackgroundJobs();

  const report = createReportRecord(target.config, {
    status: "未发布",
    tone: "unpublished",
    content: buildDocumentHtml(target.config),
    needsReveal: true,
    trace: target.history,
  });
  reports.unshift(report);
  target.reportId = report.id;
  renderReports();
  showToast("后台任务完成", `${target.title} 已生成完成，可立即前往审阅。`, {
    label: "立即审阅",
    onClick: () => {
      openSavedReport(report.id);
    },
  });

  window.setTimeout(() => {
    backgroundJobs = backgroundJobs.filter((job) => job.id !== jobId);
    renderBackgroundJobs();
  }, 5000);
}

function enqueueBackgroundJob(config, initialProgress = 6) {
  const steps = buildJobSteps(config);
  const job = {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    config,
    title: config.documentName,
    progress: initialProgress,
    note: "后台运行中 · 可继续处理其他患者业务",
    currentStep: steps[0],
    steps,
    stepIndex: 0,
    history: [steps[0]],
    expanded: false,
    reportId: null,
    done: false,
    timer: null,
  };

  job.timer = window.setInterval(() => {
    if (job.progress >= 100) {
      window.clearInterval(job.timer);
      finishBackgroundJob(job.id);
      return;
    }

    const increment = Math.floor(Math.random() * 12) + 7;
    job.progress = Math.min(100, job.progress + increment);

    const nextIndex = Math.min(job.steps.length - 1, Math.floor((job.progress / 100) * job.steps.length));
    if (nextIndex !== job.stepIndex) {
      job.stepIndex = nextIndex;
      job.currentStep = job.steps[job.stepIndex];
      job.history.push(job.currentStep);
    }

    renderBackgroundJobs();
  }, 900);

  backgroundJobs.unshift(job);
  renderBackgroundJobs();
  refs.jobsPanel.hidden = false;
  refs.jobsToggle.setAttribute("aria-expanded", "true");
  showToast("已加入生成队列", `正在生成 ${patientIdentity.name} 的${config.service.label}，你可以继续处理其他患者。`);
}

async function openSavedReport(reportId) {
  closePreviewModal();

  const report = ensureReportContent(reportId);
  if (!report || !report.serviceId || !services[report.serviceId]) {
    return;
  }

  const config = getReportConfig(report);

  activeSession = {
    id: `saved-${report.id}`,
    config,
    progress: 100,
    stageStates: stageDefinitions.map((stage) => ({ ...stage, status: "done" })),
    agents: baseAgents.map((agent) => ({ ...agent, status: "done", note: "生成完成，可继续编辑。" })),
    logs: [],
    status: "complete",
    backgroundized: false,
    savedReportId: report.id,
  };

  showGenerationScreen(config, { mode: "view" });
  renderStageStrip(activeSession);
  renderAgents(activeSession);
  refs.generationModeLabel.textContent = "已生成完成";
  refs.saveDocument.disabled = true;
  renderDocumentInstant(report.content);
  activeSession.logs = Array.isArray(report.trace) ? report.trace.map((item) => ({ ...item })) : [];
  renderProcessLog(activeSession);
  updateOverallProgress(activeSession, 100, "文档已生成完成，可继续编辑或保存");
  applyDataHighlights(refs.documentCanvas);
  enableEditing();
  seedEditorHistory();
  updateGenerationButtons(true);
  refs.generationModeLabel.textContent = "已生成完成";

  reports = reports.map((item) => {
    if (item.id === report.id) {
      return { ...item, needsReveal: false };
    }
    return item;
  });
}

function handleReportGridClick(event) {
  const card = event.target.closest(".report-card");
  if (!card?.dataset.reportId) {
    return;
  }

  const menuAction = event.target.closest(".report-menu-item");
  if (menuAction?.dataset.action) {
    handleReportMenuAction(card.dataset.reportId, menuAction.dataset.action);
    closeReportMenus();
    return;
  }

  if (event.target.closest(".more-button")) {
    toggleReportMenu(card);
    return;
  }

  if (event.target.closest(".report-more-menu")) {
    return;
  }

  openPreviewModal(card.dataset.reportId);
}

function handleReportGridKeydown(event) {
  if (event.target.closest(".more-button") || event.target.closest(".report-more-menu")) {
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".report-card");
  if (!card?.dataset.reportId) {
    return;
  }

  event.preventDefault();
  openPreviewModal(card.dataset.reportId);
}

async function runDirectGeneration(config) {
  const session = createSession(config);
  activeSession = session;

  showGenerationScreen(config, { mode: "run" });
  renderStageStrip(session);
  renderAgents(session);
  refs.processLog.innerHTML = "";
  updateOverallProgress(session, 4, "正在创建生成任务");
  appendLog(session, "已接收前置配置，准备启动本次报告生成流程。", "accent");

  updateStageStatus(session, "read", "running");
  await emitAgentTasks(session, [
    { agentId: "requirement", status: "running", stage: "任务理解", note: "接收本次生成请求，明确报告类型、输出格式与交付目标。", updateState: true },
    { agentId: "requirement", status: "running", stage: "任务理解", note: "识别本次需聚焦的风险评估、建议输出与文档结构要求。" },
    { agentId: "archive-read", status: "running", stage: "读取健康档案", note: "按配置读取患者基础档案、体检报告与随访资料。", updateState: true },
    { agentId: "archive-read", status: "running", stage: "读取健康档案", note: `接入输入数据范围：${config.selectedSources.join("、")}。` },
  ], 80);
  if (!isCurrentSession(session)) {
    return;
  }
  updateOverallProgress(session, 12, "正在读取患者健康档案");
  appendLog(session, `[√] 已接入患者基础画像与输入源：${config.selectedSources.join("、")}`);
  await sleep(520);
  if (!isCurrentSession(session)) {
    return;
  }

  updateStageStatus(session, "read", "done");
  updateStageStatus(session, "parse", "running");
  await emitAgentTasks(session, [
    { agentId: "archive-read", status: "done", stage: "读取健康档案", note: "患者档案数据读取完成，已建立本次分析数据上下文。", updateState: true },
    { agentId: "archive-parse", status: "running", stage: "数据解析", note: "解析患者健康档案中的既往病史、检查结果与干预记录。", updateState: true },
    { agentId: "archive-parse", status: "running", stage: "数据解析", note: "提取异常指标、复查趋势与生活方式相关数据。", updateState: true },
    { agentId: "archive-parse", status: "running", stage: "数据解析", note: "归并后续评估所需的血糖、血脂、血压、BMI 与作息运动信息。" },
  ], 80);
  if (!isCurrentSession(session)) {
    return;
  }
  updateOverallProgress(session, 24, "正在解析健康数据");
  appendLog(session, "[√] 已完成健康数据解析，发现异常指标与重点风险线索");
  await sleep(500);
  if (!isCurrentSession(session)) {
    return;
  }

  updateStageStatus(session, "parse", "done");
  updateStageStatus(session, "validate", "running");
  await emitAgentTasks(session, [
    { agentId: "archive-parse", status: "done", stage: "数据解析", note: "档案数据解析完成，已输出结构化分析结果。", updateState: true },
    { agentId: "data-validate", status: "running", stage: "必要数据校验", note: "校验风险评估所需核心字段是否充分。", updateState: true },
    { agentId: "data-validate", status: "running", stage: "必要数据校验", note: "核对异常指标、既往病史、生活方式与随访信息完整性。", updateState: true },
    { agentId: "data-validate", status: "running", stage: "必要数据校验", note: "形成当前数据充分性判断结论，并标记缺失项。", updateState: true },
  ], 80);
  if (!isCurrentSession(session)) {
    return;
  }
  updateOverallProgress(session, 36, "正在校验数据完整性");
  appendLog(session, "[*] 正在校验场景必需数据，核对核心指标完整性");
  await sleep(500);
  if (!isCurrentSession(session)) {
    return;
  }

  updateStageStatus(session, "validate", "done");
  updateStageStatus(session, "retrieve", "running");
  await emitAgentTasks(session, [
    { agentId: "data-validate", status: "done", stage: "必要数据校验", note: "必要数据校验完成，可进入知识检索与评估环节。", updateState: true },
    { agentId: "knowledge", status: "running", stage: "知识库检索", note: "检索与当前异常指标和风险主题相关的知识库内容。", updateState: true },
    { agentId: "knowledge", status: "running", stage: "知识库检索", note: "召回风险解释、干预建议和文档模板约束。", updateState: true },
    { agentId: "knowledge", status: "running", stage: "知识库检索", note: "为后续评估与建议生成匹配权威依据。", updateState: true },
  ], 80);
  if (!isCurrentSession(session)) {
    return;
  }
  updateOverallProgress(session, 52, "正在匹配知识库");
  appendLog(session, "[↻] 正在检索知识库与模板约束，匹配最合适的报告结构");
  await sleep(520);
  if (!isCurrentSession(session)) {
    return;
  }

  updateStageStatus(session, "retrieve", "done");
  updateStageStatus(session, "generate", "running");
  await emitAgentTasks(session, [
    { agentId: "knowledge", status: "done", stage: "知识库检索", note: "知识召回完成，已为各类评估与建议提供依据。", updateState: true },
    { agentId: "risk", status: "running", stage: "内容生成", note: "结合患者健康数据执行健康风险评估，识别高风险与重点关注项。", updateState: true },
    { agentId: "risk", status: "running", stage: "内容生成", note: "标注需在正式报告中重点呈现的健康风险项。", updateState: true },
    { agentId: "lifestyle", status: "running", stage: "内容生成", note: "依据生活方式评估标准对饮食、运动、睡眠与心理维度进行评分。", updateState: true },
    { agentId: "lifestyle", status: "running", stage: "内容生成", note: "输出生活方式改善优先级与主要问题项。", updateState: true },
    { agentId: "essential8", status: "running", stage: "内容生成", note: "按生命八要素评估公式整合患者关键指标并完成综合评估。", updateState: true },
    { agentId: "essential8", status: "running", stage: "内容生成", note: "输出心血管健康相关综合判断结果。", updateState: true },
    { agentId: "advice", status: "running", stage: "内容生成", note: "基于评估结论与知识库结果生成健康改善建议。", updateState: true },
    { agentId: "advice", status: "running", stage: "内容生成", note: "形成风险管理、复查与生活方式干预建议内容。", updateState: true },
    { agentId: "compose", status: "running", stage: "内容生成", note: "将评估结果与建议组织为正式报告章节结构。", updateState: true },
    { agentId: "compose", status: "running", stage: "内容生成", note: "编排前言、档案信息、评估结论和建议正文。", updateState: true },
  ], 80);
  if (!isCurrentSession(session)) {
    return;
  }
  updateOverallProgress(session, 66, "正在生成报告内容");
  appendLog(session, "[等待] 正在构建报告大纲，准备生成正式内容");
  await sleep(560);
  if (!isCurrentSession(session)) {
    return;
  }

  updateStageStatus(session, "generate", "done");
  updateStageStatus(session, "layout", "running");
  await emitAgentTasks(session, [
    { agentId: "compose", status: "done", stage: "内容生成", note: "文档内容编排完成，已形成正式输出草稿。", updateState: true },
    { agentId: "compose", status: "running", stage: "文档排版", note: "整理封面字段、目录结构与正文分页顺序。", updateState: true },
    { agentId: "compose", status: "running", stage: "文档排版", note: "统一章节层级、重点标识和版式规范。", updateState: true },
    { agentId: "quality", status: "running", stage: "文档排版", note: "对整体文档内容进行完整性、逻辑性与格式一致性质检。", updateState: true },
    { agentId: "quality", status: "running", stage: "文档排版", note: "复核风险项、建议项与评估结论的表述质量。", updateState: true },
  ], 80);
  if (!isCurrentSession(session)) {
    return;
  }
  updateOverallProgress(session, 82, "正在进行文档排版");
  appendLog(session, "[√] 正在排版正式文档，封面、目录和正文结构已就绪");
  await sleep(460);
  if (!isCurrentSession(session)) {
    return;
  }

  setGenerationView("editing");
  refs.documentCanvas.innerHTML = "";
  refs.generationModeLabel.textContent = "正在输出文档…";
  updateOverallProgress(session, 90, "正在流式输出已生成内容");
  appendLog(session, "文档内容开始输出，生成过程已同步收纳到侧边面板。", "accent");
  await revealDocumentWithTypewriter(buildDocumentHtml(session.config));
  if (!isCurrentSession(session)) {
    return;
  }

  updateStageStatus(session, "layout", "done");
  updateStageStatus(session, "complete", "running");
  updateOverallProgress(session, 96, "正在解锁在线编辑");
  appendLog(session, "正在切换到可视化编辑模式，即将开放页面内直接修改。");
  await sleep(420);
  if (!isCurrentSession(session)) {
    return;
  }

  enableEditing();
  applyDataHighlights(refs.documentCanvas);
  seedEditorHistory();
  session.status = "complete";
  refs.generationModeLabel.textContent = "已完成输出";
  updateStageStatus(session, "complete", "done");
  updateOverallProgress(session, 100, "文档已生成完成，可直接编辑或保存");
  updateGenerationButtons(true);
  refs.stopGeneration.disabled = true;
  await emitAgentTasks(session, [
    { agentId: "quality", status: "done", stage: "内容质检", note: "内容质量检验完成，文档满足当前交付要求。", updateState: true },
    { agentId: "requirement", status: "done", stage: "完成输出", note: "本次报告生成任务完成，结果已进入可视化编辑。", updateState: true },
  ], 70);
  if (!isCurrentSession(session)) {
    return;
  }
  appendLog(session, "AI 生成流程完成，当前页面已进入所见即所得编辑状态。", "accent");
}

function handleDirectStart() {
  const config = collectConfig();
  if (!config) {
    return;
  }

  closeConfigModal();
  runDirectGeneration(config);
}

function handleStopGeneration() {
  if (!activeSession || activeSession.status !== "running") {
    return;
  }

  activeSession.status = "stopped";
  activeSession = null;
  showListScreen();
  showToast("已终止生成", "当前 AI 生成流程已停止，未写入报告列表。");
}

function toggleJobsPanel() {
  const expanded = refs.jobsToggle.getAttribute("aria-expanded") === "true";
  refs.jobsToggle.setAttribute("aria-expanded", String(!expanded));
  refs.jobsPanel.hidden = expanded;
}

function handleJobsListClick(event) {
  const item = event.target.closest(".job-item");
  if (!item?.dataset.jobId) {
    return;
  }

  const job = backgroundJobs.find((entry) => entry.id === item.dataset.jobId);
  if (!job) {
    return;
  }

  if (event.target.closest(".job-toggle")) {
    job.expanded = !job.expanded;
    renderBackgroundJobs();
    return;
  }

  const reviewButton = event.target.closest(".job-review");
  if (reviewButton?.dataset.reportId) {
    openSavedReport(reviewButton.dataset.reportId);
  }
}

function closeMenuOnOutsideClick(event) {
  if (!refs.aiMenu.hidden && !event.target.closest(".actions")) {
    closeMenu();
  }

  if (!event.target.closest(".report-card-actions")) {
    closeReportMenus();
  }

  if (!refs.jobsPanel.hidden && !event.target.closest(".floating-jobs")) {
    refs.jobsPanel.hidden = true;
    refs.jobsToggle.setAttribute("aria-expanded", "false");
  }

  if (!refs.configModal.hidden && event.target === refs.configModal) {
    closeConfigModal();
  }

  if (!refs.previewModal.hidden && event.target === refs.previewModal) {
    closePreviewModal();
  }

  if (!refs.chartDataModal.hidden && event.target === refs.chartDataModal) {
    closeChartDataModal();
  }

  if (!refs.saveConfirmModal.hidden && event.target === refs.saveConfirmModal) {
    closeSaveConfirmModal();
  }

  if (!refs.actionConfirmModal.hidden && event.target === refs.actionConfirmModal) {
    closeActionConfirmModal();
  }

  if (!event.target.closest(".selection-toolbar") && !event.target.closest(".editable-block")) {
    hideSelectionToolbar();
  }

  if (!event.target.closest(".selection-tool-dropdown")) {
    closeSelectionMenus();
  }

  if (!event.target.closest(".block-inserter")) {
    refs.blockInserterMenu.hidden = true;
    refs.blockInserterToggle.setAttribute("aria-expanded", "false");
  }

  if (!event.target.closest(".table-toolbar") && !event.target.closest(".editor-table")) {
    hideTableToolbar();
  }
}

function closeOnEscape(event) {
  if (event.key !== "Escape") {
    return;
  }

  closeReportMenus();

  if (!refs.aiMenu.hidden) {
    closeMenu();
    return;
  }

  if (!refs.configModal.hidden) {
    closeConfigModal();
    return;
  }

  if (!refs.previewModal.hidden) {
    closePreviewModal();
    return;
  }

  if (!refs.chartDataModal.hidden) {
    closeChartDataModal();
    return;
  }

  if (!refs.saveConfirmModal.hidden) {
    closeSaveConfirmModal();
    return;
  }

  if (!refs.actionConfirmModal.hidden) {
    closeActionConfirmModal();
    return;
  }

  if (!refs.jobsPanel.hidden) {
    refs.jobsPanel.hidden = true;
    refs.jobsToggle.setAttribute("aria-expanded", "false");
  }

  refs.blockInserterMenu.hidden = true;
  refs.blockInserterToggle.setAttribute("aria-expanded", "false");
  clearSelectionRange();
  hideSelectionToolbar();
  hideTableToolbar();
}

function toggleThinkingBrief() {
  const expanded = refs.thinkingBriefToggle.getAttribute("aria-expanded") === "true";
  setThinkingExpanded(!expanded);
}

function init() {
  renderReports();
  renderSourceOptions();
  setScope("all");
  renderBackgroundJobs();
  renderPatientViews();
  refs.blockInserterToggle.setAttribute("aria-expanded", "false");
  refs.blockInserterMenu.hidden = true;
  refs.tableToolbar.hidden = true;

  refs.aiButton.addEventListener("click", toggleMenu);
  refs.sectionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      toggleSidebarSection(trigger);
    });
  });
  refs.menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      openConfigModal(item.dataset.service);
    });
  });

  refs.scopeSwitcher.querySelectorAll(".scope-chip").forEach((button) => {
    button.addEventListener("click", () => {
      setScope(button.dataset.scope);
    });
  });

  refs.configClose.addEventListener("click", closeConfigModal);
  refs.startDirect.addEventListener("click", handleDirectStart);
  refs.sourceSearchInput.addEventListener("input", (event) => {
    renderSourceOptions(event.target.value);
  });
  refs.sourceResults.addEventListener("click", (event) => {
    const row = event.target.closest(".source-row");
    if (row?.dataset.sourceId) {
      toggleSourceSelection(row.dataset.sourceId);
    }
  });

  refs.jobsToggle.addEventListener("click", toggleJobsPanel);
  refs.jobsList.addEventListener("click", handleJobsListClick);
  refs.thinkingBriefToggle.addEventListener("click", toggleThinkingBrief);
  refs.stopGeneration.addEventListener("click", handleStopGeneration);
  refs.saveDocument.addEventListener("click", () => {
    openSaveConfirmModal();
  });
  refs.backToList.addEventListener("click", returnToList);
  refs.documentCanvas.addEventListener("click", (event) => {
    const chartBlock = event.target.closest(".editor-chart-block[data-chart-type=\"lifestyle\"]");
    if (chartBlock && event.target.closest(".chart-extract-button")) {
      applyExtractedLifestyleData(chartBlock);
      return;
    }

    if (chartBlock && event.target.closest(".chart-edit-button")) {
      openChartDataModal(chartBlock);
      return;
    }

    const block = event.target.closest(".editable-block");
    focusEditableBlock(block);
  });
  refs.documentCanvas.addEventListener("focusin", (event) => {
    const block = event.target.closest(".editable-block");
    focusEditableBlock(block);
  });
  refs.documentCanvas.addEventListener("keydown", handleDocumentKeydown);
  refs.documentCanvas.addEventListener("input", handleDocumentInput);
  refs.textStyleTrigger.addEventListener("click", () => {
    toggleSelectionMenu("style");
  });
  refs.textStyleMenu.addEventListener("click", handleTextStyleMenuClick);
  refs.alignTrigger.addEventListener("click", () => {
    toggleSelectionMenu("align");
  });
  refs.alignMenu.addEventListener("click", handleAlignMenuClick);
  refs.orderedList.addEventListener("click", () => {
    applyListType("ol");
  });
  refs.unorderedList.addEventListener("click", () => {
    applyListType("ul");
  });
  refs.textColorSelect.addEventListener("change", (event) => {
    applyInlineStyle("foreColor", event.target.value || "#24324e");
    event.target.value = "";
  });
  refs.highlightColorSelect.addEventListener("change", (event) => {
    applyInlineStyle("hiliteColor", event.target.value || "transparent");
    event.target.value = "";
  });
  refs.blockInserterToggle.addEventListener("click", toggleBlockInserterMenu);
  refs.blockInserterMenu.addEventListener("click", handleBlockInserterClick);
  refs.imageUploadInput.addEventListener("change", handleImageSelected);
  refs.addRow.addEventListener("click", insertTableRow);
  refs.addCol.addEventListener("click", insertTableColumn);
  refs.deleteRow.addEventListener("click", deleteTableRow);
  refs.deleteCol.addEventListener("click", deleteTableColumn);
  refs.mergeCell.addEventListener("click", mergeTableCellRight);
  refs.selectionToolbar.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  refs.blockInserter.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  refs.tableToolbar.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  refs.reportGrid.addEventListener("click", handleReportGridClick);
  refs.reportGrid.addEventListener("keydown", handleReportGridKeydown);
  refs.previewClose.addEventListener("click", closePreviewModal);
  refs.previewCancel.addEventListener("click", closePreviewModal);
  refs.previewEdit.addEventListener("click", enterPreviewEdit);
  refs.chartDataClose.addEventListener("click", closeChartDataModal);
  refs.chartDataCancel.addEventListener("click", closeChartDataModal);
  refs.chartDataExtract.addEventListener("click", () => {
    if (!currentChartBlock) {
      return;
    }
    applyExtractedLifestyleData(currentChartBlock);
    renderChartDataTable(getLifestyleChartDataFromBlock(currentChartBlock));
  });
  refs.chartDataSave.addEventListener("click", saveChartDataModal);
  refs.saveConfirmClose.addEventListener("click", closeSaveConfirmModal);
  refs.saveConfirmCancel.addEventListener("click", closeSaveConfirmModal);
  refs.saveConfirmSubmit.addEventListener("click", confirmSaveAndReturn);
  refs.actionConfirmClose.addEventListener("click", closeActionConfirmModal);
  refs.actionConfirmCancel.addEventListener("click", closeActionConfirmModal);
  refs.actionConfirmSubmit.addEventListener("click", confirmActionModal);

  document.addEventListener("click", closeMenuOnOutsideClick);
  document.addEventListener("keydown", closeOnEscape);
  document.addEventListener("selectionchange", handleSelectionChange);
  getEditorSurface()?.addEventListener("scroll", refreshFloatingEditorUI, { passive: true });

  window.requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });

  if (window.__CODEX_ENABLE_BACKGROUND_DEMO__) {
    enqueueBackgroundJob({
      serviceId: "exam",
      service: services.exam,
      documentName: generateDocumentName(services.exam),
      scope: "all",
      selectedSources: ["全部档案数据"],
    });
  }
}

init();
