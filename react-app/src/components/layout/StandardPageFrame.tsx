import type { ReactNode } from "react";

type StandardPageFrameProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function StandardPageFrame({
  title,
  description,
  actions,
  children,
  className = "",
}: StandardPageFrameProps) {
  const classes = ["document-panel", "panel", "page-frame", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <header className={`panel-head page-frame-head${description ? " has-description" : ""}`}>
        <div className="page-frame-title-wrap">
          <h2 className="page-frame-title">{title}</h2>
          {description ? <p className="page-frame-description">{description}</p> : null}
        </div>
        {actions ? <div className="page-frame-actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
