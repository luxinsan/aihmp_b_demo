import {
  PageBottomDock,
  PageContainer,
  PageSection,
  PageSectionCell,
  PageSectionRow,
} from "../../components/page-container";
import { PageShell } from "../../components/page-shell";
import "./index.scss";

export default function HealthPlanPage() {
  return (
    <PageShell
      title="健康计划"
      bodyClassName="health-plan-page"
      bottomSlot={
        <PageBottomDock className="health-plan-page-dock">
          <PageSection className="health-plan-page-dock-section" />
        </PageBottomDock>
      }
    >
      <PageContainer>
        <PageSection className="health-plan-page-summary" />
        <PageSectionRow className="health-plan-page-overview-row">
          <PageSectionCell className="health-plan-page-overview-cell" />
          <PageSectionCell className="health-plan-page-overview-cell" />
        </PageSectionRow>
        <PageSection className="health-plan-page-timeline" />
        <PageSection className="health-plan-page-task-group" />
      </PageContainer>
    </PageShell>
  );
}
