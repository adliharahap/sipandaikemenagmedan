"use client";

import { Provider } from "react-redux";
// 1. Import persistor dari store Anda
import { store, persistor } from "../store";
import AuthListener from "./AuthListener";
// 2. Import PersistGate
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

export default function ClientProvider({ children }) {
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("The width(-1) and height(-1) of chart should be greater than 0")
      ) return; // skip warning ini
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn; // restore pas unmount
    };
  }, []);

    useEffect(() => {
    const preventNegative = (e) => {
      if (e.target.type === "number" && e.target.value < 0) {
        e.target.value = 0;
      }
    };

    const preventMinusKey = (e) => {
      if (e.target.type === "number" && (e.key === "-" || e.key === "e")) {
        e.preventDefault();
      }
    };

    document.addEventListener("input", preventNegative);
    document.addEventListener("keydown", preventMinusKey);

    return () => {
      document.removeEventListener("input", preventNegative);
      document.removeEventListener("keydown", preventMinusKey);
    };
  }, []);


  return (
    <Provider store={store}>
      {/* 3. Bungkus AuthListener dengan PersistGate */}
      <PersistGate loading={null} persistor={persistor}>
        <AuthListener>{children}</AuthListener>
      </PersistGate>
    </Provider>
  );
}