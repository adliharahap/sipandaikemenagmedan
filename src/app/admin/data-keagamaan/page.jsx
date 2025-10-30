"use client";

import React, { useState, useEffect, Fragment } from 'react';
// DIUBAH: Impor getApps dan getApp untuk mencegah error duplikasi
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    setLogLevel
} from 'firebase/firestore';

// --- Inisialisasi Firebase (Diperbaiki) ---
const firebaseConfig = typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : { apiKey: "AIza...", authDomain: "...", projectId: "default-project" };

// PERBAIKAN: Cek jika app sudah ada sebelum inisialisasi
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// --- Akhir Inisialisasi ---

// --- Ikon ---
const SaveIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

// --- DATA KONSTAN AWAL ---
// (Data lengkap Anda disalin di sini)

// 1. Data Penduduk Berdasarkan Agama
const dataPendudukAgama = [
    { name: "Islam", value: 1641401 }, { name: "Kristen", value: 480471 },
    { name: "Katolik", value: 332573 }, { name: "Buddha", value: 230945 },
    { name: "Hindu", value: 10945 }, { name: "Khonghucu", value: 11194 },
];
// 2. Data Rumah Ibadah
const dataRumahIbadah = [
    { name: "Masjid", value: 1106 }, { name: "Gereja Kristen", value: 1250 },
    { name: "Gereja Katolik", value: 350 }, { name: "Pura", value: 15 },
    { name: "Vihara", value: 180 }, { name: "Klenteng", value: 75 },
];
// 3. Data Tipologi Masjid
const dataTipologiMasjid = [
    { name: "Masjid Raya", value: 1 }, { name: "Masjid Agung", value: 1 },
    { name: "Masjid Besar", value: 4 }, { name: "Masjid Jami'", value: 668 },
    { name: "Masjid Bersejarah", value: 2 }, { name: "Masjid Tempat Publik", value: 430 },
];
// 4. Data Rangkuman Penyuluh Berdasarkan Agama dan Status
const dataPenyuluhAgama = [
    { name: "Islam", pns: 17, pppk: 44, nonasn: 16, total: 77 },
    { name: "Kristen", pns: 9, pppk: 33, nonasn: 1, total: 43 },
    { name: "Katolik", pns: 0, pppk: 5, nonasn: 24, total: 29 },
    { name: "Hindu", pns: 1, pppk: 0, nonasn: 3, total: 4 },
    { name: "Buddha", pns: 1, pppk: 0, nonasn: 5, total: 6 },
    { name: "Khonghucu", pns: 0, pppk: 0, nonasn: 0, total: 0 },
];
// 5. Data Rincian Penyuluh
const dataPenyuluhDetail = {
    islam: {
        gender: { laki: 57, perempuan: 20 }, status: { asn: 61, nonAsn: 16 },
        pns: { laki: 9, perempuan: 8, total: 17, pendidikan: { diBawahS1: 0, s1: 5, diAtasS1: 12 } },
        pppk: { laki: 33, perempuan: 11, total: 44, pendidikan: { diBawahS1: 0, s1: 35, diAtasS1: 9 } },
        nonAsn: { laki: 15, perempuan: 1, total: 16, pendidikan: { diBawahS1: 0, s1: 14, diAtasS1: 2 } },
    },
    kristen: {
        gender: { laki: 20, perempuan: 23 }, status: { asn: 42, nonAsn: 1 },
        pns: { laki: 5, perempuan: 4, total: 9, pendidikan: { diBawahS1: 0, s1: 1, diAtasS1: 18 } },
        nonAsn: { laki: 1, perempuan: 0, total: 1, pendidikan: { diBawahS1: 0, s1: 1, diAtasS1: 0 } },
    },
    katolik: {
        gender: { laki: 21, perempuan: 8 }, status: { asn: 5, nonAsn: 24 },
        pns: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        pppk: { laki: 5, perempuan: 0, total: 5, pendidikan: { diBawahS1: 0, s1: 5, diAtasS1: 0 } },
        nonAsn: { laki: 16, perempuan: 8, total: 24, pendidikan: { diBawahS1: 3, s1: 21, diAtasS1: 0 } },
    },
    hindu: {
        gender: { laki: 3, perempuan: 1 }, status: { asn: 1, nonAsn: 3 },
        pns: { laki: 1, perempuan: 0, total: 1, pendidikan: { diBawahS1: 0, s1: 1, diAtasS1: 0 } },
        nonAsn: { laki: 2, perempuan: 1, total: 3, pendidikan: { diBawahS1: 1, s1: 2, diAtasS1: 0 } },
    },
    buddha: {
        gender: { laki: 5, perempuan: 1 }, status: { asn: 1, nonAsn: 5 },
        pppk: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        nonAsn: { laki: 4, perempuan: 1, total: 5, pendidikan: { diBawahS1: 0, s1: 4, diAtasS1: 1 } },
    },
    khonghucu: {
        gender: { laki: 0, perempuan: 0 }, status: { asn: 0, nonAsn: 0 },
        pns: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        pppk: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
        nonAsn: { laki: 0, perempuan: 0, total: 0, pendidikan: { diBawahS1: 0, s1: 0, diAtasS1: 0 } },
    }
};
// 6. Data Penyuluh Non ASN Penerima Tunjangan
const dataPenyuluhTunjangan = [
    { name: "Islam", value: 97 }, { name: "Katolik", value: 24 },
    { name: "Buddha", value: 5 }, { name: "Hindu", value: 3 },
    { name: "Kristen", value: 1 }, { name: "Khonghucu", value: 0 },
];
// 7. Data Sasaran Bimbingan Penyuluhan
const dataSasaranPenyuluhan = [
    { name: "Islam", value: 350 }, { name: "Katolik", value: 30 },
    { name: "Hindu", value: 16 }, { name: "Buddha", value: 12 },
    { name: "Kristen", value: 8 }, { name: "Khonghucu", value: 0 },
];
// 8. Data KUA Berdasarkan Tipologi
const dataKuaTipologi = [
    { name: "C", value: 15 }, { name: "B", value: 4 },
    { name: "A", value: 2 }, { name: "D1", value: 0 }, { name: "D2", value: 0 },
];
// 9. Data KUA Status Tanah & Kondisi Bangunan
const dataKuaStatus = {
    tanah: { belumSertifikat: 19, sudahSertifikat: 2, total: 21 },
    bangunan: { baik: 10, rusakRingan: 6, rusakBerat: 5, total: 21 }
};
// 10. Data Revitalisasi KUA
const dataRevitalisasiKua = { rehabRingan: 3, rehabBerat: 2, total: 5 };
// 11. Data Penghulu Berdasarkan Jabatan
const dataPenghuluJabatan = [
    { name: "Madya", value: 35 }, { name: "Pertama", value: 8 },
    { name: "Muda", value: 7 }, { name: "Utama", value: 0 },
];
// 12. Data Peristiwa Nikah Berdasarkan Tempat
const dataPeristiwaNikahTempat = { kua: 2165, luar: 3556, total: 5721 };
// 13. Data Peristiwa Nikah Bulanan
const dataPeristiwaNikahBulan = [
    { bulan: "Jan", total: 937 },
    { bulan: "Feb", total: 1054 },
    { bulan: "Mar", total: 253 },
    { bulan: "Apr", total: 983 },
    { bulan: "Mei", total: 1175 },
    { bulan: "Jun", total: 1112 },
    { bulan: "Jul", total: 0 },
    { bulan: "Agu", total: 0 },
    { bulan: "Sep", total: 0 },
    { bulan: "Okt", total: 0 },
    { bulan: "Nov", total: 0 },
    { bulan: "Des", total: 0 },
];

// 14. Data Buku Nikah yang Diedarkan
const dataBukuNikah = {
    totalBukuNikah: 11200, totalKartuNikah: 0,
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
// 15. Data Peristiwa Rujuk
const totalPeristiwaRujuk = 0; // Data ini ada di file, tapi dataRujuk.totalRujuk juga 0
const dataRujuk = {
    totalRujuk: 0,
    rincian: [
        { kua: "Medan Kota", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Sunggal", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Helvetia", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Denai", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Barat", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Deli", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Tuntungan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Belawan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Amplas", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Area", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Johor", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Marelan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Labuhan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Tembung", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Maimun", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Polonia", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Baru", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Perjuangan", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Petisah", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Timur", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 },
        { kua: "Medan Selayang", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agust: 0, sept: 0, okt: 0, nov: 0, des: 0, total: 0 }
    ]
};
// 16. Data Tanah Wakaf Berdasarkan Status
const dataTanahWakafStatus = { belum: 398, sudah: 766, total: 1164 };
// 17. Data Tanah Wakaf Berdasarkan Pemanfaatan
const dataTanahWakafPemanfaatan = [
    { name: "Masjid", value: 426 }, { name: "Mushalla", value: 197 },
    { name: "Sekolah/Madrasah", value: 53 }, { name: "Makam", value: 54 },
    { name: "Fasilitas Sosial", value: 9 }, { name: "Pesantren", value: 0 },
];
// 18. Data Tanah Wakaf Produktif
const totalTanahWakafProduktif = 0;
// 19. DATA BARU - Balai Nikah
const dataBalaiNikah = [];
// 20. DATA BARU - Penghulu (Pembinaan)
const dataPenghuluPembinaan = [
    { name: 'Pertama', value: 0 }, { name: 'Muda', value: 0 },
    { name: 'Madya', value: 0 }, { name: 'Utama', value: 0 },
];
// 21. DATA BARU - Kasus Konflik
const dataKasusKonflik = [];
// 22. DATA BARU - Kasus Konfrontatif
const dataKasusKonfrontatif = [];
// 23. DATA BARU - Dialog Antar Umat
const dataDialogAntarUmat = [];
// 24. DATA BARU - Dialog Intern Umat
const dataDialogInternUmat = [];
// 25. DATA BARU - Qari & Hafidz
const dataQariHafidz = [];


// --- Gabungkan Semua Data Awal ---
const dataKeagamaanAwal = {
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
    rujuk: dataRujuk,
    tanahWakafStatus: dataTanahWakafStatus,
    tanahWakafPemanfaatan: dataTanahWakafPemanfaatan,
    tanahWakafProduktif: totalTanahWakafProduktif,
    balaiNikah: dataBalaiNikah,
    penghuluPembinaan: dataPenghuluPembinaan,
    kasusKonflik: dataKasusKonflik,
    kasusKonfrontatif: dataKasusKonfrontatif,
    dialogAntarUmat: dataDialogAntarUmat,
    dialogInternUmat: dataDialogInternUmat,
    qariHafidz: dataQariHafidz,
};


// --- Komponen UI ---

const EditableCell = ({ value, onChange, type = 'text', readOnly = false, className = "" }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full p-2 border rounded-md transition-all ${readOnly ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-transparent border-gray-300 focus:bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500'
            } ${className}`}
        step={type === 'number' ? '1' : undefined}
    />
);

// Komponen Card Admin
const AdminCard = ({ title, children, fullWidth = false }) => (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${fullWidth ? 'lg:col-span-3 md:col-span-2' : ''}`}>
        <h2 className="text-xl font-semibold text-gray-800 p-4 border-b border-gray-200 bg-gray-50">
            {title}
        </h2>
        <div className="p-4 space-y-4">{children}</div>
    </div>
);

// Komponen Form Sederhana (Label + Input)
const FormRow = ({ label, children }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
        <label className="text-sm font-medium text-gray-600 self-center">{label}</label>
        {children}
    </div>
);


// --- Komponen Halaman Admin ---

const DataKeagamaanPage = () => {
    // State aplikasi
    const [docRef, setDocRef] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasChanged, setHasChanged] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    // State untuk validasi JSON
    const [isPenyuluhJsonValid, setIsPenyuluhJsonValid] = useState(true);

    // 1. Efek Listener Data (Hanya sekali jalan)
    useEffect(() => {
        setIsLoading(true);
        setLogLevel('Debug');

        const ref = doc(db, "public", "keagamaan");
        console.log("Listening to doc:", ref.path);
        setDocRef(ref);

        const unsubscribe = onSnapshot(ref, async (docSnap) => {
            let data;
            if (docSnap.exists() && docSnap.data().data) {
                data = docSnap.data().data;
                console.log("Data loaded from Firebase.");
            } else {
                console.log("No data found, seeding default data...");
                try {
                    await setDoc(ref, { data: dataKeagamaanAwal });
                    data = dataKeagamaanAwal;
                    console.log("Default data seeded.");
                } catch (error) {
                    console.error("Error seeding data:", error);
                }
            }

            // Pastikan semua data awal ada jika dokumen firebase tidak lengkap
            const completeData = { ...dataKeagamaanAwal, ...data };

            setCurrentData(completeData);
            setOriginalData(completeData);
            setIsLoading(false);
            setHasChanged(false);
        }, (error) => {
            console.error("Error listening to data:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Efek Deteksi Perubahan Data
    useEffect(() => {
        if (!currentData || !originalData) return;
        const isDifferent = JSON.stringify(currentData) !== JSON.stringify(originalData);
        setHasChanged(isDifferent);
        console.log("Data changed:", isDifferent);
        console.log("currentdata :", currentData);
    }, [currentData, originalData]);

    // --- Handlers ---

    const handleSaveChanges = async () => {
        if (!docRef || !hasChanged || !isPenyuluhJsonValid) return;
        try {
            await updateDoc(docRef, { data: currentData });
            setShowSuccess(true);
            setOriginalData(currentData);
            setTimeout(() => setShowSuccess(false), 2000);
            console.log("Changes saved.");
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    // Handler untuk tabel array sederhana (cth: pendudukAgama, rumahIbadah)
    const handleTableChange = (dataKey, index, field, value) => {
        if (!currentData || !Array.isArray(currentData[dataKey])) return;

        const newArray = [...currentData[dataKey]];
        const updatedItem = { ...newArray[index] };

        if (typeof updatedItem[field] === 'number') {
            updatedItem[field] = parseInt(value, 10) || 0;
        } else {
            updatedItem[field] = value;
        }

        // Hitung ulang total jika ada
        if (updatedItem.total !== undefined) {
            if (dataKey === 'penyuluhAgama') {
                updatedItem.total = (updatedItem.pns || 0) + (updatedItem.pppk || 0) + (updatedItem.nonasn || 0);
            }
        }

        newArray[index] = updatedItem;


        setCurrentData({ ...currentData, [dataKey]: newArray });
    };

    // Handler untuk objek sederhana (cth: revitalisasiKua, peristiwaNikahTempat)
    const handleObjectChange = (dataKey, field, value) => {
        if (!currentData || typeof currentData[dataKey] !== 'object') return;

        const val = parseInt(value, 10) || 0;
        const newObj = { ...currentData[dataKey], [field]: val };

        // Hitung ulang total otomatis
        if (newObj.total !== undefined) {
            if (dataKey === 'revitalisasiKua') {
                newObj.total = (newObj.rehabRingan || 0) + (newObj.rehabBerat || 0);
            } else if (dataKey === 'peristiwaNikahTempat') {
                newObj.total = (newObj.kua || 0) + (newObj.luar || 0);
            } else if (dataKey === 'tanahWakafStatus') {
                newObj.total = (newObj.belum || 0) + (newObj.sudah || 0);
            }
        }

        setCurrentData({ ...currentData, [dataKey]: newObj });
    };

    // Handler untuk objek berlapis (hanya untuk kuaStatus)
    const handleNestedObjectChange = (dataKey, subKey, field, value) => {
        if (!currentData || !currentData[dataKey] || !currentData[dataKey][subKey]) return;

        const val = parseInt(value, 10) || 0;
        const newSubObj = { ...currentData[dataKey][subKey], [field]: val };

        // Hitung ulang total otomatis
        if (field !== 'total') {
            if (newSubObj.belumSertifikat !== undefined) newSubObj.total = (newSubObj.belumSertifikat || 0) + (newSubObj.sudahSertifikat || 0);
            else if (newSubObj.baik !== undefined) newSubObj.total = (newSubObj.baik || 0) + (newSubObj.rusakRingan || 0) + (newSubObj.rusakBerat || 0);
        }

        setCurrentData({
            ...currentData,
            [dataKey]: { ...currentData[dataKey], [subKey]: newSubObj }
        });
    };

    // Handler untuk nilai tunggal di root (cth: tanahWakafProduktif)
    const handleSingleValueChange = (dataKey, value) => {
        setCurrentData({ ...currentData, [dataKey]: parseInt(value, 10) || 0 });
    };

    // Handler untuk tabel kompleks di dalam objek (cth: bukuNikah.rincian)
    const handleComplexTableChange = (dataKey, subKey, index, field, value) => {
        if (!currentData || !currentData[dataKey] || !Array.isArray(currentData[dataKey][subKey])) return;

        const newArray = [...currentData[dataKey][subKey]];
        const updatedItem = { ...newArray[index] };

        if (typeof updatedItem[field] === 'number') {
            updatedItem[field] = parseInt(value, 10) || 0;
        } else {
            updatedItem[field] = value;
        }

        // Hitung ulang total baris (jika ada)
        if (dataKey === 'rujuk' && updatedItem.total !== undefined) {
            // PERBAIKAN: Menambahkan semua 12 bulan ke dalam total
            updatedItem.total = (updatedItem.jan || 0) + (updatedItem.feb || 0) + (updatedItem.mar || 0) +
                (updatedItem.apr || 0) + (updatedItem.mei || 0) + (updatedItem.jun || 0) +
                (updatedItem.jul || 0) + (updatedItem.agust || 0) + (updatedItem.sept || 0) +
                (updatedItem.okt || 0) + (updatedItem.nov || 0) + (updatedItem.des || 0);
        }

        newArray[index] = updatedItem;
        const newData = {
            ...currentData,
            [dataKey]: {
                ...currentData[dataKey],
                [subKey]: newArray
            }
        };

        // Hitung ulang total keseluruhan objek
        if (dataKey === 'bukuNikah') {
            newData.bukuNikah.totalBukuNikah = newArray.reduce((sum, item) => sum + (item.buku || 0), 0);
            newData.bukuNikah.totalKartuNikah = newArray.reduce((sum, item) => sum + (item.kartu || 0), 0);
        } else if (dataKey === 'rujuk') {
            newData.rujuk.totalRujuk = newArray.reduce((sum, item) => sum + (item.total || 0), 0);
        }

        setCurrentData(newData);
    };

    // Handler untuk properti di dalam objek kompleks (cth: bukuNikah.totalBukuNikah)
    // Ini digunakan jika Anda ingin totalnya dapat diedit manual
    const handleComplexPropertyChange = (dataKey, field, value) => {
        if (!currentData || !currentData[dataKey]) return;
        setCurrentData({
            ...currentData,
            [dataKey]: {
                ...currentData[dataKey],
                [field]: parseInt(value, 10) || 0
            }
        });
    };

    // Handler untuk editor JSON (penyuluhDetail)
    const handlePenyuluhDetailChange = (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            setCurrentData({ ...currentData, penyuluhDetail: parsed });
            setIsPenyuluhJsonValid(true);
        } catch (e) {
            setIsPenyuluhJsonValid(false);
        }
    };


    // Tampilkan loading
    if (isLoading || !currentData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-700">Loading Data Keagamaan...</div>
            </div>
        );
    }

    // --- Render UI ---
    return (
        <Fragment>
            {/* Header Sticky untuk Simpan */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Data Keagamaan
                    </h1>
                    <div className="flex items-center gap-4">
                        {showSuccess && (
                            <span className="text-green-600 font-medium transition-opacity duration-300">
                                Tersimpan!
                            </span>
                        )}
                        {!isPenyuluhJsonValid && (
                            <span className="text-red-600 font-medium">
                                JSON Rincian Penyuluh tidak valid!
                            </span>
                        )}
                        <button
                            onClick={handleSaveChanges}
                            disabled={!hasChanged || !isPenyuluhJsonValid}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <SaveIcon className="w-5 h-5 mr-2" />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>

            {/* Konten Utama Halaman */}
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* 1. Penduduk Berdasarkan Agama */}
                    <AdminCard title="Penduduk Berdasarkan Agama">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Agama</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.pendudukAgama.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('pendudukAgama', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('pendudukAgama', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 2. Rumah Ibadah */}
                    <AdminCard title="Rumah Ibadah">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Jenis</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.rumahIbadah.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('rumahIbadah', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('rumahIbadah', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 3. Tipologi Masjid */}
                    <AdminCard title="Tipologi Masjid">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Tipologi</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.tipologiMasjid.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('tipologiMasjid', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('tipologiMasjid', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 4. Penyuluh Berdasarkan Agama (Full Width) */}
                    <AdminCard title="Penyuluh Berdasarkan Agama & Status" fullWidth={true}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-gray-300">
                                    <tr className="text-left text-sm font-medium text-gray-600">
                                        <th className="py-2">Agama</th>
                                        <th className="py-2 text-right">PNS</th>
                                        <th className="py-2 text-right">PPPK</th>
                                        <th className="py-2 text-right">Non ASN</th>
                                        <th className="py-2 text-right">Total (Otomatis)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.penyuluhAgama.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="py-2 pr-1 min-w-[150px]">
                                                <EditableCell value={item.name} onChange={(e) => handleTableChange('penyuluhAgama', index, 'name', e.target.value)} className="font-medium" />
                                            </td>
                                            <td className="py-2 px-1 min-w-[80px]">
                                                <EditableCell type="number" value={item.pns} onChange={(e) => handleTableChange('penyuluhAgama', index, 'pns', e.target.value)} className="text-right" />
                                            </td>
                                            <td className="py-2 px-1 min-w-[80px]">
                                                <EditableCell type="number" value={item.pppk} onChange={(e) => handleTableChange('penyuluhAgama', index, 'pppk', e.target.value)} className="text-right" />
                                            </td>
                                            <td className="py-2 px-1 min-w-[80px]">
                                                <EditableCell type="number" value={item.nonasn} onChange={(e) => handleTableChange('penyuluhAgama', index, 'nonasn', e.target.value)} className="text-right" />
                                            </td>
                                            <td className="py-2 pl-1 min-w-[120px]">
                                                <EditableCell type="number" readOnly={true} value={item.total} className="text-right" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AdminCard>

                    {/* 6. Penyuluh Non ASN Penerima Tunjangan */}
                    <AdminCard title="Penyuluh Non ASN Penerima Tunjangan">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Agama</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.penyuluhTunjangan.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('penyuluhTunjangan', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('penyuluhTunjangan', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 7. Sasaran Bimbingan Penyuluhan */}
                    <AdminCard title="Sasaran Bimbingan Penyuluhan">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Agama</th>
                                    <th className="py-2 text-right">Jumlah Sasaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.sasaranPenyuluhan.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('sasaranPenyuluhan', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('sasaranPenyuluhan', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 8. KUA Berdasarkan Tipologi */}
                    <AdminCard title="KUA Berdasarkan Tipologi">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Tipologi</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.kuaTipologi.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('kuaTipologi', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('kuaTipologi', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 9. Status KUA */}
                    <AdminCard title="Status KUA">
                        <h3 className="font-semibold text-gray-700">Status Tanah</h3>
                        <FormRow label="Belum Sertifikat">
                            <EditableCell type="number" value={currentData.kuaStatus.tanah.belumSertifikat} onChange={(e) => handleNestedObjectChange('kuaStatus', 'tanah', 'belumSertifikat', e.target.value)} />
                        </FormRow>
                        <FormRow label="Sudah Sertifikat">
                            <EditableCell type="number" value={currentData.kuaStatus.tanah.sudahSertifikat} onChange={(e) => handleNestedObjectChange('kuaStatus', 'tanah', 'sudahSertifikat', e.target.value)} />
                        </FormRow>
                        <FormRow label="Total Tanah (Otomatis)">
                            <EditableCell type="number" readOnly={true} value={currentData.kuaStatus.tanah.total} />
                        </FormRow>

                        <h3 className="font-semibold text-gray-700 mt-4">Kondisi Bangunan</h3>
                        <FormRow label="Baik">
                            <EditableCell type="number" value={currentData.kuaStatus.bangunan.baik} onChange={(e) => handleNestedObjectChange('kuaStatus', 'bangunan', 'baik', e.target.value)} />
                        </FormRow>
                        <FormRow label="Rusak Ringan">
                            <EditableCell type="number" value={currentData.kuaStatus.bangunan.rusakRingan} onChange={(e) => handleNestedObjectChange('kuaStatus', 'bangunan', 'rusakRingan', e.target.value)} />
                        </FormRow>
                        <FormRow label="Rusak Berat">
                            <EditableCell type="number" value={currentData.kuaStatus.bangunan.rusakBerat} onChange={(e) => handleNestedObjectChange('kuaStatus', 'bangunan', 'rusakBerat', e.target.value)} />
                        </FormRow>
                        <FormRow label="Total Bangunan (Otomatis)">
                            <EditableCell type="number" readOnly={true} value={currentData.kuaStatus.bangunan.total} />
                        </FormRow>
                    </AdminCard>

                    {/* 10. Revitalisasi KUA */}
                    <AdminCard title="Revitalisasi KUA">
                        <FormRow label="Rehab Ringan">
                            <EditableCell type="number" value={currentData.revitalisasiKua.rehabRingan} onChange={(e) => handleObjectChange('revitalisasiKua', 'rehabRingan', e.target.value)} />
                        </FormRow>
                        <FormRow label="Rehab Berat">
                            <EditableCell type="number" value={currentData.revitalisasiKua.rehabBerat} onChange={(e) => handleObjectChange('revitalisasiKua', 'rehabBerat', e.target.value)} />
                        </FormRow>
                        <FormRow label="Total (Otomatis)">
                            <EditableCell type="number" readOnly={true} value={currentData.revitalisasiKua.total} />
                        </FormRow>
                    </AdminCard>

                    {/* 11. Penghulu Berdasarkan Jabatan */}
                    <AdminCard title="Penghulu Berdasarkan Jabatan">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Jabatan</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.penghuluJabatan.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('penghuluJabatan', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('penghuluJabatan', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 12. Peristiwa Nikah Berdasarkan Tempat */}
                    <AdminCard title="Peristiwa Nikah (Tempat)">
                        <FormRow label="Di KUA">
                            <EditableCell type="number" value={currentData.peristiwaNikahTempat.kua} onChange={(e) => handleObjectChange('peristiwaNikahTempat', 'kua', e.target.value)} />
                        </FormRow>
                        <FormRow label="Di Luar KUA">
                            <EditableCell type="number" value={currentData.peristiwaNikahTempat.luar} onChange={(e) => handleObjectChange('peristiwaNikahTempat', 'luar', e.target.value)} />
                        </FormRow>
                        <FormRow label="Total (Otomatis)">
                            <EditableCell type="number" readOnly={true} value={currentData.peristiwaNikahTempat.total} />
                        </FormRow>
                    </AdminCard>

                    {/* 13. Peristiwa Nikah Bulanan */}
                    <AdminCard title="Peristiwa Nikah (Bulanan)">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Bulan</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.peristiwaNikahBulan.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.bulan} onChange={(e) => handleTableChange('peristiwaNikahBulan', index, 'bulan', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.total} onChange={(e) => handleTableChange('peristiwaNikahBulan', index, 'total', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 16. Tanah Wakaf Berdasarkan Status */}
                    <AdminCard title="Tanah Wakaf (Status)">
                        <FormRow label="Belum Sertifikat">
                            <EditableCell type="number" value={currentData.tanahWakafStatus.belum} onChange={(e) => handleObjectChange('tanahWakafStatus', 'belum', e.target.value)} />
                        </FormRow>
                        <FormRow label="Sudah Sertifikat">
                            <EditableCell type="number" value={currentData.tanahWakafStatus.sudah} onChange={(e) => handleObjectChange('tanahWakafStatus', 'sudah', e.target.value)} />
                        </FormRow>
                        <FormRow label="Total (Otomatis)">
                            <EditableCell type="number" readOnly={true} value={currentData.tanahWakafStatus.total} />
                        </FormRow>
                    </AdminCard>

                    {/* 17. Tanah Wakaf Berdasarkan Pemanfaatan */}
                    <AdminCard title="Tanah Wakaf (Pemanfaatan)">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Pemanfaatan</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.tanahWakafPemanfaatan.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('tanahWakafPemanfaatan', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('tanahWakafPemanfaatan', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 18. Tanah Wakaf Produktif */}
                    <AdminCard title="Tanah Wakaf Produktif">
                        <FormRow label="Total Tanah Wakaf Produktif">
                            <EditableCell type="number" value={currentData.tanahWakafProduktif} onChange={(e) => handleSingleValueChange('tanahWakafProduktif', e.target.value)} />
                        </FormRow>
                    </AdminCard>

                    {/* 20. Penghulu (Pembinaan) */}
                    <AdminCard title="Penghulu (Pembinaan)">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left text-sm font-medium text-gray-600">
                                    <th className="py-2">Jabatan</th>
                                    <th className="py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.penghuluPembinaan.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 pr-2">
                                            <EditableCell value={item.name} onChange={(e) => handleTableChange('penghuluPembinaan', index, 'name', e.target.value)} className="font-medium" />
                                        </td>
                                        <td className="py-2 pl-2">
                                            <EditableCell type="number" value={item.value} onChange={(e) => handleTableChange('penghuluPembinaan', index, 'value', e.target.value)} className="text-right" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminCard>

                    {/* 5. Data Rincian Penyuluh (JSON Editor) (Full Width) */}
                    <AdminCard title="Rincian Penyuluh (JSON Editor)" fullWidth={true}>
                        <p className="text-sm text-gray-600">
                            Data ini sangat kompleks. Gunakan editor JSON di bawah untuk mengubahnya.
                            Pastikan format JSON selalu valid sebelum menyimpan.
                        </p>
                        <textarea
                            className={`w-full h-96 p-2 text-black border rounded-md font-mono text-sm ${isPenyuluhJsonValid ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 ring-2 ring-red-300'}`}
                            defaultValue={JSON.stringify(currentData.penyuluhDetail, null, 2)}
                            onChange={(e) => handlePenyuluhDetailChange(e.target.value)}
                        />
                        {!isPenyuluhJsonValid && <p className="text-sm text-red-600">Format JSON tidak valid!</p>}
                    </AdminCard>

                    {/* 14. Data Buku Nikah (Full Width) */}
                    <AdminCard title="Buku Nikah yang Diedarkan" fullWidth={true}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <FormRow label="Total Buku Nikah (Otomatis)">
                                <EditableCell type="number" readOnly={true} value={currentData.bukuNikah.totalBukuNikah} />
                            </FormRow>
                            <FormRow label="Total Kartu Nikah (Otomatis)">
                                <EditableCell type="number" readOnly={true} value={currentData.bukuNikah.totalKartuNikah} />
                            </FormRow>
                        </div>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-300">
                                    <tr className="text-left text-sm font-medium text-gray-600">
                                        <th className="py-2 px-3">KUA</th>
                                        <th className="py-2 px-3 text-right">Buku</th>
                                        <th className="py-2 px-3 text-right">Kartu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentData.bukuNikah.rincian.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-3">
                                                <EditableCell value={item.kua} onChange={(e) => handleComplexTableChange('bukuNikah', 'rincian', index, 'kua', e.target.value)} className="font-medium" />
                                            </td>
                                            <td className="py-2 px-3">
                                                <EditableCell type="number" value={item.buku} onChange={(e) => handleComplexTableChange('bukuNikah', 'rincian', index, 'buku', e.target.value)} className="text-right" />
                                            </td>
                                            <td className="py-2 px-3">
                                                <EditableCell type="number" value={item.kartu} onChange={(e) => handleComplexTableChange('bukuNikah', 'rincian', index, 'kartu', e.target.value)} className="text-right" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AdminCard>

                    {/* 15. Data Peristiwa Rujuk (Full Width) */}
                    <AdminCard title="Peristiwa Rujuk" fullWidth={true}>
                        <FormRow label="Total Rujuk (Otomatis)">
                            <EditableCell type="number" readOnly={true} value={currentData.rujuk.totalRujuk} />
                        </FormRow>
                        <div className="overflow-x-auto border rounded-lg mt-4">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-300">
                                    <tr className="text-left text-sm font-medium text-gray-600">
                                        <th className="py-2 px-3">KUA</th>
                                        <th className="py-2 px-3 text-right">Jan</th>
                                        <th className="py-2 px-3 text-right">Feb</th>
                                        <th className="py-2 px-3 text-right">Mar</th>
                                        <th className="py-2 px-3 text-right">Apr</th>
                                        <th className="py-2 px-3 text-right">Mei</th>
                                        <th className="py-2 px-3 text-right">Jun</th>
                                        <th className="py-2 px-3 text-right">Jul</th>
                                        <th className="py-2 px-3 text-right">Agust</th>
                                        <th className="py-2 px-3 text-right">Sept</th>
                                        <th className="py-2 px-3 text-right">Okt</th>
                                        <th className="py-2 px-3 text-right">Nov</th>
                                        <th className="py-2 px-3 text-right">Des</th>
                                        <th className="py-2 px-3 text-right">Total (Otomatis)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentData.rujuk.rincian.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-3 min-w-[150px]">
                                                <EditableCell value={item.kua} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'kua', e.target.value)} className="font-medium" />
                                            </td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.jan} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'jan', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.feb} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'feb', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.mar} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'mar', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.apr} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'apr', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.mei} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'mei', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.jun} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'jun', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.jul} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'jul', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.agust} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'agust', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.sept} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'sept', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.okt} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'okt', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.nov} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'nov', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" value={item.des} onChange={(e) => handleComplexTableChange('rujuk', 'rincian', index, 'des', e.target.value)} className="text-right" /></td>
                                            <td className="py-2 px-3"><EditableCell type="number" readOnly={true} value={item.total} className="text-right" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AdminCard>

                    {/* Data Kosong (Placeholder) */}
                    <AdminCard title="Balai Nikah (Data Kosong)">
                        <p className="text-gray-500">Data ini masih kosong. Fungsionalitas "Tambah Baris" dapat ditambahkan di sini.</p>
                    </AdminCard>
                    <AdminCard title="Kasus Konflik (Data Kosong)">
                        <p className="text-gray-500">Data ini masih kosong. Fungsionalitas "Tambah Baris" dapat ditambahkan di sini.</p>
                    </AdminCard>
                    <AdminCard title="Kasus Konfrontatif (Data Kosong)">
                        <p className="text-gray-500">Data ini masih kosong. Fungsionalitas "Tambah Baris" dapat ditambahkan di sini.</p>
                    </AdminCard>
                    <AdminCard title="Dialog Antar Umat (Data Kosong)">
                        <p className="text-gray-500">Data ini masih kosong. Fungsionalitas "Tambah Baris" dapat ditambahkan di sini.</p>
                    </AdminCard>
                    <AdminCard title="Dialog Intern Umat (Data Kosong)">
                        <p className="text-gray-500">Data ini masih kosong. Fungsionalitas "Tambah Baris" dapat ditambahkan di sini.</p>
                    </AdminCard>
                    <AdminCard title="Qari & Hafidz (Data Kosong)">
                        <p className="text-gray-500">Data ini masih kosong. Fungsionalitas "Tambah Baris" dapat ditambahkan di sini.</p>
                    </AdminCard>
                </div>
            </div>
        </Fragment>
    );
};

export default DataKeagamaanPage;

