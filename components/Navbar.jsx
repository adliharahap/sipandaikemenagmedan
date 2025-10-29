"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { DashboardIcon, LoginIcon, LogoutIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon, XIcon } from './SvgComponent/NavbarIcons';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { handleLogout } from '../utils/handleLogOut';

const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9L12 15L18 9"></path>
  </svg>
);

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) {
      setOpenMobileDropdown(null);
    }
  };

  // --- AWAL PERUBAHAN: Fungsi Demo Autentikasi ---
  const mockSignIn = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserInfo({
      name: role === 'user' ? 'User Biasa' : 'Pegawai Keren',
      email: role === 'user' ? 'user@google.com' : 'pegawai@kemenag.go.id',
      photoUrl: `https://placehold.co/40x40/${role === 'user' ? 'E2E8F0' : 'A7F3D0'}/333333?text=${role.charAt(0).toUpperCase()}`
    });
    setIsMobileMenuOpen(false); // Tutup menu mobile jika sign in dari sana
    setIsProfileOpen(false); // Pastikan profile tertutup
  };

  const mockSignOut = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserInfo(null);
    setIsProfileOpen(false); // Tutup profile dropdown
    setIsMobileMenuOpen(false); // Tutup menu mobile
  };
  // --- AKHIR PERUBAHAN: Fungsi Demo Autentikasi ---


  const menuItems = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Kependudukan', href: '#kependudukan' },
    {
      name: 'Data Layanan',
      children: [
        { name: 'Data Keagamaan', href: '#data-keagamaan' },
        { name: 'Pendidikan Madrasah', href: '#pendidikan-madrasah' },
        { name: 'Sertifikasi Halal', href: '#sertifikasi-halal' },
        { name: 'Haji & Umrah', href: '#haji-umrah' },
      ]
    },
    { name: 'ASN & Non ASN', href: '#asn' },
  ];

  // Varian animasi (Tidak Berubah)
  const mobileMenuContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    exit: { opacity: 0, transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 18 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.1 } }
  };

  const desktopMenuContainerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.10, delayChildren: 0.1 } },
  };

  const desktopMenuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 18 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.1 } }
  };


  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-90 transition-all duration-300 ${isSticky
          ? "shadow-lg bg-[#FDFAF6]/80 dark:bg-[#0D1B13]/80 backdrop-blur-sm"
          : "bg-transparent"
          }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.a
              href="#beranda"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src='/logo3.png'
                alt='kemenag-logo'
                className='h-10 w-10'
                onError={(e) => { e.currentTarget.style.display = 'none'; }} // Fallback jika logo error
              >
              </img>
              <span className={`font-bold text-xl ${isSticky ? "text-[#000000] " : "text-[#ffffff] dark:text-white"} dark:text-[#E4EFE7]`}>
                SIPANDAI
              </span>
            </motion.a>

            {/* Menu Desktop */}
            <motion.div
              className="hidden md:flex items-center space-x-6"
              variants={desktopMenuContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems.map((item) => (
                item.children ? (
                  // --- DROPDOWN LAYANAN ---
                  <motion.div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    variants={desktopMenuItemVariants}
                  >
                    <button
                      className={`relative group font-medium ${isSticky ? "text-[#191818]" : "text-[#E4EFE7]"} dark:text-[#E4EFE7] hover:text-[#064420] dark:hover:text-[#ffffff] hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-1.5`}
                    >
                      {item.name}
                      <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      <span className="absolute -bottom-0.5 left-0 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#A7F3D0] dark:bg-[#A7F3D0]"></span>
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-lg shadow-lg bg-[#FDFAF6] dark:bg-[#0D1B13] ring-1 ring-black ring-opacity-5 p-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="flex flex-col gap-1">
                            {item.children.map((child) => (
                              <a
                                key={child.name}
                                href={child.href}
                                className="block px-4 py-2 text-sm rounded-md text-[#064420] dark:text-[#E4EFE7] hover:bg-[#FAF1E6] dark:hover:bg-[#1F2922] transition-colors"
                              >
                                {child.name}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  // --- LINK BIASA ---
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`relative group font-medium ${isSticky ? "text-[#191818]" : "text-[#E4EFE7]"} dark:text-[#E4EFE7] hover:text-[#064420] dark:hover:text-[#ffffff] hover:scale-110 transition-all duration-300 ease-in-out`}
                    variants={desktopMenuItemVariants}
                  >
                    {item.name}
                    <span className="absolute -bottom-0.5 left-0 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#A7F3D0] dark:bg-[#A7F3D0]"></span>
                  </motion.a>
                )
              ))}
            </motion.div>

            {/* Tombol kanan (Auth, Tema, Burger) */}
            <div className="flex items-center gap-2 sm:gap-4">

              {/* --- AWAL PERUBAHAN: Tombol Kanan Dinamis --- */}

              {!isLoggedIn && (
                <>
                  {/* TOMBOL SIGN IN (Hanya tampil jika BELUM login) */}
                  {/* --- AWAL PERUBAHAN: Mengganti 2 tombol teks menjadi 1 tombol ikon --- */}
                  <Link
                    href="/login"
                    className={`p-2 rounded-full ${isSticky ? 'text-[#064420]' : 'text-[#E4EFE7]'
                      } dark:text-[#E4EFE7] hover:bg-[#FAF1E6]/40 dark:hover:bg-[#1F2922] transition-colors`}
                    title="Sign In"
                  >
                    <LoginIcon className="w-6 h-6" />
                  </Link>
                  {/* --- AKHIR PERUBAHAN: Mengganti 2 tombol teks menjadi 1 tombol ikon --- */}
                </>
              )}

              {/* Dark mode toggle (Selalu tampil) */}
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9, rotate: 15 }}
                className={`p-2 rounded-full ${isSticky ? 'text-[#064420]' : 'text-[#E4EFE7]'
                  } dark:text-[#E4EFE7] hover:bg-[#FAF1E6]/40 dark:hover:bg-[#1F2922] transition-colors`}
              >
                {theme === "dark" ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </motion.button>

              {isLoggedIn && (
                <>
                  {/* PROFILE DROPDOWN (Hanya tampil jika SUDAH login) */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileOpen((prev) => !prev)}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-full overflow-hidden hidden md:block w-6.5 h-6.5 ring-2 ring-offset-2 ring-offset-[#FDFAF6] dark:ring-offset-[#0D1B13] ring-[#A7F3D0] dark:ring-[#064420]"
                    >
                      <img
                        src={user?.photoURL}
                        alt="User profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/cccccc/333333?text=Err'; }} // Fallback jika Gagal load
                      />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          className="absolute top-full right-0 mt-3 w-64 rounded-lg shadow-lg bg-[#FDFAF6] dark:bg-[#0D1B13] ring-1 ring-black ring-opacity-5 p-2"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          // Tambahkan onMouseLeave jika ingin menutup saat mouse pergi
                          onMouseLeave={() => setIsProfileOpen(false)}
                        >
                          <div className="flex flex-col">
                            {/* Header Info Profile */}
                            <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                              <img
                                src={user?.photoURL}
                                alt="User profile"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="overflow-hidden">
                                <p className="text-sm font-medium text-[#064420] dark:text-[#E4EFE7] truncate">{user?.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                              </div>
                            </div>

                            {isLoggedIn && (
                              <>
                                {(
                                  (user?.role === "admin" ||
                                    user?.role === "owner" ||
                                    user?.role === "pegawai")
                                  && user?.status === "verified"
                                ) && (
                                    <div className="p-1 mt-1">
                                      <Link
                                        href="/admin"
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md ${isSticky ? 'text-[#064420]' : 'text-[#E4EFE7]'
                                          } dark:text-[#E4EFE7] hover:bg-[#FAF1E6]/40 dark:hover:bg-[#1F2922] transition-colors`}
                                        title="Go to Dashboard"
                                      >
                                        <DashboardIcon className="w-6 h-6" />
                                        <span>Go To Dashboard</span>
                                      </Link>
                                    </div>
                                  )}
                              </>
                            )}

                            {/* Tombol Logout */}
                            <div className="p-1 mt-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <LogoutIcon className="w-5 h-5" />
                                <span>Log Out</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
              {/* --- AKHIR PERUBAHAN: Tombol Kanan Dinamis --- */}


              {/* Burger menu */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-md ${isSticky ? 'text-[#064420]' : 'text-[#E4EFE7]'} dark:text-[#E4EFE7] hover:bg-[#FAF1E6] dark:hover:bg-[#1F2922] transition-colors`}
                >
                  {isMobileMenuOpen ? (
                    <XIcon className="w-6 h-6" />
                  ) : (
                    <MenuIcon className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* --- Menu Mobile (Dengan tombol Sign In/Out) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-80 pt-20 bg-[#FDFAF6] dark:bg-[#0a0111] md:hidden overflow-y-auto"
            variants={mobileMenuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col items-center pt-12 pb-24 space-y-8">
              {menuItems.map((item) => (
                item.children ? (
                  // --- ACCORDION MOBILE ---
                  <motion.div key={item.name} className="w-full text-center" variants={mobileMenuItemVariants}>
                    <button
                      onClick={() => setOpenMobileDropdown(openMobileDropdown === item.name ? null : item.name)}
                      className="text-2xl font-semibold text-[#064420] dark:text-[#E4EFE7] flex items-center justify-center gap-2 mx-auto"
                    >
                      {item.name}
                      <motion.div
                        animate={{ rotate: openMobileDropdown === item.name ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDownIcon className="w-5 h-5" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openMobileDropdown === item.name && (
                        <motion.div
                          className="flex flex-col items-center space-y-4 mt-4 overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {item.children.map((child) => (
                            <motion.a
                              key={child.name}
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-lg font-medium text-gray-700 dark:text-gray-400"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {child.name}
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  // --- LINK BIASA MOBILE ---
                  <motion.a
                    key={item.name}
                    href={item.href}
                    variants={mobileMenuItemVariants}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-semibold text-[#064420] dark:text-[#E4EFE7]"
                  >
                    {item.name}
                  </motion.a>
                )
              ))}

              {/* --- AWAL PERUBAHAN: Tombol Auth di Mobile Menu --- */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700 w-3/4 flex flex-col items-center gap-4">
                {!isLoggedIn ? (
                  <>
                    <motion.button
                      onClick={() => mockSignIn('user')}
                      variants={mobileMenuItemVariants}
                      className="w-full max-w-xs px-6 py-3 rounded-full text-lg font-medium bg-[#A7F3D0] text-[#064420]"
                    >
                      Sign In
                    </motion.button>
                  </>
                ) : (
                  <motion.div className="flex flex-col items-center gap-4" variants={mobileMenuItemVariants}>
                    {/* Profile */}
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border border-[#FAF1E6]"
                      />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-[#064420] dark:text-[#E4EFE7]">
                          {user?.name}
                        </p>
                        <p className="text-sm text-[#5B7065] dark:text-gray-400">
                          {user?.email}
                        </p>
                    </div>

                    {/* Logout Button */}
                    <motion.button
                      onClick={handleLogout}
                      className="w-full max-w-xs px-6 py-3 rounded-full text-lg font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    >
                      Log Out
                    </motion.button>
                  </motion.div>
                )}
              </div>
              {/* --- AKHIR PERUBAHAN: Tombol Auth di Mobile Menu --- */}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

