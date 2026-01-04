<template>
  <div class="step3-container">
    <h2>步驟 3：銷售面積試算</h2>

    <el-form label-width="160px" label-position="left" class="compact-form">
      <el-form-item label="車位單位面積">
        <div class="input-group">
          <el-input-number
            v-model="form.parkingUnitArea"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">m²/位</span>
        </div>
      </el-form-item>

      <el-form-item label="折減係數">
        <div class="input-group">
          <el-input-number
            v-model="form.reductionFactor"
            :min="0"
            :max="1"
            :precision="2"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
        </div>
      </el-form-item>

      <el-form-item label="一樓銷售面積覆寫（選填）">
        <div class="input-group">
          <el-input-number
            v-model="firstFloorOverride"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">m²</span>
          <span class="hint">（若填則優先使用此值）</span>
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
import type { SalesAreaResult, BasicInput, BuildingAreaResult } from '../../types';
import { calculateSalesArea } from '../../utils/calculations';

const props = defineProps<{
  basicInput: BasicInput;
  buildingArea: BuildingAreaResult;
  modelValue: SalesAreaResult;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: SalesAreaResult];
  recalculate: [];
}>();

const form = computed(() => props.basicInput);
const firstFloorOverride = ref<number | undefined>(undefined);

const result = computed(() => {
  return calculateSalesArea(
    props.basicInput,
    props.buildingArea,
    firstFloorOverride.value,
  );
});

watch(result, (newVal) => {
  emit('update:modelValue', newVal);
}, { immediate: true });

const resultData = computed(() => {
  if (!result.value) return [];
  return [
    { item: '預估車位總面積', value: result.value.parkingTotalArea.toFixed(2), unit: 'm²' },
    { item: '預估車位總數量', value: result.value.parkingTotalCount.toString(), unit: '位' },
    { item: '一樓銷售面積', value: result.value.firstFloorSalesArea.toFixed(2), unit: 'm²' },
    { item: '二樓以上銷售面積', value: result.value.aboveSecondFloorSalesArea.toFixed(2), unit: 'm²' },
    { item: '總銷售面積', value: result.value.totalSalesArea.toFixed(2), unit: 'm²' },
    { item: '總銷售面積', value: result.value.totalSalesAreaPing.toFixed(2), unit: '坪' },
  ];
});

const handleRecalculate = () => {
  emit('recalculate');
};
</script>

<style scoped>
.step3-container {
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

