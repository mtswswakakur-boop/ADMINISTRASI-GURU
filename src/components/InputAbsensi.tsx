/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClipboardCheck, Save, Calendar } from 'lucide-react';
import { Siswa, Kelas, Absensi, JurnalMengajar } from '../types';
import { MAPEL_LIST } from '../data';

interface InputAbsensiProps {
  siswa: Siswa[];
  kelas: Kelas[];
  currentUser: any;
  onSaveAbsensiAndJurnal: (absList: Absensi[], jur: JurnalMengajar) => void;
}

export default function InputAbsensi({ siswa, kelas, currentUser, onSaveAbsensiAndJurnal }: InputAbsensiProps) {
  const [hari, setHari] = useState('Senin');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  // Jurnal details associated with this lesson block
  const [materi, setMateri] = useState('');
  const [metode, setMetode] = useState('');

  // State mapping student NISN to attendance status
  const [statuses, setStatuses] = useState<{ [nisn: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' }>({});

  const filteredKelasList = kelas.filter(k => k.tingkat === selectedTingkat);
  const classStudents = siswa.filter(s => s.kelasId === selectedKelasId && s.status !== 'Mutasi Keluar');

  const handleKelasChange = (kelasId: string) => {
    setSelectedKelasId(kelasId);
    // Initialize standard status to Hadir for all students in the newly selected class
    const initialStatuses: { [nisn: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' } = {};
    siswa.filter(s => s.kelasId === kelasId && s.status !== 'Mutasi Keluar').forEach(s => {
      initialStatuses[s.nisn] = 'Hadir';
    });
    setStatuses(initialStatuses);
  };

  const handleStatusChange = (nisn: string, stat: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setStatuses(prev => ({ ...prev, [nisn]: stat }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKelasId || !selectedMapel || !materi || !metode) {
      alert('Mohon isi seluruh data absensi, mata pelajaran, materi, dan metode!');
      return;
    }

    const dateObj = new Date(tanggal);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bulan = months[dateObj.getMonth()];
    const tahun = dateObj.getFullYear().toString();

    // Map status states to Absensi entries
    const absList: Absensi[] = classStudents.map((s, idx) => ({
      id: `A-${selectedKelasId}-${s.nisn}-${tanggal}-${idx}`,
      tanggal,
      hari,
      bulan,
      tahun,
      kelasId: selectedKelasId,
      nisn: s.nisn,
      nama: s.nama,
      status: statuses[s.nisn] || 'Hadir'
    }));

    // Create a Jurnal entry automatically alongside attendance
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

    onSaveAbsensiAndJurnal(absList, jurnalEntry);
    alert('Berhasil menyimpan presensi siswa dan jurnal mengajar sekaligus!');

    // Reset journal section
    setMateri('');
    setMetode('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 font-sans">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <ClipboardCheck className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">Input Absensi Harian & Jurnal Mengajar</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Hari</label>
            <select
              value={hari}
              onChange={e => setHari(e.target.value)}
              className="w-full text-xs md:text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold text-slate-800"
            >
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal</label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="w-full text-xs md:text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat</label>
            <select
              value={selectedTingkat}
              onChange={e => {
                setSelectedTingkat(e.target.value as any);
                setSelectedKelasId('');
              }}
              className="w-full text-xs md:text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="VII">VII</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Kelas</label>
            <select
              required
              value={selectedKelasId}
              onChange={e => handleKelasChange(e.target.value)}
              className="w-full text-xs md:text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-slate-800"
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
              className="w-full text-xs md:text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-slate-800"
            >
              <option value="">-- Pilih Mapel --</option>
              {MAPEL_LIST.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedKelasId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/20 p-4 rounded-xl border border-slate-100 animate-fade-in">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Materi Pembelajaran / Bahasan Pokok</label>
              <textarea
                required
                rows={2}
                placeholder="Contoh: Mengidentifikasi hukum tajwid pada QS Al-Fatihah..."
                value={materi}
                onChange={e => setMateri(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              ></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Metode / Media Pembelajaran</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ceramah, Diskusi Kelompok, LCD Proyektor..."
                value={metode}
                onChange={e => setMetode(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden h-10 mt-1 font-medium"
              />
            </div>
          </div>
        )}

        {selectedKelasId ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar Presensi Kelas: <strong className="text-emerald-700">{selectedKelasId}</strong>
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Simpan Presensi & Jurnal
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                    <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">NISN</th>
                    <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Siswa</th>
                    <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-80">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                        Tidak ada siswa aktif terdaftar di kelas ini.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((s, index) => (
                      <tr key={s.nisn} className="hover:bg-slate-50/50 transition-all align-middle">
                        <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3 font-mono text-slate-700 text-xs">{s.nisn}</td>
                        <td className="px-4 py-3 font-bold text-slate-950">{s.nama}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-3 md:gap-4">
                            {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map(stat => (
                              <label key={stat} className="flex items-center gap-1 text-xs font-bold cursor-pointer">
                                <input
                                  type="radio"
                                  name={`status-${s.nisn}`}
                                  checked={statuses[s.nisn] === stat}
                                  onChange={() => handleStatusChange(s.nisn, stat)}
                                  className={`h-4 w-4 border-slate-300 focus:outline-hidden ${
                                    stat === 'Hadir' ? 'text-emerald-600 focus:ring-emerald-500' :
                                    stat === 'Izin' ? 'text-blue-600 focus:ring-blue-500' :
                                    stat === 'Sakit' ? 'text-amber-600 focus:ring-amber-500' : 'text-rose-600 focus:ring-rose-500'
                                  }`}
                                />
                                <span className={
                                  statuses[s.nisn] === stat
                                    ? stat === 'Hadir' ? 'text-emerald-700 font-extrabold' :
                                      stat === 'Izin' ? 'text-blue-700 font-extrabold' :
                                      stat === 'Sakit' ? 'text-amber-700 font-extrabold' : 'text-rose-700 font-extrabold'
                                    : 'text-slate-500 font-semibold hover:text-slate-800'
                                }>
                                  {stat}
                                </span>
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-600 font-sans">Pilih Kelas Pembelajaran</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Silakan pilih tingkat, kelas, dan mata pelajaran di atas untuk memulai mengisi daftar presensi siswa dan jurnal harian Anda.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
