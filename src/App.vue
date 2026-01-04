<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <h1>地主都市更新全案管理試算平台</h1>
      <div class="header-actions">
        <el-button @click="handleExportPDF" :disabled="!canExport" type="primary">匯出 PDF</el-button>
        <el-button @click="handleExportExcel" :disabled="!canExport" type="primary">匯出 Excel</el-button>
      </div>
    </el-header>

    <el-main class="app-main">
      <el-row :gutter="20" class="main-row">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <el-card class="main-card">
            <el-steps :active="currentStep" finish-status="success" align-center class="steps-container">
              <el-step title="基本資料" />
              <el-step title="建築面積試算" />
              <el-step title="銷售面積試算" />
              <el-step title="成本費用" />
              <el-step title="評估報告" />
            </el-steps>

            <div class="step-content">
              <Step1BasicInput
                v-if="currentStep === 0"
                v-model="basicInput"
                @update:modelValue="handleRecalculate"
              />
              <Step2BuildingArea
                v-if="currentStep === 1"
                :basic-input="basicInput"
                v-model="buildingArea"
                @recalculate="handleRecalculate"
                @update:reward-ratio="rewardFloorAreaRatio = $event"
              />
              <Step3SalesArea
                v-if="currentStep === 2"
                :basic-input="basicInput"
                :building-area="buildingArea"
                v-model="salesArea"
                @recalculate="handleRecalculate"
              />
              <Step4Cost
                v-if="currentStep === 3"
                :basic-input="basicInput"
                :building-area="buildingArea"
                :cost-input="costInput"
                v-model="cost"
                @update:cost-input="costInput = $event"
                @recalculate="handleRecalculate"
              />
              <Step5Evaluation
                v-if="currentStep === 4"
                :evaluation-input="evaluationInput"
                :result="calculationResult"
                v-model="evaluation"
                @update:evaluation-input="evaluationInput = $event"
                @recalculate="handleRecalculate"
              />
            </div>

            <StepButtons
              :current-step="currentStep"
              @prev="handlePrev"
              @next="handleNext"
              @recalculate="handleRecalculate"
            />
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <SummaryCard :result="calculationResult" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type {
  BasicInput,
  BuildingAreaResult,
  SalesAreaResult,
  CostInput,
  CostResult,
  EvaluationInput,
  EvaluationResult,
  CalculationResult,
} from './types';
import { calculateAll } from './utils/calculations';
import { exportToPDF, exportToExcel } from './utils/export';
import Step1BasicInput from './components/steps/Step1BasicInput.vue';
import Step2BuildingArea from './components/steps/Step2BuildingArea.vue';
import Step3SalesArea from './components/steps/Step3SalesArea.vue';
import Step4Cost from './components/steps/Step4Cost.vue';
import Step5Evaluation from './components/steps/Step5Evaluation.vue';
import SummaryCard from './components/SummaryCard.vue';
import StepButtons from './components/StepButtons.vue';

const currentStep = ref(0);
const rewardFloorAreaRatio = ref(0);
const firstFloorSalesAreaOverride = ref<number | undefined>(undefined);

// 基本資料
const basicInput = ref<BasicInput>({
  baseArea: 0,
  buildingCoverageRatio: 0,
  floorAreaRatio: 0,
  excavationRatio: 0,
  maxRoadWidth: 0,
  estimatedFloorHeight: 3.2,
  estimatedRoofFloors: 2,
  estimatedBasementFloors: 3,
  originalIndoorArea: 0,
  landownerCount: 1,
  constructionCost: 0,
  legalConstructionCost: 0,
  estimatedCommonAreaRatio: 35,
  parkingUnitArea: 30,
  reductionFactor: 0.85,
});

// 計算結果
const buildingArea = ref<BuildingAreaResult>({
  rewardFloorAreaRatio: 0,
  maxBuildingArea: 0,
  legalFloorArea: 0,
  rewardFloorArea: 0,
  mechArea: 0,
  stairwellArea: 0,
  balconyArea: 0,
  roofArea: 0,
  excavationArea: 0,
  basementArea: 0,
  totalFloorArea: 0,
  totalFloorAreaPing: 0,
  estimatedTotalHeight: 0,
  estimatedAboveGroundFloors: 0,
});

const salesArea = ref<SalesAreaResult>({
  parkingTotalArea: 0,
  parkingTotalCount: 0,
  firstFloorSalesArea: 0,
  aboveSecondFloorSalesArea: 0,
  totalSalesArea: 0,
  totalSalesAreaPing: 0,
});

const costInput = ref<CostInput>({
  totalUnits: 0,
  loanInterestRate: 2.5,
  rightsTransformationFee: 0,
  neighborAppraisalCount: 0,
});

const cost = ref<CostResult>({
  designFee: 0,
  publicFund: 0,
  fees: 0,
  externalReview: 0,
  rewardApplication: 0,
  externalPipeline: 0,
  landRegistration: 0,
  stampTax: 0,
  rightsTransformationFee: 0,
  neighborAppraisal: 0,
  constructionCost: 0,
  totalCost: 0,
});

const evaluationInput = ref<EvaluationInput>({
  salesAreaPercentage: 20,
  estimatedParkingPrice: 0,
  estimatedFirstFloorPrice: 0,
  estimatedAboveSecondFloorPrice: 0,
});

const evaluation = ref<EvaluationResult>({
  landEfficiency: 0,
  estimatedTotalSalesRevenue: 0,
  commonBurdenRatio: 0,
  estimatedParkingSalesCount: 0,
  estimatedSalesAreaForSale: 0,
  estimatedTotalRevenue: 0,
  returnRatio: 0,
  estimatedReturnIndoorArea: 0,
  pingToPingRatio: 0,
});

const calculationResult = computed<CalculationResult | undefined>(() => {
  try {
    const result = calculateAll(
      basicInput.value,
      rewardFloorAreaRatio.value,
      costInput.value,
      evaluationInput.value,
      firstFloorSalesAreaOverride.value
    );
    return {
      basicInput: basicInput.value,
      ...result,
    };
  } catch (error) {
    console.error('計算錯誤:', error);
    return undefined;
  }
});

// 監聽計算結果更新
watch(calculationResult, (newResult) => {
  if (newResult) {
    buildingArea.value = newResult.buildingArea;
    salesArea.value = newResult.salesArea;
    cost.value = newResult.cost;
    evaluation.value = newResult.evaluation;
  }
}, { immediate: true });

const canExport = computed(() => {
  return calculationResult.value !== undefined &&
    basicInput.value.baseArea > 0 &&
    basicInput.value.buildingCoverageRatio > 0 &&
    basicInput.value.floorAreaRatio > 0;
});

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleNext = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
};

const handleRecalculate = () => {
  // 觸發重新計算
  if (calculationResult.value) {
    buildingArea.value = calculationResult.value.buildingArea;
    salesArea.value = calculationResult.value.salesArea;
    cost.value = calculationResult.value.cost;
    evaluation.value = calculationResult.value.evaluation;
  }
};

const handleExportPDF = () => {
  if (!calculationResult.value) {
    ElMessage.warning('請先完成試算');
    return;
  }
  try {
    exportToPDF(calculationResult.value, basicInput.value);
    ElMessage.success('PDF 匯出成功');
  } catch (error) {
    ElMessage.error('PDF 匯出失敗');
    console.error(error);
  }
};

const handleExportExcel = () => {
  if (!calculationResult.value) {
    ElMessage.warning('請先完成試算');
    return;
  }
  try {
    exportToExcel(calculationResult.value, basicInput.value);
    ElMessage.success('Excel 匯出成功');
  } catch (error) {
    ElMessage.error('Excel 匯出失敗');
    console.error(error);
  }
};

</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 56px;
}

.app-header h1 {
  margin: 0;
  font-size: 18px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.app-main {
  padding: 16px;
  background-color: #f5f7fa;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.main-row {
  margin: 0 !important;
}

.main-row :deep(.el-col) {
  padding: 0 10px;
}

.main-card {
  width: 100%;
  box-sizing: border-box;
}

.steps-container {
  margin-bottom: 20px;
  padding: 0 10px;
}

.steps-container :deep(.el-step__title) {
  font-size: 13px;
}

.step-content {
  margin: 16px 0;
  min-height: 400px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
