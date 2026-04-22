import { PageContainer, PageSection } from "../../components/page-container";
import { PageShell } from "../../components/page-shell";
import "./index.scss";

export default function PatientProfilePage() {
  return (
    <PageShell title="患者档案" bodyClassName="patient-profile-page">
      <PageContainer>
        <PageSection className="patient-profile-page-header" />
        <PageSection className="patient-profile-page-content" />
      </PageContainer>
    </PageShell>
  );
}
