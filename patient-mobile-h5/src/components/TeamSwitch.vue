<script setup lang="ts">
import { Icon } from "vant";
import type { Team } from "../mock";

defineProps<{
  team?: Team;
}>();

defineEmits<{
  open: [];
}>();
</script>

<template>
  <button class="team-switch" type="button" @click="$emit('open')">
    <span>{{ team?.name }}</span>
    <Icon name="arrow-down" />
  </button>
</template>
