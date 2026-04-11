import type { ReactNode } from "react";

type PageSectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageSectionHeader({
  title,
  description,
  eyebrow,
  actions,
  className = "",
}: PageSectionHeaderProps) {
  const classes = ["page-section-header", className].filter(Boolean).join(" ");

  return (
    <header className={classes}>
      <div className="page-section-header-main">
        {eyebrow ? <p className="page-section-header-eyebrow">{eyebrow}</p> : null}
        <div className="page-section-header-title-wrap">
          <h2 className="page-section-header-title">{title}</h2>
          {description ? <p className="page-section-header-description">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="page-section-header-actions">{actions}</div> : null}
    </header>
  );
}
