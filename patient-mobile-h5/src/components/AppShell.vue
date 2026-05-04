<script setup lang="ts">
import { computed } from "vue";
import { ActionSheet, NavBar, Tabbar, TabbarItem } from "vant";
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

const teamSheetOpenModel = computed({
  get: () => props.isTeamSheetOpen,
  set: (value) => emit("update:isTeamSheetOpen", value),
});
</script>

<template>
  <main class="mobile-app">
    <NavBar :title="navTitle" fixed placeholder safe-area-inset-top />

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
