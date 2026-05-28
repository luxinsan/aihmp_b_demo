<template>
  <section class="module-config-page">
    <div class="module-config-head">
      <div>
        <a-typography-title :level="3" class="module-config-title">模块配置</a-typography-title>
        <a-typography-text type="secondary">
          {{ tenantName }} / 按租户配置服务模块下的能力点。
        </a-typography-text>
      </div>
      <a-space>
        <a-button @click="goBack">返回</a-button>
        <a-button type="primary" :loading="saving" @click="saveConfig">保存</a-button>
      </a-space>
    </div>

    <a-card class="module-config-card" :bordered="false">
      <a-table row-key="capabilityCode" :columns="columns" :data-source="tableRows" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'moduleName'">
            <a-checkbox
              v-if="record.isFirstCapability"
              :checked="isModuleChecked(record.moduleCode)"
              :indeterminate="isModuleIndeterminate(record.moduleCode)"
              @change="setModuleChecked(record.moduleCode, $event.target.checked)"
            >
              <span class="module-group-name">{{ record.moduleName }}</span>
            </a-checkbox>
            <template v-else></template>
          </template>
          <template v-else-if="column.key === 'capabilityName'">
            <a-checkbox v-model:checked="record.capability.enabled">
              {{ record.capability.name }}
            </a-checkbox>
          </template>
          <template v-else-if="column.key === 'capabilityCode'">
            {{ record.capability.code }}
          </template>
          <template v-else-if="column.key === 'permissionKey'">
            {{ record.capability.permissionKey }}
          </template>
          <template v-else-if="column.key === 'description'">
            {{ record.capability.description }}
          </template>
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import type { TableColumnsType } from "ant-design-vue";
import { computed, reactive, ref } from "vue";
import { message, Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { baseModuleConfigs, type CapabilityPoint } from "../data/moduleConfig";
import { tenants } from "../data/tenants";

type ModuleConfig = (typeof moduleConfigs)[number];
type ModuleCapabilityRow = {
  moduleCode: string;
  moduleName: string;
  capabilityCode: string;
  capability: CapabilityPoint;
  isFirstCapability: boolean;
};

const route = useRoute();
const router = useRouter();
const saving = ref(false);

const tenantId = computed(() => String(route.params.tenantId || ""));
const tenant = computed(() => tenants.find((item) => item.id === tenantId.value));
const tenantName = computed(() => tenant.value?.name ?? "未知租户");

const moduleConfigs = reactive(
  baseModuleConfigs.map((module) => ({
    ...module,
    capabilities: module.capabilities.map((capability) => ({ ...capability })),
  })),
);

const columns: TableColumnsType<ModuleCapabilityRow> = [
  {
    title: "服务模块",
    dataIndex: "moduleName",
    key: "moduleName",
    width: 180,
  },
  {
    title: "能力点",
    dataIndex: "capabilityName",
    key: "capabilityName",
    width: 220,
  },
  {
    title: "能力点 key",
    dataIndex: "capabilityCode",
    key: "capabilityCode",
    width: 220,
  },
  {
    title: "对应权限点 key",
    dataIndex: "permissionKey",
    key: "permissionKey",
    width: 260,
  },
  {
    title: "说明",
    dataIndex: "description",
    key: "description",
  },
];

const tableRows = computed<ModuleCapabilityRow[]>(() =>
  moduleConfigs.flatMap((module) =>
    module.capabilities.map((capability, capabilityIndex) => ({
      moduleCode: module.code,
      moduleName: capabilityIndex === 0 ? module.name : "",
      capabilityCode: capability.code,
      capability,
      isFirstCapability: capabilityIndex === 0,
    })),
  ),
);

function goBack() {
  router.push("/tenants");
}

function findModule(moduleCode: string): ModuleConfig | undefined {
  return moduleConfigs.find((module) => module.code === moduleCode);
}

function isModuleChecked(moduleCode: string) {
  const module = findModule(moduleCode);
  if (!module) {
    return false;
  }

  return module.capabilities.every((capability) => capability.enabled);
}

function isModuleIndeterminate(moduleCode: string) {
  const module = findModule(moduleCode);
  if (!module) {
    return false;
  }

  const enabledCount = module.capabilities.filter((capability) => capability.enabled).length;
  return enabledCount > 0 && enabledCount < module.capabilities.length;
}

function setModuleChecked(moduleCode: string, checked: boolean) {
  const module = findModule(moduleCode);
  if (!module) {
    return;
  }

  module.capabilities.forEach((capability) => {
    capability.enabled = checked;
  });
}

function saveConfig() {
  Modal.confirm({
    title: "确认保存模块配置？",
    content: `保存后，${tenantName.value} 的服务模块和能力点配置将按当前勾选状态生效。`,
    okText: "确认保存",
    cancelText: "取消",
    async onOk() {
      saving.value = true;

      await new Promise((resolve) => {
        window.setTimeout(resolve, 500);
      });

      saving.value = false;
      message.success(`${tenantName.value} 的模块配置已保存`);
      router.push("/tenants");
    },
  });
}
</script>
