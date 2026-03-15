const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\Hp\\.gemini\\antigravity\\playground\\baryonic-plasma\\SDUY MPR -February 2026.xlsx');

const sheetName = 'MPR-February 2026';
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let gtRow = null;
let sums = {
  totalTarget: 0,
  femaleRegistered: 0,
  scRegistered: 0,
  stRegistered: 0,
  totalRegistered: 0,
  totalTraining: 0,
  totalTrained: 0,
  totalCertified: 0
};

for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (!row) continue;
  
  if (String(row[1] || '').trim() === 'Grand Total' || String(row[2] || '').trim() === 'Grand Total' || String(row[0] || '').trim() === 'Grand Total' || String(row[4] || '').trim() === 'Grand Total') {
      gtRow = row;
  }
  
  if (String(row[4] || '').trim() === 'Total') {
     sums.totalTarget += parseInt(row[8]) || 0;
     sums.femaleRegistered += parseInt(row[9]) || 0;
     sums.scRegistered += parseInt(row[10]) || 0;
     sums.stRegistered += parseInt(row[11]) || 0;
     sums.totalRegistered += parseInt(row[13]) || 0;
     sums.totalTraining += parseInt(row[17]) || 0;
     sums.totalTrained += parseInt(row[21]) || 0;
     sums.totalCertified += parseInt(row[25]) || 0;
  }
}

if (gtRow) {
    console.log("Found Grand Total Row:", JSON.stringify(gtRow));
    console.log({
        totalTarget: parseInt(gtRow[8]) || sums.totalTarget,
        femaleRegistered: parseInt(gtRow[9]) || sums.femaleRegistered,
        scRegistered: parseInt(gtRow[10]) || sums.scRegistered,
        stRegistered: parseInt(gtRow[11]) || sums.stRegistered,
        totalRegistered: parseInt(gtRow[13]) || sums.totalRegistered,
        totalTraining: parseInt(gtRow[17]) || sums.totalTraining,
        totalTrained: parseInt(gtRow[21]) || sums.totalTrained,
        totalCertified: parseInt(gtRow[25]) || sums.totalCertified
    });
} else {
    console.log("No Grand Total row found, using sums of state 'Total' rows:");
    console.log(sums);
}
