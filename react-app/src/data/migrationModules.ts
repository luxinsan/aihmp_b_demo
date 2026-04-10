export type MigrationModule = {
  name: string;
  phase: string;
  summary: string;
  targets: string[];
};

export const migrationModules: MigrationModule[] = [
  {
    name: "PatientOverview",
    phase: "Phase 1",
    summary: "先迁患者头部信息和档案展示，让静态数据展示脱离全局 DOM 查询。",
    targets: ["患者头像与基本信息", "档案信息分组", "复用型信息行组件"],
  },
  {
    name: "ReportWorkspace",
    phase: "Phase 1",
    summary: "优先拆报告卡片与报告列表，建立组件树和局部状态边界。",
    targets: ["报告卡片", "报告状态标签", "更多操作菜单"],
  },
  {
    name: "ModalHost",
    phase: "Phase 1",
    summary: "把预览、确认、配置类弹窗统一收口，减少散落的显隐控制。",
    targets: ["配置弹窗", "预览弹窗", "确认弹窗"],
  },
];
