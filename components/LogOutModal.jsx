
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  // Jangan render apapun jika modal tidak terbuka
  if (!isOpen) {
    return null;
  }

  return (
    // Latar belakang (backdrop) semi-transparan
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      onClick={onClose} // Menutup modal saat backdrop diklik
    >
      {/* Kontainer Modal */}
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto z-50 transform transition-all duration-300 ease-in-out scale-95 animate-modal-pop-in"
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat kontennya diklik
      >
        <div className="p-8 text-center">
          {/* Ikon Peringatan */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Judul dan Deskripsi */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
          <p className="text-gray-600 mb-8">
            Apakah Anda yakin ingin keluar dari sesi Anda?
          </p>
          
          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes modal-pop-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-pop-in {
          animation: modal-pop-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LogoutModal;
