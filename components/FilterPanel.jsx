import React from "react";

export default function FilterPanel({
    isVisible,
    onClose,
    onApply,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    month,
    year,
    onMonthChange,
    onYearChange
}) {

    // Handler untuk input tanggal
    const handleDateInputChange = (value, type) => {
        // Saat salah satu input tanggal diisi, kosongkan field bulan dan tahun
        onMonthChange('');
        onYearChange('');

        // Panggil handler asli dari parent component
        if (type === 'start') {
            onStartDateChange(value);
        } else {
            onEndDateChange(value);
        }
    };

    // Handler untuk select bulan/tahun
    const handleSelectChange = (value, type) => {
        // Saat salah satu select diubah, kosongkan field rentang tanggal
        onStartDateChange('');
        onEndDateChange('');
        
        // Panggil handler asli dari parent component
        if (type === 'month') {
            onMonthChange(value);
        } else {
            onYearChange(value);
        }
    };

    return (
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="border border-gray-200 rounded-lg p-4 mt-2">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Tanggal</label>
                        <div className="flex items-center gap-2">
                            {/* Gunakan handler baru */}
                            <input type="date" value={startDate} onChange={(e) => handleDateInputChange(e.target.value, 'start')} className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-500 text-sm"/>
                            <span className="text-gray-500">-</span>
                            <input type="date" value={endDate} onChange={(e) => handleDateInputChange(e.target.value, 'end')} className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-500 text-sm"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Spesifik Bulan & Tahun</label>
                        <div className="flex items-center gap-2">
                            {/* Gunakan handler baru */}
                            <select value={month} onChange={(e) => handleSelectChange(e.target.value, 'month')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-500 text-sm">
                                <option value="">Bulan</option>
                                {[...Array(12)].map((_, i) => <option key={i} value={i+1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>)}
                            </select>
                            <select value={year} onChange={(e) => handleSelectChange(e.target.value, 'year')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-500 text-sm">
                                <option value="">Tahun</option>
                                {[...Array(5)].map((_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">Batal</button>
                        <button onClick={onApply} className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300">Terapkan Filter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
