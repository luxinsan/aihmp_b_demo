<script setup lang="ts">
import { Grid, GridItem, Icon, showToast } from "vant";
import type { Service } from "../mock";

defineProps<{
  services: Service[];
}>();

function handleService(name: string) {
  showToast(`${name}功能重构中`);
}
</script>

<template>
  <section class="service-section">
    <header class="section-header">
      <h2>健康服务</h2>
    </header>
    <Grid :border="false" :column-num="4" class="service-grid">
      <GridItem v-for="service in services" :key="service.id" @click="handleService(service.name)">
        <template #icon>
          <span class="service-icon">
            <Icon :name="service.icon" />
          </span>
        </template>
        <template #text>
          <span class="service-name">{{ service.name }}</span>
        </template>
      </GridItem>
    </Grid>
  </section>
</template>
