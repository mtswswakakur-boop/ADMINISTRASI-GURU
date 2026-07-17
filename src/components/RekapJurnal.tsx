/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Printer, FileText, Edit } from 'lucide-react';
import { JurnalMengajar, Guru, Kelas } from '../types';
import { MAPEL_LIST } from '../data';

interface RekapJurnalProps {
  jurnal: JurnalMengajar[];
  guru: Guru[];
  kelas: Kelas[];
  onEditJurnal: (id: string, data: Partial<JurnalMengajar>) => void;
}

export default function RekapJurnal({ jurnal, guru, kelas, onEditJurnal }: RekapJurnalProps) {
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedGuruId, setSelectedGuruId] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [editingJurnal, setEditingJurnal] = useState<JurnalMengajar | null>(null);

  const [materiInput, setMateriInput] = useState('');
  const [metodeInput, setMetodeInput] = useState('');

  const [printMode, setPrintMode] = useState(false);

  // Apply filter parameters
  const filteredJurnal = jurnal.filter(j => {
    const matchesMapel = !selectedMapel || j.mapel === selectedMapel;
    const matchesKelas = !selectedKelasId || j.kelasId === selectedKelasId;
    const matchesGuru = !selectedGuruId || j.guruId === selectedGuruId;
    const matchesTanggal = !selectedTanggal || j.tanggal === selectedTanggal;
    return matchesMapel && matchesKelas && matchesGuru && matchesTanggal;
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJurnal) return;

    onEditJurnal(editingJurnal.id, {
      materi: materiInput,
      metode: metodeInput
    });

    setEditingJurnal(null);
    setMateriInput('');
    setMetodeInput('');
    alert('Jurnal mengajar berhasil diperbarui!');
  };

  const handleExportWord = () => {
    // Generate an elegant, beautifully structured Word / Text format download
    let docContent = "LAPORAN REKAPITULASI JURNAL MENGAJAR GURU\\n";
    docContent += "=========================================\\n\\n";
    filteredJurnal.forEach((j, i) => {
      const teacher = guru.find(g => g.id === j.guruId);
      docContent += `${i + 1}. TANGGAL   : ${j.hari}, ${j.tanggal}\\n`;
      docContent += `   GURU      : ${teacher?.nama || j.guruId}\\n`;
      docContent += `   MAPEL     : ${j.mapel}\\n`;
      docContent += `   KELAS     : ${j.kelasId}\\n`;
      docContent += `   MATERI    : ${j.materi}\\n`;
      docContent += `   METODE    : ${j.metode}\\n`;
      docContent += "-----------------------------------------\\n";
    });

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Rekap_Jurnal_Mengajar.txt");
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
          <h2 className="text-xl font-bold uppercase tracking-wide">Rekapitulasi Jurnal Mengajar Harian Guru</h2>
          <h3 className="text-sm font-semibold uppercase text-slate-600 mt-1">Madrasah Tsanawiyah Al-Ikhlas</h3>
          <div className="w-full border-b-2 border-slate-900 my-4"></div>
        </div>

        <table className="w-full text-left border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-4 py-2">No</th>
              <th className="border border-slate-400 px-4 py-2">Hari, Tanggal</th>
              <th className="border border-slate-400 px-4 py-2">Nama Guru</th>
              <th className="border border-slate-400 px-4 py-2">Mata Pelajaran</th>
              <th className="border border-slate-400 px-4 py-2 text-center">Kelas</th>
              <th className="border border-slate-400 px-4 py-2">Materi Pokok</th>
              <th className="border border-slate-400 px-4 py-2">Metode / Media</th>
            </tr>
          </thead>
          <tbody>
            {filteredJurnal.map((j, index) => {
              const teacher = guru.find(g => g.id === j.guruId);
              return (
                <tr key={j.id}>
                  <td className="border border-slate-400 px-4 py-2 font-mono">{index + 1}</td>
                  <td className="border border-slate-400 px-4 py-2 whitespace-nowrap">{j.hari}, {j.tanggal}</td>
                  <td className="border border-slate-400 px-4 py-2 font-bold">{teacher?.nama || j.guruId}</td>
                  <td className="border border-slate-400 px-4 py-2">{j.mapel}</td>
                  <td className="border border-slate-400 px-4 py-2 text-center font-semibold">{j.kelasId}</td>
                  <td className="border border-slate-400 px-4 py-2">{j.materi}</td>
                  <td className="border border-slate-400 px-4 py-2">{j.metode}</td>
                </tr>
              );
            })}
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
          <BookOpen className="text-emerald-600 h-6 w-6" />
          <h2 className="text-lg font-bold text-slate-900 font-sans">Rekapitulasi Jurnal Mengajar Guru</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportWord}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200"
          >
            <FileText className="h-3.5 w-3.5" />
            Export Word
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

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Mata Pelajaran</label>
          <select
            value={selectedMapel}
            onChange={e => setSelectedMapel(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="">-- Semua Mapel --</option>
            {MAPEL_LIST.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Kelas</label>
          <select
            value={selectedKelasId}
            onChange={e => setSelectedKelasId(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
          >
            <option value="">-- Semua Kelas --</option>
            {kelas.map(k => (
              <option key={k.id} value={k.id}>{k.namaKelas}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Guru Pengajar</label>
          <select
            value={selectedGuruId}
            onChange={e => setSelectedGuruId(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="">-- Semua Guru --</option>
            {guru.map(g => (
              <option key={g.id} value={g.id}>{g.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal</label>
          <input
            type="date"
            value={selectedTanggal}
            onChange={e => setSelectedTanggal(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">Hari, Tanggal</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Guru Pengampu</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Mapel</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">Kelas</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Materi Pokok</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filteredJurnal.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 text-sm">
                  Tidak ada rekaman jurnal yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              [...filteredJurnal].reverse().map((j, index) => {
                const teacherObj = guru.find(g => g.id === j.guruId);
                return (
                  <tr key={j.id} className="hover:bg-slate-50/50 transition-all align-middle">
                    <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 text-xs">{j.hari}, {j.tanggal}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{teacherObj?.nama || j.guruId}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{j.mapel}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{j.kelasId}</td>
                    <td className="px-4 py-3 font-medium text-slate-700 text-xs">
                      <div><strong className="text-slate-900">Materi:</strong> {j.materi}</div>
                      <div className="mt-1"><strong className="text-slate-900">Metode:</strong> {j.metode}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setEditingJurnal(j);
                          setMateriInput(j.materi);
                          setMetodeInput(j.metode);
                        }}
                        className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all mx-auto cursor-pointer"
                        title="Edit Jurnal"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Jurnal Overlay */}
      {editingJurnal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-md w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Edit Jurnal Guru</h3>
              <button
                onClick={() => {
                  setEditingJurnal(null);
                  setMateriInput('');
                  setMetodeInput('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Materi Pokok / Bahasan</label>
                <textarea
                  required
                  rows={3}
                  value={materiInput}
                  onChange={e => setMateriInput(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Metode / Media Pembelajaran</label>
                <input
                  type="text"
                  required
                  value={metodeInput}
                  onChange={e => setMetodeInput(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
              >
                Simpan Perubahan Jurnal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple X component inside Riwayat as helper
function X({ className, ...props }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
