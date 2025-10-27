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


// --- 2. Data dari CSV ---
const kecamatanList = [
    "Medan Kota", "Medan Sunggal", "Medan Helvetia", "Medan Denai", "Medan Barat",
    "Medan Deli", "Medan Tuntungan", "Medan Belawan", "Medan Amplas", "Medan Area",
    "Medan Johor", "Medan Marelan", "Medan Labuhan", "Medan Tembung", "Medan Maimun",
    "Medan Polonia", "Medan Baru", "Medan Perjuangan", "Medan Petisah", "Medan Timur",
    "Medan Selayang"
];

// Data RA
const dataRA = [
    { kecamatan: "Medan Kota", ra: 5, guru: 17, siswa: 179, rombel: 10 },
    { kecamatan: "Medan Sunggal", ra: 17, guru: 68, siswa: 833, rombel: 45 },
    { kecamatan: "Medan Helvetia", ra: 18, guru: 70, siswa: 870, rombel: 60 },
    { kecamatan: "Medan Denai", ra: 39, guru: 129, siswa: 1416, rombel: 90 },
    { kecamatan: "Medan Barat", ra: 7, guru: 33, siswa: 395, rombel: 30 },
    { kecamatan: "Medan Deli", ra: 17, guru: 90, siswa: 1114, rombel: 74 },
    { kecamatan: "Medan Tuntungan", ra: 11, guru: 40, siswa: 403, rombel: 25 },
    { kecamatan: "Medan Belawan", ra: 7, guru: 29, siswa: 453, rombel: 31 },
    { kecamatan: "Medan Amplas", ra: 24, guru: 93, siswa: 908, rombel: 62 },
    { kecamatan: "Medan Area", ra: 11, guru: 56, siswa: 548, rombel: 40 },
    { kecamatan: "Medan Johor", ra: 19, guru: 81, siswa: 1122, rombel: 70 },
    { kecamatan: "Medan Marelan", ra: 41, guru: 134, siswa: 1706, rombel: 100 },
    { kecamatan: "Medan Labuhan", ra: 13, guru: 58, siswa: 709, rombel: 36 },
    { kecamatan: "Medan Tembung", ra: 16, guru: 72, siswa: 752, rombel: 40 },
    { kecamatan: "Medan Maimun", ra: 4, guru: 14, siswa: 169, rombel: 10 },
    { kecamatan: "Medan Polonia", ra: 11, guru: 42, siswa: 371, rombel: 19 },
    { kecamatan: "Medan Baru", ra: 1, guru: 4, siswa: 48, rombel: 3 },
    { kecamatan: "Medan Perjuangan", ra: 5, guru: 33, siswa: 322, rombel: 16 },
    { kecamatan: "Medan Petisah", ra: 2, guru: 4, siswa: 59, rombel: 4 },
    { kecamatan: "Medan Timur", ra: 6, guru: 26, siswa: 481, rombel: 27 },
    { kecamatan: "Medan Selayang", ra: 5, guru: 20, siswa: 177, rombel: 10 },
];
const totalRA = dataRA.reduce((acc, curr) => ({
    ra: acc.ra + curr.ra, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { ra: 0, guru: 0, siswa: 0, rombel: 0 });

// Data MIN
const knownDataMIN = [ // Renamed original array
    { kecamatan: "Medan Sunggal", min: 1, guru: 39, siswa: 651, rombel: 24 },
    { kecamatan: "Medan Denai", min: 1, guru: 34, siswa: 533, rombel: 20 },
    { kecamatan: "Medan Barat", min: 1, guru: 40, siswa: 690, rombel: 25 },
    { kecamatan: "Medan Belawan", min: 1, guru: 26, siswa: 452, rombel: 17 },
    { kecamatan: "Medan Amplas", min: 1, guru: 32, siswa: 701, rombel: 25 },
    { kecamatan: "Medan Labuhan", min: 2, guru: 50, siswa: 612, rombel: 22 },
    { kecamatan: "Medan Tembung", min: 2, guru: 124, siswa: 1864, rombel: 66 },
    { kecamatan: "Medan Petisah", min: 1, guru: 18, siswa: 287, rombel: 11 },
    { kecamatan: "Medan Timur", min: 1, guru: 35, siswa: 602, rombel: 22 },
    { kecamatan: "Medan Selayang", min: 1, guru: 23, siswa: 526, rombel: 19 },
];
// Separate logic to add missing kecamatan with 0 values
const missingKecamatanMIN = kecamatanList
    .filter(k => !knownDataMIN.some(d => d.kecamatan === k))
    .map(k => ({ kecamatan: k, min: 0, guru: 0, siswa: 0, rombel: 0 }));

const dataMIN = [...knownDataMIN, ...missingKecamatanMIN] // Combine known and missing
    .sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan)); // Sortir sesuai urutan kecamatanList

const totalMIN = dataMIN.reduce((acc, curr) => ({ // Calculate total from the final dataMIN
    min: acc.min + curr.min, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { min: 0, guru: 0, siswa: 0, rombel: 0 });

// Data MIS
const knownDataMIS = [ // Renamed original array
    { kecamatan: "Medan Kota", mis: 2, guru: 14, siswa: 241, rombel: 9 },
    { kecamatan: "Medan Sunggal", mis: 5, guru: 62, siswa: 1011, rombel: 37 },
    { kecamatan: "Medan Helvetia", mis: 2, guru: 15, siswa: 155, rombel: 6 },
    { kecamatan: "Medan Denai", mis: 9, guru: 121, siswa: 2291, rombel: 82 },
    { kecamatan: "Medan Deli", mis: 5, guru: 60, siswa: 1333, rombel: 48 },
    { kecamatan: "Medan Tuntungan", mis: 4, guru: 55, siswa: 1483, rombel: 54 },
    { kecamatan: "Medan Belawan", mis: 2, guru: 34, siswa: 600, rombel: 22 },
    { kecamatan: "Medan Amplas", mis: 4, guru: 70, siswa: 1211, rombel: 45 },
    { kecamatan: "Medan Area", mis: 2, guru: 16, siswa: 172, rombel: 7 },
    { kecamatan: "Medan Johor", mis: 4, guru: 42, siswa: 866, rombel: 32 },
    { kecamatan: "Medan Marelan", mis: 22, guru: 192, siswa: 4597, rombel: 166 },
    { kecamatan: "Medan Labuhan", mis: 22, guru: 59, siswa: 1121, rombel: 41 }, // Perhatikan typo di CSV, jumlah guru 59?
    { kecamatan: "Medan Tembung", mis: 22, guru: 107, siswa: 1713, rombel: 62 },
    { kecamatan: "Medan Polonia", mis: 5, guru: 53, siswa: 1323, rombel: 39 },
    { kecamatan: "Medan Perjuangan", mis: 2, guru: 19, siswa: 358, rombel: 13 },
    { kecamatan: "Medan Petisah", mis: 1, guru: 6, siswa: 29, rombel: 3 },
    { kecamatan: "Medan Timur", mis: 2, guru: 22, siswa: 287, rombel: 11 },
    { kecamatan: "Medan Selayang", mis: 1, guru: 10, siswa: 219, rombel: 8 },
];
// Separate logic to add missing kecamatan with 0 values
const missingKecamatanMIS = kecamatanList
    .filter(k => !knownDataMIS.some(d => d.kecamatan === k))
    .map(k => ({ kecamatan: k, mis: 0, guru: 0, siswa: 0, rombel: 0 }));

const dataMIS = [...knownDataMIS, ...missingKecamatanMIS] // Combine
    .sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan)); // Sortir

const totalMIS = dataMIS.reduce((acc, curr) => ({ // Calculate total from final dataMIS
    mis: acc.mis + curr.mis, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { mis: 0, guru: 0, siswa: 0, rombel: 0 });

// Data MTsN
const knownDataMTsN = [ // Renamed
    { kecamatan: "Medan Helvetia", mtsn: 1, guru: 69, siswa: 687, rombel: 22 },
    { kecamatan: "Medan Amplas", mtsn: 1, guru: 88, siswa: 1031, rombel: 33 },
    { kecamatan: "Medan Labuhan", mtsn: 1, guru: 28, siswa: 388, rombel: 13 },
    { kecamatan: "Medan Tembung", mtsn: 1, guru: 90, siswa: 1115, rombel: 35 },
];
// Separate logic
const missingKecamatanMTsN = kecamatanList
    .filter(k => !knownDataMTsN.some(d => d.kecamatan === k))
    .map(k => ({ kecamatan: k, mtsn: 0, guru: 0, siswa: 0, rombel: 0 }));

const dataMTsN = [...knownDataMTsN, ...missingKecamatanMTsN] // Combine
    .sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan)); // Sortir

const totalMTsN = dataMTsN.reduce((acc, curr) => ({ // Calculate total
    mtsn: acc.mtsn + curr.mtsn, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { mtsn: 0, guru: 0, siswa: 0, rombel: 0 });

// Data MTsS
const knownDataMTsS = [ // Renamed
    { kecamatan: "Medan Kota", mtss: 3, guru: 32, siswa: 501, rombel: 16 },
    { kecamatan: "Medan Sunggal", mtss: 8, guru: 70, siswa: 1135, rombel: 36 },
    { kecamatan: "Medan Helvetia", mtss: 3, guru: 27, siswa: 419, rombel: 14 },
    { kecamatan: "Medan Denai", mtss: 4, guru: 45, siswa: 428, rombel: 15 },
    { kecamatan: "Medan Barat", mtss: 1, guru: 8, siswa: 98, rombel: 3 },
    { kecamatan: "Medan Deli", mtss: 4, guru: 46, siswa: 497, rombel: 16 },
    { kecamatan: "Medan Tuntungan", mtss: 5, guru: 127, siswa: 2323, rombel: 75 },
    { kecamatan: "Medan Belawan", mtss: 3, guru: 40, siswa: 730, rombel: 24 },
    { kecamatan: "Medan Amplas", mtss: 6, guru: 125, siswa: 2291, rombel: 72 },
    { kecamatan: "Medan Area", mtss: 7, guru: 98, siswa: 1353, rombel: 43 },
    { kecamatan: "Medan Johor", mtss: 5, guru: 99, siswa: 1872, rombel: 60 },
    { kecamatan: "Medan Marelan", mtss: 12, guru: 118, siswa: 1774, rombel: 56 },
    { kecamatan: "Medan Labuhan", mtss: 6, guru: 83, siswa: 1386, rombel: 44 },
    { kecamatan: "Medan Tembung", mtss: 9, guru: 102, siswa: 1267, rombel: 40 },
    { kecamatan: "Medan Maimun", mtss: 1, guru: 17, siswa: 264, rombel: 9 },
    { kecamatan: "Medan Polonia", mtss: 1, guru: 7, siswa: 214, rombel: 7 },
    { kecamatan: "Medan Baru", mtss: 3, guru: 22, siswa: 226, rombel: 9 },
    { kecamatan: "Medan Perjuangan", mtss: 3, guru: 20, siswa: 163, rombel: 9 },
    { kecamatan: "Medan Petisah", mtss: 2, guru: 27, siswa: 325, rombel: 12 },
    { kecamatan: "Medan Timur", mtss: 7, guru: 66, siswa: 1156, rombel: 38 },
];
// Separate logic
const missingKecamatanMTsS = kecamatanList
    .filter(k => !knownDataMTsS.some(d => d.kecamatan === k))
    .map(k => ({ kecamatan: k, mtss: 0, guru: 0, siswa: 0, rombel: 0 }));

const dataMTsS = [...knownDataMTsS, ...missingKecamatanMTsS] // Combine
    .sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan)); // Sortir

const totalMTsS = dataMTsS.reduce((acc, curr) => ({ // Calculate total
    mtss: acc.mtss + curr.mtss, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { mtss: 0, guru: 0, siswa: 0, rombel: 0 });

// Data MAN
const knownDataMAN = [ // Renamed
    { kecamatan: "Medan Amplas", man: 1, guru: 78, siswa: 1087, rombel: 32 },
    { kecamatan: "Medan Labuhan", man: 1, guru: 45, siswa: 971, rombel: 27 },
    { kecamatan: "Medan Tembung", man: 2, guru: 297, siswa: 4183, rombel: 117 },
];
// Separate logic
const missingKecamatanMAN = kecamatanList
    .filter(k => !knownDataMAN.some(d => d.kecamatan === k))
    .map(k => ({ kecamatan: k, man: 0, guru: 0, siswa: 0, rombel: 0 }));

const dataMAN = [...knownDataMAN, ...missingKecamatanMAN] // Combine
    .sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan)); // Sortir

const totalMAN = dataMAN.reduce((acc, curr) => ({ // Calculate total
    man: acc.man + curr.man, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { man: 0, guru: 0, siswa: 0, rombel: 0 });

// Data MAS
const knownDataMAS = [ // Renamed
    { kecamatan: "Medan Kota", mas: 2, guru: 27, siswa: 241, rombel: 7 },
    { kecamatan: "Medan Sunggal", mas: 3, guru: 24, siswa: 284, rombel: 9 },
    { kecamatan: "Medan Denai", mas: 2, guru: 17, siswa: 146, rombel: 6 },
    { kecamatan: "Medan Deli", mas: 1, guru: 6, siswa: 136, rombel: 4 },
    { kecamatan: "Medan Tuntungan", mas: 3, guru: 83, siswa: 1586, rombel: 45 },
    { kecamatan: "Medan Amplas", mas: 5, guru: 79, siswa: 1329, rombel: 40 },
    { kecamatan: "Medan Area", mas: 4, guru: 51, siswa: 967, rombel: 28 },
    { kecamatan: "Medan Johor", mas: 4, guru: 43, siswa: 1108, rombel: 32 },
    { kecamatan: "Medan Labuhan", mas: 3, guru: 33, siswa: 510, rombel: 15 },
    { kecamatan: "Medan Tembung", mas: 3, guru: 46, siswa: 571, rombel: 16 },
    { kecamatan: "Medan Polonia", mas: 1, guru: 5, siswa: 136, rombel: 4 },
    { kecamatan: "Medan Perjuangan", mas: 1, guru: 10, siswa: 10, rombel: 1 },
    { kecamatan: "Medan Petisah", mas: 2, guru: 17, siswa: 286, rombel: 8 },
    { kecamatan: "Medan Timur", mas: 2, guru: 24, siswa: 575, rombel: 16 },
];
// Separate logic
const missingKecamatanMAS = kecamatanList
    .filter(k => !knownDataMAS.some(d => d.kecamatan === k))
    .map(k => ({ kecamatan: k, mas: 0, guru: 0, siswa: 0, rombel: 0 }));

const dataMAS = [...knownDataMAS, ...missingKecamatanMAS] // Combine
    .sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan)); // Sortir

const totalMAS = dataMAS.reduce((acc, curr) => ({ // Calculate total
    mas: acc.mas + curr.mas, guru: acc.guru + curr.guru, siswa: acc.siswa + curr.siswa, rombel: acc.rombel + curr.rombel
}), { mas: 0, guru: 0, siswa: 0, rombel: 0 });

// Data Akreditasi (CSV Kosong - initialized as empty arrays)
const dataAkreditasiRA = [];
const dataAkreditasiMIN = [];
const dataAkreditasiMIS = [];

// Data Diniyah Takmiliyah
const dataDiniyah = [
    { kecamatan: "Medan Kota", awaliyah: 7, wustha: 0, ulya: 0, total: 7 },
    { kecamatan: "Medan Sunggal", awaliyah: 15, wustha: 0, ulya: 0, total: 15 },
    { kecamatan: "Medan Helvetia", awaliyah: 19, wustha: 0, ulya: 0, total: 19 },
    { kecamatan: "Medan Denai", awaliyah: 41, wustha: 0, ulya: 0, total: 41 },
    { kecamatan: "Medan Barat", awaliyah: 17, wustha: 0, ulya: 0, total: 17 },
    { kecamatan: "Medan Deli", awaliyah: 32, wustha: 0, ulya: 0, total: 32 },
    { kecamatan: "Medan Tuntungan", awaliyah: 11, wustha: 0, ulya: 0, total: 11 },
    { kecamatan: "Medan Belawan", awaliyah: 7, wustha: 0, ulya: 0, total: 7 },
    { kecamatan: "Medan Amplas", awaliyah: 23, wustha: 0, ulya: 0, total: 23 },
    { kecamatan: "Medan Area", awaliyah: 25, wustha: 0, ulya: 0, total: 25 },
    { kecamatan: "Medan Johor", awaliyah: 34, wustha: 0, ulya: 0, total: 34 },
    { kecamatan: "Medan Marelan", awaliyah: 43, wustha: 0, ulya: 0, total: 43 },
    { kecamatan: "Medan Labuhan", awaliyah: 28, wustha: 0, ulya: 0, total: 28 },
    { kecamatan: "Medan Tembung", awaliyah: 29, wustha: 0, ulya: 0, total: 29 },
    { kecamatan: "Medan Maimun", awaliyah: 9, wustha: 0, ulya: 0, total: 9 },
    { kecamatan: "Medan Polonia", awaliyah: 7, wustha: 0, ulya: 0, total: 7 },
    { kecamatan: "Medan Baru", awaliyah: 2, wustha: 0, ulya: 0, total: 2 },
    { kecamatan: "Medan Perjuangan", awaliyah: 13, wustha: 0, ulya: 0, total: 13 },
    { kecamatan: "Medan Petisah", awaliyah: 9, wustha: 0, ulya: 0, total: 9 },
    { kecamatan: "Medan Timur", awaliyah: 17, wustha: 0, ulya: 0, total: 17 },
    { kecamatan: "Medan Selayang", awaliyah: 7, wustha: 0, ulya: 0, total: 7 },
];
const totalDiniyah = dataDiniyah.reduce((acc, curr) => ({
    awaliyah: acc.awaliyah + curr.awaliyah, wustha: acc.wustha + curr.wustha, ulya: acc.ulya + curr.ulya, total: acc.total + curr.total
}), { awaliyah: 0, wustha: 0, ulya: 0, total: 0 });

// Data Gabungan MI, MTs, MA untuk KPI Card
const totalMI = {
    sekolah: totalMIN.min + totalMIS.mis,
    guru: totalMIN.guru + totalMIS.guru,
    siswa: totalMIN.siswa + totalMIS.siswa,
    rombel: totalMIN.rombel + totalMIS.rombel,
};
const totalMTs = {
    sekolah: totalMTsN.mtsn + totalMTsS.mtss,
    guru: totalMTsN.guru + totalMTsS.guru,
    siswa: totalMTsN.siswa + totalMTsS.siswa,
    rombel: totalMTsN.rombel + totalMTsS.rombel,
};
const totalMA = {
    sekolah: totalMAN.man + totalMAS.mas,
    guru: totalMAN.guru + totalMAS.guru,
    siswa: totalMAN.siswa + totalMAS.siswa,
    rombel: totalMAN.rombel + totalMAS.rombel,
};

// Data Gabungan per Kecamatan untuk Chart
const dataGabunganKecamatan = kecamatanList.map(kec => {
    const ra = dataRA.find(d => d.kecamatan === kec) || { ra: 0, guru: 0, siswa: 0, rombel: 0 };
    const min = dataMIN.find(d => d.kecamatan === kec) || { min: 0, guru: 0, siswa: 0, rombel: 0 };
    const mis = dataMIS.find(d => d.kecamatan === kec) || { mis: 0, guru: 0, siswa: 0, rombel: 0 };
    const mtsn = dataMTsN.find(d => d.kecamatan === kec) || { mtsn: 0, guru: 0, siswa: 0, rombel: 0 };
    const mtss = dataMTsS.find(d => d.kecamatan === kec) || { mtss: 0, guru: 0, siswa: 0, rombel: 0 };
    const man = dataMAN.find(d => d.kecamatan === kec) || { man: 0, guru: 0, siswa: 0, rombel: 0 };
    const mas = dataMAS.find(d => d.kecamatan === kec) || { mas: 0, guru: 0, siswa: 0, rombel: 0 };
    const diniyah = dataDiniyah.find(d => d.kecamatan === kec) || { awaliyah: 0, total: 0 };

    return {
        kecamatan: kec,
        ra_sekolah: ra.ra, ra_guru: ra.guru, ra_siswa: ra.siswa, ra_rombel: ra.rombel,
        mi_sekolah: min.min + mis.mis, mi_guru: min.guru + mis.guru, mi_siswa: min.siswa + mis.siswa, mi_rombel: min.rombel + mis.rombel,
        mts_sekolah: mtsn.mtsn + mtss.mtss, mts_guru: mtsn.guru + mtss.guru, mts_siswa: mtsn.siswa + mtss.siswa, mts_rombel: mtsn.rombel + mtss.rombel,
        ma_sekolah: man.man + mas.mas, ma_guru: man.guru + mas.guru, ma_siswa: man.siswa + mas.siswa, ma_rombel: man.rombel + mas.rombel,
        diniyah: diniyah.total
    };
});

// --- Definisi Kolom Tabel ---
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
        } else if (ref.current) {
            // Set initial value or value if not in view
            ref.current.textContent = value.toLocaleString('id-ID');
        }
    }, [isInView, value]);

    // Initial render with the final value for SSR or non-animated scenarios
    return <span ref={ref}>{value.toLocaleString('id-ID')}</span>;
};


// --- 4. Komponen Kartu KPI Pendidikan ---
const KpiCardPendidikan = ({ icon, title, value, color, theme, small = false }) => {
    const cardVariant = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } } }; // Enhanced animation
    const cardBgColor = theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)'; // Increased opacity
    const cardBorderColor = theme === 'dark' ? 'rgba(167, 139, 250, 0.3)' : 'rgba(139, 92, 246, 0.2)'; // Adjusted border color

    return (
        <motion.div variants={cardVariant} className={`relative w-full overflow-hidden rounded-xl backdrop-blur-lg border shadow-lg ${small ? 'p-3' : 'p-5'}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }}>
            <div className={`flex items-center ${small ? 'space-x-3' : 'space-x-4'}`}>
                <motion.div
                    className={`flex-shrink-0 rounded-lg flex items-center justify-center ${small ? 'w-8 h-8' : 'w-10 h-10'}`}
                    style={{ background: `linear-gradient(135deg, ${color}99 0%, ${color}CC 100%)` }} // Adjusted gradient opacity
                    whileHover={{ scale: 1.1, rotate: 5 }} // Hover animation
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                    {React.cloneElement(icon, { style: { color: 'white' }, className: small ? "w-4 h-4" : "w-5 h-5" })}
                </motion.div>
                <div>
                    <h3 className={`font-semibold uppercase tracking-wider ${small ? 'text-xs' : 'text-sm'} ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>{title}</h3>
                    <p className={`font-bold ${small ? 'text-xl' : 'text-2xl'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ color: color }}>
                        <AnimatedNumber value={value} />
                    </p>
                </div>
            </div>
            {/* Subtle pattern or glow effect */}
            <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-xl`} style={{ backgroundColor: color }}></div>
        </motion.div>
    );
};


// --- 5. Komponen Kartu Chart Pendidikan ---
const ChartCardPendidikan = ({
    title,
    data, // Ganti nama prop dari csvData ke data
    chartKey, // Key untuk data chart (e.g., 'siswa', 'guru')
    chartName, // Nama untuk legend/tooltip (e.g., 'Jumlah Siswa')
    chartColor, // Warna utama chart
    categoryKey = 'kecamatan', // Key untuk kategori (sumbu X)
    csvFilename,
    csvColumns, // Kolom untuk CSV download
    theme,
    className = ""
}) => {
    const itemVariant = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 } } }; // Adjusted animation
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

    const cardBgColor = theme === 'dark' ? 'rgba(25, 15, 45, 0.5)' : 'rgba(243, 232, 255, 0.5)'; // Adjusted purple-ish background
    const cardBorderColor = theme === 'dark' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(168, 85, 247, 0.1)';
    const textLabelColor = theme === 'dark' ? '#d8b4fe' : '#581c87'; // Purple-ish text
    const gridColor = theme === 'dark' ? 'rgba(109, 40, 217, 0.2)' : 'rgba(233, 213, 255, 0.5)'; // Purple-ish grid

    return (
        <motion.div variants={itemVariant} className={`rounded-xl backdrop-blur-md border overflow-hidden shadow-lg ${className}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }}>
            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-purple-200' : 'text-purple-900'}`}> {title} </h3>
                    <button onClick={handleDownloadCSV} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${theme === 'dark' ? 'bg-purple-900/40 border-purple-700/50 text-purple-300 hover:bg-purple-800/60 hover:border-purple-600/60' : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'}`}>
                        <DownloadIcon className="w-3.5 h-3.5" /> Download CSV
                    </button>
                </div>
                <div className="h-72 sm:h-80"> {/* Increased height */}
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 40 }}> {/* Adjusted margins */}
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
                                dataKey={categoryKey}
                                tick={{ fill: textLabelColor, fontSize: 9 }} // Smaller font size
                                angle={-45} // Angle ticks
                                textAnchor="end" // Align angled text
                                interval={0} // Show all labels
                                height={60} // Increase space for labels
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


// --- 6. Komponen Tombol Filter Pendidikan ---
const FilterButtonPendidikan = ({ text, icon, onClick, isActive, theme }) => {
    const activeBg = theme === 'dark' ? 'bg-purple-700/60' : 'bg-purple-100';
    const activeText = theme === 'dark' ? 'text-purple-100' : 'text-purple-800';
    const inactiveText = theme === 'dark' ? 'text-gray-400 hover:text-purple-300' : 'text-gray-500 hover:text-purple-700';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/40' : 'hover:bg-gray-100/60';

    return (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 relative ${isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${inactiveBgHover}`}`}
            whileTap={{ scale: 0.97 }} // Slightly adjusted tap scale
            whileHover={{ scale: 1.03 }} // Added hover scale
        >
            {isActive && (
                <motion.div
                    layoutId="filter-highlight-pendidikan" // Unique layoutId
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-transparent rounded-lg z-0" // Gradient highlight
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
        const name = label || data.payload?.kecamatan || data.name; // Use kecamatan if available
        const value = data.value;
        const entryName = data.name; // Get the specific key name (e.g., 'siswa', 'guru')

        return (
            <div className={`rounded-lg p-3 shadow-xl backdrop-blur-lg ${theme === 'dark' ? 'bg-slate-800/85 border border-slate-700/60' : 'bg-white/85 border border-gray-200/60'}`}>
                <p className={`font-semibold text-sm mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</p>
                {/* Iterate through payload for stacked/grouped bars */}
                {payload.map((pld, index) => (
                    <p key={index} className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium" style={{ color: pld.color || pld.fill }}>{pld.name || 'Jumlah'}</span>: {pld.value?.toLocaleString('id-ID')}
                    </p>
                ))}
                {/* Add percentage if available (for Pie charts if reused) */}
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

// --- 8. Komponen Tabel Dinamis (reuse, slightly adapted) ---
const DynamicTablePendidikan = ({ title, data, columns, theme, className = "" }) => {
    const tableBg = theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/50';
    const tableBorder = theme === 'dark' ? 'border-purple-700/40' : 'border-purple-200/50';
    const headerBg = theme === 'dark' ? 'bg-gray-900/60' : 'bg-purple-50/60';
    const headerText = theme === 'dark' ? 'text-purple-300' : 'text-purple-600';
    const rowBorder = theme === 'dark' ? 'divide-gray-700/50' : 'divide-purple-200/50';
    const rowHover = theme === 'dark' ? 'hover:bg-gray-700/40' : 'hover:bg-purple-50/60';
    const cellText = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const cellTextPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const cardBgColor = theme === 'dark' ? 'rgba(25, 15, 45, 0.5)' : 'rgba(243, 232, 255, 0.5)';
    const cardBorderColor = theme === 'dark' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(168, 85, 247, 0.1)';
    const itemVariant = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 } } };

        return (
        <motion.div variants={itemVariant} className={`rounded-xl backdrop-blur-md border shadow-lg overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }}>
            <div className="p-4 sm:p-5">
                <h3 className={`text-lg font-semibold mb-5 ${theme === 'dark' ? 'text-purple-200' : 'text-purple-900'}`}> {title} </h3>
                {(!data || data.length === 0) ? (
                    <p className={`text-center text-sm py-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada data untuk ditampilkan pada tabel ini.</p>
                ) : (
                    <div className={`w-full max-h-[400px] overflow-auto rounded-lg border ${tableBg} ${tableBorder}`}> {/* Increased max height */}
                        <table className="min-w-full divide-y ${rowBorder}">
                            {/* FIX: Remove whitespace between thead and tr */}
                            <thead className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10`}><tr>
                                    {columns.map((col) => (
                                        <th key={col.key} scope="col" className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${headerText} ${col.align === 'right' ? 'text-right' : ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr></thead>
                            <tbody className={`divide-y ${rowBorder}`}>
                                {data.map((item, index) => (
                                    <tr key={index} className={`transition-colors duration-150 ${rowHover}`}>
                                        {columns.map((col) => (
                                            <td key={col.key} className={`px-4 py-3 whitespace-nowrap text-sm ${col.align === 'right' ? 'text-right' : ''} ${col.key === 'kecamatan' || col.key === 'kua' ? `font-medium ${cellTextPrimary}` : cellText}`}>
                                                {/* Format number or display string */}
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
    const [filter, setFilter] = useState('ringkasan'); // Default ke Ringkasan
    const [chartMetric, setChartMetric] = useState('siswa'); // Default metric for Ringkasan chart

    const filters = [
        { key: 'ringkasan', text: 'Ringkasan Umum', icon: <GraduationCapIcon /> },
        { key: 'ra', text: 'Raudhatul Athfal (RA)', icon: <BuildingLibraryIcon /> },
        { key: 'mi', text: 'Madrasah Ibtidaiyah (MI)', icon: <BuildingLibraryIcon /> },
        { key: 'mts', text: 'Madrasah Tsanawiyah (MTs)', icon: <BuildingLibraryIcon /> },
        { key: 'ma', text: 'Madrasah Aliyah (MA)', icon: <BuildingLibraryIcon /> },
        { key: 'diniyah', text: 'Diniyah Takmiliyah', icon: <BookOpenVariantIcon /> },
        { key: 'akreditasi', text: 'Status Akreditasi', icon: <CheckBadgeIcon /> },
    ];

    const containerVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }; // Faster stagger
    const itemVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } } }; // Smooth ease
    const sectionVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeInOut', staggerChildren: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } } };
    const backgroundStyle = theme === 'dark'
        ? { background: 'radial-gradient(circle at top center, #4c1d95 0%, #1e1b4b 100%)' } // Dark Purple gradient
        : { background: 'radial-gradient(circle at top center, #f3e8ff 0%, #e9d5ff 100%)' }; // Light Purple gradient

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

    const ringkasanColors = ["#a78bfa", "#818cf8", "#60a5fa", "#38bdf8"]; // Example colors

    return (
        <motion.div
            id="pendidikan-madrasah"
            className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={backgroundStyle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={containerVariant}
        >
            <div className="mx-auto md:mx-12 relative z-10">
                <motion.div className="text-center mb-12" variants={itemVariant}>
                    <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-purple-300 via-pink-300 to-indigo-300' : 'from-purple-600 via-pink-600 to-indigo-600'}`} style={{ lineHeight: '1.2' }}>
                        Statistik Pendidikan Madrasah
                    </h2>
                    <p className={`mt-4 text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-purple-200/80' : 'text-purple-700/90'}`}>
                        Data Raudhatul Athfal (RA), Madrasah Ibtidaiyah (MI), Tsanawiyah (MTs), Aliyah (MA), dan Diniyah Takmiliyah di Kota Medan.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- Filter Sidebar --- */}
                    <motion.div className="w-full lg:w-1/4 xl:w-1/5" variants={itemVariant}>
                        <div className={`rounded-xl p-4 space-y-2 backdrop-blur-lg border shadow-lg ${theme === 'dark' ? 'bg-gray-800/50 border-purple-700/40' : 'bg-white/60 border-purple-200/60'}`}>
                            <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`}>Jenjang Pendidikan</h4>
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
                                        <KpiCardPendidikan title="Total RA" value={totalRA.ra} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#c4b5fd" : "#8b5cf6"} theme={theme} small />
                                        <KpiCardPendidikan title="Total MI" value={totalMI.sekolah} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#a5b4fc" : "#6366f1"} theme={theme} small />
                                        <KpiCardPendidikan title="Total MTs" value={totalMTs.sekolah} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#93c5fd" : "#3b82f6"} theme={theme} small />
                                        <KpiCardPendidikan title="Total MA" value={totalMA.sekolah} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#7dd3fc" : "#0ea5e9"} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa RA`} value={totalRA.siswa} icon={<UsersIcon />} color={theme === 'dark' ? "#c4b5fd" : "#8b5cf6"} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa MI`} value={totalMI.siswa} icon={<UsersIcon />} color={theme === 'dark' ? "#a5b4fc" : "#6366f1"} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa MTs`} value={totalMTs.siswa} icon={<UsersIcon />} color={theme === 'dark' ? "#93c5fd" : "#3b82f6"} theme={theme} small />
                                        <KpiCardPendidikan title={`Siswa MA`} value={totalMA.siswa} icon={<UsersIcon />} color={theme === 'dark' ? "#7dd3fc" : "#0ea5e9"} theme={theme} small />
                                    </motion.div>

                                    {/* Metric Selector */}
                                    <motion.div variants={itemVariant} className={`p-4 rounded-xl backdrop-blur-md border shadow-lg ${theme === 'dark' ? 'bg-gray-800/50 border-purple-700/40' : 'bg-white/60 border-purple-200/60'}`}>
                                        <label htmlFor="metricSelect" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
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

                                    {/* Combined Chart for Ringkasan */}
                                    <motion.div variants={itemVariant} className={`rounded-xl backdrop-blur-md border shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50 border-purple-700/40' : 'bg-white/60 border-purple-200/60'}`}>
                                        <div className="p-4 sm:p-5">
                                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-purple-200' : 'text-purple-900'}`}>Perbandingan {selectedMetricName} per Kecamatan</h3>
                                            <div className="h-96"> {/* Increased height */}
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={ringkasanChartData} margin={{ top: 5, right: 5, left: -15, bottom: 65 }}> {/* Adjusted bottom margin */}
                                                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(109, 40, 217, 0.2)' : 'rgba(233, 213, 255, 0.5)'} />
                                                        <XAxis
                                                            dataKey="kecamatan"
                                                            tick={{ fill: theme === 'dark' ? '#d8b4fe' : '#581c87', fontSize: 9 }}
                                                            angle={-60} // Angle ticks for better readability
                                                            textAnchor="end"
                                                            interval={0}
                                                            height={70} // Increase space for angled labels
                                                        />
                                                        <YAxis tick={{ fill: theme === 'dark' ? '#d8b4fe' : '#581c87', fontSize: 10 }} />
                                                        <Tooltip content={<CustomTooltip theme={theme} />} />
                                                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} formatter={(value) => <span style={{ color: theme === 'dark' ? '#cab2fc' : '#7e22ce' }}>{value}</span>} />
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
                                    <KpiCardPendidikan title="Total RA" value={totalRA.ra} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#c4b5fd" : "#8b5cf6"} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru RA" value={totalRA.guru} icon={<UsersIcon />} color={theme === 'dark' ? "#fca5a5" : "#ef4444"} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa RA" value={totalRA.siswa} icon={<GraduationCapIcon />} color={theme === 'dark' ? "#86efac" : "#22c55e"} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel RA" value={totalRA.rombel} icon={<RectangleGroupIcon />} color={theme === 'dark' ? "#fdba74" : "#f97316"} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa RA per Kecamatan"
                                        data={dataRA} chartKey="siswa" chartName="Siswa RA" chartColor="#86efac"
                                        csvFilename="data_ra_siswa.csv" csvColumns={raColumns} theme={theme} className="md:col-span-2"
                                    />
                                    <ChartCardPendidikan
                                        title="Jumlah Guru RA per Kecamatan"
                                        data={dataRA} chartKey="guru" chartName="Guru RA" chartColor="#fca5a5"
                                        csvFilename="data_ra_guru.csv" csvColumns={raColumns} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan
                                        title="Data Raudhatul Athfal (RA) per Kecamatan"
                                        data={dataRA}
                                        columns={raColumns}
                                        theme={theme}
                                        className="md:col-span-2"
                                    />
                                </motion.div>
                            )}

                            {/* --- MI (MIN + MIS) --- */}
                            {filter === 'mi' && (
                                <motion.div key="mi" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total MI (Negeri & Swasta)" value={totalMI.sekolah} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#a5b4fc" : "#6366f1"} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru MI" value={totalMI.guru} icon={<UsersIcon />} color={theme === 'dark' ? "#fca5a5" : "#ef4444"} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa MI" value={totalMI.siswa} icon={<GraduationCapIcon />} color={theme === 'dark' ? "#86efac" : "#22c55e"} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel MI" value={totalMI.rombel} icon={<RectangleGroupIcon />} color={theme === 'dark' ? "#fdba74" : "#f97316"} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa MI (Negeri & Swasta) per Kecamatan"
                                        data={dataGabunganKecamatan} chartKey="mi_siswa" chartName="Siswa MI" chartColor="#86efac"
                                        csvFilename="data_mi_siswa.csv" csvColumns={[{ header: 'Kecamatan', key: 'kecamatan' }, { header: 'Siswa MI', key: 'mi_siswa', align: 'right' }]} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan title="Data Madrasah Ibtidaiyah Negeri (MIN)" data={dataMIN} columns={minColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Data Madrasah Ibtidaiyah Swasta (MIS)" data={dataMIS} columns={misColumns} theme={theme} />
                                </motion.div>
                            )}

                            {/* --- MTs (MTsN + MTsS) --- */}
                            {filter === 'mts' && (
                                <motion.div key="mts" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total MTs (Negeri & Swasta)" value={totalMTs.sekolah} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#93c5fd" : "#3b82f6"} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru MTs" value={totalMTs.guru} icon={<UsersIcon />} color={theme === 'dark' ? "#fca5a5" : "#ef4444"} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa MTs" value={totalMTs.siswa} icon={<GraduationCapIcon />} color={theme === 'dark' ? "#86efac" : "#22c55e"} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel MTs" value={totalMTs.rombel} icon={<RectangleGroupIcon />} color={theme === 'dark' ? "#fdba74" : "#f97316"} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa MTs (Negeri & Swasta) per Kecamatan"
                                        data={dataGabunganKecamatan} chartKey="mts_siswa" chartName="Siswa MTs" chartColor="#86efac"
                                        csvFilename="data_mts_siswa.csv" csvColumns={[{ header: 'Kecamatan', key: 'kecamatan' }, { header: 'Siswa MTs', key: 'mts_siswa', align: 'right' }]} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan title="Data Madrasah Tsanawiyah Negeri (MTsN)" data={dataMTsN} columns={mtsnColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Data Madrasah Tsanawiyah Swasta (MTsS)" data={dataMTsS} columns={mtssColumns} theme={theme} />
                                </motion.div>
                            )}

                            {/* --- MA (MAN + MAS) --- */}
                            {filter === 'ma' && (
                                <motion.div key="ma" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <KpiCardPendidikan title="Total MA (Negeri & Swasta)" value={totalMA.sekolah} icon={<BuildingLibraryIcon />} color={theme === 'dark' ? "#7dd3fc" : "#0ea5e9"} theme={theme} />
                                    <KpiCardPendidikan title="Total Guru MA" value={totalMA.guru} icon={<UsersIcon />} color={theme === 'dark' ? "#fca5a5" : "#ef4444"} theme={theme} />
                                    <KpiCardPendidikan title="Total Siswa MA" value={totalMA.siswa} icon={<GraduationCapIcon />} color={theme === 'dark' ? "#86efac" : "#22c55e"} theme={theme} />
                                    <KpiCardPendidikan title="Total Rombel MA" value={totalMA.rombel} icon={<RectangleGroupIcon />} color={theme === 'dark' ? "#fdba74" : "#f97316"} theme={theme} />
                                    <ChartCardPendidikan
                                        title="Jumlah Siswa MA (Negeri & Swasta) per Kecamatan"
                                        data={dataGabunganKecamatan} chartKey="ma_siswa" chartName="Siswa MA" chartColor="#86efac"
                                        csvFilename="data_ma_siswa.csv" csvColumns={[{ header: 'Kecamatan', key: 'kecamatan' }, { header: 'Siswa MA', key: 'ma_siswa', align: 'right' }]} theme={theme} className="md:col-span-2"
                                    />
                                    <DynamicTablePendidikan title="Data Madrasah Aliyah Negeri (MAN)" data={dataMAN} columns={manColumns} theme={theme} />
                                    <DynamicTablePendidikan title="Data Madrasah Aliyah Swasta (MAS)" data={dataMAS} columns={masColumns} theme={theme} />
                                </motion.div>
                            )}

                            {/* --- Diniyah Takmiliyah --- */}
                            {filter === 'diniyah' && (
                                <motion.div key="diniyah" variants={sectionVariant} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                                    <KpiCardPendidikan title="Total Lembaga Diniyah" value={totalDiniyah.total} icon={<BookOpenVariantIcon />} color={theme === 'dark' ? "#facc15" : "#eab308"} theme={theme} />
                                    <DynamicTablePendidikan
                                        title="Jumlah Lembaga Diniyah Takmiliyah per Kecamatan"
                                        data={dataDiniyah}
                                        columns={diniyahColumns}
                                        theme={theme}
                                    />
                                    <ChartCardPendidikan
                                        title="Distribusi Lembaga Diniyah Takmiliyah per Kecamatan"
                                        data={dataDiniyah} chartKey="total" chartName="Total Lembaga" chartColor="#facc15"
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
                                    {/* Tambahkan tabel akreditasi MTs dan MA jika data tersedia */}
                                    <p className={`text-center text-sm italic mt-4 ${theme === 'dark' ? 'text-purple-300/70' : 'text-purple-600/80'}`}>
                                        Catatan: Data Akreditasi MTs dan MA tidak tersedia dalam CSV yang diberikan.
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

export default PendidikanMadrasah;

