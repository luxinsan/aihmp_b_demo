<script setup lang="ts">
import ServiceGrid from "../components/ServiceGrid.vue";
import TeamSwitch from "../components/TeamSwitch.vue";
import type { Service, Team } from "../mock";

defineProps<{
  activeTeam?: Team;
  services: Service[];
}>();

defineEmits<{
  openTeamSheet: [];
}>();
</script>

<template>
  <section class="page page-home">
    <TeamSwitch :team="activeTeam" @open="$emit('openTeamSheet')" />
    <ServiceGrid :services="services" />
  </section>
</template>
