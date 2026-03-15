const XLSX = require('xlsx');
const workbook = XLSX.readFile('student format batch.xlsx');
workbook.SheetNames.forEach(name => {
  const worksheet = workbook.Sheets[name];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`Sheet: ${name}, Rows found: ${data.length}`);
  if (data.length > 0) {
    console.log(`Headers in ${name}:`, data[0]);
    console.log(`Row 1 in ${name}:`, data[1]);
  }
});
