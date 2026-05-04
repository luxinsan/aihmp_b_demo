<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { ActionSheet, Tabbar, TabbarItem } from "vant";
import { appTabs, type AppTabName } from "../app/tabs";

type ShellAction = {
  name: string;
  value: string;
};

const props = defineProps<{
  activeTab: AppTabName;
  navTitle: string;
  isTeamSheetOpen: boolean;
  teamActions: ShellAction[];
}>();

const emit = defineEmits<{
  "update:activeTab": [value: AppTabName];
  "update:isTeamSheetOpen": [value: boolean];
  selectTeam: [action: ShellAction];
}>();

const activeTabModel = computed({
  get: () => props.activeTab,
  set: (value) => emit("update:activeTab", value),
});

const isCapsuleMenuOpen = ref(false);
const beijingTime = ref(formatBeijingTime());
const beijingTimeTimer = window.setInterval(() => {
  beijingTime.value = formatBeijingTime();
}, 1000);

const teamSheetOpenModel = computed({
  get: () => props.isTeamSheetOpen,
  set: (value) => emit("update:isTeamSheetOpen", value),
});

function formatBeijingTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).format(new Date());
}

function closePatientSurface() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "aihmp:patient-close" }, "*");
    return;
  }

  if (window.history.length > 1) {
    window.history.back();
  }
}

onBeforeUnmount(() => {
  window.clearInterval(beijingTimeTimer);
});
</script>

<template>
  <main class="mobile-app">
    <header class="mobile-chrome">
      <div class="mobile-status-bar" aria-label="系统状态栏">
        <span>{{ beijingTime }}</span>
        <span class="mobile-status-indicators" aria-hidden="true">
          <svg class="mobile-status-icon mobile-status-signal" viewBox="0 0 18 12" focusable="false">
            <rect x="0" y="7" width="3" height="5" rx="1.5" />
            <rect x="5" y="5" width="3" height="7" rx="1.5" />
            <rect x="10" y="2.5" width="3" height="9.5" rx="1.5" />
            <rect x="15" y="0" width="3" height="12" rx="1.5" />
          </svg>
          <svg class="mobile-status-icon mobile-status-wifi" viewBox="0 0 18 12" focusable="false">
            <path
              d="M1.4 3.7C5.5.3 12.5.3 16.6 3.7M4.5 6.5c2.5-2 6.5-2 9 0M7.4 9.2c.9-.7 2.3-.7 3.2 0"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
            />
            <circle cx="9" cy="11" r="1.1" />
          </svg>
          <svg class="mobile-status-icon mobile-status-battery" viewBox="0 0 26 12" focusable="false">
            <rect x="1" y="1.5" width="21" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-width="2" />
            <rect x="4" y="4" width="15" height="4" rx="1.4" />
            <path d="M24 4.2v3.6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </span>
      </div>

      <div class="mobile-title-bar">
        <h1>{{ navTitle }}</h1>
        <div class="mobile-native-capsule" aria-label="微信容器胶囊模拟">
          <button
            class="mobile-native-capsule-more"
            type="button"
            aria-label="更多"
            :aria-expanded="isCapsuleMenuOpen"
            @click="isCapsuleMenuOpen = !isCapsuleMenuOpen"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="12" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="18" cy="12" r="1.7" />
            </svg>
          </button>
          <span class="mobile-native-capsule-divider" />
          <button class="mobile-native-capsule-close" type="button" aria-label="关闭患者端" @click="closePatientSurface" />
        </div>
      </div>
    </header>

    <button
      v-if="isCapsuleMenuOpen"
      class="mobile-native-capsule-mask"
      type="button"
      aria-label="关闭更多菜单"
      @click="isCapsuleMenuOpen = false"
    />
    <div v-if="isCapsuleMenuOpen" class="mobile-native-menu" role="menu" aria-label="患者端更多菜单模拟">
      <button type="button" role="menuitem" @click="isCapsuleMenuOpen = false">转发给朋友</button>
      <button type="button" role="menuitem" @click="isCapsuleMenuOpen = false">添加到我的服务</button>
      <button type="button" role="menuitem" @click="isCapsuleMenuOpen = false">设置</button>
    </div>

    <slot />

    <ActionSheet
      v-model:show="teamSheetOpenModel"
      title="切换管理团队"
      :actions="teamActions"
      safe-area-inset-bottom
      @select="(action) => emit('selectTeam', action as ShellAction)"
    />

    <Tabbar v-model="activeTabModel" fixed safe-area-inset-bottom>
      <TabbarItem v-for="tab in appTabs" :key="tab.name" :name="tab.name" :icon="tab.icon">
        {{ tab.label }}
      </TabbarItem>
    </Tabbar>
  </main>
</template>
