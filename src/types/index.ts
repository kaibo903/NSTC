// 基本資料輸入類型
export interface BasicInput {
  // 必填欄位
  baseArea: number; // 基地面積 (m²)
  buildingCoverageRatio: number; // 建蔽率 (%)
  floorAreaRatio: number; // 容積率 (%)
  excavationRatio: number; // 開挖率 (%)
  maxRoadWidth: number; // 最寬道路寬度 (m)
  estimatedFloorHeight: number; // 預估地上單層樓高 (m)
  estimatedRoofFloors: number; // 預估屋突層數
  estimatedBasementFloors: number; // 預估地下層數
  originalIndoorArea: number; // 更新前原室內坪數 (坪)
  landownerCount: number; // 地主人數 (人)
  constructionCost: number; // 營建成本 (元/坪)
  legalConstructionCost: number; // 法定工程造價 (元/m²)
  
  // 選填欄位（進階）
  lotNumber?: string; // 地號
  section?: string; // 地段
  zoning?: string; // 使用分區
  maxRoadToDepth?: number; // 最大路寬至建築物深度
  
  // 變動參數
  estimatedCommonAreaRatio: number; // 預估公設比 (預設 35%)
  parkingUnitArea: number; // 車位單位面積 (預設 30 m²/位)
  reductionFactor: number; // 折減係數 (預設 0.85)
}

// 建築面積試算結果
export interface BuildingAreaResult {
  rewardFloorAreaRatio: number; // 獎勵容積率 (%)
  maxBuildingArea: number; // 最大建築面積 (m²)
  legalFloorArea: number; // 法定容積面積 (m²)
  rewardFloorArea: number; // 獎勵容積面積 (m²)
  mechArea: number; // 機電空間面積 (m²)
  stairwellArea: number; // 梯廳空間面積 (m²)
  balconyArea: number; // 陽台空間面積 (m²)
  roofArea: number; // 屋突面積 (m²)
  excavationArea: number; // 開挖面積 (m²)
  basementArea: number; // 地下層面積 (m²)
  totalFloorArea: number; // 總樓地板面積 (m²)
  totalFloorAreaPing: number; // 總樓地板面積 (坪)
  
  // 自動推估
  estimatedTotalHeight: number; // 預估興建總樓高
  estimatedAboveGroundFloors: number; // 預估地上層數
}

// 銷售面積試算結果
export interface SalesAreaResult {
  parkingTotalArea: number; // 預估車位總面積 (m²)
  parkingTotalCount: number; // 預估車位總數量
  firstFloorSalesArea: number; // 一樓銷售面積 (m²)
  aboveSecondFloorSalesArea: number; // 二樓以上銷售面積 (m²)
  totalSalesArea: number; // 總銷售面積 (m²)
  totalSalesAreaPing: number; // 總銷售面積 (坪)
  firstFloorSalesAreaOverride?: number; // 一樓銷售面積覆寫
}

// 成本費用
export interface CostInput {
  totalUnits: number; // 更新後預估總戶數
  loanInterestRate: number; // 貸款年利率 (%)
  rightsTransformationFee: number; // 權利變換費用 (元)
  neighborAppraisalCount: number; // 鄰房鑑定戶數
}

export interface CostResult {
  designFee: number; // 設計費
  publicFund: number; // 公共基金
  fees: number; // 規費
  externalReview: number; // 外審
  rewardApplication: number; // 獎勵申請
  externalPipeline: number; // 外接管線
  landRegistration: number; // 地籍整理
  stampTax: number; // 印花稅
  rightsTransformationFee: number; // 權利變換費用
  neighborAppraisal: number; // 鄰房鑑定
  constructionCost: number; // 營建成本
  totalCost: number; // 預估總成本支出
}

// 評估報告輸入
export interface EvaluationInput {
  salesAreaPercentage: number; // 銷售面積百分比 (%)
  estimatedParkingPrice: number; // 預估車位單價 (元/位)
  estimatedFirstFloorPrice: number; // 預估一樓單價 (元/坪)
  estimatedAboveSecondFloorPrice: number; // 預估二樓以上單價 (元/坪)
}

// 評估報告結果
export interface EvaluationResult {
  landEfficiency: number; // 土地坪效
  estimatedTotalSalesRevenue: number; // 預估總銷售收入
  commonBurdenRatio: number; // 共同負擔比 (%)
  estimatedParkingSalesCount: number; // 預估變現車位數量
  estimatedSalesAreaForSale: number; // 預估變現銷售面積
  estimatedTotalRevenue: number; // 預計變現總金額
  returnRatio: number; // 分回比例 (%)
  estimatedReturnIndoorArea: number; // 預估分回室內坪數
  pingToPingRatio: number; // 一坪換幾坪 (倍)
}

// 完整計算結果
export interface CalculationResult {
  basicInput: BasicInput;
  buildingArea: BuildingAreaResult;
  salesArea: SalesAreaResult;
  cost: CostResult;
  evaluation: EvaluationResult;
}

// 固定參數
export interface FixedParameters {
  mechLimit: number; // 機電上限 15%
  stairwellLimit: number; // 梯廳上限 5%
  balconyLimit: number; // 陽台上限 10%
  singleRoofLimit: number; // 單層屋突上限 12.5%
  pingConversion: number; // 坪數換算 1 m² = 0.3025 坪
  
  // 成本費率
  designFeeRate: number; // 設計費 9%
  publicFundRate: number; // 公共基金 0.4%
  feesRate: number; // 規費 0.1%
  externalReviewRate: number; // 外審 0.01%
  rewardApplicationRate: number; // 獎勵申請 0.2%
  externalPipelinePerUnit: number; // 外接管線 97,500/戶
  landRegistrationPerUnit: number; // 地籍整理 20,000/戶
  stampTaxRate: number; // 印花稅 0.1%
  neighborAppraisalPerUnit: number; // 鄰房鑑定 (假設 50,000/戶)
}

// 引用知識庫類型
export interface Citation {
  key: string;
  definition: string;
  formula?: string;
  source: string;
  chapter?: string;
  page?: string;
}


