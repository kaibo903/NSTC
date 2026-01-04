<template>
  <div class="step1-container">
    <h2>步驟 1：基本資料</h2>
    <el-alert
      title="參數類型說明"
      type="info"
      :closable="false"
      style="margin-bottom: 16px;"
    >
      <template #default>
        <div style="font-size: 12px;">
          <p><strong>個案參數</strong>：依基地基本資料輸入</p>
          <p><strong>固定參數</strong>：依法規或經驗值之固定值（機電上限 15%、梯廳上限 5%、陽台上限 10%、單層屋突上限 12.5%）</p>
          <p><strong>變動參數</strong>：假設性較高之參數（預估公設比、車位單位面積、折減係數）</p>
        </div>
      </template>
    </el-alert>

    <el-form :model="form" label-width="160px" label-position="left" class="compact-form">
      <el-divider content-position="left">必填欄位</el-divider>
      
      <el-form-item label="基地面積" required>
        <div class="input-group">
          <el-input-number
            v-model="form.baseArea"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">m²</span>
          <el-tooltip content="基地面積是指都市更新單元內所有土地的面積總和">
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </el-form-item>

      <el-form-item label="建蔽率" required>
        <div class="input-group">
          <el-input-number
            v-model="form.buildingCoverageRatio"
            :min="0"
            :max="100"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">%</span>
        </div>
      </el-form-item>

      <el-form-item label="容積率" required>
        <div class="input-group">
          <el-input-number
            v-model="form.floorAreaRatio"
            :min="0"
            :max="1000"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">%</span>
        </div>
      </el-form-item>

      <el-form-item label="開挖率" required>
        <div class="input-group">
          <el-input-number
            v-model="form.excavationRatio"
            :min="0"
            :max="100"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">%</span>
        </div>
      </el-form-item>

      <el-form-item label="最寬道路寬度" required>
        <div class="input-group">
          <el-input-number
            v-model="form.maxRoadWidth"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">m</span>
        </div>
      </el-form-item>

      <el-form-item label="預估地上單層樓高" required>
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedFloorHeight"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">m</span>
          <span class="hint">（預設 3.2）</span>
        </div>
      </el-form-item>

      <el-form-item label="預估屋突層數" required>
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedRoofFloors"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
          />
          <span class="hint">（預設 2）</span>
        </div>
      </el-form-item>

      <el-form-item label="預估地下層數" required>
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedBasementFloors"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
          />
          <span class="hint">（預設 3）</span>
        </div>
      </el-form-item>

      <el-form-item label="更新前原室內坪數" required>
        <div class="input-group">
          <el-input-number
            v-model="form.originalIndoorArea"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">坪</span>
        </div>
      </el-form-item>

      <el-form-item label="地主人數" required>
        <div class="input-group">
          <el-input-number
            v-model="form.landownerCount"
            :min="1"
            :precision="0"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">人</span>
        </div>
      </el-form-item>

      <el-form-item label="營建成本" required>
        <div class="input-group">
          <el-input-number
            v-model="form.constructionCost"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">元/坪</span>
        </div>
      </el-form-item>

      <el-form-item label="法定工程造價" required>
        <div class="input-group">
          <el-input-number
            v-model="form.legalConstructionCost"
            :min="0"
            :precision="0"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">元/m²</span>
        </div>
      </el-form-item>

      <el-divider content-position="left">變動參數</el-divider>

      <el-form-item label="預估公設比">
        <div class="input-group">
          <el-input-number
            v-model="form.estimatedCommonAreaRatio"
            :min="0"
            :max="100"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">%</span>
          <span class="hint">（預設 35%，合理區間 30%–40%）</span>
        </div>
      </el-form-item>

      <el-form-item label="車位單位面積">
        <div class="input-group">
          <el-input-number
            v-model="form.parkingUnitArea"
            :min="0"
            :precision="2"
            :controls="false"
            class="compact-input"
          />
          <span class="unit">m²/位</span>
          <span class="hint">（預設 30）</span>
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
          />
          <span class="hint">（預設 0.85）</span>
        </div>
      </el-form-item>

      <el-collapse v-model="advancedCollapse" style="margin-top: 24px;">
        <el-collapse-item title="進階欄位" name="advanced">
          <el-form-item label="地號">
            <el-input v-model="form.lotNumber" placeholder="選填" />
          </el-form-item>
          <el-form-item label="地段">
            <el-input v-model="form.section" placeholder="選填" />
          </el-form-item>
          <el-form-item label="使用分區">
            <el-input v-model="form.zoning" placeholder="選填" />
          </el-form-item>
          <el-form-item label="最大路寬至建築物深度">
            <div class="input-group">
              <el-input-number
                v-model="form.maxRoadToDepth"
                :min="0"
                :precision="2"
                :controls="false"
                class="compact-input"
              />
              <span class="unit">m</span>
            </div>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>

      <div class="auto-estimate" v-if="form.maxRoadWidth > 0 && form.estimatedFloorHeight > 0">
        <el-divider content-position="left">自動推估</el-divider>
        <div style="color: #606266; font-size: 14px;">
          <p>預估興建總樓高 = {{ estimatedTotalHeight.toFixed(2) }} m</p>
          <p>預估地上層數 = {{ estimatedAboveGroundFloors }} 層</p>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import type { BasicInput } from '../../types';

const props = defineProps<{
  modelValue: BasicInput;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: BasicInput];
}>();

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const advancedCollapse = ref<string[]>([]);

const estimatedTotalHeight = computed(() => {
  if (form.value.maxRoadWidth > 0) {
    return form.value.maxRoadWidth * 1.5 + 6;
  }
  return 0;
});

const estimatedAboveGroundFloors = computed(() => {
  if (form.value.maxRoadWidth > 0 && form.value.estimatedFloorHeight > 0) {
    return Math.ceil(estimatedTotalHeight.value / form.value.estimatedFloorHeight);
  }
  return 0;
});
</script>

<style scoped>
.step1-container {
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

.help-icon {
  color: #909399;
  cursor: help;
  font-size: 16px;
}

.auto-estimate {
  margin-top: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.auto-estimate p {
  margin: 4px 0;
  font-size: 13px;
}
</style>

