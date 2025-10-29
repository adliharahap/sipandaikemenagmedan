import React, { useState, useEffect, useRef } from 'react';

export const DeleteUserModal = ({ isOpen, onClose, onConfirm }) => {
    const modalRef = useRef(null);

    // Efek untuk menangani klik di luar modal untuk menutupnya
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Efek untuk menangani tombol 'Escape' untuk menutup modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.9)] backdrop-blur-sm transition-opacity duration-300 ease-in-out">
            <div
                ref={modalRef}
                className="w-full max-w-md p-8 m-4 bg-white rounded-2xl shadow-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
                style={{ animationFillMode: 'forwards' }} // Mempertahankan state akhir animasi
            >
                {/* Ikon Peringatan */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full">
                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                
                {/* Judul */}
                <h3 className="mt-5 text-2xl font-bold text-center text-gray-800">
                    Konfirmasi Penghapusan Pengguna
                </h3>
                
                {/* Pesan Deskripsi */}
                <p className="mt-3 text-base text-center text-gray-600">
                    Apakah Anda yakin ingin menghapus pengguna ini? Setelah dihapus, pengguna tidak akan memiliki hak akses lagi.
                </p>
                
                {/* Tombol Aksi */}
                <div className="flex flex-col mt-8 space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-300"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
            {/* Menambahkan keyframes untuk animasi di dalam style tag, karena Tailwind tidak mendukungnya secara default */}
            <style jsx>{`
                @keyframes fade-in-scale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};