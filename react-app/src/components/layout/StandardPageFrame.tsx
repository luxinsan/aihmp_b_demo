import type { ReactNode } from "react";

type StandardPageFrameProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function StandardPageFrame({
  title,
  actions,
  children,
  className = "",
}: StandardPageFrameProps) {
  const classes = ["document-panel", "panel", "page-frame", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <header className="panel-head page-frame-head">
        <div className="page-frame-title-wrap">
          <h2 className="page-frame-title">{title}</h2>
        </div>
        {actions ? <div className="page-frame-actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
