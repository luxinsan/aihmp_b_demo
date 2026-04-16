import type { ReactNode } from "react";
import { PageSectionHeader } from "./PageSectionHeader";

type StandardPageFrameProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
};

export function StandardPageFrame({
  title,
  description,
  actions,
  children,
  className = "",
  headerClassName = "panel-head page-frame-head",
}: StandardPageFrameProps) {
  const classes = ["document-panel", "panel", "page-frame", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <PageSectionHeader actions={actions} className={headerClassName} description={description} title={title} />
      {children}
    </section>
  );
}
