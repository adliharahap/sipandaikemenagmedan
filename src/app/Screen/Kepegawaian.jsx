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
// Import useSelector untuk mengambil data dari Redux
import { useSelector } from "react-redux";

// --- 1. Ikon SVG Kustom ---
const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.519 2.27A9.094 9.094 0 0112 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 00-4.682-2.72m7.519 2.27c.459.083.92.146 1.395.192 1.02.087 2.07.14 3.15.14 1.08 0 2.13-.053 3.15-.14a2.25 2.25 0 011.664 2.284 2.25 2.25 0 01-1.664 2.284c-1.02.087-2.07.14 3.15.14-1.08 0-2.13-.053-3.15-.14a2.25 2.25 0 01-1.664-2.284 2.25 2.25 0 011.664-2.284zM12 14.25a3 3 0 100-6 3 3 0 000 6z" />
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867 6 2.292m0-14.25v14.25" />
  </svg>
);
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
// --- Ikon untuk Filter ---
const PensionIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ArrowUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
  </svg>
);
const DotsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);


// --- 2. Data (Dihapus, akan diambil dari Redux) ---

// Definisi warna (TETAP)
const COLORS_SATKER = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
const COLORS_KOMPOSISI = ["#34D399", "#60A5FA"];
const COLORS_PNS_GOL = ["#A78BFA", "#F59E0B", "#3B82F6"];
const COLORS_PPPK_GOL = ["#A78BFA", "#F59E0B", "#3B82F6", "#EF4444", "#10B981"];
const COLORS_AGAMA = ["#34D399", "#60A5FA", "#A78BFA", "#F59E0B", "#EF4444"];
const COLORS_PENDIDIKAN = ["#A78BFA", "#3B82F6", "#10B981", "#F59E0B"];
const COLORS_PTSP_SATKER = ["#3B82F6", "#10B981", "#F59E0B"];


// --- 3. Komponen Angka Animasi ---
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
const KpiCard = ({ icon, title, value, color, theme, suffix = "", isDecimal = false, link }) => {
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
      onClick={() => link && window.open(link, "_blank")}
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

// --- 5. Komponen Kartu Chart & Tabel (Gaya Kependudukan) ---
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

  const handleDownloadCSV = () => {
    if (!csvData || csvData.length === 0) return;
    const headers = tableColumns.map(col => col.header);
    const keys = tableColumns.map(col => col.key);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    csvData.forEach(row => {
      const rowValues = keys.map(key => {
        let val = row[key];
        val = (val === null || val === undefined) ? '' : val;
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`; 
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
  
  // Gaya dari Kependudukan
  const cardBgColor = theme === 'dark' ? '#2E1A47' : '#FFFFFF';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const downloadButtonColor = theme === 'dark' 
      ? 'bg-purple-500 text-gray-900 hover:bg-purple-400 focus:ring-purple-400 focus:ring-offset-gray-800' 
      : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-600 focus:ring-offset-white';

  return (
    <motion.div
      variants={itemVariant}
      className={`rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}
      style={{ backgroundColor: cardBgColor }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
        <h3 className={`text-lg sm:text-xl font-bold ${titleColor}`}>
          {title}
        </h3>
        <button
          onClick={handleDownloadCSV}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${downloadButtonColor}`}
        >
          <DownloadIcon className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      <div className="h-64 sm:h-80 min-w-0">
        {children}
      </div>
    </motion.div>
  );
};

// --- 6. Komponen Tombol Filter (Gaya Kependudukan) ---
const SideFilterButton = ({ text, icon, onClick, isActive, theme }) => {
    const activeBg = theme === 'dark' ? 'bg-purple-600' : 'bg-purple-600';
    const activeText = theme === 'dark' ? 'text-white' : 'text-white';
    const inactiveText = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/40' : 'hover:bg-gray-100/60';

    return (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 relative ${isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${inactiveBgHover}`}`}
            whileTap={{ scale: 0.98 }}
        >
            {isActive && (
                <motion.div
                    layoutId="filter-highlight-kepegawaian-side" // ID unik
                    className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r-full" // Highlight kuning
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
            {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
            <span className="text-sm">{text}</span>
        </motion.button>
    );
};
// Komponen Link Button (BARU)
const LinkButton = ({ text, icon, href, theme }) => {
    const inactiveText = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/40' : 'hover:bg-gray-100/60';

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 relative ${inactiveText} ${inactiveBgHover}`}
            whileTap={{ scale: 0.98 }}
        >
            {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
            <span className="text-sm">{text}</span>
        </motion.a>
    );
};


// --- 7. Komponen Tooltip Kustom (Gaya Kependudukan) ---
const CustomTooltip = ({ active, payload, label, theme, chartType = 'bar' }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const item = data.payload.payload || data.payload; 
    const name = label || item.name;

    // Gaya dari Kependudukan
    const baseClasses = `rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#2E1A47] border border-gray-700' : 'bg-white border border-gray-200'}`;
    const titleClasses = `font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`;
    const textClasses = `text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;
    
    return (
      <div className={baseClasses}>
        <p className={titleClasses}>{name}</p>
        
        {chartType === 'pie' && item.percent && (
          <p className={textClasses}>
            Persentase: {(item.percent * 100).toFixed(1)}%
          </p>
        )}
        
        {payload.map((p, index) => (
          <p key={index} className={textClasses} style={{ color: p.color || p.fill }}>
            {p.name}: {p.value.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- 8. Komponen Utama Aparatur & Aset ---
const Kepegawaian = () => {
  const { theme } = useTheme();

  // --- Ambil data dari Redux Store ---
  const { data, status } = useSelector((state) => state.landingData);

  const [filter, setFilter] = useState('ringkasan'); // 'ringkasan', 'pensiun', 'naikpangkat', 'lain'
  
  // Gaya Kependudukan
  const textLabelColor = theme === 'dark' ? '#D1D5DB' : '#374151';
  const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';
  const backgroundStyle = theme === 'dark' 
    ? { backgroundColor: "#210F37" } 
    : { backgroundColor: "#E4EFE7" };

  // --- Loading dan Error State ---
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 text-center" style={backgroundStyle}>
        <p className={`text-lg ${theme === 'dark' ? 'text-purple-300' : 'text-gray-700'}`}>
          Memuat Data Kepegawaian...
        </p>
      </div>
    );
  }
  
  if (status === 'failed' || !data || !data.kepegawaian) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 text-center" style={backgroundStyle}>
          <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
            Gagal memuat Data Kepegawaian. Silakan coba muat ulang halaman.
          </p>
        </div>
      );
  }

  // --- Definisikan data DARI REDUX ---
  const kepegawaianData = data.kepegawaian;
  
  const dataKomposisiPegawai = kepegawaianData.dataKomposisiPegawai.data;
  const dataSatuanKerja = kepegawaianData.dataSatuanKerja.data;
  const dataPNS_Golongan = kepegawaianData.dataPNS_Golongan.data;
  const dataPPPK_Golongan = kepegawaianData.dataPPPK_Golongan.data;
  const dataUsia = kepegawaianData.dataUsia.data;
  const dataAgama = kepegawaianData.dataAgama.data;
  const dataPNS_Pendidikan = kepegawaianData.dataPNS_Pendidikan.data;
  const dataPPPK_Pendidikan = kepegawaianData.dataPPPK_Pendidikan.data;
  const dataFKUB = kepegawaianData.dataFKUB.data;
  const dataPTSP_Satker = kepegawaianData.dataPTSP_Satker.data;
  const dataPTSP_Layanan = kepegawaianData.dataPTSP_Layanan.data;
  const dataPensiun_Golongan = kepegawaianData.dataPensiun_Golongan.data;
  const dataPensiun_Pendidikan = kepegawaianData.dataPensiun_Pendidikan.data;
  const dataPensiun_Agama = kepegawaianData.dataPensiun_Agama.data;
  const dataNaikPangkat_Golongan = kepegawaianData.dataNaikPangkat_Golongan.data;
  const dataNaikPangkat_Pendidikan = kepegawaianData.dataNaikPangkat_Pendidikan.data;
  const dataNaikPangkat_Agama = kepegawaianData.dataNaikPangkat_Agama.data;
  const dataTugasBelajar = kepegawaianData.dataTugasBelajar;
  const dataNonASN = kepegawaianData.dataNonASN;

  // Hitung KPI Data
  const totalPNS = dataKomposisiPegawai.find(d => d.name === "PNS")?.value || 0;
  const totalPPPK = dataKomposisiPegawai.find(d => d.name === "PPPK")?.value || 0;
  const totalSatker = dataSatuanKerja.reduce((acc, curr) => acc + curr.value, 0);

  const kpiData = [
    { title: "Total PNS", value: totalPNS, icon: <UsersIcon />, color: "#34D399", link: "https://drive.google.com/file/d/10BcCzj1yLRIEyZGbmBqIQpNDN9QhwVRQ/view"},
    { title: "Total PPPK", value: totalPPPK, icon: <PppkIcon />, color: "#60A5FA", link: "https://drive.google.com/file/d/1iO-jVwr6WTOEXoHkGYDk_tPYzEX4x3Zp/view" },
    { title: "Satuan Kerja", value: totalSatker, icon: <SatkerIcon />, color: "#F59E0B" },
  ];

  // Hitung Total untuk Judul Chart
  const totalPensiun = dataPensiun_Agama.reduce((acc, curr) => acc + curr.value, 0);
  const totalNaikPangkat = dataNaikPangkat_Agama.reduce((acc, curr) => acc + curr.value, 0);
  const totalPTSP_Satker = dataPTSP_Satker.reduce((acc, curr) => acc + curr.value, 0);
  const totalPTSP_Layanan = dataPTSP_Layanan.reduce((acc, curr) => acc + curr.value, 0);


  const filters = [
    { key: 'ringkasan', text: 'Ringkasan Pegawai', icon: <UsersIcon/> },
    { key: 'pensiun', text: 'PNS Pensiun', icon: <PensionIcon/> },
    { key: 'naikpangkat', text: 'PNS Naik Pangkat', icon: <ArrowUpIcon/> },
    { key: 'lain', text: 'Lain-lain', icon: <DotsIcon/> },
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
      id="kepegawaian"
      className={`w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8`}
      style={backgroundStyle} // Terapkan BG Kependudukan
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={containerVariant}
    >
      <div className="mx-auto md:mx-12">
        {/* Judul Sesi (Gaya Kependudukan) */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariant}
        >
          <h2 className={`text-3xl pb-2 sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-500' : 'from-emerald-700 to-green-900'}`}>
            Kepegawaian
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Data komprehensif mengenai Aparatur Sipil Negara (ASN) dan Satuan Kerja di lingkungan Kemenag Kota Medan.
          </p>
        </motion.div>

        {/* Kartu KPI (Gaya Kependudukan) */}
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
              link={item.link}
            />
          ))}
        </motion.div>
        
        {/* --- Layout Utama: Filter Kiri, Konten Kanan (BARU) --- */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Kolom Filter Kiri (Gaya Kependudukan) */}
          <motion.div className="w-full md:w-1/4 lg:w-1/5" variants={itemVariant}>
            <div className={`rounded-2xl p-4 space-y-2 shadow-xl ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}>
              <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Filter Data</h4>
              <p className={`px-2 text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pilih kategori data.</p>
               {filters.map(f => (
                <SideFilterButton 
                  key={f.key} 
                  text={f.text} 
                  icon={f.icon} // Menggunakan ikon dari array filters
                  onClick={() => setFilter(f.key)} 
                  isActive={filter === f.key} 
                  theme={theme} 
                />
              ))}
            </div>
          </motion.div>

          {/* Kolom Konten Kanan */}
          <div className="w-full md:w-3/4 lg:w-4/5">
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
                  <ChartAndTableCard
                    title={`Komposisi Pegawai (Total: ${totalPNS + totalPPPK})`}
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
                    title={`Satuan Kerja (Total: ${totalSatker})`}
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
                    title={`Sebaran Golongan PNS (Total: ${totalPNS})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PNS_GOL[index % COLORS_PNS_GOL.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>

                  <ChartAndTableCard
                    title={`Sebaran Golongan PPPK (Total: ${totalPPPK})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PPPK_GOL[index % COLORS_PPPK_GOL.length]} />
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
                        <Bar dataKey="pns" name="PNS" fill={COLORS_KOMPOSISI[0]} />
                        <Bar dataKey="pppk" name="PPPK" fill={COLORS_KOMPOSISI[1]} />
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
                        <Bar dataKey="pns" name="PNS" fill={COLORS_KOMPOSISI[0]} />
                        <Bar dataKey="pppk" name="PPPK" fill={COLORS_KOMPOSISI[1]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
                  
                  <ChartAndTableCard
                    title={`Kualifikasi Pendidikan PNS (Total: ${totalPNS})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PENDIDIKAN[index % COLORS_PENDIDIKAN.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
                  
                  <ChartAndTableCard
                    title={`Kualifikasi Pendidikan PPPK (Total: ${totalPPPK})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PENDIDIKAN[index % COLORS_PENDIDIKAN.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
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
                  <ChartAndTableCard
                    title={`Pensiun per Golongan (Total: ${totalPensiun})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PNS_GOL[index % COLORS_PNS_GOL.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
                  
                  <ChartAndTableCard
                    title={`Pensiun per Pendidikan (Total: ${totalPensiun})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PENDIDIKAN[index % COLORS_PENDIDIKAN.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
                  
                  <ChartAndTableCard
                    title={`Pensiun per Agama (Total: ${totalPensiun})`}
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
                  <ChartAndTableCard
                    title={`Naik Pangkat per Gol. (Total: ${totalNaikPangkat})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PNS_GOL[index % COLORS_PNS_GOL.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
                  
                  <ChartAndTableCard
                    title={`Naik Pangkat per Pend. (Total: ${totalNaikPangkat})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PENDIDIKAN[index % COLORS_PENDIDIKAN.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>
                  
                  <ChartAndTableCard
                    title={`Naik Pangkat per Agama (Total: ${totalNaikPangkat})`}
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
                  <ChartAndTableCard
                    title={`Organisasi Kerukunan (Total: ${dataFKUB.reduce((a, b) => a + b.value, 0)})`}
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
                    title={`PTSP Dibentuk (Total: ${totalPTSP_Satker})`}
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS_PTSP_SATKER[index % COLORS_PTSP_SATKER.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                        <Legend formatter={(value) => <span style={{ color: textLabelColor }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartAndTableCard>

                  <ChartAndTableCard
                    title={`Layanan Publik di PTSP (Total: ${totalPTSP_Layanan})`}
                    tableData={dataPTSP_Layanan}
                    tableColumns={[
                      { header: 'Layanan', key: 'name' },
                      { header: 'Jumlah', key: 'value', align: 'right' },
                    ]}
                    csvData={dataPTSP_Layanan}
                    csvFilename="ptsp_layanan.csv"
                    className="md:col-span-2" 
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
                  
                  <motion.div
                    variants={itemVariant}
                    className={`rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}
                  >
                    <h3 className={`text-lg sm:text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      PNS Tugas Belajar Mandiri
                    </h3>
                    <div className="flex flex-col items-center justify-center h-full">
                      <BookOpenIcon className="w-16 h-16 text-blue-400" />
                      <p className={`text-4xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <AnimatedNumber value={dataTugasBelajar.total} />
                        <span className="text-2xl ml-2">Orang</span>
                      </p>
                      <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Jenjang S2: {dataTugasBelajar.s2}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariant}
                    className={`rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}
                  >
                    <h3 className={`text-lg sm:text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Pegawai Non ASN
                    </h3>
                    <div className="flex flex-col items-center justify-center h-full">
                      <UsersIcon className="w-16 h-16 text-purple-400" />
                      <p className={`text-4xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <AnimatedNumber value={dataNonASN.total} />
                        <span className="text-2xl ml-2">Orang</span>
                      </p>
                      <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {dataNonASN.diBawahS1} &lt;S1, {dataNonASN.s1} S1
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> {/* End Kolom Konten Kanan */}
        </div> {/* End Layout Utama */}
      </div>
    </motion.div>
  );
}

export default Kepegawaian;

