import type { ReactNode } from "react";

export type PatientTabPageFrameAlign = "center" | "start";

type PatientTabPageFrameProps = {
  title: string;
  description?: string;
  titleExtra?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  actionsClassName?: string;
  align?: PatientTabPageFrameAlign;
  divider?: boolean;
  sticky?: boolean;
};

export function PatientTabPageFrame({
  title,
  description,
  titleExtra,
  actions,
  children,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  actionsClassName = "",
  align = "center",
  divider = true,
  sticky = false,
}: PatientTabPageFrameProps) {
  const classes = ["document-panel", "panel", "patient-tab-page", className].filter(Boolean).join(" ");
  const bodyClasses = ["patient-tab-page-body", bodyClassName].filter(Boolean).join(" ");
  const headerClasses = [
    "patient-tab-page-header",
    align === "start" ? "is-align-start" : "is-align-center",
    !divider ? "has-no-divider" : "",
    sticky ? "is-sticky" : "",
    headerClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const actionsClasses = ["patient-tab-page-actions", actionsClassName].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      <header className={headerClasses}>
        <div className="patient-tab-page-header-main">
          <div className="patient-tab-page-title-wrap">
            <div className="patient-tab-page-title-row">
              <h2 className="patient-tab-page-title">{title}</h2>
              {titleExtra ? <div className="patient-tab-page-title-extra">{titleExtra}</div> : null}
            </div>
            {description ? <p className="patient-tab-page-description">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className={actionsClasses}>{actions}</div> : null}
      </header>
      <div className={bodyClasses}>{children}</div>
    </section>
  );
}
