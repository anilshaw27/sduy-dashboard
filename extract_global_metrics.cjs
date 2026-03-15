const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\Hp\\.gemini\\antigravity\\playground\\baryonic-plasma\\SDUY MPR -February 2026.xlsx');

// Let's check the State_wise sheet for totals
const stateSheetName = 'State_wise';
const stateSheet = workbook.Sheets[stateSheetName];
const stateData = XLSX.utils.sheet_to_json(stateSheet, { header: 1 });

// The columns in State_wise are typically:
// S. No., State, Target, Registered/Enrolled, Undergoing Training, Trained Candidates, Certified Candidates, SC, ST, EWS, Women, ...
// The last row is usually 'Grand Total' Or we can sum them up manually.

let target = 0;
let enrolled = 0;
let training = 0;
let trained = 0;
let certified = 0;
let sc = 0;
let st = 0;
let women = 0;

for (let r = 1; r < stateData.length; r++) {
  const row = stateData[r];
  if (!row || row.length === 0) continue;
  
  const stateOrTotal = String(row[1] || row[0] || '').trim();
  
  if (stateOrTotal === 'Grand Total') {
     target = parseInt(row[2]) || 0;
     enrolled = parseInt(row[3]) || 0;
     training = parseInt(row[4]) || 0;
     trained = parseInt(row[5]) || 0;
     certified = parseInt(row[6]) || 0;
     // Let's print out the row to see indices for SC ST Women
     console.log("Grand Total Row Indices:", JSON.stringify(row));
     break;
  }
}

// Fallback manual sum just in case
if (target === 0) {
    let t = 0, e = 0, tr = 0, tra = 0, c = 0, _sc = 0, _st = 0, _w = 0;
    // Assume columns based on previous extraction
    // "Target Allocated": 2, "Registered / Enrolled": 3, "Ongoing Training": 4, "Course completed": 5, "Certified": 6, "SC": 7, "ST": 8, "General-EWS": 9, "Women": 10
    
    // Find header row internally
    let headerRowIdx = 0;
    for (let r=0; r<10; r++) {
        if (stateData[r] && stateData[r].includes("Target")) {
            headerRowIdx = r;
            console.log("Found header at row", r, ":", JSON.stringify(stateData[r]));
            break;
        }
    }
    
    const headers = stateData[headerRowIdx];
    let targetIdx = -1, enrolledIdx = -1, trainingIdx = -1, trainedIdx = -1, certIdx = -1, scIdx = -1, stIdx = -1, womenIdx = -1;
    for(let i=0; i<headers.length; i++) {
        let text = String(headers[i] || '').toLowerCase();
        if (text.includes("target")) targetIdx = i;
        if (text.includes("registered") || text.includes("enrolled")) enrolledIdx = i;
        if (text.includes("ongoing") || text.includes("undergoing")) trainingIdx = i;
        if (text.includes("completed") || text.includes("trained") && !text.includes("undergoing")) trainedIdx = i;
        if (text.includes("certified")) certIdx = i;
        if (text === "sc") scIdx = i;
        if (text === "st") stIdx = i;
        if (text === "women") womenIdx = i;
    }
    
    for (let r=headerRowIdx+1; r<stateData.length; r++) {
       const row = stateData[r];
       if (!row || !row[1] || String(row[1]).includes("Total")) continue;
       
       t += parseInt(row[targetIdx]) || 0;
       e += parseInt(row[enrolledIdx]) || 0;
       tr += parseInt(row[trainingIdx]) || 0;
       tra += parseInt(row[trainedIdx]) || 0;
       c += parseInt(row[certIdx]) || 0;
       _sc += parseInt(row[scIdx]) || 0;
       _st += parseInt(row[stIdx]) || 0;
       _w += parseInt(row[womenIdx]) || 0;
    }
    console.log(`Manual Sum - Target: ${t}, Enrolled: ${e}, Training: ${tr}, Trained: ${tra}, Certified: ${c}, SC: ${_sc}, ST: ${_st}, Women: ${_w}`);
}

