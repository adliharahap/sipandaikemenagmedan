import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const EditUserModal = ({ isOpen, onClose, onSave, userData }) => {
    const [formData, setFormData] = useState({ name: '', role: 'user', status: 'not verified' });
    const { user } = useSelector((state) => state.auth);
    const modalRef = useRef(null);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                role: userData.role || 'user',
                status: userData.status || 'not verified',
            });
        }
    }, [userData, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak valid';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Tanggal tidak valid';
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (!isOpen || !userData) return null;

    const isAuthorized = user && user.status === 'verified' && (user.role === 'admin' || user.role === 'owner');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({ ...userData, ...formData });
    };

    if (!isAuthorized) {
        // --- LOGIKA BARU UNTUK ALASAN DINAMIS ---
        let rejectionReason = 'Akses tidak diizinkan.';

        if (user) {
            if (user.status !== 'verified') {
                rejectionReason = 'Akun Anda belum terverifikasi.';
            } else if (user.role !== 'admin' && user.role !== 'owner') {
                rejectionReason = 'Anda bukan Owner atau Admin.';
            }
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.9)] backdrop-blur-sm transition-opacity duration-300 ease-in-out">
                <div
                    ref={modalRef}
                    className="w-full max-w-md p-8 m-4 bg-white rounded-2xl shadow-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <div className="text-center">
                        <svg className="mx-auto mb-4 w-12 h-12 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h3>
                        <p className="text-gray-600 mb-1">Maaf, Anda tidak diizinkan untuk mengedit data pengguna.</p>
                        <p className="text-sm text-gray-500">
                            <strong>Alasan:</strong> {rejectionReason}
                        </p>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button 
                            onClick={onClose} 
                            className="px-8 py-2.5 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-colors duration-300"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
                 <style jsx>{`
                    @keyframes fade-in-scale {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out; }
                `}</style>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.9)] backdrop-blur-sm transition-opacity duration-300 ease-in-out">
            <div
                ref={modalRef}
                className="w-full max-w-lg p-8 m-4 bg-white rounded-2xl shadow-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
                style={{ animationFillMode: 'forwards' }}
            >
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Data Pengguna</h3>
                
                <div className="flex items-center mb-6">
                    <img src={userData?.photoURL} alt="User Avatar" className="w-16 h-16 rounded-full mr-4 object-cover" onError={(e) => {e.target.onerror = null; e.target.src='https://placehold.co/96x96/E2E8F0/4A5568?text=User'}} />
                    <div>
                        <p className="font-semibold text-gray-800 break-all">{userData.email}</p>
                        <p className="text-sm text-gray-500">Terdaftar: {formatDate(userData.registeredAt)}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            <option value="user">User</option>
                            <option value="pegawai">Pegawai</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            <option value="verified">Verified</option>
                            <option value="not verified">Not Verified</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end mt-8 space-x-3">
                    <button onClick={onClose} className="px-5 py-2.5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-300">Batal</button>
                    <button onClick={handleSave} className="px-5 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-300">Simpan Perubahan</button>
                </div>
            </div>
             <style jsx>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out; }
            `}</style>
        </div>
    );
};