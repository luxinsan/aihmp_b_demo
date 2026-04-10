import { useState } from "react";
import type { DraftConfig } from "../types/generation";
import type { ReportRecord } from "../types/report";
import { buildDocumentName, createInitialDraftConfig } from "../utils/migrationWorkspace";

type UseDraftConfigStateOptions = {
  defaultServiceId: ReportRecord["serviceId"];
  onOpenConfigModal: () => void;
};

export function useDraftConfigState({
  defaultServiceId,
  onOpenConfigModal,
}: UseDraftConfigStateOptions) {
  const [draftConfig, setDraftConfig] = useState<DraftConfig>(createInitialDraftConfig(defaultServiceId));

  function openConfig() {
    setDraftConfig((current) => ({
      ...current,
      documentName: current.documentName || buildDocumentName(current.serviceId),
    }));
    onOpenConfigModal();
  }

  function openConfigForService(serviceId: ReportRecord["serviceId"]) {
    setDraftConfig((current) => {
      const previousAutoName = buildDocumentName(current.serviceId);

      return {
        ...current,
        serviceId,
        documentName: current.documentName === previousAutoName ? buildDocumentName(serviceId) : current.documentName,
      };
    });
    onOpenConfigModal();
  }

  function handleDraftConfigChange(nextConfig: DraftConfig) {
    setDraftConfig((current) => {
      const previousAutoName = buildDocumentName(current.serviceId);
      const nextAutoName = buildDocumentName(nextConfig.serviceId);

      return {
        ...nextConfig,
        documentName:
          current.documentName === previousAutoName && nextConfig.documentName === current.documentName
            ? nextAutoName
            : nextConfig.documentName,
      };
    });
  }

  return {
    draftConfig,
    handleDraftConfigChange,
    openConfig,
    openConfigForService,
    setDraftConfig,
  };
}
