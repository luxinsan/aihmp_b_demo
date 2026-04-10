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

export const generationMenuOptions: Array<{
  id: string;
  serviceId: ReportRecord["serviceId"];
  label: string;
  tone: "risk" | "plan" | "exam";
}> = [
  { id: "risk-basic", serviceId: "risk", label: "健康风险评估", tone: "risk" },
  { id: "risk", serviceId: "risk", label: "健康风险评估与建议", tone: "risk" },
  { id: "exam", serviceId: "exam", label: "制定体检方案", tone: "exam" },
  { id: "plan", serviceId: "plan", label: "制定健康管理方案", tone: "plan" },
];
