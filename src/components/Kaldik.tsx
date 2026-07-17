/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Trash2, Plus, Info } from 'lucide-react';
import { KaldikEvent } from '../types';

interface KaldikProps {
  events: KaldikEvent[];
  onAddEvent: (event: KaldikEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export default function Kaldik({ events, onAddEvent, onDeleteEvent }: KaldikProps) {
  const [tanggal, setTanggal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tipe, setTipe] = useState<'Libur' | 'Ujian' | 'KBM' | 'Lainnya'>('KBM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !keterangan) return;

    onAddEvent({
      id: 'K-' + Date.now(),
      tanggal,
      keterangan,
      tipe
    });

    setTanggal('');
    setKeterangan('');
    setTipe('KBM');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <Calendar className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">Kalender Pendidikan Madrasah</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form add event */}
        <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 text-sm">
            <Plus className="h-4 w-4 text-emerald-600" />
            Tambah Agenda Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Kegiatan</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Agenda</label>
              <input
                type="text"
                required
                placeholder="Deskripsi kegiatan akademik"
                value={keterangan}
                onChange={e => setKeterangan(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Kategori Agenda</label>
              <select
                value={tipe}
                onChange={e => setTipe(e.target.value as any)}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="KBM">KBM (Kegiatan Belajar Mengajar)</option>
                <option value="Libur">Libur Sekolah/Nasional</option>
                <option value="Ujian">Evaluasi/Ujian Semester</option>
                <option value="Lainnya">Lainnya/Rapat Guru</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambahkan ke Kalender
            </button>
          </form>
        </div>

        {/* List of calendar events */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-100 text-slate-600 p-3 rounded-lg mb-4">
            <Info className="h-4 w-4 text-slate-400 shrink-0" />
            Agenda ini digunakan untuk mempermudah guru menjadwalkan alokasi waktu efektif dan jurnal harian.
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">Tanggal</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Keterangan Kegiatan</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-28">Kategori</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-16 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                      Belum ada agenda akademik terdaftar.
                    </td>
                  </tr>
                ) : (
                  [...events]
                    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
                    .map((ev, index) => {
                      let badgeColor = "bg-secondary/10 text-secondary border-secondary/20";
                      if (ev.tipe === 'Libur') badgeColor = "bg-rose-100 text-rose-800 border-rose-200/50";
                      else if (ev.tipe === 'KBM') badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200/50";
                      else if (ev.tipe === 'Ujian') badgeColor = "bg-amber-100 text-amber-800 border-amber-200/50";

                      return (
                        <tr key={ev.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{ev.tanggal}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{ev.keterangan}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                              {ev.tipe}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => onDeleteEvent(ev.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Hapus Agenda"
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
