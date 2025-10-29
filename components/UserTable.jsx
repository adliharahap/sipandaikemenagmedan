import React from "react";
import { DeleteIcon, EditIcon } from "./SvgComponent/Icons";

export default function UserTable({ users, formatDate, handleUpdateUser, handleOpenDeleteUserModal }) {
    // 1. Filter pengguna untuk only menampilkan yang statusnya 'verified'
    const verifiedUsers = users.filter(user => user.status.toLowerCase() === 'verified');

    // --- FUNGSI DIPERBARUI UNTUK 4 ROLE ---
    const getRoleBadge = (role) => {
        // Kita gunakan switch case agar lebih mudah dibaca
        switch (role.toLowerCase()) {
            case 'owner':
                return 'bg-amber-100 text-amber-800'; // Emas
            case 'admin':
                return 'bg-blue-100 text-blue-800'; // Biru (sesuai permintaan)
            case 'pegawai':
                return 'bg-red-100 text-red-800'; // Hijau
            case 'user':
                return 'bg-gray-100 text-gray-800'; // Abu-abu
            default:
                // Default jika role tidak dikenal
                return 'bg-gray-100 text-gray-800';
        }
    };
    // --- BATAS AKHIR PERUBAHAN ---

    const getStatusBadge = (status) => {
        // Karena sudah difilter, statusnya pasti verified, tapi fungsi ini tetap berguna jika filter dihilangkan
        return status.toLowerCase() === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full rounded-sm divide-y divide-gray-200 shadow-md border border-slate-200">
                <thead className="bg-indigo-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Lengkap</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal Pendaftaran</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* 2. Cek apakah ada pengguna terverifikasi */}
                    {verifiedUsers.length > 0 ? (
                        verifiedUsers.map((user) => (
                            <tr key={user.uid} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    {/* Email sudah ditampilkan dengan benar di sini */}
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* 3. Gunakan properti `registeredAt` sesuai data baru */}
                                    {formatDate(user.registeredAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-3">
                                        <button onClick={() => handleUpdateUser(user)} className="text-gray-400 hover:text-blue-600 transition" aria-label="Edit user"><EditIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleOpenDeleteUserModal(user.id)} className="text-gray-400 hover:text-red-600 transition" aria-label="Delete user"><DeleteIcon className="h-5 w-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // 4. Tampilkan pesan jika tidak ada pengguna terverifikasi
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                Data user terverifikasi tidak ditemukan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
