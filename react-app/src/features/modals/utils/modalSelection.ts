import type { ActiveModal } from "../../../types/modal";
import type { ReportRecord } from "../../../types/report";

export function resolveSelectedReport(
  reports: ReportRecord[],
  selectedReportId: string | null,
) {
  return reports.find((report) => report.id === selectedReportId) ?? reports[0] ?? null;
}

export function resolvePreviewReport(
  activeModal: ActiveModal,
  reports: ReportRecord[],
  fallbackReport: ReportRecord | null,
) {
  if (activeModal?.kind !== "preview") {
    return fallbackReport;
  }

  return reports.find((report) => report.id === activeModal.reportId) ?? fallbackReport;
}

export function resolveConfirmReport(
  activeModal: ActiveModal,
  reports: ReportRecord[],
  fallbackReport: ReportRecord | null,
) {
  if (activeModal?.kind !== "confirm") {
    return fallbackReport;
  }

  return reports.find((report) => report.id === activeModal.reportId) ?? fallbackReport;
}
