"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * Komponen LoadingScreen yang akan tampil fullscreen
 * saat data sedang diambil.
 */
export default function MemuatData() {
  const { theme } = useTheme();

  // Menentukan warna berdasarkan tema (disamakan dengan Kependudukan.jsx)
  const bgColor = theme === 'dark' ? '#210F37' : '#E4EFE7'; // Latar belakang
  const textColor = theme === 'dark' ? '#f5d0fe' : '#581c87'; // Teks (Pink muda / Ungu tua)
  // Warna untuk animasi 'bola'
  const ballColor = theme === 'dark' ? '#f472b6' : '#db2777'; // Pink (terang/gelap)

  // --- Varian untuk animasi 3 bola ---
  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.15, // Jarak animasi antar bola
      },
    },
    end: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const loadingBallVariants = {
    start: {
      y: "0%", // Posisi awal
    },
    end: {
      y: "-100%", // Posisi lompat (ke atas)
    },
  };

  const loadingBallTransition = {
    duration: 0.4,
    repeat: Infinity, // Loop tak terbatas
    repeatType: "reverse", // Lompat naik-turun (0% -> -100% -> 0%)
    ease: "easeInOut",
  };
  // --- Akhir Varian ---

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Animasi fade-out saat komponen keluar (exit)
      transition={{ duration: 0.3 }}
    >
      {/* Logo Kemenag (animasi pulse/scale seperti sebelumnya) */}
      <motion.img
        src="/logo3.png" // Path diubah sesuai permintaan Anda
        alt="Logo Kemenag"
        className="w-20 h-20 object-contain relative z-10"
        animate={{
          scale: [1, 1.05, 1], // Animasi pulse lembut pada logo
        }}
        transition={{
          loop: Infinity,
          duration: 2.5,
          ease: "easeInOut",
        }}
      />

      {/* Teks animasi (Fade in/out loop) */}
      <motion.p
        className="text-lg font-semibold mt-8 tracking-wide"
        style={{ color: textColor }}
        animate={{
          opacity: [1, 0.4, 1], // Animasi fade in/out
        }}
        transition={{
          loop: Infinity,
          duration: 2.0, // Durasi loop 2 detik
          ease: "easeInOut",
        }}
      >
        Memuat data...
      </motion.p>
      
      {/* Animasi 3 Bola Lompat */}
      <motion.div
        className="flex gap-2 mt-6 h-3" // Beri tinggi agar bola bisa lompat 'ke atas'
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: ballColor }}
          variants={loadingBallVariants}
          transition={loadingBallTransition}
        />
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: ballColor }}
          variants={loadingBallVariants}
          transition={loadingBallTransition}
        />
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: ballColor }}
          variants={loadingBallVariants}
          transition={loadingBallTransition}
        />
      </motion.div>
    </motion.div>
  );
}

