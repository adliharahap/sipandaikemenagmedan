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
    className={`w-full p-2 border rounded-md transition-all text-black ${
      readOnly ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-transparent border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
    } ${className}`}
    step={type === 'number' ? '1' : undefined}
  />
);

// --- Editor Komponen 1: Untuk Tabel Array Sederhana ---
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
          // Abaikan 'color' atau 'icon' saat seeding, simpan data mentah
          const dataToSeed = initialData.map(({color, ...rest}) => rest);
          await setDoc(ref, { data: dataToSeed });
          data = dataToSeed;
        } catch (error) {
          console.error(`Error seeding data to ${ref.path}:`, error);
        }
      }
      
      if (data) {
        // Tambahkan ID unik untuk key React
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
    const cleanCurrent = currentData.map(({ _id, ...rest }) => rest);
    const cleanOriginal = originalData.map(({ _id, ...rest }) => rest);
    setHasChanged(JSON.stringify(cleanCurrent) !== JSON.stringify(cleanOriginal));
  }, [currentData, originalData]);

  // Handler untuk menyimpan perubahan
  const handleSaveChanges = async () => {
    if (!docRef || !hasChanged) return;
    const dataToSave = currentData.map(({ _id, ...rest }) => rest);
    try {
      await updateDoc(docRef, { data: dataToSave });
      setShowSuccess(true);
      setOriginalData(currentData);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error(`Error saving changes to ${docRef.path}:`, error);
    }
  };

  // Handler untuk mengubah input tabel
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

  if (isLoading) {
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
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
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
                      readOnly={col.key === 'name'}
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


// --- Editor Komponen 2: Untuk Objek Key-Value Sederhana ---
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
  
  const formatLabel = (key) => {
    const spaced = key.replace(/([A-Z])/g, ' $1');
    // Ganti 'Di Bawah' menjadi '<' jika diinginkan, atau biarkan
    if (key === 'diBawahS1') return '< S1';
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
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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


// --- HALAMAN UTAMA ---
const KepegawaianPage = () => {

  // --- Data dari Teks Anda ---
  const dataSatuanKerja = [
    { name: "KUA", value: 21 },
    { name: "MAN", value: 4 },
    { name: "MTsN", value: 4 },
    { name: "MIN", value: 12 },
  ];
  const dataKomposisiPegawai = [
    { name: "PNS", value: 1252 },
    { name: "PPPK", value: 497 },
  ];
  const dataPNS_Golongan = [
    { name: "Gol. II", value: 11 },
    { name: "Gol. III", value: 570 },
    { name: "Gol. IV", value: 671 },
  ];
  const dataPPPK_Golongan = [
    { name: "Gol. V", value: 9 },
    { name: "Gol. VII", value: 14 },
    { name: "Gol. IX", value: 47 },
    { name: "Gol. X", value: 4 },
    { name: "Gol. XV", value: 423 }, 
  ];
  const dataUsia = [
    { name: "<31", pns: 45, pppk: 98 },
    { name: "31-40", pns: 238, pppk: 237 },
    { name: "41-50", pns: 332, pppk: 125 },
    { name: "51-60", pns: 637, pppk: 32 },
    { name: ">60", pns: 0, pppk: 0 },
  ];
  const dataAgama = [
    { name: "Islam", pns: 1105, pppk: 412 },
    { name: "Kristen", pns: 111, pppk: 66 },
    { name: "Katolik", pns: 29, pppk: 19 },
    { name: "Hindu", pns: 7, pppk: 0 },
    { name: "Buddha", pns: 13, pppk: 0 },
  ];
  const dataPNS_Pendidikan = [
    { name: "<S1", value: 749 },
    { name: "S1", value: 425 },
    { name: "S2", value: 77 },
    { name: "S3", value: 1 },
  ];
  const dataPPPK_Pendidikan = [
    { name: "<S1", value: 27 },
    { name: "S1", value: 451 },
    { name: "S2", value: 19 },
    { name: "S3", value: 0 },
  ];
  const dataFKUB = [
    { name: "FKUB", value: 1 },
    { name: "Sekber", value: 0 },
    { name: "Desa Sadar Kerukunan", value: 1 },
  ];
  const dataPTSP_Satker = [
    { name: "Kemenag Kota Medan", value: 1 },
    { name: "Madrasah", value: 19 },
    { name: "KUA", value: 1 },
  ];
  const dataPTSP_Layanan = [
    { name: "Izin Belajar S1-S3", value: 6 },
    { name: "Izin Belajar LN", value: 0 },
    { name: "Izin Magang", value: 3 },
    { name: "Izin Penelitian (1)", value: 15 },
    { name: "Izin Penelitian (2)", value: 32 },
    { name: "Legalisir Surat Nikah", value: 10 },
    { name: "Permohonan Rohaniawan", value: 0 },
    { name: "Konsultasi BP4", value: 1 },
    { name: "Jadwal Sholat", value: 1 },
    { name: "Sertifikasi Arah Kiblat", value: 0 },
    { name: "SK Majelis Taklim", value: 0 },
  ];
  const dataPensiun_Golongan = [
    { name: "Gol. III", value: 21 },
    { name: "Gol. IV", value: 55 },
  ]; 
  const dataPensiun_Pendidikan = [
    { name: "<S1", value: 35 },
    { name: "S1", value: 21 },
    { name: "S2", value: 5 },
    { name: "S3", value: 3 },
  ];
  const dataPensiun_Agama = [
    { name: "Islam", value: 59 },
    { name: "Kristen", value: 10 },
    { name: "Katolik", value: 2 },
    { name: "Hindu", value: 1 },
    { name: "Buddha", value: 1 },
  ];
  const dataNaikPangkat_Golongan = [
    { name: "Gol. II", value: 44 },
    { name: "Gol. III", value: 113 },
    { name: "Gol. IV", value: 31 },
  ]; 
  const dataNaikPangkat_Pendidikan = [
    { name: "<S1", value: 34 },
    { name: "S1", value: 82 },
    { name: "S2", value: 28 },
  ]; 
  const dataNaikPangkat_Agama = [
    { name: "Islam", value: 124 },
    { name: "Kristen", value: 16 },
    { name: "Katolik", value: 3 },
    { name: "Hindu", value: 1 },
  ]; 
  const dataTugasBelajar = { total: 2, s2: 2 };
  // Mengganti '<S1' menjadi 'diBawahS1' agar aman sebagai key
  const dataNonASN = { total: 6, diBawahS1: 3, s1: 3 };

  
  // --- Definisi Kolom ---
  const satkerColumns = [ { header: 'Satuan Kerja', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const komposisiColumns = [ { header: 'Status', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const golonganPNSColumns = [ { header: 'Golongan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const golonganPPPKColumns = [ { header: 'Golongan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const usiaColumns = [ { header: 'Rentang Usia', key: 'name' }, { header: 'PNS', key: 'pns', align: 'right' }, { header: 'PPPK', key: 'pppk', align: 'right' }, ];
  const agamaColumns = [ { header: 'Agama', key: 'name' }, { header: 'PNS', key: 'pns', align: 'right' }, { header: 'PPPK', key: 'pppk', align: 'right' }, ];
  const pendidikanPNSColumns = [ { header: 'Pendidikan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const pendidikanPPPKColumns = [ { header: 'Pendidikan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const fkubColumns = [ { header: 'Kategori', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const ptspSatkerColumns = [ { header: 'Satuan Kerja', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const ptspLayananColumns = [ { header: 'Jenis Layanan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const pensiunGolonganColumns = [ { header: 'Golongan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const pensiunPendidikanColumns = [ { header: 'Pendidikan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const pensiunAgamaColumns = [ { header: 'Agama', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const naikPangkatGolonganColumns = [ { header: 'Golongan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const naikPangkatPendidikanColumns = [ { header: 'Pendidikan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];
  const naikPangkatAgamaColumns = [ { header: 'Agama', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }, ];


  return (
    <Fragment>
      {/* Header Utama Halaman */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Kepegawaian (ASN & Non-ASN)
        </h1>
        <p className="text-gray-600">
          Kelola data kepegawaian untuk PNS, PPPK, dan Non-ASN.
        </p>
      </div>

      {/* Konten Utama Halaman */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
          
          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data Komposisi</h2>
          <ArrayDataTableEditor
            title="Komposisi Pegawai (PNS & PPPK)"
            docPath="kepegawaian/dataKomposisiPegawai"
            initialData={dataKomposisiPegawai}
            columns={komposisiColumns}
          />
          <ArrayDataTableEditor
            title="Satuan Kerja"
            docPath="kepegawaian/dataSatuanKerja"
            initialData={dataSatuanKerja}
            columns={satkerColumns}
          />
          
          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data Demografi</h2>
          <ArrayDataTableEditor
            title="Demografi Usia (PNS & PPPK)"
            docPath="kepegawaian/dataUsia"
            initialData={dataUsia}
            columns={usiaColumns}
          />
          <ArrayDataTableEditor
            title="Demografi Agama (PNS & PPPK)"
            docPath="kepegawaian/dataAgama"
            initialData={dataAgama}
            columns={agamaColumns}
          />
          
          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data PNS</h2>
          <ArrayDataTableEditor
            title="PNS Berdasarkan Golongan"
            docPath="kepegawaian/dataPNS_Golongan"
            initialData={dataPNS_Golongan}
            columns={golonganPNSColumns}
          />
          <ArrayDataTableEditor
            title="PNS Berdasarkan Pendidikan"
            docPath="kepegawaian/dataPNS_Pendidikan"
            initialData={dataPNS_Pendidikan}
            columns={pendidikanPNSColumns}
          />

          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data PPPK</h2>
          <ArrayDataTableEditor
            title="PPPK Berdasarkan Golongan"
            docPath="kepegawaian/dataPPPK_Golongan"
            initialData={dataPPPK_Golongan}
            columns={golonganPPPKColumns}
          />
          <ArrayDataTableEditor
            title="PPPK Berdasarkan Pendidikan"
            docPath="kepegawaian/dataPPPK_Pendidikan"
            initialData={dataPPPK_Pendidikan}
            columns={pendidikanPPPKColumns}
          />
          
          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data Pensiun (Tahun Ini)</h2>
          <ArrayDataTableEditor
            title="Pensiun Berdasarkan Golongan"
            docPath="kepegawaian/dataPensiun_Golongan"
            initialData={dataPensiun_Golongan}
            columns={pensiunGolonganColumns}
          />
          <ArrayDataTableEditor
            title="Pensiun Berdasarkan Pendidikan"
            docPath="kepegawaian/dataPensiun_Pendidikan"
            initialData={dataPensiun_Pendidikan}
            columns={pensiunPendidikanColumns}
          />
          <ArrayDataTableEditor
            title="Pensiun Berdasarkan Agama"
            docPath="kepegawaian/dataPensiun_Agama"
            initialData={dataPensiun_Agama}
            columns={pensiunAgamaColumns}
          />
          
          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data Naik Pangkat (Tahun Ini)</h2>
          <ArrayDataTableEditor
            title="Naik Pangkat Berdasarkan Golongan"
            docPath="kepegawaian/dataNaikPangkat_Golongan"
            initialData={dataNaikPangkat_Golongan}
            columns={naikPangkatGolonganColumns}
          />
          <ArrayDataTableEditor
            title="Naik Pangkat Berdasarkan Pendidikan"
            docPath="kepegawaian/dataNaikPangkat_Pendidikan"
            initialData={dataNaikPangkat_Pendidikan}
            columns={naikPangkatPendidikanColumns}
          />
          <ArrayDataTableEditor
            title="Naik Pangkat Berdasarkan Agama"
            docPath="kepegawaian/dataNaikPangkat_Agama"
            initialData={dataNaikPangkat_Agama}
            columns={naikPangkatAgamaColumns}
          />
          
          <h2 className="text-2xl font-semibold text-gray-700 -mb-2 mt-4">Data Layanan & Lain-lain</h2>
          <ArrayDataTableEditor
            title="PTSP Berdasarkan Satker"
            docPath="kepegawaian/dataPTSP_Satker"
            initialData={dataPTSP_Satker}
            columns={ptspSatkerColumns}
          />
          <ArrayDataTableEditor
            title="PTSP Berdasarkan Jenis Layanan"
            docPath="kepegawaian/dataPTSP_Layanan"
            initialData={dataPTSP_Layanan}
            columns={ptspLayananColumns}
          />
          <ArrayDataTableEditor
            title="Data Kerukunan (FKUB)"
            docPath="kepegawaian/dataFKUB"
            initialData={dataFKUB}
            columns={fkubColumns}
          />

          <SimpleObjectEditor
            title="Data Tugas Belajar"
            docPath="kepegawaian/dataTugasBelajar"
            initialData={dataTugasBelajar}
          />
          <SimpleObjectEditor
            title="Data Non-ASN"
            docPath="kepegawaian/dataNonASN"
            initialData={dataNonASN}
          />

        </div>
      </div>
    </Fragment>
  );
};

export default KepegawaianPage;
