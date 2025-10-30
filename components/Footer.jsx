"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Ikon SVG (Tidak ada perubahan) ---
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"></path> <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="currentColor"></path> <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="currentColor"></path> </g></svg>
);

const TikTokIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z" fill="#EE1D52"></path> <path d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z" fill="#000000"></path> <path d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z" fill="#69C9D0"></path> <path d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z" fill="#69C9D0"></path> <path d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z" fill="#69C9D0"></path> </g></svg>
);

const YouTubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.78 22 12 22 12s0 3.22-.418 4.814a2.506 2.506 0 0 1-1.768 1.768c-1.594.418-7.814.418-7.814.418s-6.22 0-7.814-.418a2.506 2.506 0 0 1-1.768-1.768C2 15.22 2 12 2 12s0-3.22.418-4.814a2.506 2.506 0 0 1 1.768-1.768C5.78 5 12 5 12 5s6.22 0 7.814.418zM9.545 15.568V8.432L15.818 12 9.545 15.568z" clipRule="evenodd" />
  </svg>
);

const WebsiteIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M14.982 19.61c.454-.7.909-1.6 1.236-2.755.755.29 1.273.636 1.591.909a8.182 8.182 0 0 1-2.864 1.845h.037v.001zm-8.8-1.855c.336-.273.845-.61 1.6-.91.336 1.164.773 2.064 1.236 2.764A8.2 8.2 0 0 1 6.2 17.755h-.018zm10.636-6.664c-.028-.81-.11-1.619-.245-2.418 1-.364 1.727-.8 2.236-1.2a8.136 8.136 0 0 1 1.282 3.618h-3.273zm-8.973-4.2a5.936 5.936 0 0 1-1.481-.8 8.2 8.2 0 0 1 2.654-1.7c-.427.636-.845 1.454-1.182 2.5h.01-.001zm7.137-2.5a8.145 8.145 0 0 1 2.654 1.7 6.01 6.01 0 0 1-1.481.8 9.58 9.58 0 0 0-1.182-2.5h.009zM14.8 9.118c.09.6.182 1.246.2 1.973H9c.027-.727.09-1.382.182-1.973 1.855.334 3.754.334 5.609 0h.009zM12 7.545c-.91 0-1.71-.072-2.39-.181.726-2.237 1.854-3.137 2.39-3.455.518.318 1.655 1.227 2.382 3.455A15.04 15.04 0 0 1 12 7.545zm-6.818-.072a8.03 8.03 0 0 0 2.245 1.2 18.368 18.368 0 0 0-.245 2.418h-3.31a8.13 8.13 0 0 1 1.319-3.618h-.01.001zm-1.3 5.436h3.3c.036.782.09 1.5.2 2.155a7.682 7.682 0 0 0-2.31 1.272 8.11 8.11 0 0 1-1.2-3.427h.01zM12 14.364c-1.09 0-2.027.09-2.845.236A16.91 16.91 0 0 1 9 12.91h6c-.027.608-.073 1.18-.145 1.69A15.388 15.388 0 0 0 12 14.355v.009zm0 5.727c-.545-.327-1.745-1.3-2.473-3.727A14.095 14.095 0 0 1 12 16.182c.955 0 1.773.063 2.482.182-.727 2.454-1.927 3.4-2.473 3.727H12zm6.927-3.764a7.634 7.634 0 0 0-2.309-1.272 17.95 17.95 0 0 0 .2-2.146h3.31a8.11 8.11 0 0 1-1.2 3.418h-.001zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"></path></g></svg>
);



// --- Komponen Logo ---
// REVISI: Menggunakan URL logo Kemenag yang valid dan styling yang lebih baik
const Logo = ({ className = "w-16 h-16" }) => {
    const [imgError, setImgError] = useState(false);

    return (
        // REVISI: diubah dari rounded-full menjadi rounded-xl
        <div className={`${className} flex-shrink-0 flex items-center justify-center overflow-hidden`}>
            {!imgError ? (
                <img
                    src="/logo3.png"
                    alt="Logo Kemenag"
                    className="w-full h-full object-contain p-1" // object-contain agar logo utuh
                    onError={() => setImgError(true)}
                />
            ) : (
                // Fallback jika logo gagal dimuat
                <div
                    className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold text-center text-sm leading-tight p-1"
                >
                    Kemenag
                </div>
            )}
        </div>
    );
};

// --- Komponen Helper ---

/**
 * Kolom Footer yang responsif dengan animasi
 */
const FooterColumn = ({ title, children, className = "" }) => (
    <motion.div
        className={`w-full ${className}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
    >
        {/* REVISI: Styling judul kolom lebih profesional */}
        {title && <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-5">{title}</h3>}
        {children}
    </motion.div>
);

/**
 * REVISI: Komponen baru untuk tautan cepat (mendukung nested children)
 */
const FooterLink = ({ item }) => {
    if (item.children) {
        return (
            <li className="mb-5">
                {/* Parent item (not a link) */}
                <span className="text-sm font-semibold text-gray-100 mb-2 block">
                    {item.name}
                </span>
                {/* Nested list */}
                <ul className="space-y-1 pl-3">
                    {item.children.map((child) => (
                        <li key={child.name}>
                            <a
                                href={child.href}
                                className="block text-sm text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                - {child.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </li>
        );
    }

    // Regular link
    return (
        <li className="mb-1">
            <a
                href={item.href}
                className="block text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
                {item.name}
            </a>
        </li>
    );
};


/**
 * Tautan Ikon Sosial yang interaktif
 */
// REVISI: Skema warna diubah agar lebih sesuai branding (hijau)
const SocialIcon = ({ href, icon, text }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={text}
        className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group"
        whileHover={{ y: -2 }} // Efek angkat
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <span className="p-2 bg-gray-800 rounded-full group-hover:bg-green-600 transition-colors duration-300">
            {icon}
        </span>
    </motion.a>
);


// --- Komponen Utama Footer ---

const Footer = () => {
    const [pusakaImgError, setPusakaImgError] = useState(false);
    const pusakaImgUrl = "https://kemenagkotamedan.com/wp-content/uploads/2025/03/pusaka_icon.png";
    const pusakaFallbackUrl = "https://placehold.co/100x100/374151/ffffff?text=Pusaka";

    // REVISI: Data tautan cepat dari user
    const menuItems = [
        { name: 'Beranda', href: '#beranda' },
        { name: 'Kependudukan', href: '#kependudukan' },
        { name: 'Data Keagamaan', href: '#data-keagamaan' },
        { name: 'Pendidikan Madrasah', href: '#pendidikan-madrasah' },
        { name: 'Sertifikasi Halal', href: '#sertifikasi-halal' },
        { name: 'Haji & Umrah', href: '#haji-umrah' },
        { name: 'Kepegawaian', href: '#kepegawaian' },
    ];

    return (
        <motion.footer
            // REVISI: Background diubah menjadi abu-abu gelap (lebih modern)
            className="bg-gray-950 text-gray-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7 }}
        >
            {/* REVISI: Grid diubah menjadi 6 kolom di layar besar (lg) untuk layout yang lebih baik */}
            <div className="mx-auto md:mx-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 xl:gap-12">

                {/* Kolom 1: Logo, Alamat, Copyright */}
                {/* REVISI: Dibuat lg:col-span-2 agar lebih lebar */}
                {/* REVISI: Ikon sosial dikembalikan ke sini */}
                <FooterColumn title={null} className="md:col-span-2 lg:col-span-2">
                    {/* Logo */}
                    <div className="flex items-center mb-5">
                        {/* REVISI: Logo dibuat lebih besar (w-20 h-20) */}
                        <Logo className="w-20 h-20 mr-4" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Kementerian Agama</h2>
                            <p className="text-base font-medium text-gray-300">Kota Medan</p>
                        </div>
                    </div>
                    {/* Alamat */}
                    <p className="text-sm leading-relaxed mb-6">
                        Jl. Sei Batu Gingging Ps. X No.12, Merdeka, Kec. Medan Baru, Kota Medan, Sumatera Utara 20153
                    </p>
                    {/* REVISI: Ikon sosial dipindahkan ke sini */}
                    <div className="flex space-x-4">
                        <SocialIcon href="https://www.facebook.com/kemenag.kotamedan.37" icon={<FacebookIcon />} text="Facebook" />
                        <SocialIcon href="https://www.instagram.com/kemenagkotamedan" icon={<InstagramIcon />} text="Instagram" />
                        <SocialIcon href="https://www.tiktok.com/@kemenagkotamedan" icon={<TikTokIcon />} text="TikTok" />
                        <SocialIcon href="https://www.youtube.com/@kantorkemenagkotamedan5011" icon={<YouTubeIcon />} text="YouTube" />
                        <SocialIcon href="https://kemenagkotamedan.com/" icon={<WebsiteIcon />} text="Website" />
                    </div>
                </FooterColumn>

                {/* REVISI: Kolom 2: Tautan Cepat */}
                <FooterColumn title="Tautan Cepat" className="md:col-span-1 lg:col-span-1">
                    {/* REVISI: Menggunakan data dinamis dan komponen baru */}
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <FooterLink item={item} key={item.name} />
                        ))}
                    </ul>
                </FooterColumn>

                {/* Kolom 3: Aplikasi Pusaka */}
                <FooterColumn title="Aplikasi Pusaka" className="md:col-span-1 lg:col-span-1">
                    {/* REVISI: Diubah menjadi flex-col dan items-center (tengah) */}
                    <div className="flex flex-col items-center text-center">
                        <motion.img
                            src={pusakaImgError ? pusakaFallbackUrl : pusakaImgUrl}
                            alt="Aplikasi Pusaka"
                            // REVISI: Logo APK dibuat lebih kecil (w-20 h-20)
                            className="w-20 h-20 object-contain mb-4 flex-shrink-0"
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            onError={() => setPusakaImgError(true)}
                        />
                        <div className="flex-1">
                            <p className="text-sm mb-5">
                                Download app Pusaka Kementerian Agama RI untuk semua layanan terpadu.
                            </p>
                            <motion.a
                                href="https://pusaka.kemenag.go.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                // REVISI: Tombol diubah menjadi Abu-abu/Putih sesuai permintaan
                                className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-200 text-gray-900 font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:bg-white hover:shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Download Pusaka
                            </motion.a>
                        </div>
                    </div>
                </FooterColumn>

                {/* Kolom 4: Lokasi */}
                {/* REVISI: Dibuat lebih lebar (lg:col-span-2) dan full width di tablet (md:col-span-2) */}
                <FooterColumn title="Lokasi Kami" className="md:col-span-2 lg:col-span-2">
                    {/* REVISI: Peta diberi min-height yang lebih konsisten */}
                    <div className="overflow-hidden rounded-lg shadow-lg relative h-64 md:h-full w-full" style={{ minHeight: '280px' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.0558925692662!2d98.65254641083142!3d3.574623396384521!2m3!1f0!2f0!3f0!3m2!1i1024!i768!4f13.1!3m3!1m2!1s0x30312fd6b7b01671%3A0xcbdb6eed71a91c8f!2sKementrian%20Agama%20Kota%2sMedan!5e0!3m2!1sid!2sid!4v1761851427267!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                    </div>
                </FooterColumn>
            </div>

            {/* Garis pemisah dan Copyright */}
            {/* REVISI: Dibuat sederhana dan text-center karena ikon sosial pindah */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center">
                <div className="text-xs text-gray-100">
                    &copy; {new Date().getFullYear()} Kemenag Kota Medan. All rights reserved.
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;

