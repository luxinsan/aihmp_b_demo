export type CapabilityPoint = {
  code: string;
  name: string;
  permissionKey: string;
  description: string;
  enabled: boolean;
};

export type ServiceModuleConfig = {
  code: string;
  name: string;
  capabilities: CapabilityPoint[];
};

export const baseModuleConfigs: ServiceModuleConfig[] = [
  {
    code: "service_package_module",
    name: "服务包模块",
    capabilities: [
      {
        code: "service_package_manage",
        name: "B端服务包管理",
        permissionKey: "ServicePackagePage",
        description: "服务包配置、上架与基础管理能力",
        enabled: true,
      },
      {
        code: "b_service_order_manage",
        name: "B端订单管理",
        permissionKey: "ServiceOrderPage",
        description: "医护端查看和处理服务包订单",
        enabled: true,
      },
      {
        code: "c_service_order_entry",
        name: "C端订单入口",
        permissionKey: "PatientServiceOrderEntry",
        description: "患者端服务包订单入口展示",
        enabled: true,
      },
      {
        code: "c_service_order_list",
        name: "C端订单管理",
        permissionKey: "PatientServiceOrderPage",
        description: "患者端查看服务包订单列表和订单详情",
        enabled: true,
      },
      {
        code: "c_service_subscription",
        name: "C端订阅",
        permissionKey: "PatientServiceSubscriptionPage",
        description: "患者端订阅入口和订阅记录展示",
        enabled: false,
      },
    ],
  },
  {
    code: "health_service",
    name: "健康服务",
    capabilities: [
      {
        code: "c_smart_triage_entry",
        name: "C端智能导诊入口",
        permissionKey: "PatientSmartTriageEntry",
        description: "患者端展示智能导诊入口",
        enabled: true,
      },
      {
        code: "b_smart_triage_record",
        name: "B端导诊记录",
        permissionKey: "SmartTriageRecordPage",
        description: "医护端查看患者导诊记录",
        enabled: true,
      },
      {
        code: "c_priority_registration_entry",
        name: "C端精准加号入口",
        permissionKey: "PatientPriorityRegistrationEntry",
        description: "患者端展示精准加号入口和申请流程",
        enabled: true,
      },
      {
        code: "b_priority_registration_manage",
        name: "B端精准加号管理",
        permissionKey: "PriorityRegistrationPage",
        description: "医护端处理精准加号申请",
        enabled: true,
      },
    ],
  },
];
