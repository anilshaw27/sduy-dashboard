import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATES_DATA } from './stateData.js';
import { supabase } from './supabaseClient';

const COLORS = {
  odisha: '#059669',
  jharkhand: '#2563eb',
  westbengal: '#dc2626',
  bihar: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

const STATES = ['Odisha', 'Jharkhand', 'West Bengal', 'Bihar'];

const DISTRICTS = {
  Odisha: [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj',
    'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
  ],
  Jharkhand: [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
    'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
    'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahebganj', 'Seraikela Kharsawan',
    'Simdega', 'West Singhbhum'
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
  ],
  Bihar: [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
    'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
    'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
    'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
    'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
  ]
};

// Total districts per state for target calculations
const STATE_DISTRICT_COUNTS = {
  Odisha: DISTRICTS.Odisha.length,
  Jharkhand: DISTRICTS.Jharkhand.length,
  'West Bengal': DISTRICTS['West Bengal'].length,
  Bihar: DISTRICTS.Bihar.length
};
const TOTAL_DISTRICTS = Object.values(STATE_DISTRICT_COUNTS).reduce((a, b) => a + b, 0);
const PER_DISTRICT_TARGET = Math.round(33360 / TOTAL_DISTRICTS);

const COURSES = [
  // Active since the starting of the project
  { name: 'Product Assembly Assistant (Solar-LED)', duration: '330 hrs', level: 'Active Since Start', status: 'active' },
  { name: 'O Level (IT)', duration: '540 hrs', level: 'Active Since Start', status: 'active' },
  // Old Courses Active (24 May 2024 to 27 Nov 2025)
  { name: 'Foundation course in Machine Learning using Python', duration: '90 hrs', level: 'Old Course', status: 'old' },
  { name: 'Foundation course in Internet of Things (IoT)', duration: '90 hrs', level: 'Old Course', status: 'old' },
  { name: 'Certified Computer Application Accounting and Publishing Assistant', duration: '360 hrs', level: 'Old Course', status: 'old' },
  { name: 'Certified Web Developer', duration: '210 hrs', level: 'Old Course', status: 'old' },
  { name: 'Certified Data Entry and Office Assistant (Upskilling)', duration: '210 hrs', level: 'Old Course', status: 'old' },
  { name: 'Foundation course in Information Security', duration: '90 hrs', level: 'Old Course', status: 'old' },
  // New Approved Courses from 28 Nov 2025
  { name: 'Foundation of Artificial Intelligence Technology', duration: '90 hrs', level: 'New Approved', status: 'new' },
  { name: 'Fundamentals of Internet of Things (IoT)', duration: '90 hrs', level: 'New Approved', status: 'new' },
  { name: 'Computer Application Accounting and Publishing Assistance', duration: '360 hrs', level: 'New Approved', status: 'new' },
  { name: 'Full Stack Development Associate', duration: '390 hrs', level: 'New Approved', status: 'new' },
  { name: 'Essentials of Data Entry and Office Automation', duration: '150 hrs', level: 'New Approved', status: 'new' },
  { name: 'Fundamental of Information Security', duration: '90 hrs', level: 'New Approved', status: 'new' }
];

// Initial sample data
const initialData = {
  summary: {
    totalTarget: 33360,
    enrolled: 10817,
    training: 5767,
    certified: 2435,
    placed: 0,
    scstPercent: 83.8,
    womenPercent: 16.5,
    fundUtilized: 12.37,
    totalBudget: 50.76
  },
  states: STATES_DATA,
  monthlyTrend: [
    { month: 'Oct 25', enrolled: 8234, certified: 4123, placed: 0 },
    { month: 'Nov 25', enrolled: 9456, certified: 4867, placed: 0 },
    { month: 'Dec 25', enrolled: 10234, certified: 5234, placed: 0 },
    { month: 'Jan 26', enrolled: 11123, certified: 5678, placed: 0 },
    { month: 'Feb 26', enrolled: 10817, certified: 2435, placed: 0 },
    { month: 'Mar 26', enrolled: 10817, certified: 2435, placed: 0 }
  ],
  courses: {
    'Product Assembly Assistant (Solar-LED)': { enrolled: 2004, ongoing: 1385, completed: 619, certified: 142, passRate: 23 },
    'O Level (IT)': { enrolled: 540, ongoing: 420, completed: 120, certified: 54, passRate: 45 },
    'Foundation course in Machine Learning using Python': { enrolled: 391, ongoing: 356, completed: 35, certified: 8, passRate: 23 },
    'Foundation course in Internet of Things (IoT)': { enrolled: 156, ongoing: 71, completed: 85, certified: 33, passRate: 39 },
    'Certified Computer Application Accounting and Publishing Assistant': { enrolled: 2534, ongoing: 987, completed: 1547, certified: 803, passRate: 52 },
    'Certified Web Developer': { enrolled: 833, ongoing: 548, completed: 285, certified: 180, passRate: 63 },
    'Certified Data Entry and Office Assistant (Upskilling)': { enrolled: 3304, ongoing: 1108, completed: 2196, certified: 1097, passRate: 50 },
    'Foundation course in Information Security': { enrolled: 471, ongoing: 308, completed: 163, certified: 118, passRate: 72 },
    'Foundation of Artificial Intelligence Technology': { enrolled: 134, ongoing: 134, completed: 0, certified: 0, passRate: 0 },
    'Fundamentals of Internet of Things (IoT)': { enrolled: 0, ongoing: 0, completed: 0, certified: 0, passRate: 0 },
    'Computer Application Accounting and Publishing Assistance': { enrolled: 20, ongoing: 20, completed: 0, certified: 0, passRate: 0 },
    'Full Stack Development Associate': { enrolled: 60, ongoing: 60, completed: 0, certified: 0, passRate: 0 },
    'Essentials of Data Entry and Office Automation': { enrolled: 0, ongoing: 0, completed: 0, certified: 0, passRate: 0 },
    'Fundamental of Information Security': { enrolled: 220, ongoing: 220, completed: 0, certified: 0, passRate: 0 }
  },
  financial: {
    training: { allocated: 38.24, released: 12.86, utilized: 8.42 },
    assessment: { allocated: 4.82, released: 1.84, utilized: 1.42 },
    manpower: { allocated: 3.24, released: 1.62, utilized: 1.24 },
    infrastructure: { allocated: 1.86, released: 1.12, utilized: 0.86 },
    publicity: { allocated: 0.60, released: 0.34, utilized: 0.18 },
    other: { allocated: 2.00, released: 0.64, utilized: 0.25 }
  }
};

export default function SDUYDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedState, setSelectedState] = useState('Odisha');
  const [data, setData] = useState(initialData);
  const [user, setUser] = useState(null); // { role, state, name }
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [monthlyInput, setMonthlyInput] = useState({
    state: '',
    month: new Date().toISOString().slice(0, 7),
    districts: {},
    scCount: 0,
    stCount: 0,
    ewsCount: 0,
    womenCount: 0,
    fundReceived: 0,
    fundUtilized: 0,
    remarks: ''
  });
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    batchNo: '', courseName: '', nielitRegNo: '', name: '', fatherName: '', 
    category: 'General', gender: 'Male', aadhaarNo: '', apaarId: '', religion: '', 
    whatsappNo: '', address: '', isEmployed: 'No', instituteName: '', 
    venueAddress: '', hqAccrNo: '', district: '', regMonth: new Date().toISOString().slice(0, 7)
  });
  const [studentFile, setStudentFile] = useState(null);
  const [approvalDoc, setApprovalDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Timeline Target Tracker - Dynamic Calculations
  const projectStart = new Date(2024, 5); // June 2024 (Month 5 zero-indexed)
  const reportDate = new Date(2026, 2); // March 2026
  const monthsPassed = (reportDate.getFullYear() - projectStart.getFullYear()) * 12 + (reportDate.getMonth() - projectStart.getMonth()) + 1; // 22
  const totalProjectTarget = 50040;
  const targetPerMonth = totalProjectTarget / 36;
  const expectedTarget = Math.round(monthsPassed * targetPerMonth);
  
  const actuallyEnrolled = data.summary.enrolled;
  const actuallyTrained = data.summary.enrolled - data.summary.training; // 5050 (Enrolled - Ongoing training)
  const actuallyCertified = data.summary.certified; // 2435
  
  const enrolledProgressPercent = Math.round((actuallyEnrolled / expectedTarget) * 100);
  const trainedProgressPercent = Math.round((actuallyTrained / expectedTarget) * 100);
  const certifiedProgressPercent = Math.round((actuallyCertified / expectedTarget) * 100);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data: subs, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submittedAt', { ascending: false });
      
      if (!error && subs) {
        setSubmissions(subs);
      }
    };

    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      setIsFetchingStudents(true);
      try {
        let query = supabase.from('students').select('*').order('created_at', { ascending: false });
        if (user.role === 'Co-PI' && user.state) {
          query = query.eq('state', user.state);
        }
        const { data: stds, error } = await query;
        if (error) throw error;
        setStudents(stds || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setIsFetchingStudents(false);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user]);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('sduy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = loginForm;

    // Define the 6 roles and simple pass logic for now
    // In a production app, we would use supabase.auth.signInWithPassword
    const roles = {
      'admin': { role: 'SuperAdmin', name: 'Super Admin', pass: 'admin123' },
      'pi': { role: 'PI', name: 'Project Investigator', pass: 'pi123' },
      'odisha_copi': { role: 'Co-PI', state: 'Odisha', name: 'Co-PI Odisha', pass: 'odisha123' },
      'wb_copi': { role: 'Co-PI', state: 'West Bengal', name: 'Co-PI West Bengal', pass: 'wb123' },
      'bihar_copi': { role: 'Co-PI', state: 'Bihar', name: 'Co-PI Bihar', pass: 'bihar123' },
      'jharkhand_copi': { role: 'Co-PI', state: 'Jharkhand', name: 'Co-PI Jharkhand', pass: 'jharkhand123' }
    };

    const userData = roles[username.toLowerCase()];
    if (userData && userData.pass === password) {
      const sessionUser = { role: userData.role, state: userData.state || null, name: userData.name };
      setUser(sessionUser);
      localStorage.setItem('sduy_user', JSON.stringify(sessionUser));
      
      // If State Co-PI, pre-select their state
      if (userData.state) {
        setMonthlyInput(prev => ({ ...prev, state: userData.state }));
      }
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sduy_user');
    setActiveTab('overview');
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.courseName) {
      alert('Name and Course are required');
      return;
    }
    
    setIsUploading(true);
    try {
      const studentToInsert = {
        ...newCandidate,
        state: user.state,
        created_at: new Date().toISOString()
      };

      const { data: inserted, error } = await supabase
        .from('students')
        .insert([studentToInsert])
        .select();
      
      if (error) throw error;
      
      alert('Student added successfully');
      setNewCandidate({
        batchNo: '', courseName: '', nielitRegNo: '', name: '', fatherName: '', 
        category: 'General', gender: 'Male', aadhaarNo: '', apaarId: '', religion: '', 
        whatsappNo: '', address: '', isEmployed: 'No', instituteName: '', 
        venueAddress: '', hqAccrNo: '', district: '', regMonth: new Date().toISOString().slice(0, 7)
      });
      setShowCandidateForm(false);
      
      // Refresh list
      const query = supabase.from('students').select('*').order('created_at', { ascending: false });
      if (user.role === 'Co-PI' && user.state) {
        query.eq('state', user.state);
      }
      const { data: updatedStds } = await query;
      setStudents(updatedStds || []);
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Failed to add student');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws);

        const studentRecords = jsonData.map(row => ({
          batchNo: row['Batch No'] || row['Batch'] || '',
          courseName: row['Course Name'] || row['Course'] || '',
          nielitRegNo: row['NIELIT Registration No. (NIELIT Portal)'] || row['NIELIT Reg No'] || '',
          name: row['Name of candidate'] || row['Name'] || '',
          fatherName: row['Father\'s Name'] || row['Father Name'] || '',
          category: row['Category (SC/ST/EWS)'] || row['Category'] || '',
          gender: row['Gender (Male/Female)'] || row['Gender'] || '',
          aadhaarNo: row['Aadhaar Card'] || row['Aadhaar'] || '',
          apaarId: row['APAAR ID'] || '',
          religion: row['Religion'] || '',
          whatsappNo: row['Watsapp No. of candidates'] || row['Whatsapp No'] || '',
          address: row['Communication address and districts of the candidate'] || row['Address'] || '',
          isEmployed: row['Candidate Currently employed (Yes/No)'] || row['Employed'] || 'No',
          instituteName: row['Name of Institute'] || '',
          venueAddress: row['Training venue Address'] || '',
          hqAccrNo: row['HQ Accr number'] || '',
          district: row['District'] || '',
          regMonth: row['Month of Registration'] || row['Reg Month'] || row['Month'] || new Date().toISOString().slice(0, 7),
          state: user.state,
          created_at: new Date().toISOString()
        })).filter(r => r.name);

        if (studentRecords.length === 0) {
          alert('No valid student records found in file');
          setIsUploading(false);
          return;
        }

        const { error } = await supabase.from('students').insert(studentRecords);
        if (error) throw error;

        alert(`Successfully uploaded ${studentRecords.length} students`);
        
        // Refresh list
        const { data: updatedStds } = await supabase
          .from('students')
          .select('*')
          .eq('state', user.state)
          .order('created_at', { ascending: false });
        setStudents(updatedStds || []);
        setIsUploading(false);
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      console.error('Bulk upload error:', err);
      alert('Failed to upload students: ' + err.message);
      setIsUploading(false);
    }
  };

  const handleDownloadStudentList = () => {
    if (students.length === 0) {
      alert('No students to download');
      return;
    }

    const exportData = students.map((s, idx) => ({
      'Sl. No.': idx + 1,
      'Batch No': s.batchNo,
      'Course Name': s.courseName,
      'NIELIT Reg No': s.nielitRegNo,
      'Name of candidate': s.name,
      'Father\'s Name': s.fatherName,
      'Category': s.category,
      'Gender': s.gender,
      'Aadhaar Card': s.aadhaarNo,
      'APAAR ID': s.apaarId,
      'Religion': s.religion,
      'Whatsapp No': s.whatsappNo,
      'Address': s.address,
      'Currently Employed': s.isEmployed,
      'District': s.district,
      'Registration Month': s.regMonth,
      'State': s.state
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `StudentList_${user.state}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const MetricCard = ({ label, value, subtext, trend }) => (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtext && (
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
          {trend === 'up' && '↑ '}{trend === 'down' && '↓ '}{subtext}
        </p>
      )}
    </div>
  );

  const StatusBadge = ({ value, thresholds }) => {
    let color = 'bg-emerald-100 text-emerald-700';
    if (value < thresholds.danger) color = 'bg-red-100 text-red-700';
    else if (value < thresholds.warning) color = 'bg-amber-100 text-amber-700';
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{value}%</span>;
  };

  const stateChartData = Object.entries(data.states).map(([name, vals]) => ({
    name,
    enrolled: vals.enrolled,
    certified: vals.certified,
    placed: vals.placed
  }));

  const courseChartData = Object.entries(data.courses).map(([name, vals]) => ({
    name: name.length > 15 ? name.slice(0, 15) + '...' : name,
    fullName: name,
    enrolled: vals.enrolled,
    certified: vals.certified,
    passRate: vals.passRate
  }));

  const financialChartData = Object.entries(data.financial).map(([name, vals]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    allocated: vals.allocated,
    utilized: vals.utilized,
    utilization: Math.round((vals.utilized / vals.allocated) * 100)
  }));

  const handleSubmitMonthlyData = async () => {
    if (!monthlyInput.state) {
      alert('Please select a state');
      return;
    }
    
    if (!studentFile || !approvalDoc) {
      alert('Please upload both the Student List (XLSX) and the Batch Approval copy (DOCX)');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload Student XLSX
      const studentPath = `students/${Date.now()}_${studentFile.name}`;
      const { error: studentError } = await supabase.storage
        .from('documents')
        .upload(studentPath, studentFile);
      if (studentError) throw studentError;

      // 2. Upload Approval DOCX
      const docPath = `approvals/${Date.now()}_${approvalDoc.name}`;
      const { error: docError } = await supabase.storage
        .from('documents')
        .upload(docPath, approvalDoc);
      if (docError) throw docError;

      // 3. Insert into Database
      const { data: newSub, error: dbError } = await supabase
        .from('submissions')
        .insert([{
          ...monthlyInput,
          submittedAt: new Date().toISOString(),
          studentFileName: studentFile.name,
          approvalDocName: approvalDoc.name,
          studentFileUrl: studentPath,
          approvalDocUrl: docPath,
          status: 'Pending Verification',
          submittedBy: (user && user.name) || 'Unknown'
        }])
        .select();

      if (dbError) throw dbError;

      // NEW: Parse Excel for database entry if available
      if (studentFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            const studentRecords = jsonData.map(row => ({
              batchNo: row['Batch No'] || row['Batch'] || '',
              courseName: row['Course Name'] || row['Course'] || '',
              nielitRegNo: row['NIELIT Registration No. (NIELIT Portal)'] || row['NIELIT Reg No'] || '',
              name: row['Name of candidate'] || row['Name'] || '',
              fatherName: row['Father\'s Name'] || row['Father Name'] || '',
              category: row['Category (SC/ST/EWS)'] || row['Category'] || '',
              gender: row['Gender (Male/Female)'] || row['Gender'] || '',
              aadhaarNo: row['Aadhaar Card'] || row['Aadhaar'] || '',
              apaarId: row['APAAR ID'] || '',
              religion: row['Religion'] || '',
              whatsappNo: row['Watsapp No. of candidates'] || row['Whatsapp No'] || '',
              address: row['Communication address and districts of the candidate'] || row['Address'] || '',
              isEmployed: row['Candidate Currently employed (Yes/No)'] || row['Employed'] || 'No',
              instituteName: row['Name of Institute'] || '',
              venueAddress: row['Training venue Address'] || '',
              hqAccrNo: row['HQ Accr number'] || '',
              district: row['District'] || '',
              regMonth: row['Month of Registration'] || row['Reg Month'] || new Date().toISOString().slice(0, 7),
              state: user.state,
              created_at: new Date().toISOString()
            })).filter(r => r.name);
            
            if (studentRecords.length > 0) {
              await supabase.from('students').insert(studentRecords);
              // Refresh students list
              const query = supabase.from('students').select('*').order('created_at', { ascending: false });
              if (user.role === 'Co-PI' && user.state) {
                query.eq('state', user.state);
              }
              const { data: updatedStds } = await query;
              setStudents(updatedStds || []);
            }
          } catch (err) {
            console.error('Error parsing student Excel:', err);
          }
        };
        reader.readAsArrayBuffer(studentFile);
      }

      setSubmissions([newSub[0], ...submissions]);
      alert('Monthly data and documents submitted successfully and synced to Supabase!');
      
      // Reset form
      setMonthlyInput({
        state: user.state || '',
        month: new Date().toISOString().slice(0, 7),
        districts: {},
        scCount: 0,
        stCount: 0,
        ewsCount: 0,
        womenCount: 0,
        fundReceived: 0,
        fundUtilized: 0,
        remarks: ''
      });
      setStudentFile(null);
      setApprovalDoc(null);
    } catch (error) {
      console.error('Supabase Sync Failed:', error);
      alert(`Submission failed: ${error.message || 'Check connection'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-slate-800 text-white shadow-md' 
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Header (Public) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg text-xl font-black">S</div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">SDUY Project Dashboard</h1>
                <p className="text-sm text-slate-500">Skill Development of Unemployed Youths — PMU Monitoring System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Public) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex gap-2 flex-wrap">
            <TabButton id="overview" label="📊 Overview" />
            <TabButton id="features" label="🚀 Project Features" />
            <TabButton id="states" label="🗺️ State Progress" />
            <TabButton id="courses" label="📚 Courses" />
            <TabButton id="financial" label="💰 Financial" />
            <TabButton id="input" label="📝 Co-PI Input" />
            <TabButton id="reports" label="📄 Reports" />
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-3">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Timeline Target Tracker */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
               </div>
               <div className="w-full relative z-10 flex flex-col lg:flex-row justify-between gap-8">
                 <div className="flex-1">
                   <h2 className="text-lg font-bold text-slate-800 mb-1">Project Target Timeline</h2>
                   <p className="text-sm text-slate-500 mb-4">Tracking Enrolled, Trained and Certified candidates against the expected timeline target (June 2024 – May 2027)</p>
                   <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Expected Target as of Date</p>
                        <p className="text-3xl font-bold text-slate-800">{expectedTarget.toLocaleString()}</p>
                      </div>
                      <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
                      <div>
                        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Actually Enrolled</p>
                        <p className="text-3xl font-bold text-blue-600">{actuallyEnrolled.toLocaleString()}</p>
                        {actuallyEnrolled < expectedTarget && (
                          <p className="text-xs text-red-500 mt-1">↓ {(expectedTarget - actuallyEnrolled).toLocaleString()} below target</p>
                        )}
                        {actuallyEnrolled >= expectedTarget && (
                          <p className="text-xs text-emerald-500 mt-1">↑ {(actuallyEnrolled - expectedTarget).toLocaleString()} above target</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Actually Trained</p>
                        <p className="text-3xl font-bold text-amber-600">{actuallyTrained.toLocaleString()}</p>
                        {actuallyTrained < expectedTarget && (
                          <p className="text-xs text-red-500 mt-1">↓ {(expectedTarget - actuallyTrained).toLocaleString()} below target</p>
                        )}
                        {actuallyTrained >= expectedTarget && (
                          <p className="text-xs text-emerald-500 mt-1">↑ {(actuallyTrained - expectedTarget).toLocaleString()} above target</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Actually Certified</p>
                        <p className="text-3xl font-bold text-emerald-600">{actuallyCertified.toLocaleString()}</p>
                        {actuallyCertified < expectedTarget && (
                          <p className="text-xs text-red-500 mt-1">↓ {(expectedTarget - actuallyCertified).toLocaleString()} below target</p>
                        )}
                        {actuallyCertified >= expectedTarget && (
                          <p className="text-xs text-emerald-500 mt-1">↑ {(actuallyCertified - expectedTarget).toLocaleString()} above target</p>
                        )}
                      </div>
                   </div>
                 </div>
                 <div className="w-full lg:w-1/3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                   <div className="mb-4">
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enrolled vs Target</span>
                       <span className={`text-sm font-bold ${enrolledProgressPercent >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{enrolledProgressPercent}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden shadow-inner">
                       <div className={`h-2 rounded-full transition-all duration-1000 ${enrolledProgressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, enrolledProgressPercent)}%` }}></div>
                     </div>
                   </div>
                   
                   <div className="mb-4">
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trained vs Target</span>
                       <span className={`text-sm font-bold ${trainedProgressPercent >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{trainedProgressPercent}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden shadow-inner">
                       <div className={`h-2 rounded-full transition-all duration-1000 ${trainedProgressPercent >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, trainedProgressPercent)}%` }}></div>
                     </div>
                   </div>
                   
                   <div className="mb-4">
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Certified vs Target</span>
                       <span className={`text-sm font-bold ${certifiedProgressPercent >= 100 ? 'text-emerald-600' : 'text-emerald-600'}`}>{certifiedProgressPercent}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                       <div className={`h-2 rounded-full transition-all duration-1000 bg-emerald-500`} style={{ width: `${Math.min(100, certifiedProgressPercent)}%` }}></div>
                     </div>
                   </div>

                   <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
                      <span>Month {monthsPassed} of 36</span>
                      <span>{36 - monthsPassed} Months Remaining</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Global Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <MetricCard 
                label="Total Targets" 
                value={data.summary.totalTarget.toLocaleString()} 
                subtext="Overall project goal" 
              />
              <MetricCard 
                label="Total Enrolled/Registered" 
                value={data.summary.enrolled.toLocaleString()} 
                subtext="8.2% vs last month" 
                trend="up" 
              />
              <MetricCard 
                label="Undergoing Training" 
                value={data.summary.training.toLocaleString()} 
                subtext="142 active batches" 
              />
              <MetricCard 
                label="Trained Candidates" 
                value={actuallyTrained.toLocaleString()} 
                subtext="Completed curriculum" 
              />
              <MetricCard 
                label="Certified Candidates" 
                value={data.summary.certified.toLocaleString()} 
                subtext="74.3% pass rate" 
                trend="up" 
              />
              <MetricCard 
                label="SC/ST & Women %" 
                value={`${data.summary.scstPercent}% / ${data.summary.womenPercent}%`} 
                subtext="Mandate: 70% / 30%" 
              />
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* State-wise Enrollment */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">State-wise Enrollment</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stateChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="certified" fill="#10b981" name="Certified" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" fill="#8b5cf6" name="Placed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Progress Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="enrolled" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Enrolled" />
                    <Line type="monotone" dataKey="certified" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Certified" />
                    <Line type="monotone" dataKey="placed" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Placed" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              {Object.entries(data.states).map(([state, vals], idx) => (
                <div key={state} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: Object.values(COLORS)[idx] }}></div>
                    <span className="font-semibold text-slate-700">{state}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Enrolled</span>
                      <span className="font-medium">{vals.enrolled.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Training</span>
                      <span className="font-medium">{vals.training.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Certified</span>
                      <span className="font-medium">{vals.certified.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Placed</span>
                      <span className="font-medium">{vals.placed.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-emerald-600 font-medium">{Math.round(vals.enrolled / (33360 / 4) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full transition-all" 
                          style={{ width: `${Math.min(100, Math.round(vals.enrolled / (33360 / 4) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECT FEATURES TAB */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
              </div>
              <div className="relative z-10 w-full md:w-2/3">
                <h2 className="text-3xl font-bold mb-3">Project Mandate & Features</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Skill Development of Unemployed Youths in Odisha, Jharkhand, West Bengal, and Bihar for enhancing Employability and enabling Entrepreneurship towards Sustainable Development.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4 border border-white/20">
                     <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">Target Candidates</p>
                     <p className="text-2xl font-bold">50,040</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4 border border-white/20">
                     <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">SC/ST Focus</p>
                     <p className="text-2xl font-bold">70%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4 border border-white/20">
                     <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">Women Focus</p>
                     <p className="text-2xl font-bold">30%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Expected Outcomes */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">🎯</div>
                  <h3 className="font-semibold text-slate-700">Expected Outcomes (By State)</h3>
                </div>
                <div className="p-5 flex-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left pb-2 font-medium text-slate-500">State</th>
                        <th className="text-right pb-2 font-medium text-slate-500">SC/ST</th>
                        <th className="text-right pb-2 font-medium text-slate-500">Gen-EWS</th>
                        <th className="text-right pb-2 font-medium text-slate-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {['Odisha', 'Jharkhand', 'West Bengal', 'Bihar'].map(st => (
                        <tr key={st} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-medium text-slate-700">{st}</td>
                          <td className="py-3 text-right">8,757</td>
                          <td className="py-3 text-right">3,753</td>
                          <td className="py-3 text-right font-semibold text-blue-600">12,510</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-semibold border-t-2 border-slate-200">
                        <td className="py-3 px-2 text-slate-800">Grand Total</td>
                        <td className="py-3 text-right text-slate-800">35,028</td>
                        <td className="py-3 text-right text-slate-800">15,012</td>
                        <td className="py-3 text-right text-blue-700">50,040</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">⏱️</div>
                  <h3 className="font-semibold text-slate-700">Half-Yearly Milestones</h3>
                </div>
                <div className="p-5 flex-1">
                  <div className="space-y-4">
                    {[
                      { year: '1st Year', span: '1st Half', num: '1-6 Months' },
                      { year: '1st Year', span: '2nd Half', num: '7-12 Months' },
                      { year: '2nd Year', span: '1st Half', num: '13-18 Months' },
                      { year: '2nd Year', span: '2nd Half', num: '19-24 Months' },
                      { year: '3rd Year', span: '1st Half', num: '25-30 Months' },
                      { year: '3rd Year', span: '2nd Half', num: '31-36 Months' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-10 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{m.year.split(' ')[0]}</div>
                           <div className="w-px h-8 bg-slate-200"></div>
                           <div>
                             <p className="font-medium text-slate-700">{m.span}</p>
                             <p className="text-xs text-slate-500">{m.num}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-600">8,340 Total</p>
                          <p className="text-xs text-slate-500">2,085 per State</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

               {/* Budget Outlay */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">💎</div>
                  <h3 className="font-semibold text-slate-700">Budget Outlay</h3>
                </div>
                <div className="p-5 flex-1">
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                         <p className="text-xs font-medium text-purple-600 uppercase mb-1">PMU Infrastructure</p>
                         <p className="text-xl font-bold text-slate-800">₹17.67 Lakh</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                         <p className="text-xs font-medium text-indigo-600 uppercase mb-1">Regional Co-ord Infra</p>
                         <p className="text-xl font-bold text-slate-800">₹24.40 Lakh</p>
                      </div>
                   </div>
                   <h4 className="text-sm font-medium text-slate-600 mb-3 uppercase tracking-wide">Recurring Expenses</h4>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                         <span className="text-sm text-slate-700">Manpower (Odisha NIELIT)</span>
                         <span className="font-medium text-slate-800">₹106.45 Lakh</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                         <span className="text-sm text-slate-700">MIS Portal Development</span>
                         <span className="font-medium text-slate-800">₹23.00 Lakh</span>
                      </div>
                   </div>
                </div>
              </div>

               {/* Stage Releases */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">📜</div>
                  <h3 className="font-semibold text-slate-700">Stages of Releases</h3>
                </div>
                <div className="p-5 flex-1 overflow-x-auto">
                   <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-medium">
                        <th className="text-left pb-2 w-1/4">Installment</th>
                        <th className="text-left pb-2 w-[45%]">Pre-conditions</th>
                        <th className="text-right pb-2">Funds (Bhubaneswar)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr className="hover:bg-slate-50">
                         <td className="py-4 font-medium text-slate-800">1st Installment</td>
                         <td className="py-4 text-slate-600">Issue of Admin Approval.<br/><span className="text-xs text-slate-400">Signing of Terms & MoU</span></td>
                         <td className="py-4 text-right font-medium">₹224.04 L</td>
                       </tr>
                       <tr className="hover:bg-slate-50">
                         <td className="py-4 font-medium text-slate-800">2nd Installment</td>
                         <td className="py-4 text-slate-600">Submission of UC for 1st build.<br/><span className="text-xs text-slate-400">Recommendations by PRSG</span></td>
                         <td className="py-4 text-right font-medium">₹224.04 L</td>
                       </tr>
                       <tr className="hover:bg-slate-50">
                         <td className="py-4 font-medium text-slate-800">3rd Installment</td>
                         <td className="py-4 text-slate-600">Submission of UC for 2nd release.<br/><span className="text-xs text-slate-400">Recommendations by PRSG</span></td>
                         <td className="py-4 text-right font-medium">₹215.74 L</td>
                       </tr>
                    </tbody>
                   </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'states' && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium"
              >
                {STATES.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
              <span className="text-sm text-slate-500">Target: {Math.round(33360 / 4).toLocaleString()} candidates | {DISTRICTS[selectedState].length} Districts</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-700">{selectedState} — Course-wise Progress</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-600">Course</th>
                      <th className="text-center p-3 font-medium text-slate-600">Duration</th>
                      <th className="text-center p-3 font-medium text-slate-600">Level</th>
                      <th className="text-right p-3 font-medium text-slate-600">Enrolled</th>
                      <th className="text-right p-3 font-medium text-slate-600">Ongoing</th>
                      <th className="text-right p-3 font-medium text-slate-600">Completed</th>
                      <th className="text-right p-3 font-medium text-slate-600">Certified</th>
                      <th className="text-right p-3 font-medium text-slate-600">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.states[selectedState].courses).map(([name, vals]) => {
                      const course = COURSES.find(c => c.name === name) || {};
                      return (
                        <tr key={name} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-700 w-1/3">{name}</td>
                          <td className="p-3 text-center text-slate-600">{course.duration}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{course.level}</span>
                          </td>
                          <td className="p-3 text-right font-medium">{vals.enrolled.toLocaleString()}</td>
                          <td className="p-3 text-right text-blue-600">{vals.ongoing.toLocaleString()}</td>
                          <td className="p-3 text-right">{vals.completed.toLocaleString()}</td>
                          <td className="p-3 text-right text-emerald-600 font-medium">{vals.certified.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <StatusBadge value={vals.passRate} thresholds={{ danger: 40, warning: 60 }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Course Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Course Comparison</h3>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={Object.entries(data.states[selectedState].courses).map(([name, vals]) => ({
                  name: name.length > 15 ? name.slice(0, 15) + '...' : name,
                  enrolled: vals.enrolled,
                  certified: vals.certified
                })).filter(c => c.enrolled > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="certified" fill="#10b981" name="Certified" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-700">Course-wise Performance (All States)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-600">Course</th>
                      <th className="text-center p-3 font-medium text-slate-600">Duration</th>
                      <th className="text-center p-3 font-medium text-slate-600">Level</th>
                      <th className="text-right p-3 font-medium text-slate-600">Enrolled</th>
                      <th className="text-right p-3 font-medium text-slate-600">Ongoing</th>
                      <th className="text-right p-3 font-medium text-slate-600">Completed</th>
                      <th className="text-right p-3 font-medium text-slate-600">Certified</th>
                      <th className="text-right p-3 font-medium text-slate-600">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.courses).map(([name, vals]) => {
                      const course = COURSES.find(c => c.name === name) || {};
                      return (
                        <tr key={name} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-700">{name}</td>
                          <td className="p-3 text-center text-slate-600">{course.duration}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{course.level}</span>
                          </td>
                          <td className="p-3 text-right font-medium">{vals.enrolled.toLocaleString()}</td>
                          <td className="p-3 text-right text-blue-600">{vals.ongoing.toLocaleString()}</td>
                          <td className="p-3 text-right">{vals.completed.toLocaleString()}</td>
                          <td className="p-3 text-right text-emerald-600 font-medium">{vals.certified.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <StatusBadge value={vals.passRate} thresholds={{ danger: 60, warning: 75 }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Course Enrollment vs Certification</h3>
              <ResponsiveContainer width="100%" height={560}>
                <BarChart data={courseChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="certified" fill="#10b981" name="Certified" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* FINANCIAL TAB */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Budget" value="₹50.76 Cr" />
              <MetricCard label="Released" value="₹18.42 Cr" subtext="36.3% of total" />
              <MetricCard label="Utilized" value="₹12.37 Cr" subtext="67.2% of released" trend="up" />
              <MetricCard label="Balance" value="₹6.05 Cr" subtext="With implementing agencies" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-700">Budget Head-wise Utilization</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-600">Budget Head</th>
                      <th className="text-right p-3 font-medium text-slate-600">Allocated (Cr)</th>
                      <th className="text-right p-3 font-medium text-slate-600">Released (Cr)</th>
                      <th className="text-right p-3 font-medium text-slate-600">Utilized (Cr)</th>
                      <th className="text-right p-3 font-medium text-slate-600">Balance (Cr)</th>
                      <th className="text-right p-3 font-medium text-slate-600">Utilization %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.financial).map(([name, vals]) => {
                      const utilPct = Math.round((vals.utilized / vals.released) * 100);
                      return (
                        <tr key={name} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-700 capitalize">{name}</td>
                          <td className="p-3 text-right">₹{vals.allocated.toFixed(2)}</td>
                          <td className="p-3 text-right">₹{vals.released.toFixed(2)}</td>
                          <td className="p-3 text-right font-medium">₹{vals.utilized.toFixed(2)}</td>
                          <td className="p-3 text-right text-slate-500">₹{(vals.released - vals.utilized).toFixed(2)}</td>
                          <td className="p-3 text-right">
                            <StatusBadge value={utilPct} thresholds={{ danger: 50, warning: 70 }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Budget Allocation vs Utilization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => `₹${value} Cr`} />
                  <Legend />
                  <Bar dataKey="allocated" fill="#cbd5e1" name="Allocated" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilized" fill="#3b82f6" name="Utilized" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CO-PI INPUT TAB (Protected) */}
        {activeTab === 'input' && (
          !user ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Login Required</h3>
              <p className="text-slate-500 mb-6">Please use the login panel on the right to access the data submission portal.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Monthly Submission UI */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Monthly Progress Submission</h3>
                    <p className="text-sm text-slate-500">Submit data for {user.state} — {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold ring-1 ring-emerald-200">System Ready</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {/* Form Fields - Category Totals */}
                   <div className="space-y-4">
                     <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100 pb-1">Category Breakdown</h4>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SC Candidates</label>
                         <input type="number" value={monthlyInput.scCount} onChange={(e) => setMonthlyInput({...monthlyInput, scCount: parseInt(e.target.value)}) } className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ST Candidates</label>
                         <input type="number" value={monthlyInput.stCount} onChange={(e) => setMonthlyInput({...monthlyInput, stCount: parseInt(e.target.value)}) } className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">EWS Candidates</label>
                         <input type="number" value={monthlyInput.ewsCount} onChange={(e) => setMonthlyInput({...monthlyInput, ewsCount: parseInt(e.target.value)}) } className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Women Candidates</label>
                         <input type="number" value={monthlyInput.womenCount} onChange={(e) => setMonthlyInput({...monthlyInput, womenCount: parseInt(e.target.value)}) } className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none" />
                       </div>
                     </div>
                   </div>

                   {/* Financial Data */}
                   <div className="space-y-4">
                     <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100 pb-1">Financial Data (₹)</h4>
                     <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fund Received</label>
                          <input type="number" value={monthlyInput.fundReceived} onChange={(e) => setMonthlyInput({...monthlyInput, fundReceived: parseInt(e.target.value)}) } className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fund Utilized</label>
                          <input type="number" value={monthlyInput.fundUtilized} onChange={(e) => setMonthlyInput({...monthlyInput, fundUtilized: parseInt(e.target.value)}) } className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none" />
                        </div>
                     </div>
                   </div>

                   {/* File Uploads */}
                   <div className="space-y-4">
                     <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100 pb-1">Required Documents</h4>
                     <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Student List (XLSX)</label>
                          <input type="file" accept=".xlsx" onChange={(e) => setStudentFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Batch Approval (DOCX)</label>
                          <input type="file" accept=".docx" onChange={(e) => setApprovalDoc(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                     </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                   <p className="text-[10px] text-slate-400 italic">Ensure all category totals match the uploaded student list.</p>
                   <button 
                    onClick={handleSubmitMonthlyData}
                    disabled={isUploading}
                    className={`px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     {isUploading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                         Syncing to Cloud...
                       </>
                     ) : (
                       <>🚀 Submit Monthly Report</>
                     )}
                   </button>
                </div>
              </div>

              {/* CANDIDATE MANAGEMENT SECTION */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-800 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                       Candidate Management System
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">State: {user.state} | Database Explorer</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                      <input 
                        type="text" 
                        placeholder="Search by name or course..." 
                        value={candidateSearch}
                        onChange={(e) => setCandidateSearch(e.target.value)}
                        className="bg-slate-700/50 border border-slate-600 text-white text-xs rounded-lg py-2 pl-9 pr-4 w-56 outline-none focus:border-slate-400 transition-all placeholder:text-slate-500"
                      />
                    </div>
                    <button 
                      onClick={handleDownloadStudentList}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-emerald-700 flex items-center gap-2 transition-all active:scale-95"
                      title="Download Student List to Excel"
                    >
                      <span>📥 Download</span>
                    </button>
                    <label className="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap">
                       <span>📁 Bulk CSV</span>
                       <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleBulkCsvUpload} />
                    </label>
                    <button 
                      onClick={() => setShowCandidateForm(!showCandidateForm)}
                      className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-black shadow-lg hover:bg-slate-100 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                    >
                      {showCandidateForm ? '✕ Close' : '+ Add'}
                    </button>
                  </div>
                </div>

                {showCandidateForm && (
                  <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 inline-flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-[10px]">📝</span>
                      Comprehensive Candidate Entry
                    </h4>
                    <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reg. Month *</label>
                        <input type="month" required value={newCandidate.regMonth} onChange={(e) => setNewCandidate({...newCandidate, regMonth: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Batch No</label>
                        <input type="text" value={newCandidate.batchNo} onChange={(e) => setNewCandidate({...newCandidate, batchNo: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Course Name *</label>
                        <select required value={newCandidate.courseName} onChange={(e) => setNewCandidate({...newCandidate, courseName: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200">
                           <option value="">Select Course</option>
                           {Object.keys(data.courses).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">NIELIT Reg. No.</label>
                        <input type="text" value={newCandidate.nielitRegNo} onChange={(e) => setNewCandidate({...newCandidate, nielitRegNo: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Student Name *</label>
                        <input type="text" required value={newCandidate.name} onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Father's Name</label>
                        <input type="text" value={newCandidate.fatherName} onChange={(e) => setNewCandidate({...newCandidate, fatherName: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                        <select value={newCandidate.category} onChange={(e) => setNewCandidate({...newCandidate, category: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200">
                           <option>General</option><option>SC</option><option>ST</option><option>OBC</option><option>EWS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                        <select value={newCandidate.gender} onChange={(e) => setNewCandidate({...newCandidate, gender: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200">
                           <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Aadhaar Card</label>
                        <input type="text" value={newCandidate.aadhaarNo} onChange={(e) => setNewCandidate({...newCandidate, aadhaarNo: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">APAAR ID</label>
                        <input type="text" value={newCandidate.apaarId} onChange={(e) => setNewCandidate({...newCandidate, apaarId: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Religion</label>
                        <input type="text" value={newCandidate.religion} onChange={(e) => setNewCandidate({...newCandidate, religion: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" placeholder="e.g. Hindu" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Whatsapp No.</label>
                        <input type="text" value={newCandidate.whatsappNo} onChange={(e) => setNewCandidate({...newCandidate, whatsappNo: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Communication Address</label>
                        <input type="text" value={newCandidate.address} onChange={(e) => setNewCandidate({...newCandidate, address: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Employed?</label>
                        <select value={newCandidate.isEmployed} onChange={(e) => setNewCandidate({...newCandidate, isEmployed: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200">
                           <option>No</option><option>Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">District *</label>
                        <input type="text" value={newCandidate.district} onChange={(e) => setNewCandidate({...newCandidate, district: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200" />
                      </div>
                      <div className="md:col-span-4 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                         <button type="button" onClick={() => setShowCandidateForm(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800">Cancel</button>
                         <button type="submit" className="px-8 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-slate-800 transition-all">Save Candidate</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase">Sl. No.</th>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase">Student / Reg. Month</th>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase">Parent/WhatsApp</th>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase">Course/Batch</th>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase">Category/Gender</th>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {isFetchingStudents ? (
                        <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">Fetching candidate list...</td></tr>
                      ) : students.length === 0 ? (
                        <tr><td colSpan="5" className="p-16 text-center text-slate-400 font-bold italic">No candidates found in {user.state}</td></tr>
                      ) : (
                        students
                          .filter(s => s.name?.toLowerCase().includes(candidateSearch.toLowerCase()) || s.courseName?.toLowerCase().includes(candidateSearch.toLowerCase()))
                          .map((student, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 text-[10px] font-bold text-slate-400">#{idx + 1}</td>
                              <td className="p-3">
                                <p className="font-bold text-slate-800">{student.name}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Reg: {student.nielitRegNo || 'PENDING'}</p>
                                  <span className="text-[9px] bg-slate-100 px-1 rounded text-slate-500 font-bold">{student.regMonth}</span>
                                </div>
                              </td>
                              <td className="p-3"><p className="text-xs text-slate-600 font-medium">{student.fatherName}</p><p className="text-[10px] text-emerald-600 font-bold">{student.whatsappNo || 'No No.'}</p></td>
                              <td className="p-3"><p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{student.courseName}</p><p className="text-[10px] text-slate-500 font-medium">{student.batchNo}</p></td>
                              <td className="p-3"><div className="flex gap-1"><span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded uppercase">{student.category}</span><span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded uppercase">{student.gender}</span></div></td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-tighter border border-emerald-200">Enrolled</span></td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {submissions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-700 mb-4">Submission History</h3>
                  <div className="space-y-4">
                    {submissions.map(sub => (
                      <div key={sub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                           <div>
                             <p className="font-bold text-slate-800 text-sm">{sub.month} Report</p>
                             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Sync ID: {sub.id.slice(0,8)}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-12">
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-600 tracking-tight">{sub.studentFileName}</p>
                              <p className="text-[10px] text-slate-400">Excel Data Sync</p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-200">{sub.status || 'Verified'}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* REPORTS TAB (Protected) */}
        {activeTab === 'reports' && (
          !user ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Restricted Area</h3>
              <p className="text-slate-500 mb-6">Administrative credentials required to view project reports.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Monthly Progress Report', icon: '📊', color: 'blue', desc: 'MeitY consolidated report' },
                  { title: 'Utilization Certificate', icon: '💰', color: 'emerald', desc: 'Quarterly financial report' },
                  { title: 'KPI Dashboard Export', icon: '📈', color: 'purple', desc: 'PRSG review export' }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                      <span className={`text-${item.color}-600 text-xl`}>{item.icon}</span>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{item.desc}</p>
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Generate →</button>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-700 mb-4">Report Schedule</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Monthly Report - March 2026', date: 'Due: April 5, 2026', status: 'Pending', color: 'amber' },
                    { label: 'Quarterly UC - Q4 FY25', date: 'Due: April 15, 2026', status: 'Pending', color: 'amber' },
                    { label: 'Monthly Report - February 2026', date: 'Submitted: March 4, 2026', status: 'Submitted', color: 'emerald' }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                      <div className="flex gap-4 items-baseline">
                        <span className="font-medium text-slate-700 text-sm">{row.label}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{row.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 bg-${row.color}-100 text-${row.color}-700 rounded text-[9px] font-black uppercase tracking-tighter`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
    </div>

          {/* RIGHT: AUTH PANEL (25%) */}
          <div className="lg:col-span-1 space-y-6">
            {!user ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 mx-auto flex items-center justify-center text-white text-xl font-black shadow-lg mb-3">S</div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Admin Gateway</h2>
                  <p className="text-slate-400 text-xs">Sign in to upload student details</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Username</label>
                    <input 
                      type="text" 
                      value={loginForm.username}
                      onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                      placeholder="e.g. odisha_copi"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Password</label>
                    <input 
                      type="password"
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-slate-800 outline-none transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
                  >
                    Sign In
                  </button>
                </form>
                
                <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-400 leading-relaxed uppercase tracking-wider text-center">
                  Authorized Personnel Only
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{user.role}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {user.state && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">State Access</p>
                      <p className="text-sm font-bold text-emerald-800">{user.state}</p>
                    </div>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout System
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Contacts</h4>
              <div className="space-y-3">
                <div className="text-[10px]">
                  <p className="text-slate-400 uppercase font-black tracking-tighter mb-1">Project Investigator</p>
                </div>
                <div className="text-[10px]">
                  <p className="text-slate-400 uppercase font-black tracking-tighter mb-1">Project Co-PI</p>
                  <p className="font-medium">Respective NIELIT Centres</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Public) */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>SDUY Project — PMU, NIELIT Bhubaneswar</span>
            <span>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

