"use client";

import React, { useState, useEffect, Fragment } from 'react';
// DIHAPUS: Impor db eksternal yang menyebabkan error
import { db } from '../../../../utils/firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc,
  setLogLevel
} from 'firebase/firestore';

// --- Ikon ---
const SaveIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

// --- Komponen UI ---
const EditableCell = ({ value, onChange, type = 'text', readOnly = false, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full p-2 border rounded-md transition-all ${
      readOnly ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-transparent border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
    } ${className}`}
    step={type === 'number' ? '1' : undefined}
  />
);

// --- KOMPONEN REUSABLE UTAMA ---
/**
 * Komponen mandiri untuk memuat, menampilkan, mengedit, dan menyimpan
 * satu tabel data madrasah ke dokumen Firebase-nya sendiri.
 */
const MadrasahDataTable = ({ title, docPath, initialData, columns }) => {
  const [docRef, setDocRef] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Efek untuk memuat/menanam data
  useEffect(() => {
    setIsLoading(true);
    setLogLevel('Debug');
    
    const ref = doc(db, docPath); // Path unik untuk setiap tabel
    console.log(`Listening to doc: ${ref.path}`);
    setDocRef(ref);

    const unsubscribe = onSnapshot(ref, async (docSnap) => {
      let data;
      if (docSnap.exists() && docSnap.data().data && Array.isArray(docSnap.data().data)) {
        data = docSnap.data().data;
        console.log(`Data loaded from ${ref.path}`);
      } else {
        console.log(`No data found in ${ref.path}, seeding default data...`);
        try {
          // Gunakan initialData yang sudah diproses (lengkap 21 kecamatan)
          await setDoc(ref, { data: initialData });
          data = initialData;
          console.log(`Default data seeded to ${ref.path}`);
        } catch (error) {
          console.error(`Error seeding data to ${ref.path}:`, error);
        }
      }
      
      // Pastikan data yang dimuat tidak undefined
      if (data) {
        setCurrentData(data);
        setOriginalData(data);
      }
      setIsLoading(false);
      setHasChanged(false);
    }, (error) => {
      console.error(`Error listening to data from ${ref.path}:`, error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [docPath, initialData]); // initialData disertakan untuk seeding

  // Efek deteksi perubahan
  useEffect(() => {
    if (!currentData || !originalData) return;
    setHasChanged(JSON.stringify(currentData) !== JSON.stringify(originalData));
  }, [currentData, originalData]);

  // Handler untuk menyimpan perubahan
  const handleSaveChanges = async () => {
    if (!docRef || !hasChanged) return;
    try {
      await updateDoc(docRef, { data: currentData });
      setShowSuccess(true);
      setOriginalData(currentData); // Sinkronkan data asli
      setTimeout(() => setShowSuccess(false), 2000);
      console.log(`Changes saved to ${docRef.path}`);
    } catch (error) {
      console.error(`Error saving changes to ${docRef.path}:`, error);
    }
  };

  // Handler untuk mengubah input tabel
  const handleInputChange = (index, field, value) => {
    const newData = currentData.map((row, i) => {
      if (i !== index) return row;

      const updatedRow = { ...row };
      if (typeof updatedRow[field] === 'number') {
        updatedRow[field] = parseInt(value, 10) || 0;
      } else {
        updatedRow[field] = value;
      }
      
      // Hitung ulang total otomatis jika ada (untuk Diniyah)
      if (field === 'awaliyah' || field === 'wustha' || field === 'ulya') {
         updatedRow.total = (updatedRow.awaliyah || 0) + (updatedRow.wustha || 0) + (updatedRow.ulya || 0);
      }
      
      return updatedRow;
    });
    setCurrentData(newData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          {showSuccess && (
            <span className="text-green-600 font-medium transition-opacity duration-300">
              Tersimpan!
            </span>
          )}
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanged}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Simpan
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-black">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th 
                    key={col.key} 
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm">
                      <EditableCell
                        value={row[col.key]}
                        onChange={(e) => handleInputChange(index, col.key, e.target.value)}
                        type={typeof row[col.key] === 'number' ? 'number' : 'text'}
                        readOnly={col.key === 'kecamatan'} // Kecamatan tidak bisa diedit
                        className={col.align === 'right' ? 'text-right' : ''}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// --- HALAMAN UTAMA ---
const PendidikanMadrasahPage = () => {

  // --- 2. Data dari CSV ---
  // (Semua konstanta data Anda disalin di sini)
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

  // Data MIN
  const knownDataMIN = [
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
  const missingKecamatanMIN = kecamatanList.filter(k => !knownDataMIN.some(d => d.kecamatan === k)).map(k => ({ kecamatan: k, min: 0, guru: 0, siswa: 0, rombel: 0 }));
  const dataMIN = [...knownDataMIN, ...missingKecamatanMIN].sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan));

  // Data MIS
  const knownDataMIS = [
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
      { kecamatan: "Medan Labuhan", mis: 22, guru: 59, siswa: 1121, rombel: 41 }, 
      { kecamatan: "Medan Tembung", mis: 22, guru: 107, siswa: 1713, rombel: 62 },
      { kecamatan: "Medan Polonia", mis: 5, guru: 53, siswa: 1323, rombel: 39 },
      { kecamatan: "Medan Perjuangan", mis: 2, guru: 19, siswa: 358, rombel: 13 },
      { kecamatan: "Medan Petisah", mis: 1, guru: 6, siswa: 29, rombel: 3 },
      { kecamatan: "Medan Timur", mis: 2, guru: 22, siswa: 287, rombel: 11 },
      { kecamatan: "Medan Selayang", mis: 1, guru: 10, siswa: 219, rombel: 8 },
  ];
  const missingKecamatanMIS = kecamatanList.filter(k => !knownDataMIS.some(d => d.kecamatan === k)).map(k => ({ kecamatan: k, mis: 0, guru: 0, siswa: 0, rombel: 0 }));
  const dataMIS = [...knownDataMIS, ...missingKecamatanMIS].sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan));

  // Data MTsN
  const knownDataMTsN = [
      { kecamatan: "Medan Helvetia", mtsn: 1, guru: 69, siswa: 687, rombel: 22 },
      { kecamatan: "Medan Amplas", mtsn: 1, guru: 88, siswa: 1031, rombel: 33 },
      { kecamatan: "Medan Labuhan", mtsn: 1, guru: 28, siswa: 388, rombel: 13 },
      { kecamatan: "Medan Tembung", mtsn: 1, guru: 90, siswa: 1115, rombel: 35 },
  ];
  const missingKecamatanMTsN = kecamatanList.filter(k => !knownDataMTsN.some(d => d.kecamatan === k)).map(k => ({ kecamatan: k, mtsn: 0, guru: 0, siswa: 0, rombel: 0 }));
  const dataMTsN = [...knownDataMTsN, ...missingKecamatanMTsN].sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan));

  // Data MTsS
  const knownDataMTsS = [
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
  const missingKecamatanMTsS = kecamatanList.filter(k => !knownDataMTsS.some(d => d.kecamatan === k)).map(k => ({ kecamatan: k, mtss: 0, guru: 0, siswa: 0, rombel: 0 }));
  const dataMTsS = [...knownDataMTsS, ...missingKecamatanMTsS].sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan));

  // Data MAN
  const knownDataMAN = [
      { kecamatan: "Medan Amplas", man: 1, guru: 78, siswa: 1087, rombel: 32 },
      { kecamatan: "Medan Labuhan", man: 1, guru: 45, siswa: 971, rombel: 27 },
      { kecamatan: "Medan Tembung", man: 2, guru: 297, siswa: 4183, rombel: 117 },
  ];
  const missingKecamatanMAN = kecamatanList.filter(k => !knownDataMAN.some(d => d.kecamatan === k)).map(k => ({ kecamatan: k, man: 0, guru: 0, siswa: 0, rombel: 0 }));
  const dataMAN = [...knownDataMAN, ...missingKecamatanMAN].sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan));

  // Data MAS
  const knownDataMAS = [
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
  const missingKecamatanMAS = kecamatanList.filter(k => !knownDataMAS.some(d => d.kecamatan === k)).map(k => ({ kecamatan: k, mas: 0, guru: 0, siswa: 0, rombel: 0 }));
  const dataMAS = [...knownDataMAS, ...missingKecamatanMAS].sort((a, b) => kecamatanList.indexOf(a.kecamatan) - kecamatanList.indexOf(b.kecamatan));

  // Data Akreditasi (CSV Kosong - initialized as empty arrays)
  const dataAkreditasiRA = []; // Nanti bisa diisi
  const dataAkreditasiMIN = []; // Nanti bisa diisi
  const dataAkreditasiMIS = []; // Nanti bisa diisi

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
      { header: 'Total (Otomatis)', key: 'total', align: 'right' },
  ];
  // --- Akhir dari Data dan Kolom ---


  return (
    <Fragment>
      {/* Header Utama Halaman */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Pendidikan Madrasah
        </h1>
        <p className="text-gray-600">
          Halaman ini menampilkan data pendidikan madrasah di Kota Medan, termasuk jumlah RA, MIN, MIS, MTsN, MTsS
        </p>
      </div>

      {/* Konten Utama Halaman */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
          
          {/* Komponen Reusable dipanggil di sini */}
          <MadrasahDataTable
            title="Data Raudhatul Athfal (RA)"
            docPath="pendidikan/dataRA"
            initialData={dataRA}
            columns={raColumns}
          />
          
          <MadrasahDataTable
            title="Data Madrasah Ibtidaiyah Negeri (MIN)"
            docPath="pendidikan/dataMIN"
            initialData={dataMIN}
            columns={minColumns}
          />
          
          <MadrasahDataTable
            title="Data Madrasah Ibtidaiyah Swasta (MIS)"
            docPath="pendidikan/dataMIS"
            initialData={dataMIS}
            columns={misColumns}
          />
          
          <MadrasahDataTable
            title="Data Madrasah Tsanawiyah Negeri (MTsN)"
            docPath="pendidikan/dataMTsN"
            initialData={dataMTsN}
            columns={mtsnColumns}
          />
          
          <MadrasahDataTable
            title="Data Madrasah Tsanawiyah Swasta (MTsS)"
            docPath="pendidikan/dataMTsS"
            initialData={dataMTsS}
            columns={mtssColumns}
          />
          
          <MadrasahDataTable
            title="Data Madrasah Aliyah Negeri (MAN)"
            docPath="pendidikan/dataMAN"
            initialData={dataMAN}
            columns={manColumns}
          />
          
          <MadrasahDataTable
            title="Data Madrasah Aliyah Swasta (MAS)"
            docPath="pendidikan/dataMAS"
            initialData={dataMAS}
            columns={masColumns}
          />
          
          <MadrasahDataTable
            title="Data Diniyah Takmiliyah"
            docPath="pendidikan/dataDiniyah"
            initialData={dataDiniyah}
            columns={diniyahColumns}
          />
          
          {/* Card untuk data yang masih kosong
          <PlaceholderCard title="Akreditasi RA" />
          <PlaceholderCard title="Akreditasi MIN" />
          <PlaceholderCard title="Akreditasi MIS" /> */}

        </div>
      </div>
    </Fragment>
  );
};

export default PendidikanMadrasahPage;


