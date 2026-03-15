const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\Hp\\.gemini\\antigravity\\playground\\baryonic-plasma\\SDUY MPR -February 2026.xlsx');

const sheetName = 'Course_wise_Summary';
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

for (let r = 0; r < data.length; r++) {
  const row = data[r];
  if (!row || row.length === 0) continue;
  
  const firstCol = String(row[0] || '').trim();
  const secondCol = String(row[1] || '').trim();
  
  if (firstCol === 'Grand Total' || secondCol === 'Grand Total' || firstCol.includes('Grand Total') || secondCol.includes('Grand Total')) {
     console.log("Grand Total Row Indices:", JSON.stringify(row));
     // Let's also print the header row to understand the columns
     let headerRow = [];
     for(let i=r-1; i>=0; i--) {
        if(data[i] && (String(data[i][0]).toLowerCase().includes('s. no') || String(data[i][0]).toLowerCase().includes('course'))) {
            headerRow = data[i];
            break;
        }
     }
     console.log("Header row:", JSON.stringify(headerRow));
     break;
  }
}
