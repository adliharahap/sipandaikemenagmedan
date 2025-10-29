"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase';

// Import components (pastikan path ini benar)
import Pagination from '../../../../components/Pagination';
import FilterPanel from '../../../../components/FilterPanel';
import UserTable from '../../../../components/UserTable';
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon, FilterIcon, PrintIcon, SearchIcon } from '../../../../components/SvgComponent/Icons';
import LoadingScreen from '@/app/LoadingPage';
import { VerifUserModal } from './components/VerifUserModal';
import { EditUserModal } from './components/EditUserModal';
import { DeleteUserModal } from './components/DeleteUserModal';

export default function UserManagementPage() {
    // --- STATE MANAGEMENT ---
    const [allUsers, setAllUsers] = useState([]); // State untuk menyimpan semua data asli dari Firestore
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');

    // --- Filter and Search State ---
    const [filterSearch, setFilterSearch] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    // State untuk input di filter panel
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("");
    
    // State untuk filter yang sedang aktif
    const [activeFilters, setActiveFilters] = useState(null);
    const [filterMessage, setFilterMessage] = useState("");

    // --- Modal State user not verified ---
    const [isModalVerifUserOpen, setIsModalVerifUserOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const handleOpenVerifUserModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalVerifUserOpen(true);
    };


    // modal state untuk edit data user
    const [isModalEditUserOpen, setIsModalEditUserOpen] = useState(false);
    const [editUserData, setEditUserData] = useState(null);
    const handleOpenEditUserModal = (user) => {
        setEditUserData(user);
        setIsModalEditUserOpen(true);
    };

  const handleUpdatedUser = async (updatedUser) => {
    try {
      const userRef = doc(db, "users", updatedUser.id);
      await updateDoc(userRef, {
        name: updatedUser.name,
        role: updatedUser.role,
        status: updatedUser.status,
      });
      // update state lokal
      setAllUsers(prev =>
        prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
      );
      setIsModalEditUserOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Gagal memperbarui data pengguna: " + error.message);
    }
  };

    //   modal state untuk delete user
    const [isModalDeleteUserOpen, setIsModalDeleteUserOpen] = useState(false);
    const handleOpenDeleteUserModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalDeleteUserOpen(true);
    };

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [unverifiedCurrentPage, setUnverifiedCurrentPage] = useState(1);
    const unverifiedUsersPerPage = 3;

    // --- DATA FETCHING ---
    const fetchAllUserData = async () => {
        setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    registeredAt: data.registeredAt?.toDate ? data.registeredAt.toDate().toISOString() : null
                };
            });
            setAllUsers(usersData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUserData();
    }, []);

    // --- DATA PROCESSING & FILTERING ---
    const { verifiedUsers, unverifiedUsers } = useMemo(() => {
        const verified = allUsers.filter(user => user.status !== 'not verified');
        const unverified = allUsers.filter(user => user.status === 'not verified');
        return { verifiedUsers: verified, unverifiedUsers: unverified };
    }, [allUsers]);

    const filteredVerifiedUsers = useMemo(() => {
        let filtered = verifiedUsers.filter(user =>
            user.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(filterSearch.toLowerCase()) ||
            user.status.toLowerCase().includes(filterSearch.toLowerCase()) ||
            user.role.toLowerCase().includes(filterSearch.toLowerCase())
        );

        if (activeFilters) {
            filtered = filtered.filter(user => {
                if (!user.registeredAt) return false;
                const registrationDate = new Date(user.registeredAt);
                
                const startDate = activeFilters.startDate ? new Date(activeFilters.startDate) : null;
                if(startDate) startDate.setHours(0,0,0,0);

                const endDate = activeFilters.endDate ? new Date(activeFilters.endDate) : null;
                if(endDate) endDate.setHours(23,59,59,999);

                const passesDateRange = !startDate || !endDate || (registrationDate >= startDate && registrationDate <= endDate);
                const passesMonth = !activeFilters.month || (registrationDate.getMonth() + 1) == activeFilters.month;
                const passesYear = !activeFilters.year || registrationDate.getFullYear() == activeFilters.year;
                
                return passesDateRange && passesMonth && passesYear;
            });
        }
        return filtered;
    }, [verifiedUsers, filterSearch, activeFilters]);

    const filteredUnverifiedUsers = useMemo(() => {
        // Logika serupa untuk pengguna yang belum diverifikasi
        let filtered = unverifiedUsers.filter(user =>
            user.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(filterSearch.toLowerCase())
        );

        if (activeFilters) {
             filtered = filtered.filter(user => {
                if (!user.registeredAt) return false;
                const registrationDate = new Date(user.registeredAt);
                
                const startDate = activeFilters.startDate ? new Date(activeFilters.startDate) : null;
                if(startDate) startDate.setHours(0,0,0,0);

                const endDate = activeFilters.endDate ? new Date(activeFilters.endDate) : null;
                if(endDate) endDate.setHours(23,59,59,999);

                const passesDateRange = !startDate || !endDate || (registrationDate >= startDate && registrationDate <= endDate);
                const passesMonth = !activeFilters.month || (registrationDate.getMonth() + 1) == activeFilters.month;
                const passesYear = !activeFilters.year || registrationDate.getFullYear() == activeFilters.year;
                
                return passesDateRange && passesMonth && passesYear;
            });
        }
        return filtered;
    }, [unverifiedUsers, filterSearch, activeFilters]);
    
    // --- UTILS & HANDLERS ---
    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(new Date().toLocaleDateString('id-ID', options));
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak valid';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Tanggal tidak valid';
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handlePrint = () => window.print();

    const handleApplyFilters = () => {
        const filters = {
            startDate: filterStartDate,
            endDate: filterEndDate,
            month: filterMonth,
            year: filterYear,
        };
        if (Object.values(filters).some(val => val !== "")) {
            setActiveFilters(filters);
        }
        setIsFilterVisible(false);
    };

    const handleResetFilters = () => {
        setActiveFilters(null);
        setFilterSearch("");
        setFilterStartDate("");
        setFilterEndDate("");
        setFilterMonth("");
        setFilterYear("");
        setFilterMessage("");
    };
    
    useEffect(() => {
        if (!activeFilters) {
            setFilterMessage("");
            return;
        }
        let messageParts = [];
        if (activeFilters.startDate && activeFilters.endDate) messageParts.push(`Tanggal: ${formatDate(activeFilters.startDate)} - ${formatDate(activeFilters.endDate)}`);
        if (activeFilters.month) messageParts.push(`Bulan: ${new Date(0, activeFilters.month - 1).toLocaleString('id-ID', { month: 'long' })}`);
        if (activeFilters.year) messageParts.push(`Tahun: ${activeFilters.year}`);

        if (messageParts.length > 0) {
            setFilterMessage(`Filter aktif: ${messageParts.join(', ')}`);
        } else {
            setActiveFilters(null);
            setFilterMessage("");
        }
    }, [activeFilters]);

    const handleVerifyUser = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: "pegawai", status: "verified" });
            setAllUsers(prev => prev.map(user => user.id === userId ? { ...user, role: "pegawai", status: "verified" } : user));
        } catch (error) {
            console.error("Error verifying user:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId));
            setAllUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Gagal menghapus pengguna: " + error.message);
        }
    };

    // --- PAGINATION LOGIC ---
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredVerifiedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredVerifiedUsers.length / usersPerPage);

    const indexOfLastUnverifiedUser = unverifiedCurrentPage * unverifiedUsersPerPage;
    const indexOfFirstUnverifiedUser = indexOfLastUnverifiedUser - unverifiedUsersPerPage;
    const currentUnverifiedUsers = filteredUnverifiedUsers.slice(indexOfFirstUnverifiedUser, indexOfLastUnverifiedUser);
    const totalUnverifiedPages = Math.ceil(filteredUnverifiedUsers.length / unverifiedUsersPerPage);

    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
    const handleNextUnverifiedPage = () => { if (unverifiedCurrentPage < totalUnverifiedPages) setUnverifiedCurrentPage(unverifiedCurrentPage + 1); };
    const handlePrevUnverifiedPage = () => { if (unverifiedCurrentPage > 1) setUnverifiedCurrentPage(unverifiedCurrentPage - 1); };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen flex">
            <div className="bg-slate-50 rounded-xl shadow-md overflow-hidden flex-1">
                <div className="p-6 sm:p-8">
                    {/* --- HEADER --- */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Management Pengguna</h1>
                            <p className="text-gray-500 mt-1">Kementerian Agama Kota Medan</p>
                        </div>
                        <div className="text-sm sm:text-base text-black bg-gray-300 px-4 py-2 rounded-lg text-center mt-4 sm:mt-0">{currentDate}</div>
                    </div>

                    {/* --- SEARCH & FILTER CONTROLS --- */}
                    <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:flex-1 sm:w-auto">
                            <input type="text" placeholder="Cari nama atau email" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} className="w-full sm:max-w-[400px] pl-10 pr-4 py-2 border border-gray-600 rounded-lg text-slate-900 focus:border-gray-900 placeholder:text-slate-500 bg-white"/>
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900" />
                        </div>
                        <div className="w-full sm:w-auto">
                            {!isFilterVisible && (
                                <button onClick={() => setIsFilterVisible(true)} className="flex items-center justify-center w-full bg-indigo-700 text-white border border-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">
                                    <FilterIcon className="h-5 w-5 mr-2" />
                                    Tambah Filter Data
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {activeFilters && (
                        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <FilterIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                                <p className="text-sm">
                                    <span className="font-bold">Filter Aktif:</span> {filterMessage}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                                <button onClick={() => setIsFilterVisible(true)} className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                                    Ubah
                                </button>
                                <button onClick={handleResetFilters} className="text-sm font-semibold bg-blue-200 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-300 transition-colors">
                                    Hapus Filter
                                </button>
                            </div>
                        </div>
                    )}

                    <FilterPanel isVisible={isFilterVisible} onClose={() => setIsFilterVisible(false)} onApply={handleApplyFilters} startDate={filterStartDate} onStartDateChange={setFilterStartDate} endDate={filterEndDate} onEndDateChange={setFilterEndDate} month={filterMonth} onMonthChange={setFilterMonth} year={filterYear} onYearChange={setFilterYear}/>

                    {/* --- VERIFIED USERS TABLE --- */}
                    <h2 className="text-xl font-bold text-gray-800 mb-4 mt-10">Pengguna Terverifikasi</h2>
                    <UserTable
                        users={currentUsers}
                        formatDate={formatDate}
                        handleUpdateUser={handleOpenEditUserModal}
                        handleOpenDeleteUserModal={handleOpenDeleteUserModal}
                    />
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">Menampilkan <span className="font-medium">{filteredVerifiedUsers.length > 0 ? indexOfFirstUser + 1 : 0}</span> - <span className="font-medium">{Math.min(indexOfLastUser, filteredVerifiedUsers.length)}</span> dari <span className="font-medium">{filteredVerifiedUsers.length}</span> hasil</div>
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onNext={handleNextPage} onPrev={handlePrevPage} />
                    </div>
                </div>

                <div className="mb-5 border-t border-gray-200"></div>

                {/* --- UNVERIFIED USERS TABLE --- */}
                <div className='px-6 pb-8 sm:px-8'>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Pengguna Belum Terverifikasi</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Lengkap</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal Pendaftaran</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUnverifiedUsers.length > 0 ? currentUnverifiedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-500">{user.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.registeredAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button onClick={() => handleOpenVerifUserModal(user.id)} className="text-gray-400 hover:text-green-600 transition" aria-label="Accept user"><CheckCircleIcon className="h-5 w-5" /></button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-600 transition" aria-label="Delete user"><DeleteIcon className="h-5 w-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Tidak ada pengguna yang belum terverifikasi.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">Menampilkan <span className="font-medium">{filteredUnverifiedUsers.length > 0 ? indexOfFirstUnverifiedUser + 1 : 0}</span> - <span className="font-medium">{Math.min(indexOfLastUnverifiedUser, filteredUnverifiedUsers.length)}</span> dari <span className="font-medium">{filteredUnverifiedUsers.length}</span> hasil</div>
                        </div>
                        <Pagination currentPage={unverifiedCurrentPage} totalPages={totalUnverifiedPages} onNext={handleNextUnverifiedPage} onPrev={handlePrevUnverifiedPage} />
                    </div>
                </div>
            </div>

            {/* Bagian Modal */}
            <VerifUserModal
                isOpen={isModalVerifUserOpen}
                onClose={() => setIsModalVerifUserOpen(false)}
                onConfirm={() => console.log("Verifying user with ID:", selectedUserId) || (handleVerifyUser(selectedUserId), setIsModalVerifUserOpen(false))}
            />

            <EditUserModal
                isOpen={isModalEditUserOpen}
                onClose={() => setIsModalEditUserOpen(false)}
                onSave={handleUpdatedUser}
                userData={editUserData}
            />

            <DeleteUserModal
                isOpen={isModalDeleteUserOpen}
                onClose={() => setIsModalDeleteUserOpen(false)}
                onConfirm={() => console.log("Deleting user with ID:", selectedUserId) || (handleDeleteUser(selectedUserId), setIsModalDeleteUserOpen(false))}
            />
        </div>
    )
}

