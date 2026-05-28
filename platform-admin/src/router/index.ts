import { createRouter, createWebHistory } from "vue-router";
import PlatformShell from "../layouts/PlatformShell.vue";
import TenantListPage from "../pages/TenantListPage.vue";
import ModuleConfigPage from "../pages/ModuleConfigPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/tenants",
    },
    {
      path: "/",
      component: PlatformShell,
      children: [
        {
          path: "tenants",
          name: "tenants",
          component: TenantListPage,
        },
        {
          path: "tenants/:tenantId/module-config",
          name: "tenant-module-config",
          component: ModuleConfigPage,
        },
      ],
    },
  ],
});

export default router;
