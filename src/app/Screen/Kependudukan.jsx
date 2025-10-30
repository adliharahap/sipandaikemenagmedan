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
const TotalPopIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM12.75 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
  </svg>
);
const MaleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.5 1.5 0 0118 21.75H6a1.5 1.5 0 01-1.499-1.632z" />
  </svg>
);
const FemaleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.5 1.5 0 0118 21.75H6a1.5 1.5 0 01-1.499-1.632z" />
  </svg>
);
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const AreaIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2.25 2.25 0 012.25 15.056V8.625a2.25 2.25 0 011.056-1.948L7.5 4.22m0 0l2.25 1.125m0 0l2.25 1.125m0 0l2.25 1.125m2.25-1.125L12 5.345m0 0L9.75 6.47m2.25-1.125L12 2.25L9 3.75m3 1.586L12 6.47l-2.25-1.125m6.75 0L15 6.47l2.25-1.125m0 0L21 3.75l-2.25 1.125M15 6.47L12 7.6m3-1.125L12 5.345m0 0l2.25 1.125M15 6.47l2.25 1.125m0 0l2.25 1.125m0 0v6.431a2.25 2.25 0 01-1.303 2.052L15 20M9 20l6-3m-6 3v-6.431a2.25 2.25 0 011.303-2.052L15 8.793M9 20l-3.303-1.652A2.25 2.25 0 014.5 16.297V8.625M9 20l2.25-1.125M15 8.793l2.25 1.125m-2.25-1.125L12 7.6m0 0L9.75 8.793m2.25-1.125L12 5.345M9.75 8.793L7.5 9.919m2.25-1.126L7.5 7.6M12 7.6L9 9.135m3-1.53L9.75 4.95m2.25 2.65L12 5.345" />
  </svg>
);
const KelurahanIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.272 5.622a2.25 2.25 0 013.409 0l1.22 1.221a2.25 2.25 0 003.18 0l1.22-1.221a2.25 2.25 0 013.409 0l1.22 1.221a2.25 2.25 0 003.18 0l1.22-1.221a2.25 2.25 0 013.409 0L21.75 7.5a2.25 2.25 0 010 3.18l-1.22 1.221a2.25 2.25 0 000 3.18l1.22 1.221a2.25 2.25 0 010 3.18l-1.22 1.221a2.25 2.25 0 01-3.409 0l-1.22-1.221a2.25 2.25 0 00-3.18 0l-1.22 1.221a2.25 2.25 0 01-3.409 0l-1.22-1.221a2.25 2.25 0 00-3.18 0l-1.22 1.221a2.25 2.25 0 01-3.409 0L2.25 16.5a2.25 2.25 0 010-3.18l1.22-1.221a2.25 2.25 0 000-3.18L2.25 7.5a2.25 2.25 0 010-3.18L3.272 5.622z" />
  </svg>
);
const DensityIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.519 2.27A9.094 9.094 0 0112 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 00-4.682-2.72m7.519 2.27c.459.083.92.146 1.395.192 1.02.087 2.07.14 3.15.14 1.08 0 2.13-.053 3.15-.14a2.25 2.25 0 011.664 2.284 2.25 2.25 0 01-1.664 2.284c-1.02.087-2.07.14-3.15.14-1.08 0-2.13-.053-3.15-.14a2.25 2.25 0 01-1.664-2.284 2.25 2.25 0 011.664-2.284zM12 14.25a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25A5.25 5.25 0 1012 3.75a5.25 5.25 0 000 10.5zM12 14.25a.75.75 0 010 1.5.75.75 0 010-1.5z" />
  </svg>
);

// --- 2. Mock Data Kependudukan (DIHAPUS) ---
// Data statis dihapus, akan diganti dari Redux

// --- 3. Komponen Kalkulasi & Data (PINDAH KE DALAM KOMPONEN) ---
// const totalLakiLaki = ... (dipindah)

// --- 4. Komponen Angka Animasi ---
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

  // Tampilkan 0 atau 0.00 sebagai placeholder awal
  return <span ref={ref}>{isDecimal ? "0,00" : "0"}</span>;
};


// --- 5. Komponen Tooltip Kustom ---
const CustomTooltip = ({ active, payload, label, theme, chartType, dataType = 'populasi' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    if (chartType === 'pie') {
      const percent = (payload[0].percent * 100).toFixed(2);
      return (
        <div className={`rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#2E1A47] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{data.name}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Jumlah: {data.value.toLocaleString('id-ID')}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Persentase: {percent}%
          </p>
        </div>
      );
    }

    if (chartType === 'bar') {
      // Tooltip untuk data Populasi
      if (dataType === 'populasi') {
        return (
          <div className={`rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#2E1A47] border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} style={{ color: '#60A5FA' }}>
              Laki-laki: {data.laki_laki.toLocaleString('id-ID')}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} style={{ color: '#F87171' }}>
              Perempuan: {data.perempuan.toLocaleString('id-ID')}
            </p>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Total: {data.total.toLocaleString('id-ID')}
            </p>
          </div>
        );
      }
      
      // Tooltip untuk data Wilayah
      if (dataType === 'wilayah') {
        // Ambil warna dari konstanta yang didefinisikan di dalam komponen utama
        const LUAS_COLOR = "#F59E0B"; 
        const KEPADATAN_COLOR = "#EF4444";
        return (
          <div className={`rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#2E1A47] border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} style={{ color: LUAS_COLOR }}>
              Luas: {data.luas_wilayah.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km²
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} style={{ color: KEPADATAN_COLOR }}>
              Kepadatan: {Math.round(data.kepadatan).toLocaleString('id-ID')} jiwa/km²
            </p>
          </div>
        );
      }
    }
  }
  return null;
};

// --- 6. Komponen Kartu KPI ---
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


// --- 7. Komponen Utama Kependudukan ---
const Kependudukan = () => {
  const { theme } = useTheme();

  // --- PERUBAHAN 1: Ambil data dari Redux Store ---
  const { data, status } = useSelector((state) => state.landingData);
  
  const [chartType, setChartType] = useState('bar'); // 'bar' atau 'pie'
  const [areaChartType, setAreaChartType] = useState('luas'); // 'luas' atau 'kepadatan'
  
  // --- PERUBAHAN 2: Loading dan Error State ---
  const backgroundStyle = theme === "dark" ? "bg-[#210F37]" : "bg-[#E4EFE7]";
  if (status === 'loading' || status === 'idle') {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center p-4 text-center ${backgroundStyle}`}>
        <p className={`text-lg ${theme === 'dark' ? 'text-purple-300' : 'text-gray-700'}`}>
          Memuat Data Kependudukan...
        </p>
      </div>
    );
  }

  if (status === 'failed' || !data || !data.kependudukan || !data.kependudukan.data) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center p-4 text-center ${backgroundStyle}`}>
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          Gagal memuat Data Kependudukan. Silakan coba muat ulang halaman.
        </p>
      </div>
    );
  }

  // --- PERUBAHAN 3: Definisikan data DARI REDUX dan lakukan kalkulasi ---
  const dataKependudukan = data.kependudukan.data.map(item => ({
    ...item,
    // Pastikan kalkulasi menangani nilai null/undefined
    total: (item.laki_laki || 0) + (item.perempuan || 0),
    kepadatan: item.luas_wilayah ? ((item.laki_laki || 0) + (item.perempuan || 0)) / item.luas_wilayah : 0
  }));

  // --- PERUBAHAN 4: Kalkulasi total (dari data yang sudah diproses) ---
  const totalLakiLaki = dataKependudukan.reduce((acc, curr) => acc + curr.laki_laki, 0);
  const totalPerempuan = dataKependudukan.reduce((acc, curr) => acc + curr.perempuan, 0);
  const totalPenduduk = totalLakiLaki + totalPerempuan;
  const totalLuasWilayah = dataKependudukan.reduce((acc, curr) => acc + curr.luas_wilayah, 0);
  const totalKelurahan = dataKependudukan.reduce((acc, curr) => acc + curr.kelurahan, 0);
  const rataRataKepadatan = totalPenduduk / totalLuasWilayah;

  const dataGender = [
    { name: "Laki-laki", value: totalLakiLaki, color: "#60A5FA" },
    { name: "Perempuan", value: totalPerempuan, color: "#F87171" },
  ];
  const GENDER_COLORS = dataGender.map(d => d.color);
  const KECAMATAN_COLOR = "#34D399"; // Warna hijau untuk bar kecamatan
  const LUAS_COLOR = "#F59E0B"; // Oranye
  const KEPADATAN_COLOR = "#EF4444"; // Merah
  const KELURAHAN_COLOR = "#A78BFA"; // Ungu

  // Fungsi Download CSV
  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Kode,Kecamatan,Laki_Laki,Perempuan,Total,Kelurahan,Luas_Wilayah_km2,Kepadatan_jiwa_per_km2\n";
    dataKependudukan.forEach(row => {
      csvContent += `${row.kode},${row.kecamatan},${row.laki_laki},${row.perempuan},${row.total},${row.kelurahan},${row.luas_wilayah.toFixed(2)},${Math.round(row.kepadatan)}\n`;
    });
    // Tambahkan baris total
    csvContent += `\nTotal,,${totalLakiLaki},${totalPerempuan},${totalPenduduk},${totalKelurahan},${totalLuasWilayah.toFixed(2)},\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kependudukan_kota_medan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const textLabelColor = theme === 'dark' ? '#D1D5DB' : '#374151';
  const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';

  return (
    <motion.div 
      id="kependudukan" // Menambahkan ID untuk navigasi
      className={`w-full py-24 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-[#210F37]" : "bg-[#E4EFE7]"}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }} // Memicu lebih awal
      variants={containerVariant}
    >
      <div className="mx-auto md:mx-12">
        {/* Judul Sesi */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariant}
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-500' : 'from-emerald-700 to-green-900'}`}>
            Statistik Kependudukan
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Analisis data penduduk Kota Medan berdasarkan Kecamatan dan Jenis Kelamin.
          </p>
        </motion.div>

        {/* Kartu KPI */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariant}
        >
          <KpiCard
            title="Total Penduduk"
            value={totalPenduduk}
            icon={<TotalPopIcon />}
            color={KECAMATAN_COLOR}
            theme={theme}
          />
          <KpiCard
            title="Total Laki-laki"
            value={totalLakiLaki}
            icon={<MaleIcon />}
            color={dataGender[0].color} // Biru
            theme={theme}
          />
          <KpiCard
            title="Total Perempuan"
            value={totalPerempuan}
            icon={<FemaleIcon />}
            color={dataGender[1].color} // Merah
            theme={theme}
          />
        </motion.div>
        
        {/* Kontainer Utama Sesi Chart & Tabel */}
        <motion.div 
          className={`rounded-2xl shadow-xl p-4 sm:p-8 ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}
          variants={itemVariant}
        >
          {/* Layout Wrapper (Desktop: Horizontal, Mobile: Vertical) */}
          <div className="lg:flex lg:gap-8">

            {/* Kolom Kiri: Kontrol & Chart */}
            <div className="lg:w-2/3">
              {/* Kontrol (Select Box & Download) */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
                variants={itemVariant}
              >
                {/* Select Box */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className={`w-full sm:w-56 appearance-none rounded-lg border-2 py-2 px-4 pr-10 font-medium shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-700 focus:ring-purple-600 focus:border-purple-600'}`}
                  >
                    <option value="bar">Populasi per Kecamatan</option>
                    <option value="pie">Distribusi Gender</option>
                  </select>
                  <span className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>

                {/* Tombol Download CSV */}
                <button
                  onClick={handleDownloadCSV}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm transition-all duration-300 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' 
                    ? 'bg-purple-500 text-gray-900 hover:bg-purple-400 focus:ring-purple-400 focus:ring-offset-gray-800' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-600 focus:ring-offset-white'}`}
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download CSV
                </button>
              </motion.div>

              {/* Chart */}
              <motion.div 
                className="w-full h-[400px] sm:h-[500px] min-w-0"
                variants={itemVariant}
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <PieChart>
                      <Pie
                        data={dataGender}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius="50%"
                        outerRadius="85%"
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1000}
                      >
                        {dataGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} className="focus:outline-none outline-none" tabIndex={-1} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip theme={theme} chartType="pie" />} />
                      <Legend formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{value}</span>} />
                    </PieChart>
                  ) : ( // Bar Chart
                    <BarChart data={dataKependudukan} margin={{ top: 5, right: 5, left: -20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis 
                        dataKey="kecamatan" 
                        tick={{ fill: textLabelColor, fontSize: 10 }} 
                        angle={-45} 
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)} tick={{ fill: textLabelColor, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip theme={theme} chartType="bar" dataType="populasi" />} />
                      <Legend 
                        verticalAlign="top" 
                        formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{value === 'laki_laki' ? 'Laki-laki' : 'Perempuan'}</span>} 
                      />
                      <Bar dataKey="laki_laki" stackId="a" fill={dataGender[0].color} isAnimationActive={true} animationDuration={1000} />
                      <Bar dataKey="perempuan" stackId="a" fill={dataGender[1].color} isAnimationActive={true} animationDuration={1000} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            </div> {/* End Kolom Kiri */}

            {/* Kolom Kanan: Tabel Data */}
            <div className="lg:w-1/3 mt-12 lg:mt-0">
              {/* Judul Data Rinci */}
              <motion.div 
                className="text-left mb-4"
                variants={itemVariant}
              >
                <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Rincian Data
                </h3>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Data per 21 Kecamatan.
                </p>
              </motion.div>

              {/* Tabel Data (Scrollable) */}
              <motion.div
                variants={itemVariant}
                className={`w-full max-h-[550px] overflow-y-auto rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <tr>
                      <th scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Kecamatan
                      </th>
                      <th scope="col" className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {dataKependudukan.map((item) => (
                      <tr key={item.kode} className={theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.kecamatan}
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          {item.total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div> {/* End Kolom Kanan */}

          </div> {/* End Layout Wrapper */}
        </motion.div>
        
        {/* --- BAGIAN BARU: LUAS WILAYAH & KEPADATAN --- */}
        <motion.div 
          className={`rounded-2xl shadow-xl p-4 sm:p-8 mt-12 ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}
          variants={itemVariant}
        >
          {/* Judul Sesi */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariant}
          >
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-orange-400 to-red-500' : 'from-orange-600 to-red-700'}`}>
              Analisis Wilayah & Kepadatan
            </h2>
            <p className={`mt-4 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Visualisasi luas wilayah dan kepadatan penduduk per kilometer persegi di setiap kecamatan.
            </p>
          </motion.div>

          {/* Kartu KPI Wilayah */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={containerVariant}
          >
            <KpiCard
              title="Total Luas Wilayah"
              value={totalLuasWilayah}
              icon={<AreaIcon />}
              color={LUAS_COLOR}
              theme={theme}
              suffix=" km²"
              isDecimal={true}
            />
            <KpiCard
              title="Total Kelurahan"
              value={totalKelurahan}
              icon={<KelurahanIcon />}
              color={KELURAHAN_COLOR}
              theme={theme}
            />
            <KpiCard
              title="Kepadatan Rata-rata"
              value={rataRataKepadatan}
              icon={<DensityIcon />}
              color={KEPADATAN_COLOR}
              theme={theme}
              suffix=" jiwa/km²"
              isDecimal={true} 
            />
          </motion.div>

          {/* Kontrol Chart Wilayah */}
          <motion.div 
            className="flex justify-start items-center mb-8 gap-4 pl-12"
            variants={itemVariant}
          >
            <div className="relative w-full sm:w-auto">
              <select
                value={areaChartType}
                onChange={(e) => setAreaChartType(e.target.value)}
                className={`w-full sm:w-56 appearance-none rounded-lg border-2 py-2 px-4 pr-10 font-medium shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-orange-500 focus:border-orange-500' 
                  : 'bg-white border-gray-300 text-gray-700 focus:ring-orange-600 focus:border-orange-600'}`}
              >
                <option value="luas">Luas Wilayah</option>
                <option value="kepadatan">Kepadatan Penduduk</option>
              </select>
              <span className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
          </motion.div>

          {/* Chart Wilayah */}
          <motion.div 
            className="w-full h-[400px] sm:h-[500px] min-w-0"
            variants={itemVariant}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataKependudukan} margin={{ top: 5, right: 5, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="kecamatan" 
                  tick={{ fill: textLabelColor, fontSize: 10 }} 
                  angle={-45} 
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)} 
                  tick={{ fill: textLabelColor, fontSize: 12 }} 
                  yAxisId="left"
                />
                <Tooltip content={<CustomTooltip theme={theme} chartType="bar" dataType="wilayah" />} />
                <Legend 
                  verticalAlign="top" 
                  formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{value === 'luas_wilayah' ? 'Luas Wilayah (km²)' : 'Kepadatan (jiwa/km²)'}</span>}
                />
                {areaChartType === 'luas' ? (
                  <Bar yAxisId="left" dataKey="luas_wilayah" fill={LUAS_COLOR} isAnimationActive={true} animationDuration={1000} />
                ) : (
                  <Bar yAxisId="left" dataKey="kepadatan" fill={KEPADATAN_COLOR} isAnimationActive={true} animationDuration={1000} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
        {/* --- AKHIR BAGIAN BARU --- */}
        
      </div>
    </motion.div>
  );
}

export default Kependudukan;
