import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, Map, Users, FileText, Printer, Save, 
  X, Plus, IndianRupee, MapPin, Calculator, TrendingUp, CloudUpload, BarChart, CheckCircle, Wallet, Settings, RefreshCw, Wifi, WifiOff, FileUp, ExternalLink, Trash, FolderOpen, Image as ImageIcon
} from 'lucide-react';

// --- 1. CONFIGURATION CONSTANTS ---
const HARDCODED_DRIVE_FOLDER_ID = "1bOykGLUzMKLR_CBMeACBuVoFJtLzLfpL";
const HARDCODED_MAPS_FOLDER_ID = "1j---eVWj3O5c4a-FirCiSrXtWFBrpqRZ";

const STATUS_COLORS = {
  'Available': 'bg-green-100 text-green-800 border-green-300',
  'On Hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Booked': 'bg-blue-100 text-blue-800 border-blue-300',
  'Sold': 'bg-red-100 text-red-800 border-red-300',
  'Reserved': 'bg-gray-100 text-gray-800 border-gray-300',
  'Under Construction': 'bg-purple-100 text-purple-800 border-purple-300'
};

const PLOT_IMAGES = {
  1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "",
  11: "", 12: "", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "", 19: "", 20: "",
  21: "", 22: "", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "", 29: "", 30: "",
  31: "", 32: "", 33: "", 34: "", 35: "", 36: ""
};

// --- 2. MOCK INITIAL DATA ---
const EXTRACTED_DATA = [
  { plotNo: 10, name: 'Mr Sushant Chavan', city: 'Mumbai', areaSqM: 276.00, areaSqFt: 2969.76, rate: 1743, total: 5175000, expCheque: 3000000, expCash: 2175000, rcvCheque: 1310000, rcvCash: 1500000 },
  { plotNo: 19, name: 'Mr Prashant Patil', city: 'Kolhapur', areaSqM: 282.60, areaSqFt: 3040.78, rate: 1375, total: 4000000, expCheque: 2000000, expCash: 2000000, rcvCheque: 2000000, rcvCash: 2000000 },
  { plotNo: 15, name: 'Mr Manvendra Vaira', city: 'Kolhapur', areaSqM: 212.20, areaSqFt: 2283.27, rate: 1577, total: 3600000, expCheque: 1800000, expCash: 1800000, rcvCheque: 1800000, rcvCash: 1800000 },
  { plotNo: 22, name: 'Dr. Manjeet Kulkarni', city: 'Kolhapur', areaSqM: 357.55, areaSqFt: 3847.00, rate: 1742, total: 6700000, expCheque: 2400000, expCash: 4300000, rcvCheque: 1400000, rcvCash: 2200000 },
  { plotNo: 28, name: 'Mrs Shweta Survase', city: 'Solapur', areaSqM: 343.25, areaSqFt: 6874.00, rate: 1700, total: 11600000, expCheque: 5800000, expCash: 5800000, rcvCheque: 600000, rcvCash: 0 },
  { plotNo: 17, name: 'Mr. Sasank', city: 'Usa', areaSqM: 336.00, areaSqFt: 3615.00, rate: 1757, total: 6350000, expCheque: 2550000, expCash: 3800000, rcvCheque: 1550000, rcvCash: 3800000 },
  { plotNo: 25, name: 'Mr. Shivanand Chavan', city: 'Kolhapur', areaSqM: 288.90, areaSqFt: 3108.56, rate: 1275, total: 3963000, expCheque: 1563000, expCash: 2400000, rcvCheque: 1000000, rcvCash: 2400000 },
  { plotNo: 27, name: 'Mr Sunil Bardeskar', city: 'Kolhapur', areaSqM: 295.00, areaSqFt: 3174.20, rate: 1543, total: 4897000, expCheque: 2897000, expCash: 2000000, rcvCheque: 2897000, rcvCash: 2000000 },
  { plotNo: 21, name: 'Mr Shrikant Patil', city: 'Kolhapur', areaSqM: 438.40, areaSqFt: 4717.00, rate: 1484, total: 7000000, expCheque: 2500000, expCash: 4500000, rcvCheque: 2500000, rcvCash: 4500000 },
  { plotNo: 16, name: 'Dr. G M Patil', city: 'Mumbai', areaSqM: 321.40, areaSqFt: 3458.26, rate: 1672, total: 5775000, expCheque: 3000000, expCash: 2775000, rcvCheque: 3000000, rcvCash: 2775000 },
  { plotNo: 18, name: 'Mr. Hemant Shah', city: 'Kolhapur', areaSqM: 343.25, areaSqFt: 3693.37, rate: 1786, total: 6600000, expCheque: 1600000, expCash: 5000000, rcvCheque: 1600000, rcvCash: 5000000 },
  { plotNo: 26, name: 'Mr Akshay Sawant', city: 'Kolhapur', areaSqM: 290.24, areaSqFt: 3123.00, rate: 1633, total: 5100000, expCheque: 2000000, expCash: 3100000, rcvCheque: 2600000, rcvCash: 2500000 },
  { plotNo: 20, name: 'Mr Hemant Shah', city: 'Kolhapur', areaSqM: 246.25, areaSqFt: 2649.65, rate: 1736.08, total: 4600000, expCheque: 1150000, expCash: 3450000, rcvCheque: 1150000, rcvCash: 2000000 },
  { plotNo: 8, name: 'Dr. Pradyumna Vairat', city: 'Kolhapur', areaSqM: 298.00, areaSqFt: 3206.48, rate: 1824, total: 5850000, expCheque: 1850000, expCash: 4000000, rcvCheque: 1850000, rcvCash: 4000000 },
  { plotNo: 29, name: 'Dr G M Patil', city: 'Mumbai', areaSqM: 586.30, areaSqFt: 6308.59, rate: 1650, total: 10000000, expCheque: 4000000, expCash: 6000000, rcvCheque: 0, rcvCash: 0 }
];

const NEIGHBOR_DATA = {
  1: { east: 10, south: 0, west: 0, north: 0 },
  2: { east: 3, south: 9, west: 0, north: 0 },
  3: { east: 4, south: 8, west: 2, north: 0 },
  4: { east: 5, south: 7, west: 3, north: 0 },
  5: { east: 0, south: 6, west: 4, north: 0 },
  6: { east: 0, south: 0, west: 7, north: 5 },
  7: { east: 6, south: 0, west: 8, north: 4 },
  8: { east: 7, south: 0, west: 9, north: 3 },
  9: { east: 8, south: 0, west: 0, north: 2 },
  10: { east: 11, south: 0, west: 0, north: 0 },
  11: { east: 12, south: 0, west: 10, north: 0 },
  12: { east: 13, south: 0, west: 11, north: 0 },
  13: { east: 0, south: 0, west: 12, north: 0 },
  14: { east: 15, south: 0, west: 0, north: 0 },
  15: { east: 16, south: 0, west: 14, north: 0 },
  16: { east: 17, south: 0, west: 15, north: 0 },
  17: { east: 18, south: 0, west: 16, north: 0 },
  18: { east: 19, south: 0, west: 17, north: 0 },
  19: { east: 21, south: 0, west: 18, north: 0 },
  20: { east: 0, south: 19, west: 18, north: 0 },
  21: { east: 24, south: 0, west: 19, north: 22 },
  22: { east: 23, south: 21, west: 0, north: 0 },
  23: { east: 0, south: 24, west: 22, north: 0 },
  24: { east: 0, south: 0, west: 21, north: 23 },
  25: { east: 0, south: 0, west: 26, north: 0 },
  26: { east: 25, south: 0, west: 27, north: 0 },
  27: { east: 26, south: 0, west: 0, north: 0 },
  28: { east: 0, south: 0, west: 29, north: 0 },
  29: { east: 0, south: 0, west: 0, north: 0 },
  30: { east: 29, south: 0, west: 31, north: 0 },
  31: { east: 30, south: 0, west: 32, north: 0 },
  32: { east: 31, south: 0, west: 0, north: 0 },
  33: { east: 0, south: 0, west: 0, north: 0 },
  34: { east: 0, south: 0, west: 0, north: 0 },
  35: { east: 0, south: 0, west: 0, north: 0 },
  36: { east: 0, south: 0, west: 0, north: 0 },
};

const ROAD_DATA = {
  1: { north: 9 },
  2: { north: 9 },
  3: { north: 9 },
  4: { north: 9 },
  5: { north: 9 },
  6: { east: 12 },
  7: { south: 9 },
  8: { south: 9 },
  9: { south: 9 },
  10: { north: 9 },
  11: { north: 9 },
  12: { north: 9 },
  13: { east: 12, north: 9 },
  14: { west: 12, north: 9 },
  15: { north: 9 },
  16: { north: 9 },
  17: { north: 9 },
  18: { north: 9 },
  19: { north: 9 },
  20: { north: 9 },
  21: { north: 9 },
  22: { north: 9 },
  23: { north: 9 },
  24: { north: 9 },
  26: { south: 9 },
  27: { south: 9, west: 12 },
  28: { south: 9 },
  29: { south: 9 },
  30: { south: 9 },
  31: { south: 9 },
  32: { south: 9, west: 12 }
};

const DIMENSION_DATA = {
  1: { east: 60.820, south: 84.990, west: 71.920, north: 25.290 },
  2: { east: 22.770, south: 18.190, west: 19.620, north: 13.260 },
  3: { east: 21.280, south: 14.370, west: 22.770, north: 14.450 },
  4: { east: 21.280, south: 15.620, west: 21.280, north: 16.340 },
  5: { east: 25.380, south: 22.140, west: 17.760, north: 0.000 },
  6: { east: 16.900, south: 12.660, west: 18.000, north: 20.830 },
  7: { east: 18.000, south: 16.500, west: 18.000, north: 15.620 },
  8: { east: 18.000, south: 16.500, west: 18.000, north: 16.500 },
  9: { east: 18.000, south: 16.500, west: 16.500, north: 16.500 },
  10: { east: 17.560, south: 15.640, west: 15.640, north: 15.640 },
  11: { east: 17.500, south: 15.250, west: 17.560, north: 15.250 },
  12: { east: 17.440, south: 15.250, west: 17.500, north: 15.250 },
  13: { east: 14.120, south: 11.840, west: 17.440, north: 11.840 },
  14: { east: 11.750, south: 16.840, west: 16.660, north: 13.200 },
  15: { east: 15.670, south: 14.040, west: 11.750, north: 17.590 },
  16: { east: 16.070, south: 20.810, west: 15.670, north: 20.760 },
  17: { east: 20.110, south: 18.950, west: 16.070, north: 18.800 },
  18: { east: 13.960, south: 15.160, west: 20.110, north: 15.410 },
  19: { east: 14.950, south: 21.220, west: 11.880, north: 21.000 },
  20: { east: 15.280, south: 11.500, west: 11.800, north: 11.530 },
  21: { east: 18.710, south: 26.270, west: 14.950, north: 26.000 },
  22: { east: 17.960, south: 17.000, west: 14.960, north: 17.000 },
  23: { east: 14.960, south: 20.850, west: 17.960, north: 17.850 },
  24: { east: 23.050, south: 30.160, west: 18.710, north: 29.850 },
  25: { east: 17.490, south: 16.500, west: 17.490, north: 16.500 },
  26: { east: 17.490, south: 16.500, west: 17.570, north: 16.500 },
  27: { east: 17.570, south: 13.850, west: 14.650, north: 13.850 },
  28: { east: 10.900, south: 30.750, west: 25.430, north: 0.750 },
  29: { east: 25.400, south: 22.180, west: 26.640, north: 22.150 },
  30: { east: 26.640, south: 23.500, west: 22.390, north: 30.410 },
  31: { east: 22.390, south: 15.690, west: 22.060, north: 15.640 },
  32: { east: 22.066, south: 9.780, west: 17.680, north: 13.830 },
  33: { east: 0.000, south: 0.000, west: 0.000, north: 0.000 },
  34: { east: 0.000, south: 0.000, west: 0.000, north: 0.000 },
  35: { east: 0.000, south: 0.000, west: 0.000, north: 0.000 },
  36: { east: 0.000, south: 0.000, west: 0.000, north: 0.000 },
};

const REMARKS_DATA = {
  1: "Appt", 2: "Retained", 3: "Retained", 4: "Retained", 5: "Unsold",
  6: "Unsold", 7: "Unsold", 8: "Dr. Pradyumna Anand Vairat", 9: "Retained",
  10: "Mr. Sushant Chavan", 11: "Mr. Sanjay Nalawade", 12: "Mr. Sanjay Nalawade",
  13: "Mr. Sanjay Nalawade", 14: "Mr. Pradeep Sankpal", 15: "Mr. Manvendra Vairat",
  16: "Dr. G. M. Patil", 17: "Mr. Sasank", 18: "Mr. Hemant Shah", 19: "Mr. Prashant Patil",
  20: "Mr. Hemant Shah", 21: "Mr. Shrikant Patil", 22: "Dr. Manjeet Kulkarni",
  23: "Unsold", 24: "Retained", 25: "Mr. Shivanand Chavan", 26: "Mr. Akshay Sawant",
  27: "Mr. Sunil Bardeskar", 28: "Mrs. Shweta Survase", 29: "Dr. G. M. Patil",
  30: "Unsold", 31: "Unsold", 32: "Unsold", 33: "Open Space 1",
  34: "Amenity Space 1", 35: "Open Space 2", 36: "Amenity Space 2"
};

const AREA_DATA = {
  2: 407.000, 3: 316.250, 4: 316.250, 5: 227.000, 6: 321.000, 7: 298.000,
  8: 298.000, 9: 298.000, 10: 276.000, 11: 268.300, 12: 267.400, 13: 227.900,
  14: 247.900, 15: 212.200, 16: 321.400, 17: 336.000, 18: 343.250, 19: 282.600,
  20: 246.250, 21: 438.400, 22: 357.550, 23: 372.750, 24: 624.250, 25: 288.900,
  26: 290.200, 27: 295.000, 28: 638.900, 29: 586.300, 30: 653.800, 31: 341.580,
  32: 289.150
};

const INITIAL_EXPENDITURES = [
  { id: 1, date: '10/05/2026', particulars: 'JCB Land Levelling Charges', group: 'Development/Construction', division: 'Phase 1', received: 0, expended: 45000 },
  { id: 2, date: '15/05/2026', particulars: 'Layout Sanction Fees Paid to Town Planning', group: 'Government/Legal Fees', division: 'Licensing', received: 0, expended: 125000 },
  { id: 3, date: '20/05/2026', particulars: 'Boundary Stones and Fencing Labor', group: 'Administrative', division: 'Infrastructure', received: 0, expended: 28000 }
];

// --- 3. HELPER FUNCTIONS ---
const parseDocumentsColumn = (str) => {
  if (!str) return [];
  return str.split("\n").map(line => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return null;
    return {
      name: line.substring(0, colonIdx).trim(),
      url: line.substring(colonIdx + 1).trim()
    };
  }).filter(Boolean);
};

const serializeDocumentsColumn = (docs) => {
  if (!docs || docs.length === 0) return "";
  return docs.map(d => `${d.name}: ${d.url}`).join("\n");
};

const generateInitialPlots = () => {
  const localPlotMaps = JSON.parse(localStorage.getItem('plot_maps') || '{}');
  return Array.from({ length: 36 }, (_, i) => {
    const plotNo = i + 1;
    const mappedData = EXTRACTED_DATA.find(d => d.plotNo === plotNo);
    const neighbors = NEIGHBOR_DATA[plotNo] || { east: 0, south: 0, west: 0, north: 0 };
    const roads = ROAD_DATA[plotNo] || { east: 0, south: 0, west: 0, north: 0 };
    const dims = DIMENSION_DATA[plotNo] || { east: 0, south: 0, west: 0, north: 0 };
    const remark = REMARKS_DATA[plotNo] || '';
    const isPerson = remark !== 'Unsold' && remark !== 'Retained' && remark !== 'Appt' && !remark.includes('Space');
    
    const getSurrounding = (direction) => {
      const roadWidth = roads[direction];
      const plotNum = neighbors[direction];
      if (roadWidth && roadWidth > 0) return { type: 'Road', detail: `${roadWidth}m Road` };
      if (plotNum && plotNum !== 0) return { type: 'Plot', detail: `Plot ${plotNum}` };
      return { type: 'Plot', detail: '' };
    };
    
    let paymentHistory = [];
    let status = 'Available';
    
    if (mappedData) {
      if (mappedData.rcvCheque > 0) paymentHistory.push({ id: `chq-${plotNo}`, date: new Date().toISOString().split('T')[0], amount: mappedData.rcvCheque, mode: 'Cheque', reference: 'Bank Transfer' });
      if (mappedData.rcvCash > 0) paymentHistory.push({ id: `csh-${plotNo}`, date: new Date().toISOString().split('T')[0], amount: mappedData.rcvCash, mode: 'Cash', reference: 'Cash Paid' });
      const totalReceived = mappedData.rcvCheque + mappedData.rcvCash;
      status = totalReceived >= mappedData.total ? 'Sold' : (totalReceived > 0 ? 'Booked' : 'On Hold');
    } else {
      if (remark === 'Unsold') status = 'Available';
      else if (remark === 'Retained' || remark === 'Appt') status = 'On Hold';
      else if (remark.includes('Space')) status = 'Reserved';
      else if (isPerson) status = 'Booked'; 
    }

    let resType = 'Free hold';
    let pType = 'Residential';
    if (remark.includes('Open Space')) { resType = 'Open space'; pType = 'Reserved'; }
    if (remark.includes('Amenity Space')) { resType = 'Amenity space'; pType = 'Reserved'; }

    const areaM = AREA_DATA[plotNo] || 0;
    const areaF = areaM > 0 ? parseFloat((areaM * 10.7639).toFixed(2)) : 0;

    return {
      id: `P${plotNo}`,
      plotNo: plotNo,
      layoutNo: 'L-1',
      surveyNo: 'Gat No-20K 1&2',
      status: status,
      dimensions: dims,
      areaSqM: areaM,
      areaSqFt: areaF,
      plotType: pType,
      reservation: resType,
      plotMapUrl: localPlotMaps[plotNo] || PLOT_IMAGES[plotNo] || null,
      surroundings: {
        east: getSurrounding('east'),
        south: getSurrounding('south'),
        west: getSurrounding('west'),
        north: getSurrounding('north')
      },
      financials: {
        basePrice: mappedData ? mappedData.rate : 0,
        ratePerSqFt: mappedData ? mappedData.rate : 0,
        finalValue: mappedData ? mappedData.total : 0,
        expectedCash: mappedData ? mappedData.expCash : 0,
        expectedCheque: mappedData ? mappedData.expCheque : 0,
        paymentHistory: paymentHistory
      },
      client: { 
        name: isPerson ? remark : (mappedData ? mappedData.name : ''), 
        city: mappedData ? mappedData.city : '',
        phone: '', email: '', address: '', date: '', notes: !isPerson && remark ? `Remark: ${remark}` : '',
        documents: [] // { name, url }
      }
    };
  });
};


// --- 4. SHARED PRESENTATIONAL COMPONENTS ---

function PrintRow({ label, lines = 1 }) {
  return (
    <div className="mb-4">
      <span className="font-bold mr-4">{label}</span>
      {Array.from({length: lines}).map((_, i) => (
         <div key={i} className={`border-b border-black w-full ${i===0 ? 'inline-block flex-1 align-bottom h-5' : 'mt-8 h-5 block'}`}></div>
      ))}
    </div>
  );
}

function FormInput({ label, type = "text", className = "", ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>}
      <input 
        type={type} 
        className={`w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${className}`}
        {...props} 
      />
    </div>
  );
}

function FormSelect({ label, options, className = "", ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>}
      <select 
        className={`w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white ${className}`}
        {...props}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function LedgerStat({ label, value, color }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-black mt-1 ${color}`}>₹ {Number(value || 0).toLocaleString('en-IN')}</div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtext, onClick }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border p-6 flex flex-col gap-2 ${colorMap[color]} ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:ring-2 ring-purple-300 transition-all duration-200' : ''}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">{title}</h4>
        <div className="p-2 bg-white rounded-lg shadow-sm opacity-80">{icon}</div>
      </div>
      <div className="text-3xl font-black mt-2">{value}</div>
      {subtext && <div className="text-xs font-medium opacity-75">{subtext}</div>}
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
}

// --- 5. MASTER FEATURE COMPONENTS ---

function Dashboard({ metrics, plots, onSelectPlot }) {
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [showOccupiedModal, setShowOccupiedModal] = useState(false);

  const allPayments = useMemo(() => {
    const payments = [];
    plots.forEach(plot => {
      const rcv = plot.financials.paymentHistory.reduce((s,x) => s + Number(x.amount), 0);
      const val = Number(plot.financials.finalValue) || 0;
      const bal = val - rcv;
      
      plot.financials.paymentHistory.forEach(pay => {
        payments.push({
          ...pay,
          plotNo: plot.plotNo,
          clientName: plot.client.name || 'Unassigned',
          currentBalance: bal
        });
      });
    });
    return payments.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [plots]);

  const occupiedPlots = plots.filter(p => p.status === 'Sold' || p.status === 'Booked');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Plots" value={metrics.total} icon={<Map size={20} />} color="blue" />
        <StatCard title="Available" value={metrics.available} icon={<Plus size={20} />} color="green" />
        <StatCard 
          title="Sold / Booked" 
          value={`${metrics.sold} / ${metrics.booked}`} 
          icon={<Save size={20} />} 
          color="red" 
          onClick={() => setShowOccupiedModal(true)}
        />
        <StatCard 
          title="Revenue Collected" 
          value={`₹ ${(metrics.totalReceived/100000).toFixed(2)}L`} 
          subtext={`of ₹ ${(metrics.totalExpected/100000).toFixed(2)}L (Click to View)`} 
          icon={<TrendingUp size={20} />} 
          color="purple" 
          onClick={() => setShowRevenueDetails(true)}
        />
      </div>

      {/* Visual Map / Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin size={20} className="text-slate-500"/> Layout Master Plan (Interactive)</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {plots.map(plot => (
            <button
              key={plot.id}
              onClick={() => onSelectPlot(plot)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center border-2 transition-transform hover:scale-105 hover:shadow-md ${STATUS_COLORS[plot.status] || 'bg-white'}`}
            >
              <span className="font-bold text-lg">{plot.plotNo}</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-75">{plot.status}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm justify-center p-4 bg-slate-50 rounded-lg">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border ${color}`}></div>
              <span className="font-medium text-slate-600">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OCCUPIED PLOTS MODAL */}
      {showOccupiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">Occupied Plots Roster</h3>
                <p className="text-sm text-slate-500 mt-1">List of all currently Sold or Booked plots.</p>
              </div>
              <button onClick={() => setShowOccupiedModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50/30 p-6">
              <ul className="space-y-3">
                {occupiedPlots.map(plot => (
                  <li key={plot.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer" onClick={() => { setShowOccupiedModal(false); onSelectPlot(plot); }}>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">Plot #{plot.plotNo}</p>
                      <p className="text-sm font-medium text-slate-600 flex items-center gap-2"><Users size={14}/> {plot.client.name || 'Name not recorded'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${plot.status === 'Sold' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {plot.status}
                    </span>
                  </li>
                ))}
                {occupiedPlots.length === 0 && <p className="text-center text-slate-500 py-8">No plots are currently sold or booked.</p>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* REVENUE DETAILS MODAL */}
      {showRevenueDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <IndianRupee size={24} className="text-emerald-600"/> Master Revenue Ledger
                </h3>
                <p className="text-sm text-slate-500 mt-1">Detailed history of all received payments across the layout.</p>
              </div>
              <button onClick={() => setShowRevenueDetails(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X size={24}/>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white border-b border-gray-100">
               <div className="p-4 rounded-xl border border-slate-100 bg-emerald-50/50">
                 <div className="text-xs font-bold text-slate-500 uppercase font-bold">Total Received</div>
                 <div className="text-2xl font-black text-emerald-700">₹ {metrics.totalReceived.toLocaleString('en-IN')}</div>
               </div>
               <div className="p-4 rounded-xl border border-slate-100 bg-emerald-50/50">
                 <div className="text-xs font-bold text-slate-500 uppercase font-bold">Total via Cash</div>
                 <div className="text-xl font-black text-slate-800 font-bold">₹ {allPayments.filter(p => p.mode==='Cash').reduce((s,p)=>s+Number(p.amount),0).toLocaleString('en-IN')}</div>
               </div>
               <div className="p-4 rounded-xl border border-slate-100 bg-blue-50/50">
                 <div className="text-xs font-bold text-slate-500 uppercase font-bold">Total via Cheque / Bank</div>
                 <div className="text-xl font-black text-slate-800 font-bold">₹ {allPayments.filter(p => p.mode==='Cheque').reduce((s,p)=>s+Number(p.amount),0).toLocaleString('en-IN')}</div>
               </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50/30">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs sticky top-0 shadow-sm">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Plot</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4 text-right font-bold">Amount (₹)</th>
                    <th className="p-4 text-right font-bold">Remaining Bal. (₹)</th>
                    <th className="p-4">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allPayments.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-slate-400">No payments recorded yet.</td></tr>
                  ) : (
                    allPayments.map((pay, i) => (
                      <tr key={i} className="hover:bg-white transition-colors">
                        <td className="p-4 whitespace-nowrap text-slate-600">{new Date(pay.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</td>
                        <td className="p-4 font-bold text-slate-800">#{pay.plotNo}</td>
                        <td className="p-4 font-medium text-slate-700">{pay.clientName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${pay.mode === 'Cash' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                            {pay.mode}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-emerald-600">₹ {Number(pay.amount).toLocaleString('en-IN')}</td>
                        <td className={`p-4 text-right font-bold ${pay.currentBalance > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                          {pay.currentBalance > 0 ? `₹ ${pay.currentBalance.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="p-4 text-slate-500 text-xs">{pay.reference || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function PlotDirectory({ plots, onSelectPlot }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-sm uppercase tracking-wider text-slate-500 font-semibold font-bold">
              <th className="p-4 font-semibold">Plot No</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Area (Sq.m)</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Expected Value</th>
              <th className="p-4 font-semibold">Documents</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plots.map(plot => (
              <tr key={plot.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-800">#{plot.plotNo}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[plot.status] || 'bg-white'}`}>
                    {plot.status}
                  </span>
                </td>
                <td className="p-4">{plot.areaSqM || '-'}</td>
                <td className="p-4">{plot.plotType}</td>
                <td className="p-4 font-semibold">₹ {Number(plot.financials.finalValue).toLocaleString('en-IN') || '-'}</td>
                <td className="p-4">
                  {plot.client.documents && plot.client.documents.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-150">
                       📎 {plot.client.documents.length} File(s)
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => onSelectPlot(plot)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlotEditor({ plot, onSave, onCancel }) {
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(plot))); // Deep copy
  const [editorTab, setEditorTab] = useState('basic');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [localToast, setLocalToast] = useState({ show: false, message: "", type: "success" });

  const driveFolderId = localStorage.getItem('drive_folder_id') || HARDCODED_DRIVE_FOLDER_ID;
  const plotsUrl = localStorage.getItem('plots_webhook') || "https://script.google.com/macros/s/AKfycbwku8o8vqGsURpauVr65oH5bvWC1BWmG3cUkBo0oYW7-C_H3KXnK4c9IWq3vuIuUmPv5g/exec";

  const handleAreaMChange = (e) => {
    const sqm = parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      areaSqM: sqm,
      areaSqFt: parseFloat((sqm * 10.7639).toFixed(2))
    });
  };

  const handleNestedChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: { ...formData[category], [field]: value }
    });
  };

  const handleSurroundingChange = (direction, field, value) => {
    setFormData({
      ...formData,
      surroundings: {
        ...formData.surroundings,
        [direction]: { ...formData.surroundings[direction], [field]: value }
      }
    });
  };

  // Automated instant file upload sequence
  const handleFileAttachAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const trimmedFolderId = driveFolderId ? driveFolderId.trim() : "";
        
        // Start simulated progress interval while waiting for Apps Script
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) return 90; // Hold at 90% until Google server fully resolves
            return prev + 10;
          });
        }, 400);

        try {
          const response = await fetch(plotsUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              action: "uploadFile",
              fileData: base64Data,
              fileName: file.name,
              mimeType: file.type,
              folderId: trimmedFolderId
            })
          });

          const result = await response.json();
          clearInterval(progressInterval);

          if (result.status === "success") {
            setUploadProgress(100); // Snap to 100% on success

            const currentDocs = formData.client.documents || [];
            setFormData({
              ...formData,
              client: {
                ...formData.client,
                documents: [...currentDocs, { name: result.fileName, url: result.fileUrl }]
              }
            });
            
            if (result.fallbackUsed) {
              setLocalToast({
                show: true,
                message: "Saved to main Drive (configured folder ID was invalid or inaccessible).",
                type: "warning"
              });
            } else {
              setLocalToast({
                show: true,
                message: `Document "${file.name}" uploaded successfully!`,
                type: "success"
              });
            }
            setTimeout(() => setLocalToast({ show: false, message: "", type: "success" }), 5000);
            
            // Allow user to see 100% completion before hiding the upload bar
            setTimeout(() => {
              setUploading(false);
              setUploadProgress(0);
            }, 800);
          } else {
            setUploadError(result.message || "Upload rejected. Verify Apps Script write scopes.");
            setUploading(false);
            setUploadProgress(0);
          }
        } catch (err) {
          console.error(err);
          clearInterval(progressInterval);
          setUploadError("Error connecting to sheet script. Please verify deployment has 'Anyone' permissions.");
          setUploading(false);
          setUploadProgress(0);
        }
      };
    } catch (err) {
      console.error(err);
      setUploadError("Error reading the selected file.");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocumentLink = (docUrl) => {
    const currentDocs = formData.client.documents || [];
    setFormData({
      ...formData,
      client: {
        ...formData.client,
        documents: currentDocs.filter(d => d.url !== docUrl)
      }
    });
  };

  const addPayment = (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = Number(form.amount.value);
    const mode = form.mode.value;
    const date = form.date.value;
    const reference = form.reference.value;

    if (!amount || !date) return;
    const newPayment = { id: Date.now(), amount, mode, date, reference };
    
    setFormData({
      ...formData,
      financials: {
        ...formData.financials,
        paymentHistory: [...formData.financials.paymentHistory, newPayment]
      }
    });
    form.reset();
  };

  const deletePayment = (id) => {
    setFormData({
      ...formData,
      financials: {
        ...formData.financials,
        paymentHistory: formData.financials.paymentHistory.filter(p => p.id !== id)
      }
    });
  };

  const totalPaidCash = formData.financials.paymentHistory.filter(p => p.mode === 'Cash').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaidCheque = formData.financials.paymentHistory.filter(p => p.mode === 'Cheque').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaid = totalPaidCash + totalPaidCheque;
  const balance = (Number(formData.financials.finalValue) || 0) - totalPaid;
  const balanceCheque = (Number(formData.financials.expectedCheque) || 0) - totalPaidCheque;
  const balanceCash = (Number(formData.financials.expectedCash) || 0) - totalPaidCash;

  // Generate dynamic, clean URL fallback to prevent 404 Google Drive errors
  const activeDriveBrowseUrl = useMemo(() => {
    if (driveFolderId && driveFolderId.trim() !== "") {
      return `https://drive.google.com/drive/u/0/folders/${driveFolderId.trim()}`;
    }
    return "https://drive.google.com/drive/my-drive";
  }, [driveFolderId]);

  const getRenderableImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('data:')) return url;
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Bypasses Drive's cross-origin block by requesting a high-res thumbnail endpoint
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
    return url;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300 relative">
      
      {/* Inline Editor Toast notifications */}
      {localToast.show && (
        <div className={`absolute top-4 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-top-2 fade-in duration-300 text-white font-medium z-50 text-sm ${localToast.type === 'success' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
          <CheckCircle size={18} />
          {localToast.message}
        </div>
      )}

      <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Managing Plot #{formData.plotNo}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Survey No: {formData.surveyNo} | Layout: {formData.layoutNo}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-slate-50 overflow-x-auto">
        {['basic', 'surroundings', 'financials', 'client'].map(tab => (
          <button
            key={tab}
            onClick={() => setEditorTab(tab)}
            className={`px-6 py-4 font-semibold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
              editorTab === tab ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-gray-100'
            }`}
          >
            {tab === 'basic' ? 'Layout & Dimensions' : 
             tab === 'surroundings' ? 'Type & Surroundings' :
             tab === 'financials' ? 'Rates & Payments' : 'Client & Booking'}
          </button>
        ))}
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {editorTab === 'basic' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Status & Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormSelect label="Current Status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} options={Object.keys(STATUS_COLORS)} />
                <FormInput label="Plot No." value={formData.plotNo} onChange={e => setFormData({...formData, plotNo: e.target.value})} />
                <FormInput label="Layout No." value={formData.layoutNo} onChange={e => setFormData({...formData, layoutNo: e.target.value})} />
                <FormInput label="Survey No." value={formData.surveyNo} onChange={e => setFormData({...formData, surveyNo: e.target.value})} />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-end">
                <span>Plot Dimensions (Meters)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <FormInput label="East Bound (m)" type="number" step="0.01" value={formData.dimensions.east} onChange={e => handleNestedChange('dimensions', 'east', e.target.value)} />
                <FormInput label="West Bound (m)" type="number" step="0.01" value={formData.dimensions.west} onChange={e => handleNestedChange('dimensions', 'west', e.target.value)} />
                <FormInput label="North Bound (m)" type="number" step="0.01" value={formData.dimensions.north} onChange={e => handleNestedChange('dimensions', 'north', e.target.value)} />
                <FormInput label="South Bound (m)" type="number" step="0.01" value={formData.dimensions.south} onChange={e => handleNestedChange('dimensions', 'south', e.target.value)} />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                Area Calculation <Calculator size={18} className="text-blue-500"/>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Area in Sq. Meters</label>
                  <input type="number" step="0.01" value={formData.areaSqM} onChange={handleAreaMChange} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-bold text-lg text-blue-800 bg-blue-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Area in Sq. Feet (Auto-calculated)</label>
                  <input type="number" step="0.01" value={formData.areaSqFt} onChange={e => setFormData({...formData, areaSqFt: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-gray-100 font-bold text-lg text-slate-600" />
                  <p className="text-xs text-slate-500 mt-1">* 1 sq.m = 10.7639 sq.ft</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                <Map size={18} className="text-blue-500"/> Individual Plot Map
              </h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                {formData.plotMapUrl ? (
                  <div className="relative group w-full flex justify-center">
                    <img 
                      src={getRenderableImageUrl(formData.plotMapUrl)} 
                      alt={`Map for Plot ${formData.plotNo}`} 
                      className="max-w-full h-auto max-h-80 rounded-lg shadow-sm border border-slate-300 bg-white object-contain" 
                      onError={(e) => {
                        e.target.onerror = null;
                        // Fallback broken image indicator
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3Cline x1='3' y1='3' x2='21' y2='21'/%3E%3C/svg%3E";
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData({...formData, plotMapUrl: null});
                        const existing = JSON.parse(localStorage.getItem('plot_maps') || '{}');
                        delete existing[formData.plotNo];
                        localStorage.setItem('plot_maps', JSON.stringify(existing));
                      }} 
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600" 
                      title="Remove Image"
                    >
                      <X size={16}/>
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center hover:bg-slate-100 p-8 rounded-xl border-2 border-dashed border-slate-300 w-full transition-colors">
                    <MapPin className="mx-auto text-slate-400 mb-3" size={36} />
                    <span className="block text-sm font-bold text-blue-600">Upload Cropped Plot Drawing</span>
                    <span className="block text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                      Since auto-cropping from CAD/PDF is not possible, please screenshot Plot #{formData.plotNo} from your Certified Drawing and attach it here.
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                         const file = e.target.files[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onload = (ev) => {
                             const base64 = ev.target.result;
                             setFormData({...formData, plotMapUrl: base64});
                             const existing = JSON.parse(localStorage.getItem('plot_maps') || '{}');
                             existing[formData.plotNo] = base64;
                             localStorage.setItem('plot_maps', JSON.stringify(existing));
                           };
                           reader.readAsDataURL(file);
                         }
                      }}
                    />
                  </label>
                )}
              </div>
            </section>
          </div>
        )}

        {editorTab === 'surroundings' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect label="Plot Type" value={formData.plotType} onChange={e => setFormData({...formData, plotType: e.target.value})} options={['Residential', 'Commercial', 'Reserved', 'Others']} />
                <FormSelect label="Reservation Type" value={formData.reservation} onChange={e => setFormData({...formData, reservation: e.target.value})} options={['Free hold', 'Open space', 'Amenity space', 'Others']} />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Surroundings & Boundaries</h3>
              <p className="text-sm text-slate-500 mb-4">Define what borders this plot. Select 'Plot' for adjacent owner names, or 'Road' for internal/external roads.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['east', 'west', 'north', 'south'].map(direction => (
                  <div key={direction} className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-3 text-slate-700">{direction} Boundary</h4>
                    <div className="flex gap-3">
                      <div className="w-1/3">
                        <select 
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-blue-500 outline-none text-sm font-medium"
                          value={formData.surroundings[direction].type}
                          onChange={e => handleSurroundingChange(direction, 'type', e.target.value)}
                        >
                          <option value="Plot">Adjacent Plot</option>
                          <option value="Road">Internal Road</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="w-2/3">
                        <input 
                          type="text" 
                          placeholder={formData.surroundings[direction].type === 'Plot' ? "Owner Name / Plot No." : "Road Width/Name"}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-blue-500 outline-none text-sm"
                          value={formData.surroundings[direction].detail}
                          onChange={e => handleSurroundingChange(direction, 'detail', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {editorTab === 'financials' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput label="Rate per Sq.Ft (₹)" type="number" value={formData.financials.ratePerSqFt || ''} onChange={e => {
                  const rate = e.target.value;
                  const finalVal = (Number(rate) * Number(formData.areaSqFt)).toFixed(0);
                  setFormData({
                    ...formData,
                    financials: { ...formData.financials, ratePerSqFt: rate, finalValue: finalVal }
                  });
                }} />
                <div className="md:col-span-2">
                  <FormInput label="Negotiated Final Value (₹)" type="number" 
                    className="font-bold text-blue-700 bg-white border-2 border-blue-200 text-lg py-3"
                    value={formData.financials.finalValue} onChange={e => handleNestedChange('financials', 'finalValue', e.target.value)} />
                </div>
                
                <div className="md:col-span-3 grid grid-cols-2 gap-6 mt-4 p-4 border border-dashed border-slate-300 rounded-lg">
                  <FormInput label="Expected Payment in CASH (₹)" type="number" value={formData.financials.expectedCash} onChange={e => handleNestedChange('financials', 'expectedCash', e.target.value)} />
                  <FormInput label="Expected Payment in CHEQUE (₹)" type="number" value={formData.financials.expectedCheque} onChange={e => handleNestedChange('financials', 'expectedCheque', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
               <h3 className="text-lg font-bold text-slate-800 mb-4">Financial Ledger</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <LedgerStat label="Total Negotiated" value={formData.financials.finalValue} color="text-slate-800" />
                  <LedgerStat label="Total Received" value={totalPaid} color="text-green-600" />
                  <LedgerStat label="Total Balance" value={balance} color={balance > 0 ? "text-red-600" : "text-green-600"} />
                  <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-center">
                    <div className="text-xs font-bold text-slate-500 uppercase">Received Split</div>
                    <div className="text-sm font-semibold mt-1">Cash: <span className="text-emerald-600">₹{totalPaidCash}</span> <span className="text-xs text-red-500 ml-1">(Bal: ₹{balanceCash})</span></div>
                    <div className="text-sm font-semibold">Cheque: <span className="text-blue-600">₹{totalPaidCheque}</span> <span className="text-xs text-red-500 ml-1">(Bal: ₹{balanceCheque})</span></div>
                  </div>
               </div>

               <form onSubmit={addPayment} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end mb-6">
                 <div className="flex-1 min-w-[150px]">
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Date</label>
                   <input type="date" name="date" required className="w-full px-3 py-2 border rounded-md" defaultValue={new Date().toISOString().split('T')[0]} />
                 </div>
                 <div className="flex-1 min-w-[150px]">
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Amount (₹)</label>
                   <input type="number" name="amount" required placeholder="0.00" className="w-full px-3 py-2 border rounded-md font-bold" />
                 </div>
                 <div className="flex-1 min-w-[120px]">
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mode</label>
                   <select name="mode" className="w-full px-3 py-2 border rounded-md bg-white">
                     <option value="Cash">Cash</option>
                     <option value="Cheque">Cheque</option>
                   </select>
                 </div>
                 <div className="flex-[2] min-w-[200px]">
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Ref / Cheque No / Notes</label>
                   <input type="text" name="reference" placeholder="e.g. Chq 123456" className="w-full px-3 py-2 border rounded-md" />
                 </div>
                 <button type="submit" className="px-5 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 whitespace-nowrap flex items-center gap-2">
                   <Plus size={16}/> Record Payment
                 </button>
               </form>

               <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                     <tr>
                       <th className="px-4 py-3">Date</th>
                       <th className="px-4 py-3">Mode</th>
                       <th className="px-4 py-3">Amount</th>
                       <th className="px-4 py-3">Reference</th>
                       <th className="px-4 py-3">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {formData.financials.paymentHistory.length === 0 ? (
                       <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400 italic">No payments recorded yet.</td></tr>
                     ) : (
                       formData.financials.paymentHistory.map(pay => (
                         <tr key={pay.id} className="hover:bg-slate-50">
                           <td className="px-4 py-3">{new Date(pay.date).toLocaleDateString()}</td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${pay.mode === 'Cash' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                               {pay.mode}
                             </span>
                           </td>
                           <td className="px-4 py-3 font-bold text-slate-800">₹{Number(pay.amount).toLocaleString()}</td>
                           <td className="px-4 py-3 text-slate-600">{pay.reference || '-'}</td>
                           <td className="px-4 py-3">
                             <button onClick={() => deletePayment(pay.id)} className="text-red-500 hover:text-red-700" title="Delete Entry"><X size={16}/></button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </section>
          </div>
        )}

        {editorTab === 'client' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Buyer Metadata */}
              <div className="lg:col-span-2 bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit space-y-4 font-sans">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2"><Users size={20}/> Primary Buyer / Client Details</h3>
                <FormInput label="Full Name" value={formData.client.name} onChange={e => handleNestedChange('client', 'name', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="City" value={formData.client.city || ''} onChange={e => handleNestedChange('client', 'city', e.target.value)} />
                  <FormInput label="Phone Number" type="tel" value={formData.client.phone} onChange={e => handleNestedChange('client', 'phone', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormInput label="Email Address" type="email" value={formData.client.email} onChange={e => handleNestedChange('client', 'email', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Residential Address</label>
                  <textarea rows="3" value={formData.client.address} onChange={e => handleNestedChange('client', 'address', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none bg-white"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Booking/Registry Date" type="date" value={formData.client.date} onChange={e => handleNestedChange('client', 'date', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Special Notes / Agreements</label>
                  <textarea rows="2" value={formData.client.notes} onChange={e => handleNestedChange('client', 'notes', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none bg-white"></textarea>
                </div>
              </div>

              {/* Automated Document Storage Center */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit space-y-4 font-sans">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CloudUpload size={20} className="text-blue-500" /> Drive Documents
                  </h3>
                  {driveFolderId && (
                    <a 
                      href={activeDriveBrowseUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 flex items-center gap-1 text-[10px] font-bold border border-slate-300"
                      title="Open Google Drive folder"
                    >
                      <FolderOpen size={12} /> Open Folder
                    </a>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed border-b pb-2">
                  Upload layout blueprint, buyer identification documents, registry photocopy, or bank receipts directly to your designated Google Drive folder.
                </p>

                {/* Simplified One-Click Auto-Upload widget */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-blue-400 bg-white transition relative">
                  {uploading ? (
                    <div className="py-4 space-y-3 px-6">
                       <RefreshCw className="animate-spin text-blue-600 mx-auto" size={28} />
                       <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                         <span>Uploading to Google Drive...</span>
                         <span className="text-blue-600">{uploadProgress}%</span>
                       </div>
                       <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                         <div className={`h-2.5 rounded-full transition-all duration-300 ease-out ${uploadProgress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${uploadProgress}%` }}></div>
                       </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4 space-y-2">
                       <FileUp className="text-slate-400 mx-auto animate-bounce" size={32} />
                       <span className="block text-xs font-bold text-blue-600 hover:text-blue-800">Choose File to Auto-Upload</span>
                       <span className="block text-[10px] text-slate-400">PDF, JPG, PNG, DOC (max 10MB)</span>
                       <input 
                         type="file" 
                         className="hidden" 
                         onChange={handleFileAttachAndUpload} 
                         disabled={uploading}
                       />
                    </label>
                  )}
                </div>

                {/* Inline upload error container */}
                {uploadError && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 flex justify-between items-start animate-in fade-in">
                    <p className="flex-1 leading-normal">{uploadError}</p>
                    <button type="button" onClick={() => setUploadError("")} className="p-0.5 hover:bg-red-100 rounded text-red-500 ml-1"><X size={14}/></button>
                  </div>
                )}

                {/* Attachment Listing (RECALL SYSTEM) */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-bold">Files Performed ({(formData.client.documents || []).length})</h4>
                  {(formData.client.documents || []).length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 italic bg-white rounded-lg border">No documents attached to this plot.</div>
                  ) : (
                     formData.client.documents.map((doc, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-bottom-2">
                         <div className="overflow-hidden pr-2 flex-1">
                           <p className="text-xs font-bold text-slate-800 truncate" title={doc.name}>{doc.name}</p>
                           <span className="text-[10px] text-slate-400 uppercase font-semibold">Google Drive</span>
                         </div>
                         <div className="flex gap-2">
                           <a 
                             href={doc.url} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="p-1.5 hover:bg-slate-100 rounded text-blue-600 border border-slate-100"
                             title="Open File in New Tab"
                           >
                             <ExternalLink size={14} />
                           </a>
                           <button 
                             type="button" 
                             onClick={() => deleteDocumentLink(doc.url)}
                             className="p-1.5 hover:bg-red-50 rounded text-red-500 border border-slate-100"
                             title="Unlink File"
                           >
                             <Trash size={14} />
                           </button>
                         </div>
                       </div>
                     ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- ENQUIRY / PRINT FORM COMPONENT ---
function EnquiryManager({ enquiries, setEnquiries, plots }) {
  const [showForm, setShowForm] = useState(false);
  
  const handleAddEnquiry = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newEnq = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      name: fd.get('name'),
      phone: fd.get('phone'),
      interestedPlot: fd.get('interestedPlot'),
      requirements: fd.get('requirements'),
    };
    setEnquiries([...enquiries, newEnq]);
    setShowForm(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="print:hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 font-bold">Lead Database</h2>
          <div className="flex gap-3">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
              <Printer size={18} /> Print Form Template
             </button>
             <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition shadow-md shadow-blue-500/20 font-bold">
              {showForm ? <X size={18}/> : <Plus size={18}/>} 
              {showForm ? 'Close Form' : 'New Enquiry'}
             </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleAddEnquiry} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-2xl animate-in slide-in-from-top-4">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Record New Enquiry</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormInput name="name" label="Full Name" required />
              <FormInput name="phone" label="Phone Number" required />
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Interested In Plot(s)</label>
                <select name="interestedPlot" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                  <option value="Any">Any Available</option>
                  {plots.filter(p => p.status === 'Available').map(p => (
                    <option key={p.id} value={`Plot ${p.plotNo}`}>Plot #{p.plotNo} ({p.areaSqM} sqm)</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Specific Requirements / Budget</label>
                 <textarea name="requirements" rows="3" className="w-full px-4 py-2 rounded-lg border border-slate-200"></textarea>
              </div>
            </div>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 font-bold">Save Enquiry</button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No enquiries recorded yet.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-200 text-sm uppercase tracking-wider text-slate-500 font-semibold font-bold">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50">
                    <td className="p-4 text-sm text-slate-600">{enq.date}</td>
                    <td className="p-4 font-bold text-slate-800">{enq.name}</td>
                    <td className="p-4 text-slate-600">{enq.phone}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{enq.interestedPlot}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PRINTABLE TEMPLATE (Only visible on Print) */}
      <div className="hidden print:block max-w-4xl mx-auto bg-white p-8 border-2 border-black h-screen">
        <div className="text-center border-b-2 border-black pb-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-widest">Plot Enquiry Form</h1>
          <p className="text-lg font-medium text-gray-600 mt-2">Project: Layout Master Phase 1</p>
        </div>

        <div className="space-y-8 text-lg">
          <div className="flex justify-end">
            <span className="font-bold mr-2">Date:</span> 
            <span className="inline-block border-b border-black w-48"></span>
          </div>

          <PrintRow label="Full Name of Enquirer:" />
          <PrintRow label="Contact Number:" />
          <PrintRow label="Email Address:" />
          <PrintRow label="Current Residential Address:" lines={2} />
          
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <span className="font-bold mb-2 block">Interested Plot Type:</span>
              <div className="flex gap-4 mt-2">
                <div className="w-5 h-5 border border-black"></div> Residential
                <div className="w-5 h-5 border border-black ml-4"></div> Commercial
              </div>
            </div>
            <div>
              <span className="font-bold mb-2 block">Specific Plot Number (If Any):</span>
              <span className="block border-b border-black w-full h-6 mt-1"></span>
            </div>
          </div>

          <PrintRow label="Approximate Budget (₹):" />
          <PrintRow label="Preferred Payment Method (Cash/Bank Loan):" />
          <PrintRow label="Special Requirements / Notes:" lines={3} />

          <div className="mt-24 flex justify-between px-12">
             <div className="text-center">
               <div className="border-t border-black w-48 pt-2">Customer Signature</div>
             </div>
             <div className="text-center">
               <div className="border-t border-black w-48 pt-2">Agent / Auth. Signatory</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectReport({ plots, metrics }) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-xl font-bold text-slate-800 font-bold font-bold">Comprehensive Project Report</h2>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition shadow-md">
          <Printer size={18} /> Print PDF Report
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Layout Master Report</h1>
          <p className="text-slate-500 mt-1">Generated on: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="text-xs font-bold text-slate-500 uppercase font-bold text-slate-600">Total Plots</div>
             <div className="text-2xl font-black text-slate-800">{metrics.total}</div>
           </div>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="text-xs font-bold text-slate-500 uppercase font-bold text-slate-600 font-bold">Sold / Booked</div>
             <div className="text-2xl font-black text-blue-600">{metrics.sold + metrics.booked}</div>
           </div>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="text-xs font-bold text-slate-500 uppercase font-bold font-bold text-slate-600">Total Value</div>
             <div className="text-xl font-black text-slate-800 font-bold">₹ {metrics.totalExpected.toLocaleString('en-IN')}</div>
           </div>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="text-xs font-bold text-slate-500 uppercase font-bold font-bold text-slate-600 font-bold">Amount Received</div>
             <div className="text-xl font-black text-emerald-600 font-bold font-bold font-bold">₹ {metrics.totalReceived.toLocaleString('en-IN')}</div>
           </div>
        </div>

        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white uppercase text-xs">
              <th className="p-3 border border-slate-700">Plot</th>
              <th className="p-3 border border-slate-700">Owner / Client</th>
              <th className="p-3 border border-slate-700">Status</th>
              <th className="p-3 border border-slate-700 text-right font-bold">Area (Sq.Ft)</th>
              <th className="p-3 border border-slate-700 text-right font-bold">Value (₹)</th>
              <th className="p-3 border border-slate-700 text-right font-bold font-bold font-bold font-bold">Received (₹)</th>
              <th className="p-3 border border-slate-700 text-right font-bold">Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {plots.map(p => {
               const rcv = p.financials.paymentHistory.reduce((s,x)=>s+Number(x.amount),0);
               const val = Number(p.financials.finalValue) || 0;
               const bal = val - rcv;
               return (
                 <tr key={p.id} className="even:bg-slate-50 border-b border-slate-200 break-inside-avoid">
                   <td className="p-3 font-bold text-slate-800 border-x border-slate-200 font-bold font-bold">#{p.plotNo}</td>
                   <td className="p-3 font-semibold text-slate-700 border-x border-slate-200 font-semibold font-semibold font-semibold">
                     {p.client.name || <span className="text-slate-400 italic">Unassigned</span>}
                     {p.client.notes && !p.client.name && <span className="text-slate-500 italic block text-xs">{p.client.notes}</span>}
                   </td>
                   <td className="p-3 border-x border-slate-200">
                     <span className="text-xs font-bold uppercase">{p.status}</span>
                   </td>
                   <td className="p-3 text-right border-x border-slate-200">{p.areaSqFt > 0 ? p.areaSqFt : '-'}</td>
                   <td className="p-3 text-right border-x border-slate-200 font-medium">{val > 0 ? val.toLocaleString('en-IN') : '-'}</td>
                   <td className="p-3 text-right border-x border-slate-200 font-medium text-emerald-600">{rcv > 0 ? rcv.toLocaleString('en-IN') : '-'}</td>
                   <td className={`p-3 text-right border-x border-slate-200 font-bold ${bal > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                     {val > 0 ? bal.toLocaleString('en-IN') : '-'}
                   </td>
                 </tr>
               );
            })}
          </tbody>
        </table>
        
        <div className="mt-8 text-center text-xs text-slate-400 print:block hidden">
          ** End of Report - PlotMaster Pro **
        </div>
      </div>
    </div>
  );
}

// --- ADAPTED EXPENDITURE MANAGER ---
function ExpenditureManager({ expenditures, setExpenditures, setToast }) {
  const [showForm, setShowForm] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('expenditure_webhook') || 'https://script.google.com/macros/s/AKfycbxNvAehXkBfOUmO_-sbcLDlr-zWK9ZKD_NEwe3gSo_pkR2x7kDHnuoisRypi9y-GaGf/exec');

  // FETCH EXPENDITURES ON LOAD
  const fetchExpenditures = useCallback(async (silent = false) => {
    if (!sheetUrl) return;
    if (!silent) setFetching(true);
    try {
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error("Connection failed.");
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const formatted = data.map((row, i) => ({
           id: i,
           date: row[0] || '',
           particulars: row[1] || '',
           group: row[2] || '',
           division: row[3] || '',
           received: parseFloat(row[4]) || 0,
           expended: parseFloat(row[5]) || 0
        }));
        setExpenditures(formatted);
        if (!silent) {
          setToast({ show: true, message: 'Expenditures refreshed successfully!', type: 'success' });
          setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
        }
      }
    } catch (err) {
       // Silently catch the fetch error instead of throwing a noisy console trace
       if (!silent) {
         setToast({ show: true, message: 'Could not fetch expenditures. Using local fallback data.', type: 'warning' });
         setTimeout(() => setToast({ show: false, message: '', type: 'warning' }), 4000);
       }
    }
    if (!silent) setFetching(false);
  }, [sheetUrl, setExpenditures, setToast]);

  useEffect(() => {
    fetchExpenditures(true);
  }, [fetchExpenditures]);

  const totalReceived = expenditures.reduce((sum, e) => sum + Number(e.received || 0), 0);
  const totalExpended = expenditures.reduce((sum, e) => sum + Number(e.expended || 0), 0);
  const netCashFlow = totalReceived - totalExpended;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const url = e.target.url.value.trim();
    setSheetUrl(url);
    localStorage.setItem('expenditure_webhook', url);
    setShowSettings(false);
    setToast({ show: true, message: 'Expenditure webhook URL saved!', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleAddExp = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const dateStr = fd.get('date');
    const parts = dateStr.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    const newExp = {
      id: Date.now(),
      date: formattedDate,
      particulars: fd.get('particulars'),
      group: fd.get('group'),
      division: fd.get('division') || 'Main',
      received: Number(fd.get('received')) || 0,
      expended: Number(fd.get('expended')) || 0
    };

    setExpenditures([newExp, ...expenditures]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setExpenditures(expenditures.filter(e => e.id !== id));
  };

  const handleSyncToSheets = async () => {
    if (!sheetUrl) {
      setShowSettings(true);
      return;
    }
    
    setSyncing(true);
    try {
      const payload = expenditures.map(e => [
         e.date, 
         e.particulars, 
         e.group, 
         e.division, 
         Number(e.received) || 0, 
         Number(e.expended) || 0
      ]);
      
      await fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      
      setToast({ show: true, message: 'Expenditures successfully synced to Google Sheets!', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    } catch (error) {
       // Suppress stack trace on sync failure
       setToast({ show: true, message: 'Connection failed. Check Web App permissions.', type: 'error' });
       setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    }
    setSyncing(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Wallet className="text-slate-500" /> Project Expenditure
        </h2>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowSettings(true)}
             className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition"
             title="Sheet Setup & Settings"
             type="button"
           >
              <Settings size={20} />
           </button>
           <button 
             onClick={() => fetchExpenditures(false)}
             disabled={fetching}
             className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
             type="button"
           >
              <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
              {fetching ? "Refreshing..." : "Refresh List"}
           </button>
           <button 
             onClick={handleSyncToSheets}
             disabled={syncing}
             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm animate-pulse"
             type="button"
           >
              <CloudUpload size={18} />
              {syncing ? 'Syncing...' : 'Sync to Sheet'}
           </button>
           <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition shadow-md font-bold" type="button">
            {showForm ? <X size={18}/> : <Plus size={18}/>} 
            {showForm ? 'Close Form' : 'Add Record'}
           </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 max-w-lg w-full animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg text-slate-800">Configure Webhook Connector</h3>
               <button type="button" onClick={() => setShowSettings(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><X size={18}/></button>
             </div>
             <p className="text-sm text-slate-500 mb-4">
               Paste your deployed Google Apps Script Web App URL (`https://script.google.com/.../exec`) associated with your **Expenditure Sheet**.
             </p>
             <FormInput name="url" label="Web App URL" required defaultValue={sheetUrl} placeholder="https://script.google.com/macros/s/.../exec" />
             <div className="flex justify-end gap-3 mt-6">
               <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
               <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-50">Save Webhook</button>
             </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
           <div className="text-sm font-bold text-slate-500 uppercase font-bold">Total Received</div>
           <div className="text-3xl font-black text-green-600 mt-2">₹ {totalReceived.toLocaleString('en-IN')}</div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
           <div className="text-sm font-bold text-slate-500 uppercase font-bold">Total Expended</div>
           <div className="text-2xl font-black text-red-600 mt-2">₹ {totalExpended.toLocaleString('en-IN')}</div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm font-bold text-slate-500 uppercase font-bold font-bold font-bold font-bold">Net Balance</div>
           <div className={`text-2xl font-black mt-2 ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
             ₹ {netCashFlow.toLocaleString('en-IN')}
           </div>
         </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddExp} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-4xl animate-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">Record Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormInput name="date" label="Date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            <FormInput name="particulars" label="Particulars / Vendor / Description" placeholder="e.g. JCB Earthworks, Cement Purchase..." required />
            <FormSelect name="group" label="Group" options={['Development & Infra', 'Acquisition & Land', 'Government Fees', 'Marketing', 'Administrative', 'Capital & Funding', 'Other']} />
            <FormInput name="division" label="Division" placeholder="e.g. Phase 1, Phase 2, Finance" />
            <FormInput name="received" label="Received Amount (Inflow ₹)" type="number" defaultValue="0" min="0" />
            <FormInput name="expended" label="Expended Amount (Outflow ₹)" type="number" defaultValue="0" min="0" />
          </div>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold">Save Record</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {expenditures.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wallet size={48} className="mx-auto mb-4 opacity-50" />
            <p>No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-gray-200 uppercase tracking-wider text-slate-500 font-semibold font-bold font-bold font-bold font-bold font-bold font-bold">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Particulars</th>
                  <th className="p-4">Group</th>
                  <th className="p-4">Division</th>
                  <th className="p-4 text-right font-bold">Received (Inflow)</th>
                  <th className="p-4 text-right font-bold">Expended (Outflow)</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenditures.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-600 font-semibold">{exp.date}</td>
                    <td className="p-4 font-bold text-slate-800">{exp.particulars}</td>
                    <td className="p-4 text-slate-700 font-medium">{exp.group}</td>
                    <td className="p-4 text-slate-500 font-medium">{exp.division || 'Main'}</td>
                    <td className="p-4 text-right font-bold text-emerald-600">
                       {exp.received > 0 ? `₹ ${Number(exp.received).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-4 text-right font-bold text-red-600">
                       {exp.expended > 0 ? `₹ ${Number(exp.expended).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-4 text-center">
                       <button onClick={() => handleDelete(exp.id)} className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-md transition-colors" title="Delete Entry" type="button">
                         <X size={16}/>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 6. MAIN EXPORT APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plots, setPlots] = useState(generateInitialPlots());
  const [enquiries, setEnquiries] = useState([]);
  const [expenditures, setExpenditures] = useState(INITIAL_EXPENDITURES);
  const [selectedPlot, setSelectedPlot] = useState(null);
  
  // Connectors
  const [plotsUrl, setPlotsUrl] = useState(() => localStorage.getItem('plots_webhook') || "https://script.google.com/macros/s/AKfycbwku8o8vqGsURpauVr65oH5bvWC1BWmG3cUkBo0oYW7-C_H3KXnK4c9IWq3vuIuUmPv5g/exec");
  const [driveFolderId, setDriveFolderId] = useState(() => localStorage.getItem('drive_folder_id') || HARDCODED_DRIVE_FOLDER_ID);
  const [mapsFolderId, setMapsFolderId] = useState(() => localStorage.getItem('maps_folder_id') || HARDCODED_MAPS_FOLDER_ID);
  const [syncing, setSyncing] = useState(false);
  const [syncingMaps, setSyncingMaps] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [isConnected, setIsConnected] = useState(null); // null = untested, true = connected, false = failed (offline mode)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showSettings, setShowSettings] = useState(false);

  // AUTO-SYNC PLOT MAPS FROM DRIVE
  const syncPlotMapsFromDrive = async () => {
    if (!mapsFolderId) {
      setToast({ show: true, message: 'Please configure a Plot Maps Folder ID in settings first.', type: 'warning' });
      return;
    }
    setSyncingMaps(true);
    try {
      const response = await fetch(plotsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'syncPlotMaps', folderId: mapsFolderId.trim() })
      });
      const result = await response.json();
      
      if (result.status === 'success') {
         const existingMaps = JSON.parse(localStorage.getItem('plot_maps') || '{}');
         const updatedMaps = { ...existingMaps, ...result.maps };
         localStorage.setItem('plot_maps', JSON.stringify(updatedMaps));
         
         // Update current plots state so UI refreshes immediately
         setPlots(prev => prev.map(p => {
           if (result.maps[p.plotNo]) {
             return { ...p, plotMapUrl: result.maps[p.plotNo] };
           }
           return p;
         }));
         setToast({ show: true, message: `Successfully synced ${Object.keys(result.maps).length} plot maps from Drive!`, type: 'success' });
      } else {
         setToast({ show: true, message: 'Error syncing maps: ' + result.message, type: 'error' });
      }
    } catch (e) {
       console.error("Sync maps error:", e);
       setToast({ show: true, message: 'Connection failed. Please ensure you have added the new syncPlotMaps case to your Apps Script.', type: 'error' });
    }
    setSyncingMaps(false);
  };

  // FETCH PLOT TRANSACTIONS FROM SHEET WITH RECOVERY
  const fetchPlotsFromSheet = useCallback(async (silent = false) => {
    if (!silent) setFetching(true);
    try {
      const response = await fetch(plotsUrl);
      if (!response.ok) throw new Error("Could not reach webhook.");
      const sheetData = await response.json();
      
      if (sheetData && Array.isArray(sheetData) && sheetData.length > 0) {
        setPlots(prevPlots => {
          return prevPlots.map(p => {
            const sheetRow = sheetData.find(row => parseInt(row[0]) === p.plotNo);
            if (!sheetRow) return p;

            const name = sheetRow[1] || '';
            const city = sheetRow[2] || '';
            const areaM = parseFloat(sheetRow[3]) || p.areaSqM;
            const areaF = parseFloat(sheetRow[4]) || p.areaSqFt;
            const rate = parseFloat(sheetRow[5]) || 0;
            const total = parseFloat(sheetRow[6]) || 0;
            const expCheque = parseFloat(sheetRow[7]) || 0;
            const expCash = parseFloat(sheetRow[8]) || 0;
            const rcvCheque = parseFloat(sheetRow[9]) || 0;
            const rcvCash = parseFloat(sheetRow[10]) || 0;
            const parsedDocuments = parseDocumentsColumn(sheetRow[15] || ''); // Retrieve drive URLs from Column P

            let paymentHistory = [];
            if (rcvCheque > 0) paymentHistory.push({ id: `chq-${p.plotNo}`, date: new Date().toISOString().split('T')[0], amount: rcvCheque, mode: 'Cheque', reference: 'Synced Cheque' });
            if (rcvCash > 0) paymentHistory.push({ id: `csh-${p.plotNo}`, date: new Date().toISOString().split('T')[0], amount: rcvCash, mode: 'Cash', reference: 'Synced Cash' });

            const totalReceived = rcvCheque + rcvCash;
            let currentStatus = p.status;
            if (total > 0) {
               currentStatus = totalReceived >= total ? 'Sold' : (totalReceived > 0 ? 'Booked' : 'On Hold');
            }

            return {
              ...p,
              areaSqM: areaM,
              areaSqFt: areaF,
              status: currentStatus,
              financials: {
                ...p.financials,
                ratePerSqFt: rate,
                finalValue: total,
                expectedCheque: expCheque,
                expectedCash: expCash,
                paymentHistory: paymentHistory
              },
              client: {
                ...p.client,
                name: name,
                city: city,
                documents: parsedDocuments
              }
            };
          });
        });
        
        setIsConnected(true);
        if (!silent) {
          setToast({ show: true, message: 'Cloud database synced successfully!', type: 'success' });
          setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
        }
      }
    } catch (err) {
      // Suppress stack trace on network failure
      setIsConnected(false); // Enable offline indicator
      if (!silent) {
        setToast({ show: true, message: 'Offline Mode Active. Using local changes.', type: 'warning' });
        setTimeout(() => setToast({ show: false, message: '', type: 'warning' }), 5000);
      }
    }
    if (!silent) setFetching(false);
  }, [plotsUrl]);

  // ON STARTUP AUTO SYNC
  useEffect(() => {
    fetchPlotsFromSheet(true);
  }, [fetchPlotsFromSheet]);

  const metrics = useMemo(() => {
    const total = plots.length;
    const sold = plots.filter(p => p.status === 'Sold').length;
    const available = plots.filter(p => p.status === 'Available').length;
    const booked = plots.filter(p => p.status === 'Booked').length;
    
    let totalExpected = 0;
    let totalReceived = 0;

    plots.forEach(p => {
      totalExpected += Number(p.financials.finalValue) || 0;
      const received = p.financials.paymentHistory.reduce((sum, pay) => sum + Number(pay.amount), 0);
      totalReceived += received;
    });

    return { total, sold, available, booked, totalExpected, totalReceived };
  }, [plots]);

  const handleSyncToSheets = async () => {
    setSyncing(true);
    try {
      const payload = plots.filter(p => p.client.name !== '').map(p => {
         const rcvCheque = p.financials.paymentHistory.filter(ph=>ph.mode==='Cheque').reduce((s,x)=>s+Number(x.amount),0);
         const rcvCash = p.financials.paymentHistory.filter(ph=>ph.mode==='Cash').reduce((s,x)=>s+Number(x.amount),0);
         const serializedDocs = serializeDocumentsColumn(p.client.documents || []);

         return [
           p.plotNo, p.client.name, p.client.city, p.areaSqM, p.areaSqFt, 
           p.financials.ratePerSqFt, p.financials.finalValue, 
           p.financials.expectedCheque, p.financials.expectedCash, 
           rcvCheque, rcvCash, rcvCheque+rcvCash, 
           p.financials.expectedCheque - rcvCheque, 
           p.financials.expectedCash - rcvCash,
           p.financials.finalValue - (rcvCheque+rcvCash),
           serializedDocs // Column P
         ];
      });
      
      if (plotsUrl && plotsUrl.includes('script.google.com')) {
        await fetch(plotsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        
        setIsConnected(true);
        setLastSynced(new Date());
        setToast({ show: true, message: 'Plots synced successfully to Google Sheets!', type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
      } else {
        setToast({ show: true, message: 'Invalid URL. Please open the Settings to verify your Web App Link.', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
      }
    } catch (error) {
       // Suppress stack trace on sync failure
       setIsConnected(false);
       setToast({ show: true, message: 'Offline sync failed. Check your network or Webapp deployment.', type: 'error' });
       setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    }
    setSyncing(false);
  };

  const handleSavePlot = (updatedPlot) => {
    setPlots(plots.map(p => p.id === updatedPlot.id ? updatedPlot : p));
    setSelectedPlot(null);
  };

  const saveConnectorUrls = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updatedPlotsUrl = fd.get('plots_webhook').trim();
    const updatedFolderId = fd.get('drive_folder_id').trim();
    const updatedMapsFolderId = fd.get('maps_folder_id').trim();
    
    setPlotsUrl(updatedPlotsUrl);
    setDriveFolderId(updatedFolderId);
    setMapsFolderId(updatedMapsFolderId);
    
    localStorage.setItem('plots_webhook', updatedPlotsUrl);
    localStorage.setItem('drive_folder_id', updatedFolderId);
    localStorage.setItem('maps_folder_id', updatedMapsFolderId);
    setShowSettings(false);
    
    setToast({ show: true, message: 'Webhook connectors successfully configured!', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col print:hidden shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <MapPin className="text-blue-400" size={28} />
          <h1 className="text-xl font-bold tracking-tight">PlotMaster Pro</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} text="Dashboard & Map" />
          <SidebarBtn active={activeTab === 'plots'} onClick={() => { setActiveTab('plots'); setSelectedPlot(null); }} icon={<Map size={20} />} text="Plot Directory" />
          <SidebarBtn active={activeTab === 'enquiries'} onClick={() => setActiveTab('enquiries')} icon={<Users size={20} />} text="Enquiries & Leads" />
          <SidebarBtn active={activeTab === 'report'} onClick={() => setActiveTab('report')} icon={<BarChart size={20} />} text="Project Report" />
          <SidebarBtn active={activeTab === 'expenditure'} onClick={() => setActiveTab('expenditure')} icon={<Wallet size={20} />} text="Project Expenditure" />
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-auto bg-slate-50/50 print:bg-white print:overflow-visible">
        
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center print:hidden sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            {isConnected !== null && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
                {isConnected ? 'Cloud Connected' : 'Local Sandbox Mode'}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Sheet Configuration Settings"
              type="button"
            >
              <Settings size={20} />
            </button>
            {activeTab === 'plots' && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => fetchPlotsFromSheet(false)}
                  disabled={fetching}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  title="Fetch current data from sheet"
                  type="button"
                >
                  <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
                  {fetching ? "Fetching..." : "Fetch Latest"}
                </button>
                <div className="flex flex-col items-end">
                  <button 
                    onClick={handleSyncToSheets}
                    disabled={syncing}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
                    type="button"
                  >
                     <CloudUpload size={18} />
                     {syncing ? 'Syncing...' : 'Sync to Sheet'}
                  </button>
                  {lastSynced && (
                    <span className="text-[10px] text-slate-500 font-medium mt-1">
                      Last synced: {lastSynced.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="text-sm font-medium text-slate-500 border-l border-slate-300 pl-4">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 relative">
          
          {/* TOAST NOTIFICATION */}
          {toast.show && (
            <div className={`fixed top-4 right-8 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in duration-300 text-white font-medium z-50 ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'warning' ? 'bg-amber-600' : 'bg-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
              {toast.message}
            </div>
          )}

          {/* Unified Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50">
                  <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                    <Settings size={22} className="text-slate-500" /> System Settings
                  </h3>
                  <button type="button" onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-8 flex-1">
                  
                  {/* Webhook Configuration Section */}
                  <form id="settingsForm" onSubmit={saveConnectorUrls} className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 border-b pb-2 uppercase tracking-wide">Data & File Connections</h4>
                    <p className="text-sm text-slate-500 mb-4">
                      Configure your Google Apps Script deployment endpoints to sync dashboard data to Google Sheets.
                    </p>
                    <FormInput name="plots_webhook" label="Plots & Ledger Web App URL" required defaultValue={plotsUrl} placeholder="https://script.google.com/macros/s/.../exec" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput name="drive_folder_id" label="Drive Master Folder ID (Client Docs)" defaultValue={driveFolderId} placeholder="e.g. 1a2b3c..." />
                      <FormInput name="maps_folder_id" label="Plot Maps Folder ID (For Auto-Syncing)" defaultValue={mapsFolderId} placeholder="e.g. XYZ987..." />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4 flex items-start gap-3">
                      <ImageIcon className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <h5 className="text-sm font-bold text-blue-900">Auto-Assign Plot Map Images</h5>
                        <p className="text-xs text-blue-700 mt-1 mb-3 leading-relaxed">
                          Enter your specific <strong>Plot Maps Folder ID</strong> above, then click the button below. The app will locate files named "Plot 1.png", "Plot 2.png", etc., from that folder and permanently assign them to the correct plots.
                        </p>
                        <button 
                          type="button"
                          onClick={syncPlotMapsFromDrive}
                          disabled={syncingMaps}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-colors"
                        >
                          <RefreshCw size={16} className={syncingMaps ? "animate-spin" : ""} />
                          {syncingMaps ? "Scanning Drive Folder..." : "Sync Map Images from Drive"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowSettings(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" form="settingsForm" className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 shadow-md transition-colors">Save All Configurations</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard metrics={metrics} plots={plots} onSelectPlot={(p) => { setSelectedPlot(p); setActiveTab('plots'); }} />
          )}
          {activeTab === 'plots' && !selectedPlot && (
            <PlotDirectory plots={plots} onSelectPlot={setSelectedPlot} />
          )}
          {activeTab === 'plots' && selectedPlot && (
            <PlotEditor plot={selectedPlot} onSave={handleSavePlot} onCancel={() => setSelectedPlot(null)} />
          )}
          {activeTab === 'enquiries' && (
            <EnquiryManager enquiries={enquiries} setEnquiries={setEnquiries} plots={plots} />
          )}
          {activeTab === 'report' && (
            <ProjectReport plots={plots} metrics={metrics} />
          )}
          {activeTab === 'expenditure' && (
            <ExpenditureManager expenditures={expenditures} setExpenditures={setExpenditures} setToast={setToast} />
          )}
        </main>
      </div>
    </div>
  );
}
