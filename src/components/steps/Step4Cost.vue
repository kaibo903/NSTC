<template>
  <div class="step4-container">
    <h2>步驟 4：都市更新成本費用</h2>
    <el-alert
      title="預設全部有值，避免地主卡在成本欄位"
      type="info"
      :closable="false"
      style="margin-bottom: 16px;"
    />

    <el-form :model="form" label-width="160px" label-position="left" class="compact-form">
      <el-form-item label="更新後預估總戶數" required>
        <div class="input-group">
          <el-input-number
            v-model="form.totalUnits"
            :min="1"
            :precision="0"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">戶</span>
        </div>
      </el-form-item>

      <el-form-item label="貸款年利率" required>
        <div class="input-group">
          <el-input-number
            v-model="form.loanInterestRate"
            :min="0"
            :max="10"
            :precision="2"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">%</span>
          <span class="hint">（預設 2%~3%）</span>
        </div>
      </el-form-item>

      <el-form-item label="權利變換費用">
        <div class="input-group">
          <el-input-number
            v-model="form.rightsTransformationFee"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">元</span>
          <span class="hint">（若未知可填 0）</span>
        </div>
      </el-form-item>

      <el-form-item label="鄰房鑑定戶數">
        <div class="input-group">
          <el-input-number
            v-model="form.neighborAppraisalCount"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
            @change="handleRecalculate"
          />
          <span class="unit">戶</span>
          <span class="hint">（若未知可填 0）</span>
        </div>
      </el-form-item>

      <el-divider content-position="left">成本明細</el-divider>

      <div class="table-wrapper">
        <el-table :data="costData" border style="width: 100%;" size="small" class="result-table">
          <el-table-column prop="item" label="項目" min-width="150" />
          <el-table-column prop="value" label="金額（元）" align="right" min-width="140">
            <template #default="{ row }">
              {{ formatCurrency(row.value) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { CostInput, CostResult, BasicInput, BuildingAreaResult } from '../../types';
import { calculateCost } from '../../utils/calculations';

const props = defineProps<{
  basicInput: BasicInput;
  buildingArea: BuildingAreaResult;
  costInput: CostInput;
  modelValue: CostResult;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: CostResult];
  'update:costInput': [value: CostInput];
  recalculate: [];
}>();

const form = computed({
  get: () => props.costInput,
  set: (value) => emit('update:costInput', value),
});

const result = computed(() => {
  return calculateCost(props.basicInput, props.buildingArea, props.costInput);
});

watch(result, (newVal) => {
  emit('update:modelValue', newVal);
}, { immediate: true });

const costData = computed(() => {
  if (!result.value) return [];
  return [
    { item: '設計費', value: result.value.designFee },
    { item: '公共基金', value: result.value.publicFund },
    { item: '規費', value: result.value.fees },
    { item: '外審', value: result.value.externalReview },
    { item: '獎勵申請', value: result.value.rewardApplication },
    { item: '外接管線', value: result.value.externalPipeline },
    { item: '地籍整理', value: result.value.landRegistration },
    { item: '印花稅', value: result.value.stampTax },
    { item: '權利變換費用', value: result.value.rightsTransformationFee },
    { item: '鄰房鑑定', value: result.value.neighborAppraisal },
    { item: '營建成本', value: result.value.constructionCost },
    { item: '預估總成本支出', value: result.value.totalCost, isTotal: true },
  ];
});

const formatCurrency = (value: number): string => {
  return value.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const handleRecalculate = () => {
  emit('recalculate');
};
</script>

<style scoped>
.step4-container {
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
  min-width: 350px;
}
</style>

