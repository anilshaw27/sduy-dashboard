import * as XLSX from 'xlsx';
import fs from 'fs';

try {
    const filePath = 'c:/Users/Hp/.gemini/antigravity/playground/baryonic-plasma/student format batch.xlsx';
    console.log('File size:', fs.statSync(filePath).size);
    const buf = fs.readFileSync(filePath);
    const wb = XLSX.read(buf, {type: 'buffer', cellFormula: false, cellHTML: false, cellText: false});
    console.log('Sheets:', wb.SheetNames);
    
    wb.SheetNames.forEach(name => {
        const ws = wb.Sheets[name];
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
        console.log(`Sheet "${name}" range:`, ws['!ref']);
        
        // Try reading raw rows even if sheet_to_json fails
        const rows = XLSX.utils.sheet_to_json(ws, {header: 1, defval: ''});
        console.log(`Sheet "${name}" row count:`, rows.length);
        if (rows.length > 0) {
            console.log(`Content of "${name}":`);
            rows.slice(0, 10).forEach((row, i) => {
                console.log(`Row ${i}:`, JSON.stringify(row));
            });
        }
    });
} catch (e) {
    console.error('CRITICAL ERROR:', e);
}
