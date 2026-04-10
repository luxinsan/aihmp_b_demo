import type { ReactNode } from "react";
import {
  workspaceBreadcrumb,
  workspaceConnectionLabel,
  workspaceNavItems,
} from "../data/workspaceChrome";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceTopbar } from "./WorkspaceTopbar";

type WorkspaceChromeProps = {
  children: ReactNode;
};

export function WorkspaceChrome({ children }: WorkspaceChromeProps) {
  return (
    <section className="app-shell" id="listScreen">
      <WorkspaceSidebar items={workspaceNavItems} />
      <main className="workspace">
        <WorkspaceTopbar breadcrumb={workspaceBreadcrumb} connectionLabel={workspaceConnectionLabel} />
        <section className="content-shell">{children}</section>
      </main>
    </section>
  );
}
