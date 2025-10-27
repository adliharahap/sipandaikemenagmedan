"use client";

import React, { useState, useEffect } from 'react'; // Impor useState dan useEffect
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes'; // Impor useTheme
import WaveBackground from '../../components/SvgComponent/WaveBackground';
import KeyStatistic from './Screen/Kependudukan';
import Demografi from './Screen/DataKeagamaan';
import Kependudukan from './Screen/Kependudukan';
import AparaturDanAset from './Screen/AparaturDanAsset';
import SertifikasiHalal from './Screen/SertifikasiHalal';
import DataKeagamaan from './Screen/DataKeagamaan';
import PendidikanMadrasah from './Screen/PendidikanMadrasah';

// --- IKON SVG UNTUK STATISTIK ---
const DatabaseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const PieChartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

// --- Komponen Ikon Mengambang ---
const FloatingIcon = ({ icon, className, duration = 10, yRange = 20, xRange = 10 }) => {
  return (
    <motion.div
      // --- PERUBAHAN DARK MODE ---
      className={`absolute p-4 bg-white/5 dark:bg-black/30 backdrop-blur-md rounded-full ring-1 ring-white/10 dark:ring-white/10 shadow-lg ${className}`}
      animate={{
        y: [0, yRange, 0],
        x: [0, xRange, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: Math.random() * duration, // Mulai di posisi acak
      }}
    >
      {icon}
    </motion.div>
  );
};


// Varian animasi untuk container utama (stagger children)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Jeda antar elemen utama (teks dan gambar)
      delayChildren: 0.3,   // Mulai setelah 0.3 detik
    },
  },
};

// Varian untuk judul (staggered words)
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

// Varian untuk konten (subtitle dan paragraf)
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Varian untuk gambar
const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
      delay: 0.4, // Gambar muncul sedikit setelah teks
    },
  },
};

// --- VARIAN BARU UNTUK WAVEBACKGROUND ---
const waveVariants = {
  hidden: { opacity: 0, y: 150 }, // Mulai dari bawah dan transparan
  visible: {
    opacity: 1,
    y: 0, // Pindah ke posisi akhir
    transition: { 
      duration: 1.0, 
      ease: 'easeOut', 
      delay: 0.5 // Muncul setelah konten utama mulai masuk
    }
  }
};


const Home = () => {
  // --- TAMBAHAN: State untuk theme dan mounted (mencegah hydration mismatch) ---
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // URL Gambar berdasarkan tema
  const errorImageSrc = "https://placehold.co/500x500/333/ccc?text=Image\nError&font=inter";

  return (
    <>
      {/* CSS untuk Keyframes animasi cahaya */}
      <style jsx global>{`
        @keyframes lightMove {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translate(0%, 0%) rotate(180deg);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
            opacity: 0.4;
          }
        }
        .animate-lightMove {
          animation: lightMove 20s linear infinite;
          transform-origin: center;
          top: 50%;
          left: 50%;
        }
      `}</style>

      {/* --- PERUBAHAN DARK MODE --- */}
      {/* Kontainer Utama - Latar Belakang Gradient */}
      <div id='beranda' className="min-h-screen h-[100vh] w-full max-w-full overflow-hidden relative bg-gradient-to-b from-cyan-700 via-emerald-700 to-green-700 dark:from-black dark:via-indigo-950 dark:to-purple-950 text-white">
        
        {/* --- PERUBAHAN DARK MODE --- */}
        {/* Radial gradient cahaya (hijau di light, ungu di dark) */}
        <div className="absolute inset-0 z-10 animate-lightMove bg-[radial-gradient(circle_at_80%_50%,#19FF74_0%,transparent_70%)] opacity-60 dark:bg-[radial-gradient(circle_at_80%_50%,#A855F7_0%,transparent_70%)] dark:opacity-50"></div>
        
        {/* Konten Hero Section */}
        <motion.div 
          // --- PERUBAHAN: z-index dinaikkan dari 30 ke 40 ---
          className="relative z-40 w-full h-full flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          // Menggunakan whileInView + viewport-once agar animasi berjalan saat halaman dimuat
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center  mx-12 px-4 sm:px-6 lg:px-8 py-20">
            
            {/* Kolom Kiri: Teks */}
            <div className="flex flex-col justify-center text-left">
              {/* Judul Utama (Staggered) */}
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold"
                // Varian ini hanya untuk 'container' stagger, anaknya punya varian sendiri
                variants={containerVariants} 
              >
                <motion.span 
                  variants={titleVariants}
                  // --- PERUBAHAN DARK MODE ---
                  className="bg-gradient-to-r from-white via-green-200 to-emerald-300 dark:from-white dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent"
                >
                  SIPANDAI
                </motion.span>
                <motion.span 
                  variants={titleVariants}
                  // --- PERUBAHAN DARK MODE ---
                  className="block text-2xl sm:text-3xl text-green-200 dark:text-purple-300 mt-2 font-medium"
                >
                  (Sistem Penyajian Data Keagamaan Interaktif)
                </motion.span>
              </motion.h1>
              
              {/* Subjudul */}
              <motion.h2 
                variants={contentVariants}
                // --- PERUBAHAN DARK MODE ---
                className="text-2xl font-semibold text-green-100 dark:text-indigo-200 mt-12"
              >
                Tentang SIPANDAI
              </motion.h2>

              {/* --- PERUBAHAN: Paragraf Diringkas --- */}
              <motion.p 
                variants={contentVariants}
                // --- PERUBAHAN DARK MODE ---
                className="text-lg text-gray-100 dark:text-gray-300 mt-4 max-w-2xl leading-relaxed"
              >
                SIPANDAI adalah dashboard digital Kemenag Kota Medan untuk data keagamaan yang akurat dan interaktif. Akses info demografi, tren, dan layanan dengan cepat untuk mendukung transparansi publik dan pengambilan kebijakan.
              </motion.p>

              {/* --- PERUBAHAN: Tombol Bounce Ditambahkan --- */}
              <motion.a
                href="#demografi" // Ganti dengan link section berikutnya
                // --- PERUBAHAN DARK MODE ---
                className="mt-10 inline-block px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-purple-600 dark:to-indigo-700 text-white font-semibold rounded-full shadow-lg max-w-xs text-center"
                variants={contentVariants} // Ikut animasi masuk dengan konten
                animate={{ // Animasi memantul (idle)
                  y: [0, -6, 0],
                  transition: { 
                    duration: 1.8, 
                    repeat: Infinity, 
                    repeatType: 'reverse', 
                    ease: 'easeInOut',
                    delay: 2 // Mulai memantul setelah 2 detik
                  }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: 0, // Berhenti memantul dan hanya scale up
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat Data
              </motion.a>
            </div>

            {/* --- PERUBAHAN: Kolom Kanan (Gambar + Ikon Mengambang) --- */}
            <motion.div 
              variants={containerVariants} // Ganti ke container agar bisa stagger children
              className="relative w-full h-full min-h-[400px] hidden lg:flex items-center justify-center" // Sembunyikan di mobile
            >
              {/* --- PERUBAHAN: Gambar Statistik Utama (src dinamis) --- */}
              <motion.img
                src={mounted ? (theme === 'dark' ? "/beranda.gif" : "/beranda.gif") : "/beranda.gif"}
                alt="Data Statistik"
                // --- PERUBAHAN DARK MODE ---
                className="relative z-10 w-full max-w-md rounded-lg shadow-2xl bg-white/10 dark:bg-black/20 p-4 backdrop-blur-sm"
                variants={imageVariants} // Varian untuk gambar utama
                onError={(e) => { e.currentTarget.src = errorImageSrc; }}
              />

              {/* Ikon 1: Database (Mengambang di depan) */}
              <FloatingIcon
                // --- PERUBAHAN DARK MODE ---
                icon={<DatabaseIcon className="w-10 h-10 text-emerald-300 dark:text-purple-400" />}
                className="z-20 top-10 left-10" // Disesuaikan
                duration={8}
                yRange={-25}
                xRange={15}
              />
              
              {/* Ikon 2: Pie Chart (Mengambang di depan) */}
              <FloatingIcon
                // --- PERUBAHAN DARK MODE ---
                icon={<PieChartIcon className="w-16 h-16 text-cyan-300 dark:text-indigo-400" />}
                className="z-20 bottom-10 left-1/2" // Disesuaikan
                duration={12}
                yRange={20}
                xRange={-10}
              />
              
              {/* Ikon 3: Users (Mengambang di depan) */}
              <FloatingIcon
                // --- PERUBAHAN DARK MODE ---
                icon={<UsersIcon className="w-12 h-12 text-green-300 dark:text-violet-400" />}
                className="z-20 top-1/2 -translate-y-1/2 right-5" // Disesuaikan
                duration={7}
                yRange={-15}
                xRange={20}
              />

              {/* Elemen Dekoratif Bulat (Mengambang di depan) */}
              <FloatingIcon
                className="z-20 top-1/4 right-20 w-8 h-8" // Kecil
                duration={15}
                yRange={30}
                xRange={-5}
              />
              <FloatingIcon
                className="z-20 bottom-1/3 left-10 w-12 h-12" // Sedang
                duration={9}
                yRange={-10}
                xRange={-15}
              />
            </motion.div>
            {/* --- AKHIR PERUBAHAN --- */}

          </div>
        </motion.div>

        {/* --- PERUBAHAN: Latar Belakang Ombak Diberi Animasi Masuk --- */}
        <motion.div
          className="absolute bottom-0 left-0 z-20 w-full" 
          style={{ transform: 'translateY(5px)' }}
          variants={waveVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        > 
          {/* Menambahkan sedikit offset agar tidak ada celah */}
          {/* Seperti yang diminta, saya tidak mengubah component ini, hanya wrapper-nya */}
          <WaveBackground />
        </motion.div>      
      </div>
      {/* Key Statistic */}
      <Kependudukan />

      <DataKeagamaan />

      <PendidikanMadrasah />
      <SertifikasiHalal />

      <AparaturDanAset />
    </>
  );
}

export default Home;

