"use client";
import { useTheme } from "next-themes";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// --- 1. Ikon SVG Kustom ---
const CertificateIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
// --- AWAL PERUBAHAN: Ikon baru untuk filter ---
const RegisterIcon = (props) => ( // Ikon untuk Pendaftaran
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const PublishIcon = (props) => ( // Ikon untuk Penerbitan
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// --- AKHIR PERUBAHAN ---


// --- 2. Data dari Teks Anda ---
const totalPendaftaran = 123;
const totalPenerbitan = 76;

const dataPendaftaranJenisProduk = [
  { name: "Makanan & Minuman", value: 117, color: "#10B981" },
  { name: "RPU/RPH", value: 1, color: "#F59E0B" },
  { name: "Jasa Logistik", value: 2, color: "#3B82F6" },
  { name: "Lain-lain", value: 3, color: "#6B7280" },
];
const dataPendaftaranSkalaUsaha = [
  { name: "Mikro", value: 112, color: "#8B5CF6" },
  { name: "Kecil", value: 9, color: "#EC4899" },
  { name: "Menengah", value: 0, color: "#F59E0B" },
  { name: "Besar", value: 2, color: "#EF4444" },
];
const dataPenerbitanJenisProduk = [
  { name: "Makanan & Minuman", value: 62, color: "#10B981" },
  { name: "RPU/RPH", value: 6, color: "#F59E0B" },
  { name: "Jasa Logistik", value: 4, color: "#3B82F6" },
  { name: "Lain-lain", value: 4, color: "#6B7280" },
];
const dataPenerbitanSkalaUsaha = [
  { name: "Mikro", value: 63, color: "#8B5CF6" },
  { name: "Kecil", value: 11, color: "#EC4899" },
  { name: "Menengah", value: 1, color: "#F59E0B" },
  { name: "Besar", value: 1, color: "#EF4444" },
];

const COLORS_JENIS_PRODUK = dataPendaftaranJenisProduk.map(d => d.color);
const COLORS_SKALA_USAHA = dataPendaftaranSkalaUsaha.map(d => d.color);

// Kolom untuk tabel dinamis & CSV
const jenisProdukColumns = [ { header: 'Jenis Produk', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
const skalaUsahaColumns = [ { header: 'Skala Usaha', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];


// --- 3. Komponen Angka Animasi ---
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, value, { duration: 1.5, ease: "easeOut",
        onUpdate: (latest) => { if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString('id-ID'); },
      });
    }
  }, [isInView, value]);
  return <span ref={ref}>0</span>;
};

// --- 4. Komponen Kartu KPI (Gaya Baru) ---
const KpiCard = ({ icon, title, value, color, theme }) => {
  const cardVariant = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const cardBgColor = theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.6)'; // Slate dark/white transparan
  const cardBorderColor = theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.2)'; // Sky blue border

  return (
    <motion.div variants={cardVariant} className="relative w-full overflow-hidden rounded-lg p-5 backdrop-blur-md border"
      style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
             style={{ background: `linear-gradient(135deg, ${color}66 0%, ${color}99 100%)` }}>
          {React.cloneElement(icon, { style: { color: 'white' }, className: "w-5 h-5" })}
        </div>
        <div>
          <h3 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ color: color }}>
            <AnimatedNumber value={value} />
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- 5. Komponen Kartu Chart (Gaya Baru) ---
const ChartCard = ({ title, children, csvData, csvFilename, csvColumns, className = "" }) => {
  const { theme } = useTheme();
  const itemVariant = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };
  const handleDownloadCSV = () => { /* ... fungsi download CSV ... */
    if (!csvData || csvData.length === 0 || !csvColumns || csvColumns.length === 0) return;
    const headers = csvColumns.map(col => col.header);
    const keys = csvColumns.map(col => col.key);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    csvData.forEach(row => {
      const rowValues = keys.map(key => {
        let val = row[key];
        val = val === null || val === undefined ? '' : val;
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
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
  const cardBgColor = theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.4)';
  const cardBorderColor = theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.1)';

  return (
    <motion.div variants={itemVariant} className={`rounded-lg backdrop-blur-sm border overflow-hidden ${className}`}
      style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2">
          <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-sky-100' : 'text-sky-900'}`}> {title} </h3>
          {/* --- AWAL PERUBAHAN: Teks tombol download --- */}
          <button onClick={handleDownloadCSV} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${theme === 'dark' ? 'bg-sky-900/30 border-sky-700/50 text-sky-300 hover:bg-sky-800/50 hover:border-sky-600/50' : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'}`} >
            <DownloadIcon className="w-3 h-3" /> Download CSV
          </button>
          {/* --- AKHIR PERUBAHAN --- */}
        </div>
        <div className="h-56 sm:h-64 min-w-0"> {children} </div>
      </div>
    </motion.div>
  );
};

// --- 6. Komponen Tombol Filter (Gaya Samping Kiri) ---
const SideFilterButton = ({ text, icon, onClick, isActive, theme }) => {
    const activeBg = theme === 'dark' ? 'bg-sky-700/50' : 'bg-sky-100';
    const activeText = theme === 'dark' ? 'text-sky-200' : 'text-sky-800';
    const inactiveText = theme === 'dark' ? 'text-gray-400 hover:text-sky-300' : 'text-gray-500 hover:text-sky-700';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50';

    return (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium text-left transition-all duration-200 relative ${isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${inactiveBgHover}`}`}
            whileTap={{ scale: 0.98 }}
        >
            {isActive && (
                <motion.div
                    layoutId="filter-highlight-halal-side" // ID unik
                    className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
            {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
            <span className="text-sm">{text}</span>
        </motion.button>
    );
};


// --- 7. Komponen Tooltip Kustom ---
const CustomTooltip = ({ active, payload, label, theme, chartType = 'pie' }) => {
  if (active && payload && payload.length) {
    const data = payload[0]; const item = data.payload.payload || data.payload; const name = label || item.name; const value = data.value;
    return ( <div className={`rounded-md p-2.5 shadow-lg backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
        <p className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</p>
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Jumlah: {value.toLocaleString('id-ID')} </p>
        {chartType === 'pie' && item.percent && ( <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Persentase: {(item.percent * 100).toFixed(1)}% </p> )}
      </div> );
  } return null;
};

// --- 8. Komponen Tabel Dinamis ---
const DynamicTable = ({ data, columns, theme }) => {
    if (!data || data.length === 0) {
        return <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada data untuk ditampilkan.</p>;
    }
    const tableBg = theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/40';
    const tableBorder = theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/50';
    const headerBg = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
    const headerText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const rowBorder = theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-200/50';
    const rowHover = theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50/50';
    const cellText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const cellTextPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';

    return (
        <div className={`w-full max-h-80 overflow-y-auto rounded-lg border backdrop-blur-sm ${tableBg} ${tableBorder}`}>
            <table className="min-w-full divide-y ${rowBorder}">
                <thead className={`sticky top-0 ${headerBg}`}>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} scope="col" className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${headerText} ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`divide-y ${rowBorder}`}>
                    {data.map((item, index) => (
                        <tr key={index} className={rowHover}>
                            {columns.map((col) => (
                                <td key={col.key} className={`px-4 py-2.5 whitespace-nowrap text-sm ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.key === 'name' ? cellTextPrimary : cellText}`}>
                                    {item[col.key] != null ? item[col.key].toLocaleString('id-ID') : '0'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- 9. Komponen Utama SertifikasiHalal ---
const SertifikasiHalal = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('pendaftaran'); // 'pendaftaran' atau 'penerbitan'
  const [tableData, setTableData] = useState(dataPendaftaranJenisProduk);
  const [tableColumns, setTableColumns] = useState(jenisProdukColumns);
  const [tableTitle, setTableTitle] = useState("Rincian Pendaftaran per Jenis Produk");

  const legendColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  // --- AWAL PERUBAHAN: Menambahkan ikon ke filter ---
  const filters = [
    { key: 'pendaftaran', text: 'Data Pendaftaran', icon: <RegisterIcon /> }, 
    { key: 'penerbitan', text: 'Data Penerbitan', icon: <PublishIcon /> }, 
  ];
  // --- AKHIR PERUBAHAN ---

  // Update tabel data saat filter berubah
  useEffect(() => {
    if (filter === 'pendaftaran') {
      setTableData([...dataPendaftaranJenisProduk, ...dataPendaftaranSkalaUsaha]); 
      setTableColumns([ { header: 'Kategori', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ]);
      setTableTitle("Rincian Data Pendaftaran");
    } else {
      setTableData([...dataPenerbitanJenisProduk, ...dataPenerbitanSkalaUsaha]); 
      setTableColumns([ { header: 'Kategori', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ]);
      setTableTitle("Rincian Data Penerbitan");
    }
  }, [filter]);

  // Varian animasi
  const containerVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } } };
  const itemVariant = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
  const chartSectionVariant = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } }, exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: 'easeIn' } } };
  
  // Background baru
  const backgroundStyle = theme === 'dark' 
    ? { background: 'radial-gradient(circle at top left, #210E37 0%, #201033 100%)' } 
    : { background: 'radial-gradient(circle at top left, #f1f5f9 0%, #dbeafe 100%)' }; // Light slate ke light blue

  return (
    <motion.div id="sertifikasi-halal" className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={backgroundStyle} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={containerVariant} >
      {/* Elemen dekoratif */}
      <div className={`absolute top-60 right-20 w-96 h-96 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 ${theme === 'dark' ? 'bg-indigo-700' : 'bg-sky-200'}`}></div>
      <div className={`absolute bottom-60 left-50 w-80 h-80 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-200'}`}></div>

      <div className="mx-auto md:mx-12 relative z-10">
        {/* Judul Sesi */}
        <motion.div className="text-center mb-10" variants={itemVariant} >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-sky-300 to-indigo-400' : 'from-sky-600 to-indigo-700'}`}>
            Sertifikasi Halal
          </h2>
          <p className={`mt-3 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Statistik Pendaftaran dan Penerbitan Sertifikat Halal di Kota Medan.
          </p>
        </motion.div>

        {/* Kartu KPI di Atas */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10" variants={containerVariant} >
          <KpiCard title="Total Pendaftaran" value={totalPendaftaran} icon={<CertificateIcon />} color={theme === 'dark' ? "#7dd3fc" : "#0ea5e9"} theme={theme} />
          <KpiCard title="Total Sertifikat Terbit" value={totalPenerbitan} icon={<CertificateIcon />} color={theme === 'dark' ? "#818cf8" : "#6366f1"} theme={theme} />
        </motion.div>

        {/* Layout Utama: Filter Kiri, Konten Kanan */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* Kolom Filter Kiri */}
          <motion.div className="w-full md:w-1/4 lg:w-1/5" variants={itemVariant}>
            {/* --- AWAL PERUBAHAN: Menambahkan deskripsi di filter --- */}
            <div className={`rounded-lg p-3 space-y-2 backdrop-blur-sm border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/50 border-gray-200/50'}`}>
              <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Filter Data</h4>
               <p className={`px-2 text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pilih jenis data yang ingin ditampilkan pada grafik dan tabel di samping.</p>
               {filters.map(f => (
                <SideFilterButton key={f.key} text={f.text} icon={f.icon} onClick={() => setFilter(f.key)} isActive={filter === f.key} theme={theme} />
              ))}
            </div>
             {/* --- AKHIR PERUBAHAN --- */}
          </motion.div>

          {/* Kolom Konten Kanan */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {/* Kontainer Chart Vertikal */}
            <AnimatePresence mode="wait">
              <motion.div key={filter} // Key diganti agar AnimatePresence mendeteksi perubahan
                variants={chartSectionVariant} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6 mb-8" >
                {filter === 'pendaftaran' && (
                  <>
                    <ChartCard title={`Pendaftaran per Jenis Produk (${totalPendaftaran})`} csvData={dataPendaftaranJenisProduk} csvColumns={jenisProdukColumns} csvFilename="halal_pendaftaran_jenis_produk.csv" >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataPendaftaranJenisProduk} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8">
                            {dataPendaftaranJenisProduk.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS_JENIS_PRODUK[index % COLORS_JENIS_PRODUK.length]} /> ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                    <ChartCard title={`Pendaftaran per Skala Usaha (${totalPendaftaran})`} csvData={dataPendaftaranSkalaUsaha} csvColumns={skalaUsahaColumns} csvFilename="halal_pendaftaran_skala_usaha.csv" >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataPendaftaranSkalaUsaha} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8">
                            {dataPendaftaranSkalaUsaha.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS_SKALA_USAHA[index % COLORS_SKALA_USAHA.length]} /> ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </>
                )}
                {filter === 'penerbitan' && (
                  <>
                    <ChartCard title={`Penerbitan per Jenis Produk (${totalPenerbitan})`} csvData={dataPenerbitanJenisProduk} csvColumns={jenisProdukColumns} csvFilename="halal_penerbitan_jenis_produk.csv" >
                       <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataPenerbitanJenisProduk} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8">
                            {dataPenerbitanJenisProduk.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS_JENIS_PRODUK[index % COLORS_JENIS_PRODUK.length]} /> ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                    <ChartCard title={`Penerbitan per Skala Usaha (${totalPenerbitan})`} csvData={dataPenerbitanSkalaUsaha} csvColumns={skalaUsahaColumns} csvFilename="halal_penerbitan_skala_usaha.csv" >
                       <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataPenerbitanSkalaUsaha} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8">
                            {dataPenerbitanSkalaUsaha.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS_SKALA_USAHA[index % COLORS_SKALA_USAHA.length]} /> ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: legendColor }}>{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Tabel Dinamis di Bawah Chart */}
            <motion.div variants={itemVariant}>
               <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-sky-100' : 'text-sky-900'}`}>{tableTitle}</h3>
               <DynamicTable data={tableData} columns={tableColumns} theme={theme} />
            </motion.div>

          </div> {/* End Kolom Konten Kanan */}
        </div> {/* End Layout Utama */}
      </div>
    </motion.div>
  );
}

export default SertifikasiHalal;

