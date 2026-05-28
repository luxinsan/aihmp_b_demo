import { lazy, startTransition, Suspense, useEffect, useState } from "react";
import {
  initialReports,
  patientContactItems,
  patientProfile,
  patientTabs,
} from "../../shared/adapters/admin";
import { PatientTabPageFrame } from "./components/layout/PatientTabPageFrame";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { WorkspaceTopbar } from "./components/WorkspaceTopbar";
import {
  workspaceBreadcrumb,
  workspaceConnectionLabel,
  workspaceNavItems,
} from "./data/workspaceChrome";
import { GenerationFloatingJobs } from "./features/generation/components/GenerationFloatingJobs";
import { GenerationWorkspace } from "./features/generation/GenerationWorkspace";
import { LoginPage } from "./features/auth/LoginPage";
import { ModalHost } from "./features/modals/ModalHost";
import { PatientHealthPlanStage } from "./features/patient/components/PatientHealthPlanStage";
import { PatientHealthPlanEditorStage } from "./features/patient/components/PatientHealthPlanEditorStage";
import { PatientCheckInRecordsStage } from "./features/patient/components/PatientCheckInRecordsStage";
import { PatientProfileCard } from "./features/patient/components/PatientProfileCard";
import { PatientTabsCard } from "./features/patient/components/PatientTabsCard";
import { ReportPanelHeaderActions } from "./features/reports/components/ReportPanelHeader";
import { ReportListPanel } from "./features/reports/components/ReportListPanel";
import { useDocumentDraftWorkspace } from "./hooks/useDocumentDraftWorkspace";
import { useDraftConfigState } from "./hooks/useDraftConfigState";
import { useGenerationWorkspace } from "./hooks/useGenerationWorkspace";
import type { ActiveModal } from "./types/modal";
import type { ReportRecord } from "./types/report";
import { createDocumentDraft } from "./utils/documentDraft";
import { removeReport, toggleReportPublishState } from "./utils/migrationWorkspace";
import { createDirectNewHealthPlanEditorDraft, initialHealthPlanEditorDraft } from "./data/healthPlanEditor";
import type { HealthPlanEditorDraft } from "./types/healthPlanEditor";
import {
  createManagementPlanReport,
  type ManagementPlanReportKind,
} from "./data/managementPlanReports";

const QuestionnaireWorkspace = lazy(() =>
  import("./features/questionnaires/QuestionnaireWorkspace").then((module) => ({
    default: module.QuestionnaireWorkspace,
  })),
);

export default function App() {
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialReports[0]?.id ?? null);
  const [activePatientTab, setActivePatientTab] = useState("健康计划");
  const [healthPlanSubview, setHealthPlanSubview] = useState<"overview" | "checkin-records" | "editor">("overview");
  const [healthPlanEditorDraft, setHealthPlanEditorDraft] = useState<HealthPlanEditorDraft>(initialHealthPlanEditorDraft);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const { draftConfig, handleDraftConfigChange, openConfigForService } = useDraftConfigState({
    defaultServiceId: "risk",
    onOpenConfigModal: () => setActiveModal({ kind: "config" }),
  });

  const {
    documentDrafts,
    draftStates,
    handleDraftChange,
    handleRemoveDraftArtifacts,
    registerGeneratedDraft,
  } = useDocumentDraftWorkspace({
    reports,
    setActionMessage,
    setActiveModal,
    setReports,
    setSelectedReportId,
  });

  const {
    generationSessions,
    generationVisible,
    generationSession,
    handleBackgroundGeneration,
    handleClearFinishedGenerations,
    handleCloseGeneration,
    handleDismissGeneration,
    handleOpenGeneratedPreview,
    handleOpenEditorStage,
    handleRemoveGenerationArtifacts,
    handleReturnGeneratedToList,
    handleShowGeneration,
    handleStartGeneration,
    handleStopGeneration,
  } = useGenerationWorkspace({
    draftConfig,
    setActionMessage,
    setActiveModal,
    setReports,
    setSelectedReportId,
    registerGeneratedDraft,
  });

  useEffect(() => {
    document.title = authenticated ? "AI 健康管理系统 · 客户档案" : "AI 健康管理系统 · 登录";
    document.body.classList.add("loaded");
    return () => {
      document.body.classList.remove("loaded");
      document.body.classList.remove("mode-generation");
    };
  }, [authenticated]);

  useEffect(() => {
    if (!reports.length) {
      setSelectedReportId(null);
      return;
    }

    const firstReport = reports[0];
    if (firstReport && (!selectedReportId || !reports.some((report) => report.id === selectedReportId))) {
      setSelectedReportId(firstReport.id);
    }
  }, [reports, selectedReportId]);

  useEffect(() => {
    if (generationVisible) {
      document.body.classList.add("mode-generation");
    } else {
      document.body.classList.remove("mode-generation");
    }
  }, [generationVisible]);

  useEffect(() => {
    if (activePatientTab !== "健康计划" && healthPlanSubview !== "overview") {
      setHealthPlanSubview("overview");
    }
  }, [activePatientTab, healthPlanSubview]);

  useEffect(() => {
    if (!actionMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage("");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [actionMessage]);

  function handleCreateManagementPlanReport(kind: ManagementPlanReportKind) {
    const { draft, report } = createManagementPlanReport(kind);
    const existingReport = reports.find((item) => item.id === report.id);
    const existingDraftState = draftStates[report.id];

    if (!existingReport || !existingDraftState?.dirty) {
      registerGeneratedDraft(report.id, draft);
      setReports((currentReports) => {
        if (!existingReport) {
          return [report, ...currentReports];
        }

        return currentReports.map((item) => (item.id === report.id ? report : item));
      });
    }

    setSelectedReportId(report.id);
    setOpenMenuId(null);
  }

  const questionnaireWorkspace = (
    <Suspense fallback={<div className="questionnaire-loading-state">量表记录加载中...</div>}>
      <QuestionnaireWorkspace />
    </Suspense>
  );

  function handleOpenPreview(reportId: string) {
    setSelectedReportId(reportId);
    setOpenMenuId(null);
    setActiveModal({ kind: "preview", reportId });
  }

  function handleOpenConfirm(reportId: string, action: "toggle-publish" | "delete") {
    setSelectedReportId(reportId);
    setOpenMenuId(null);
    setActiveModal({ kind: "confirm", reportId, action });
  }

  function handleOpenEdit(reportId: string) {
    const report = reports.find((item) => item.id === reportId);
    if (!report) {
      return;
    }

    if (!documentDrafts[reportId]) {
      registerGeneratedDraft(
        reportId,
        report.savedDraft
          ? (typeof structuredClone === "function"
              ? structuredClone(report.savedDraft)
              : JSON.parse(JSON.stringify(report.savedDraft)))
          : createDocumentDraft(report),
      );
    }

    setSelectedReportId(reportId);
    setActiveModal(null);
    setOpenMenuId(null);
    handleOpenEditorStage(report);
  }

  function handleConfirmAction() {
    if (!activeModal || activeModal.kind !== "confirm") {
      return;
    }

    if (activeModal.action === "toggle-publish") {
      const current = reports.find((report) => report.id === activeModal.reportId);
      if (!current) {
        setActiveModal(null);
        return;
      }

      const nextStatus = current.status === "已发布" ? "未发布" : "已发布";
      setReports((currentReports) =>
        toggleReportPublishState(currentReports, activeModal.reportId, nextStatus),
      );
      setActionMessage(nextStatus === "已发布" ? "已发布" : "已撤销");
      setActiveModal(null);
      return;
    }

    setReports((currentReports) => removeReport(currentReports, activeModal.reportId));
    handleRemoveDraftArtifacts(activeModal.reportId);
    handleRemoveGenerationArtifacts(activeModal.reportId);
    setActionMessage("已删除");
    setActiveModal(null);
  }

  const toast = actionMessage ? (
    <div className="toast-stack" aria-live="polite">
      <div className="toast">{actionMessage}</div>
    </div>
  ) : null;

  if (!authenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setAuthenticated(true);
          setActionMessage("已进入工作台");
        }}
      />
    );
  }

  if (generationVisible && generationSession) {
    return (
      <>
        <GenerationWorkspace
          documentDraft={documentDrafts[generationSession.reportId]}
          onDraftChange={(nextDraft) =>
            handleDraftChange(generationSession.reportId, nextDraft)
          }
          session={generationSession}
          onBackground={() => handleBackgroundGeneration(generationSession.reportId)}
          onClose={handleCloseGeneration}
          onOpenPreview={() => handleOpenGeneratedPreview(generationSession.reportId)}
          onReturnToList={(draft, contentHtml) =>
            handleReturnGeneratedToList(generationSession.reportId, draft, contentHtml)
          }
          onStop={() => handleStopGeneration(generationSession.reportId)}
        />
        {toast}
      </>
    );
  }

  if (activePatientTab === "健康计划" && healthPlanSubview === "editor") {
    return (
      <>
        <section className="app-shell" id="listScreen">
          <WorkspaceSidebar items={workspaceNavItems} />

          <main className="workspace">
            <WorkspaceTopbar
              breadcrumb={workspaceBreadcrumb}
              connectionLabel={workspaceConnectionLabel}
            />

            <section className="content-shell health-plan-editor-screen">
              <PatientHealthPlanEditorStage
                draft={healthPlanEditorDraft}
                onBack={() => setHealthPlanSubview("overview")}
                onSave={(nextDraft) => {
                  setHealthPlanEditorDraft(nextDraft);
                  setHealthPlanSubview("overview");
                  setActionMessage("已保存");
                }}
              />
            </section>
          </main>
        </section>

        {toast}
      </>
    );
  }

  return (
    <>
      <section className="app-shell" id="listScreen">
        <WorkspaceSidebar items={workspaceNavItems} />

        <main className="workspace">
          <WorkspaceTopbar
            breadcrumb={workspaceBreadcrumb}
            connectionLabel={workspaceConnectionLabel}
          />

          <section className="content-shell">
            <aside className="patient-panel">
              <PatientProfileCard
                contactItems={patientContactItems}
                identity={patientProfile.identity}
              />
              <PatientTabsCard
                activeTab={activePatientTab}
                tabs={patientTabs}
                onTabSelect={(tab) => {
                  startTransition(() => {
                    setActivePatientTab(tab);
                    if (tab !== "健康计划") {
                      setHealthPlanSubview("overview");
                    }
                  });
                }}
              />
            </aside>

            {activePatientTab === "量表记录" ? (
              questionnaireWorkspace
            ) : activePatientTab === "健康计划" ? (
              healthPlanSubview === "checkin-records" ? (
                <PatientCheckInRecordsStage onBack={() => setHealthPlanSubview("overview")} />
              ) : (
                <PatientHealthPlanStage
                  draft={healthPlanEditorDraft}
                  onEditPlan={() => setHealthPlanSubview("editor")}
                  onCreateAiPlan={() => {
                    setHealthPlanEditorDraft(initialHealthPlanEditorDraft);
                    setHealthPlanSubview("editor");
                  }}
                  onCreateDirectPlan={() => {
                    setHealthPlanEditorDraft(createDirectNewHealthPlanEditorDraft());
                    setHealthPlanSubview("editor");
                  }}
                  onOpenCheckInRecords={() => setHealthPlanSubview("checkin-records")}
                />
              )
            ) : (
              <PatientTabPageFrame
                actions={
                  <ReportPanelHeaderActions
                    generationSession={generationSession}
                    onCreateManagementPlanReport={handleCreateManagementPlanReport}
                    onOpenGenerate={() => setActiveModal({ kind: "config" })}
                    onOpenGenerateForService={openConfigForService}
                    onOpenGenerationStage={handleShowGeneration}
                  />
                }
                className="report-page-frame"
                title="报告文档"
              >
                <ReportListPanel
                  draftStates={draftStates}
                  generationSessions={generationSessions}
                  generationSession={generationSession}
                  openMenuId={openMenuId}
                  reports={reports}
                  selectedReportId={selectedReportId}
                  onCloseMenu={() => setOpenMenuId(null)}
                  onOpenConfirm={handleOpenConfirm}
                  onOpenEdit={handleOpenEdit}
                  onOpenPreview={handleOpenPreview}
                  onToggleMenu={(reportId) =>
                    setOpenMenuId((current) => (current === reportId ? null : reportId))
                  }
                />
              </PatientTabPageFrame>
            )}
          </section>
        </main>

        <ModalHost
          activeModal={activeModal}
          reports={reports}
          selectedReportId={selectedReportId}
          draftConfig={draftConfig}
          documentDrafts={documentDrafts}
          draftStates={draftStates}
          generationSessions={generationSessions}
          onClose={() => setActiveModal(null)}
          onConfirmAction={handleConfirmAction}
          onOpenConfirm={handleOpenConfirm}
          onOpenConfig={() => setActiveModal({ kind: "config" })}
          onOpenGenerationStage={handleShowGeneration}
          onOpenPreviewFromSelection={() => {
            if (selectedReportId) {
              setActiveModal({ kind: "preview", reportId: selectedReportId });
            }
          }}
          onDraftConfigChange={handleDraftConfigChange}
          onStartGeneration={handleStartGeneration}
          onEnterEdit={handleOpenEdit}
        />
      </section>

      {generationSessions.some((session) => session.status === "processing") ? (
        <GenerationFloatingJobs
          activeReportId={generationSession?.reportId ?? null}
          jobsOpen={jobsOpen}
          onClearFinished={handleClearFinishedGenerations}
          onDismiss={handleDismissGeneration}
          onOpenPreview={handleOpenGeneratedPreview}
          onOpenStage={handleShowGeneration}
          onToggleOpen={() => setJobsOpen((current) => !current)}
          sessions={generationSessions}
        />
      ) : null}

      {toast}
    </>
  );
}
