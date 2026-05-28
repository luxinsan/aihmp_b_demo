export type TenantStatus = "enabled" | "disabled";

export type Tenant = {
  id: string;
  name: string;
  code: string;
  type: string;
  status: TenantStatus;
  enabledModuleCount: number;
  updatedAt: string;
};

export const tenants: Tenant[] = [
  {
    id: "tenant-001",
    name: "春晓健康",
    code: "chunxiao_health",
    type: "健康管理机构",
    status: "enabled",
    enabledModuleCount: 6,
    updatedAt: "2026-05-27 10:30",
  },
  {
    id: "tenant-002",
    name: "云杉医院",
    code: "yunshan_hospital",
    type: "医院",
    status: "enabled",
    enabledModuleCount: 8,
    updatedAt: "2026-05-24 16:12",
  },
  {
    id: "tenant-003",
    name: "启明健康管理中心",
    code: "qiming_health_center",
    type: "试点机构",
    status: "disabled",
    enabledModuleCount: 3,
    updatedAt: "2026-05-18 09:45",
  },
  {
    id: "tenant-004",
    name: "安和慢病管理",
    code: "anhe_chronic_care",
    type: "健康管理机构",
    status: "enabled",
    enabledModuleCount: 5,
    updatedAt: "2026-05-20 14:08",
  },
];
