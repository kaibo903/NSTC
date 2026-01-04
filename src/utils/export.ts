import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { CalculationResult, BasicInput } from '../types';

/**
 * 匯出 PDF
 */
export function exportToPDF(result: CalculationResult, basicInput: BasicInput): void {
  const doc = new jsPDF();
  
  // 封面
  doc.setFontSize(20);
  doc.text('地主都市更新全案管理試算報告', 105, 30, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`試算日期：${new Date().toLocaleDateString('zh-TW')}`, 105, 50, { align: 'center' });
  
  // 試算模型介紹
  doc.addPage();
  doc.setFontSize(16);
  doc.text('試算模型介紹', 20, 20);
  doc.setFontSize(12);
  const introText = [
    '本試算平台提供五大構面評估：',
    '1. 基本資料：基地條件與參數設定',
    '2. 建築面積試算：自動計算總樓地板面積',
    '3. 銷售面積試算：計算可銷售面積',
    '4. 成本費用：都市更新相關成本',
    '5. 評估報告：核心指標與決策建議',
    '',
    '參數類型說明：',
    '• 個案參數：依基地基本資料輸入',
    '• 固定參數：依法規或經驗值之固定值',
    '• 變動參數：假設性較高之參數'
  ];
  let yPos = 35;
  introText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });
  
  // 基本資料
  doc.addPage();
  doc.setFontSize(16);
  doc.text('一、基本資料', 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['項目', '數值', '單位']],
    body: [
      ['基地面積', basicInput.baseArea.toFixed(2), 'm²'],
      ['建蔽率', basicInput.buildingCoverageRatio.toFixed(2), '%'],
      ['容積率', basicInput.floorAreaRatio.toFixed(2), '%'],
      ['開挖率', basicInput.excavationRatio.toFixed(2), '%'],
      ['更新前原室內坪數', basicInput.originalIndoorArea.toFixed(2), '坪'],
      ['地主人數', basicInput.landownerCount.toString(), '人'],
    ],
  });
  
  // 建築面積試算結果
  doc.addPage();
  doc.setFontSize(16);
  doc.text('二、建築面積試算', 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['項目', '數值', '單位']],
    body: [
      ['總樓地板面積', result.buildingArea.totalFloorArea.toFixed(2), 'm²'],
      ['總樓地板面積', result.buildingArea.totalFloorAreaPing.toFixed(2), '坪'],
      ['預估地上層數', result.buildingArea.estimatedAboveGroundFloors.toString(), '層'],
    ],
  });
  
  // 銷售面積試算結果
  doc.addPage();
  doc.setFontSize(16);
  doc.text('三、銷售面積試算', 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['項目', '數值', '單位']],
    body: [
      ['總銷售面積', result.salesArea.totalSalesArea.toFixed(2), 'm²'],
      ['總銷售面積', result.salesArea.totalSalesAreaPing.toFixed(2), '坪'],
      ['預估車位總數量', result.salesArea.parkingTotalCount.toString(), '位'],
    ],
  });
  
  // 成本明細
  doc.addPage();
  doc.setFontSize(16);
  doc.text('四、成本明細', 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['項目', '金額（元）']],
    body: [
      ['設計費', result.cost.designFee.toLocaleString('zh-TW')],
      ['公共基金', result.cost.publicFund.toLocaleString('zh-TW')],
      ['規費', result.cost.fees.toLocaleString('zh-TW')],
      ['外審', result.cost.externalReview.toLocaleString('zh-TW')],
      ['獎勵申請', result.cost.rewardApplication.toLocaleString('zh-TW')],
      ['外接管線', result.cost.externalPipeline.toLocaleString('zh-TW')],
      ['地籍整理', result.cost.landRegistration.toLocaleString('zh-TW')],
      ['印花稅', result.cost.stampTax.toLocaleString('zh-TW')],
      ['權利變換費用', result.cost.rightsTransformationFee.toLocaleString('zh-TW')],
      ['鄰房鑑定', result.cost.neighborAppraisal.toLocaleString('zh-TW')],
      ['營建成本', result.cost.constructionCost.toLocaleString('zh-TW')],
      ['預估總成本支出', result.cost.totalCost.toLocaleString('zh-TW')],
    ],
  });
  
  // 評估報告核心指標
  doc.addPage();
  doc.setFontSize(16);
  doc.text('五、評估報告核心指標', 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['指標', '數值', '單位']],
    body: [
      ['土地坪效', result.evaluation.landEfficiency.toFixed(2), '倍'],
      ['預估總銷售收入', result.evaluation.estimatedTotalSalesRevenue.toLocaleString('zh-TW'), '元'],
      ['共同負擔比', result.evaluation.commonBurdenRatio.toFixed(2), '%'],
      ['分回比例', result.evaluation.returnRatio.toFixed(2), '%'],
      ['預估分回室內坪數', result.evaluation.estimatedReturnIndoorArea.toFixed(2), '坪'],
      ['一坪換幾坪', result.evaluation.pingToPingRatio.toFixed(2), '倍'],
      ['預計變現總金額', result.evaluation.estimatedTotalRevenue.toLocaleString('zh-TW'), '元'],
    ],
  });
  
  // 引用附錄
  doc.addPage();
  doc.setFontSize(16);
  doc.text('引用附錄', 20, 20);
  doc.setFontSize(12);
  doc.text('本報告依據以下法規與標準：', 20, 35);
  doc.text('• 都市更新條例', 20, 45);
  doc.text('• 建築技術規則', 20, 55);
  doc.text('• 權利變換估價報告', 20, 65);
  
  doc.save('都市更新試算報告.pdf');
}

/**
 * 匯出 Excel
 */
export function exportToExcel(result: CalculationResult, basicInput: BasicInput): void {
  const workbook = XLSX.utils.book_new();
  
  // Inputs 工作表
  const inputsData = [
    ['項目', '數值', '單位'],
    ['基地面積', basicInput.baseArea, 'm²'],
    ['建蔽率', basicInput.buildingCoverageRatio, '%'],
    ['容積率', basicInput.floorAreaRatio, '%'],
    ['開挖率', basicInput.excavationRatio, '%'],
    ['更新前原室內坪數', basicInput.originalIndoorArea, '坪'],
    ['地主人數', basicInput.landownerCount, '人'],
    ['營建成本', basicInput.constructionCost, '元/坪'],
    ['法定工程造價', basicInput.legalConstructionCost, '元/m²'],
  ];
  const inputsSheet = XLSX.utils.aoa_to_sheet(inputsData);
  XLSX.utils.book_append_sheet(workbook, inputsSheet, 'Inputs');
  
  // Outputs 工作表
  const outputsData = [
    ['指標', '數值', '單位'],
    ['總樓地板面積', result.buildingArea.totalFloorAreaPing, '坪'],
    ['總銷售面積', result.salesArea.totalSalesAreaPing, '坪'],
    ['預估總銷售收入', result.evaluation.estimatedTotalSalesRevenue, '元'],
    ['共同負擔比', result.evaluation.commonBurdenRatio, '%'],
    ['分回比例', result.evaluation.returnRatio, '%'],
    ['預估分回室內坪數', result.evaluation.estimatedReturnIndoorArea, '坪'],
    ['一坪換幾坪', result.evaluation.pingToPingRatio, '倍'],
    ['預計變現總金額', result.evaluation.estimatedTotalRevenue, '元'],
  ];
  const outputsSheet = XLSX.utils.aoa_to_sheet(outputsData);
  XLSX.utils.book_append_sheet(workbook, outputsSheet, 'Outputs');
  
  // Costs 工作表
  const costsData = [
    ['項目', '金額（元）'],
    ['設計費', result.cost.designFee],
    ['公共基金', result.cost.publicFund],
    ['規費', result.cost.fees],
    ['外審', result.cost.externalReview],
    ['獎勵申請', result.cost.rewardApplication],
    ['外接管線', result.cost.externalPipeline],
    ['地籍整理', result.cost.landRegistration],
    ['印花稅', result.cost.stampTax],
    ['權利變換費用', result.cost.rightsTransformationFee],
    ['鄰房鑑定', result.cost.neighborAppraisal],
    ['營建成本', result.cost.constructionCost],
    ['預估總成本支出', result.cost.totalCost],
  ];
  const costsSheet = XLSX.utils.aoa_to_sheet(costsData);
  XLSX.utils.book_append_sheet(workbook, costsSheet, 'Costs');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, '都市更新試算報告.xlsx');
}

/**
 * 匯出 JSON
 */
export function exportToJSON(result: CalculationResult, basicInput: BasicInput): void {
  const data = {
    timestamp: new Date().toISOString(),
    basicInput,
    result,
  };
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveAs(blob, '都市更新試算資料.json');
}

/**
 * 匯入 JSON
 */
export function importFromJSON(file: File): Promise<{ basicInput: BasicInput; result: CalculationResult }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve({
          basicInput: data.basicInput,
          result: data.result,
        });
      } catch (error) {
        reject(new Error('無法解析 JSON 檔案'));
      }
    };
    reader.onerror = () => reject(new Error('讀取檔案失敗'));
    reader.readAsText(file);
  });
}


