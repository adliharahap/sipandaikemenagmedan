"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../utils/firebase";
import { collection, doc, getCountFromServer, getDoc, getDocs, query, serverTimestamp, setDoc, where, writeBatch } from "firebase/firestore";



export default function AuthListener({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // disini nanti tempat ambil semua data pertama kali 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          let userData;
          let isNewUser = false;

          if (!docSnap.exists()) {
            // 🆕 User baru → simpan ke Firestore
            isNewUser = true;
            userData = {
              uid: currentUser.uid,
              name: currentUser.displayName || "Unknown User",
              email: currentUser.email || "Unknown Email",
              photoURL:
                currentUser.photoURL ||
                `https://placehold.co/150x150/22c55e/FFFFFF?text=${encodeURIComponent(
                  currentUser.displayName || "Kemenag"
                )}`,
              role: "user",
              status: "not verified",
              registeredAt: serverTimestamp(),
            };

            await setDoc(userRef, userData);
          } else {
            userData = docSnap.data();
          }

          const serializableUserData = {
            ...userData,
            registeredAt: userData.registeredAt?.toDate
              ? userData.registeredAt.toDate().toISOString()
              : new Date().toISOString(),
          };

          dispatch(setUser(serializableUserData));

          // ⚙️ Langsung redirect jika belum verified ATAU user baru
          if (isNewUser || userData.status !== "verified") {
            router.replace("/");
            return;
          }

        } else {
          dispatch(clearUser());
          // router.replace("/login");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Selesai cek auth
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  return children;
}
