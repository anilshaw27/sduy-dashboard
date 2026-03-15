const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\Hp\\.gemini\\antigravity\\playground\\baryonic-plasma\\SDUY MPR -February 2026.xlsx');

const sheetName = 'MPR-February 2026';
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log(`\n--- Sheet: ${sheetName} ---`);
for (let i = 0; i < Math.min(30, data.length); i++) {
    console.log(`Row ${i}:`, JSON.stringify(data[i]));
}
