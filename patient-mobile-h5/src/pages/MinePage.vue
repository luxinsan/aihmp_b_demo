<script setup lang="ts">
import { Button, Cell, CellGroup, Empty, Grid, GridItem, Icon, showToast, Tag } from "vant";
import { mineCells, mineProfile, mineShortcuts, mineSupport } from "../mock";

function handleMineCell(label: string) {
  showToast(`${label}重构中`);
}

function handleSupportClick() {
  showToast(`${mineSupport.actionText}待接入`);
}
</script>

<template>
  <section class="page page-mine">
    <section class="profile-card">
      <div class="profile-avatar">{{ mineProfile.name.slice(0, 1) }}</div>
      <div class="profile-copy">
        <h2>{{ mineProfile.name }}</h2>
        <p>{{ mineProfile.gender }} · {{ mineProfile.age }} 岁</p>
        <span>患者编号 {{ mineProfile.code }}</span>
      </div>
      <Tag type="primary" plain round>演示账号</Tag>
    </section>

    <section class="phone-card">
      <span>绑定手机号</span>
      <strong>{{ mineProfile.phone }}</strong>
    </section>

    <Grid :border="false" :column-num="3" class="shortcut-grid">
      <GridItem v-for="shortcut in mineShortcuts" :key="shortcut.id">
        <template #icon>
          <strong class="shortcut-value">{{ shortcut.value }}</strong>
        </template>
        <template #text>
          <span class="shortcut-label">{{ shortcut.label }}</span>
        </template>
      </GridItem>
    </Grid>

    <CellGroup inset class="mine-cell-group">
      <Cell
        v-for="cell in mineCells"
        :key="cell.id"
        :title="cell.label"
        :value="cell.value"
        is-link
        center
        @click="handleMineCell(cell.label)"
      >
        <template #icon>
          <Icon :name="cell.icon" class="mine-cell-icon" />
        </template>
      </Cell>
    </CellGroup>

    <section class="mine-support-card">
      <div>
        <h3>{{ mineSupport.title }}</h3>
        <p>{{ mineSupport.description }}</p>
      </div>
      <Button size="small" round type="primary" plain @click="handleSupportClick">
        {{ mineSupport.actionText }}
      </Button>
    </section>

    <Empty
      class="mine-empty-state"
      image="default"
      description="订单、权益和家庭成员详情将在后续版本接入"
    />
  </section>
</template>
