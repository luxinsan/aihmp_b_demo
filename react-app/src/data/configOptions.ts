import { services } from "./services";
import type { ReportRecord } from "../types/report";

export const sourceOptions = [
  { id: "exam-2026-q1", name: "2026 Q1 入院体检报告", meta: "2026/03/28 · 128 项指标 · 入院体检" },
  { id: "review-2026-followup", name: "2026/03 随访复查摘要", meta: "2026/03/23 · 线上随访 · 复查摘要" },
  { id: "exam-2025-annual", name: "2025 年度体检报告", meta: "2025/12/19 · 年度归档 · 常规体检" },
  { id: "exam-2025-cardiac", name: "2025 心血管专项检查", meta: "2025/11/06 · 专项检查 · 心电与血脂" },
  { id: "exam-2025-metabolism", name: "2025 代谢复查报告", meta: "2025/09/14 · 复查报告 · 血糖与肝肾" },
  { id: "exam-2025-physical", name: "2025 入职体检报告", meta: "2025/08/03 · 入职体检 · 常规项目" },
  { id: "exam-2024-q4", name: "2024 Q4 慢病随访体检", meta: "2024/12/08 · 随访体检 · 慢病管理" },
] as const;

export const serviceOptions: Array<{ id: ReportRecord["serviceId"]; label: string }> = [
  { id: "risk", label: services.risk.label },
  { id: "plan", label: services.plan.label },
  { id: "exam", label: services.exam.label },
];

export const configTemplateOptions: Record<
  ReportRecord["serviceId"],
  Array<{ id: string; label: string; description: string }>
> = {
  exam: [
    { id: "exam-plan", label: "定制体检方案", description: "用于生成定制体检方案文档。" },
  ],
  risk: [
    { id: "risk-interpretation", label: "体检报告解读", description: "用于生成体检报告解读文档。" },
  ],
  plan: [
    { id: "plan-28d", label: "28天健康管理方案", description: "用于生成 28 天健康管理方案文档。" },
    { id: "plan-90d", label: "90天健康管理方案", description: "用于生成 90 天健康管理方案文档。" },
  ],
};

export const generationMenuOptions: Array<{
  id: string;
  serviceId: ReportRecord["serviceId"];
  label: string;
  tone: "risk" | "plan" | "exam";
}> = [
  { id: "exam-plan", serviceId: "exam", label: "定制体检方案", tone: "exam" },
  { id: "risk-interpretation", serviceId: "risk", label: "体检报告解读", tone: "risk" },
  { id: "plan-custom", serviceId: "plan", label: "定制健康管理方案", tone: "plan" },
];
