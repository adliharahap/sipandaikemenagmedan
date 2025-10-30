"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { fetchLandingPageData } from "../store/dataSlice";
import MemuatData from "./MemuatData";

export default function AuthListener({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const landingStatus = useSelector((state) => state.landingData.status);

  useEffect(() => {
    if (landingStatus === 'idle') {
      dispatch(fetchLandingPageData());
    }
  }, [dispatch, landingStatus]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          let userData;
          let isNewUser = false;

          if (!docSnap.exists()) {
            isNewUser = true;
            userData = {
              uid: currentUser.uid,
              name: currentUser.displayName || "Unknown User",
              email: currentUser.email || "Unknown Email",
              photoURL:
                currentUser.photoURL ||
                `https://placehold.co/150x150/22c55e/FFFFFF?text=${encodeURIComponent(
                  currentUser.displayName || "User"
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

          if (isNewUser || userData.status !== "verified") {
            router.replace("/");
            return;
          }
        } else {
          dispatch(clearUser());
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  if (landingStatus === "loading" || landingStatus === "idle") {
    return (
      <MemuatData />
    );
  }

  return children;
}