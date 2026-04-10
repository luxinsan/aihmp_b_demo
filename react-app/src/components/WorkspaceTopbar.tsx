type WorkspaceTopbarProps = {
  breadcrumb: readonly string[];
  connectionLabel?: string;
};

export function WorkspaceTopbar({
  breadcrumb,
  connectionLabel,
}: WorkspaceTopbarProps) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        {breadcrumb[0]} <span>/</span> {breadcrumb[1]}
      </div>
      {connectionLabel?.trim() ? (
        <div className="topbar-meta">
          <span className="status-dot" />
          <span>{connectionLabel}</span>
        </div>
      ) : null}
    </header>
  );
}
