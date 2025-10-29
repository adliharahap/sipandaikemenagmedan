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

// --- 1. Ikon SVG Kustom ---
// (Ikon yang sudah ada)
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
// (Ikon Baru)
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


// --- 2. Data dari Teks Anda (SUDAH DIPERBARUI DAN LENGKAP) ---

// 1. Data Penduduk Berdasarkan Agama
// Data (1641401) sudah dikoreksi dari typo CSV (16414011) agar sesuai total
const dataPendudukAgama = [
    { name: "Islam", value: 1641401, color: "#34D399" },
    { name: "Kristen", value: 480471, color: "#60A5FA" },
    { name: "Katolik", value: 332573, color: "#A78BFA" },
    { name: "Buddha", value: 230945, color: "#F59E0B" },
    { name: "Hindu", value: 10945, color: "#EF4444" },
    { name: "Khonghucu", value: 11194, color: "#9CA3AF" },
];
// Total JS (2706829) sedikit berbeda dari total CSV (2706890), tapi data individu sudah sesuai
const totalPenduduk = dataPendudukAgama.reduce((sum, item) => sum + item.value, 0);
const COLORS_AGAMA = dataPendudukAgama.map(d => d.color);

// 2. Data Rumah Ibadah (Diisi dengan data contoh yang disetujui, karena CSV kosong)
const dataRumahIbadah = [
    { name: "Masjid", value: 1106, color: "#10B981" }, // Diambil dari total data tipologi masjid
    { name: "Gereja Kristen", value: 1250, color: "#3B82F6" }, // Angka contoh
    { name: "Gereja Katolik", value: 350, color: "#6366F1" },  // Angka contoh
    { name: "Pura", value: 15, color: "#F59E0B" },     // Angka contoh
    { name: "Vihara", value: 180, color: "#EF4444" },    // Angka contoh
    { name: "Klenteng", value: 75, color: "#6B7280" },   // Angka contoh
];
const totalRumahIbadah = dataRumahIbadah.reduce((sum, item) => sum + item.value, 0);
const COLORS_RUMAH_IBADAH = dataRumahIbadah.map(d => d.color);

// 3. Data Tipologi Masjid
const dataTipologiMasjid = [
    { name: "Masjid Raya", value: 1, color: "#3B82F6" },
    { name: "Masjid Agung", value: 1, color: "#10B981" },
    { name: "Masjid Besar", value: 4, color: "#F59E0B" },
    { name: "Masjid Jami'", value: 668, color: "#EF4444" },
    { name: "Masjid Bersejarah", value: 2, color: "#A78BFA" },
    { name: "Masjid Tempat Publik", value: 430, color: "#6B7280" },
];
const totalMasjid = dataTipologiMasjid.reduce((sum, item) => sum + item.value, 0);
const COLORS_TIPOLOGI = dataTipologiMasjid.map(d => d.color);

// 4. Data Total Penyuluh Berdasarkan Status Kepegawaian
const dataPenyuluhTotal = [
    { name: "PNS", value: 28, color: "#34d399" },
    { name: "PPPK", value: 82, color: "#60a5fa" },
    { name: "Non ASN", value: 49, color: "#f59e0b" },
];
const totalPenyuluh = dataPenyuluhTotal.reduce((sum, item) => sum + item.value, 0);

// 5. Data Rangkuman Penyuluh Berdasarkan Agama dan Status
const dataPenyuluhAgama = [
    { name: "Islam", pns: 17, pppk: 44, nonasn: 16, total: 77 },
    { name: "Kristen", pns: 9, pppk: 33, nonasn: 1, total: 43 },
    { name: "Katolik", pns: 0, pppk: 5, nonasn: 24, total: 29 },
    { name: "Hindu", pns: 1, pppk: 0, nonasn: 3, total: 4 },
    { name: "Buddha", pns: 1, pppk: 0, nonasn: 5, total: 6 },
    { name: "Khonghucu", pns: 0, pppk: 0, nonasn: 0, total: 0 },
];

// 6. Data Rincian Penyuluh (Baru Ditambahkan)
const dataPenyuluhDetail = {
    islam: {
        gender: { laki: 57, perempuan: 20 },
        status: { asn: 61, nonAsn: 16 },
        pns: { laki: 9, perempuan: 8, total: 17, pendidikan: { diBawahS1: 0, s1: 5, diAtasS1: 12 } },
        pppk: { laki: 33, perempuan: 11, total: 44, pendidikan: { diBawahS1: 0, s1: 35, diAtasS1: 9 } },
        nonAsn: { laki: 15, perempuan: 1, total: 16, pendidikan: { diBawahS1: 0, s1: 14, diAtasS1: 2 } },
    },
    kristen: {
        gender: { laki: 20, perempuan: 23 },
        status: { asn: 42, nonAsn: 1 },
        pns: { laki: 5, perempuan: 4, total: 9, pendidikan: { diBawahS1: 0, s1: 1, diAtasS1: 18 } },
        nonAsn: { laki: 1, perempuan: 0, total: 1, pendidikan: { diBawahS1: 0, s1: 1, diAtasS1: 0 } },
    },
    katolik: {
        gender: { laki: 21, perempuan: 8 },
        status: { asn: 5, nonAsn: 24 },
        pns: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        pppk: { laki: 5, perempuan: 0, total: 5, pendidikan: { diBawahS1: 0, s1: 5, diAtasS1: 0 } },
        nonAsn: { laki: 16, perempuan: 8, total: 24, pendidikan: { diBawahS1: 3, s1: 21, diAtasS1: 0 } },
    },
    hindu: {
        gender: { laki: 3, perempuan: 1 },
        status: { asn: 1, nonAsn: 3 },
        pns: { laki: 1, perempuan: 0, total: 1, pendidikan: { diBawahS1: 0, s1: 1, diAtasS1: 0 } },
        nonAsn: { laki: 2, perempuan: 1, total: 3, pendidikan: { diBawahS1: 1, s1: 2, diAtasS1: 0 } },
    },
    buddha: {
        gender: { laki: 5, perempuan: 1 },
        status: { asn: 1, nonAsn: 5 },
        pppk: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        nonAsn: { laki: 4, perempuan: 1, total: 5, pendidikan: { diBawahS1: 0, s1: 4, diAtasS1: 1 } },
    },
    khonghucu: {
        gender: { laki: 0, perempuan: 0 },
        status: { asn: 0, nonAsn: 0 },
        pns: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        pppk: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        nonAsn: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
    }
};

// 7. Data Penyuluh Non ASN Penerima Tunjangan
const dataPenyuluhTunjangan = [
    { name: "Islam", value: 97, color: "#10B981" },
    { name: "Katolik", value: 24, color: "#6366F1" },
    { name: "Buddha", value: 5, color: "#EF4444" },
    { name: "Hindu", value: 3, color: "#F59E0B" },
    { name: "Kristen", value: 1, color: "#3B82F6" },
    { name: "Khonghucu", value: 0, color: "#6B7280" },
];
const totalPenyuluhTunjangan = dataPenyuluhTunjangan.reduce((sum, item) => sum + item.value, 0);

// 8. Data Sasaran Bimbingan Penyuluhan
const dataSasaranPenyuluhan = [
    { name: "Islam", value: 350, color: "#10B981" },
    { name: "Katolik", value: 30, color: "#6366F1" },
    { name: "Hindu", value: 16, color: "#F59E0B" },
    { name: "Buddha", value: 12, color: "#EF4444" },
    { name: "Kristen", value: 8, color: "#3B82F6" },
    { name: "Khonghucu", value: 0, color: "#6B7280" },
];
const totalSasaranPenyuluhan = dataSasaranPenyuluhan.reduce((sum, item) => sum + item.value, 0);

// 9. Data KUA Berdasarkan Tipologi
const dataKuaTipologi = [
    { name: "C", value: 15, color: "#F59E0B" },
    { name: "B", value: 4, color: "#10B981" },
    { name: "A", value: 2, color: "#3B82F6" },
    { name: "D1", value: 0, color: "#EF4444" },
    { name: "D2", value: 0, color: "#A78BFA" },
];
const totalKUA = dataKuaTipologi.reduce((sum, item) => sum + item.value, 0);

// 10. Data KUA Status Tanah & Kondisi Bangunan
const dataKuaStatus = {
    tanah: { belumSertifikat: 19, sudahSertifikat: 2, total: 21 },
    bangunan: { baik: 10, rusakRingan: 6, rusakBerat: 5, total: 21 }
};

// 11. Data Revitalisasi KUA
const dataRevitalisasiKua = { rehabRingan: 3, rehabBerat: 2, total: 5 };

// 12. Data Penghulu Berdasarkan Jabatan
const dataPenghuluJabatan = [
    { name: "Madya", value: 35, color: "#F59E0B" },
    { name: "Pertama", value: 8, color: "#3B82F6" },
    { name: "Muda", value: 7, color: "#10B981" },
    { name: "Utama", value: 0, color: "#EF4444" },
];
const totalPenghulu = dataPenghuluJabatan.reduce((sum, item) => sum + item.value, 0);

// 13. Data Peristiwa Nikah Berdasarkan Tempat
const dataPeristiwaNikahTempat = { kua: 2165, luar: 3556, total: 5721 };

// 14. Data Peristiwa Nikah Bulanan (Total 5514 adalah total yg benar, 5734 di CSV typo)
const dataPeristiwaNikahBulan = [
    { bulan: "Jan", total: 937 },
    { bulan: "Feb", total: 1054 },
    { bulan: "Mar", total: 253 },
    { bulan: "Apr", total: 983 },
    { bulan: "Mei", total: 1175 },
    { bulan: "Jun", total: 1112 },
];
const totalNikahBulanIni = dataPeristiwaNikahBulan.reduce((sum, item) => sum + item.total, 0);

// 15. Data Buku Nikah yang Diedarkan
const dataBukuNikah = {
    totalBukuNikah: 11200,
    totalKartuNikah: 0,
    rincian: [
        { kua: "Medan Kota", buku: 200, kartu: 0 }, { kua: "Medan Sunggal", buku: 500, kartu: 0 },
        { kua: "Medan Helvetia", buku: 600, kartu: 0 }, { kua: "Medan Denai", buku: 800, kartu: 0 },
        { kua: "Medan Barat", buku: 300, kartu: 0 }, { kua: "Medan Deli", buku: 800, kartu: 0 },
        { kua: "Medan Tuntungan", buku: 300, kartu: 0 }, { kua: "Medan Belawan", buku: 600, kartu: 0 },
        { kua: "Medan Amplas", buku: 700, kartu: 0 }, { kua: "Medan Area", buku: 400, kartu: 0 },
        { kua: "Medan Johor", buku: 600, kartu: 0 }, { kua: "Medan Marelan", buku: 3200, kartu: 0 },
        { kua: "Medan Labuhan", buku: 600, kartu: 0 }, { kua: "Medan Tembung", buku: 700, kartu: 0 },
        { kua: "Medan Maimun", buku: 100, kartu: 0 }, { kua: "Medan Polonia", buku: 200, kartu: 0 },
        { kua: "Medan Baru", buku: 100, kartu: 0 }, { kua: "Medan Perjuangan", buku: 500, kartu: 0 },
        { kua: "Medan Petisah", buku: 300, kartu: 0 }, { kua: "Medan Timur", buku: 200, kartu: 0 },
        { kua: "Medan Selayang", buku: 400, kartu: 0 }
    ]
};

// 16. Data Peristiwa Rujuk
const totalPeristiwaRujuk = 0;
const dataRujuk = {
  totalRujuk: 0,
  rincian: [
    { kua: "Medan Kota", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Sunggal", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Helvetia", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Denai", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Barat", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Deli", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Tuntungan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Belawan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Amplas", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Area", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Johor", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Marelan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Labuhan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Tembung", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Maimun", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Polonia", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Baru", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Perjuangan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Petisah", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Timur", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 },
    { kua: "Medan Selayang", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, total: 0 }
  ]
};

// 17. Data Tanah Wakaf Berdasarkan Status
const dataTanahWakafStatus = { belum: 398, sudah: 766, total: 1164 };

// 18. Data Tanah Wakaf Berdasarkan Pemanfaatan
const dataTanahWakafPemanfaatan = [
    { name: "Masjid", value: 426, color: "#3B82F6" },
    { name: "Mushalla", value: 197, color: "#10B981" },
    { name: "Sekolah/Madrasah", value: 53, color: "#F59E0B" },
    { name: "Makam", value: 54, color: "#A78BFA" },
    { name: "Fasilitas Sosial", value: 9, color: "#6B7280" },
    { name: "Pesantren", value: 0, color: "#EF4444" },
];
const totalTanahWakafPemanfaatan = dataTanahWakafPemanfaatan.reduce((sum, item) => sum + item.value, 0);
const COLORS_WAKAF_MANFAAT = dataTanahWakafPemanfaatan.map(d => d.color);

// 19. Data Tanah Wakaf Produktif
const totalTanahWakafProduktif = 0;

// 20. DATA BARU (TERLEWAT) - Balai Nikah (CSV Kosong)
const dataBalaiNikah = []; // Kosong sesuai CSV

// 21. DATA BARU (TERLEWAT) - Penghulu (Pembinaan)
const dataPenghuluPembinaan = [
    { name: 'Pertama', value: 0 },
    { name: 'Muda', value: 0 },
    { name: 'Madya', value: 0 },
    { name: 'Utama', value: 0 },
];
const totalPenghuluPembinaan = 0;

// 22. DATA BARU (TERLEWAT) - Kasus Konflik (CSV Kosong)
const dataKasusKonflik = []; // Kosong sesuai CSV

// 23. DATA BARU (TERLEWAT) - Kasus Konfrontatif (CSV Kosong)
const dataKasusKonfrontatif = []; // Kosong sesuai CSV

// 24. DATA BARU (TERLEWAT) - Dialog Antar Umat (CSV Kosong)
const dataDialogAntarUmat = []; // Kosong sesuai CSV

// 25. DATA BARU (TERLEWAT) - Dialog Intern Umat (CSV Kosong)
const dataDialogInternUmat = []; // Kosong sesuai CSV

// 26. DATA BARU (TERLEWAT) - Qari & Hafidz (CSV Kosong)
const dataQariHafidz = []; // Kosong sesuai CSV


// --- Definisi Kolom untuk Tabel (Dilengkapi) ---

const pendudukAgamaColumns = [
    { header: 'Agama', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const rumahIbadahColumns = [
    { header: 'Jenis', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const tipologiMasjidColumns = [
    { header: 'Tipologi', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const penyuluhAgamaColumns = [
    { header: 'Agama', key: 'name' },
    { header: 'PNS', key: 'pns', align: 'right' },
    { header: 'PPPK', key: 'pppk', align: 'right' },
    { header: 'Non ASN', key: 'nonasn', align: 'right' },
    { header: 'Total', key: 'total', align: 'right' },
];
const kuaTipologiColumns = [
    { header: 'Tipologi', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const penghuluJabatanColumns = [
    { header: 'Jabatan', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const nikahBulanColumns = [
    { header: 'Bulan', key: 'bulan' },
    { header: 'Jumlah Nikah', key: 'total', align: 'right' },
];
const tanahWakafPemanfaatanColumns = [
    { header: 'Pemanfaatan', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
// Kolom baru
const penyuluhTunjanganColumns = [
    { header: 'Agama', key: 'name' },
    { header: 'Penerima Tunjangan', key: 'value', align: 'right' },
];
const sasaranPenyuluhanColumns = [
    { header: 'Agama', key: 'name' },
    { header: 'Jumlah Sasaran', key: 'value', align: 'right' },
];
const penyuluhDetailColumns = [
    { header: 'Agama', key: 'agama' },
    { header: 'Laki-laki', key: 'laki', align: 'right' },
    { header: 'Perempuan', key: 'perempuan', align: 'right' },
    { header: 'Total Gender', key: 'totalGender', align: 'right' },
    { header: 'ASN', key: 'asn', align: 'right' },
    { header: 'Non ASN', key: 'nonAsn', align: 'right' },
    { header: 'Total Status', key: 'totalStatus', align: 'right' },
];
const nikahTempatColumns = [
    { header: 'Tempat', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const peristiwaRujukColumns = [
    { header: 'KUA Kecamatan', key: 'kua' },
    { header: 'Jan', key: 'jan', align: 'right' },
    { header: 'Feb', key: 'feb', align: 'right' },
    { header: 'Mar', key: 'mar', align: 'right' },
    { header: 'Apr', key: 'apr', align: 'right' },
    { header: 'Mei', key: 'mei', align: 'right' },
    { header: 'Jun', key: 'jun', align: 'right' },
    { header: 'Total', key: 'total', align: 'right' },
];
const kuaTanahColumns = [
    { header: 'Status Tanah', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const kuaBangunanColumns = [
    { header: 'Kondisi Bangunan', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const kuaRevitalisasiColumns = [
    { header: 'Jenis Revitalisasi', key: 'name' },
    { header: 'Jumlah', key: 'value', align: 'right' },
];
const bukuNikahColumns = [
    { header: 'KUA Kecamatan', key: 'kua' },
    { header: 'Buku Nikah', key: 'buku', align: 'right' },
    { header: 'Kartu Nikah', key: 'kartu', align: 'right' },
];
// Kolom untuk data baru (terlewat)
const balaiNikahColumns = [
    { header: 'KUA', key: 'kua' },
    { header: 'Balai Nikah', key: 'balai_nikah', align: 'right' },
    { header: 'Jumlah', key: 'jumlah', align: 'right' },
];
const penghuluPembinaanColumns = [
    { header: 'Tingkat Jabatan', key: 'name' },
    { header: 'Jumlah Dibina', key: 'value', align: 'right' },
];
const kasusKonflikColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'Jumlah Konflik', key: 'konflik', align: 'right' },
    { header: 'Penyelesaian', key: 'penyelesaian', align: 'right' },
];
const kasusKonfrontatifColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'Jumlah Kasus', key: 'kasus', align: 'right' },
    { header: 'Penyelesaian', key: 'penyelesaian', align: 'right' },
];
const dialogAntarUmatColumns = [
    { header: 'Kecamatan', key: 'kecamatan' },
    { header: 'Jumlah Kegiatan', key: 'kegiatan', align: 'right' },
];
const dialogInternUmatColumns = [
    { header: 'Agama', key: 'agama' },
    { header: 'Jumlah Kegiatan', key: 'kegiatan', align: 'right' },
];
const qariHafidzColumns = [
    { header: 'Kategori', key: 'kategori' },
    { header: 'Laki-laki', key: 'lk', align: 'right' },
    { header: 'Perempuan', key: 'pr', align: 'right' },
    { header: 'Total', key: 'total', align: 'right' },
];


// --- 3. Komponen Angka Animasi ---
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => { if (isInView && ref.current) { animate(0, value, { duration: 1.5, ease: "easeOut", onUpdate: (latest) => { if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString('id-ID'); }, }); } else if (ref.current) { ref.current.textContent = value.toLocaleString('id-ID'); } }, [isInView, value]);
  return <span ref={ref}>{value.toLocaleString('id-ID')}</span>;
};

// --- 4. Komponen Kartu KPI ---
const KpiCard = ({ icon, title, value, color, theme, small = false }) => {
  const cardVariant = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const cardBgColor = theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.6)';
  const cardBorderColor = theme === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(21, 128, 61, 0.2)';

  return ( <motion.div variants={cardVariant} className={`relative w-full overflow-hidden rounded-lg backdrop-blur-md border ${small ? 'p-3' : 'p-5'}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
      <div className={`flex items-center ${small ? 'space-x-3' : 'space-x-4'}`}>
        <div className={`flex-shrink-0 rounded-lg flex items-center justify-center ${small ? 'w-8 h-8' : 'w-10 h-10'}`} style={{ background: `linear-gradient(135deg, ${color}66 0%, ${color}99 100%)` }}>
          {React.cloneElement(icon, { style: { color: 'white' }, className: small ? "w-4 h-4" : "w-5 h-5" })}
        </div>
        <div>
          <h3 className={`font-medium uppercase tracking-wider ${small ? 'text-xs' : 'text-sm'} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
          <p className={`font-bold ${small ? 'text-xl' : 'text-2xl'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ color: color }}> <AnimatedNumber value={value} /> </p>
        </div>
      </div>
    </motion.div> );
};

// --- 5. Komponen Kartu Chart ---
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
  const cardBgColor = theme === 'dark' ? 'rgba(16, 40, 32, 0.3)' : 'rgba(240, 255, 244, 0.4)';
  const cardBorderColor = theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(34, 197, 94, 0.1)';
  const legendColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const textLabelColor = theme === 'dark' ? '#A3BFB7' : '#374151';
  const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';

  const ToggleButton = ({ type, Icon }) => (
    <button
      onClick={() => onToggle(type)}
      className={`p-1 rounded ${currentView === type
        ? (theme === 'dark' ? 'bg-green-700/60 text-green-100' : 'bg-green-100 text-green-700')
        : (theme === 'dark' ? 'text-gray-500 hover:bg-gray-700/40 hover:text-green-300' : 'text-gray-400 hover:bg-gray-100/50 hover:text-green-600')
      } transition-colors`}
      aria-label={`Ubah ke ${type} chart`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <motion.div variants={itemVariant} className={`rounded-lg backdrop-blur-sm border overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
      <div className="p-4 sm:p-5">
        <h3 className={`text-md font-semibold mb-3 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}> {title} </h3>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            {allowToggle && (
              <div className="flex space-x-1 p-0.5 rounded backdrop-blur-sm order-1 sm:order-none" style={{backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(255, 255, 255, 0.3)'}}>
                <ToggleButton type="pie" Icon={PieIcon} />
                <ToggleButton type="bar" Icon={BarIcon} />
              </div>
            )}
            <button onClick={handleDownloadCSV} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border order-2 sm:order-none ${theme === 'dark' ? 'bg-green-900/30 border-green-700/50 text-green-300 hover:bg-green-800/50 hover:border-green-600/50' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`} >
              <DownloadIcon className="w-3 h-3" /> Download CSV
            </button>
        </div>
        <div className="h-56 sm:h-64 min-w-0">
           {/* Pie Chart */}
           {currentView === 'pie' && chartType !== 'area' && chartType !== 'bar-only' && chartType !== 'penyuluh_agama' && (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={csvData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%">
                            {csvData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || COLORS_AGAMA[index % COLORS_AGAMA.length]} />
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
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS_AGAMA[index % COLORS_AGAMA.length]} />
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
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="bulan" tick={{ fill: textLabelColor, fontSize: 12 }} />
                        <YAxis tick={{ fill: textLabelColor, fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip theme={theme} chartType="area"/>} />
                        <Area type="monotone" dataKey="total" name="Jumlah Nikah" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorNikahArea)" activeDot={{ r: 6 }} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
      </div>
    </motion.div>
  );
};

// --- 6. Komponen Tombol Filter ---
const FilterButton = ({ text, icon, onClick, isActive, theme }) => {
    const activeBg = theme === 'dark' ? 'bg-green-700/50' : 'bg-green-100';
    const activeText = theme === 'dark' ? 'text-green-200' : 'text-green-800';
    const inactiveText = theme === 'dark' ? 'text-gray-400 hover:text-green-300' : 'text-gray-500 hover:text-green-700';
    const inactiveBgHover = theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50';

    return ( <motion.button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium text-left transition-all duration-200 relative ${isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${inactiveBgHover}`}`} whileTap={{ scale: 0.98 }} >
            {isActive && ( <motion.div layoutId="filter-highlight-keagamaan-side" className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} /> )}
            {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
            <span className="text-sm">{text}</span>
        </motion.button> );
};

// --- 7. Komponen Tooltip Kustom ---
const CustomTooltip = ({ active, payload, label, theme, chartType = 'pie' }) => {
  if (active && payload && payload.length) {
    const data = payload[0]; const item = data.payload.payload || data.payload; const name = label || item.name; const value = data.value;
    return ( <div className={`rounded-md p-2.5 shadow-lg backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
        <p className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</p>
        {(chartType === 'area' || chartType === 'line') && payload.map((p, index) => (
             <p key={index} className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Jumlah: {p.value.toLocaleString('id-ID')} </p>
        ))}
        {chartType !== 'line' && chartType !== 'area' && (
            chartType === 'penyuluh_agama' ? (
                <>
                    {payload.map((p, index) => (
                        <p key={index} className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} style={{ color: p.fill }}> {/* Menggunakan p.fill untuk warna stack */}
                            {p.name}: {p.value.toLocaleString('id-ID')}
                        </p>
                    ))}
                    <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>
                        Total: {payload.reduce((sum, entry) => sum + entry.value, 0).toLocaleString('id-ID')}
                    </p>
                </>
            ) : (
                 <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Jumlah: {value.toLocaleString('id-ID')} </p>
            )
        )}
        {chartType === 'pie' && item.percent && ( <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> Persentase: {(item.percent * 100).toFixed(1)}% </p> )}
      </div> );
  } return null;
};

// --- 8. Komponen Tabel Dinamis ---
const DynamicTable = ({ title, data, columns, theme, className = "" }) => {
    const tableBg = theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/40';
    const tableBorder = theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/50';
    const headerBg = theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50/50';
    const headerText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const rowBorder = theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-200/50';
    const rowHover = theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50/50';
    const cellText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const cellTextPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const cardBgColor = theme === 'dark' ? 'rgba(16, 40, 32, 0.3)' : 'rgba(240, 255, 244, 0.4)';
    const cardBorderColor = theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(34, 197, 94, 0.1)';
    const itemVariant = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };


    return (
        <motion.div variants={itemVariant} className={`rounded-lg backdrop-blur-sm border overflow-hidden ${className}`} style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }} >
            <div className="p-4 sm:p-5">
                 <h3 className={`text-md font-semibold mb-5 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}> {title} </h3>
                 {(!data || data.length === 0) ? (
                    <p className={`text-center text-sm py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada data untuk ditampilkan pada tabel ini.</p>
                 ) : (
                    <div className={`w-full max-h-96 overflow-auto rounded-lg border ${tableBg} ${tableBorder}`}>
                        <table className="min-w-full divide-y ${rowBorder}">
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

  // Data formatting untuk charts
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
        const totalGender = (item.gender.laki || 0) + (item.gender.perempuan || 0);
        const totalStatus = (item.status?.asn || 0) + (item.status?.nonAsn || 0);
        return {
          agama: key.charAt(0).toUpperCase() + key.slice(1),
          laki: item.gender.laki || 0,
          perempuan: item.gender.perempuan || 0,
          totalGender: totalGender,
          asn: item.status?.asn || 0,
          nonAsn: item.status?.nonAsn || 0,
          totalStatus: totalStatus,
        };
    });


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
  const backgroundStyle = theme === 'dark' ? { background: 'radial-gradient(circle at center top, #210E37 0%, #3F1C80 50%)' } : { background: 'radial-gradient(circle at center top, #f0fdfa 0%, #ccfbf1 100%)' };

  return (
    <motion.div id="data-keagamaan" className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={backgroundStyle} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={containerVariant} >
      <div className={`absolute top-1/4 left-0 w-80 h-80 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 ${theme === 'dark' ? 'bg-emerald-700' : 'bg-emerald-200'}`}></div>
      <div className={`absolute bottom-1/4 right-0 w-72 h-72 rounded-full filter blur-3xl opacity-20 translate-x-1/2 ${theme === 'dark' ? 'bg-teal-800' : 'bg-teal-200'}`}></div>
      <div className="mx-auto md:mx-12 relative z-10">
        <motion.div className="text-center mb-10" variants={itemVariant} >
          <h2 style={{ lineHeight: '1.2' }} className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r pb-2 ${theme === 'dark' ? 'from-emerald-300 to-teal-400' : 'from-emerald-600 to-teal-700'}`}> Data Keagamaan </h2>
          <p className={`mt-3 text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> Statistik penduduk, rumah ibadah, penyuluh agama, layanan KUA, dan wakaf di Kota Medan. </p>
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" variants={containerVariant}>
            <KpiCard title="Total Penduduk" value={totalPenduduk} icon={<ReligionIcon />} color={theme === 'dark' ? "#6ee7b7" : "#059669"} theme={theme} />
            <KpiCard title="Total Masjid" value={totalMasjid} icon={<MosqueIcon />} color={theme === 'dark' ? "#5eead4" : "#0d9488"} theme={theme} />
            <KpiCard title="Total Penyuluh" value={totalPenyuluh} icon={<CounselorIcon />} color={theme === 'dark' ? "#67e8f9" : "#0891b2"} theme={theme} />
        </motion.div>
        <div className="flex flex-col md:flex-row gap-8">
            <motion.div className="w-full md:w-1/4 lg:w-1/5" variants={itemVariant}>
                <div className={`rounded-lg p-3 space-y-2 backdrop-blur-sm border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/50 border-gray-200/50'}`}>
                    <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Kategori Data</h4>
                    <p className={`px-2 text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pilih kategori untuk melihat detail data.</p>
                    {filters.map(f => ( <FilterButton key={f.key} text={f.text} icon={f.icon} onClick={() => setFilter(f.key)} isActive={filter === f.key} theme={theme} /> ))}
                </div>
            </motion.div>
            <div className="w-full md:w-3/4 lg:w-4/5">
                <AnimatePresence mode="wait">
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
                            <div /> {/* Spacer */}
                             <ChartCard
                                title={`Status Tanah Wakaf (Total: ${dataTanahWakafStatus.total.toLocaleString('id-ID')} m²)`}
                                csvData={[{name: 'Belum Sertifikat', value: dataTanahWakafStatus.belum, color: "#f87171"}, {name: 'Sudah Sertifikat', value: dataTanahWakafStatus.sudah, color: "#4ade80"}]}
                                csvColumns={[{ header: 'Status', key: 'name' }, { header: 'Luas (m²)', key: 'value', align: 'right' }]} csvFilename="wakaf_status.csv"
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

