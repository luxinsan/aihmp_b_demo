type ReportServiceIconProps = {
  visualType: "plan-90" | "exam-plan" | "risk-advice" | "risk";
};

export function ReportServiceIcon({ visualType }: ReportServiceIconProps) {
  if (visualType === "plan-90") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.75h7.4l3.1 3.08V18a2 2 0 0 1-2 2H7.8a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2Z" />
        <path d="M14.4 4.85V8h3.05" />
        <path d="M8.4 10h6.4" />
        <path d="M8.4 13h4.5" />
        <path d="m8.4 16.1 1.3 1.25 2.4-2.7" />
      </svg>
    );
  }

  if (visualType === "exam-plan") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.75" y="5.25" width="14.5" height="13.5" rx="3" />
        <path d="M8 9h8" />
        <path d="M8 12.5h5" />
        <path d="M8 16h4" />
        <path d="M15.2 13.7h3.1" />
        <path d="M16.75 12.15v3.1" />
      </svg>
    );
  }

  if (visualType === "risk-advice") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.75 18.3 7.1v5.05c0 4-2.42 6.62-6.3 8.15-3.88-1.53-6.3-4.15-6.3-8.15V7.1L12 4.75Z" />
        <path d="M8.75 12.4h2.35l1.2-2.2 1.4 4.4 1.2-2.2h1.95" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.75 18.3 7.1v5.05c0 4-2.42 6.62-6.3 8.15-3.88-1.53-6.3-4.15-6.3-8.15V7.1L12 4.75Z" />
      <path d="M12 8.7v5.8" />
      <path d="M9.15 11.6H14.85" />
      <circle cx="12" cy="15.95" r="0.9" />
    </svg>
  );
}
