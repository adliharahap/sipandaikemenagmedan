// File ini berisi "slice" Redux untuk data landing page.
// Ini mencakup:
// 1. Initial state (data awal)
// 2. Thunk asinkron (untuk fetch data)
// 3. Reducer (logika untuk memperbarui state)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllLandingPageData } from '../utils/firebaseDataFetcher';
import { db } from '../utils/firebase';

/**
 * Thunk Asinkron:
 * 'data/fetchAll' adalah nama aksi.
 * Fungsi ini akan dipanggil saat kita dispatch(fetchLandingPageData())
 */
export const fetchLandingPageData = createAsyncThunk(
  'data/fetchAll',
  async (_, { rejectWithValue }) => {
    // thunkAPI.getState(), thunkAPI.dispatch() bisa diakses di sini
    try {
      // Memanggil fungsi utilitas yang kita buat
      const data = await fetchAllLandingPageData(db);
      return data; 
    } catch (error) {
      // Jika gagal, kirim pesan error sebagai payload
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Initial State untuk slice ini
 * status: 'idle' | 'loading' | 'succeeded' | 'failed'
 */
const initialState = {
  data: null,      // Akan diisi dengan objek data besar
  status: 'idle',
  error: null,
};

/**
 * Pembuatan Slice:
 * Menggabungkan reducer dan actions
 */
export const dataSlice = createSlice({
  name: 'landingData',
  initialState,
  // Reducer untuk aksi sinkron (jika ada)
  reducers: {
    // Cth: resetData: (state) => { state.data = null; state.status = 'idle'; }
  },
  // Reducer untuk aksi asinkron (dari createAsyncThunk)
  extraReducers: (builder) => {
    builder
      // Saat fetchLandingPageData() dimulai
      .addCase(fetchLandingPageData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Saat fetchLandingPageData() berhasil
      .addCase(fetchLandingPageData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; // Simpan data yang di-return
      })
      // Saat fetchLandingPageData() gagal
      .addCase(fetchLandingPageData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Simpan pesan error
      });
  },
});

// Ekspor reducer untuk store
export default dataSlice.reducer;
