import type { GenerationLogEntry, GenerationSession } from "../../types/generationSession";

export type GenerationLogGroup = {
  id: string;
  tone?: GenerationLogEntry["tone"];
  kind: string;
  label: string;
  source: string;
  stage: string;
  status: GenerationLogEntry["status"];
  time: string;
  bodies: string[];
};

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseLogPresentation(entry: GenerationLogEntry) {
  const text = entry.text;
  const tone = entry.tone || "normal";

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

export function getLogStatusIcon(kind: string) {
  switch (kind) {
    case "done":
      return "✓";
    case "system":
      return "•";
    default:
      return "";
  }
}

export function formatSessionLogTime(
  updatedAt: number,
  createdAt: number,
  totalLogs: number,
  index: number,
) {
  const offset = Math.max(totalLogs - index - 1, 0) * 2 * 60 * 1000;
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(Math.max(updatedAt - offset, createdAt));
}

export function buildLogGroups(
  logs: GenerationSession["logs"],
  updatedAt: number,
  createdAt: number,
) {
  const groups: GenerationLogGroup[] = [];

  logs.forEach((item, index) => {
    const meta = parseLogPresentation(item);
    const previousGroup = groups[groups.length - 1];
    const fallbackTime = item.time || formatSessionLogTime(updatedAt, createdAt, logs.length, index);
    const canMerge =
      item.tone === "agent" &&
      previousGroup &&
      previousGroup.tone === item.tone &&
      previousGroup.source === (item.source || "AI") &&
      previousGroup.stage === (item.stage || "处理中") &&
      previousGroup.status === (item.status || null) &&
      previousGroup.kind === meta.kind;

    if (canMerge) {
      previousGroup.bodies.push(meta.body);
      previousGroup.time = fallbackTime;
      return;
    }

    groups.push({
      id: item.id || `log-${index}`,
      tone: item.tone,
      kind: meta.kind,
      label: meta.label,
      source: item.source || (item.tone === "accent" ? "系统" : "AI 思考"),
      stage: item.stage || "处理中",
      status: item.status || null,
      time: fallbackTime,
      bodies: [meta.body],
    });
  });

  return groups;
}

export function getRunningStageLabel(session: GenerationSession) {
  return (
    session.stages.find((stage) => stage.status === "running")?.label ??
    (session.status === "completed" ? "已完成全部步骤" : "等待继续处理")
  );
}

export function getJobNote(session: GenerationSession) {
  if (session.status === "processing") {
    return "显示文档名称与整体进度";
  }

  if (session.status === "completed") {
    return "后台生成已完成，文档已加入列表";
  }

  return "当前流程已终止";
}

export function buildFloatingJobsSummary(
  sessions: GenerationSession[],
  activeReportId: string | null,
) {
  const orderedSessions = [...sessions].sort((left, right) => {
    if (left.reportId === activeReportId) {
      return -1;
    }
    if (right.reportId === activeReportId) {
      return 1;
    }
    if (left.status === "processing" && right.status !== "processing") {
      return -1;
    }
    if (right.status === "processing" && left.status !== "processing") {
      return 1;
    }
    return right.updatedAt - left.updatedAt;
  });
  const primarySession =
    orderedSessions.find((session) => session.reportId === activeReportId) ??
    orderedSessions.find((session) => session.status === "processing") ??
    orderedSessions[0] ??
    null;

  return {
    orderedSessions,
    primarySession,
    jobsHeadline: primarySession?.status === "processing" ? "正在生成中" : "任务中心",
    jobsSubline: primarySession
      ? `${primarySession.patientName} · ${primarySession.reportTitle}${
          primarySession.status === "completed" ? " 已可审阅" : ""
        }`
      : "查看文档生成进度",
  };
}

export function normalizeBlockText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

const normalRiskTerms = [
  "空腹血糖",
  "甘油三酯",
  "总胆固醇",
  "BMI",
  "腰围",
  "胸闷",
  "收缩压",
  "血脂",
  "常规风险",
  "常规关注",
];

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

function applyTermHighlights(terms: string[], className: string, sourceHtml: string) {
  const tokens: Array<{ token: string; html: string }> = [];
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

export function decorateEditableBlock(block: HTMLElement) {
  if (block.dataset.userStyled === "true" || block.querySelector("img, svg, table")) {
    return;
  }

  const text = normalizeBlockText(block.textContent ?? "");
  const escaped = escapeHtml(text);
  const withHighRisk = applyTermHighlights(highRiskTerms, "risk-inline-high", escaped);
  const highlighted = applyTermHighlights(normalRiskTerms, "data-highlight", withHighRisk);
  block.innerHTML = highlighted || "&nbsp;";
}
