import type { FixedParameters } from '../types';

export const FIXED_PARAMETERS: FixedParameters = {
  mechLimit: 0.15, // 機電上限 15%
  stairwellLimit: 0.05, // 梯廳上限 5%
  balconyLimit: 0.10, // 陽台上限 10%
  singleRoofLimit: 0.125, // 單層屋突上限 12.5%
  pingConversion: 0.3025, // 坪數換算 1 m² = 0.3025 坪
  
  // 成本費率
  designFeeRate: 0.09, // 設計費 9%
  publicFundRate: 0.004, // 公共基金 0.4%
  feesRate: 0.001, // 規費 0.1%
  externalReviewRate: 0.0001, // 外審 0.01%
  rewardApplicationRate: 0.002, // 獎勵申請 0.2%
  externalPipelinePerUnit: 97500, // 外接管線 97,500/戶
  landRegistrationPerUnit: 20000, // 地籍整理 20,000/戶
  stampTaxRate: 0.001, // 印花稅 0.1%
  neighborAppraisalPerUnit: 50000, // 鄰房鑑定 (假設 50,000/戶)
};


