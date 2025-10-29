"use client";

import React from 'react';
import Link from 'next/link'; // Menggunakan Link dari Next.js untuk navigasi yang lebih baik
import Navbar from '../../components/Navbar';

// SVG Icon untuk halaman 404 (Link terputus)
const BrokenLinkIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
        <line x1="8" y1="2" x2="8" y2="5"></line>
        <line x1="2" y1="8" x2="5" y2="8"></line>
        <line x1="16" y1="19" x2="16" y2="22"></line>
        <line x1="19" y1="16" x2="22" y2="16"></line>
    </svg>
);

// SVG Icon untuk tombol kembali
const HomeIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);


export default function NotFoundPage() {
  return (
    // --- PERUBAHAN: Background dan warna teks utama ---
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-100 text-slate-800 font-poppins p-4">
      <Navbar />
      {/* Background Gradient Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* --- PERUBAHAN: Warna gradien disesuaikan untuk light mode --- */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* --- PERUBAHAN: Warna kontainer ikon dan ikon --- */}
        <div className="bg-white/60 border border-slate-200 backdrop-blur-sm p-4 rounded-full mb-6">
            <BrokenLinkIcon className="w-16 h-16 text-emerald-600" />
        </div>
        
        {/* --- PERUBAHAN: Warna gradien teks untuk "404" --- */}
        <h1 className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 mb-2">
            404
        </h1>
        {/* --- PERUBAHAN: Warna teks judul dan paragraf --- */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            Halaman Tidak Ditemukan
        </h2>
        <p className="max-w-md text-slate-500 mb-8">
            Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
        </p>
        
        {/* --- PERUBAHAN: Warna tombol dan menggunakan <Link> dari Next.js --- */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all transform hover:scale-105 duration-300"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}
