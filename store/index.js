// store.js (SESUDAH)
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// 1. Import kebutuhan dari redux-persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

// 2. Konfigurasi persistensi
const persistConfig = {
  key: 'root', // key untuk data di localStorage
  storage,
  whitelist: ['auth'], // Hanya slice 'auth' yang akan disimpan. Ini penting!
};

// Gabungkan semua reducer Anda
const rootReducer = combineReducers({
  auth: authReducer,

});

// 3. Buat reducer yang sudah di-"persist"
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Konfigurasi store untuk menggunakan persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Abaikan action types ini dari redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Ekspor persistor
export const persistor = persistStore(store);