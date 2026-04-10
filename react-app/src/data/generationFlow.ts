import type { GenerationLogEntry, GenerationStageItem } from "../types/generationSession";

type GenerationSnapshot = {
  progress: number;
  modeLabel: string;
  briefTitle: string;
  briefText: string;
  overallStatus: string;
  stages: GenerationStageItem[];
  logs: GenerationLogEntry[];
};

export const generationSnapshots: GenerationSnapshot[] = [
  {
    progress: 18,
    modeLabel: "AI 正在生成中…",
    briefTitle: "需求理解",
    briefText: "正在整理本次文档生成任务的目标、患者情况和模板约束。",
    overallStatus: "已完成目标拆解，准备读取相关档案资料",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "running" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "pending" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "pending" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "pending" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "pending" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "pending" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "pending" },
    ],
    logs: [
      { id: "log-1", text: "接收本次生成请求，明确报告类型、输出格式与交付目标。", tone: "agent", source: "需求理解 Agent", stage: "任务理解", status: "running" },
      { id: "log-2", text: "识别本次需聚焦的风险评估、建议输出与文档结构要求。", tone: "agent", source: "需求理解 Agent", stage: "任务理解", status: "running" },
      { id: "log-3", text: "正在汇总患者基础资料，并锁定需要优先参考的病历、体检和随访信息。", tone: "normal", source: "AI 思考" },
    ],
  },
  {
    progress: 44,
    modeLabel: "AI 正在生成中…",
    briefTitle: "档案读取与知识检索",
    briefText: "正在归纳患者档案异常点，并召回对应解释与干预建议。",
    overallStatus: "档案与知识素材已汇总，准备进入文档编排",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "done" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "done" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "done" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "running" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "pending" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "pending" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "pending" },
    ],
    logs: [
      { id: "log-1", text: "档案数据读取完成，已汇总患者基础资料。", tone: "agent", source: "档案数据读取 Agent", stage: "读取健康档案", status: "done" },
      { id: "log-2", text: "体检指标与病历数据解析完成，已提取重点异常项。", tone: "agent", source: "档案数据解析 Agent", stage: "数据解析", status: "done" },
      { id: "log-3", text: "必要数据校验完成，可进入知识检索与评估环节。", tone: "agent", source: "必要数据校验 Agent", stage: "检验数据完整性", status: "done" },
      { id: "log-4", text: "已抽取关键异常指标，并开始检索对应风险说明与建议模板。", tone: "agent", source: "知识库检索 Agent", stage: "检索知识库", status: "running" },
      { id: "log-5", text: "正在比对不同报告类型所需的段落结构和重点表述。", tone: "normal", source: "AI 思考" },
    ],
  },
  {
    progress: 79,
    modeLabel: "AI 正在生成中…",
    briefTitle: "内容生成",
    briefText: "正在输出封面、目录和正文结构，并同步整理重点结论。",
    overallStatus: "正文结构已成型，正在做版式和内容一致性检查",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "done" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "done" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "done" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "done" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "running" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "pending" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "pending" },
    ],
    logs: [
      { id: "log-1", text: "结合患者健康数据执行健康风险评估，识别高风险与重点关注项。", tone: "agent", source: "健康风险评估 Agent", stage: "内容生成", status: "running" },
      { id: "log-2", text: "依据生活方式评估标准对饮食、运动、睡眠与心理维度进行评分。", tone: "agent", source: "生活方式评估 Agent", stage: "内容生成", status: "running" },
      { id: "log-3", text: "按生命八要素评估公式整合患者关键指标并完成综合评估。", tone: "agent", source: "生命八要素评估 Agent", stage: "内容生成", status: "running" },
      { id: "log-4", text: "将评估结果与建议组织为正式报告章节结构。", tone: "agent", source: "文档内容编排 Agent", stage: "内容生成", status: "running" },
      { id: "log-5", text: "[等待] 正在构建报告大纲，准备生成正式内容" },
    ],
  },
  {
    progress: 82,
    modeLabel: "AI 正在生成中…",
    briefTitle: "文档排版",
    briefText: "正在整理封面、目录和正文的分页顺序，并统一章节层级与重点标识。",
    overallStatus: "正在进行文档排版",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "done" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "done" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "done" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "done" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "done" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "running" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "pending" },
    ],
    logs: [
      { id: "log-1", text: "文档内容编排完成，已形成正式输出草稿。", tone: "agent", source: "文档内容编排 Agent", stage: "内容生成", status: "done" },
      { id: "log-2", text: "整理封面字段、目录结构与正文分页顺序。", tone: "agent", source: "文档内容编排 Agent", stage: "文档排版", status: "running" },
      { id: "log-3", text: "统一章节层级、重点标识和版式规范。", tone: "agent", source: "文档内容编排 Agent", stage: "文档排版", status: "running" },
      { id: "log-4", text: "对整体文档内容进行完整性、逻辑性与格式一致性质检。", tone: "agent", source: "内容质量检验 Agent", stage: "文档排版", status: "running" },
      { id: "log-5", text: "[√] 正在排版正式文档，封面、目录和正文结构已就绪" },
    ],
  },
  {
    progress: 90,
    modeLabel: "正在输出文档…",
    briefTitle: "文档输出",
    briefText: "文档内容正在进入可视化画布，生成过程会同步收纳到左侧面板。",
    overallStatus: "正在流式输出已生成内容",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "done" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "done" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "done" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "done" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "done" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "running" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "pending" },
    ],
    logs: [
      { id: "log-1", text: "文档内容开始输出，生成过程已同步收纳到侧边面板。", tone: "accent", source: "系统" },
    ],
  },
  {
    progress: 96,
    modeLabel: "正在输出文档…",
    briefTitle: "解锁编辑",
    briefText: "正在切换到可视化编辑模式，即将开放页面内直接修改。",
    overallStatus: "正在解锁在线编辑",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "done" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "done" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "done" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "done" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "done" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "done" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "running" },
    ],
    logs: [
      { id: "log-1", text: "正在切换到可视化编辑模式，即将开放页面内直接修改。", tone: "normal", source: "AI 思考" },
    ],
  },
  {
    progress: 100,
    modeLabel: "已完成输出",
    briefTitle: "完成",
    briefText: "本次文档已完成生成与初步质检，可以直接继续编辑或保存。",
    overallStatus: "文档已生成完成，可直接编辑或保存",
    stages: [
      { id: "read", label: "读取健康档案", desc: "汇总患者基础资料", status: "done" },
      { id: "parse", label: "数据解析", desc: "解析体检指标与病历", status: "done" },
      { id: "validate", label: "检验数据完整性", desc: "核验场景必需信息", status: "done" },
      { id: "retrieve", label: "检索知识库", desc: "匹配干预知识与模板", status: "done" },
      { id: "generate", label: "内容生成", desc: "组织报告草稿内容", status: "done" },
      { id: "layout", label: "文档排版", desc: "生成正式文档版式", status: "done" },
      { id: "complete", label: "完成输出", desc: "进入可视化编辑", status: "done" },
    ],
    logs: [
      { id: "log-1", text: "文档内容编排完成，已形成正式输出草稿。", tone: "agent", source: "文档内容编排 Agent", stage: "内容生成", status: "done" },
      { id: "log-2", text: "整理封面字段、目录结构与正文分页顺序。", tone: "agent", source: "文档内容编排 Agent", stage: "文档排版", status: "running" },
      { id: "log-3", text: "对整体文档内容进行完整性、逻辑性与格式一致性质检。", tone: "agent", source: "内容质量检验 Agent", stage: "文档排版", status: "running" },
      { id: "log-4", text: "文档内容开始输出，生成过程已同步收纳到侧边面板。", tone: "accent", source: "系统" },
      { id: "log-5", text: "AI 生成流程完成，当前页面已进入所见即所得编辑状态。", tone: "accent", source: "系统" },
    ],
  },
];
