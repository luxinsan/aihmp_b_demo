import { lazy, Suspense } from "react";
import type { DraftState } from "../types/draftState";
import type { GenerationSession } from "../types/generationSession";
import type { ConfirmActionKind } from "../types/modal";
import type { ReportRecord } from "../types/report";
import { PatientSidebarPanel } from "../features/patient/components/PatientSidebarPanel";
import { ReportWorkspacePreview } from "../features/reports/ReportWorkspacePreview";

const QuestionnaireWorkspace = lazy(() =>
  import("../features/questionnaires/QuestionnaireWorkspace").then((module) => ({
    default: module.QuestionnaireWorkspace,
  })),
);

type WorkspaceRecordStageProps = {
  activePatientTab: string;
  draftStates: Record<string, DraftState>;
  generationSessions: GenerationSession[];
  generationSession: GenerationSession | null;
  onPatientTabSelect: (tab: string) => void;
  reports: ReportRecord[];
  selectedReportId: string | null;
  onOpenGenerationStage: (reportId?: string) => void;
  onOpenConfirm: (reportId: string, action: ConfirmActionKind) => void;
  onOpenEdit: (reportId: string) => void;
  onOpenGenerate: () => void;
  onOpenGenerateForService: (serviceId: ReportRecord["serviceId"]) => void;
  onOpenPreview: (reportId: string) => void;
  onSelectReport: (reportId: string) => void;
};

export function WorkspaceRecordStage({
  activePatientTab,
  draftStates,
  generationSessions,
  generationSession,
  onPatientTabSelect,
  reports,
  selectedReportId,
  onOpenGenerationStage,
  onOpenConfirm,
  onOpenEdit,
  onOpenGenerate,
  onOpenGenerateForService,
  onOpenPreview,
  onSelectReport,
}: WorkspaceRecordStageProps) {
  return (
    <>
      <PatientSidebarPanel activeTab={activePatientTab} onTabSelect={onPatientTabSelect} />
      {activePatientTab === "量表记录" ? (
        <Suspense fallback={<div className="questionnaire-loading-state">量表记录加载中...</div>}>
          <QuestionnaireWorkspace />
        </Suspense>
      ) : (
        <ReportWorkspacePreview
          reports={reports}
          selectedReportId={selectedReportId}
          draftStates={draftStates}
          generationSessions={generationSessions}
          generationSession={generationSession}
          onOpenGenerationStage={onOpenGenerationStage}
          onSelectReport={onSelectReport}
          onOpenEdit={onOpenEdit}
          onOpenGenerate={onOpenGenerate}
          onOpenGenerateForService={onOpenGenerateForService}
          onOpenPreview={onOpenPreview}
          onOpenConfirm={onOpenConfirm}
        />
      )}
    </>
  );
}
