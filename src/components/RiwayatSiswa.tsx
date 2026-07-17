/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, RefreshCcw, Printer, FileSpreadsheet } from 'lucide-react';
import { Siswa } from '../types';

interface RiwayatSiswaProps {
  riwayat: Siswa[]; // logs of mutasi
  onBatalMutasi: (nisn: string, status: 'Mutasi Masuk' | 'Mutasi Keluar') => void;
}

export default function RiwayatSiswa({ riwayat, onBatalMutasi }: RiwayatSiswaProps) {
  const [filterType, setFilterType] = useState<'Mutasi Masuk' | 'Mutasi Keluar'>('Mutasi Masuk');
  const [printMode, setPrintMode] = useState(false);

  const filteredRiwayat = riwayat.filter(r => r.status === filterType);

  const handleExportExcel = () => {
    // Elegant client-side CSV downloader as Excel fallback
    const headers = ['No', 'NISN', 'Nama Siswa', 'Kelas', 'Tipe Mutasi', 'Tanggal', 'Keterangan'];
    const rows = filteredRiwayat.map((r, i) => [
      i + 1,
      r.nisn,
      r.nama,
      r.kelasId,
      r.status,
      r.tanggalMutasi || '-',
      r.keteranganMutasi || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Riwayat_${filterType.replace(' ', '_')}_MTs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  if (printMode) {
    return (
      <div className="bg-white p-8 absolute inset-0 z-50 text-slate-900 animate-fade-in print-area">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wide">Riwayat {filterType} Siswa</h2>
          <h3 className="text-sm font-semibold uppercase text-slate-600 mt-1">Madrasah Tsanawiyah Al-Ikhlas</h3>
          <div className="w-full border-b-2 border-slate-900 my-4"></div>
        </div>

        <table className="w-full text-left border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-4 py-2">No</th>
              <th className="border border-slate-400 px-4 py-2">NISN</th>
              <th className="border border-slate-400 px-4 py-2">Nama Siswa</th>
              <th className="border border-slate-400 px-4 py-2 text-center">Kelas</th>
              <th className="border border-slate-400 px-4 py-2 text-center">Tanggal</th>
              <th className="border border-slate-400 px-4 py-2">Keterangan / Alasan</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiwayat.map((r, index) => (
              <tr key={r.nisn}>
                <td className="border border-slate-400 px-4 py-2 font-mono">{index + 1}</td>
                <td className="border border-slate-400 px-4 py-2">{r.nisn}</td>
                <td className="border border-slate-400 px-4 py-2 font-bold">{r.nama}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{r.kelasId}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{r.tanggalMutasi || '-'}</td>
                <td className="border border-slate-400 px-4 py-2">{r.keteranganMutasi || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => setPrintMode(false)}
          className="mt-8 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm print:hidden cursor-pointer"
        >
          Kembali ke Aplikasi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <History className="text-emerald-600 h-6 w-6" />
          <h2 className="text-lg font-bold text-slate-900 font-sans">Riwayat & Log Mutasi Siswa</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Excel
          </button>
          <button
            onClick={triggerPrint}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Cetak Preview
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterType('Mutasi Masuk')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border cursor-pointer ${
            filterType === 'Mutasi Masuk'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ArrowDownLeft className="h-4 w-4 text-blue-600" />
          Log Mutasi Masuk (Pindahan Masuk)
        </button>
        <button
          onClick={() => setFilterType('Mutasi Keluar')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border cursor-pointer ${
            filterType === 'Mutasi Keluar'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ArrowUpRight className="h-4 w-4 text-amber-600" />
          Log Mutasi Keluar (Keluar/Pindah)
        </button>
      </div>

      {/* Table Log */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">NISN</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Siswa</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">Kelas</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-36">Tanggal Mutasi</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Keterangan / Alasan</th>
              {filterType === 'Mutasi Keluar' && (
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-32 text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filteredRiwayat.length === 0 ? (
              <tr>
                <td colSpan={filterType === 'Mutasi Keluar' ? 7 : 6} className="text-center py-8 text-slate-400 text-sm">
                  Tidak ada riwayat {filterType.toLowerCase()} tercatat.
                </td>
              </tr>
            ) : (
              filteredRiwayat.map((r, index) => (
                <tr key={r.nisn} className="hover:bg-slate-50/50 transition-all align-middle">
                  <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-xs">{r.nisn}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{r.nama}</td>
                  <td className="px-4 py-3 text-center font-medium text-slate-700">{r.kelasId}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-600">{r.tanggalMutasi || '-'}</td>
                  <td className="px-4 py-3 font-medium text-slate-600 text-xs">{r.keteranganMutasi || '-'}</td>
                  {filterType === 'Mutasi Keluar' && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Batalkan mutasi untuk ${r.nama} dan kembalikan ke siswa aktif?`)) {
                            onBatalMutasi(r.nisn, 'Mutasi Keluar');
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all mx-auto cursor-pointer"
                      >
                        <RefreshCcw className="h-3 w-3" />
                        Batal Mutasi
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
