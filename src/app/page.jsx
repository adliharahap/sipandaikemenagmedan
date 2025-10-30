"use client";

import React, { useState, useEffect, Suspense } from 'react'; // Impor Suspense
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic'; // --- PERUBAHAN LAZY LOADING ---

import WaveBackground from '../../components/SvgComponent/WaveBackground';
import Navbar from '../../components/Navbar';

// --- Komponen Loading Sederhana ---
// Ini akan ditampilkan sementara komponen lain sedang dimuat
const LoadingSection = () => (
  <div className="flex justify-center items-center h-96">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

// --- PERUBAHAN LAZY LOADING ---
// Mengganti import statis dengan dynamic import untuk setiap section
const Kependudukan = dynamic(() => import('./Screen/Kependudukan'), { 
  suspense: true,
  // loading: () => <LoadingSection /> // Opsi lain jika tidak pakai Suspense
});
const DataKeagamaan = dynamic(() => import('./Screen/DataKeagamaan'), { suspense: true });
const PendidikanMadrasah = dynamic(() => import('./Screen/PendidikanMadrasah'), { suspense: true });
const SertifikasiHalal = dynamic(() => import('./Screen/SertifikasiHalal'), { suspense: true });
const HajiUmrah = dynamic(() => import('./Screen/HajiUmrah'), { suspense: true });
const Kepegawaian = dynamic(() => import('./Screen/Kepegawaian'), { suspense: true });
const Footer = dynamic(() => import('../../components/Footer'), { suspense: true });


// --- IKON SVG UNTUK STATISTIK (Tidak diubah) ---
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

// --- Komponen Ikon Mengambang (Tidak diubah) ---
const FloatingIcon = ({ icon, className, duration = 10, yRange = 20, xRange = 10 }) => {
  return (
    <motion.div
      className={`absolute p-4 bg-white/5 dark:bg-black/30 backdrop-blur-md rounded-full ring-1 ring-white/10 dark:ring-white/10 shadow-lg ${className}`}
      animate={{ y: [0, yRange, 0], x: [0, xRange, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: Math.random() * duration,
      }}
    >
      {icon}
    </motion.div>
  );
};


// Varian animasi (Tidak diubah)
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } };
const titleVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } } };
const contentVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const imageVariants = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 15, delay: 0.4 } } };
const waveVariants = { hidden: { opacity: 0, y: 150 }, visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut', delay: 0.5 } } };


const Home = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const errorImageSrc = "https://placehold.co/500x500/333/ccc?text=Image\nError&font=inter";

  return (
    <>
    <Navbar />
      <style jsx global>{`
        @keyframes lightMove {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0.4; }
          50% { transform: translate(0%, 0%) rotate(180deg); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0.4; }
        }
        .animate-lightMove { animation: lightMove 20s linear infinite; transform-origin: center; top: 50%; left: 50%; }
      `}</style>
      
      {/* Kontainer Utama Hero Section (Tidak diubah) */}
      <div id='beranda' className="min-h-screen h-[100vh] w-full max-w-full overflow-hidden relative bg-gradient-to-b from-cyan-700 via-emerald-700 to-green-700 dark:from-black dark:via-indigo-950 dark:to-purple-950 text-white">
        <div className="absolute inset-0 z-10 animate-lightMove bg-[radial-gradient(circle_at_80%_50%,#19FF74_0%,transparent_70%)] opacity-60 dark:bg-[radial-gradient(circle_at_80%_50%,#A855F7_0%,transparent_70%)] dark:opacity-50"></div>
        <motion.div 
          className="relative z-40 w-full h-full flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center mx-12 px-4 sm:px-6 lg:px-8 py-20">
            {/* Kolom Kiri: Teks */}
            <div className="flex flex-col justify-center text-left">
              <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold" variants={containerVariants}>
                <motion.span variants={titleVariants} className="bg-gradient-to-r from-white via-green-200 to-emerald-300 dark:from-white dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">
                  SIPANDAI
                </motion.span>
                <motion.span variants={titleVariants} className="block text-2xl sm:text-3xl text-green-200 dark:text-purple-300 mt-2 font-medium">
                  (Sistem Penyajian Data Keagamaan Interaktif)
                </motion.span>
              </motion.h1>
              <motion.h2 variants={contentVariants} className="text-2xl font-semibold text-green-100 dark:text-indigo-200 mt-12">
                Tentang SIPANDAI
              </motion.h2>
              <motion.p variants={contentVariants} className="text-lg text-gray-100 dark:text-gray-300 mt-4 max-w-2xl leading-relaxed">
                SIPANDAI adalah dashboard digital Kemenag Kota Medan untuk data keagamaan yang akurat dan interaktif. Akses info demografi, tren, dan layanan dengan cepat untuk mendukung transparansi publik dan pengambilan kebijakan.
              </motion.p>
              <motion.a
                href="#kependudukan"
                className="mt-10 inline-block px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-purple-600 dark:to-indigo-700 text-white font-semibold rounded-full shadow-lg max-w-xs text-center"
                variants={contentVariants}
                animate={{ y: [0, -6, 0], transition: { duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 2 } }}
                whileHover={{ scale: 1.05, y: 0, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat Data
              </motion.a>
            </div>
            {/* Kolom Kanan: Gambar */}
            <motion.div variants={containerVariants} className="relative w-full h-full min-h-[400px] hidden lg:flex items-center justify-center">
              <motion.img
                src={mounted ? (theme === 'dark' ? "/beranda.gif" : "/beranda.gif") : "/beranda.gif"}
                alt="Data Statistik"
                className="relative z-10 w-full max-w-md rounded-lg shadow-2xl bg-white/10 dark:bg-black/20 p-4 backdrop-blur-sm"
                variants={imageVariants}
                onError={(e) => { e.currentTarget.src = errorImageSrc; }}
              />
              <FloatingIcon icon={<DatabaseIcon className="w-10 h-10 text-emerald-300 dark:text-purple-400" />} className="z-20 top-10 left-10" duration={8} yRange={-25} xRange={15} />
              <FloatingIcon icon={<PieChartIcon className="w-16 h-16 text-cyan-300 dark:text-indigo-400" />} className="z-20 bottom-10 left-1/2" duration={12} yRange={20} xRange={-10} />
              <FloatingIcon icon={<UsersIcon className="w-12 h-12 text-green-300 dark:text-violet-400" />} className="z-20 top-1/2 -translate-y-1/2 right-5" duration={7} yRange={-15} xRange={20} />
              <FloatingIcon className="z-20 top-1/4 right-20 w-8 h-8" duration={15} yRange={30} xRange={-5} />
              <FloatingIcon className="z-20 bottom-1/3 left-10 w-12 h-12" duration={9} yRange={-10} xRange={-15} />
            </motion.div>
          </div>
        </motion.div>
        {/* Latar Belakang Ombak */}
        <motion.div
          className="absolute bottom-[-1px] left-0 z-20 w-full" 
          // style={{ transform: 'translateY(5px)' }}
          variants={waveVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        > 
          <WaveBackground />
        </motion.div>      
      </div>

      {/* --- PERUBAHAN LAZY LOADING --- */}
      {/* Membungkus semua komponen lazy-loaded dengan Suspense */}
      <Suspense fallback={<LoadingSection />}>
        <Kependudukan />
        <DataKeagamaan />
        <PendidikanMadrasah />
        <SertifikasiHalal />
        <HajiUmrah />
        <Kepegawaian />
        <Footer />
      </Suspense>
    </>
  );
}

export default Home;