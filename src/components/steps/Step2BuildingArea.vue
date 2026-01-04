<template>
  <div class="step2-container">
    <h2>步驟 2：建築面積試算</h2>
    <el-alert
      title="此步驟為自動計算，結果為唯讀"
      type="info"
      :closable="false"
      style="margin-bottom: 16px;"
    />

    <el-form label-width="160px" label-position="left" class="compact-form">
      <el-form-item label="獎勵容積率">
        <div class="input-group">
          <el-input-number
            v-model="rewardFloorAreaRatio"
            :min="0"
            :max="100"
            :precision="2"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">%</span>
          <span class="hint">（預設 0）</span>
        </div>
      </el-form-item>

      <el-divider content-position="left">計算結果</el-divider>

      <div class="table-wrapper">
        <el-table :data="resultData" border style="width: 100%;" size="small" class="result-table">
          <el-table-column prop="item" label="項目" min-width="150" />
          <el-table-column prop="value" label="數值" min-width="120" />
          <el-table-column prop="unit" label="單位" width="80" />
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { BuildingAreaResult } from '../../types';
import { calculateBuildingArea } from '../../utils/calculations';
import type { BasicInput } from '../../types';

const props = defineProps<{
  basicInput: BasicInput;
  modelValue: BuildingAreaResult;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: BuildingAreaResult];
  'update:reward-ratio': [value: number];
  recalculate: [];
}>();

const rewardFloorAreaRatio = ref(props.modelValue.rewardFloorAreaRatio || 0);

const result = computed(() => {
  return calculateBuildingArea(props.basicInput, rewardFloorAreaRatio.value);
});

watch(result, (newVal) => {
  emit('update:modelValue', newVal);
  emit('update:reward-ratio', newVal.rewardFloorAreaRatio);
}, { immediate: true });

watch(() => props.modelValue.rewardFloorAreaRatio, (newVal) => {
  if (newVal !== undefined && newVal !== rewardFloorAreaRatio.value) {
    rewardFloorAreaRatio.value = newVal;
  }
}, { immediate: true });

const resultData = computed(() => {
  if (!result.value) return [];
  return [
    { item: '最大建築面積', value: result.value.maxBuildingArea.toFixed(2), unit: 'm²' },
    { item: '法定容積面積', value: result.value.legalFloorArea.toFixed(2), unit: 'm²' },
    { item: '獎勵容積面積', value: result.value.rewardFloorArea.toFixed(2), unit: 'm²' },
    { item: '機電空間面積', value: result.value.mechArea.toFixed(2), unit: 'm²' },
    { item: '梯廳空間面積', value: result.value.stairwellArea.toFixed(2), unit: 'm²' },
    { item: '陽台空間面積', value: result.value.balconyArea.toFixed(2), unit: 'm²' },
    { item: '屋突面積', value: result.value.roofArea.toFixed(2), unit: 'm²' },
    { item: '開挖面積', value: result.value.excavationArea.toFixed(2), unit: 'm²' },
    { item: '地下層面積', value: result.value.basementArea.toFixed(2), unit: 'm²' },
    { item: '總樓地板面積', value: result.value.totalFloorArea.toFixed(2), unit: 'm²' },
    { item: '總樓地板面積', value: result.value.totalFloorAreaPing.toFixed(2), unit: '坪' },
  ];
});

const handleRecalculate = () => {
  emit('recalculate');
  if (result.value) {
    emit('update:reward-ratio', result.value.rewardFloorAreaRatio);
  }
};
</script>

<style scoped>
.step2-container {
  padding: 16px;
}

.compact-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 14px;
  padding-right: 12px;
  word-break: keep-all;
  white-space: normal;
  line-height: 1.4;
}

.compact-form :deep(.el-form-item__content) {
  flex: 1;
  min-width: 0;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.compact-input {
  width: 160px;
  max-width: 100%;
  flex-shrink: 0;
}

.compact-input :deep(.el-input__inner) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  width: 100%;
  box-sizing: border-box;
}

.unit {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
  min-width: 40px;
}

.hint {
  color: #909399;
  font-size: 12px;
  white-space: nowrap;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.result-table {
  min-width: 400px;
}
</style>

