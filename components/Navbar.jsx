"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, delay, hover } from 'framer-motion';
import { useTheme } from 'next-themes';
import { MenuIcon, MoonIcon, SearchIcon, SunIcon, XIcon } from './SvgComponent/NavbarIcons';


const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // --- AWAL PERUBAHAN ---
  // State untuk mengelola dropdown yang sedang terbuka
  const [openDropdown, setOpenDropdown] = useState(null); // Untuk desktop (hover)
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null); // Untuk mobile (click)
  // --- AKHIR PERUBAHAN ---

  // Scroll event untuk efek sticky
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi toggle tema
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Fungsi toggle menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    // Reset dropdown mobile saat menu utama ditutup
    if (isMobileMenuOpen) {
      setOpenMobileDropdown(null);
    }
  };

  // --- AWAL PERUBAHAN ---
  // Daftar menu dengan struktur dropdown
  // Saya juga memperbaiki href yang duplikat
  const menuItems = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Kependudukan', href: '#kependudukan' },
    {
      name: 'Data Layanan', // Menu utama untuk dropdown
      children: [ // Submenu
        { name: 'Data Keagamaan', href: '#data-keagamaan' },
        { name: 'Pendidikan Madrasah', href: '#pendidikan-madrasah' },
        { name: 'Haji & Umrah', href: '#haji-umrah' },
        { name: 'Sertifikasi Halal', href: '#sertifikasi-halal' },
      ]
    },
    { name: 'Aparatur & Aset', href: '#aparatur-aset' },
  ];
  // --- AKHIR PERUBAHAN ---


  // Varian animasi untuk menu mobile (TIDAK BERUBAH)
  const mobileMenuContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    }
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.1
      }
    }
  };

  // --- VARIAN BARU UNTUK MENU DESKTOP ---
  // Varian untuk container menu desktop (TIDAK BERUBAH)
  const desktopMenuContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.10,
        delayChildren: 0.1,
      },
    },
  };

  // Varian untuk item menu desktop (TIDAK BERUBAH)
  const desktopMenuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.1
      }
    }
  };
  // --- END VARIAN BARU ---

  // Komponen Ikon Chevron (untuk dropdown)
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


  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky
          ? "shadow-lg bg-[#FDFAF6]/80 dark:bg-[#0D1B13]/80 backdrop-blur-sm"
          : "bg-transparent"
          }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo (Tidak berubah) */}
            <motion.a
              href="#beranda"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src='/logo3.png' // Pastikan path ini benar
                alt='kemenag-logo'
                className='h-10 w-10'
                onError={(e) => { e.currentTarget.style.display = 'none'; }} // Fallback jika logo error
              >
              </img>
              <span className={`font-bold text-xl ${isSticky ? "text-[#000000] " : "text-[#ffffff] dark:text-white"} dark:text-[#E4EFE7]`}>
                SIPANDAI
              </span>
            </motion.a>

            {/* --- AWAL PERUBAHAN Menu Desktop --- */}
            {/* Mengganti logika map untuk mendukung dropdown */}
            <motion.div
              className="hidden md:flex items-center space-x-6"
              variants={desktopMenuContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems.map((item) => (
                item.children ? (
                  // --- INI ADALAH DROPDOWN ---
                  <motion.div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    variants={desktopMenuItemVariants} // Menerapkan animasi per item
                  >
                    <button
                      className={`relative group font-medium ${isSticky ? "text-[#191818]" : "text-[#E4EFE7]"} dark:text-[#E4EFE7] hover:text-[#ffffff] dark:hover:text-[#ffffff] hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-1.5`}
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
                  // --- INI ADALAH LINK BIASA ---
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`relative group font-medium ${isSticky ? "text-[#191818]" : "text-[#E4EFE7]"} dark:text-[#E4EFE7] hover:text-[#ffffff] dark:hover:text-[#ffffff] hover:scale-110 transition-all duration-300 ease-in-out`}
                    variants={desktopMenuItemVariants}
                  >
                    {item.name}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#A7F3D0] dark:bg-[#A7F3D0]"></span>
                  </motion.a>
                )
              ))}
            </motion.div>
            {/* --- AKHIR PERUBAHAN Menu Desktop --- */}


            {/* Tombol kanan (Tidak berubah) */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Field (Desktop) */}
              <div className="hidden md:flex relative items-center">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="pl-4 pr-10 py-2 w-32 sm:w-48 rounded-full bg-[#FAF1E6] dark:bg-[#1F2922] text-[#064420] dark:text-[#E4EFE7] placeholder:text-[#064420]/70 dark:placeholder:text-[#E4EFE7]/70 focus:outline-none focus:ring-2 focus:ring-[#064420] dark:focus:ring-[#E4EFE7] transition-all duration-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#064420] dark:text-[#E4EFE7] pointer-events-none">
                  <SearchIcon className="w-5 h-5" />
                </span>
              </div>

              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9, rotate: 15 }}
                className={`p-2 rounded-full ${isSticky ? 'text-[#064420]' : 'text-[#E4EFE7]' // Warna dinamis untuk light mode
                  } dark:text-[#E4EFE7] hover:bg-[#FAF1E6]/40 dark:hover:bg-[#1F2922] transition-colors`}
              >
                {theme === "dark" ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </motion.button>

              {/* Burger menu */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-md text-[#064420] dark:text-[#E4EFE7] hover:bg-[#FAF1E6] dark:hover:bg-[#1F2922] transition-colors"
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

      {/* --- AWAL PERUBAHAN Menu Mobile --- */}
      {/* Mengganti logika map untuk mendukung dropdown accordion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-90 pt-20 bg-[#FDFAF6] dark:bg-[#0a0111] md:hidden overflow-y-auto" // Tambah overflow-y-auto
            variants={mobileMenuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col items-center pt-12 pb-24 space-y-8">
              {menuItems.map((item) => (
                item.children ? (
                  // --- INI ADALAH ACCORDION MOBILE ---
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
                              onClick={() => setIsMobileMenuOpen(false)} // Tetap tutup menu utama
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
                  // --- INI ADALAH LINK BIASA MOBILE ---
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- AKHIR PERUBAHAN Menu Mobile --- */}
    </>
  );
};

export default Navbar;
