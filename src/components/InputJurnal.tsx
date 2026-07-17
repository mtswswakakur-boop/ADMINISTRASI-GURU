/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Save, Calendar } from 'lucide-react';
import { JurnalMengajar, Kelas, MengajarMapel } from '../types';
import { MAPEL_LIST } from '../data';

interface InputJurnalProps {
  kelas: Kelas[];
  currentUser: any;
  mengajar: MengajarMapel[];
  onSaveJurnal: (data: JurnalMengajar) => void;
}

export default function InputJurnal({ kelas, currentUser, mengajar, onSaveJurnal }: InputJurnalProps) {
  const getIndonesianDayName = (dateString: string): string => {
    if (!dateString) return 'Senin';
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  const initialDate = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(initialDate);
  const [hari, setHari] = useState(getIndonesianDayName(initialDate));
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [materi, setMateri] = useState('');
  const [metode, setMetode] = useState('');

  // Filter mapel based on what is taught by the logged-in user
  const allowedMapels = currentUser && currentUser.role !== 'Admin'
    ? Array.from(new Set(mengajar.filter(m => m.guruId === currentUser.id).map(m => m.mapel)))
    : MAPEL_LIST;

  const filteredKelasList = kelas.filter(k => k.tingkat === selectedTingkat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKelasId || !selectedMapel || !materi || !metode) return;

    if (hari === 'Jumat') {
      alert('Maaf, hari Jumat adalah hari libur/non-efektif. Silakan pilih hari efektif (Sabtu - Kamis).');
      return;
    }

    const dateObj = new Date(tanggal);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bulan = months[dateObj.getMonth()];
    const tahun = dateObj.getFullYear().toString();

    const jurnalEntry: JurnalMengajar = {
      id: `J-${selectedKelasId}-${tanggal}-${Date.now()}`,
      tanggal,
      hari,
      kelasId: selectedKelasId,
      mapel: selectedMapel,
      guruId: currentUser.id,
      materi,
      metode
    };

    onSaveJurnal(jurnalEntry);
    alert('Jurnal mengajar mandiri berhasil disimpan!');

    // Reset fields
    setMateri('');
    setMetode('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 font-sans">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <BookOpen className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">Isi Jurnal Mengajar Mandiri</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Hari</label>
            <input
              type="text"
              readOnly
              value={hari}
              className="w-full text-sm bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-bold focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Kegiatan</label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={e => {
                const newDate = e.target.value;
                setTanggal(newDate);
                const dayName = getIndonesianDayName(newDate);
                setHari(dayName);
              }}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800 font-semibold"
            />
            {hari === 'Jumat' && (
              <div className="text-[10px] text-rose-600 font-bold mt-1">
                ⚠️ Hari Jumat adalah hari libur (Non-Efektif)!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat Kelas</label>
            <select
              value={selectedTingkat}
              onChange={e => {
                setSelectedTingkat(e.target.value as any);
                setSelectedKelasId('');
              }}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
            >
              <option value="VII">VII</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Kelas Belajar</label>
            <select
              required
              value={selectedKelasId}
              onChange={e => setSelectedKelasId(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-slate-800"
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
              required
              value={selectedMapel}
              onChange={e => setSelectedMapel(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-slate-800"
            >
              <option value="">-- Pilih Mapel --</option>
              {allowedMapels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {allowedMapels.length === 0 && currentUser.role !== 'Admin' && (
              <p className="text-[10px] text-amber-600 font-semibold mt-1">
                Anda tidak memiliki jadwal mengajar terdaftar.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Materi Pokok / Pokok Bahasan Pembelajaran</label>
            <textarea
              required
              rows={4}
              placeholder="Contoh: Pembahasan Bab 3 tentang Aljabar Linier dan Pemecahan Masalah Matematika Kontekstual..."
              value={materi}
              onChange={e => setMateri(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Metode & Media Pembelajaran</label>
            <input
              type="text"
              required
              placeholder="Contoh: Tanya Jawab Interaktif, Presentasi PPT, Quiz Kahoot..."
              value={metode}
              onChange={e => setMetode(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
        >
          <Save className="h-4 w-4" />
          Simpan Jurnal Mengajar Mandiri
        </button>
      </form>
    </div>
  );
}
