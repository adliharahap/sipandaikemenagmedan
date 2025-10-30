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

const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- Komponen UI ---
const EditableCell = ({ value, onChange, type = 'text', readOnly = false, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full p-2 border rounded-md transition-all text-black ${readOnly ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-transparent border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
      } ${className}`}
    step={type === 'number' ? '1' : undefined}
  />
);

// --- Editor Komponen 1: Untuk Tabel Array Sederhana (cth: dataKuota) ---
const ArrayDataTableEditor = ({ title, docPath, initialData, columns, onAddNewRow }) => {
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
      setOriginalData(currentData);
      setTimeout(() => setShowSuccess(false), 2000);
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
      return updatedRow;
    });
    setCurrentData(newData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          {showSuccess && <span className="text-green-600 font-medium">Tersimpan!</span>}
          {onAddNewRow && (
            <button
              onClick={() => onAddNewRow(currentData, setCurrentData)}
              className="flex items-center px-3 py-1.5 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Tambah Baris
            </button>
          )}
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

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading data...</div>
      ) : (
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
              {currentData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm">
                      <EditableCell
                        value={row[col.key]}
                        onChange={(e) => handleInputChange(index, col.key, e.target.value)}
                        type={typeof row[col.key] === 'number' ? 'number' : 'text'}
                        readOnly={col.key === 'tahun' || col.key === 'name'}
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


// --- Editor Komponen 2: Untuk Objek Data Haji yang Kompleks (cth: dataTunggu) ---
const ComplexHajiDataEditor = ({ title, docPath, initialData, columns }) => {
  const [docRef, setDocRef] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
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

  // Efek deteksi perubahan
  useEffect(() => {
    if (!currentData || !originalData) return;
    setHasChanged(JSON.stringify(currentData) !== JSON.stringify(originalData));
  }, [currentData, originalData]);

  // Handler untuk menyimpan perubahan
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

  // --- Handlers untuk data kompleks ---
  const handleSimpleChange = (field, value) => {
    setCurrentData(prev => ({
      ...prev,
      [field]: parseInt(value, 10) || 0
    }));
  };

  const handleExperienceChange = (field, value) => {
    setCurrentData(prev => ({
      ...prev,
      pengalaman: {
        ...prev.pengalaman,
        [field]: parseInt(value, 10) || 0
      }
    }));
  };

  const handleTableChange = (tableKey, index, field, value) => {
    setCurrentData(prev => ({
      ...prev,
      [tableKey]: prev[tableKey].map((row, i) => {
        if (i !== index) return row;
        const updatedRow = { ...row };
        if (field === 'value') {
          updatedRow[field] = parseInt(value, 10) || 0;
        } else {
          updatedRow[field] = value;
        }
        return updatedRow;
      })
    }));
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

      <div className="p-4 space-y-6">
        {/* Bagian Total, LK, PR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <EditableCell value={currentData.total} onChange={(e) => handleSimpleChange('total', e.target.value)} type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Laki-laki (LK)</label>
            <EditableCell value={currentData.lk} onChange={(e) => handleSimpleChange('lk', e.target.value)} type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Perempuan (PR)</label>
            <EditableCell value={currentData.pr} onChange={(e) => handleSimpleChange('pr', e.target.value)} type="number" />
          </div>
        </div>

        {/* Bagian Pengalaman */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-gray-50">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sudah Haji/Umrah</label>
            <EditableCell value={currentData.pengalaman.sudah} onChange={(e) => handleExperienceChange('sudah', e.target.value)} type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Belum Haji/Umrah</label>
            <EditableCell value={currentData.pengalaman.belum} onChange={(e) => handleExperienceChange('belum', e.target.value)} type="number" />
          </div>
        </div>

        {/* Bagian Tabel-tabel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SubTableEditor title="Pendidikan" data={currentData.pendidikan} columns={columns.pendidikan} onChange={(...args) => handleTableChange('pendidikan', ...args)} />
          <SubTableEditor title="Usia" data={currentData.usia} columns={columns.usia} onChange={(...args) => handleTableChange('usia', ...args)} />
          <SubTableEditor title="Pekerjaan" data={currentData.pekerjaan} columns={columns.pekerjaan} onChange={(...args) => handleTableChange('pekerjaan', ...args)} />
        </div>
      </div>
    </div>
  );
};

// Komponen helper untuk sub-tabel (Pendidikan, Usia, dll)
const SubTableEditor = ({ title, data, columns, onChange }) => (
  <div className="border rounded-lg overflow-hidden">
    <h3 className="text-md font-semibold text-gray-700 p-3 bg-gray-100 border-b">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full text-black">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-1 whitespace-nowrap text-sm">
                  <EditableCell
                    value={row[col.key]}
                    onChange={(e) => onChange(index, col.key, e.target.value)}
                    type={col.key === 'value' ? 'number' : 'text'}
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


// --- Editor Komponen 3: Untuk Objek Key-Value Sederhana (cth: dataLain) ---
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

  // Fungsi untuk mengubah key (misal "pasporHaji") menjadi label ("Paspor Haji")
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
const HajiUmrahPage = () => {

  // --- Data Haji & Umrah ---
  const dataKuota = [{ tahun: 2021, kuota: 0 }, { tahun: 2022, kuota: 0 }, { tahun: 2023, kuota: 1302 }, { tahun: 2024, kuota: 2520 }, { tahun: 2025, kuota: 2635 },];
  const dataTunggu = { total: 43702, lk: 18589, pr: 25113, pendidikan: [{ name: "SD/MI", value: 2783 }, { name: "SMP/MTs", value: 2969 }, { name: "SLTA/MA", value: 12316 }, { name: "Diploma", value: 2916 }, { name: "S1", value: 18337 }, { name: "S2", value: 4082 }, { name: "S3", value: 299 },], usia: [{ name: "<20", value: 1148 }, { name: "20-39", value: 10394 }, { name: "40-59", value: 24116 }, { name: "60-79", value: 7924 }, { name: ">=80", value: 122 },], pekerjaan: [{ name: "ASN", value: 7523 }, { name: "TNI/POLRI", value: 817 }, { name: "Pedagang", value: 3691 }, { name: "Nelayan/Petani", value: 315 }, { name: "Swasta", value: 12723 }, { name: "IRT", value: 10809 }, { name: "Pelajar/Mhs", value: 3653 }, { name: "BUMN/D", value: 2653 }, { name: "Pensiunan", value: 1015 }, { name: "Lainnya", value: 298 },], pengalaman: { sudah: 1526, belum: 4931 }, };
  const dataHajiBerangkat = { total: 6457, lk: 2475, pr: 3982, pendidikan: [{ name: "SD/MI", value: 2783 }, { name: "SMP/MTs", value: 2969 }, { name: "SLTA/MA", value: 12316 }, { name: "Diploma", value: 2916 }, { name: "S1", value: 18337 }, { name: "S2", value: 4082 }, { name: "S3", value: 299 },], usia: [{ name: "<20", value: 1148 }, { name: "20-39", value: 10394 }, { name: "40-59", value: 24116 }, { name: "60-79", value: 7924 }, { name: ">=80", value: 122 },], pekerjaan: [{ name: "ASN", value: 7523 }, { name: "TNI/POLRI", value: 817 }, { name: "Pedagang", value: 3691 }, { name: "Nelayan/Petani", value: 315 }, { name: "Swasta", value: 12723 }, { name: "IRT", value: 10809 }, { name: "Pelajar/Mhs", value: 3658 }, { name: "BUMN/D", value: 2653 }, { name: "Pensiunan", value: 1015 }, { name: "Lainnya", value: 298 },], pengalaman: { sudah: 2475, belum: 3982 }, };
  const dataPendaftarBaru = { total: 3965, lk: 1716, pr: 2249, pendidikan: [{ name: "SD/MI", value: 182 }, { name: "SMP/MTs", value: 216 }, { name: "SLTA/MA", value: 913 }, { name: "Diploma", value: 317 }, { name: "S1", value: 1832 }, { name: "S2", value: 442 }, { name: "S3", value: 48 },], usia: [{ name: "<20", value: 990 }, { name: "20-39", value: 2319 }, { name: "40-59", value: 1628 }, { name: "60-79", value: 137 }, { name: ">=80", value: 0 },], pekerjaan: [{ name: "ASN", value: 562 }, { name: "TNI/POLRI", value: 67 }, { name: "Pedagang", value: 352 }, { name: "Nelayan/Petani", value: 36 }, { name: "Swasta", value: 1185 }, { name: "IRT", value: 761 }, { name: "Pelajar/Mhs", value: 553 }, { name: "BUMN/D", value: 260 }, { name: "Pensiunan", value: 66 }, { name: "Lainnya", value: 123 },], pengalaman: { sudah: 3665, belum: 300 }, };
  const dataLain = { pembatalan: 233, petugas: 0, pasporHaji: 0, pasporUmrah: 0, pihk: 0, ppiu: 0, kbihu: 0, };

  // Kolom CSV
  const kuotaColumns = [{ header: 'Tahun', key: 'tahun' }, { header: 'Kuota', key: 'kuota', align: 'right' }];
  const pendidikanColumns = [{ header: 'Pendidikan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];
  const usiaColumns = [{ header: 'Rentang Usia', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];
  const pekerjaanColumns = [{ header: 'Pekerjaan', key: 'name' }, { header: 'Jumlah', key: 'value', align: 'right' }];

  // Gabungkan kolom untuk data kompleks
  const complexHajiColumns = {
    pendidikan: pendidikanColumns,
    usia: usiaColumns,
    pekerjaan: pekerjaanColumns
  };

  const addKuotaTahunRow = (currentData, setCurrentData) => {
    let maxTahun = new Date().getFullYear(); // Default jika data kosong

    if (currentData.length > 0) {
      // Cari tahun terbesar dari data yang ada
      maxTahun = Math.max(...currentData.map(row => row.tahun));
    }

    const newRow = {
      tahun: maxTahun + 1,
      kuota: 0
    };

    // Cek agar tidak ada duplikat tahun (jika tombol diklik berkali-kali)
    if (currentData.some(row => row.tahun === newRow.tahun)) {
      console.warn(`Tahun ${newRow.tahun} sudah ada.`);
      return;
    }

    setCurrentData([...currentData, newRow]);
  };

  return (
    <Fragment>
      {/* Header Utama Halaman */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Haji & Umrah
        </h1>
        <p className="text-gray-600">
          Halaman ini berisi data terkait haji dan umrah, termasuk kuota, pendaftar, dan demografi.
        </p>
      </div>

      {/* Konten Utama Halaman */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6">

          <ArrayDataTableEditor
            title="Data Kuota Haji"
            docPath="haji/kuota"
            initialData={dataKuota}
            columns={kuotaColumns}
            onAddNewRow={addKuotaTahunRow}
          />

          <ComplexHajiDataEditor
            title="Data Jemaah Haji Tunggu"
            docPath="haji/dataTunggu"
            initialData={dataTunggu}
            columns={complexHajiColumns}
          />

          <ComplexHajiDataEditor
            title="Data Jemaah Haji Berangkat"
            docPath="haji/dataHajiBerangkat"
            initialData={dataHajiBerangkat}
            columns={complexHajiColumns}
          />

          <ComplexHajiDataEditor
            title="Data Pendaftar Haji Baru"
            docPath="haji/dataPendaftarBaru"
            initialData={dataPendaftarBaru}
            columns={complexHajiColumns}
          />

          <SimpleObjectEditor
            title="Data Lain-lain"
            docPath="haji/dataLain"
            initialData={dataLain}
          />

        </div>
      </div>
    </Fragment>
  );
};

export default HajiUmrahPage;
