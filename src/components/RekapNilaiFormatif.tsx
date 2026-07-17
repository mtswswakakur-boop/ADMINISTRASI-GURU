/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, FileSpreadsheet, Printer, RotateCcw } from 'lucide-react';
import { NilaiFormatif, Siswa, Kelas } from '../types';
import { MAPEL_LIST } from '../data';

interface RekapNilaiFormatifProps {
  nilaiFormatif: NilaiFormatif[];
  siswa: Siswa[];
  kelas: Kelas[];
  tahunAjaran: string;
}

export default function RekapNilaiFormatif({ nilaiFormatif, siswa, kelas, tahunAjaran }: RekapNilaiFormatifProps) {
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX' | ''>('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  // Applied filters to trigger upon "Terapkan Filter"
  const [appliedTingkat, setAppliedTingkat] = useState<'VII' | 'VIII' | 'IX' | ''>('');
  const [appliedKelasId, setAppliedKelasId] = useState('');
  const [appliedMapel, setAppliedMapel] = useState('');

  const [printMode, setPrintMode] = useState(false);

  const filteredKelasList = kelas.filter(k => !selectedTingkat || k.tingkat === selectedTingkat);

  // Filter students based on applied filters
  const activeStudents = siswa.filter(s => s.status !== 'Mutasi Keluar');
  const classStudents = activeStudents.filter(s => {
    const matchesTingkat = !appliedTingkat || s.tingkat === appliedTingkat;
    const matchesKelas = !appliedKelasId || s.kelasId === appliedKelasId;
    return matchesTingkat && matchesKelas;
  });

  const handleApply = () => {
    setAppliedTingkat(selectedTingkat);
    setAppliedKelasId(selectedKelasId);
    setAppliedMapel(selectedMapel);
  };

  const handleReset = () => {
    setSelectedTingkat('');
    setSelectedKelasId('');
    setSelectedMapel('');
    setAppliedTingkat('');
    setAppliedKelasId('');
    setAppliedMapel('');
  };

  const getFormatifValue = (studentNisn: string, field: 'uh1' | 'uh2' | 'uh3' | 'uh4' | 'uh5' | 'uh6') => {
    if (!appliedMapel) return '-';
    const match = nilaiFormatif.find(n => n.nisn === studentNisn && n.mapel === appliedMapel);
    return match && match[field] !== '' ? match[field] : '-';
  };

  const handleExportExcel = () => {
    if (!appliedKelasId || !appliedMapel) return;
    const headers = ['No', 'NISN', 'Nama Siswa', 'UH 1', 'UH 2', 'UH 3', 'UH 4', 'UH 5', 'UH 6'];
    const rows = classStudents.map((s, i) => [
      i + 1,
      s.nisn,
      s.nama,
      getFormatifValue(s.nisn, 'uh1'),
      getFormatifValue(s.nisn, 'uh2'),
      getFormatifValue(s.nisn, 'uh3'),
      getFormatifValue(s.nisn, 'uh4'),
      getFormatifValue(s.nisn, 'uh5'),
      getFormatifValue(s.nisn, 'uh6')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Nilai_Formatif_${appliedKelasId}_${appliedMapel}.csv`);
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
          <h2 className="text-xl font-bold uppercase tracking-wide">Rekapitulasi Nilai Formatif Siswa (UH)</h2>
          <h3 className="text-sm font-semibold uppercase text-slate-600 mt-1">
            Kelas: {appliedKelasId} • Mapel: {appliedMapel} • TA: {tahunAjaran}
          </h3>
          <div className="w-full border-b-2 border-slate-900 my-4"></div>
        </div>

        <table className="w-full text-left border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-4 py-2">No</th>
              <th className="border border-slate-400 px-4 py-2">NISN</th>
              <th className="border border-slate-400 px-4 py-2">Nama Siswa</th>
              <th className="border border-slate-400 px-4 py-2 text-center">UH 1</th>
              <th className="border border-slate-400 px-4 py-2 text-center">UH 2</th>
              <th className="border border-slate-400 px-4 py-2 text-center">UH 3</th>
              <th className="border border-slate-400 px-4 py-2 text-center">UH 4</th>
              <th className="border border-slate-400 px-4 py-2 text-center">UH 5</th>
              <th className="border border-slate-400 px-4 py-2 text-center">UH 6</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map((s, index) => (
              <tr key={s.nisn}>
                <td className="border border-slate-400 px-4 py-2 font-mono">{index + 1}</td>
                <td className="border border-slate-400 px-4 py-2">{s.nisn}</td>
                <td className="border border-slate-400 px-4 py-2 font-bold">{s.nama}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{getFormatifValue(s.nisn, 'uh1')}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{getFormatifValue(s.nisn, 'uh2')}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{getFormatifValue(s.nisn, 'uh3')}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{getFormatifValue(s.nisn, 'uh4')}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{getFormatifValue(s.nisn, 'uh5')}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{getFormatifValue(s.nisn, 'uh6')}</td>
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Award className="text-emerald-600 h-6 w-6" />
          <h2 className="text-lg font-bold text-slate-900 font-sans">Rekapitulasi Nilai Formatif (Harian/UH)</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            disabled={!appliedKelasId || !appliedMapel}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Excel
          </button>
          <button
            onClick={triggerPrint}
            disabled={!appliedKelasId || !appliedMapel}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Cetak Preview
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat</label>
          <select
            value={selectedTingkat}
            onChange={e => {
              setSelectedTingkat(e.target.value as any);
              setSelectedKelasId('');
            }}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="">-- Semua Tingkat --</option>
            <option value="VII">Tingkat VII</option>
            <option value="VIII">Tingkat VIII</option>
            <option value="IX">Tingkat IX</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Kelas</label>
          <select
            value={selectedKelasId}
            onChange={e => setSelectedKelasId(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
          >
            <option value="">-- Pilih Kelas --</option>
            {filteredKelasList.map(k => (
              <option key={k.id} value={k.id}>{k.namaKelas}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Mata Pelajaran</label>
          <select
            value={selectedMapel}
            onChange={e => setSelectedMapel(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="">-- Pilih Mapel --</option>
            {MAPEL_LIST.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all h-9 cursor-pointer shadow-2xs"
          >
            Terapkan Filter
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all h-9 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!appliedKelasId || !appliedMapel ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-600">Saring & Terapkan Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Silakan tentukan kelas dan mata pelajaran lalu klik <strong>Terapkan Filter</strong> untuk merangkum daftar nilai formatif (Ulangan Harian).
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-50 pb-2">
            Nilai Formatif Kelas: <span className="text-emerald-700">{appliedKelasId}</span> • Mata Pelajaran: <span className="text-emerald-700">{appliedMapel}</span>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">NISN</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Lengkap Siswa</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16 bg-slate-50/50">UH 1</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16 bg-slate-50/50">UH 2</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16 bg-slate-50/50">UH 3</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16 bg-slate-50/50">UH 4</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16 bg-slate-50/50">UH 5</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16 bg-slate-50/50">UH 6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">
                      Tidak ada siswa ditemukan di kelas ini.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((s, index) => (
                    <tr key={s.nisn} className="hover:bg-slate-50/50 transition-all align-middle">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-xs">{s.nisn}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.nama}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800 bg-slate-50/30">{getFormatifValue(s.nisn, 'uh1')}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800 bg-slate-50/30">{getFormatifValue(s.nisn, 'uh2')}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800 bg-slate-50/30">{getFormatifValue(s.nisn, 'uh3')}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800 bg-slate-50/30">{getFormatifValue(s.nisn, 'uh4')}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800 bg-slate-50/30">{getFormatifValue(s.nisn, 'uh5')}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800 bg-slate-50/30">{getFormatifValue(s.nisn, 'uh6')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
