import {
  archiveSections,
  getQuestionnaireHistory,
  getQuestionnaireSummaries,
  healthPlanCheckIns,
  healthPlanHeader,
  healthPlanTasks,
  initialReports,
  patientProfile,
  questionnaireRecords,
  questionnaireSceneOptions,
  sharedPatientContactItems,
  sharedPatientTabs,
  vitalMetrics,
} from "../mock";
import type { SharedPatientTabId } from "../types/patient";

export type AdminPatientTabIconId = SharedPatientTabId;

export type AdminPatientContactIconId = "phone" | "id-card";

export type AdminPatientTabItem = {
  label: string;
  iconId: AdminPatientTabIconId;
};

export type AdminPatientContactItem = {
  label: string;
  value: string;
  iconId: AdminPatientContactIconId;
};

export const patientTabs: readonly AdminPatientTabItem[] = sharedPatientTabs.map((tab) => ({
  label: tab.label,
  iconId: tab.id,
}));

export const patientContactItems: AdminPatientContactItem[] = sharedPatientContactItems.map((item) => ({
  label: item.label,
  value: item.value,
  iconId: item.id,
}));

export {
  archiveSections,
  healthPlanCheckIns,
  healthPlanHeader,
  healthPlanTasks,
  initialReports,
  patientProfile,
  questionnaireRecords,
  getQuestionnaireHistory,
  getQuestionnaireSummaries,
  questionnaireSceneOptions,
  vitalMetrics,
};
