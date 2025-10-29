"use client"; // Diperlukan agar Firebase dan hooks Next.js/React berjalan di browser

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- Komponen Ikon (SVG Inline) ---
const LogoutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const XIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// --- Komponen Badge Peran Dinamis ---
const RoleBadge = ({ role }) => {
    const roleStyles = {
        owner: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        admin: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        pegawai: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        default: 'bg-slate-700 text-slate-400 border-slate-600'
    };
    const style = roleStyles[role] || roleStyles.default;
    return (
        <span className={`mt-2 text-xs font-medium capitalize px-2.5 py-1 rounded-full inline-block border ${style} transition-all`}>
            {role || "unknown role"}
        </span>
    );
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// --- Komponen Utama Sidebar ---
export default function SidebarContent({ navigation, user, onClose, onLogout }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const animationClass = (delay) => `transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-gradient-to-b from-slate-900 to-slate-800 px-6 pb-4">
            <div className="flex h-20 shrink-0 items-center justify-between">
                <div className={`text-2xl font-bold text-white ${animationClass('0ms')}`}>Kemenag</div>
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden"
                    onClick={onClose}
                >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            
            <div className={`flex flex-col items-center gap-y-3 text-center ${animationClass('100ms')}`}>
                <img 
                    className="h-24 w-24 rounded-full bg-slate-800 object-cover ring-2 ring-slate-700 hover:ring-indigo-500 transition-all" 
                    src={user?.photoURL} 
                    alt="User profile" 
                />
                <div>
                    <p className="font-semibold text-white">{user?.name || "Unknown user"}</p>
                    <p className="text-sm text-gray-400">{user?.email || "unknown email"}</p>
                    <RoleBadge role={user?.role} />
                </div>
            </div>

            <nav className="flex flex-1 flex-col mt-6">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name} className={animationClass()} style={{transitionDelay: `${200 + index * 50}ms`}}>
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={classNames(
                                                isActive
                                                    ? 'bg-slate-800 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-slate-800/80',
                                                'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200'
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                            <span className="transition-transform group-hover:translate-x-1 duration-200">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                    <li className={`mt-auto ${animationClass('500ms')}`}>
                        <button
                            onClick={() => {
                                onLogout(); // Panggil fungsi logout
                                onClose && onClose(); // Panggil onClose jika ada (untuk mobile)
                            }}
                            // =========================================
                            className="group w-full -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-slate-700/40 hover:text-red-500 transition-all duration-200"
                        >
                            <LogoutIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

