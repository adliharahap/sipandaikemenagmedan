import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ClientProvider from "../../components/ClientProvider";

const poppins = localFont({
  src: [
    { path: "../../public/fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Poppins-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Poppins-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Poppins-Bold.ttf", weight: "700" },
  ],
  variable: "--font-poppins",
});

// --- SEO METADATA ---
const siteUrl = 'https://sipandaikemenagmedan.vercel.app';
const title = "SIPANDAI (Sistem Penyajian Data Keagamaan Interaktif)";
const description = "SIPANDAI adalah dashboard digital Kemenag Kota Medan untuk data keagamaan yang akurat dan interaktif. Akses info demografi, tren, dan layanan dengan cepat untuk mendukung transparansi publik dan pengambilan kebijakan.";

export const metadata = {
  // metadataBase diperlukan agar Open Graph URL (og:url) berfungsi dengan benar
  metadataBase: new URL(siteUrl),

  // Title (Judul Tab Browser)
  title: {
    default: title,
    template: `%s | SIPANDAI Kemenag Medan`, // %s akan diganti dengan judul dari halaman anak
  },
  
  // Deskripsi
  description: description,

  // Nama Aplikasi
  applicationName: title,

  // --- DIHAPUS: viewport dipindahkan ke generateViewport ---
  // viewport: "width=device-width, initial-scale=1",

  // --- Penambahan untuk PWA dan Tampilan Mobile ---
  manifest: '/manifest.json', // Tetap di sini
  // --- DIHAPUS: themeColor dipindahkan ke generateViewport ---
  // themeColor: [ ... ],
  // ---------------------------------------------

  // --- INI UNTUK LOGO DI HEAD ---
  icons: {
    icon: "/logo3.png", 
    apple: "/logo3.png", 
  },
  // -----------------------------

  // --- Penambahan URL Kanonis ---
  alternates: {
    canonical: '/',
  },
  // -----------------------------

  // Keywords untuk SEO
  keywords: ['SIPANDAI', 'Kemenag', 'Medan', 'Data Keagamaan', 'Dashboard Interaktif', 'Kementerian Agama', 'Statistik Keagamaan'],
  
  // Author & Publisher (Publisher penting untuk organisasi)
  authors: [{ name: 'Kemenag Kota Medan', url: siteUrl }],
  publisher: 'Kementerian Agama Kota Medan',
  
  // Open Graph (Untuk sharing ke Facebook, WA, dll)
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: 'SIPANDAI Kemenag Medan',
    images: [
      {
        url: '/logo3.png', 
        width: 1200,
        height: 630,
        alt: 'Dashboard SIPANDAI Kemenag Medan',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  
  // Twitter Card (Untuk sharing ke X / Twitter)
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [`${siteUrl}/logo3.png`], 
    // creator: '@kemenagmedan', // Ganti dengan handle Twitter Anda (jika ada)
  },
  
  // Aturan untuk robot (crawler) mesin pencari
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};
// --- AKHIR SEO METADATA ---

// --- FUNGSI BARU UNTUK VIEWPORT & THEME COLOR ---
export async function generateViewport() {
  return {
    // Viewport
    viewport: "width=device-width, initial-scale=1",
    
    // Warna tema untuk address bar browser di mobile
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
      { media: '(prefers-color-scheme: dark)', color: '#210F37' },
    ],
  };
}
// --- AKHIR FUNGSI BARU ---


export default function RootLayout({ children }) {
  // --- Penambahan JSON-LD (Structured Data) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'SIPANDAI - Kemenag Kota Medan',
    'alternateName': 'Sistem Penyajian Data Keagamaan Interaktif',
    'url': siteUrl,
    'logo': `${siteUrl}/logo3.png`, // URL absolut ke logo Anda
    'description': description,
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Public Relations',
      // GANTI INI: Masukkan email dan telepon yang valid
      'email': 'humas@kemenagmedan.go.id', // (Contoh) Ganti dengan email resmi
      'telephone': '+62-61-XXXXXX' // (Contoh) Ganti dengan telepon resmi
    }
  };
  // --- Akhir JSON-LD ---

  return (
    <html lang="id" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        {/* --- Penambahan Script JSON-LD --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* --- Akhir Script --- */}

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          <ClientProvider>
            {children}
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

