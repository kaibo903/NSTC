<template>
  <el-card class="decision-card">
    <template #header>
      <div class="card-header">
        <span>解釋/決策模式</span>
      </div>
    </template>
    
    <el-radio-group v-model="mode" size="small" style="margin-bottom: 16px;">
      <el-radio label="explanation">解釋模式</el-radio>
      <el-radio label="decision">決策模式</el-radio>
    </el-radio-group>

    <div v-if="mode === 'explanation'" class="explanation-content">
      <h4>試算結果說明</h4>
      <p>根據您輸入的參數，本案試算結果如下：</p>
      <ul>
        <li>總樓地板面積為 <strong>{{ formatNumber(result?.buildingArea?.totalFloorAreaPing || 0) }}</strong> 坪</li>
        <li>總銷售面積為 <strong>{{ formatNumber(result?.salesArea?.totalSalesAreaPing || 0) }}</strong> 坪</li>
        <li>預估總成本支出為 <strong>{{ formatCurrency(result?.cost?.totalCost || 0) }}</strong></li>
        <li>預估總銷售收入為 <strong>{{ formatCurrency(result?.evaluation?.estimatedTotalSalesRevenue || 0) }}</strong></li>
        <li>共同負擔比為 <strong>{{ formatNumber(result?.evaluation?.commonBurdenRatio || 0) }}%</strong></li>
        <li>分回比例為 <strong>{{ formatNumber(result?.evaluation?.returnRatio || 0) }}%</strong></li>
        <li>預估分回室內坪數為 <strong>{{ formatNumber(result?.evaluation?.estimatedReturnIndoorArea || 0) }}</strong> 坪</li>
        <li>一坪換幾坪為 <strong>{{ formatNumber(result?.evaluation?.pingToPingRatio || 0) }}</strong> 倍</li>
      </ul>
    </div>

    <div v-if="mode === 'decision'" class="decision-content">
      <h4>決策建議</h4>
      <el-tag :type="decisionLevel.type" size="large" style="margin-bottom: 12px;">
        {{ decisionLevel.label }}
      </el-tag>
      <div v-if="decisionReasons.length > 0">
        <p class="reason-title">評估原因：</p>
        <ul>
          <li v-for="(reason, index) in decisionReasons" :key="index">{{ reason }}</li>
        </ul>
      </div>
      <div v-if="suggestions.length > 0" style="margin-top: 16px;">
        <p class="reason-title">建議事項：</p>
        <ul>
          <li v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</li>
        </ul>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CalculationResult } from '../types';

const props = defineProps<{
  result?: CalculationResult;
}>();

const mode = ref<'explanation' | 'decision'>('explanation');

const decisionLevel = computed(() => {
  if (!props.result?.evaluation) return { type: 'info', label: '無法評估' };
  
  const returnRatio = props.result.evaluation.returnRatio;
  const pingRatio = props.result.evaluation.pingToPingRatio;
  const commonBurden = props.result.evaluation.commonBurdenRatio;
  
  // 檢查是否有無效值
  if (!isFinite(returnRatio) || !isFinite(pingRatio) || !isFinite(commonBurden)) {
    return { type: 'info', label: '無法評估（數據異常）' };
  }
  
  if (returnRatio >= 60 && pingRatio >= 1.2 && commonBurden <= 40) {
    return { type: 'success', label: '綠色：建議進行' };
  } else if (returnRatio >= 50 && pingRatio >= 1.0 && commonBurden <= 50) {
    return { type: 'warning', label: '黃色：需審慎評估' };
  } else {
    return { type: 'danger', label: '紅色：不建議進行' };
  }
});

const decisionReasons = computed(() => {
  if (!props.result?.evaluation) return [];
  
  const reasons: string[] = [];
  const returnRatio = props.result.evaluation.returnRatio;
  const pingRatio = props.result.evaluation.pingToPingRatio;
  const commonBurden = props.result.evaluation.commonBurdenRatio;
  
  // 檢查無效值
  if (!isFinite(returnRatio) || !isFinite(pingRatio) || !isFinite(commonBurden)) {
    reasons.push('部分計算結果異常，請檢查輸入參數是否正確');
    return reasons;
  }
  
  if (returnRatio < 50) {
    reasons.push(`分回比例僅 ${returnRatio.toFixed(2)}%，低於建議值 50%`);
  }
  if (pingRatio < 1.0) {
    reasons.push(`一坪換幾坪為 ${pingRatio.toFixed(2)} 倍，低於 1.0 倍`);
  }
  if (commonBurden > 50) {
    reasons.push(`共同負擔比為 ${commonBurden.toFixed(2)}%，高於建議值 50%`);
  }
  
  if (reasons.length === 0) {
    reasons.push('各項指標均在合理範圍內');
  }
  
  return reasons;
});

const suggestions = computed(() => {
  if (!props.result?.evaluation) return [];
  
  const suggestions: string[] = [];
  const returnRatio = props.result.evaluation.returnRatio;
  const pingRatio = props.result.evaluation.pingToPingRatio;
  const commonBurden = props.result.evaluation.commonBurdenRatio;
  
  // 檢查無效值
  if (!isFinite(returnRatio) || !isFinite(pingRatio) || !isFinite(commonBurden)) {
    suggestions.push('請確認所有必填欄位已正確輸入');
    return suggestions;
  }
  
  if (returnRatio < 50) {
    suggestions.push('建議重新評估成本結構，或爭取更多獎勵容積');
  }
  if (pingRatio < 1.0) {
    suggestions.push('建議調整銷售面積分配，或重新評估公設比設定');
  }
  if (commonBurden > 50) {
    suggestions.push('建議檢討成本項目，或與實施者協商降低共同負擔');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('本案各項指標表現良好，建議進行下一階段評估');
  }
  
  return suggestions;
});

const formatNumber = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '-';
  return value.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCurrency = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '-';
  return value.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
</script>

<style scoped>
.decision-card {
  margin-top: 16px;
}

.card-header {
  font-weight: bold;
  font-size: 14px;
}

.explanation-content,
.decision-content {
  padding: 8px 0;
}

.explanation-content h4,
.decision-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.explanation-content p,
.decision-content p {
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.6;
}

.reason-title {
  font-weight: 600;
  margin: 8px 0 4px 0 !important;
  font-size: 13px;
}

.explanation-content ul,
.decision-content ul {
  margin: 4px 0;
  padding-left: 20px;
}

.explanation-content li,
.decision-content li {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.6;
}
</style>


