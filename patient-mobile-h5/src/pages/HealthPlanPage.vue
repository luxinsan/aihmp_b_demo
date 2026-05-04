<script setup lang="ts">
import { Button, Cell, CellGroup, Empty, Icon, Progress, showToast, Tag } from "vant";
import { computed } from "vue";
import { healthPlans, healthPlanSummary, todayHealthTasks } from "../mock";

const completedTaskCount = computed(() => todayHealthTasks.filter((task) => task.status === "done").length);

function handlePlanAction(action: string) {
  showToast(`${action}已加入今日提醒`);
}

function handleTaskClick(title: string) {
  showToast(`${title}待接入执行页`);
}
</script>

<template>
  <section class="page page-plan">
    <section class="plan-summary">
      <div>
        <h2>{{ healthPlanSummary.title }}</h2>
        <p>{{ healthPlanSummary.description }}</p>
      </div>
    </section>

    <section class="plan-progress-card">
      <div class="plan-progress-main">
        <span>今日进度</span>
        <strong>{{ completedTaskCount }}/{{ todayHealthTasks.length }}</strong>
      </div>
      <Progress
        :percentage="Math.round((completedTaskCount / todayHealthTasks.length) * 100)"
        stroke-width="8"
        :show-pivot="false"
      />
      <p>今日已完成 {{ completedTaskCount }}/{{ todayHealthTasks.length }} 项，{{ healthPlanSummary.completionText }}</p>
    </section>

    <CellGroup inset class="task-cell-group">
      <Cell
        v-for="task in todayHealthTasks"
        :key="task.id"
        :title="task.title"
        :label="task.time"
        is-link
        center
        @click="handleTaskClick(task.title)"
      >
        <template #icon>
          <Icon
            :name="task.status === 'done' ? 'checked' : 'clock-o'"
            :class="['task-status-icon', task.status === 'done' ? 'is-done' : '']"
          />
        </template>
        <template #value>
          <Tag :type="task.status === 'done' ? 'success' : 'primary'" plain round>
            {{ task.status === "done" ? "已完成" : "待执行" }}
          </Tag>
        </template>
      </Cell>
    </CellGroup>

    <article v-for="plan in healthPlans" :key="plan.id" class="plan-card">
      <header class="plan-card-head">
        <div>
          <h3>{{ plan.title }}</h3>
          <p>{{ plan.period }}</p>
        </div>
        <Tag plain type="primary">{{ plan.status }}</Tag>
      </header>
      <Progress :percentage="plan.progress" stroke-width="8" :show-pivot="false" />
      <p class="plan-focus">{{ plan.focus }}</p>
      <div class="plan-actions">
        <Button
          v-for="action in plan.actions"
          :key="action"
          size="small"
          round
          plain
          type="primary"
          @click="handlePlanAction(action)"
        >
          {{ action }}
        </Button>
      </div>
    </article>

    <Empty
      class="plan-empty-state"
      image="search"
      description="阶段复盘、指标趋势和执行记录将在下一轮重做"
    />
  </section>
</template>
