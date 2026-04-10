export type WorkspaceNavItem = {
  label: string;
  children?: string[];
  active?: boolean;
};

export const workspaceNavItems: WorkspaceNavItem[] = [
  { label: "工作台" },
  { label: "客户管理", active: true, children: ["客户档案", "分组视图"] },
  { label: "任务管理" },
  { label: "方案与内容" },
  { label: "数据统计" },
  { label: "AI 医助" },
  { label: "系统管理" },
];

export const workspaceBreadcrumb = ["客户管理", "客户档案"] as const;
export const workspaceConnectionLabel = "";
