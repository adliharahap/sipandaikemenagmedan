"use client";

import React, { useEffect, useState } from "react";
import SidebarContent from "./sidebarContent";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { auth } from "../../../utils/firebase";
import LogoutModal from "../../../components/LogOutModal";
import { handleLogout } from "../../../utils/handleLogOut";


const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const UserIcon = ({ className }) => <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" className={className}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"></path> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"></path> </g></svg>
const ClipboardListIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>;
const LayoutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>; 
const SettingsIcon = ({ className }) => (
  <svg 
    viewBox="0 0 1024 1024" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor" // Menggunakan currentColor agar warna bisa diubah via CSS
    className={className}
    width="24"
    height="24"
  >
    <path d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"></path>
  </svg>
);

// --- Array Navigasi yang Telah Diperbarui ---
const navigation = [
  { name: 'User', href: '/admin/user', icon: UserIcon, },
  { name: 'Kependudukan', href: '/admin/kependudukan', icon: ClipboardListIcon, },
  { name: 'Data Keagamaan', href: '/admin/data-keagamaan', icon: LayoutIcon, },
  { name: 'Pendidikan Madrasah', href: '/admin/madrasah', icon: LayoutIcon, },
  { name: 'Sertifikasi Halal', href: '/admin/sertifikasi-halal', icon: LayoutIcon, },
  { name: 'Haji & Umrah', href: '/admin/haji-umrah', icon: LayoutIcon, },
  { name: 'Kepegawaian', href: '/admin/kepegawaian', icon: LayoutIcon, },
  { name: 'Back To Home', href: '/', icon: HomeIcon, },
];


// --- SVG Icon Components ---
const MenuIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();
  const { user} = useSelector((state) => state.auth);
  const pathname = usePathname();

  const activeNav = navigation.find(item => item.href === pathname);
  const activeName = activeNav ? activeNav.name : "";

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (!currentUser) {
      router.push("/");
    }
  });

  return () => unsubscribe();
}, [router]);

  return (
    <div className="min-h-screen bg-slate-200">

      <LogoutModal 
        isOpen={isLogout}
        onConfirm={() => handleLogout(router)}
        onClose={() => setIsLogout(false)}
      />

      {user?.status === "verified" && (
        <>
          <div
            className={`fixed inset-0 z-50 bg-gray-900/80 lg:hidden transition-opacity duration-300 ease-linear ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-xs transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
             <SidebarContent onClose={() => setSidebarOpen(false)} user={user} navigation={navigation} onLogout={() => setIsLogout(true)} />
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
             <SidebarContent user={user} navigation={navigation} onLogout={() => setIsLogout(true)} />
          </div>

          <div className="lg:pl-72">
            {/* Mobile Topbar */}
            <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-white/10 bg-slate-900 px-4 lg:hidden">
              <button className="p-2.5 text-gray-400" onClick={() => setSidebarOpen(true)}>
                <MenuIcon className="h-6 w-6" />
              </button>
              <div className="flex-1 text-lg font-semibold text-white">{activeName}</div>
            </div>

            {/* Main Content */}
            {user?.status == "verified" && (<main className="">{children}</main>)}
          </div>
        </>
      )}
    </div>
  );
}
