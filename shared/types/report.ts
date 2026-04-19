export type SharedReportServiceId = "plan" | "risk" | "exam";

export type SharedReportStatus = "已发布" | "未发布";

export type SharedReportTone = "published" | "unpublished";

export type SharedReportRecord = {
  id: string;
  title: string;
  subtitle: string;
  serviceId: SharedReportServiceId;
  status: SharedReportStatus;
  tone: SharedReportTone;
  date: string;
  content: string;
};
