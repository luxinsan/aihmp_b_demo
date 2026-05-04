<script setup lang="ts">
import { computed, ref } from "vue";
import { getAppTabTitle, type AppTabName } from "./app/tabs";
import AppShell from "./components/AppShell.vue";
import HealthPlanPage from "./pages/HealthPlanPage.vue";
import HomePage from "./pages/HomePage.vue";
import MinePage from "./pages/MinePage.vue";
import { services, teams } from "./mock";

const activeTab = ref<AppTabName>("home");
const activeTeamId = ref(teams[0]?.id ?? "");
const isTeamSheetOpen = ref(false);

const activeTeam = computed(() => teams.find((team) => team.id === activeTeamId.value) ?? teams[0]);
const navTitle = computed(() => getAppTabTitle(activeTab.value));

const teamActions = computed(() =>
  teams.map((team) => ({
    name: team.name,
    value: team.id,
  })),
);

function selectTeam(action: { value?: string }) {
  if (action.value) {
    activeTeamId.value = action.value;
  }

  isTeamSheetOpen.value = false;
}
</script>

<template>
  <AppShell
    v-model:active-tab="activeTab"
    v-model:is-team-sheet-open="isTeamSheetOpen"
    :nav-title="navTitle"
    :team-actions="teamActions"
    @select-team="selectTeam"
  >
    <HomePage
      v-if="activeTab === 'home'"
      :active-team="activeTeam"
      :services="services"
      @open-team-sheet="isTeamSheetOpen = true"
    />
    <HealthPlanPage v-else-if="activeTab === 'plan'" />
    <MinePage v-else />
  </AppShell>
</template>
