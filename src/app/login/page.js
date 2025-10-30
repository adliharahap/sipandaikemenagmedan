"use client"; // Diperlukan agar Firebase dan hooks Next.js/React berjalan di browser

import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
// Pastikan path ini benar sesuai struktur folder Anda
import { auth } from '../../../utils/firebase'; 
import { useRouter } from 'next/navigation';
// Pastikan path ini benar
import LoadingScreen from '../LoadingPage'; 

// --- SVG Ikon untuk Google ---
const GoogleIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        className={className}
    >
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.636,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Jika ADA user (sudah login), langsung lempar ke halaman utama.
                console.log("User sudah login, mengarahkan ke beranda...");
                router.push('/');
            } else {
                // Jika TIDAK ADA user, hentikan pengecekan dan biarkan halaman login ditampilkan.
                setIsCheckingAuth(false);
            }
        });

        // Cleanup listener saat komponen di-unmount untuk menghindari memory leak
        return () => unsubscribe();
    }, [router]);

    const loginWithGoogle = async () => {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();

        try {
            // 1. Tunggu proses popup selesai
            await signInWithPopup(auth, provider);

            // 2. Jika berhasil (tidak ada error), baru lakukan redirect
            console.log("Login Google berhasil, mengarahkan ke halaman utama...");
            router.push('/');

        } catch (error) {
            console.error("Gagal saat proses sign-in popup:", error);
            // Hanya tampilkan alert jika errornya bukan karena user menutup popup
            if (error.code !== 'auth/popup-closed-by-user') {
                // Ganti alert dengan metode notifikasi yang lebih baik jika ada
                alert("Gagal melakukan login. Pastikan popup tidak diblokir dan coba lagi.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        // Tampilkan loading screen penuh selagi mengecek status auth
        return (
            <LoadingScreen />
        );
    }

    return (
        // Latar belakang utama dengan dukungan dark mode
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 font-sans transition-colors duration-300">
            {/* Bentuk Gradien Latar Belakang */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/30 dark:bg-emerald-700/30 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-green-400/30 dark:bg-green-600/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md mx-auto z-10">
                {/* Kartu Login dengan dukungan dark mode */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 rounded-2xl shadow-lg dark:shadow-black/50 text-center">

                    {/* Logo Kementerian Agama */}
                    <img
                        src="/logo3.png"
                        alt="Logo Kementerian Agama"
                        className="mx-auto h-24 w-24 mb-6"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e2e8f0/64748b?text=Logo'; }}
                    />

                    <div className="mb-8">
                        {/* Teks header dengan dukungan dark mode */}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang</h1>
                        <p className="text-gray-600 dark:text-gray-400">Masuk untuk melanjutkan ke Panel Admin</p>
                    </div>

                    {/* Tombol Masuk dengan Google dan dukungan dark mode */}
                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                        className="w-full inline-flex justify-center items-center gap-4 
                           bg-white dark:bg-gray-700 
                           border border-gray-300 dark:border-gray-600 
                           hover:bg-gray-50 dark:hover:bg-gray-600 
                           rounded-lg px-6 py-3 text-md font-medium 
                           text-gray-700 dark:text-gray-100 
                           transition-all duration-300 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-offset-white dark:focus:ring-offset-gray-800 
                           focus:ring-indigo-500
                           disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div
                                    // Spinner dengan dukungan dark mode
                                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 dark:border-gray-100"
                                    role="status"
                                >
                                </div>
                                <span>Sedang memproses...</span>
                            </>
                        ) : (
                            <>
                                <GoogleIcon />
                                <span>Masuk dengan Google</span>
                            </>
                        )}
                    </button>

                    <p className="text-center mt-10 text-gray-500 dark:text-gray-400 text-xs">
                        Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                    </p>
                </div>

                <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Kementerian Agama Kota Medan. All Rights Reserved.</p>
                </footer>
            </div>
        </main>
    );
}
