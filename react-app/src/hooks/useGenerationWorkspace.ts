import { startTransition, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { generationSnapshots } from "../data/generationFlow";
import { patientProfile } from "../data/patientProfile";
import type { ReportDocumentDraft } from "../types/documentDraft";
import type { DraftConfig } from "../types/generation";
import type { GenerationSession } from "../types/generationSession";
import type { ActiveModal } from "../types/modal";
import type { ReportRecord } from "../types/report";
import { createDocumentDraft } from "../utils/documentDraft";
import {
  buildSelectedSources,
  createGeneratedReport,
  updateReportArtifacts,
} from "../utils/migrationWorkspace";
import {
  getGenerationBackgroundedMessage,
  getGenerationClearedMessage,
  getGenerationCompletedMessage,
  getGenerationDismissedMessage,
  getGenerationReturnedMessage,
  getGenerationStartedMessage,
  getGenerationStoppedMessage,
} from "../utils/workspaceFeedback";

type UseGenerationWorkspaceOptions = {
  draftConfig: DraftConfig;
  setActionMessage: Dispatch<SetStateAction<string>>;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
  setReports: Dispatch<SetStateAction<ReportRecord[]>>;
  setSelectedReportId: Dispatch<SetStateAction<string | null>>;
  registerGeneratedDraft: (reportId: string, draft: ReportDocumentDraft) => void;
};

function getPatientMeta() {
  return `${patientProfile.identity.gender} ${patientProfile.identity.age}岁`;
}

export function useGenerationWorkspace({
  draftConfig,
  setActionMessage,
  setActiveModal,
  setReports,
  setSelectedReportId,
  registerGeneratedDraft,
}: UseGenerationWorkspaceOptions) {
  const [generationSessions, setGenerationSessions] = useState<GenerationSession[]>([]);
  const [activeGenerationReportId, setActiveGenerationReportId] = useState<string | null>(null);
  const [generationVisible, setGenerationVisible] = useState(false);
  const generationSession =
    generationSessions.find((session) => session.reportId === activeGenerationReportId) ??
    generationSessions.find((session) => session.status === "processing") ??
    generationSessions[0] ??
    null;

  useEffect(() => {
    if (!generationSessions.length) {
      setActiveGenerationReportId(null);
      setGenerationVisible(false);
      return;
    }

    if (activeGenerationReportId && generationSessions.some((session) => session.reportId === activeGenerationReportId)) {
      return;
    }

    setActiveGenerationReportId(
      generationSessions.find((session) => session.status === "processing")?.reportId ??
        generationSessions[0]?.reportId ??
        null,
    );
  }, [activeGenerationReportId, generationSessions]);

  useEffect(() => {
    if (!generationSessions.some((session) => session.status === "processing")) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setGenerationSessions((current) =>
        current.map((session) => {
          if (session.status !== "processing") {
            return session;
          }

          const nextSnapshot = generationSnapshots.find((snapshot) => snapshot.progress > session.progress);

          if (!nextSnapshot) {
            return session;
          }

          return {
            ...session,
            ...nextSnapshot,
            updatedAt: Date.now(),
            status: nextSnapshot.progress === 100 ? "completed" : "processing",
          };
        }),
      );
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [generationSessions, setActionMessage]);

  function handleStartGeneration() {
    const nextReport = createGeneratedReport(draftConfig);
    const nextDraft = createDocumentDraft(nextReport);
    const firstSnapshot = generationSnapshots[0];

    if (!firstSnapshot) {
      return;
    }

    const now = Date.now();
    startTransition(() => {
      setReports((current) => [nextReport, ...current]);
    });
    registerGeneratedDraft(nextReport.id, nextDraft);
    setSelectedReportId(nextReport.id);
    setActiveModal(null);
    setActiveGenerationReportId(nextReport.id);
    setGenerationVisible(true);
    setActionMessage("");
    setGenerationSessions((current) => [
      {
        reportId: nextReport.id,
        reportTitle: nextReport.title,
        reportDate: nextReport.date,
        createdAt: now,
        updatedAt: now,
        serviceId: nextReport.serviceId,
        patientName: patientProfile.identity.name,
        patientMeta: getPatientMeta(),
        patientAvatar: patientProfile.identity.avatar,
        selectedSources: buildSelectedSources(draftConfig),
        status: "processing",
        modeLabel: firstSnapshot.modeLabel,
        briefTitle: firstSnapshot.briefTitle,
        briefText: firstSnapshot.briefText,
        overallStatus: firstSnapshot.overallStatus,
        progress: firstSnapshot.progress,
        stages: firstSnapshot.stages,
        logs: firstSnapshot.logs.map((entry, index) => ({
          ...entry,
          time:
            entry.time ||
            new Intl.DateTimeFormat("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date(now + index * 1000)),
        })),
      },
      ...current.filter((session) => session.reportId !== nextReport.id),
    ]);
  }

  function handleCloseGeneration() {
    setGenerationVisible(false);
  }

  function handleStopGeneration(reportId?: string) {
    const targetReportId = reportId ?? generationSession?.reportId;
    if (!targetReportId) {
      return;
    }

    setGenerationSessions((current) =>
      current.map((session) =>
        session.reportId === targetReportId
          ? {
              ...session,
              status: "stopped",
              updatedAt: Date.now(),
              modeLabel: "生成已终止",
              briefTitle: "已终止",
                  briefText: "本次生成已手动终止，当前草稿仍然保留，可继续查看。",
              overallStatus: "当前流程已终止，可返回列表或打开预览",
              logs: [
                ...session.logs,
                {
                  id: `log-stop-${session.reportId}`,
                  text: "已手动终止本次生成流程，草稿已保留到报告列表。",
                  tone: "accent",
                },
              ],
            }
          : session,
      ),
    );
    setActionMessage(getGenerationStoppedMessage());
  }

  function handleOpenGeneratedPreview(reportId?: string) {
    const targetReportId = reportId ?? generationSession?.reportId;
    if (!targetReportId) {
      return;
    }

    setSelectedReportId(targetReportId);
    setActiveGenerationReportId(targetReportId);
    setGenerationVisible(false);
    setActiveModal({ kind: "preview", reportId: targetReportId });
  }

  function handleReturnGeneratedToList(reportId?: string, draft?: ReportDocumentDraft, contentHtml?: string) {
    const targetSession =
      generationSessions.find((session) => session.reportId === reportId) ?? generationSession;

    if (!targetSession) {
      return;
    }

    if (draft) {
      startTransition(() => {
        setReports((current) =>
          updateReportArtifacts(current, targetSession.reportId, {
            title: draft.title,
            date: new Intl.DateTimeFormat("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
              .format(new Date())
              .replaceAll("-", "/"),
            content: contentHtml ?? "",
            trace: targetSession.logs.map((item) => ({ ...item })),
            savedDraft:
              typeof structuredClone === "function"
                ? structuredClone(draft)
                : JSON.parse(JSON.stringify(draft)),
            generationState: {
              status: targetSession.status,
              modeLabel: targetSession.modeLabel,
              briefTitle: targetSession.briefTitle,
              briefText: targetSession.briefText,
              overallStatus: targetSession.overallStatus,
              progress: targetSession.progress,
              stages: targetSession.stages.map((stage) => ({ ...stage })),
            },
          }),
        );
      });
      registerGeneratedDraft(targetSession.reportId, draft);
    }

    const nextSessions = generationSessions.filter(
      (session) => session.reportId !== targetSession.reportId,
    );

    setGenerationSessions(nextSessions);
    setActiveGenerationReportId(
      nextSessions.find((session) => session.status === "processing")?.reportId ??
        nextSessions[0]?.reportId ??
        null,
    );
    setSelectedReportId(targetSession.reportId);
    setGenerationVisible(false);
    setActionMessage(getGenerationReturnedMessage(targetSession.reportTitle, targetSession.status === "completed"));
  }

  function handleBackgroundGeneration(reportId?: string) {
    const targetSession =
      generationSessions.find((session) => session.reportId === reportId) ?? generationSession;

    if (!targetSession) {
      return;
    }

    setActiveGenerationReportId(targetSession.reportId);
    setGenerationVisible(false);
    setActionMessage(getGenerationBackgroundedMessage(targetSession.reportTitle));
  }

  function handleShowGeneration(reportId?: string) {
    const targetSession =
      generationSessions.find((session) => session.reportId === reportId) ?? generationSession;

    if (!targetSession) {
      return;
    }

    setActiveGenerationReportId(targetSession.reportId);
    setGenerationVisible(true);
  }

  function handleOpenEditorStage(report: ReportRecord) {
    const completedSnapshot = generationSnapshots[generationSnapshots.length - 1];
    if (!completedSnapshot) {
      return;
    }

    const now = Date.now();
    const restoredState = report.generationState;
    setGenerationSessions((current) => {
      const existing = current.find((session) => session.reportId === report.id);
      const restoredLogs = Array.isArray(report.trace) && report.trace.length ? report.trace : completedSnapshot.logs;
      const nextState = restoredState
        ? {
            status: restoredState.status,
            modeLabel: restoredState.modeLabel,
            briefTitle: restoredState.briefTitle,
            briefText: restoredState.briefText,
            overallStatus: restoredState.overallStatus,
            progress: restoredState.progress,
            stages: restoredState.stages,
          }
        : {
            status: "completed" as const,
            modeLabel: "已生成完成",
            briefTitle: completedSnapshot.briefTitle,
            briefText: completedSnapshot.briefText,
            overallStatus: "文档已生成完成，可继续编辑或保存",
            progress: 100,
            stages: completedSnapshot.stages,
          };

      if (existing) {
        return current.map((session) =>
          session.reportId === report.id
            ? {
                ...session,
                reportTitle: report.title,
                reportDate: report.date,
                serviceId: report.serviceId,
                selectedSources: report.selectedSources ?? session.selectedSources,
                ...(session.status === "processing"
                  ? {}
                  : {
                      ...nextState,
                      logs: restoredLogs,
                      updatedAt: now,
                    }),
              }
            : session,
        );
      }

      return [
        {
          reportId: report.id,
          reportTitle: report.title,
          reportDate: report.date,
          createdAt: now,
          updatedAt: now,
          serviceId: report.serviceId,
          patientName: patientProfile.identity.name,
          patientMeta: getPatientMeta(),
          patientAvatar: patientProfile.identity.avatar,
          selectedSources: report.selectedSources ?? [],
          ...nextState,
          logs: restoredLogs,
        },
        ...current,
      ];
    });

    setSelectedReportId(report.id);
    setActiveGenerationReportId(report.id);
    setGenerationVisible(true);
    setActiveModal(null);
  }

  function handleDismissGeneration(reportId: string) {
    const targetSession = generationSessions.find((session) => session.reportId === reportId);
    if (!targetSession) {
      return;
    }

    const nextSessions = generationSessions.filter((session) => session.reportId !== reportId);
    const nextActiveReportId =
      activeGenerationReportId === reportId
        ? nextSessions.find((session) => session.status === "processing")?.reportId ?? nextSessions[0]?.reportId ?? null
        : activeGenerationReportId;

    setGenerationSessions(nextSessions);
    setActiveGenerationReportId(nextActiveReportId);
    if (generationVisible && activeGenerationReportId === reportId && !nextActiveReportId) {
      setGenerationVisible(false);
    }
    setActionMessage(getGenerationDismissedMessage(targetSession.reportTitle));
  }

  function handleClearFinishedGenerations() {
    const removableCount = generationSessions.filter((session) => session.status !== "processing").length;
    if (!removableCount) {
      return;
    }

    const nextSessions = generationSessions.filter((session) => session.status === "processing");
    const nextActiveReportId =
      nextSessions.find((session) => session.reportId === activeGenerationReportId)?.reportId ??
      nextSessions[0]?.reportId ??
      null;

    setGenerationSessions(nextSessions);
    setActiveGenerationReportId(nextActiveReportId);
    if (generationVisible && !nextActiveReportId) {
      setGenerationVisible(false);
    }
    setActionMessage(getGenerationClearedMessage(removableCount));
  }

  function handleRemoveGenerationArtifacts(reportId: string) {
    const nextSessions = generationSessions.filter((session) => session.reportId !== reportId);
    const nextActiveReportId =
      activeGenerationReportId === reportId
        ? nextSessions.find((session) => session.status === "processing")?.reportId ?? nextSessions[0]?.reportId ?? null
        : activeGenerationReportId;

    setGenerationSessions(nextSessions);
    setActiveGenerationReportId(nextActiveReportId);
    if (generationVisible && activeGenerationReportId === reportId && !nextActiveReportId) {
      setGenerationVisible(false);
    }
  }

  return {
    generationSessions,
    generationVisible,
    handleClearFinishedGenerations,
    handleBackgroundGeneration,
    handleDismissGeneration,
    generationSession,
    handleCloseGeneration,
    handleOpenGeneratedPreview,
    handleRemoveGenerationArtifacts,
    handleReturnGeneratedToList,
    handleOpenEditorStage,
    handleShowGeneration,
    handleStartGeneration,
    handleStopGeneration,
  };
}
