import { signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Fungsi untuk menangani proses logout user
 * @param {Function} router - Router instance dari Next.js (useRouter)
 * @param {Function} setLoading - (Opsional) state setter untuk loading
 */
export async function handleLogout(router, setLoading) {
  try {
    if (setLoading) setLoading(true);

    await signOut(auth);

    // Hapus data session / local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect ke halaman login
    router.push("/login");

    console.log("✅ Logout berhasil");
  } catch (error) {
    console.error("❌ Gagal logout:", error.message);
    alert("Terjadi kesalahan saat logout. Coba lagi ya!");
  } finally {
    if (setLoading) setLoading(false);
  }
}
