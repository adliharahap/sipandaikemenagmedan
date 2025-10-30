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
    ComposedChart, // Mengganti beberapa BarChart dengan ComposedChart
    Line,
} from "recharts";
// Import useSelector untuk mengambil data dari Redux
import { useSelector } from "react-redux";

// --- 1. Ikon SVG Kustom ---
const GraduationCapIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
);
const BuildingLibraryIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);
const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-7.5 3.75a2.25 2.25 0 01-4.5 0v-.75a.75.75 0 01.75-.75h3.75a.75.75 0 01.75.75v.75zm15 3.75a2.25 2.25 0 01-4.5 0v-.75a.75.75 0 01.75-.75h3.75a.75.75 0 01.75.75v.75z" />
    </svg>
);
const RectangleGroupIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125A2.25 2.25 0 014.5 4.875h15A2.25 2.25 0 0121.75 7.125v1.517a2.25 2.25 0 01-1.375 2.064L12 15.75l-8.375-3.044A2.25 2.25 0 012.25 8.642V7.125zM15.75 14.63l-3.75 1.364l-3.75-1.364V9.375h7.5v5.25z" />
    </svg>
);
const CheckBadgeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
);
const BookOpenVariantIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
    </svg>
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

// --- 2. Data dari CSV (DIHAPUS & DIGANTIKAN REDUX) ---

// --- Definisi Kolom Tabel (TETAP DIPERLUKAN) ---
const kecamatanList = [
    "Medan Kota", "Medan Sunggal", "Medan Helvetia", "Medan Denai", "Medan Barat",
    "Medan Deli", "Medan Tuntungan", "Medan Belawan", "Medan Amplas", "Medan Area",
    "Medan Johor", "Medan Marelan", "Medan Labuhan", "Medan Tembung", "Medan Maimun",
    "Medan Polonia", "Medan Baru", "Medan Perjuangan", "Medan Petisah", "Medan Timur",
    "Medan Selayang"
];
const raColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'RA', key: 'ra', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const minColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'MIN', key: 'min', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const misColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'MIS', key: 'mis', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const mtsnColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'MTsN', key: 'mtsn', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const mtssColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'MTsS', key: 'mtss', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const manColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'MAN', key: 'man', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const masColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'MAS', key: 'mas', align: 'right' },
    { header: 'Guru', key: 'guru', align: 'right' },
    { header: 'Siswa', key: 'siswa', align: 'right' },
    { header: 'Rombel', key: 'rombel', align: 'right' },
];
const akreditasiColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'A', key: 'a', align: 'right' },
    { header: 'B', key: 'b', align: 'right' },
    { header: 'C', key: 'c', align: 'right' },
    { header: 'TT', key: 'tt', align: 'right' },
];
const diniyahColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'Awaliyah', key: 'awaliyah', align: 'right' },
    { header: 'Wustha', key: 'wustha', align: 'right' },
    { header: 'Ulya', key: 'ulya', align: 'right' },
    { header: 'Total', key: 'total', align: 'right' },
];


// --- 3. Komponen Angka Animasi ---
const AnimatedNumber = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && ref.current) {
            animate(0, value, {
                duration: 1.5,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = Math.round(latest).toLocaleString('id-ID');
                    }
                },
            });
        }
    }, [isInView, value]); // Re-animasi jika nilai berubah (berguna jika filter)

    return <span ref={ref}>{value.toLocaleString('id-ID')}</span>;
};


// --- 4. Komponen Kartu KPI Pendidikan (Gaya Kependudukan) ---
const KpiCardPendidikan = ({ icon, title, value, color, theme, small = false }) => {
    const cardVariant = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
    
    // Gaya dari Kependudukan
    const cardBackground = theme === 'dark' 
      ? `linear-gradient(140deg, ${color}1A 0%, #2E1A47 50%)`
      : `linear-gradient(140deg, ${color}1A 0%, #FFFFFF 50%)`;

    return (
        <motion.div
            variants={cardVariant}
            className={`relative w-full overflow-hidden rounded-2xl p-5 shadow-lg ${small ? 'p-3' : 'p-5'}`} // Prop 'small' tetap dipertahankan
            style={{ background: cardBackground }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <div className={`flex items-center ${small ? 'space-x-3' : 'space-x-4'}`}>
                {/* Ukuran ikon disesuaikan dengan prop 'small' */}
                <div className={`flex-shrink-0 rounded-full flex items-center justify-center ${small ? 'w-8 h-8' : 'w-12 h-12'}`} style={{ backgroundColor: `${color}20` }}>
                    {React.cloneElement(icon, { style: { color: color }, className: small ? "w-4 h-4" : "w-6 h-6" })}
                </div>
                <div>
                    {/* Ukuran font disesuaikan dengan prop 'small' */}
                    <h3 className={`font-semibold uppercase tracking-wider ${small ? 'text-xs' : 'text-lg'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <p className={`font-bold ${small ? 'text-xl' : 'text-3xl'} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} style={{ color: color }}>
                        <AnimatedNumber value={value} />
                    </p>
                </div>
            </div>
        </motion.div>
    );
};


// --- 5. Komponen Kartu Chart Pendidikan (Gaya Kependudukan) ---
const ChartCardPendidikan = ({
    title,
    data, 
    chartKey,
    chartName,
    chartColor,
    categoryKey = 'kecamatan',
    csvFilename,
    csvColumns,
    theme,
    className = ""
}) => {
    const itemVariant = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 } } };
    const handleDownloadCSV = () => {
        if (!data || data.length === 0 || !csvColumns || csvColumns.length === 0) return;
        const headers = csvColumns.map(col => col.header);
        const keys = csvColumns.map(col => col.key);
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\n";
        data.forEach(row => {
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

    // Gaya dari Kependudukan
    const cardBgColor = theme === 'dark' ? '#2E1A47' : '#FFFFFF';
    const textLabelColor = theme === 'dark' ? '#D1D5DB' : '#374151';
    const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const downloadButtonColor = theme === 'dark' 
        ? 'bg-purple-500 text-gray-900 hover:bg-purple-400 focus:ring-purple-400 focus:ring-offset-gray-800' 
        : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-600 focus:ring-offset-white';

    return (
        <motion.div variants={itemVariant} className={`rounded-2xl shadow-xl overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor }}>
            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className={`text-lg font-semibold ${titleColor}`}> {title} </h3>
                    <button onClick={handleDownloadCSV} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${downloadButtonColor}`}>
                        <DownloadIcon className="w-3.5 h-3.5" /> Download CSV
                    </button>
                </div>
                <div className="h-72 sm:h-80 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
                                dataKey={categoryKey}
                                tick={{ fill: textLabelColor, fontSize: 9 }}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={60}
                            />
                            <YAxis tick={{ fill: textLabelColor, fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip theme={theme} />} />
                            <defs>
                                <linearGradient id={`color${chartKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <Bar dataKey={chartKey} name={chartName} fill={`url(#color${chartKey})`} barSize={20} radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};


// --- 6. Komponen Tombol Filter Pendidikan (Gaya Kependudukan) ---
const FilterButtonPendidikan = ({ text, icon, onClick, isActive, theme }) => {
    // Gaya dari Kependudukan (menggunakan style <select>)
    const activeBg = theme === 'dark' ? 'bg-purple-600' : 'bg-purple-600';
    const activeText = theme === 'dark' ? 'text-white' : 'text-white';
    const inactiveText = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/40' : 'hover:bg-gray-100/60';

    return (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 relative ${isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${inactiveBgHover}`}`}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
        >
            {isActive && (
                <motion.div
                    layoutId="filter-highlight-pendidikan"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r-full" // Highlight ala Kependudukan
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}
            <motion.div className="relative z-10 flex items-center gap-3">
                {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
                <span className="text-sm">{text}</span>
            </motion.div>
        </motion.button>
    );
};


// --- 7. Komponen Tooltip Kustom (reuse, slightly adapted) ---
const CustomTooltip = ({ active, payload, label, theme }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const name = label || data.payload?.kecamatan || data.name;
        const value = data.value;
        
        // Gaya dari Kependudukan
        return (
            <div className={`rounded-lg p-3 shadow-lg ${theme === 'dark' ? 'bg-[#2E1A47] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <p className={`font-semibold text-sm mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</p>
                {payload.map((pld, index) => (
                    <p key={index} className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium" style={{ color: pld.color || pld.fill }}>{pld.name || 'Jumlah'}</span>: {pld.value?.toLocaleString('id-ID')}
                    </p>
                ))}
                {data.payload?.percent && (
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Persentase: {(data.payload.percent * 100).toFixed(1)}%
                    </p>
                )}
            </div>
        );
    }
    return null;
};

// --- 8. Komponen Tabel Dinamis (Gaya Kependudukan) ---
const DynamicTablePendidikan = ({ title, data, columns, theme, className = "" }) => {
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
    const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    
    const itemVariant = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 } } };

        return (
        <motion.div variants={itemVariant} className={`rounded-2xl shadow-xl overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor }}>
            <div className="p-4 sm:p-5">
                <h3 className={`text-lg font-semibold mb-5 ${titleColor}`}> {title} </h3>
                {(!data || data.length === 0) ? (
                    <p className={`text-center text-sm py-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada data untuk ditampilkan pada tabel ini.</p>
                ) : (
                    <div className={`w-full max-h-[400px] overflow-auto rounded-lg border ${tableBg} ${tableBorder}`}>
                        <table className="min-w-full divide-y ${rowBorder}">
                            <thead className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10`}><tr>
                                    {columns.map((col) => (
                                        <th key={col.key} scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerText} ${col.align === 'right' ? 'text-right' : ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr></thead>
                            <tbody className={`divide-y ${rowBorder}`}>
                                {data.map((item, index) => (
                                    <tr key={index} className={`transition-colors duration-150 ${rowHover}`}>
                                        {columns.map((col) => (
                                            <td key={col.key} className={`px-4 py-3 whitespace-nowrap text-sm ${col.align === 'right' ? 'text-right' : ''} ${col.key === 'kecamatan' || col.key === 'kua' ? `font-medium ${cellTextPrimary}` : cellText}`}>
                                                {(typeof item[col.key] === 'number') ? item[col.key].toLocaleString('id-ID') : (item[col.key] != null ? item[col.key] : '0')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
};


// --- 9. Komponen Utama PendidikanMadrasah ---
const PendidikanMadrasah = () => {
    const { theme } = useTheme();

    // --- Ambil data dari Redux Store ---
    const { data, status } = useSelector((state) => state.landingData);
    
    const [filter, setFilter] = useState('ringkasan');
    const [chartMetric, setChartMetric] = useState('siswa');

    // --- Loading dan Error State ---
    const backgroundStyle = theme === "dark" 
        ? { backgroundColor: "#210F37" } 
        : { backgroundColor: "#E4EFE7" };
        
    if (status === 'loading' || status === 'idle') {
        return (
          <div className={`w-full min-h-screen flex items-center justify-center p-4 text-center`} style={backgroundStyle}>
            <p className={`text-lg ${theme === 'dark' ? 'text-purple-300' : 'text-gray-700'}`}>
              Memuat Data Pendidikan...
            </p>
          </div>
        );
    }
    
    if (status === 'failed' || !data || !data.pendidikan) {
        return (
          <div className={`w-full min-h-screen flex items-center justify-center p-4 text-center`} style={backgroundStyle}>
            <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              Gagal memuat Data Pendidikan. Silakan coba muat ulang halaman.
            </p>
          </div>
        );
    }
    
    // --- Definisikan data DARI REDUX ---
    const dataRA = data.pendidikan.dataRA?.data || [];
    const dataMIN_raw = data.pendidikan.dataMIN?.data || [];
    const dataMIS_raw = data.pendidikan.dataMIS?.data || [];
    const dataMTsN_raw = data.pendidikan.dataMTsN?.data || [];
    const dataMTsS_raw = data.pendidikan.dataMTsS?.data || [];
    const dataMAN_raw = data.pendidikan.dataMAN?.data || [];
    const dataMAS_raw = data.pendidikan.dataMAS?.data || [];
    const dataDiniyah = data.pendidikan.dataDiniyah?.data || [];
    
    // Data Akreditasi (Kosong sesuai data asli)
    const dataAkreditasiRA = [];
    const dataAkreditasiMIN = [];
    const dataAkreditasiMIS = [];

    // --- Normalisasi Data (Menambahkan kecamatan yang hilang) ---
    const createDataMap = (dataArray) => new Map(dataArray.map(item => [item.kecamatan, item]));

    const raMap = createDataMap(dataRA);
    const minMap = createDataMap(dataMIN_raw);
    const misMap = createDataMap(dataMIS_raw);
    const mtsnMap = createDataMap(dataMTsN_raw);
    const mtssMap = createDataMap(dataMTsS_raw);
    const manMap = createDataMap(dataMAN_raw);
    const masMap = createDataMap(dataMAS_raw);
    const diniyahMap = createDataMap(dataDiniyah);

    const dataGabunganKecamatan = kecamatanList.map(kec => {
        const ra = raMap.get(kec) || { ra: 0, guru: 0, siswa: 0, rombel: 0 };
        const min = minMap.get(kec) || { min: 0, guru: 0, siswa: 0, rombel: 0 };
        const mis = misMap.get(kec) || { mis: 0, guru: 0, siswa: 0, rombel: 0 };
        const mtsn = mtsnMap.get(kec) || { mtsn: 0, guru: 0, siswa: 0, rombel: 0 };
        const mtss = mtssMap.get(kec) || { mtss: 0, guru: 0, siswa: 0, rombel: 0 };
        const man = manMap.get(kec) || { man: 0, guru: 0, siswa: 0, rombel: 0 };
        const mas = masMap.get(kec) || { mas: 0, guru: 0, siswa: 0, rombel: 0 };
        const diniyah = diniyahMap.get(kec) || { awaliyah: 0, total: 0 };

        return {
            kecamatan: kec,
            ra_sekolah: ra.ra, ra_guru: ra.guru, ra_siswa: ra.siswa, ra_rombel: ra.rombel,
            mi_sekolah: min.min + mis.mis, mi_guru: min.guru + mis.guru, mi_siswa: min.siswa + mis.siswa, mi_rombel: min.rombel + mis.rombel,
            mts_sekolah: mtsn.mtsn + mtss.mtss, mts_guru: mtsn.guru + mtss.guru, mts_siswa: mtsn.siswa + mtss.siswa, mts_rombel: mtsn.rombel + mtss.rombel,
            ma_sekolah: man.man + mas.mas, ma_guru: man.guru + mas.guru, ma_siswa: man.siswa + mas.siswa, ma_rombel: man.rombel + mas.rombel,
            diniyah: diniyah.total,
            // Data mentah untuk tabel
            ra, min, mis, mtsn, mtss, man, mas, diniyah
        };
    });

    // Buat data tabel yang sudah dinormalisasi
    const dataRATable = dataGabunganKecamatan.map(d => ({ ...d.ra, kecamatan: d.kecamatan }));
    const dataMINTable = dataGabunganKecamatan.map(d => ({ ...d.min, kecamatan: d.kecamatan }));
    const dataMISTable = dataGabunganKecamatan.map(d => ({ ...d.mis, kecamatan: d.kecamatan }));
    const dataMTsNTable = dataGabunganKecamatan.map(d => ({ ...d.mtsn, kecamatan: d.kecamatan }));
    const dataMTsSTable = dataGabunganKecamatan.map(d => ({ ...d.mtss, kecamatan: d.kecamatan }));
    const dataMANTable = dataGabunganKecamatan.map(d => ({ ...d.man, kecamatan: d.kecamatan }));
    const dataMASTable = dataGabunganKecamatan.map(d => ({ ...d.mas, kecamatan: d.kecamatan }));
    const dataDiniyahTable = dataGabunganKecamatan.map(d => ({ ...d.diniyah, kecamatan: d.kecamatan }));


    // --- Kalkulasi Total ---
    const totalRA = dataRATable.reduce((acc, curr) => ({ ra: acc.ra + (curr.ra || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { ra: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalMIN = dataMINTable.reduce((acc, curr) => ({ min: acc.min + (curr.min || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { min: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalMIS = dataMISTable.reduce((acc, curr) => ({ mis: acc.mis + (curr.mis || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { mis: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalMTsN = dataMTsNTable.reduce((acc, curr) => ({ mtsn: acc.mtsn + (curr.mtsn || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { mtsn: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalMTsS = dataMTsSTable.reduce((acc, curr) => ({ mtss: acc.mtss + (curr.mtss || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { mtss: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalMAN = dataMANTable.reduce((acc, curr) => ({ man: acc.man + (curr.man || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { man: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalMAS = dataMASTable.reduce((acc, curr) => ({ mas: acc.mas + (curr.mas || 0), guru: acc.guru + (curr.guru || 0), siswa: acc.siswa + (curr.siswa || 0), rombel: acc.rombel + (curr.rombel || 0) }), { mas: 0, guru: 0, siswa: 0, rombel: 0 });
    const totalDiniyah = dataDiniyahTable.reduce((acc, curr) => ({ awaliyah: acc.awaliyah + (curr.awaliyah || 0), wustha: acc.wustha + (curr.wustha || 0), ulya: acc.ulya + (curr.ulya || 0), total: acc.total + (curr.total || 0) }), { awaliyah: 0, wustha: 0, ulya: 0, total: 0 });

    const totalMI = { sekolah: totalMIN.min + totalMIS.mis, guru: totalMIN.guru + totalMIS.guru, siswa: totalMIN.siswa + totalMIS.siswa, rombel: totalMIN.rombel + totalMIS.rombel };
    const totalMTs = { sekolah: totalMTsN.mtsn + totalMTsS.mtss, guru: totalMTsN.guru + totalMTsS.guru, siswa: totalMTsN.siswa + totalMTsS.siswa, rombel: totalMTsN.rombel + totalMTsS.rombel };
    const totalMA = { sekolah: totalMAN.man + totalMAS.mas, guru: totalMAN.guru + totalMAS.guru, siswa: totalMAN.siswa + totalMAS.siswa, rombel: totalMAN.rombel + totalMAS.rombel };


    const filters = [
        { key: 'ringkasan', text: 'Ringkasan Umum', icon: <GraduationCapIcon /> },
        { key: 'ra', text: 'Raudhatul Athfal (RA)', icon: <BuildingLibraryIcon /> },
        { key: 'mi', text: 'Madrasah Ibtidaiyah (MI)', icon: <BuildingLibraryIcon /> },
        { key: 'mts', text: 'Madrasah Tsanawiyah (MTs)', icon: <BuildingLibraryIcon /> },
        { key: 'ma', text: 'Madrasah Aliyah (MA)', icon: <BuildingLibraryIcon /> },
        { key: 'diniyah', text: 'Diniyah Takmiliyah', icon: <BookOpenVariantIcon /> },
        { key: 'akreditasi', text: 'Status Akreditasi', icon: <CheckBadgeIcon /> },
    ];

    const containerVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } } };
    const sectionVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeInOut', staggerChildren: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } } };

    // Options for Ringkasan Chart Metric Selector
    const metricOptions = [
        { key: 'siswa', name: 'Jumlah Siswa' },
        { key: 'guru', name: 'Jumlah Guru' },
        { key: 'sekolah', name: 'Jumlah Sekolah' },
        { key: 'rombel', name: 'Jumlah Rombel' },
    ];

    // Dynamically get chart data based on selected metric for Ringkasan
    const getRingkasanChartData = (metric) => {
        return dataGabunganKecamatan.map(item => ({
            kecamatan: item.kecamatan,
            RA: item[`ra_${metric}`] || 0,
            MI: item[`mi_${metric}`] || 0,
            MTs: item[`mts_${metric}`] || 0,
            MA: item[`ma_${metric}`] || 0,
        }));
    };

    const ringkasanChartData = getRingkasanChartData(chartMetric);
    const selectedMetricName = metricOptions.find(opt => opt.key === chartMetric)?.name || 'Data';

    // Warna dari Kependudukan
    const KECAMATAN_COLOR = "#34D399";
    const LUAS_COLOR = "#F59E0B";
    const KEPADATAN_COLOR = "#EF4444";
    const KELURAHAN_COLOR = "#A78BFA";
    const ringkasanColors = [KECAMATAN_COLOR, LUAS_COLOR, KEPADATAN_COLOR, KELURAHAN_COLOR];

    return (
        <motion.div
            id="pendidikan-madrasah"
            className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={backgroundStyle} // Menggunakan style Kependudukan
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={containerVariant}
        >
            <div className="mx-auto md:mx-12 relative z-10">
                <motion.div className="text-center mb-12" variants={itemVariant}>
                    <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-500' : 'from-emerald-700 to-green-900'}`} style={{ lineHeight: '1.2' }}>
                        Statistik Pendidikan Madrasah
                    </h2>
                    <p className={`mt-4 text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Data Raudhatul Athfal (RA), Madrasah Ibtidaiyah (MI), Tsanawiyah (MTs), Aliyah (MA), dan Diniyah Takmiliyah di Kota Medan.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- Filter Sidebar (Gaya Kependudukan) --- */}
                    <motion.div className="w-full lg:w-1/4 xl:w-1/5" variants={itemVariant}>
                        <div className={`rounded-2xl p-4 space-y-2 shadow-xl ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}>
                            <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Jenjang Pendidikan</h4>
                            {filters.map(f => (
                                <FilterButtonPendidikan
                                    key={f.key}
                                    text={f.text}
                                    icon={f.icon}
                                    onClick={() => setFilter(f.key)}
                                    isActive={filter === f.key}
                                    theme={theme}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* --- Content Area --- */}
                    <div className="w-full lg:w-3/4 xl:w-4/5">
                        <AnimatePresence mode="wait">
                            {/* --- Ringkasan Umum --- */}
                            {filter === 'ringkasan' && (
                                <motion.div key="ringkasan" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10" variants={containerVariant}>
                                        <KpiCardPendidikan title="Total RA" value={totalRA.ra} icon={<BuildingLibraryIcon />} color={ringkasanColors[0]} theme={theme} small />
                                        <KpiCardPendidikan title="Total MI" value={totalMI.sekolah} icon={<BuildingLibraryIcon />} color={ringkasanColors[1]} theme={theme} small />
                                        <KpiCardPendidikan title="Total MTs" value={totalMTs.sekolah} icon={<BuildingLibraryIcon />} color={ringkasanColors[2]} theme={theme} small />
                                        <KpiCardPendidikan title="Total MA" value={totalMA.sekolah} icon={<BuildingLibraryIcon />} color={ringkasanColors[3]} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa RA`} value={totalRA.siswa} icon={<UsersIcon />} color={ringkasanColors[0]} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa MI`} value={totalMI.siswa} icon={<UsersIcon />} color={ringkasanColors[1]} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa MTs`} value={totalMTs.siswa} icon={<UsersIcon />} color={ringkasanColors[2]} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa MA`} value={totalMA.siswa} icon={<UsersIcon />} color={ringkasanColors[3]} theme={theme} small />
                                    </motion.div>

                                    {/* Metric Selector (Gaya Kependudukan) */}
                                    <motion.div variants={itemVariant} className={`p-4 rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}>
                                        <label htmlFor="metricSelect" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Tampilkan Data Berdasarkan:
                                        </label>
                                        <select
                                            id="metricSelect"
                                            value={chartMetric}
                                            onChange={(e) => setChartMetric(e.target.value)}
                                            className={`w-full p-2 rounded-md border text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'}`}
                                        >
                                            {metricOptions.map(opt => (
                                                <option key={opt.key} value={opt.key}>{opt.name}</option>
                                            ))}
                                        </select>
                                    </motion.div>

                                    {/* Combined Chart for Ringkasan (Gaya Kependudukan) */}
                                    <motion.div variants={itemVariant} className={`rounded-2xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-[#2E1A47]' : 'bg-white'}`}>
                                        <div className="p-4 sm:p-5">
                                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Perbandingan {selectedMetricName} per Kecamatan</h3>
                                            <div className="h-96 min-w-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={ringkasanChartData} margin={{ top: 5, right: 5, left: -15, bottom: 65 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
                                                        <XAxis
                                                            dataKey="kecamatan"
                                                            tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151', fontSize: 9 }}
                                                            angle={-60}
                                                            textAnchor="end"
                                                            interval={0}
                                                            height={70}
                                                        />
                                                        <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151', fontSize: 10 }} />
                                                        <Tooltip content={<CustomTooltip theme={theme} />} />
                                                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} formatter={(value) => <span style={{ color: theme === 'dark' ? '#D1D5DB' : '#374151' }}>{value}</span>} />
                                                        <Bar dataKey="RA" name="RA" stackId="a" fill={ringkasanColors[0]} />
                                                        <Bar dataKey="MI" name="MI" stackId="a" fill={ringkasanColors[1]} />
                                                        <Bar dataKey="MTs" name="MTs" stackId="a" fill={ringkasanColors[2]} />
                                                        <Bar dataKey="MA" name="MA" stackId="a" fill={ringkasanColors[3]} radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* --- RA --- */}
                            {filter === 'ra' && (
                                <motion.div key="ra" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total RA" value={totalRA.ra} icon={<BuildingLibraryIcon />} color={ringkasanColors[0]} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru RA" value={totalRA.guru} icon={<UsersIcon />} color={ringkasanColors[2]} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa RA" value={totalRA.siswa} icon={<GraduationCapIcon />} color={ringkasanColors[0]} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel RA" value={totalRA.rombel} icon={<RectangleGroupIcon />} color={ringkasanColors[1]} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa RA per Kecamatan"
                                        data={dataRATable} chartKey="siswa" chartName="Siswa RA" chartColor={ringkasanColors[0]}
                                        csvFilename="data_ra_siswa.csv" csvColumns={raColumns} theme={theme} className="md:col-span-2"
                                    />
                                    <ChartCardPendidikan
                                        title="Jumlah Guru RA per Kecamatan"
                                        data={dataRATable} chartKey="guru" chartName="Guru RA" chartColor={ringkasanColors[2]}
                                        csvFilename="data_ra_guru.csv" csvColumns={raColumns} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan
                                        title="Data Raudhatul Athfal (RA) per Kecamatan"
                                        data={dataRATable}
                                        columns={raColumns}
                                        theme={theme}
                                        className="md:col-span-2"
                                    />
                                </motion.div>
                            )}

                            {/* --- MI (MIN + MIS) --- */}
                            {filter === 'mi' && (
                                <motion.div key="mi" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total MI (Negeri & Swasta)" value={totalMI.sekolah} icon={<BuildingLibraryIcon />} color={ringkasanColors[1]} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru MI" value={totalMI.guru} icon={<UsersIcon />} color={ringkasanColors[2]} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa MI" value={totalMI.siswa} icon={<GraduationCapIcon />} color={ringkasanColors[0]} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel MI" value={totalMI.rombel} icon={<RectangleGroupIcon />} color={ringkasanColors[1]} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa MI (Negeri & Swasta) per Kecamatan"
                                        data={dataGabunganKecamatan} chartKey="mi_siswa" chartName="Siswa MI" chartColor={ringkasanColors[0]}
                                        csvFilename="data_mi_siswa.csv" csvColumns={[{ header: 'Kecamatan', key: 'kecamatan' }, { header: 'Siswa MI', key: 'mi_siswa', align: 'right' }]} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan title="Data Madrasah Ibtidaiyah Negeri (MIN)" data={dataMINTable} columns={minColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Data Madrasah Ibtidaiyah Swasta (MIS)" data={dataMISTable} columns={misColumns} theme={theme} />
                                </motion.div>
                            )}

                            {/* --- MTs (MTsN + MTsS) --- */}
                            {filter === 'mts' && (
                                <motion.div key="mts" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total MTs (Negeri & Swasta)" value={totalMTs.sekolah} icon={<BuildingLibraryIcon />} color={ringkasanColors[2]} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru MTs" value={totalMTs.guru} icon={<UsersIcon />} color={ringkasanColors[2]} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa MTs" value={totalMTs.siswa} icon={<GraduationCapIcon />} color={ringkasanColors[0]} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel MTs" value={totalMTs.rombel} icon={<RectangleGroupIcon />} color={ringkasanColors[1]} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa MTs (Negeri & Swasta) per Kecamatan"
                                        data={dataGabunganKecamatan} chartKey="mts_siswa" chartName="Siswa MTs" chartColor={ringkasanColors[0]}
                                        csvFilename="data_mts_siswa.csv" csvColumns={[{ header: 'Kecamatan', key: 'kecamatan' }, { header: 'Siswa MTs', key: 'mts_siswa', align: 'right' }]} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan title="Data Madrasah Tsanawiyah Negeri (MTsN)" data={dataMTsNTable} columns={mtsnColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Data Madrasah Tsanawiyah Swasta (MTsS)" data={dataMTsSTable} columns={mtssColumns} theme={theme} />
                                </motion.div>
                            )}

                            {/* --- MA (MAN + MAS) --- */}
                            {filter === 'ma' && (
                                <motion.div key="ma" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total MA (Negeri & Swasta)" value={totalMA.sekolah} icon={<BuildingLibraryIcon />} color={ringkasanColors[3]} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru MA" value={totalMA.guru} icon={<UsersIcon />} color={ringkasanColors[2]} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa MA" value={totalMA.siswa} icon={<GraduationCapIcon />} color={ringkasanColors[0]} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel MA" value={totalMA.rombel} icon={<RectangleGroupIcon />} color={ringkasanColors[1]} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa MA (Negeri & Swasta) per Kecamatan"
                                        data={dataGabunganKecamatan} chartKey="ma_siswa" chartName="Siswa MA" chartColor={ringkasanColors[0]}
                                        csvFilename="data_ma_siswa.csv" csvColumns={[{ header: 'Kecamatan', key: 'kecamatan' }, { header: 'Siswa MA', key: 'ma_siswa', align: 'right' }]} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan title="Data Madrasah Aliyah Negeri (MAN)" data={dataMANTable} columns={manColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Data Madrasah Aliyah Swasta (MAS)" data={dataMASTable} columns={masColumns} theme={theme} />
                                </motion.div>
                            )}

                            {/* --- Diniyah Takmiliyah --- */}
                            {filter === 'diniyah' && (
                                <motion.div key="diniyah" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                                    <KpiCardPendidikan title="Total Lembaga Diniyah" value={totalDiniyah.total} icon={<BookOpenVariantIcon />} color={ringkasanColors[1]} theme={theme} />
                                    <DynamicTablePendidikan
                                        title="Jumlah Lembaga Diniyah Takmiliyah per Kecamatan"
                                        data={dataDiniyahTable}
                                        columns={diniyahColumns}
                                        theme={theme}
                                    />
                                    <ChartCardPendidikan
                                        title="Distribusi Lembaga Diniyah Takmiliyah per Kecamatan"
                                        data={dataDiniyahTable} chartKey="total" chartName="Total Lembaga" chartColor={ringkasanColors[1]}
                                        csvFilename="data_diniyah.csv" csvColumns={diniyahColumns} theme={theme}
                                    />
                                </motion.div>
                            )}

                            {/* --- Akreditasi --- */}
                            {filter === 'akreditasi' && (
                                <motion.div key="akreditasi" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                                    <DynamicTablePendidikan title="Status Akreditasi Raudhatul Athfal (RA)" data={dataAkreditasiRA} columns={akreditasiColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Status Akreditasi Madrasah Ibtidaiyah Negeri (MIN)" data={dataAkreditasiMIN} columns={akreditasiColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Status Akreditasi Madrasah Ibtidaiyah Swasta (MIS)" data={dataAkreditasiMIS} columns={akreditasiColumns} theme={theme} />
                                    <p className={`text-center text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Catatan: Data Akreditasi MTs dan MA tidak tersedia dalam data yang diberikan.
                                    </p>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- PERUBAHAN 10: Ekspor komponen ---
export default PendidikanMadrasah;

