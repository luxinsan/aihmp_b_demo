import type { ReportRecord } from "../../../types/report";

type ServiceMenuIconProps = {
  serviceId: ReportRecord["serviceId"];
};

export function ServiceMenuIcon({ serviceId }: ServiceMenuIconProps) {
  if (serviceId === "exam") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 5.5v4" />
        <path d="M15.5 5.5v4" />
        <path d="M12 18.5c-2.8 0-5-2.2-5-5V11h10v2.5c0 2.8-2.2 5-5 5Z" />
        <path d="M10 18.5V20" />
        <path d="M14 18.5V20" />
      </svg>
    );
  }

  if (serviceId === "plan") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3" />
        <path d="M7.5 19a4.5 4.5 0 0 1 9 0" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 14c1.2 0 1.8-1.8 3-1.8S8.8 18 10 18s1.8-8 3-8 1.8 4 3 4 1.8-2 3-2" />
    </svg>
  );
}
