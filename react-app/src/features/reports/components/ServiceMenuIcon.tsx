import type { ReportRecord } from "../../../types/report";
import { ReportServiceIcon } from "./ReportServiceIcon";

type ServiceMenuIconProps = {
  serviceId: ReportRecord["serviceId"];
};

export function ServiceMenuIcon({ serviceId }: ServiceMenuIconProps) {
  if (serviceId === "exam") {
    return <ReportServiceIcon visualType="exam-plan" />;
  }

  if (serviceId === "plan") {
    return <ReportServiceIcon visualType="plan-90" />;
  }

  return <ReportServiceIcon visualType="risk-advice" />;
}
