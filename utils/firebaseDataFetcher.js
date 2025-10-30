// File: firebaseDataFetcher.js (Perbaikan)

import { getDocs, collection, getDoc, doc } from 'firebase/firestore';

// --- STRUKTUR BARU (NAMA VARIABEL DIPERBAIKI) ---

const ROOT_COLLECTIONS = [
  'pendidikan',
  'haji',
  'halal',
  'kepegawaian',
];

// Ini adalah daftar DOKUMEN di dalam koleksi 'public'
const PUBLIC_DOCUMENTS = [
  'keagamaan',
  // 'kependudukan' akan kita ambil terpisah karena sudah ada kodenya
];

export const fetchAllLandingPageData = async (db) => {
  console.log("Memulai pengambilan data landing page...");
  const allData = {};

  try {
    // --- Bagian 1: Ambil data dari ROOT_COLLECTIONS (Tidak ada perubahan) ---
    for (const collectionName of ROOT_COLLECTIONS) {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      const collectionData = {};
      querySnapshot.forEach((doc) => {
        collectionData[doc.id] = doc.data();
      });
      allData[collectionName] = collectionData;
    //   console.log(`Berhasil mengambil data dari koleksi root: ${collectionName}`);
    }

    // --- Bagian 2: Ambil data dari PUBLIC_DOCUMENTS (DIUBAH) ---
    for (const docName of PUBLIC_DOCUMENTS) {
      // Path-nya adalah 'public/[nama_dokumen]'
      const docRef = doc(db, 'public', docName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Simpan data dokumen langsung ke root allData
        // cth: allData.keagamaan = { data: [...] }
        allData[docName] = docSnap.data();
        // console.log(`Berhasil mengambil data dari dokumen: public/${docName}`);
      } else {
        console.warn(`Dokumen public/${docName} tidak ditemukan.`);
        allData[docName] = { data: [] }; // Beri fallback data kosong
      }
    }

    // --- Bagian 3: Ambil data 'kependudukan' (Tidak ada perubahan) ---
    const kependudukanDocRef = doc(db, 'public', 'kependudukan');
    const kependudukanDocSnap = await getDoc(kependudukanDocRef);

    if (kependudukanDocSnap.exists()) {
      allData['kependudukan'] = kependudukanDocSnap.data();
    //   console.log("Berhasil mengambil data dari dokumen: public/kependudukan");
    } else {
      console.warn("Dokumen public/kependudukan tidak ditemukan.");
      allData['kependudukan'] = { data: [] };
    }

    // console.log("Semua data berhasil diambil:", allData);
    return allData;

  } catch (error) {
    console.error("Gagal mengambil data landing page:", error);
    throw error;
  }
};