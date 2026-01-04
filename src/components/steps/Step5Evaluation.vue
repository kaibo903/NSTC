<template>
  <div class="step5-container">
    <h2>步驟 5：評估報告</h2>

    <el-form :model="form" label-width="160px" label-position="left" class="compact-form">
      <el-form-item label="銷售面積百分比" required>
        <div class="input-group">
          <el-input-number
            v-model="form.salesAreaPercentage"
            :min="0"
            :max="100"
            :precision="2"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">%</span>
          <span class="hint">（預設 20%）</span>
        </div>
      </el-form-item>

      <el-form-item label="預估車位單價" required>
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedParkingPrice"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">元/位</span>
        </div>
      </el-form-item>

      <el-form-item label="預估一樓單價" required>
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedFirstFloorPrice"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">元/坪</span>
        </div>
      </el-form-item>

      <el-form-item label="預估二樓以上單價" required>
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedAboveSecondFloorPrice"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">元/坪</span>
        </div>
      </el-form-item>

      <el-divider content-position="left">核心指標</el-divider>

      <div class="table-wrapper">
        <el-table :data="evaluationData" border style="width: 100%;" size="small" class="result-table">
          <el-table-column prop="item" label="指標" min-width="150" />
          <el-table-column prop="value" label="數值" min-width="140" />
          <el-table-column prop="unit" label="單位" width="80" />
        </el-table>
      </div>

      <DecisionRecommendation :result="result" />

    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { EvaluationInput, EvaluationResult, CalculationResult } from '../../types';
import DecisionRecommendation from '../DecisionRecommendation.vue';

const props = defineProps<{
  evaluationInput: EvaluationInput;
  result: CalculationResult;
  modelValue: EvaluationResult;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: EvaluationResult];
  'update:evaluationInput': [value: EvaluationInput];
  recalculate: [];
}>();

const form = computed({
  get: () => props.evaluationInput,
  set: (value) => emit('update:evaluationInput', value),
});

const evaluation = computed(() => props.modelValue);

const evaluationData = computed(() => {
  if (!evaluation.value) return [];
  return [
    { item: '土地坪效', value: formatNumber(evaluation.value.landEfficiency), unit: '倍' },
    { item: '預估總銷售收入', value: formatCurrency(evaluation.value.estimatedTotalSalesRevenue), unit: '元' },
    { item: '共同負擔比', value: formatNumber(evaluation.value.commonBurdenRatio), unit: '%' },
    { item: '預估變現車位數量', value: evaluation.value.estimatedParkingSalesCount.toString(), unit: '位' },
    { item: '預估變現銷售面積', value: formatNumber(evaluation.value.estimatedSalesAreaForSale), unit: '坪' },
    { item: '預計變現總金額', value: formatCurrency(evaluation.value.estimatedTotalRevenue), unit: '元' },
    { item: '分回比例', value: formatNumber(evaluation.value.returnRatio), unit: '%' },
    { item: '預估分回室內坪數', value: formatNumber(evaluation.value.estimatedReturnIndoorArea), unit: '坪' },
    { item: '一坪換幾坪', value: formatNumber(evaluation.value.pingToPingRatio), unit: '倍' },
  ];
});


const formatNumber = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '-';
  return value.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCurrency = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '-';
  return value.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const handleRecalculate = () => {
  emit('recalculate');
};
</script>

<style scoped>
.step5-container {
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

