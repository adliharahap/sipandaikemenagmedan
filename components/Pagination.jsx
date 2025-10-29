import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./SvgComponent/Icons";

export default function Pagination({ currentPage, totalPages, onNext, onPrev }) {
    return (
        <div className="flex items-center space-x-2">
            <button onClick={onPrev} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-5 w-5" /></button>
            <span className="text-sm text-gray-700">Halaman {currentPage} dari {totalPages}</span>
            <button onClick={onNext} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon className="h-5 w-5" /></button>
        </div>
    )
}
