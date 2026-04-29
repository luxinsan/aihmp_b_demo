import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import Button from "antd/es/button";
import Dropdown from "antd/es/dropdown";
import { useState } from "react";
import { generationMenuOptions } from "../../../data/configOptions";
import type { GenerationSession } from "../../../types/generationSession";
import type { ReportRecord } from "../../../types/report";
import { ServiceMenuIcon } from "./ServiceMenuIcon";

type ReportPanelHeaderProps = {
  generationSession: GenerationSession | null;
  onOpenGenerate: () => void;
  onOpenGenerateForService: (serviceId: ReportRecord["serviceId"]) => void;
  onOpenGenerationStage: (reportId?: string) => void;
  onCreateManagementPlanReport?: (kind: "weight" | "glucose") => void;
};

export function ReportPanelHeaderActions({
  generationSession: _generationSession,
  onOpenGenerate: _onOpenGenerate,
  onOpenGenerateForService,
  onOpenGenerationStage: _onOpenGenerationStage,
  onCreateManagementPlanReport,
}: ReportPanelHeaderProps) {
  const [openMenu, setOpenMenu] = useState<"ai" | "management" | null>(null);
  const managementMenuItems: MenuProps["items"] = [
    {
      key: "weight",
      label: "28天体重管理",
      icon: (
        <span className="ai-menu-icon plan-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 8.5A7 7 0 0 1 19 8.5v7A3.5 3.5 0 0 1 15.5 19h-7A3.5 3.5 0 0 1 5 15.5v-7Z"></path>
            <path d="M9 8.5a3 3 0 0 1 6 0"></path>
            <path d="m12 12 2-2"></path>
          </svg>
        </span>
      ),
    },
    {
      key: "glucose",
      label: "28天血糖管理",
      icon: (
        <span className="ai-menu-icon exam-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z"></path>
            <path d="M9.5 14.5h5"></path>
            <path d="M12 12v5"></path>
          </svg>
        </span>
      ),
    },
  ];
  const aiMenuItems: MenuProps["items"] = generationMenuOptions.map((service) => ({
    key: service.id,
    label: service.label,
    icon: (
      <span className={`ai-menu-icon ${service.tone}-icon`} aria-hidden="true">
        <ServiceMenuIcon serviceId={service.serviceId} />
      </span>
    ),
  }));

  return (
    <div className="actions">
      {onCreateManagementPlanReport ? (
        <Dropdown
          menu={{
            items: managementMenuItems,
            onClick: ({ key }) => {
              onCreateManagementPlanReport(key === "weight" ? "weight" : "glucose");
              setOpenMenu(null);
            },
          }}
          open={openMenu === "management"}
          overlayClassName="report-header-action-menu"
          placement="bottomRight"
          trigger={["click"]}
          onOpenChange={(open) => setOpenMenu(open ? "management" : null)}
        >
          <Button className="report-header-action-button" type="default">
            配置28天管理方案
            <DownOutlined />
          </Button>
        </Dropdown>
      ) : null}
      <Dropdown
        menu={{
          items: aiMenuItems,
          onClick: ({ key }) => {
            const service = generationMenuOptions.find((item) => item.id === key);
            if (service) {
              onOpenGenerateForService(service.serviceId);
            }
            setOpenMenu(null);
          },
        }}
        open={openMenu === "ai"}
        overlayClassName="report-header-action-menu"
        placement="bottomRight"
        trigger={["click"]}
        onOpenChange={(open) => setOpenMenu(open ? "ai" : null)}
      >
        <Button
          className="report-header-action-button report-header-action-button-primary"
          id="aiButton"
          type="primary"
        >
          <span className="spark-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"></path>
              <path d="m18.5 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"></path>
            </svg>
          </span>
          AI 生成报告
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
}
