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
  AreaChart,
  Area,
} from "recharts";
// Import useSelector untuk mengambil data dari Redux
import { useSelector } from "react-redux";

// --- 1. Ikon SVG Kustom ---
const ReligionIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.519 2.27A9.094 9.094 0 0112 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 00-4.682-2.72m7.519 2.27c.459.083.92.146 1.395.192 1.02.087 2.07.14 3.15.14 1.08 0 2.13-.053 3.15-.14a2.25 2.25 0 011.664 2.284 2.25 2.25 0 01-1.664 2.284c-1.02.087-2.07.14-3.15.14-1.08 0-2.13-.053-3.15-.14a2.25 2.25 0 01-1.664-2.284 2.25 2.25 0 011.664-2.284zM12 14.25a3 3 0 100-6 3 3 0 000 6z" /> </svg>
);
const MosqueIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 21v-5.25a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25V21M3 3v.001M3 6v.001M3 9v.001M3 12v.001M3 15v.001M21 3v.001M21 6v.001M21 9v.001M21 12v.001M21 15v.001M12 21v-3.75a.75.75 0 00-.75-.75H12a.75.75 0 00-.75.75V21m-2.25 0v-3.75a.75.75 0 00-.75-.75H9a.75.75 0 00-.75.75V21m6 0v-3.75a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75V21m-6-15.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75V5.25zM15 5.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V5.25z" />
    </svg>
);
const CounselorIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /> </svg>
);
const KuaIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /> </svg>
);
const LandIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 6h18M3 9h18M3 12h18" /> </svg>
);
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg>
);
const PieIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);
const BarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m0 0V14.25m1.085-1.085l1.085 1.085m0 0l1.085-1.085m-1.085 1.085l-1.085-1.085m0 0V14.25m-6.75 2.25h6.75" />
    </svg>
);
const BookOpenIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
    </svg>
);
const NoSymbolIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);
const ArchiveBoxIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);
const ShieldCheckIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
);

// --- 2. Kolom Tabel ---
const pendudukAgamaColumns = [ { header: 'Agama', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const rumahIbadahColumns = [ { header: 'Jenis', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const tipologiMasjidColumns = [ { header: 'Tipologi', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const penyuluhAgamaColumns = [ { header: 'Agama', key: 'name' }, { header: 'PNS', key: 'pns', align: 'right' }, { header: 'PPPK', key: 'pppk', align: 'right' }, { header: 'Non ASN', key: 'nonasn', align: 'right' }, { header: 'Total', key: 'total', align: 'right' }, ];
const kuaTipologiColumns = [ { header: 'Tipologi', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const penghuluJabatanColumns = [ { header: 'Jabatan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const nikahBulanColumns = [ { header: 'Bulan', key: 'bulan' }, { header: 'Jumlah Nikah', key: 'total', align: 'right' }, ];
const tanahWakafPemanfaatanColumns = [ { header: 'Pemanfaatan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const penyuluhTunjanganColumns = [ { header: 'Agama', key: 'name' }, { header: 'Penerima Tunjangan', key: 'value', align: 'right' }, ];
const sasaranPenyuluhanColumns = [ { header: 'Agama', key: 'name' }, { header: 'Jumlah Sasaran', key: 'value', align: 'right' }, ];
const penyuluhDetailColumns = [ { header: 'Agama', key: 'agama' }, { header: 'Laki-laki', key: 'laki', align: 'right' }, { header: 'Perempuan', key: 'perempuan', align: 'right' }, { header: 'Total Gender', key: 'totalGender', align: 'right' }, { header: 'ASN', key: 'asn', align: 'right' }, { header: 'Non ASN', key: 'nonAsn', align: 'right' }, { header: 'Total Status', key: 'totalStatus', align: 'right' }, ];
const nikahTempatColumns = [ { header: 'Tempat', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const peristiwaRujukColumns = [ { header: 'KUA Kecamatan', key: 'kua' }, { header: 'Jan', key: 'jan', align: 'right' }, { header: 'Feb', key: 'feb', align: 'right' }, { header: 'Mar', key: 'mar', align: 'right' }, { header: 'Apr', key: 'apr', align: 'right' }, { header: 'Mei', key: 'mei', align: 'right' }, { header: 'Jun', key: 'jun', align: 'right' }, { header: 'Total (Jan-Jun)', key: 'total', align: 'right' }, ];
const kuaTanahColumns = [ { header: 'Status Tanah', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const kuaBangunanColumns = [ { header: 'Kondisi Bangunan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const kuaRevitalisasiColumns = [ { header: 'Jenis Revitalisasi', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const bukuNikahColumns = [ { header: 'KUA Kecamatan', key: 'kua' }, { header: 'Buku Nikah', key: 'buku', align: 'right' }, { header: 'Kartu Nikah', key: 'kartu', align: 'right' }, ];
const balaiNikahColumns = [ { header: 'KUA', key: 'kua' }, { header: 'Balai Nikah', key: 'balai_nikah', align: 'right' }, { header: 'Jumlah', key: 'jumlah', align: 'right' }, ];
const penghuluPembinaanColumns = [ { header: 'Tingkat Jabatan', key: 'name' }, { header: 'Jumlah Dibina', key: 'value', align: 'right' }, ];
const kasusKonflikColumns = [ { header: 'Kecamatan', key: 'kecamatan' }, { header: 'Jumlah Konflik', key: 'konflik', align: 'right' }, { header: 'Penyelesaian', key: 'penyelesaian', align: 'right' }, ];
const kasusKonfrontatifColumns = [ { header: 'Kecamatan', key: 'kecamatan' }, { header: 'Jumlah Kasus', key: 'kasus', align: 'right' }, { header: 'Penyelesaian', key: 'penyelesaian', align: 'right' }, ];
const dialogAntarUmatColumns = [ { header: 'Kecamatan', key: 'kecamatan' }, { header: 'Jumlah Kegiatan', key: 'kegiatan', align: 'right' }, ];
const dialogInternUmatColumns = [ { header: 'Agama', key: 'agama' }, { header: 'Jumlah Kegiatan', key: 'kegiatan', align: 'right' }, ];
const qariHafidzColumns = [ { header: 'Kategori', key: 'kategori' }, { header: 'Laki-laki', key: 'lk', align: 'right' }, { header: 'Perempuan', key: 'pr', align: 'right' }, { header: 'Total', key: 'total', align: 'right' }, ];


// --- 3. Komponen Angka Animasi (Gaya Kependudukan) ---
const AnimatedNumber = ({ value, isDecimal = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    // Tampilkan nilai akhir jika tidak di viewport
    if (!isInView && ref.current) {
        ref.current.textContent = value.toLocaleString('id-ID', { 
            minimumFractionDigits: isDecimal ? 2 : 0, 
            maximumFractionDigits: isDecimal ? 2 : 0 
        });
        return;
    }
    if (isInView && ref.current) {
      animate(0, value, {
        duration: 2.0,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            if (isDecimal) {
              ref.current.textContent = latest.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
              ref.current.textContent = Math.round(latest).toLocaleString('id-ID');
            }
          }
        },
      });
    }
  }, [isInView, value, isDecimal]);

  // Tampilkan nilai awal 0 atau 0,00
  return <span ref={ref}>{isDecimal ? "0,00" : "0"}</span>;
};

// --- 4. Komponen Kartu KPI (Gaya Kependudukan) ---
const KpiCard = ({ icon, title, value, color, theme, suffix = "", isDecimal = false }) => {
  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const cardBackground = theme === 'dark' 
    ? `linear-gradient(140deg, ${color}1A 0%, #2E1A47 50%)`
    : `linear-gradient(140deg, ${color}1A 0%, #FFFFFF 50%)`;

  return (
    <motion.div
      variants={cardVariant}
      className={`relative w-full overflow-hidden rounded-2xl p-5 shadow-lg`}
      style={{ background: cardBackground }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          {React.cloneElement(icon, { style: { color: color }, className: "w-6 h-6" })}
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} style={{ color: color }}>
            <AnimatedNumber value={value} isDecimal={isDecimal} />
            {suffix && <span className="text-xl ml-1">{suffix}</span>}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- 5. Komponen Kartu Chart (Gaya Kependudukan) ---
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
  const handleDownloadCSV = () => {
    if (!csvData || csvData.length === 0 || !csvColumns || csvColumns.length === 0) return;
    const headers = csvColumns.map(col => col.header); const keys = csvColumns.map(col => col.key);
    let csvContent = "data:text/csv;charset=utf-8,"; csvContent += headers.join(",") + "\n";
    csvData.forEach(row => { const rowValues = keys.map(key => { let val = row[key]; val = val === null || val === undefined ? '' : val; if (typeof val === 'string' && val.includes(',')) return `"${val}"`; return val; }); csvContent += rowValues.join(",") + "\n"; });
    const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", csvFilename || "data.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
   };
  
  // Gaya dari Kependudukan
  const cardBgColor = theme === 'dark' ? '#2E1A47' : '#FFFFFF';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const downloadButtonColor = theme === 'dark' 
      ? 'bg-purple-500 text-gray-900 hover:bg-purple-400 focus:ring-purple-400 focus:ring-offset-gray-800' 
      : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-600 focus:ring-offset-white';
  
  const legendColor = theme === 'dark' ? '#D1D5DB' : '#374151';
  const textLabelColor = theme === 'dark' ? '#D1D5DB' : '#374151';
  const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';

  // Definisikan palet warna di dalam komponen agar 'theme' bisa diakses
  const COLORS_AGAMA = theme === 'dark' 
    ? ["#34D399", "#60A5FA", "#A78BFA", "#F59E0B", "#EF4444", "#9CA3AF"]
    : ["#059669", "#2563EB", "#7C3AED", "#D97706", "#DC2626", "#6B7280"];
  
  const COLORS_DEFAULT = theme === 'dark'
    ? ["#a78bfa", "#f472b6", "#60a5fa", "#34d399", "#f59e0b", "#9ca3af", "#ef4444", "#fcd34d"]
    : ["#7c3aed", "#db2777", "#2563eb", "#059669", "#d97706", "#6b7280", "#dc2626", "#f59e0b"];


  const getColors = (type) => {
    switch (type) {
      case 'agama': return COLORS_AGAMA;
      case 'rumah_ibadah': return COLORS_DEFAULT;
      case 'tipologi': return COLORS_DEFAULT;
      case 'penyuluh_tunjangan': return COLORS_AGAMA;
      case 'sasaran_penyuluhan': return COLORS_AGAMA;
      case 'kua': return COLORS_DEFAULT;
      case 'penghulu': return COLORS_DEFAULT;
      case 'nikah_tempat': return [COLORS_DEFAULT[1], COLORS_DEFAULT[0]];
      case 'kua_tanah': return [COLORS_DEFAULT[4], COLORS_DEFAULT[3]]; // Merah, Oranye
      case 'kua_bangunan': return [COLORS_DEFAULT[3], COLORS_DEFAULT[4], COLORS_DEFAULT[6]]; // Hijau, Oranye, Merah
      case 'kua_revitalisasi': return [COLORS_DEFAULT[2], COLORS_DEFAULT[0]]; // Biru, Ungu
      case 'wakaf_status': return [COLORS_DEFAULT[6], COLORS_DEFAULT[3]]; // Merah, Hijau
      case 'wakaf_manfaat': return COLORS_DEFAULT;
      default: return COLORS_DEFAULT;
    }
  }
  const chartColors = getColors(chartType);

  const ToggleButton = ({ type, Icon }) => (
    <button
      onClick={() => onToggle(type)}
      className={`p-1 rounded ${currentView === type
        ? (theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white')
        : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-700/40' : 'text-gray-500 hover:bg-gray-100/50')
      } transition-colors`}
      aria-label={`Ubah ke ${type} chart`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <motion.div variants={itemVariant} className={`rounded-2xl shadow-xl overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor }} >
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className={`text-md font-semibold ${titleColor}`}> {title} </h3>
          <div className="flex items-center gap-2">
            {allowToggle && (
              <div className={`flex space-x-1 p-0.5 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <ToggleButton type="pie" Icon={PieIcon} />
                <ToggleButton type="bar" Icon={BarIcon} />
              </div>
            )}
            <button onClick={handleDownloadCSV} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${downloadButtonColor}`} >
              <DownloadIcon className="w-3 h-3" /> Download CSV
            </button>
          </div>
        </div>
        <div className="h-56 sm:h-64 min-w-0">
           {/* Pie Chart */}
           {currentView === 'pie' && chartType !== 'area' && chartType !== 'bar-only' && chartType !== 'penyuluh_agama' && (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={csvData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%">
                            {csvData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            )}
            {/* Bar Chart */}
            {(currentView === 'bar' || chartType === 'bar-only' || chartType === 'penyuluh_agama') && chartType !== 'area' && (
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'penyuluh_agama' ? (
                        <BarChart data={csvData} margin={{ top: 20, right: 0, left: -30, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: textLabelColor, fontSize: 10 }} />
                            <YAxis tick={{ fill: textLabelColor, fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip theme={theme} chartType="penyuluh_agama" />} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
                            <Bar dataKey="pns" name="PNS" stackId="a" fill="#34d399" />
                            <Bar dataKey="pppk" name="PPPK" stackId="a" fill="#60a5fa" />
                            <Bar dataKey="nonasn" name="Non ASN" stackId="a" fill="#f59e0b" />
                        </BarChart>
                    ) : (
                        <BarChart data={csvData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 10 }} width={85} interval={0} />
                            <Tooltip content={<CustomTooltip theme={theme} chartType="bar" />} />
                            <Bar dataKey="value" name="Jumlah">
                                {csvData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            )}
            {/* Area Chart (untuk nikah per bulan) */}
            {chartType === 'area' && (
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={csvData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorNikahArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="bulan" tick={{ fill: textLabelColor, fontSize: 12 }} />
                        <YAxis tick={{ fill: textLabelColor, fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip theme={theme} chartType="area"/>} />
                        <Area type="monotone" dataKey="total" name="Jumlah Nikah" stroke="#a78bfa" strokeWidth={2} fillOpacity={1} fill="url(#colorNikahArea)" activeDot={{ r: 6 }} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
      </div>
    </motion.div>
  );
};

// --- 6. Komponen Tombol Filter (Gaya Kependudukan) ---
const FilterButton = ({ text, icon, onClick, isActive, theme }) => {
    const activeBg = theme === 'dark' ? 'bg-purple-600' : 'bg-purple-600';
    const activeText = theme === 'dark' ? 'text-white' : 'text-white';
    const inactiveText = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/40' : 'hover:bg-gray-100/60';

    return ( <motion.button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 relative ${isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${inactiveBgHover}`}`} whileTap={{ scale: 0.98 }} >
            {isActive && ( <motion.div layoutId="filter-highlight-keagamaan-side" className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} /> )}
            {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
            <span className="text-sm">{text}</span>
        </motion.button> );
};

// --- 7. Komponen Tooltip Kustom (Gaya Kependudukan) ---
const CustomTooltip = ({ active, payload, label, theme, chartType = 'pie' }) => {
  if (active && payload && payload.length) {
    const data = payload[0]; const item = data.payload.payload || data.payload; const name = label || item.name; const value = data.value;
    
    // Gaya dari Kependudukan
    const baseClasses = `rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#2E1A47] border border-gray-700' : 'bg-white border border-gray-200'}`;
    const titleClasses = `font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`;
    const textClasses = `text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;

    return ( <div className={baseClasses}>
        <p className={titleClasses}>{name}</p>
        {(chartType === 'area' || chartType === 'line') && payload.map((p, index) => (
             <p key={index} className={textClasses}> Jumlah: {p.value.toLocaleString('id-ID')} </p>
        ))}
        {chartType !== 'line' && chartType !== 'area' && (
            chartType === 'penyuluh_agama' ? (
                <>
                    {payload.map((p, index) => (
                        <p key={index} className={textClasses} style={{ color: p.fill }}>
                            {p.name}: {p.value.toLocaleString('id-ID')}
                        </p>
                    ))}
                    <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>
                        Total: {payload.reduce((sum, entry) => sum + entry.value, 0).toLocaleString('id-ID')}
                    </p>
                </>
            ) : (
                 <p className={textClasses}> Jumlah: {value.toLocaleString('id-ID')} </p>
            )
        )}
        {chartType === 'pie' && item.percent && ( <p className={textClasses}> Persentase: {(item.percent * 100).toFixed(1)}% </p> )}
      </div> );
  } return null;
};

// --- 8. Komponen Tabel Dinamis (Gaya Kependudukan) ---
const DynamicTable = ({ title, data, columns, theme, className = "" }) => {
    // Gaya dari Kependudukan
    const tableBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const tableBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
    const headerText = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const rowBorder = theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200';
    const rowHover = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
    const cellText = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const cellTextPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const cardBgColor = theme === 'dark' ? '#2E1A47' : '#FFFFFF';
    const cardBorderColor = 'transparent'; // No border
    const itemVariant = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };


    return (
        <motion.div variants={itemVariant} className={`rounded-2xl shadow-xl overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
            <div className="p-4 sm:p-5">
                 <h3 className={`text-md font-semibold mb-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> {title} </h3>
                 {(!data || data.length === 0) ? (
                    <p className={`text-center text-sm py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada data untuk ditampilkan pada tabel ini.</p>
                 ) : (
                    <div className={`w-full max-h-96 overflow-auto rounded-lg border ${tableBg} ${tableBorder}`}>
                        <table className={`min-w-full divide-y ${rowBorder}`}>
                            <thead className={`sticky top-0 ${headerBg} backdrop-blur-sm`}> <tr> {columns.map((col) => ( <th key={col.key} scope="col" className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${headerText} ${col.align === 'right' ? 'text-right' : 'text-left'}`}> {col.header} </th> ))} </tr> </thead>
                            <tbody className={`divide-y ${rowBorder}`}> {data.map((item, index) => ( <tr key={index} className={rowHover}> {columns.map((col) => ( <td key={col.key} className={`px-4 py-2.5 whitespace-nowrap text-sm ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.key === 'name' || col.key === 'bulan' || col.key === 'kua' || col.key === 'agama' ? cellTextPrimary : cellText}`}> {item[col.key] != null ? item[col.key].toLocaleString('id-ID') : '0'} </td> ))} </tr> ))} </tbody>
                        </table>
                    </div>
                 )}
            </div>
        </motion.div>
    );
 };


// --- 9. Komponen Utama DataKeagamaan ---
const DataKeagamaan = () => {
  const { theme } = useTheme();
  
  // --- Ambil data dari Redux Store ---
  const { data, status } = useSelector((state) => state.landingData);

  const [filter, setFilter] = useState('penduduk');

  // States untuk chart toggles
  const [pendudukChartView, setPendudukChartView] = useState('pie');
  const [rumahIbadahView, setRumahIbadahView] = useState('pie');
  const [tipologiMasjidView, setTipologiMasjidView] = useState('pie');
  const [penyuluhStatusView, setPenyuluhStatusView] = useState('bar');
  const [penyuluhTunjanganView, setPenyuluhTunjanganView] = useState('pie');
  const [sasaranPenyuluhanView, setSasaranPenyuluhanView] = useState('pie');
  const [kuaTipologiView, setKuaTipologiView] = useState('pie');
  const [penghuluJabatanView, setPenghuluJabatanView] = useState('pie');
  const [nikahTempatView, setNikahTempatView] = useState('pie');
  const [kuaTanahView, setKuaTanahView] = useState('pie');
  const [kuaBangunanView, setKuaBangunanView] = useState('pie');
  const [kuaRevitalisasiView, setKuaRevitalisasiView] = useState('pie');
  const [wakafStatusView, setWakafStatusView] = useState('pie');
  const [wakafPemanfaatanView, setWakafPemanfaatanView] = useState('pie');
  
  // --- Latar Belakang & Warna (Gaya Kependudukan) ---
  const backgroundStyle = theme === 'dark' 
    ? { backgroundColor: "#210F37" } 
    : { backgroundColor: "#E4EFE7" };

  // --- Loading dan Error State ---
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 text-center" style={backgroundStyle}>
        <p className={`text-lg ${theme === 'dark' ? 'text-purple-300' : 'text-gray-700'}`}>
          Memuat Data Keagamaan...
        </p>
      </div>
    );
  }

  if (status === 'failed' || !data || !data.keagamaan) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 text-center" style={backgroundStyle}>
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          Gagal memuat Data Keagamaan. Silakan coba muat ulang halaman.
        </p>
      </div>
    );
  }

  // --- Ambil data dari state Redux (data.keagamaan.data) ---
  const { 
    pendudukAgama: dataPendudukAgama,
    rumahIbadah: dataRumahIbadah,
    tipologiMasjid: dataTipologiMasjid,
    penyuluhAgama: dataPenyuluhAgama,
    penyuluhDetail: dataPenyuluhDetail,
    penyuluhTunjangan: dataPenyuluhTunjangan,
    sasaranPenyuluhan: dataSasaranPenyuluhan,
    kuaTipologi: dataKuaTipologi,
    kuaStatus: dataKuaStatus,
    revitalisasiKua: dataRevitalisasiKua,
    penghuluJabatan: dataPenghuluJabatan,
    peristiwaNikahTempat: dataPeristiwaNikahTempat,
    peristiwaNikahBulan: dataPeristiwaNikahBulan,
    bukuNikah: dataBukuNikah,
    rujuk, 
    tanahWakafStatus: dataTanahWakafStatus,
    tanahWakafPemanfaatan: dataTanahWakafPemanfaatan,
    tanahWakafProduktif, 
    balaiNikah: dataBalaiNikah,
    penghuluPembinaan: dataPenghuluPembinaan,
    kasusKonflik: dataKasusKonflik,
    kasusKonfrontatif: dataKasusKonfrontatif,
    dialogAntarUmat: dataDialogAntarUmat,
    dialogInternUmat: dataDialogInternUmat,
    qariHafidz: dataQariHafidz
  } = data.keagamaan.data;

  // --- Hitung ulang total dan data turunan ---
  const totalPenduduk = dataPendudukAgama.reduce((sum, item) => sum + item.value, 0);
  const totalRumahIbadah = dataRumahIbadah.reduce((sum, item) => sum + item.value, 0);
  const totalMasjid = dataTipologiMasjid.reduce((sum, item) => sum + item.value, 0);

  const dataPenyuluhTotal = [
      { name: "PNS", value: dataPenyuluhAgama.reduce((s, i) => s + (i.pns || 0), 0), color: "#34d399" },
      { name: "PPPK", value: dataPenyuluhAgama.reduce((s, i) => s + (i.pppk || 0), 0), color: "#60a5fa" },
      { name: "Non ASN", value: dataPenyuluhAgama.reduce((s, i) => s + (i.nonasn || 0), 0), color: "#f59e0b" },
  ];
  const totalPenyuluh = dataPenyuluhTotal.reduce((sum, item) => sum + item.value, 0);
  
  const totalPenyuluhTunjangan = dataPenyuluhTunjangan.reduce((sum, item) => sum + item.value, 0);
  const totalSasaranPenyuluhan = dataSasaranPenyuluhan.reduce((sum, item) => sum + item.value, 0);
  const totalKUA = dataKuaTipologi.reduce((sum, item) => sum + item.value, 0);
  const totalPenghulu = dataPenghuluJabatan.reduce((sum, item) => sum + item.value, 0);
  const totalNikahBulanIni = dataPeristiwaNikahBulan.reduce((sum, item) => sum + item.total, 0);

  // Perbaikan untuk data Rujuk agar totalnya sesuai dengan 6 bulan yang ditampilkan
  const dataRujuk = {
      totalRujuk: rujuk.totalRujuk,
      rincian: rujuk.rincian.map(kua => ({
          ...kua,
          total: (kua.jan || 0) + (kua.feb || 0) + (kua.mar || 0) + (kua.apr || 0) + (kua.mei || 0) + (kua.jun || 0)
      }))
  };
  const totalPeristiwaRujuk = dataRujuk.totalRujuk; // Total keseluruhan tetap dari JSON
  
  const totalTanahWakafPemanfaatan = dataTanahWakafPemanfaatan.reduce((sum, item) => sum + item.value, 0);
  const totalTanahWakafProduktif = tanahWakafProduktif; // Ini adalah angka, bukan array
  const totalPenghuluPembinaan = dataPenghuluPembinaan.reduce((sum, item) => sum + item.value, 0);

  // Data formatting untuk charts (yang bergantung pada data Redux)
  const dataNikahTempatArray = [
    { name: 'Luar KUA', value: dataPeristiwaNikahTempat.luar, color: "#3B82F6" },
    { name: 'Di KUA', value: dataPeristiwaNikahTempat.kua, color: "#10B981" },
  ];
  const dataKuaTanahArray = [
    { name: 'Belum Sertifikat', value: dataKuaStatus.tanah.belumSertifikat, color: "#F59E0B" },
    { name: 'Sudah Sertifikat', value: dataKuaStatus.tanah.sudahSertifikat, color: "#10B981" },
  ];
  const dataKuaBangunanArray = [
    { name: 'Baik', value: dataKuaStatus.bangunan.baik, color: "#10B981" },
    { name: 'Rusak Ringan', value: dataKuaStatus.bangunan.rusakRingan, color: "#F59E0B" },
    { name: 'Rusak Berat', value: dataKuaStatus.bangunan.rusakBerat, color: "#EF4444" },
  ];
  const dataKuaRevitalisasiArray = [
     { name: 'Rehab Ringan', value: dataRevitalisasiKua.rehabRingan, color: "#3B82F6" },
     { name: 'Rehab Berat', value: dataRevitalisasiKua.rehabBerat, color: "#A78BFA" },
  ];
  const penyuluhDetailArray = Object.keys(dataPenyuluhDetail).map(key => {
        const item = dataPenyuluhDetail[key];
        if (!item) return null; 
        const laki = item.gender?.laki || 0;
        const perempuan = item.gender?.perempuan || 0;
        const asn = item.status?.asn || 0;
        const nonAsn = item.status?.nonAsn || 0;
        return {
          agama: key.charAt(0).toUpperCase() + key.slice(1),
          laki: laki,
          perempuan: perempuan,
          totalGender: laki + perempuan,
          asn: asn,
          nonAsn: nonAsn,
          totalStatus: asn + nonAsn,
        };
    }).filter(Boolean); // Hapus item null jika ada


  const filters = [
      { key: 'penduduk', text: 'Penduduk & Rumah Ibadah', icon: <ReligionIcon /> },
      { key: 'penyuluh', text: 'Penyuluh Agama', icon: <CounselorIcon /> },
      { key: 'kua', text: 'Layanan KUA', icon: <KuaIcon /> },
      { key: 'wakaf', text: 'Wakaf', icon: <LandIcon /> },
      { key: 'kerukunan', text: 'Kerukunan & Lainnya', icon: <ShieldCheckIcon /> },
  ];
  const containerVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } } };
  const itemVariant = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
  const chartSectionVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } } };

  // --- Mulai Render Komponen ---
  return (
    <motion.div id="data-keagamaan" className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" 
      style={backgroundStyle} // Terapkan BG Kependudukan
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={containerVariant} >
      
      {/* Elemen Dekoratif (Gaya Kependudukan) */}
      <div className={`absolute top-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/3 ${theme === 'dark' ? 'bg-purple-800' : 'bg-purple-200'}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-15 translate-x-1/2 translate-y-1/3 ${theme === 'dark' ? 'bg-pink-700' : 'bg-pink-100'}`}></div>

      <div className="mx-auto md:mx-12 relative z-10">
        <motion.div className="text-center mb-10" variants={itemVariant} >
          {/* Judul (Gaya Kependudukan) */}
          <h2 style={{ lineHeight: '1.2' }} className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r pb-2 ${theme === 'dark' ? 'from-purple-400 to-pink-500' : 'from-emerald-700 to-green-900'}`}> 
            Data Keagamaan 
          </h2>
          <p className={`mt-3 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> 
            Statistik penduduk, rumah ibadah, penyuluh agama, layanan KUA, dan wakaf di Kota Medan. 
          </p>
        </motion.div>
        
        {/* KPI Cards (Gaya Kependudukan) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" variants={containerVariant}>
            {/* Mengganti warna agar sesuai tema Kependudukan (Ungu/Pink) */}
            <KpiCard title="Total Penduduk" value={totalPenduduk} icon={<ReligionIcon />} color={theme === 'dark' ? "#a78bfa" : "#8b5cf6"} theme={theme} />
            <KpiCard title="Total Masjid" value={totalMasjid} icon={<MosqueIcon />} color={theme === 'dark' ? "#f472b6" : "#db2777"} theme={theme} />
            <KpiCard title="Total Penyuluh" value={totalPenyuluh} icon={<CounselorIcon />} color={theme === 'dark' ? "#a78bfa" : "#8b5cf6"} theme={theme} />
        </motion.div>
        
        {/* Layout Utama (Gaya Kependudukan) */}
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filter (Gaya Kependudukan) */}
            <motion.div className="w-full md:w-1/4 lg:w-1/5" variants={itemVariant}>
                <div className={`rounded-2xl p-4 space-y-2 shadow-xl ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}>
                    <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Kategori Data</h4>
                    <p className={`px-2 text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pilih kategori untuk melihat detail data.</p>
                    {filters.map(f => ( 
                        <FilterButton key={f.key} text={f.text} icon={f.icon} onClick={() => setFilter(f.key)} isActive={filter === f.key} theme={theme} /> 
                    ))}
                </div>
            </motion.div>
            
            {/* Konten Utama */}
            <div className="w-full md:w-3/4 lg:w-4/5">
                <AnimatePresence mode="wait">
                    {/* --- Konten dinamis di-render di sini --- */}
                    {filter === 'penduduk' && (
                        <motion.div key="penduduk" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                            <ChartCard
                                title={`Penduduk Berdasarkan Agama (Total: ${totalPenduduk.toLocaleString('id-ID')})`}
                                csvData={dataPendudukAgama} csvColumns={pendudukAgamaColumns} csvFilename="penduduk_agama.csv"
                                allowToggle={true}
                                currentView={pendudukChartView}
                                onToggle={setPendudukChartView}
                                chartType="agama"
                            />
                            <ChartCard
                                title={`Rumah Ibadah (Total: ${totalRumahIbadah.toLocaleString('id-ID')})`}
                                csvData={dataRumahIbadah} csvColumns={rumahIbadahColumns} csvFilename="rumah_ibadah.csv"
                                allowToggle={true}
                                currentView={rumahIbadahView}
                                onToggle={setRumahIbadahView}
                                chartType="rumah_ibadah"
                            />
                            <ChartCard
                                title={`Masjid Berdasarkan Tipologi (Total: ${totalMasjid.toLocaleString('id-ID')})`}
                                csvData={dataTipologiMasjid} csvColumns={tipologiMasjidColumns} csvFilename="tipologi_masjid.csv"
                                allowToggle={true}
                                currentView={tipologiMasjidView}
                                onToggle={setTipologiMasjidView}
                                chartType="tipologi"
                                className="md:col-span-2"
                            />
                        </motion.div>
                    )}
                    {filter === 'penyuluh' && (
                         <motion.div key="penyuluh" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                             <ChartCard
                                title={`Penyuluh Berdasarkan Status (Total: ${totalPenyuluh})`}
                                csvData={dataPenyuluhTotal}
                                csvColumns={[{ header: 'Status', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }]}
                                csvFilename="penyuluh_status.csv"
                                allowToggle={true}
                                currentView={penyuluhStatusView}
                                onToggle={setPenyuluhStatusView}
                                chartType="penyuluh_status"
                             />
                             <ChartCard
                                title="Penyuluh Berdasarkan Agama"
                                csvData={dataPenyuluhAgama}
                                csvColumns={penyuluhAgamaColumns}
                                csvFilename="penyuluh_agama.csv"
                                chartType="penyuluh_agama"
                             />
                              <ChartCard
                                title={`Penyuluh Non-ASN Penerima Tunjangan (Total: ${totalPenyuluhTunjangan})`}
                                csvData={dataPenyuluhTunjangan}
                                csvColumns={penyuluhTunjanganColumns}
                                csvFilename="penyuluh_tunjangan.csv"
                                allowToggle={true}
                                currentView={penyuluhTunjanganView}
                                onToggle={setPenyuluhTunjanganView}
                                chartType="penyuluh_tunjangan"
                             />
                              <ChartCard
                                title={`Sasaran Bimbingan Penyuluhan (Total: ${totalSasaranPenyuluhan})`}
                                csvData={dataSasaranPenyuluhan}
                                csvColumns={sasaranPenyuluhanColumns}
                                csvFilename="sasaran_penyuluhan.csv"
                                allowToggle={true}
                                currentView={sasaranPenyuluhanView}
                                onToggle={setSasaranPenyuluhanView}
                                chartType="sasaran_penyuluhan"
                             />
                             <DynamicTable
                                title="Rincian Detail Penyuluh (Gender & Status)"
                                data={penyuluhDetailArray}
                                columns={penyuluhDetailColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                        </motion.div>
                    )}
                    {filter === 'kua' && (
                         <motion.div key="kua" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                             <KpiCard title="Buku Nikah Diedarkan" value={dataBukuNikah.totalBukuNikah} icon={<BookOpenIcon />} color={theme === 'dark' ? "#60a5fa" : "#2563eb"} theme={theme} />
                             <ChartCard
                                title={`Peristiwa Nikah (Total: ${dataPeristiwaNikahTempat.total})`}
                                csvData={dataNikahTempatArray}
                                csvColumns={nikahTempatColumns}
                                csvFilename="nikah_tempat.csv"
                                allowToggle={true}
                                currentView={nikahTempatView}
                                onToggle={setNikahTempatView}
                                chartType="nikah_tempat"
                             />
                             <ChartCard
                                title={`Tipologi KUA (Total: ${totalKUA})`}
                                csvData={dataKuaTipologi} csvColumns={kuaTipologiColumns} csvFilename="kua_tipologi.csv"
                                allowToggle={true}
                                currentView={kuaTipologiView}
                                onToggle={setKuaTipologiView}
                                chartType="kua"
                             />
                             <ChartCard
                                title={`Jabatan Penghulu (Total: ${totalPenghulu})`}
                                csvData={dataPenghuluJabatan} csvColumns={penghuluJabatanColumns} csvFilename="penghulu_jabatan.csv"
                                allowToggle={true}
                                currentView={penghuluJabatanView}
                                onToggle={setPenghuluJabatanView}
                                chartType="penghulu"
                             />
                              <ChartCard
                                title={`Status Tanah KUA (Total: ${dataKuaStatus.tanah.total})`}
                                csvData={dataKuaTanahArray}
                                csvColumns={kuaTanahColumns}
                                csvFilename="kua_status_tanah.csv"
                                allowToggle={true}
                                currentView={kuaTanahView}
                                onToggle={setKuaTanahView}
                                chartType="kua_tanah"
                             />
                             <ChartCard
                                title={`Kondisi Bangunan KUA (Total: ${dataKuaStatus.bangunan.total})`}
                                csvData={dataKuaBangunanArray}
                                csvColumns={kuaBangunanColumns}
                                csvFilename="kua_kondisi_bangunan.csv"
                                allowToggle={true}
                                currentView={kuaBangunanView}
                                onToggle={setKuaBangunanView}
                                chartType="kua_bangunan"
                             />
                              <ChartCard
                                title={`Revitalisasi KUA (Total: ${dataRevitalisasiKua.total})`}
                                csvData={dataKuaRevitalisasiArray}
                                csvColumns={kuaRevitalisasiColumns}
                                csvFilename="kua_revitalisasi.csv"
                                allowToggle={true}
                                currentView={kuaRevitalisasiView}
                                onToggle={setKuaRevitalisasiView}
                                chartType="kua_revitalisasi"
                                className="md:col-span-2"
                             />
                             <ChartCard
                                title={`Peristiwa Nikah per Bulan (Total: ${totalNikahBulanIni})`}
                                csvData={dataPeristiwaNikahBulan}
                                csvColumns={nikahBulanColumns}
                                csvFilename="nikah_bulan.csv"
                                chartType="area"
                             />
                             <DynamicTable
                                title="Data Peristiwa Rujuk (Jan-Jun)"
                                data={dataRujuk.rincian}
                                columns={peristiwaRujukColumns}
                                theme={theme}
                             />
                             <DynamicTable
                                title="Distribusi Buku Nikah per KUA"
                                data={dataBukuNikah.rincian}
                                columns={bukuNikahColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                        </motion.div>
                    )}
                     {filter === 'wakaf' && (
                         <motion.div key="wakaf" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                            <KpiCard title="Tanah Wakaf Produktif" value={totalTanahWakafProduktif} icon={<ArchiveBoxIcon />} color={theme === 'dark' ? "#e879f9" : "#c026d3"} theme={theme} />
                            <KpiCard title="Total Peristiwa Rujuk" value={totalPeristiwaRujuk} icon={<NoSymbolIcon />} color={theme === 'dark' ? "#fde047" : "#ca8a04"} theme={theme} />
                             <ChartCard
                                title={`Status Tanah Wakaf (Total: ${dataTanahWakafStatus.total.toLocaleString('id-ID')})`}
                                csvData={[{name: 'Belum Sertifikat', value: dataTanahWakafStatus.belum, color: "#f87171"}, {name: 'Sudah Sertifikat', value: dataTanahWakafStatus.sudah, color: "#4ade80"}]}
                                csvColumns={[{ header: 'Status', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }]} csvFilename="wakaf_status.csv"
                                allowToggle={true}
                                currentView={wakafStatusView}
                                onToggle={setWakafStatusView}
                                chartType="wakaf_status"
                             />
                             <ChartCard
                                title={`Pemanfaatan Tanah Wakaf (Total Terdata: ${totalTanahWakafPemanfaatan})`}
                                csvData={dataTanahWakafPemanfaatan} csvColumns={tanahWakafPemanfaatanColumns} csvFilename="wakaf_pemanfaatan.csv"
                                allowToggle={true}
                                currentView={wakafPemanfaatanView}
                                onToggle={setWakafPemanfaatanView}
                                chartType="wakaf_manfaat"
                              />
                        </motion.div>
                    )}
                    {filter === 'kerukunan' && (
                         <motion.div key="kerukunan" variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                             <KpiCard title="Penghulu Dibina" value={totalPenghuluPembinaan} icon={<CounselorIcon />} color={theme === 'dark' ? "#fde047" : "#ca8a04"} theme={theme} />
                             <KpiCard title="Konflik Agama" value={dataKasusKonflik.length} icon={<ShieldCheckIcon />} color={theme === 'dark' ? "#f87171" : "#dc2626"} theme={theme} />
                             <DynamicTable
                                title="Data Balai Nikah"
                                data={dataBalaiNikah}
                                columns={balaiNikahColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                             <DynamicTable
                                title="Data Penghulu Mendapat Pembinaan"
                                data={dataPenghuluPembinaan}
                                columns={penghuluPembinaanColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                              <DynamicTable
                                title="Kasus Konflik Bernuansa Agama"
                                data={dataKasusKonflik}
                                columns={kasusKonflikColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                             <DynamicTable
                                title="Kasus Aksi Konfrontatif"
                                data={dataKasusKonfrontatif}
                                columns={kasusKonfrontatifColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                             <DynamicTable
                                title="Kegiatan Dialog Antar Umat Beragama"
                                data={dataDialogAntarUmat}
                                columns={dialogAntarUmatColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                             <DynamicTable
                                title="Kegiatan Dialog Intern Umat Beragama"
                                data={dataDialogInternUmat}
                                columns={dialogInternUmatColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                             <DynamicTable
                                title="Data Qari/Qariah & Hafidz/Hafidzah"
                                data={dataQariHafidz}
                                columns={qariHafidzColumns}
                                theme={theme}
                                className="md:col-span-2"
                             />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DataKeagamaan;

