import { PageContainer, PageSection, PageSectionCell, PageSectionRow } from "../../components/page-container";
import { PageShell } from "../../components/page-shell";
import "./index.scss";

export default function MinePage() {
  return (
    <PageShell title="我的" bodyClassName="mine-page">
      <PageContainer>
        <PageSection className="mine-page-profile" />
        <PageSectionRow className="mine-page-shortcut-row">
          <PageSectionCell className="mine-page-shortcut-cell" />
          <PageSectionCell className="mine-page-shortcut-cell" />
          <PageSectionCell className="mine-page-shortcut-cell" />
        </PageSectionRow>
        <PageSection className="mine-page-list" />
        <PageSection className="mine-page-support" />
      </PageContainer>
    </PageShell>
  );
}
