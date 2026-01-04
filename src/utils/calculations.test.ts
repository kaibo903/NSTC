import { describe, it, expect } from 'vitest';
import {
  calculateBuildingArea,
  calculateSalesArea,
  calculateCost,
  calculateEvaluation,
  calculateAll,
} from './calculations';
import type {
  BasicInput,
  CostInput,
  EvaluationInput,
} from '../types';

describe('計算模組測試', () => {
  const mockBasicInput: BasicInput = {
    baseArea: 1000, // 1000 m²
    buildingCoverageRatio: 50, // 50%
    floorAreaRatio: 300, // 300%
    excavationRatio: 80, // 80%
    maxRoadWidth: 12, // 12 m
    estimatedFloorHeight: 3.2, // 3.2 m
    estimatedRoofFloors: 2,
    estimatedBasementFloors: 3,
    originalIndoorArea: 100, // 100 坪
    landownerCount: 10,
    constructionCost: 150000, // 15萬/坪
    legalConstructionCost: 50000, // 5萬/m²
    estimatedCommonAreaRatio: 35,
    parkingUnitArea: 30,
    reductionFactor: 0.85,
  };

  const mockCostInput: CostInput = {
    totalUnits: 50,
    loanInterestRate: 2.5,
    rightsTransformationFee: 1000000,
    neighborAppraisalCount: 5,
  };

  const mockEvaluationInput: EvaluationInput = {
    salesAreaPercentage: 20,
    estimatedParkingPrice: 2000000,
    estimatedFirstFloorPrice: 800000,
    estimatedAboveSecondFloorPrice: 600000,
  };

  describe('calculateBuildingArea', () => {
    it('應該正確計算建築面積', () => {
      const result = calculateBuildingArea(mockBasicInput, 0);
      
      expect(result.maxBuildingArea).toBeCloseTo(500, 2); // 1000 * 0.5
      expect(result.legalFloorArea).toBeCloseTo(3000, 2); // 1000 * 3.0
      expect(result.rewardFloorArea).toBe(0);
      expect(result.totalFloorArea).toBeGreaterThan(0);
      expect(result.totalFloorAreaPing).toBeGreaterThan(0);
    });

    it('應該正確計算獎勵容積', () => {
      const result = calculateBuildingArea(mockBasicInput, 20); // 20% 獎勵
      
      expect(result.rewardFloorArea).toBeCloseTo(600, 2); // 3000 * 0.2
    });

    it('應該正確計算自動推估', () => {
      const result = calculateBuildingArea(mockBasicInput, 0);
      
      expect(result.estimatedTotalHeight).toBe(24); // 12 * 1.5 + 6
      expect(result.estimatedAboveGroundFloors).toBe(8); // ceil(24 / 3.2)
    });
  });

  describe('calculateSalesArea', () => {
    it('應該正確計算銷售面積', () => {
      const buildingArea = calculateBuildingArea(mockBasicInput, 0);
      const result = calculateSalesArea(mockBasicInput, buildingArea);
      
      expect(result.parkingTotalArea).toBeGreaterThan(0);
      expect(result.parkingTotalCount).toBeGreaterThan(0);
      expect(result.totalSalesArea).toBeGreaterThan(0);
      expect(result.totalSalesAreaPing).toBeGreaterThan(0);
    });

    it('應該使用覆寫的一樓銷售面積', () => {
      const buildingArea = calculateBuildingArea(mockBasicInput, 0);
      const override = 200;
      const result = calculateSalesArea(mockBasicInput, buildingArea, override);
      
      expect(result.firstFloorSalesArea).toBe(override);
    });
  });

  describe('calculateCost', () => {
    it('應該正確計算成本', () => {
      const buildingArea = calculateBuildingArea(mockBasicInput, 0);
      const result = calculateCost(mockBasicInput, buildingArea, mockCostInput);
      
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.constructionCost).toBeGreaterThan(0);
      expect(result.designFee).toBeGreaterThan(0);
    });

    it('應該包含所有成本項目', () => {
      const buildingArea = calculateBuildingArea(mockBasicInput, 0);
      const result = calculateCost(mockBasicInput, buildingArea, mockCostInput);
      
      expect(result.designFee).toBeGreaterThan(0);
      expect(result.publicFund).toBeGreaterThan(0);
      expect(result.fees).toBeGreaterThan(0);
      expect(result.externalReview).toBeGreaterThan(0);
      expect(result.rewardApplication).toBeGreaterThan(0);
      expect(result.externalPipeline).toBeGreaterThan(0);
      expect(result.landRegistration).toBeGreaterThan(0);
      expect(result.stampTax).toBeGreaterThan(0);
    });
  });

  describe('calculateEvaluation', () => {
    it('應該正確計算評估結果', () => {
      const buildingArea = calculateBuildingArea(mockBasicInput, 0);
      const salesArea = calculateSalesArea(mockBasicInput, buildingArea);
      const cost = calculateCost(mockBasicInput, buildingArea, mockCostInput);
      const result = calculateEvaluation(
        mockBasicInput,
        buildingArea,
        salesArea,
        cost,
        mockEvaluationInput
      );
      
      expect(result.estimatedTotalSalesRevenue).toBeGreaterThan(0);
      expect(result.commonBurdenRatio).toBeGreaterThanOrEqual(0);
      expect(result.returnRatio).toBeGreaterThanOrEqual(0);
      expect(result.pingToPingRatio).toBeGreaterThanOrEqual(0);
    });

    it('應該正確計算土地坪效', () => {
      const buildingArea = calculateBuildingArea(mockBasicInput, 0);
      const salesArea = calculateSalesArea(mockBasicInput, buildingArea);
      const cost = calculateCost(mockBasicInput, buildingArea, mockCostInput);
      const result = calculateEvaluation(
        mockBasicInput,
        buildingArea,
        salesArea,
        cost,
        mockEvaluationInput
      );
      
      expect(result.landEfficiency).toBeGreaterThan(0);
    });
  });

  describe('calculateAll', () => {
    it('應該完成完整計算流程', () => {
      const result = calculateAll(
        mockBasicInput,
        0,
        mockCostInput,
        mockEvaluationInput
      );
      
      expect(result.buildingArea).toBeDefined();
      expect(result.salesArea).toBeDefined();
      expect(result.cost).toBeDefined();
      expect(result.evaluation).toBeDefined();
      expect(result.buildingArea.totalFloorArea).toBeGreaterThan(0);
      expect(result.salesArea.totalSalesArea).toBeGreaterThan(0);
      expect(result.cost.totalCost).toBeGreaterThan(0);
      expect(result.evaluation.estimatedTotalSalesRevenue).toBeGreaterThan(0);
    });
  });

  describe('邊界情況測試', () => {
    it('應該處理零值輸入', () => {
      const zeroInput: BasicInput = {
        ...mockBasicInput,
        baseArea: 0,
      };
      
      const result = calculateBuildingArea(zeroInput, 0);
      expect(result.maxBuildingArea).toBe(0);
      expect(result.legalFloorArea).toBe(0);
    });

    it('應該處理極大值輸入', () => {
      const largeInput: BasicInput = {
        ...mockBasicInput,
        baseArea: 100000,
      };
      
      const result = calculateBuildingArea(largeInput, 0);
      expect(result.totalFloorArea).toBeGreaterThan(0);
      expect(isFinite(result.totalFloorArea)).toBe(true);
    });
  });
});


