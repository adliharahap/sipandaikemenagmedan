"use client";

import React, { useState, useEffect, Fragment } from 'react';
// DIKEMBALIKAN: Impor db dari file utils Anda
import { db } from '../../../../utils/firebase'; 
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc,
  setLogLevel // DIJAGA: Untuk debugging
} from 'firebase/firestore';

// --- Ikon Inline ---
const PlusCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const Trash2 = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);


const dataKependudukanAwal = [
  { kode: "12.71.01", kecamatan: "Medan Kota", laki_laki: 42100, perempuan: 41500, total: 83600, kelurahan: 12, luas_wilayah: 5.27, kepadatan: 83600 / 5.27 },
  { kode: "12.71.02", kecamatan: "Medan Sunggal", laki_laki: 105000, perempuan: 103000, total: 208000, kelurahan: 6, luas_wilayah: 15.44, kepadatan: 208000 / 15.44 },
  { kode: "12.71.03", kecamatan: "Medan Helvetia", laki_laki: 75000, perempuan: 74000, total: 149000, kelurahan: 7, luas_wilayah: 13.16, kepadatan: 149000 / 13.16 },
  { kode: "12.71.04", kecamatan: "Medan Denai", laki_laki: 80000, perempuan: 79000, total: 159000, kelurahan: 6, luas_wilayah: 9.05, kepadatan: 159000 / 9.05 },
  { kode: "12.71.05", kecamatan: "Medan Barat", laki_laki: 48000, perempuan: 47000, total: 95000, kelurahan: 6, luas_wilayah: 5.33, kepadatan: 95000 / 5.33 },
  { kode: "12.71.06", kecamatan: "Medan Deli", laki_laki: 90000, perempuan: 88000, total: 178000, kelurahan: 6, luas_wilayah: 20.84, kepadatan: 178000 / 20.84 },
  { kode: "12.71.07", kecamatan: "Medan Tuntungan", laki_laki: 46000, perempuan: 45000, total: 91000, kelurahan: 9, luas_wilayah: 20.68, kepadatan: 91000 / 20.68 },
  { kode: "12.71.08", kecamatan: "Medan Belawan", laki_laki: 55000, perempuan: 54000, total: 109000, kelurahan: 6, luas_wilayah: 21.82, kepadatan: 109000 / 21.82 },
  { kode: "12.71.09", kecamatan: "Medan Amplas", laki_laki: 70000, perempuan: 69000, total: 139000, kelurahan: 7, luas_wilayah: 11.19, kepadatan: 139000 / 11.19 },
  { kode: "12.71.10", kecamatan: "Medan Area", laki_laki: 60000, perempuan: 59000, total: 119000, kelurahan: 12, luas_wilayah: 5.52, kepadatan: 119000 / 5.52 },
  { kode: "12.71.11", kecamatan: "Medan Johor", laki_laki: 78000, perempuan: 77000, total: 155000, kelurahan: 6, luas_wilayah: 14.58, kepadatan: 155000 / 14.58 },
  { kode: "12.71.12", kecamatan: "Medan Marelan", laki_laki: 85000, perempuan: 83000, total: 168000, kelurahan: 5, luas_wilayah: 23.82, kepadatan: 168000 / 23.82 },
  { kode: "12.71.13", kecamatan: "Medan Labuhan", laki_laki: 68000, perempuan: 67000, total: 135000, kelurahan: 6, luas_wilayah: 36.67, kepadatan: 135000 / 36.67 },
  { kode: "12.71.14", kecamatan: "Medan Tembung", laki_laki: 72000, perempuan: 71000, total: 143000, kelurahan: 7, luas_wilayah: 7.99, kepadatan: 143000 / 7.99 },
  { kode: "12.71.15", kecamatan: "Medan Maimun", laki_laki: 25000, perempuan: 24000, total: 49000, kelurahan: 6, luas_wilayah: 2.98, kepadatan: 49000 / 2.98 },
  { kode: "12.71.16", kecamatan: "Medan Polonia", laki_laki: 30000, perempuan: 29000, total: 59000, kelurahan: 5, luas_wilayah: 9.01, kepadatan: 59000 / 9.01 },
  { kode: "12.71.17", kecamatan: "Medan Baru", laki_laki: 22000, perempuan: 21000, total: 43000, kelurahan: 6, luas_wilayah: 5.84, kepadatan: 43000 / 5.84 },
  { kode: "12.71.18", kecamatan: "Medan Perjuangan", laki_laki: 50000, perempuan: 49000, total: 99000, kelurahan: 9, luas_wilayah: 4.09, kepadatan: 99000 / 4.09 },
  { kode: "12.71.19", kecamatan: "Medan Petisah", laki_laki: 35000, perempuan: 34000, total: 69000, kelurahan: 7, luas_wilayah: 6.82, kepadatan: 69000 / 6.82 },
  { kode: "12.71.20", kecamatan: "Medan Timur", laki_laki: 58000, perempuan: 57000, total: 115000, kelurahan: 11, luas_wilayah: 7.76, kepadatan: 115000 / 7.76 },
  { kode: "12.71.21", kecamatan: "Medan Selayang", laki_laki: 51000, perempuan: 50000, total: 101000, kelurahan: 6, luas_wilayah: 12.81, kepadatan: 101000 / 12.81 },
];

// --- Fungsi Bantu ---

const processDataFromFirebase = (dataArray) => {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map((item) => {
    const total = (item.laki_laki || 0) + (item.perempuan || 0);
    const kepadatan = (item.luas_wilayah || 0) > 0 ? total / item.luas_wilayah : 0;
    return {
      ...item,
      id: crypto.randomUUID(), // unik untuk React
      total,
      kepadatan,
    };
  });
};

// Fungsi ini akan menghapus 'id', 'total', dan 'kepadatan'
const prepareDataForFirebase = (dataArray) => dataArray.map(({ id, total, kepadatan, ...rest }) => rest);

// --- Komponen UI ---

const EditableCell = ({ value, onChange, type = 'text', readOnly = false }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full p-2 border rounded-md transition-all ${
      readOnly ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-transparent border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
    }`}
    step={type === 'number' ? '0.01' : undefined}
  />
);

const DashboardKependudukan = () => {
  // DIHAPUS: State untuk db
  
  // State aplikasi
  const [docRef, setDocRef] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, idToDelete: null });

  // DIHAPUS: Efek Inisialisasi Firebase
  
  // 2. Efek Listener Data (setelah auth siap)
  useEffect(() => {
    // DIKEMBALIKAN: Logika listener data asli, tanpa cek auth
    setIsLoading(true);
    setLogLevel('Debug'); // Opsional: untuk logging lebih detail di console
    
    // PERBAIKAN UTAMA: Menggunakan 'db' yang diimpor
    // dan path 'public/kependudukan' untuk DOKUMEN, bukan koleksi.
    // Ini memperbaiki masalah duplikasi.
    const ref = doc(db, "public", "kependudukan");
    
    console.log("Listening to doc:", ref.path);
    setDocRef(ref);

    const unsubscribe = onSnapshot(ref, async (docSnap) => {
      let data = [];

      if (docSnap.exists() && Array.isArray(docSnap.data().data) && docSnap.data().data.length > 0) {
        data = docSnap.data().data;
        console.log("Data loaded from Firebase.");
      } else {
        console.log("No data found or data is empty, seeding default data...");
        // --- PERBAIKAN ---
        // Siapkan data (buang total & kepadatan) SEBELUM seeding
        // agar data di Firebase konsisten.
        const dataToSeed = prepareDataForFirebase(dataKependudukanAwal);
        try {
          // Simpan data yang sudah 'bersih' ke Firebase
          await setDoc(ref, { data: dataToSeed });
          // Tetap gunakan dataKependudukanAwal untuk diproses secara lokal,
          // karena processDataFromFirebase akan menghitung ulang total/kepadatan
          data = dataKependudukanAwal; 
          console.log("Default data seeded with prepared data.");
        } catch (error) {
          console.error("Error seeding data:", error);
        }
        // --- AKHIR PERBAIKAN ---
      }

      const processed = processDataFromFirebase(data);
      setCurrentData(processed);
      setOriginalData(processed);
      setIsLoading(false);
      setHasChanged(false);
    }, (error) => {
      console.error("Error listening to data:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []); // DIKEMBALIKAN: Hanya jalan sekali saat mount

  // 3. Efek Deteksi Perubahan Data
  useEffect(() => {
    const cleanCurrent = prepareDataForFirebase(currentData);
    const cleanOriginal = prepareDataForFirebase(originalData);
    setHasChanged(JSON.stringify(cleanCurrent) !== JSON.stringify(cleanOriginal));
  }, [currentData, originalData]);

  // --- Handler Aksi ---
  const handleInputChange = (id, field, value) => {
    const newData = currentData.map(row => {
      if (row.id !== id) return row;

      const updated = { ...row };
      if (['laki_laki','perempuan','kelurahan'].includes(field)) updated[field] = parseInt(value,10) || "";
      else if (field === 'luas_wilayah') updated[field] = parseFloat(value) || "";
      else updated[field] = value;

      updated.total = (updated.laki_laki || 0) + (updated.perempuan || 0);
      updated.kepadatan = (updated.luas_wilayah > 0) ? updated.total / updated.luas_wilayah : 0;
      return updated;
    });
    setCurrentData(newData);
  };

  const handleSaveChanges = async () => {
    if (!docRef || !hasChanged) return;
    const dataToSave = prepareDataForFirebase(currentData);
    try {
      await updateDoc(docRef, { data: dataToSave });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      console.log("Changes saved.");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleAddNewRow = () => {
    setCurrentData([...currentData, { id: crypto.randomUUID(), kode: "", kecamatan: "", laki_laki: 0, perempuan: 0, kelurahan: 0, luas_wilayah: 0, total: 0, kepadatan: 0 }]);
  };
  
  const handleDeleteRow = (id) => setDeleteModal({ isOpen:true, idToDelete:id });
  
  const confirmDelete = () => {
    if(deleteModal.idToDelete) setCurrentData(currentData.filter(row => row.id !== deleteModal.idToDelete));
    setDeleteModal({isOpen:false, idToDelete:null});
  };
  
  const cancelDelete = () => setDeleteModal({isOpen:false, idToDelete:null});

  // Tampilkan loading jika auth belum siap ATAU data belum dimuat
  if(isLoading) { // DIUBAH: Hanya cek isLoading
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-700">Loading Data Kependudukan...</div>
      </div>
    );
  }

  return (
    <Fragment>
      {/* Modal Konfirmasi Hapus */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity" aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
            <p className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus baris data ini? Perubahan ini baru akan permanen setelah Anda menekan "Simpan Perubahan".
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konten Utama Halaman */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard: Data Kependudukan
        </h1>

        {/* Kontainer tabel agar responsif */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-black">
            <thead className="bg-gray-100">
              <tr>
                {/* TAMBAHAN: Kolom "No." */}
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  No.
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laki-laki
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perempuan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelurahan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Luas (km²)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kepadatan (jiwa/km²)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((row, index) => ( // TAMBAHAN: 'index'
                <tr key={row.id} className="hover:bg-gray-50">
                  {/* TAMBAHAN: Sel untuk "No." */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Hapus baris"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm" style={{minWidth: '120px'}}>
                    <EditableCell
                      value={row.kode}
                      onChange={(e) => handleInputChange(row.id, 'kode', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm" style={{minWidth: '180px'}}>
                    <EditableCell
                      value={row.kecamatan}
                      onChange={(e) => handleInputChange(row.id, 'kecamatan', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm" style={{minWidth: '120px'}}>
                    <EditableCell
                      type="number"
                      value={row.laki_laki}
                      onChange={(e) => handleInputChange(row.id, 'laki_laki', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm" style={{minWidth: '120px'}}>
                    <EditableCell
                      type="number"
                      value={row.perempuan}
                      onChange={(e) => handleInputChange(row.id, 'perempuan', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 bg-gray-50" style={{minWidth: '120px'}}>
                    {row.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm" style={{minWidth: '100px'}}>
                    <EditableCell
                      type="number"
                      value={row.kelurahan}
                      onChange={(e) => handleInputChange(row.id, 'kelurahan', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm" style={{minWidth: '100px'}}>
                    <EditableCell
                      type="number"
                      value={row.luas_wilayah}
                      onChange={(e) => handleInputChange(row.id, 'luas_wilayah', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 bg-gray-50" style={{minWidth: '150px'}}>
                    {row.kepadatan.toFixed(2).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tombol Tambah, Simpan, dan Pesan Sukses */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handleAddNewRow}
            className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Baris
          </button>
          
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanged || !docRef} // Juga nonaktifkan jika docRef belum siap
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Simpan Perubahan
          </button>
          
          {showSuccess && (
            <span className="text-green-600 font-medium transition-opacity duration-300">
              Perubahan berhasil disimpan!
            </span>
          )}
        </div>

      </div>
    </Fragment>
  );
};

export default DashboardKependudukan;

