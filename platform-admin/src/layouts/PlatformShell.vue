<template>
  <a-layout class="platform-shell">
    <a-layout-sider class="platform-sider" :width="240" theme="light">
      <div class="platform-brand">
        <div class="platform-brand-mark">M</div>
        <div>
          <div class="platform-brand-title">健康管理平台</div>
          <div class="platform-brand-subtitle">平台管理端</div>
        </div>
      </div>
      <a-menu
        class="platform-menu"
        mode="inline"
        :selected-keys="selectedKeys"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="platform-header">
        <div>
          <div class="platform-header-title">平台管理端</div>
          <div class="platform-header-subtitle">租户、平台资源与平台级治理</div>
        </div>
        <a-space>
          <a-tag color="blue">Mock 数据</a-tag>
          <a-avatar size="small">管</a-avatar>
        </a-space>
      </a-layout-header>
      <a-layout-content class="platform-content">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ItemType } from "ant-design-vue";
import { ApartmentOutlined } from "@ant-design/icons-vue";

const route = useRoute();
const router = useRouter();

const menuItems: ItemType[] = [
  {
    key: "/tenants",
    icon: () => h(ApartmentOutlined),
    label: "租户管理",
    title: "租户管理",
  },
];

const selectedKeys = computed(() => {
  if (route.path.startsWith("/tenants")) {
    return ["/tenants"];
  }

  return [route.path];
});

function handleMenuClick(info: { key: string | number }) {
  if (typeof info.key === "string") {
    router.push(info.key);
  }
}
</script>
