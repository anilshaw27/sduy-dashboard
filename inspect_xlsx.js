import * as XLSX from 'xlsx';
import fs from 'fs';

try {
    const buf = fs.readFileSync('c:/Users/Hp/.gemini/antigravity/playground/baryonic-plasma/student format batch.xlsx');
    const wb = XLSX.read(buf, {type: 'buffer'});
    wb.SheetNames.forEach(wsname => {
        console.log('--- Sheet:', wsname, '---');
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {header: 1});
        if (data.length > 0) {
            console.log('Found data in', wsname);
            console.log(JSON.stringify(data.slice(0, 5), null, 2));
        } else {
            console.log(wsname, 'is empty');
        }
    });
} catch (e) {
    console.error('Error reading XLSX:', e);
}
