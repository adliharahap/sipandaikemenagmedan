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
} from "recharts";

// --- 1. Ikon SVG Kustom ---
const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.519 2.27A9.094 9.094 0 0112 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 00-4.682-2.72m7.519 2.27c.459.083.92.146 1.395.192 1.02.087 2.07.14 3.15.14 1.08 0 2.13-.053 3.15-.14a2.25 2.25 0 011.664 2.284 2.25 2.25 0 01-1.664 2.284c-1.02.087-2.07.14-3.15.14-1.08 0-2.13-.053-3.15-.14a2.25 2.25 0 01-1.664-2.284 2.25 2.25 0 011.664-2.284zM12 14.25a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25a.75.75 0 010 1.5.75.75 0 010-1.5z" />
  </svg>
);
const PppkIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.5 1.5 0 0118 21.75H6a1.5 1.5 0 01-1.499-1.632z" />
  </svg>
);
const SatkerIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 6h7.5M8.25 9h7.5M8.25 12h7.5M8.25 15h7.5M8.25 18h7.5M5.25 6h.008v.008H5.25V6zm.008 3h.008v.008H5.259V9zm0 3h.008v.008H5.25v-G.008zm0 3h.008v.008H5.25v-G.008zm0 3h.008v.008H5.25v-G.008zM18.75 6h.008v.008h-.008V6z m.008 3h.008v.008h-.008V9zm0 3h.008v.008h-.008v-G.008zm0 3h.008v.008h-.008v-G.008zm0 3h.008v.008h-.008v-G.008z" />
  </svg>
);
const BookOpenIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
  </svg>
);

const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
// --- AKHIR PENAMBAHAN IKON ---

// --- 2. Data dari Teks Anda ---
const kpiData = [
  { title: "Total PNS", value: 1252, icon: <UsersIcon />, color: "#34D399" },
  { title: "Total PPPK", value: 497, icon: <PppkIcon />, color: "#60A5FA" },
  { title: "Satuan Kerja", value: 41, icon: <SatkerIcon />, color: "#F59E0B" },
];

const dataSatuanKerja = [
  { name: "KUA", value: 21 },
  { name: "MAN", value: 4 },
  { name: "MTsN", value: 4 },
  { name: "MIN", value: 12 },
];
const COLORS_SATKER = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const dataKomposisiPegawai = [
  { name: "PNS", value: 1252, color: "#34D399" },
  { name: "PPPK", value: 497, color: "#60A5FA" },
];
const COLORS_KOMPOSISI = dataKomposisiPegawai.map(d => d.color);

const dataPNS_Golongan = [
  { name: "Gol. II", value: 11, color: "#A78BFA" },
  { name: "Gol. III", value: 570, color: "#F59E0B" },
  { name: "Gol. IV", value: 671, color: "#3B82F6" },
];
const COLORS_PNS_GOL = dataPNS_Golongan.map(d => d.color);

const dataPPPK_Golongan = [
  { name: "Gol. V", value: 9, color: "#A78BFA" },
  { name: "Gol. VII", value: 14, color: "#F59E0B" },
  { name: "Gol. IX", value: 47, color: "#3B82F6" },
  { name: "Gol. X", value: 4, color: "#EF4444" },
  { name: "Gol. XV", value: 423, color: "#10B981" }, // Asumsi dari 497 - (9+14+47+4)
];
const COLORS_PPPK_GOL = dataPPPK_Golongan.map(d => d.color);

const dataUsia = [
  { name: "<31", pns: 45, pppk: 98 },
  { name: "31-40", pns: 238, pppk: 237 },
  { name: "41-50", pns: 332, pppk: 125 },
  { name: "51-60", pns: 637, pppk: 32 },
  { name: ">60", pns: 0, pppk: 0 },
];

const dataAgama = [
  { name: "Islam", pns: 1105, pppk: 412 },
  { name: "Kristen", pns: 111, pppk: 66 },
  { name: "Katolik", pns: 29, pppk: 19 },
  { name: "Hindu", pns: 7, pppk: 0 },
  { name: "Buddha", pns: 13, pppk: 0 },
];
const COLORS_AGAMA = ["#34D399", "#60A5FA", "#A78BFA", "#F59E0B", "#EF4444"];

// --- AWAL PENAMBAHAN DATA BARU ---
const dataPNS_Pendidikan = [
  { name: "<S1", value: 749, color: "#A78BFA" },
  { name: "S1", value: 425, color: "#3B82F6" },
  { name: "S2", value: 77, color: "#10B981" },
  { name: "S3", value: 1, color: "#F59E0B" },
];
const dataPPPK_Pendidikan = [
  { name: "<S1", value: 27, color: "#A78BFA" },
  { name: "S1", value: 451, color: "#3B82F6" },
  { name: "S2", value: 19, color: "#10B981" },
  { name: "S3", value: 0, color: "#F59E0B" },
];
const COLORS_PENDIDIKAN = dataPNS_Pendidikan.map(d => d.color);

const dataFKUB = [
  { name: "FKUB", value: 1 },
  { name: "Sekber", value: 0 },
  { name: "Desa Sadar Kerukunan", value: 1 },
];

const dataPTSP_Satker = [
  { name: "Kemenag Kota Medan", value: 1, color: "#3B82F6" },
  { name: "Madrasah", value: 19, color: "#10B981" },
  { name: "KUA", value: 1, color: "#F59E0B" },
];
const COLORS_PTSP_SATKER = dataPTSP_Satker.map(d => d.color);

const dataPTSP_Layanan = [
  { name: "Izin Belajar S1-S3", value: 6 },
  { name: "Izin Belajar LN", value: 0 },
  { name: "Izin Magang", value: 3 },
  { name: "Izin Penelitian (1)", value: 15 },
  { name: "Izin Penelitian (2)", value: 32 },
  { name: "Legalisir Surat Nikah", value: 10 },
  { name: "Permohonan Rohaniawan", value: 0 }, // Data tidak ada, asumsi 0
  { name: "Konsultasi BP4", value: 1 },
  { name: "Jadwal Sholat", value: 1 },
  { name: "Sertifikasi Arah Kiblat", value: 0 }, // Data tidak ada, asumsi 0
  { name: "SK Majelis Taklim", value: 0 }, // Data tidak ada, asumsi 0
];
// --- AKHIR PENAMBAHAN DATA BARU ---

const dataPensiun_Golongan = [
  { name: "Gol. III", value: 21, color: "#F59E0B" },
  { name: "Gol. IV", value: 55, color: "#3B82F6" },
]; // Total 73 (data: 21+55=76, discrepancy in source)
const dataPensiun_Pendidikan = [
  { name: "<S1", value: 35, color: "#A78BFA" },
  { name: "S1", value: 21, color: "#3B82F6" },
  { name: "S2", value: 5, color: "#10B981" },
  { name: "S3", value: 3, color: "#F59E0B" },
]; // Total 73 (data: 35+21+5+3=64, discrepancy in source)
const dataPensiun_Agama = [
  { name: "Islam", value: 59 },
  { name: "Kristen", value: 10 },
  { name: "Katolik", value: 2 },
  { name: "Hindu", value: 1 },
  { name: "Buddha", value: 1 },
]; // Total 73

const dataNaikPangkat_Golongan = [
  { name: "Gol. II", value: 44, color: "#A78BFA" },
  { name: "Gol. III", value: 113, color: "#F59E0B" },
  { name: "Gol. IV", value: 31, color: "#3B82F6" },
]; // Total 144 (data: 44+113+31=188, discrepancy in source)
const dataNaikPangkat_Pendidikan = [
  { name: "<S1", value: 34, color: "#A78BFA" },
  { name: "S1", value: 82, color: "#3B82F6" },
  { name: "S2", value: 28, color: "#10B981" },
]; // Total 144
const dataNaikPangkat_Agama = [
  { name: "Islam", value: 124 },
  { name: "Kristen", value: 16 },
  { name: "Katolik", value: 3 },
  { name: "Hindu", value: 1 },
]; // Total 144

const dataTugasBelajar = { total: 2, s2: 2 };
const dataNonASN = { total: 6, '<S1': 3, s1: 3 };

// --- 3. Komponen Angka Animasi ---
const AnimatedNumber = ({ value, isDecimal = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
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

  return <span ref={ref}>{isDecimal ? "0,00" : "0"}</span>;
};

// --- 4. Komponen Kartu KPI ---
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

// --- 5. Komponen Kartu Chart & Tabel (BARU) ---
const ChartAndTableCard = ({ 
  title, 
  children, 
  tableData, 
  tableColumns, 
  csvData, 
  csvFilename, 
  className = "" 
}) => {
  const { theme } = useTheme();
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  // Fungsi Download CSV
  const handleDownloadCSV = () => {
    if (!csvData || csvData.length === 0) return;

    const headers = tableColumns.map(col => col.header);
    const keys = tableColumns.map(col => col.key);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";

    csvData.forEach(row => {
      const rowValues = keys.map(key => {
        let val = row[key];
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`; // Handle koma di dalam string
        }
        return val;
      });
      csvContent += rowValues.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", csvFilename || "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      variants={itemVariant}
      className={`rounded-2xl shadow-lg p-4 sm:p-6 ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'} ${className}`}
    >
      {/* Judul dan Tombol Download */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
        <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <button
          onClick={handleDownloadCSV}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === 'dark' 
            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <DownloadIcon className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      {/* Kontainer Chart */}
      <div className="h-64 sm:h-80 min-w-0">
        {children}
      </div>
    </motion.div>
  );
};
// --- AKHIR KOMPONEN BARU ---

// --- 6. Komponen Tombol Filter ---
const FilterButton = ({ text, onClick, isActive, theme }) => (
  <motion.button
    onClick={onClick}
    className={`relative px-4 py-2 sm:px-5 rounded-full font-medium transition-colors duration-300 ${
      isActive ? 'text-white' : (theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black')
    }`}
    whileTap={{ scale: 0.95 }}
  >
    {isActive && (
      <motion.div
        layoutId="filter-bubble-aparatur"
        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full z-0"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    )}
    <span className="relative z-10 text-sm sm:text-base">{text}</span>
  </motion.button>
);

// --- 7. Komponen Tooltip Kustom ---
const CustomTooltip = ({ active, payload, label, theme, chartType = 'bar' }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const item = data.payload.payload || data.payload; // PieChart vs Bar/Area
    const name = label || item.name;
    const value = data.value;

    return (
      <div className={`rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#3a2555] border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</p>
        
        {chartType === 'pie' && item.percent && (
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Persentase: {(item.percent * 100).toFixed(1)}%
          </p>
        )}
        
        {payload.map((p, index) => (
          <p key={index} className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- 8. Komponen Utama Aparatur & Aset ---
const AsnDanNonASN = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('ringkasan'); // 'ringkasan', 'pensiun', 'naikpangkat', 'lain'
  const textLabelColor = theme === 'dark' ? '#D1D5DB' : '#374151';
  const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';

  const filters = [
    { key: 'ringkasan', text: 'Ringkasan Pegawai' },
    { key: 'pensiun', text: 'PNS Pensiun' },
    { key: 'naikpangkat', text: 'PNS Naik Pangkat' },
    { key: 'lain', text: 'Lain-lain' },
  ];

  // Varian animasi
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const chartSectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <motion.div 
      id="asn" // ID untuk navigasi
      className={`w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-[#210F37]" : "bg-[#E4EFE7]"}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={containerVariant}
    >
      <div className="mx-auto md:mx-12">
        {/* Judul Sesi */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariant}
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-sky-400 to-blue-500' : 'from-sky-600 to-blue-800'}`}>
            ASN & Non ASN
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Data komprehensif mengenai Aparatur Sipil Negara (ASN) dan Satuan Kerja di lingkungan Kemenag Kota Medan.
          </p>
        </motion.div>

        {/* Kartu KPI */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariant}
        >
          {kpiData.map(item => (
            <KpiCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
              theme={theme}
            />
          ))}
        </motion.div>
        
        {/* Filter Konten */}
        <motion.div 
          className={`flex flex-wrap justify-center gap-2 sm:gap-4 p-2 rounded-full mb-12 ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'} shadow-md`}
          variants={itemVariant}
        >
          {filters.map(f => (
            <FilterButton
              key={f.key}
              text={f.text}
              onClick={() => setFilter(f.key)}
              isActive={filter === f.key}
              theme={theme}
            />
          ))}
        </motion.div>

        {/* Kontainer Konten Dinamis */}
        <AnimatePresence mode="wait">
          {filter === 'ringkasan' && (
            <motion.div
              key="ringkasan"
              variants={chartSectionVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            >
              {/* --- AWAL PERUBAHAN: Menggunakan ChartAndTableCard --- */}
              <ChartAndTableCard
                title="Komposisi Pegawai (Total: 1749)"
                tableData={dataKomposisiPegawai}
                tableColumns={[
                  { header: 'Status', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataKomposisiPegawai}
                csvFilename="komposisi_pegawai.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataKomposisiPegawai} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataKomposisiPegawai.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_KOMPOSISI[index % COLORS_KOMPOSISI.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Satuan Kerja (Total: 41)"
                tableData={dataSatuanKerja}
                tableColumns={[
                  { header: 'Satuan Kerja', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataSatuanKerja}
                csvFilename="satuan_kerja.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataSatuanKerja} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8">
                      {dataSatuanKerja.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_SATKER[index % COLORS_SATKER.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>

              <ChartAndTableCard
                title="Sebaran Golongan PNS (Total: 1252)"
                tableData={dataPNS_Golongan}
                tableColumns={[
                  { header: 'Golongan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPNS_Golongan}
                csvFilename="pns_golongan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPNS_Golongan} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar dataKey="value" name="Jumlah" fill="#3B82F6">
                      {dataPNS_Golongan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>

              <ChartAndTableCard
                title="Sebaran Golongan PPPK (Total: 497)"
                tableData={dataPPPK_Golongan}
                tableColumns={[
                  { header: 'Golongan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPPPK_Golongan}
                csvFilename="pppk_golongan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPPPK_Golongan} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar dataKey="value" name="Jumlah" fill="#A78BFA">
                       {dataPPPK_Golongan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>

              <ChartAndTableCard
                title="Rentang Usia (PNS vs PPPK)"
                tableData={dataUsia}
                tableColumns={[
                  { header: 'Usia', key: 'name' },
                  { header: 'PNS', key: 'pns', align: 'right' },
                  { header: 'PPPK', key: 'pppk', align: 'right' },
                ]}
                csvData={dataUsia}
                csvFilename="pegawai_usia.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataUsia} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                    <Bar dataKey="pns" name="PNS" fill={dataKomposisiPegawai[0].color} />
                    <Bar dataKey="pppk" name="PPPK" fill={dataKomposisiPegawai[1].color} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Sebaran Agama (PNS vs PPPK)"
                tableData={dataAgama}
                tableColumns={[
                  { header: 'Agama', key: 'name' },
                  { header: 'PNS', key: 'pns', align: 'right' },
                  { header: 'PPPK', key: 'pppk', align: 'right' },
                ]}
                csvData={dataAgama}
                csvFilename="pegawai_agama.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataAgama} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                    <Bar dataKey="pns" name="PNS" fill={dataKomposisiPegawai[0].color} />
                    <Bar dataKey="pppk" name="PPPK" fill={dataKomposisiPegawai[1].color} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              {/* --- KARTU BARU UNTUK PENDIDIKAN --- */}
              <ChartAndTableCard
                title="Kualifikasi Pendidikan PNS (Total: 1252)"
                tableData={dataPNS_Pendidikan}
                tableColumns={[
                  { header: 'Pendidikan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPNS_Pendidikan}
                csvFilename="pns_pendidikan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataPNS_Pendidikan} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataPNS_Pendidikan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PENDIDIKAN[index % COLORS_PENDIDIKAN.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Kualifikasi Pendidikan PPPK (Total: 497)"
                tableData={dataPPPK_Pendidikan}
                tableColumns={[
                  { header: 'Pendidikan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPPPK_Pendidikan}
                csvFilename="pppk_pendidikan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataPPPK_Pendidikan} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataPPPK_Pendidikan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PENDIDIKAN[index % COLORS_PENDIDIKAN.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              {/* --- AKHIR KARTU BARU --- */}
              {/* --- AKHIR PERUBAHAN --- */}
            </motion.div>
          )}
          
          {filter === 'pensiun' && (
            <motion.div
              key="pensiun"
              variants={chartSectionVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {/* --- AWAL PERUBAHAN: Menggunakan ChartAndTableCard --- */}
              <ChartAndTableCard
                title="Pensiun per Golongan (Total: 73)"
                tableData={dataPensiun_Golongan}
                tableColumns={[
                  { header: 'Golongan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPensiun_Golongan}
                csvFilename="pensiun_golongan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataPensiun_Golongan} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataPensiun_Golongan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Pensiun per Pendidikan (Total: 73)"
                tableData={dataPensiun_Pendidikan}
                tableColumns={[
                  { header: 'Pendidikan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPensiun_Pendidikan}
                csvFilename="pensiun_pendidikan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataPensiun_Pendidikan} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataPensiun_Pendidikan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Pensiun per Agama (Total: 73)"
                tableData={dataPensiun_Agama}
                tableColumns={[
                  { header: 'Agama', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPensiun_Agama}
                csvFilename="pensiun_agama.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPensiun_Agama} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar dataKey="value" name="Jumlah" fill="#EF4444">
                      {dataPensiun_Agama.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_AGAMA[index % COLORS_AGAMA.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              {/* --- AKHIR PERUBAHAN --- */}
            </motion.div>
          )}
          
          {filter === 'naikpangkat' && (
            <motion.div
              key="naikpangkat"
              variants={chartSectionVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {/* --- AWAL PERUBAHAN: Menggunakan ChartAndTableCard --- */}
              <ChartAndTableCard
                title="Naik Pangkat per Golongan (Total: 144)"
                tableData={dataNaikPangkat_Golongan}
                tableColumns={[
                  { header: 'Golongan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataNaikPangkat_Golongan}
                csvFilename="naikpangkat_golongan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataNaikPangkat_Golongan} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataNaikPangkat_Golongan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Naik Pangkat per Pendidikan (Total: 144)"
                tableData={dataNaikPangkat_Pendidikan}
                tableColumns={[
                  { header: 'Pendidikan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataNaikPangkat_Pendidikan}
                csvFilename="naikpangkat_pendidikan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataNaikPangkat_Pendidikan} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" fill="#8884d8">
                      {dataNaikPangkat_Pendidikan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="Naik Pangkat per Agama (Total: 144)"
                tableData={dataNaikPangkat_Agama}
                tableColumns={[
                  { header: 'Agama', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataNaikPangkat_Agama}
                csvFilename="naikpangkat_agama.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataNaikPangkat_Agama} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar dataKey="value" name="Jumlah" fill="#34D399">
                      {dataNaikPangkat_Agama.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_AGAMA[index % COLORS_AGAMA.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              {/* --- AKHIR PERUBAHAN --- */}
            </motion.div>
          )}

          {filter === 'lain' && (
            <motion.div
              key="lain"
              variants={chartSectionVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            >
              {/* --- AWAL PERUBAHAN: Menambahkan Data Baru --- */}
              <ChartAndTableCard
                title="Organisasi Kerukunan (Total: 2)"
                tableData={dataFKUB}
                tableColumns={[
                  { header: 'Organisasi', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataFKUB}
                csvFilename="organisasi_kerukunan.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataFKUB} layout="vertical" margin={{ left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar dataKey="value" name="Jumlah" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              <ChartAndTableCard
                title="PTSP Dibentuk (Total: 21)"
                tableData={dataPTSP_Satker}
                tableColumns={[
                  { header: 'Satuan Kerja', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPTSP_Satker}
                csvFilename="ptsp_satker.csv"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataPTSP_Satker} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8">
                      {dataPTSP_Satker.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PTSP_SATKER[index % COLORS_PTSP_SATKER.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                    <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartAndTableCard>

              <ChartAndTableCard
                title="Layanan Publik di PTSP (Total: 57)"
                tableData={dataPTSP_Layanan}
                tableColumns={[
                  { header: 'Layanan', key: 'name' },
                  { header: 'Jumlah', key: 'value', align: 'right' },
                ]}
                csvData={dataPTSP_Layanan}
                csvFilename="ptsp_layanan.csv"
                className="md:col-span-2" // Membuat kartu ini lebih lebar
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPTSP_Layanan} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textLabelColor, fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textLabelColor, fontSize: 10 }} width={110} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar dataKey="value" name="Jumlah Layanan" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartAndTableCard>
              
              {/* Kartu-kartu lama tetap di sini */}
              <motion.div
                variants={itemVariant}
                className={`rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}
              >
                <h3 className={`text-lg sm:text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  PNS Tugas Belajar Mandiri (Total: 2)
                </h3>
                <div className="flex flex-col items-center justify-center h-full">
                  <BookOpenIcon className="w-16 h-16 text-blue-400" />
                  <p className={`text-4xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <AnimatedNumber value={dataTugasBelajar.s2} />
                    <span className="text-2xl ml-2">Orang</span>
                  </p>
                  <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Jenjang S2</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariant}
                className={`rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}
              >
                <h3 className={`text-lg sm:text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Pegawai Non ASN (Total: 6)
                </h3>
                <div className="flex flex-col items-center justify-center h-full">
                  <UsersIcon className="w-16 h-16 text-purple-400" />
                  <p className={`text-4xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <AnimatedNumber value={dataNonASN.total} />
                    <span className="text-2xl ml-2">Orang</span>
                  </p>
                  <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {dataNonASN['<S1']} &lt;S1, {dataNonASN.s1} S1
                  </p>
                </div>
              </motion.div>
              {/* --- AKHIR PERUBAHAN --- */}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

export default AsnDanNonASN;

