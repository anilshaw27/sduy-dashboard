import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATES_DATA } from './stateData.js';

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

  const handleSubmitMonthlyData = () => {
    if (!monthlyInput.state) {
      alert('Please select a state');
      return;
    }
    const newSubmission = {
      ...monthlyInput,
      submittedAt: new Date().toISOString(),
      id: Date.now()
    };
    setSubmissions([...submissions, newSubmission]);
    alert('Monthly data submitted successfully!');
    setMonthlyInput({
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">SDUY Project Dashboard</h1>
              <p className="text-sm text-slate-500">Skill Development of Unemployed Youths — PMU Monitoring System</p>
            </div>
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
                <option>March 2026</option>
                <option>February 2026</option>
                <option>January 2026</option>
              </select>
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (() => {
          // Dynamic calculation for the timeline target
          const projectStart = new Date(2024, 5); // June 2024 (Month 5 zero-indexed)
          // For now, assuming current reporting date is March 2026 based on the dropdown default.
          const reportDate = new Date(2026, 2); // March 2026
          const monthsPassed = (reportDate.getFullYear() - projectStart.getFullYear()) * 12 + (reportDate.getMonth() - projectStart.getMonth()) + 1; // 22
          const totalTarget = 50040;
          const targetPerMonth = totalTarget / 36;
          const expectedTarget = Math.round(monthsPassed * targetPerMonth);
          
          const actuallyEnrolled = data.summary.enrolled;
          const actuallyTrained = data.summary.enrolled - data.summary.training; // 5050 (Enrolled - Ongoing training)
          const actuallyCertified = data.summary.certified; // 2435
          
          const enrolledProgressPercent = Math.round((actuallyEnrolled / expectedTarget) * 100);
          const trainedProgressPercent = Math.round((actuallyTrained / expectedTarget) * 100);
          const certifiedProgressPercent = Math.round((actuallyCertified / expectedTarget) * 100);

          return (
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
        )})()}

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

        {/* CO-PI INPUT TAB */}
        {activeTab === 'input' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-700 mb-1">Monthly Progress Submission</h3>
              <p className="text-sm text-slate-500 mb-6">Co-PIs can submit monthly state-level progress data</p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">State *</label>
                  <select 
                    value={monthlyInput.state}
                    onChange={(e) => setMonthlyInput({...monthlyInput, state: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Reporting Month *</label>
                  <input 
                    type="month"
                    value={monthlyInput.month}
                    onChange={(e) => setMonthlyInput({...monthlyInput, month: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <h4 className="font-medium text-slate-700 mb-3">Category Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">SC Candidates</label>
                  <input 
                    type="number"
                    value={monthlyInput.scCount || ''}
                    onChange={(e) => setMonthlyInput({...monthlyInput, scCount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">ST Candidates</label>
                  <input 
                    type="number"
                    value={monthlyInput.stCount || ''}
                    onChange={(e) => setMonthlyInput({...monthlyInput, stCount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">General-EWS</label>
                  <input 
                    type="number"
                    value={monthlyInput.ewsCount || ''}
                    onChange={(e) => setMonthlyInput({...monthlyInput, ewsCount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Women</label>
                  <input 
                    type="number"
                    value={monthlyInput.womenCount || ''}
                    onChange={(e) => setMonthlyInput({...monthlyInput, womenCount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <h4 className="font-medium text-slate-700 mb-3">Financial Data (in Lakhs)</h4>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Fund Received</label>
                  <input 
                    type="number"
                    value={monthlyInput.fundReceived || ''}
                    onChange={(e) => setMonthlyInput({...monthlyInput, fundReceived: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Fund Utilized</label>
                  <input 
                    type="number"
                    value={monthlyInput.fundUtilized || ''}
                    onChange={(e) => setMonthlyInput({...monthlyInput, fundUtilized: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Balance</label>
                  <input 
                    type="number"
                    value={(monthlyInput.fundReceived - monthlyInput.fundUtilized).toFixed(2)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                    readOnly
                  />
                </div>
              </div>

              <h4 className="font-medium text-slate-700 mb-3">Issues & Remarks</h4>
              <textarea
                value={monthlyInput.remarks}
                onChange={(e) => setMonthlyInput({...monthlyInput, remarks: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-[100px] mb-6"
                placeholder="Enter any issues, challenges, or remarks for this month..."
              />

              <div className="flex gap-3">
                <button 
                  onClick={handleSubmitMonthlyData}
                  className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
                >
                  Submit Report
                </button>
                <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                  Save Draft
                </button>
                <button 
                  onClick={() => setMonthlyInput({
                    state: '', month: new Date().toISOString().slice(0, 7), districts: {},
                    scCount: 0, stCount: 0, ewsCount: 0, womenCount: 0,
                    fundReceived: 0, fundUtilized: 0, remarks: ''
                  })}
                  className="px-6 py-2 text-slate-500 text-sm hover:text-slate-700"
                >
                  Clear
                </button>
              </div>
            </div>

            {submissions.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-700 mb-4">Recent Submissions</h3>
                <div className="space-y-3">
                  {submissions.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <span className="font-medium text-slate-700">{sub.state}</span>
                        <span className="text-slate-400 mx-2">•</span>
                        <span className="text-sm text-slate-500">{sub.month}</span>
                      </div>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Submitted</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Monthly Progress Report</h3>
                <p className="text-sm text-slate-500 mb-3">Consolidated report for MeitY submission</p>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Generate →</button>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-emerald-600 text-xl">💰</span>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Utilization Certificate</h3>
                <p className="text-sm text-slate-500 mb-3">Quarterly UC for fund utilization</p>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Generate →</button>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-purple-600 text-xl">📈</span>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">KPI Dashboard Export</h3>
                <p className="text-sm text-slate-500 mb-3">Export all KPIs for PRSG review</p>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Export →</button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-700 mb-4">Report Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                  <div>
                    <span className="font-medium text-slate-700">Monthly Report - March 2026</span>
                    <span className="text-sm text-slate-500 ml-3">Due: April 5, 2026</span>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                  <div>
                    <span className="font-medium text-slate-700">Quarterly UC - Q4 FY25</span>
                    <span className="text-sm text-slate-500 ml-3">Due: April 15, 2026</span>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                  <div>
                    <span className="font-medium text-slate-700">Monthly Report - February 2026</span>
                    <span className="text-sm text-slate-500 ml-3">Submitted: March 4, 2026</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Submitted</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>SDUY Project — PMU, NIELIT Bhubaneswar</span>
            <span>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
