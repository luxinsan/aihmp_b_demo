<template>
  <section class="tenant-page">
    <div class="tenant-page-head">
      <div>
        <a-typography-title :level="3" class="tenant-page-title">租户管理</a-typography-title>
        <a-typography-text type="secondary">
          管理健康管理平台中的租户，并进入租户级模块配置。
        </a-typography-text>
      </div>
      <a-button type="primary">新增租户</a-button>
    </div>

    <a-card class="tenant-table-card" :bordered="false">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tenants"
        :pagination="{ pageSize: 8, showSizeChanger: false }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="tenant-name-cell">
              <div class="tenant-name">{{ record.name }}</div>
              <div class="tenant-id">{{ record.id }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'enabled' ? 'green' : 'default'">
              {{ record.status === "enabled" ? "启用" : "停用" }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'enabledModuleCount'">
            <a-badge color="#1d4ed8" :text="`${record.enabledModuleCount} 个模块`" />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" class="tenant-action-button" @click="openModuleConfig(record.id)">
              模块配置
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import type { TableColumnsType } from "ant-design-vue";
import { useRouter } from "vue-router";
import { tenants, type Tenant } from "../data/tenants";

const router = useRouter();

const columns: TableColumnsType<Tenant> = [
  {
    title: "租户名称",
    dataIndex: "name",
    key: "name",
    width: 240,
  },
  {
    title: "租户编码",
    dataIndex: "code",
    key: "code",
    width: 190,
  },
  {
    title: "租户类型",
    dataIndex: "type",
    key: "type",
    width: 160,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
  },
  {
    title: "已启用模块",
    dataIndex: "enabledModuleCount",
    key: "enabledModuleCount",
    width: 140,
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 180,
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    fixed: "right",
  },
];

function openModuleConfig(tenantId: string) {
  router.push(`/tenants/${tenantId}/module-config`);
}
</script>
