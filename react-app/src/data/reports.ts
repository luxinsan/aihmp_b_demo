import type { ReportRecord } from "../types/report";
import { patientProfile } from "./patientProfile";

export const initialReports: ReportRecord[] = [
  { id: "seed-1", title: `${patientProfile.identity.maskedName} · 90天健康管理方案`, subtitle: "90天健康管理方案", serviceId: "plan", status: "未发布", tone: "unpublished", date: "2026/03/31", content: "" },
  { id: "seed-2", title: `${patientProfile.identity.maskedName} · 90天健康管理方案`, subtitle: "90天健康管理方案", serviceId: "plan", status: "已发布", tone: "published", date: "2026/03/28", content: "" },
  { id: "seed-3", title: `${patientProfile.identity.maskedName} · 健康风险评估报告`, subtitle: "健康风险评估报告", serviceId: "risk", status: "未发布", tone: "unpublished", date: "2026/03/31", content: "" },
  { id: "seed-4", title: `${patientProfile.identity.maskedName} · 健康风险评估报告与建议`, subtitle: "健康风险评估报告与建议", serviceId: "risk", status: "已发布", tone: "published", date: "2026/03/27", content: "" },
  { id: "seed-5", title: `${patientProfile.identity.maskedName} · 体检方案`, subtitle: "体检方案", serviceId: "exam", status: "未发布", tone: "unpublished", date: "2026/03/26", content: "" },
  { id: "seed-6", title: `${patientProfile.identity.maskedName} · 健康风险评估报告`, subtitle: "健康风险评估报告", serviceId: "risk", status: "未发布", tone: "unpublished", date: "2026/03/24", content: "" },
  { id: "seed-7", title: `${patientProfile.identity.maskedName} · 体检方案`, subtitle: "体检方案", serviceId: "exam", status: "已发布", tone: "published", date: "2026/03/20", content: "" },
  { id: "seed-8", title: `${patientProfile.identity.maskedName} · 健康风险评估报告与建议`, subtitle: "健康风险评估报告与建议", serviceId: "risk", status: "未发布", tone: "unpublished", date: "2026/03/18", content: "" },
  { id: "seed-9", title: `${patientProfile.identity.maskedName} · 健康风险评估报告`, subtitle: "健康风险评估报告", serviceId: "risk", status: "已发布", tone: "published", date: "2025/04/10", content: "" },
];
