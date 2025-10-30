"use client";

import React, { useState, useEffect, Fragment } from 'react';
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
    className={`w-full p-2 border rounded-md text-black transition-all ${
      readOnly ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-transparent border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
    } ${className}`}
    step={type === 'number' ? '1' : undefined}
  />
);

// --- Editor Komponen 1: Untuk Tabel Array Sederhana (cth: dataKuota) ---
// --- PERBAIKAN BESAR: Seluruh komponen ini dikembalikan ke versi yang benar ---
const ArrayDataTableEditor = ({ title, docPath, initialData, columns }) => {
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
    
    const ref = doc(db, docPath); 
    setDocRef(ref);

    const unsubscribe = onSnapshot(ref, async (docSnap) => {
      let data;
      if (docSnap.exists() && docSnap.data().data && Array.isArray(docSnap.data().data)) {
        data = docSnap.data().data;
      } else {
        console.log(`No data found in ${ref.path}, seeding default data...`);
        try {
          await setDoc(ref, { data: initialData });
          data = initialData;
        } catch (error) {
          console.error(`Error seeding data to ${ref.path}:`, error);
        }
      }
      
      if (data) {
        // Tambahkan ID unik untuk key React jika belum ada
        const dataWithIds = data.map(row => ({ ...row, _id: crypto.randomUUID() }));
        setCurrentData(dataWithIds);
        setOriginalData(dataWithIds);
      }
      setIsLoading(false);
      setHasChanged(false);
    }, (error) => {
      console.error(`Error listening to data from ${ref.path}:`, error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [docPath, initialData]);

  // Efek deteksi perubahan
  useEffect(() => {
    if (!currentData || !originalData) return;
    // Bandingkan tanpa _id
    const cleanCurrent = currentData.map(({ _id, ...rest }) => rest);
    const cleanOriginal = originalData.map(({ _id, ...rest }) => rest);
    setHasChanged(JSON.stringify(cleanCurrent) !== JSON.stringify(cleanOriginal));
  }, [currentData, originalData]);

  // Handler untuk menyimpan perubahan
  const handleSaveChanges = async () => {
    if (!docRef || !hasChanged) return;
    // Simpan data bersih tanpa _id
    const dataToSave = currentData.map(({ _id, ...rest }) => rest);
    try {
      await updateDoc(docRef, { data: dataToSave });
      setShowSuccess(true);
      setOriginalData(currentData); // Sinkronkan data asli dengan data saat ini
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error(`Error saving changes to ${docRef.path}:`, error);
    }
  };

  // Handler untuk mengubah input tabel (INI YANG BENAR)
  const handleInputChange = (id, field, value) => {
    const newData = currentData.map((row) => {
      if (row._id !== id) return row;
      const updatedRow = { ...row };
      if (typeof updatedRow[field] === 'number') {
        updatedRow[field] = parseInt(value, 10) || 0;
      } else {
        updatedRow[field] = value;
      }
      return updatedRow;
    });
    setCurrentData(newData);
  };

  if (isLoading) { // Disederhanakan
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center text-gray-500">
        Loading {title}...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          {showSuccess && <span className="text-green-600 font-medium">Tersimpan!</span>}
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanged}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-400 text-sm"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Simpan
          </button>
        </div>
      </div>
      
      {/* Tampilan tabel yang benar */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-black">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm">
                    <EditableCell
                      value={row[col.key]}
                      onChange={(e) => handleInputChange(row._id, col.key, e.target.value)}
                      type={typeof row[col.key] === 'number' ? 'number' : 'text'}
                      readOnly={col.key === 'name'} // Hanya 'name' yang read-only
                      className={col.align === 'right' ? 'text-right' : ''}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// --- AKHIR PERBAIKAN ArrayDataTableEditor ---


// --- PENAMBAHAN: Komponen SimpleObjectEditor yang hilang ---
const SimpleObjectEditor = ({ title, docPath, initialData }) => {
  const [docRef, setDocRef] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setLogLevel('Debug');
    
    const ref = doc(db, docPath);
    setDocRef(ref);

    const unsubscribe = onSnapshot(ref, async (docSnap) => {
      let data;
      if (docSnap.exists() && docSnap.data()) {
        data = docSnap.data();
      } else {
        console.log(`No data found in ${ref.path}, seeding default data...`);
        try {
          await setDoc(ref, initialData);
          data = initialData;
        } catch (error) {
          console.error(`Error seeding data to ${ref.path}:`, error);
        }
      }
      
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
  }, [docPath, initialData]);

  useEffect(() => {
    if (!currentData || !originalData) return;
    setHasChanged(JSON.stringify(currentData) !== JSON.stringify(originalData));
  }, [currentData, originalData]);

  const handleSaveChanges = async () => {
    if (!docRef || !hasChanged) return;
    try {
      await updateDoc(docRef, currentData);
      setShowSuccess(true);
      setOriginalData(currentData);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error(`Error saving changes to ${docRef.path}:`, error);
    }
  };

  const handleInputChange = (key, value) => {
    setCurrentData(prev => ({
      ...prev,
      [key]: parseInt(value, 10) || 0
    }));
  };
  
  // Fungsi untuk mengubah key (misal "totalPendaftaran") menjadi label ("Total Pendaftaran")
  const formatLabel = (key) => {
    const spaced = key.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  if (isLoading || !currentData) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center text-gray-500">
        Loading {title}...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          {showSuccess && <span className="text-green-600 font-medium">Tersimpan!</span>}
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanged}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-400 text-sm"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Simpan
          </button>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(currentData).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{formatLabel(key)}</label>
            <EditableCell
              value={currentData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              type="number"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
// --- AKHIR PENAMBAHAN SimpleObjectEditor ---


// --- HALAMAN UTAMA ---
const SertifikasiHalalPage = () => {
// ... (sisa kode halaman utama tetap sama) ...
  // --- Data dari Teks Anda ---
  const dataTotal = {
    totalPendaftaran: 123,
    totalPenerbitan: 76,
  };

  const dataPendaftaranJenisProduk = [
    { name: "Makanan & Minuman", value: 117 },
    { name: "RPU/RPH", value: 1 },
    { name: "Jasa Logistik", value: 2 },
    { name: "Lain-lain", value: 3 },
  ];
  const dataPendaftaranSkalaUsaha = [
    { name: "Mikro", value: 112 },
    { name: "Kecil", value: 9 },
    { name: "Menengah", value: 0 },
    { name: "Besar", value: 2 },
  ];
  const dataPenerbitanJenisProduk = [
    { name: "Makanan & Minuman", value: 62 },
    { name: "RPU/RPH", value: 6 },
    { name: "Jasa Logistik", value: 4 },
    { name: "Lain-lain", value: 4 },
  ];
  const dataPenerbitanSkalaUsaha = [
    { name: "Mikro", value: 63 },
    { name: "Kecil", value: 11 },
    { name: "Menengah", value: 1 },
    { name: "Besar", value: 1 },
  ];

  // Kolom untuk tabel dinamis
  const jenisProdukColumns = [ { header: 'Jenis Produk', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const skalaUsahaColumns = [ { header: 'Skala Usaha', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];

  return (
    <Fragment>
      {/* Header Utama Halaman */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Sertifikasi Halal
        </h1>
        <p className="text-gray-600">
          Data sertifikasi halal meliputi total pendaftaran, penerbitan, dan demografi produk.
        </p>
      </div>

      {/* Konten Utama Halaman */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
          
          <SimpleObjectEditor
            title="Total Pendaftaran & Penerbitan"
            docPath="halal/total"
            initialData={dataTotal}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArrayDataTableEditor
              title="Pendaftaran (Jenis Produk)"
              docPath="halal/pendaftaranJenisProduk"
              initialData={dataPendaftaranJenisProduk}
              columns={jenisProdukColumns}
            />
            
            <ArrayDataTableEditor
              title="Pendaftaran (Skala Usaha)"
              docPath="halal/pendaftaranSkalaUsaha"
              initialData={dataPendaftaranSkalaUsaha}
              columns={skalaUsahaColumns}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArrayDataTableEditor
              title="Penerbitan (Jenis Produk)"
              docPath="halal/penerbitanJenisProduk"
              initialData={dataPenerbitanJenisProduk}
              columns={jenisProdukColumns}
            />
            
            <ArrayDataTableEditor
              title="Penerbitan (Skala Usaha)"
              docPath="halal/penerbitanSkalaUsaha"
              initialData={dataPenerbitanSkalaUsaha}
              columns={skalaUsahaColumns}
            />
          </div>

        </div>
      </div>
    </Fragment>
  );
};

export default SertifikasiHalalPage;

