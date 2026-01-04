<template>
  <div class="step-buttons">
    <el-button v-if="currentStep > 0" @click="$emit('prev')">上一頁</el-button>
    <el-button type="primary" @click="$emit('next')">下一步</el-button>
    <el-button @click="$emit('recalculate')">重新計算</el-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number;
}>();

defineEmits<{
  prev: [];
  next: [];
  recalculate: [];
}>();
</script>

<style scoped>
.step-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}
</style>


