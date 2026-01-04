import type {
  BasicInput,
  BuildingAreaResult,
  SalesAreaResult,
  CostInput,
  CostResult,
  EvaluationInput,
  EvaluationResult,
  FixedParameters,
} from '../types';
import { FIXED_PARAMETERS } from '../data/fixedParameters';

/**
 * 計算建築面積試算
 */
export function calculateBuildingArea(
  input: BasicInput,
  rewardFloorAreaRatio: number,
  fixedParams: FixedParameters = FIXED_PARAMETERS
): BuildingAreaResult {
  const { baseArea, buildingCoverageRatio, floorAreaRatio, excavationRatio, estimatedRoofFloors, estimatedBasementFloors, maxRoadWidth, estimatedFloorHeight } = input;
  
  // 最大建築面積
  const maxBuildingArea = baseArea * (buildingCoverageRatio / 100);
  
  // 法定容積面積
  const legalFloorArea = baseArea * (floorAreaRatio / 100);
  
  // 獎勵容積面積
  const rewardFloorArea = legalFloorArea * (rewardFloorAreaRatio / 100);
  
  // 機電空間面積
  const mechArea = (legalFloorArea + rewardFloorArea) * fixedParams.mechLimit;
  
  // 梯廳空間面積
  const stairwellArea = (legalFloorArea + rewardFloorArea + mechArea) * fixedParams.stairwellLimit;
  
  // 陽台空間面積
  const balconyArea = (legalFloorArea + rewardFloorArea + mechArea + stairwellArea) * fixedParams.balconyLimit;
  
  // 屋突面積
  const roofArea = maxBuildingArea * fixedParams.singleRoofLimit * estimatedRoofFloors;
  
  // 開挖面積
  const excavationArea = baseArea * (excavationRatio / 100);
  
  // 地下層面積
  const basementArea = excavationArea * estimatedBasementFloors;
  
  // 總樓地板面積
  const totalFloorArea = legalFloorArea + rewardFloorArea + mechArea + stairwellArea + balconyArea + roofArea + basementArea;
  const totalFloorAreaPing = totalFloorArea * fixedParams.pingConversion;
  
  // 自動推估
  const estimatedTotalHeight = maxRoadWidth * 1.5 + 6;
  const estimatedAboveGroundFloors = Math.ceil(estimatedTotalHeight / estimatedFloorHeight);
  
  return {
    rewardFloorAreaRatio,
    maxBuildingArea,
    legalFloorArea,
    rewardFloorArea,
    mechArea,
    stairwellArea,
    balconyArea,
    roofArea,
    excavationArea,
    basementArea,
    totalFloorArea,
    totalFloorAreaPing,
    estimatedTotalHeight,
    estimatedAboveGroundFloors,
  };
}

/**
 * 計算銷售面積試算
 */
export function calculateSalesArea(
  input: BasicInput,
  buildingArea: BuildingAreaResult,
  firstFloorSalesAreaOverride?: number,
  fixedParams: FixedParameters = FIXED_PARAMETERS
): SalesAreaResult {
  const { reductionFactor, parkingUnitArea } = input;
  const { basementArea, totalFloorArea, estimatedAboveGroundFloors } = buildingArea;
  
  // 預估車位總面積
  const parkingTotalArea = basementArea * reductionFactor;
  
  // 預估車位總數量
  const parkingTotalCount = Math.floor(parkingTotalArea / parkingUnitArea);
  
  // 一樓銷售面積
  let firstFloorSalesArea: number;
  if (firstFloorSalesAreaOverride !== undefined && firstFloorSalesAreaOverride > 0) {
    firstFloorSalesArea = firstFloorSalesAreaOverride;
  } else {
    firstFloorSalesArea = ((totalFloorArea - parkingTotalArea) * reductionFactor) / estimatedAboveGroundFloors;
  }
  
  // 二樓以上銷售面積
  const aboveSecondFloorSalesArea = totalFloorArea - parkingTotalArea - firstFloorSalesArea;
  
  // 總銷售面積
  const totalSalesArea = totalFloorArea - parkingTotalArea;
  const totalSalesAreaPing = totalSalesArea * fixedParams.pingConversion;
  
  return {
    parkingTotalArea,
    parkingTotalCount,
    firstFloorSalesArea,
    aboveSecondFloorSalesArea,
    totalSalesArea,
    totalSalesAreaPing,
    firstFloorSalesAreaOverride,
  };
}

/**
 * 計算成本費用
 */
export function calculateCost(
  input: BasicInput,
  buildingArea: BuildingAreaResult,
  costInput: CostInput,
  fixedParams: FixedParameters = FIXED_PARAMETERS
): CostResult {
  const { constructionCost } = input;
  const { totalFloorAreaPing } = buildingArea;
  const { totalUnits, rightsTransformationFee, neighborAppraisalCount } = costInput;
  
  // 營建成本
  const constructionCostTotal = totalFloorAreaPing * constructionCost;
  
  // 設計費
  const designFee = constructionCostTotal * fixedParams.designFeeRate;
  
  // 公共基金
  const publicFund = constructionCostTotal * fixedParams.publicFundRate;
  
  // 規費
  const fees = constructionCostTotal * fixedParams.feesRate;
  
  // 外審
  const externalReview = constructionCostTotal * fixedParams.externalReviewRate;
  
  // 獎勵申請
  const rewardApplication = constructionCostTotal * fixedParams.rewardApplicationRate;
  
  // 外接管線
  const externalPipeline = totalUnits * fixedParams.externalPipelinePerUnit;
  
  // 地籍整理
  const landRegistration = totalUnits * fixedParams.landRegistrationPerUnit;
  
  // 印花稅
  const stampTax = constructionCostTotal * fixedParams.stampTaxRate;
  
  // 鄰房鑑定
  const neighborAppraisal = neighborAppraisalCount * fixedParams.neighborAppraisalPerUnit;
  
  // 總成本
  const totalCost = designFee + publicFund + fees + externalReview + rewardApplication +
    externalPipeline + landRegistration + stampTax + rightsTransformationFee +
    neighborAppraisal + constructionCostTotal;
  
  return {
    designFee,
    publicFund,
    fees,
    externalReview,
    rewardApplication,
    externalPipeline,
    landRegistration,
    stampTax,
    rightsTransformationFee,
    neighborAppraisal,
    constructionCost: constructionCostTotal,
    totalCost,
  };
}

/**
 * 計算評估報告
 */
export function calculateEvaluation(
  input: BasicInput,
  buildingArea: BuildingAreaResult,
  salesArea: SalesAreaResult,
  cost: CostResult,
  evaluationInput: EvaluationInput,
  fixedParams: FixedParameters = FIXED_PARAMETERS
): EvaluationResult {
  const { baseArea, originalIndoorArea } = input;
  const { parkingTotalCount } = salesArea;
  const { totalSalesAreaPing, firstFloorSalesArea, aboveSecondFloorSalesArea } = salesArea;
  const { totalCost } = cost;
  const { salesAreaPercentage, estimatedParkingPrice, estimatedFirstFloorPrice, estimatedAboveSecondFloorPrice } = evaluationInput;
  
  // 土地坪效
  const baseAreaPing = baseArea * fixedParams.pingConversion;
  const landEfficiency = totalSalesAreaPing / baseAreaPing;
  
  // 預估總銷售收入
  const parkingRevenue = parkingTotalCount * estimatedParkingPrice;
  const firstFloorRevenue = (firstFloorSalesArea * fixedParams.pingConversion) * estimatedFirstFloorPrice;
  const aboveSecondFloorRevenue = (aboveSecondFloorSalesArea * fixedParams.pingConversion) * estimatedAboveSecondFloorPrice;
  const estimatedTotalSalesRevenue = parkingRevenue + firstFloorRevenue + aboveSecondFloorRevenue;
  
  // 共同負擔比
  const commonBurdenRatio = (totalCost / estimatedTotalSalesRevenue) * 100;
  
  // 預估變現車位數量
  const estimatedParkingSalesCount = Math.floor(parkingTotalCount * (salesAreaPercentage / 100));
  
  // 預估變現銷售面積
  const estimatedSalesAreaForSale = totalSalesAreaPing * (salesAreaPercentage / 100);
  
  // 預計變現總金額
  const parkingSalesRevenue = estimatedParkingSalesCount * estimatedParkingPrice;
  const salesAreaRevenue = estimatedSalesAreaForSale * estimatedAboveSecondFloorPrice;
  const estimatedTotalRevenue = parkingSalesRevenue + salesAreaRevenue;
  
  // 分回比例
  const returnRatio = ((estimatedTotalSalesRevenue - totalCost) / estimatedTotalSalesRevenue) * 100;
  
  // 預估分回室內坪數（扣除變現面積後，再扣除公設比）
  const remainingSalesArea = totalSalesAreaPing - estimatedSalesAreaForSale;
  const estimatedReturnIndoorArea = remainingSalesArea * (1 - (input.estimatedCommonAreaRatio / 100));
  
  // 一坪換幾坪
  const pingToPingRatio = originalIndoorArea > 0 ? estimatedReturnIndoorArea / originalIndoorArea : 0;
  
  return {
    landEfficiency,
    estimatedTotalSalesRevenue,
    commonBurdenRatio,
    estimatedParkingSalesCount,
    estimatedSalesAreaForSale,
    estimatedTotalRevenue,
    returnRatio,
    estimatedReturnIndoorArea,
    pingToPingRatio,
  };
}

/**
 * 完整計算流程
 */
export function calculateAll(
  basicInput: BasicInput,
  rewardFloorAreaRatio: number,
  costInput: CostInput,
  evaluationInput: EvaluationInput,
  firstFloorSalesAreaOverride?: number
): {
  buildingArea: BuildingAreaResult;
  salesArea: SalesAreaResult;
  cost: CostResult;
  evaluation: EvaluationResult;
} {
  const buildingArea = calculateBuildingArea(basicInput, rewardFloorAreaRatio);
  const salesArea = calculateSalesArea(basicInput, buildingArea, firstFloorSalesAreaOverride);
  const cost = calculateCost(basicInput, buildingArea, costInput);
  const evaluation = calculateEvaluation(basicInput, buildingArea, salesArea, cost, evaluationInput);
  
  return {
    buildingArea,
    salesArea,
    cost,
    evaluation,
  };
}

