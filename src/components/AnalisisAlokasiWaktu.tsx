/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, Search, Printer, Plus, Trash2 } from 'lucide-react';
import { AlokasiWaktu, Guru } from '../types';
import { MAPEL_LIST } from '../data';

interface AnalisisAlokasiWaktuProps {
  alokasi: AlokasiWaktu[];
  guru: Guru[];
  onAddAlokasi: (data: AlokasiWaktu) => void;
  onDeleteAlokasi: (id: string) => void;
}

export default function AnalisisAlokasiWaktu({ alokasi, guru, onAddAlokasi, onDeleteAlokasi }: AnalisisAlokasiWaktuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuru, setSelectedGuru] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [mingguEfektif, setMingguEfektif] = useState<number | ''>('');
  const [jamPerMinggu, setJamPerMinggu] = useState<number | ''>('');
  const [keterangan, setKeterangan] = useState('');
  const [printMode, setPrintMode] = useState(false);

  // Filter alokasi based on search term (teacher name)
  const filteredAlokasi = alokasi.filter(item => {
    const teacher = guru.find(g => g.id === item.guruId);
    const teacherName = teacher?.nama || '';
    return teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.mapel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuru || !selectedMapel || !mingguEfektif || !jamPerMinggu) return;

    const totalJam = Number(mingguEfektif) * Number(jamPerMinggu);

    onAddAlokasi({
      id: 'A-' + Date.now(),
      guruId: selectedGuru,
      mapel: selectedMapel,
      mingguEfektif: Number(mingguEfektif),
      jamPerMinggu: Number(jamPerMinggu),
      totalJam,
      keterangan: keterangan || 'Sesuai agenda Kaldik'
    });

    // Reset fields
    setSelectedMapel('');
    setMingguEfektif('');
    setJamPerMinggu('');
    setKeterangan('');
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
      <div className="bg-white p-8 absolute inset-0 z-50 text-slate-900 leading-normal animate-fade-in print-area">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wide">Analisis Alokasi Waktu Mengajar</h2>
          <h3 className="text-sm font-semibold uppercase text-slate-600 mt-1">Madrasah Tsanawiyah Al-Ikhlas</h3>
          <div className="w-full border-b-2 border-slate-900 my-4"></div>
        </div>

        <table className="w-full text-left border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase">No</th>
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase">Nama Guru</th>
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase">Mata Pelajaran</th>
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase text-center">Minggu Efektif</th>
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase text-center">Jam / Minggu</th>
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase text-center">Total JP</th>
              <th className="border border-slate-400 px-4 py-2 text-xs font-bold uppercase">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlokasi.map((item, index) => {
              const teacher = guru.find(g => g.id === item.guruId);
              return (
                <tr key={item.id}>
                  <td className="border border-slate-400 px-4 py-2 font-mono">{index + 1}</td>
                  <td className="border border-slate-400 px-4 py-2 font-bold">{teacher?.nama || item.guruId}</td>
                  <td className="border border-slate-400 px-4 py-2">{item.mapel}</td>
                  <td className="border border-slate-400 px-4 py-2 text-center">{item.mingguEfektif}</td>
                  <td className="border border-slate-400 px-4 py-2 text-center">{item.jamPerMinggu} JP</td>
                  <td className="border border-slate-400 px-4 py-2 text-center font-semibold">{item.totalJam} JP</td>
                  <td className="border border-slate-400 px-4 py-2">{item.keterangan}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between text-xs font-medium">
          <div>
            <p>Mengetahui,</p>
            <p className="mt-12 font-bold">H. Mochammad Hasan, M.Pd.I</p>
            <p className="text-slate-500">Kepala Madrasah</p>
          </div>
          <div className="text-right">
            <p>Jombang, 16 Juli 2026</p>
            <p className="mt-12 font-bold">Ahmad Fauzi, S.Pd.I</p>
            <p className="text-slate-500">Waka Kurikulum</p>
          </div>
        </div>

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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-emerald-600 h-6 w-6" />
            <h2 className="text-lg font-bold text-slate-900 font-sans">Analisis Alokasi Waktu Pembelajaran</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama guru / mapel..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-52"
              />
            </div>
            <button
              onClick={triggerPrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Cetak / PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form input */}
          <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-100 h-fit">
            <h3 className="font-bold text-slate-950 mb-4 text-sm flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-emerald-600" />
              Input Alokasi Waktu
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Guru Pengajar</label>
                <select
                  required
                  value={selectedGuru}
                  onChange={e => setSelectedGuru(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">-- Pilih Guru --</option>
                  {guru.map(g => (
                    <option key={g.id} value={g.id}>{g.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Mata Pelajaran</label>
                <select
                  required
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Minggu Efektif</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="52"
                    placeholder="e.g. 18"
                    value={mingguEfektif}
                    onChange={e => setMingguEfektif(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Jam / Minggu (JP)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    placeholder="e.g. 2"
                    value={jamPerMinggu}
                    onChange={e => setJamPerMinggu(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Sesuai agenda kaldik"
                  value={keterangan}
                  onChange={e => setKeterangan(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Simpan Alokasi Waktu
              </button>
            </form>
          </div>

          {/* Table list */}
          <div className="lg:col-span-8 overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Guru</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Mata Pelajaran</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">Mg. Efektif</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">Jam/Mg</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">Total JP</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredAlokasi.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 text-sm">
                      Tidak ada alokasi mengajar ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredAlokasi.map((item, index) => {
                    const teacherObj = guru.find(g => g.id === item.guruId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-950">{teacherObj?.nama || item.guruId}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{item.mapel}</td>
                        <td className="px-4 py-3 text-center text-slate-600 font-medium">{item.mingguEfektif}</td>
                        <td className="px-4 py-3 text-center text-slate-600 font-semibold">{item.jamPerMinggu} JP</td>
                        <td className="px-4 py-3 text-center text-slate-900 font-bold bg-slate-50/50">{item.totalJam} JP</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => onDeleteAlokasi(item.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
