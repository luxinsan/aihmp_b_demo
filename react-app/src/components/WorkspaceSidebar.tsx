import type { WorkspaceNavItem } from "../data/workspaceChrome";

type WorkspaceSidebarProps = {
  items: WorkspaceNavItem[];
};

function renderNavIcon(label: string) {
  if (label === "工作台") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6 10.5V19h12v-8.5" />
      </svg>
    );
  }

  if (label === "客户管理") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
        <path d="M16 9a3 3 0 1 1 0 6" />
        <path d="M3.5 19a5.5 5.5 0 0 1 9 0" />
        <path d="M14 18.5a4.5 4.5 0 0 1 6.5-2" />
      </svg>
    );
  }

  if (label === "任务管理") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
      </svg>
    );
  }

  if (label === "方案与内容") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8 12 4l8 4-8 4-8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 16 8 4 8-4" />
      </svg>
    );
  }

  if (label === "数据统计") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 19V9" />
        <path d="M12 19V5" />
        <path d="M18 19v-7" />
      </svg>
    );
  }

  if (label === "AI 医助") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v4" />
        <path d="m9 10 3 3 3-3" />
        <path d="M12 13v7" />
        <path d="M6.5 8.5a6 6 0 0 1 11 0" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .16 1.7 1.7 0 0 0-.92 1.53V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-.92-1.53A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 3.4 15a1.7 1.7 0 0 0-.16-1 1.7 1.7 0 0 0-1.53-.92H1.6a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.53-.92A1.7 1.7 0 0 0 3.4 7a1.7 1.7 0 0 0-.34-1.88L3 5.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 7 2.6c.35 0 .69-.05 1-.16A1.7 1.7 0 0 0 8.92.91V.82a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 13.84 2.4c.31.11.65.16 1 .16a1.7 1.7 0 0 0 1.11-.41l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 7c0 .35.05.69.16 1 .27.57.84.92 1.47.92h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.47.92c-.11.31-.16.65-.16 1Z" />
    </svg>
  );
}

export function WorkspaceSidebar({ items }: WorkspaceSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">#</div>
        <div>
          <h1>AI 健康管理系统</h1>
          <p>医护管理端</p>
        </div>
      </div>

      <nav className="nav-group" aria-label="主导航">
        {items.map((item) => {
          if (!item.children?.length) {
            return item.label === "工作台" ? (
              <a className="nav-link" href="#" key={item.label}>
                <span className="nav-icon">{renderNavIcon(item.label)}</span>
                <span>{item.label}</span>
              </a>
            ) : (
              <div className="nav-section" key={item.label}>
                <button className="section-trigger" type="button">
                  <span className="nav-icon">{renderNavIcon(item.label)}</span>
                  <span>{item.label}</span>
                  <span className="chevron">&#8964;</span>
                </button>
              </div>
            );
          }

          return (
            <div
              className={`nav-section${item.active ? " active" : ""}`}
              key={item.label}
            >
              <button className="section-trigger" type="button" aria-expanded="false">
                <span className="nav-icon">{renderNavIcon(item.label)}</span>
                <span>{item.label}</span>
                <span className="chevron">&#8964;</span>
              </button>
              <div className="section-children">
                {item.children.map((child, index) => (
                  <a className={`child-link${item.active && index === 0 ? " active" : ""}`} href="#" key={child}>
                    {child}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
