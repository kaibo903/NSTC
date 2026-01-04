<template>
  <el-card class="summary-card" shadow="always">
    <template #header>
      <div class="card-header">
        <span>關鍵結果摘要</span>
      </div>
    </template>
    <div class="summary-content">
      <div class="summary-item" v-if="result?.buildingArea">
        <div class="label">總樓地板面積</div>
        <div class="value">{{ formatNumber(result.buildingArea.totalFloorAreaPing) }} 坪</div>
      </div>
      <div class="summary-item" v-if="result?.salesArea">
        <div class="label">總銷售面積</div>
        <div class="value">{{ formatNumber(result.salesArea.totalSalesAreaPing) }} 坪</div>
      </div>
      <div class="summary-item" v-if="result?.cost">
        <div class="label">預估總成本支出</div>
        <div class="value">{{ formatCurrency(result.cost.totalCost) }}</div>
      </div>
      <div class="summary-item" v-if="result?.evaluation">
        <div class="label">預估總銷售收入</div>
        <div class="value">{{ formatCurrency(result.evaluation.estimatedTotalSalesRevenue) }}</div>
      </div>
      <div class="summary-item" v-if="result?.evaluation">
        <div class="label">共同負擔比</div>
        <div class="value">{{ formatNumber(result.evaluation.commonBurdenRatio) }}%</div>
      </div>
      <div class="summary-item" v-if="result?.evaluation">
        <div class="label">分回比例</div>
        <div class="value">{{ formatNumber(result.evaluation.returnRatio) }}%</div>
      </div>
      <div class="summary-item" v-if="result?.evaluation">
        <div class="label">預估分回室內坪數</div>
        <div class="value">{{ formatNumber(result.evaluation.estimatedReturnIndoorArea) }} 坪</div>
      </div>
      <div class="summary-item" v-if="result?.evaluation">
        <div class="label">一坪換幾坪</div>
        <div class="value">{{ formatNumber(result.evaluation.pingToPingRatio) }} 倍</div>
      </div>
      <div class="summary-item" v-if="result?.evaluation">
        <div class="label">預計變現總金額</div>
        <div class="value">{{ formatCurrency(result.evaluation.estimatedTotalRevenue) }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { CalculationResult } from '../types';

const props = defineProps<{
  result?: CalculationResult;
}>();

const formatNumber = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '-';
  return value.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCurrency = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '-';
  return `NT$ ${value.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
</script>

<style scoped>
.summary-card {
  position: sticky;
  top: 20px;
  height: fit-content;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.summary-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 12px;
  color: #909399;
}

.value {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>

