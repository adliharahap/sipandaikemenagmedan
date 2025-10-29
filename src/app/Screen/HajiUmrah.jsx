"use client";
import { useTheme } from "next-themes";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// --- 1. Ikon SVG Kustom ---
const HajiIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.746-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21" /> </svg>
);
const UsersGroupIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.519 2.27A9.094 9.094 0 0112 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 00-4.682-2.72m7.519 2.27c.459.083.92.146 1.395.192 1.02.087 2.07.14 3.15.14 1.08 0 2.13-.053 3.15-.14a2.25 2.25 0 011.664 2.284 2.25 2.25 0 01-1.664 2.284c-1.02.087-2.07.14-3.15.14-1.08 0-2.13-.053-3.15-.14a2.25 2.25 0 01-1.664-2.284 2.25 2.25 0 011.664-2.284zM12 14.25a3 3 0 100-6 3 3 0 000 6z" /> </svg>
);
const TrendUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /> </svg>
);
const EducationIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" /> </svg>
);
const BriefcaseIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.981a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 01.996-1.884l7.468-4.48a2.25 2.25 0 012.51 0l7.468 4.48a2.25 2.25 0 01.996 1.884z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M18 19.5v-9.75a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 9.75v9.75" /> </svg>
);
const CheckBadgeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>
);
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg>
);
const PieIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /> </svg>);
const BarIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m0 0V14.25m1.085-1.085l1.085 1.085m0 0l1.085-1.085m-1.085 1.085l-1.085-1.085m0 0V14.25m-6.75 2.25h6.75" /> </svg>);

// --- 2. Data Haji & Umrah ---
const dataKuota = [{ tahun: 2021, kuota: 0 }, { tahun: 2022, kuota: 0 }, { tahun: 2023, kuota: 1302 }, { tahun: 2024, kuota: 2520 }, { tahun: 2025, kuota: 2635 },];
const totalKuota = dataKuota.reduce((sum, item) => sum + item.kuota, 0);
const dataTunggu = { total: 43702, lk: 18589, pr: 25113, pendidikan: [{ name: "SD/MI", value: 2783 }, { name: "SMP/MTs", value: 2969 }, { name: "SLTA/MA", value: 12316 }, { name: "Diploma", value: 2916 }, { name: "S1", value: 18337 }, { name: "S2", value: 4082 }, { name: "S3", value: 299 },], usia: [{ name: "<20", value: 1148 }, { name: "20-39", value: 10394 }, { name: "40-59", value: 24116 }, { name: "60-79", value: 7924 }, { name: ">=80", value: 122 },], pekerjaan: [{ name: "ASN", value: 7523 }, { name: "TNI/POLRI", value: 817 }, { name: "Pedagang", value: 3691 }, { name: "Nelayan/Petani", value: 315 }, { name: "Swasta", value: 12723 }, { name: "IRT", value: 10809 }, { name: "Pelajar/Mhs", value: 3653 }, { name: "BUMN/D", value: 2653 }, { name: "Pensiunan", value: 1015 }, { name: "Lainnya", value: 298 },], pengalaman: { sudah: 1526, belum: 4931 }, };
const dataHajiBerangkat = { total: 6457, lk: 2475, pr: 3982, pendidikan: [{ name: "SD/MI", value: 2783 }, { name: "SMP/MTs", value: 2969 }, { name: "SLTA/MA", value: 12316 }, { name: "Diploma", value: 2916 }, { name: "S1", value: 18337 }, { name: "S2", value: 4082 }, { name: "S3", value: 299 },], usia: [{ name: "<20", value: 1148 }, { name: "20-39", value: 10394 }, { name: "40-59", value: 24116 }, { name: "60-79", value: 7924 }, { name: ">=80", value: 122 },], pekerjaan: [{ name: "ASN", value: 7523 }, { name: "TNI/POLRI", value: 817 }, { name: "Pedagang", value: 3691 }, { name: "Nelayan/Petani", value: 315 }, { name: "Swasta", value: 12723 }, { name: "IRT", value: 10809 }, { name: "Pelajar/Mhs", value: 3658 }, { name: "BUMN/D", value: 2653 }, { name: "Pensiunan", value: 1015 }, { name: "Lainnya", value: 298 },], pengalaman: { sudah: 2475, belum: 3982 }, };
const dataPendaftarBaru = { total: 3965, lk: 1716, pr: 2249, pendidikan: [{ name: "SD/MI", value: 182 }, { name: "SMP/MTs", value: 216 }, { name: "SLTA/MA", value: 913 }, { name: "Diploma", value: 317 }, { name: "S1", value: 1832 }, { name: "S2", value: 442 }, { name: "S3", value: 48 },], usia: [{ name: "<20", value: 990 }, { name: "20-39", value: 2319 }, { name: "40-59", value: 1628 }, { name: "60-79", value: 137 }, { name: ">=80", value: 0 },], pekerjaan: [{ name: "ASN", value: 562 }, { name: "TNI/POLRI", value: 67 }, { name: "Pedagang", value: 352 }, { name: "Nelayan/Petani", value: 36 }, { name: "Swasta", value: 1185 }, { name: "IRT", value: 761 }, { name: "Pelajar/Mhs", value: 553 }, { name: "BUMN/D", value: 260 }, { name: "Pensiunan", value: 66 }, { name: "Lainnya", value: 123 },], pengalaman: { sudah: 3665, belum: 300 }, };
const dataLain = { pembatalan: 233, petugas: 0, pasporHaji: 0, pasporUmrah: 0, pihk: 0, ppiu: 0, kbihu: 0, };

// Warna untuk chart
const GENDER_COLORS = ["#60A5FA", "#F87171"];
const PENGALAMAN_COLORS = ["#a78bfa", "#818cf8"]; // Ungu muda, Indigo muda

// Kolom CSV
const kuotaColumns = [{ header: 'Tahun', key: 'tahun' }, { header: 'Kuota', key: 'kuota', align: 'right' }];
const genderColumns = [{ header: 'Jenis Kelamin', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];
const pendidikanColumns = [{ header: 'Pendidikan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];
const usiaColumns = [{ header: 'Rentang Usia', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];
const pekerjaanColumns = [{ header: 'Pekerjaan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];
const pengalamanColumns = [{ header: 'Pengalaman', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];

// --- 3. Komponen Angka Animasi ---
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => { if (isInView && ref.current) { animate(0, value, { duration: 1.5, ease: "easeOut", onUpdate: (latest) => { if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString('id-ID'); }, }); } }, [isInView, value]);
  return <span ref={ref}>0</span>;
};

// --- 4. Komponen Kartu KPI (Gaya Ungu) ---
// --- AWAL PERUBAHAN: Warna KPI ---
const KpiCard = ({ icon, title, value, color, theme }) => {
  const cardVariant = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const cardBgColor = theme === 'dark' ? 'rgba(55, 30, 99, 0.5)' : 'rgba(237, 233, 254, 0.6)'; // Ungu gelap/Lavender transparan
  const cardBorderColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(109, 40, 217, 0.3)'; // Border ungu

  return (<motion.div variants={cardVariant} className="relative w-full overflow-hidden rounded-lg p-5 backdrop-blur-md border shadow-sm" style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}66 0%, ${color}99 100%)` }}>
        {React.cloneElement(icon, { style: { color: theme === 'dark' ? '#c4b5fd' : '#4c1d95' }, className: "w-5 h-5" })}
      </div>
      <div>
        <h3 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>{title}</h3>
        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ color: color }}> <AnimatedNumber value={value} /> </p>
      </div>
    </div>
  </motion.div>);
};
// --- AKHIR PERUBAHAN ---

// --- 5. Komponen Kartu Chart (Gaya Ungu) ---
// --- AWAL PERUBAHAN: Warna ChartCard ---
const ChartCard = ({
  title,
  csvData,
  csvFilename,
  csvColumns,
  chartType = 'pie',
  allowToggle = false,
  currentView,
  onToggle,
  className = ""
}) => {
  const { theme } = useTheme();
  const itemVariant = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };
  const handleDownloadCSV = () => { /* ... fungsi download CSV sama ... */
    if (!csvData || csvData.length === 0 || !csvColumns || csvColumns.length === 0) return;
    const headers = csvColumns.map(col => col.header); const keys = csvColumns.map(col => col.key);
    let csvContent = "data:text/csv;charset=utf-8,"; csvContent += headers.join(",") + "\n";
    csvData.forEach(row => { const rowValues = keys.map(key => { let val = row[key]; val = val === null || val === undefined ? '' : val; if (typeof val === 'string' && val.includes(',')) return `"${val}"`; return val; }); csvContent += rowValues.join(",") + "\n"; });
    const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", csvFilename || "data.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const cardBgColor = theme === 'dark' ? 'rgba(40, 21, 71, 0.4)' : 'rgba(245, 243, 255, 0.5)'; // Ungu sangat gelap/Lavender sangat terang transparan
  const cardBorderColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(109, 40, 217, 0.2)';
  const legendColor = theme === 'dark' ? '#a78bfa' : '#6d28d9'; // Ungu muda/Ungu tua untuk legenda
  const textLabelColor = theme === 'dark' ? '#c4b5fd' : '#5b21b6'; // Warna teks label ungu
  const gridColor = theme === 'dark' ? '#5b21b6' : '#c4b5fd'; // Warna grid ungu

  const ToggleButton = ({ type, Icon }) => (
    <button
      onClick={() => onToggle(type)}
      className={`p-1 rounded ${currentView === type
        ? (theme === 'dark' ? 'bg-purple-800/70 text-purple-100' : 'bg-purple-100 text-purple-800')
        : (theme === 'dark' ? 'text-gray-500 hover:bg-gray-700/40 hover:text-purple-300' : 'text-gray-400 hover:bg-gray-100/50 hover:text-purple-700')
        } transition-colors`}
      aria-label={`Ubah ke ${type} chart`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <motion.div variants={itemVariant} className={`rounded-lg backdrop-blur-sm border overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
      <div className="p-4 sm:p-5">
        <h3 className={`text-md font-semibold mb-3 ${theme === 'dark' ? 'text-purple-100' : 'text-purple-900'}`}> {title} </h3>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {allowToggle && (
            <div className="flex space-x-1 p-0.5 rounded backdrop-blur-sm order-1 sm:order-none" style={{ backgroundColor: theme === 'dark' ? 'rgba(67, 30, 131, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}>
              <ToggleButton type="pie" Icon={PieIcon} />
              <ToggleButton type="bar" Icon={BarIcon} />
            </div>
          )}
          <button onClick={handleDownloadCSV} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border order-2 sm:order-none ${theme === 'dark' ? 'bg-purple-900/40 border-purple-700/60 text-purple-300 hover:bg-purple-800/50 hover:border-purple-600/60' : 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100'}`} >
            <DownloadIcon className="w-3 h-3" /> Download CSV
          </button>
        </div>
        <div className="h-56 sm:h-64 min-w-0">
          {currentView === 'pie' && chartType !== 'line' && chartType !== 'bar-only' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={csvData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%">
                  {csvData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color || GENDER_COLORS[index % GENDER_COLORS.length]} />))}
                </Pie>
                <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {(currentView === 'bar' || chartType === 'bar-only') && chartType !== 'line' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={csvData} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 10 }} width={55} interval={0} />
                <Tooltip content={<CustomTooltip theme={theme} chartType="bar" />} />
                <Bar dataKey="value" name="Jumlah">
                  {csvData.map((entry, index) => {
                    let colors;
                    if (chartType === 'pendidikan') colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#6B7280'];
                    else if (chartType === 'usia') colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#A78BFA'];
                    else colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#6B7280', '#fbbf24', '#f87171', '#9ca3af'];
                    return <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {chartType === 'line' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={csvData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  {/* Definisikan Gradien Ungu */}
                  <linearGradient id="colorKuotaArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="tahun" tick={{ fill: textLabelColor, fontSize: 12 }} />
                <YAxis tick={{ fill: textLabelColor, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip theme={theme} chartType="area" />} />
                <Area type="monotone" dataKey="kuota" name="Kuota Haji" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorKuotaArea)" activeDot={{ r: 8 }} dot={{ stroke: '#8b5cf6', strokeWidth: 1, r: 4, fill: theme === 'dark' ? '#3730A3' : '#EDE9FE' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
};
// --- AKHIR PERUBAHAN ---

// --- 6. Komponen Tombol Filter (Tabs Style Ungu) ---
const FilterTabs = ({ tabs, activeTab, setActiveTab, theme }) => {
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
  };

  const FilterButton = ({ text, onClick, isActive, theme }) => (
    <motion.button
      onClick={onClick}
      className={`
        relative min-w-[110px] flex-none sm:min-w-[120px] px-4 py-2 rounded-full font-medium transition-colors duration-300
        ${isActive
          ? 'text-white'
          : theme === 'dark'
            ? 'text-gray-400 hover:text-purple-200'
            : 'text-gray-600 hover:text-purple-800'
        }
      `}
      whileTap={{ scale: 0.95 }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {isActive && (
        <motion.div
          layoutId="filter-bubble-haji"
          className={`absolute inset-0 ${theme === 'dark'
            ? 'bg-gradient-to-r from-purple-700 to-indigo-800 shadow-md'
            : 'bg-gradient-to-r from-purple-100 to-indigo-200 shadow-sm'
            } rounded-full z-0`}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
      <span className="relative z-10 text-sm sm:text-base text-center">{text}</span>
    </motion.button>
  );

  return (
    <motion.div
      className={`
        flex flex-wrap justify-center gap-2 sm:gap-4 p-2 rounded-full mb-12
        ${theme === 'dark' ? 'bg-[#2E1A47]/50 border border-[#4B2C66]/50' : 'bg-white/50 border border-gray-200/50'}
      `}
      variants={itemVariant}
      initial="hidden"
      animate="show"
    >
      {tabs.map((tab) => (
        <FilterButton
          key={tab.key}
          text={tab.text}
          onClick={() => setActiveTab(tab.key)}
          isActive={activeTab === tab.key}
          theme={theme}
        />
      ))}
    </motion.div>
  );
};
// --- AKHIR PERUBAHAN ---


// --- 7. Komponen Tooltip Kustom ---
const CustomTooltip = ({ active, payload, label, theme, chartType = 'pie' }) => {
  if (active && payload && payload.length) {
    const data = payload[0]; const item = data.payload.payload || data.payload; const name = label || item.name; const value = data.value;
    // --- AWAL PERUBAHAN: Warna Tooltip ---
    return (<div className={`rounded-md p-2.5 shadow-lg backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
      {/* --- AKHIR PERUBAHAN --- */}
      <p className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</p>
      {(chartType === 'area' || chartType === 'line') && payload.map((p, index) => (
        <p key={index} className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Kuota: {p.value.toLocaleString('id-ID')} </p>
      ))}
      {chartType !== 'line' && chartType !== 'area' && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Jumlah: {value.toLocaleString('id-ID')} </p>
      )}
      {chartType === 'pie' && item.percent && (<p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Persentase: {(item.percent * 100).toFixed(1)}% </p>)}
    </div>);
  } return null;
};

// --- 8. Komponen Utama HajiUmrah ---
const HajiUmrah = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('kuota');

  const [tungguGenderView, setTungguGenderView] = useState('pie');
  const [tungguPengalamanView, setTungguPengalamanView] = useState('pie');
  const [berangkatGenderView, setBerangkatGenderView] = useState('pie');
  const [berangkatPengalamanView, setBerangkatPengalamanView] = useState('pie');
  const [baruGenderView, setBaruGenderView] = useState('pie');
  const [baruPengalamanView, setBaruPengalamanView] = useState('pie');

  const filters = [{ key: 'kuota', text: 'Kuota Haji' }, { key: 'tunggu', text: 'Jemaah Tunggu' }, { key: 'berangkat', text: 'Jemaah Berangkat' }, { key: 'baru', text: 'Pendaftar Baru' }, { key: 'lain', text: 'Lain-lain' }];
  const containerVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } } };
  const itemVariant = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
  const chartSectionVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } } };

  // --- AWAL PERUBAHAN: Background Ungu ---
  const backgroundStyle = theme === 'dark'
    ? { background: 'linear-gradient(180deg, #1a0a33 0%, #30125c 100%)' } // Ungu sangat gelap ke ungu gelap
    : { background: 'linear-gradient(180deg, #f5f3ff 0%, #e9d5ff 100%)' }; // Lavender sangat terang ke lavender
  // --- AKHIR PERUBAHAN ---


  return (
    <motion.div id="haji-umrah" className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={backgroundStyle} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={containerVariant} >
      {/* --- AWAL PERUBAHAN: Warna Elemen Dekoratif --- */}
      <div className={`absolute top-0 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/3 ${theme === 'dark' ? 'bg-purple-800' : 'bg-purple-200'}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-15 translate-x-1/2 translate-y-1/3 ${theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-100'}`}></div>
      {/* --- AKHIR PERUBAHAN --- */}

      <div className="mx-auto md:mx-12 relative z-10">
        <motion.div className="text-center mb-10" variants={itemVariant} >
          {/* --- AWAL PERUBAHAN: Warna Judul --- */}
          <h2 style={{ lineHeight: '1.2' }} className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r pb-2 ${theme === 'dark' ? 'from-purple-300 to-indigo-400' : 'from-purple-600 to-indigo-700'}`}> Haji & Umrah </h2>
          <p className={`mt-3 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> Statistik Kuota, Jemaah Tunggu, Jemaah Berangkat, dan Pendaftar Baru Haji Kota Medan. </p>
          {/* --- AKHIR PERUBAHAN --- */}
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8" variants={containerVariant}>
          {/* --- AWAL PERUBAHAN: Warna KPI --- */}
          <KpiCard title="Kuota Haji 2025" value={dataKuota.find(d => d.tahun === 2025)?.kuota || 0} icon={<TrendUpIcon />} color={theme === 'dark' ? "#a78bfa" : "#8b5cf6"} theme={theme} />
          <KpiCard title="Jemaah Tunggu" value={dataTunggu.total} icon={<UsersGroupIcon />} color={theme === 'dark' ? "#c084fc" : "#a855f7"} theme={theme} />
          <KpiCard title="Jemaah Berangkat (Total*)" value={dataHajiBerangkat.total} icon={<HajiIcon />} color={theme === 'dark' ? "#e9d5ff" : "#7e22ce"} theme={theme} />
          <KpiCard title="Pendaftar Baru (Total*)" value={dataPendaftarBaru.total} icon={<UsersGroupIcon />} color={theme === 'dark' ? "#ddd6fe" : "#6d28d9"} theme={theme} />
          {/* --- AKHIR PERUBAHAN --- */}
        </motion.div>

        <motion.div variants={itemVariant}>
          <FilterTabs tabs={filters} activeTab={filter} setActiveTab={setFilter} theme={theme} />
        </motion.div>

        <AnimatePresence mode="wait">
          {filter === 'kuota' && (
            <motion.div key="kuota" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="mt-6">
              <ChartCard title={`Tren Kuota Haji (${dataKuota[0].tahun}-${dataKuota[dataKuota.length - 1].tahun})`} csvData={dataKuota} csvColumns={kuotaColumns} csvFilename="kuota_haji.csv" chartType="line">
                {/* Line Chart */}
              </ChartCard>
            </motion.div>
          )}
          {filter === 'tunggu' && (
            <motion.div key="tunggu" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title={`Jemaah Tunggu per Jenis Kelamin (${dataTunggu.total})`} csvData={[{ name: 'Laki-laki', value: dataTunggu.lk, color: GENDER_COLORS[0] }, { name: 'Perempuan', value: dataTunggu.pr, color: GENDER_COLORS[1] }]} csvColumns={genderColumns} csvFilename="tunggu_gender.csv" allowToggle={true} currentView={tungguGenderView} onToggle={setTungguGenderView} chartType="gender" />
              <ChartCard title="Jemaah Tunggu per Pendidikan" csvData={dataTunggu.pendidikan} csvColumns={pendidikanColumns} csvFilename="tunggu_pendidikan.csv" chartType="pendidikan" currentView="bar" allowToggle={false} />
              <ChartCard title="Jemaah Tunggu per Usia" csvData={dataTunggu.usia} csvColumns={usiaColumns} csvFilename="tunggu_usia.csv" chartType="usia" currentView="bar" allowToggle={false} />
              <ChartCard title="Jemaah Tunggu per Pekerjaan" csvData={dataTunggu.pekerjaan} csvColumns={pekerjaanColumns} csvFilename="tunggu_pekerjaan.csv" chartType="pekerjaan" currentView="bar" allowToggle={false} />
              <ChartCard title={`Jemaah Tunggu per Pengalaman Haji`} csvData={[{ name: 'Sudah', value: dataTunggu.pengalaman.sudah, color: PENGALAMAN_COLORS[0] }, { name: 'Belum', value: dataTunggu.pengalaman.belum, color: PENGALAMAN_COLORS[1] }]} csvColumns={pengalamanColumns} csvFilename="tunggu_pengalaman.csv" allowToggle={true} currentView={tungguPengalamanView} onToggle={setTungguPengalamanView} chartType="pengalaman" />
            </motion.div>
          )}
          {filter === 'berangkat' && (
            <motion.div key="berangkat" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title={`Jemaah Berangkat per Jenis Kelamin (${dataHajiBerangkat.total})`} csvData={[{ name: 'Laki-laki', value: dataHajiBerangkat.lk, color: GENDER_COLORS[0] }, { name: 'Perempuan', value: dataHajiBerangkat.pr, color: GENDER_COLORS[1] }]} csvColumns={genderColumns} csvFilename="berangkat_gender.csv" allowToggle={true} currentView={berangkatGenderView} onToggle={setBerangkatGenderView} chartType="gender" />
              <ChartCard title="Jemaah Berangkat per Pendidikan" csvData={dataHajiBerangkat.pendidikan} csvColumns={pendidikanColumns} csvFilename="berangkat_pendidikan.csv" chartType="pendidikan" currentView="bar" allowToggle={false} />
              <ChartCard title="Jemaah Berangkat per Usia" csvData={dataHajiBerangkat.usia} csvColumns={usiaColumns} csvFilename="berangkat_usia.csv" chartType="usia" currentView="bar" allowToggle={false} />
              <ChartCard title="Jemaah Berangkat per Pekerjaan" csvData={dataHajiBerangkat.pekerjaan} csvColumns={pekerjaanColumns} csvFilename="berangkat_pekerjaan.csv" chartType="pekerjaan" currentView="bar" allowToggle={false} />
              <ChartCard title={`Jemaah Berangkat per Pengalaman Haji`} csvData={[{ name: 'Sudah', value: dataHajiBerangkat.pengalaman.sudah, color: PENGALAMAN_COLORS[0] }, { name: 'Belum', value: dataHajiBerangkat.pengalaman.belum, color: PENGALAMAN_COLORS[1] }]} csvColumns={pengalamanColumns} csvFilename="berangkat_pengalaman.csv" allowToggle={true} currentView={berangkatPengalamanView} onToggle={setBerangkatPengalamanView} chartType="pengalaman" />
            </motion.div>
          )}
          {filter === 'baru' && (
            <motion.div key="baru" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title={`Pendaftar Baru per Jenis Kelamin (${dataPendaftarBaru.total})`} csvData={[{ name: 'Laki-laki', value: dataPendaftarBaru.lk, color: GENDER_COLORS[0] }, { name: 'Perempuan', value: dataPendaftarBaru.pr, color: GENDER_COLORS[1] }]} csvColumns={genderColumns} csvFilename="baru_gender.csv" allowToggle={true} currentView={baruGenderView} onToggle={setBaruGenderView} chartType="gender" />
              <ChartCard title="Pendaftar Baru per Pendidikan" csvData={dataPendaftarBaru.pendidikan} csvColumns={pendidikanColumns} csvFilename="baru_pendidikan.csv" chartType="pendidikan" currentView="bar" allowToggle={false} />
              <ChartCard title="Pendaftar Baru per Usia" csvData={dataPendaftarBaru.usia} csvColumns={usiaColumns} csvFilename="baru_usia.csv" chartType="usia" currentView="bar" allowToggle={false} />
              <ChartCard title="Pendaftar Baru per Pekerjaan" csvData={dataPendaftarBaru.pekerjaan} csvColumns={pekerjaanColumns} csvFilename="baru_pekerjaan.csv" chartType="pekerjaan" currentView="bar" allowToggle={false} />
              <ChartCard title={`Pendaftar Baru per Pengalaman Haji`} csvData={[{ name: 'Sudah Berhaji', value: dataPendaftarBaru.pengalaman.sudah, color: PENGALAMAN_COLORS[0] }, { name: 'Belum Berhaji', value: dataPendaftarBaru.pengalaman.belum, color: PENGALAMAN_COLORS[1] }]} csvColumns={pengalamanColumns} csvFilename="baru_pengalaman.csv" allowToggle={true} currentView={baruPengalamanView} onToggle={setBaruPengalamanView} chartType="pengalaman" />
            </motion.div>
          )}
          {filter === 'lain' && (
            <motion.div key="lain" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* --- AWAL PERUBAHAN: Warna KPI Lain --- */}
              <KpiCard title="Pembatalan Haji" value={dataLain.pembatalan} icon={<HajiIcon />} color={theme === 'dark' ? "#FCA5A5" : "#DC2626"} theme={theme} />
              <KpiCard title="Petugas Haji" value={dataLain.petugas} icon={<UsersGroupIcon />} color={theme === 'dark' ? "#a5b4fc" : "#4f46e5"} theme={theme} />
              <KpiCard title="Paspor Haji Diterbitkan" value={dataLain.pasporHaji} icon={<CheckBadgeIcon />} color={theme === 'dark' ? "#a5b4fc" : "#4f46e5"} theme={theme} />
              <KpiCard title="Paspor Umrah Diterbitkan" value={dataLain.pasporUmrah} icon={<CheckBadgeIcon />} color={theme === 'dark' ? "#a5b4fc" : "#4f46e5"} theme={theme} />
              <KpiCard title="PIHK" value={dataLain.pihk} icon={<BriefcaseIcon />} color={theme === 'dark' ? "#93c5fd" : "#2563eb"} theme={theme} />
              <KpiCard title="PPIU" value={dataLain.ppiu} icon={<BriefcaseIcon />} color={theme === 'dark' ? "#93c5fd" : "#2563eb"} theme={theme} />
              <KpiCard title="KBIHU" value={dataLain.kbihu} icon={<BriefcaseIcon />} color={theme === 'dark' ? "#93c5fd" : "#2563eb"} theme={theme} />
              {/* --- AKHIR PERUBAHAN --- */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default HajiUmrah;

