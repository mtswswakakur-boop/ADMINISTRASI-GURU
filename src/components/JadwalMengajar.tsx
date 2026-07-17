/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Calendar, Plus, Trash2, Edit2, Clock, Printer, BookOpen, User, Layers, Check, X } from 'lucide-react';
import { Guru, Kelas, JadwalMengajar } from '../types';
import { MAPEL_LIST } from '../data';

interface JadwalProps {
  jadwalList: JadwalMengajar[];
  guruList: Guru[];
  kelasList: Kelas[];
  isAdmin: boolean;
  onSaveJadwal: (list: JadwalMengajar[]) => void;
  currentUserId?: string;
}

export default function JadwalMengajarComponent({
  jadwalList,
  guruList,
  kelasList,
  isAdmin,
  onSaveJadwal,
  currentUserId
}: JadwalProps) {
  const days: Array<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'> = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  const hours = [1, 2, 3, 4, 5, 6, 7, 8];

  // Filters state
  const [selectedKelasId, setSelectedKelasId] = useState<string>(kelasList[0]?.id || '');
  const [selectedGuruId, setSelectedGuruId] = useState<string>(!isAdmin ? currentUserId || '' : '');
  const [viewType, setViewType] = useState<'kelas' | 'guru'>('kelas');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JadwalMengajar | null>(null);

  const [formHari, setFormHari] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Senin');
  const [formJamKe, setFormJamKe] = useState<number>(1);
  const [formKelasId, setFormKelasId] = useState<string>(kelasList[0]?.id || '');
  const [formMapel, setFormMapel] = useState<string>(MAPEL_LIST[0] || '');
  const [formGuruId, setFormGuruId] = useState<string>(guruList.filter(g => g.role !== 'Admin')[0]?.id || '');

  const openAddModal = () => {
    setEditingItem(null);
    setFormHari('Senin');
    setFormJamKe(1);
    if (viewType === 'kelas') setFormKelasId(selectedKelasId);
    else if (guruList.some(g => g.id === selectedGuruId)) setFormGuruId(selectedGuruId);
    setIsModalOpen(true);
  };

  const openEditModal = (item: JadwalMengajar) => {
    setEditingItem(item);
    setFormHari(item.hari);
    setFormJamKe(item.jamKe);
    setFormKelasId(item.kelasId);
    setFormMapel(item.mapel);
    setFormGuruId(item.guruId);
    setIsModalOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    // Check for schedule conflict (same day, same jam, same class OR same day, same jam, same teacher)
    const hasConflict = jadwalList.some(item => {
      if (editingItem && item.id === editingItem.id) return false;

      const isSameSlot = item.hari === formHari && item.jamKe === formJamKe;
      if (!isSameSlot) return false;

      const classConflict = item.kelasId === formKelasId;
      const teacherConflict = item.guruId === formGuruId;

      return classConflict || teacherConflict;
    });

    if (hasConflict) {
      alert('Peringatan Konflik Jadwal!\nKelas atau Guru sudah dijadwalkan mengajar pada Hari dan Jam Ke yang sama.');
      return;
    }

    if (editingItem) {
      // Edit mode
      const updated = jadwalList.map(j => j.id === editingItem.id ? {
        ...j,
        hari: formHari,
        jamKe: formJamKe,
        kelasId: formKelasId,
        mapel: formMapel,
        guruId: formGuruId
      } : j);
      onSaveJadwal(updated);
    } else {
      // Add mode
      const newItem: JadwalMengajar = {
        id: `jdw_${Date.now()}`,
        hari: formHari,
        jamKe: formJamKe,
        kelasId: formKelasId,
        mapel: formMapel,
        guruId: formGuruId
      };
      onSaveJadwal([...jadwalList, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal mengajar ini?')) {
      onSaveJadwal(jadwalList.filter(j => j.id !== id));
    }
  };

  // Filter schedules based on selection
  const filteredJadwal = jadwalList.filter(j => {
    if (viewType === 'kelas') {
      return j.kelasId === selectedKelasId;
    } else {
      return j.guruId === selectedGuruId;
    }
  });

  // Get item for specific cell
  const getCellItem = (day: string, hour: number) => {
    return filteredJadwal.find(j => j.hari === day && j.jamKe === hour);
  };

  // Export schedules CSV
  const handleExportCSV = () => {
    const headers = ['Hari', 'Jam Ke', 'Kelas', 'Mata Pelajaran', 'Guru Pengampu'];
    const rows = jadwalList.map(j => {
      const guruObj = guruList.find(g => g.id === j.guruId);
      return [j.hari, j.jamKe, j.kelasId, j.mapel, guruObj?.nama || j.guruId];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Jadwal_Mengajar_MTs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-150 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-600" />
            Sistem Jadwal Mengajar Guru
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Atur dan pantau kalender pembagian jam mengajar madrasah</p>
        </div>

        <div className="flex gap-2 mt-3 md:mt-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200"
          >
            <Printer className="h-3.5 w-3.5" /> Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm"
            >
              <Plus className="h-4 w-4" /> Tambah Jadwal
            </button>
          )}
        </div>
      </div>

      {/* Control selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle view type */}
        <div className="flex gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => {
              setViewType('kelas');
              setSelectedKelasId(kelasList[0]?.id || '');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              viewType === 'kelas' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Layers className="h-3.5 w-3.5 inline-block mr-1" />
            Berdasarkan Kelas
          </button>
          <button
            onClick={() => {
              setViewType('guru');
              if (isAdmin) setSelectedGuruId(guruList.filter(g => g.role !== 'Admin')[0]?.id || '');
              else setSelectedGuruId(currentUserId || '');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              viewType === 'guru' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <User className="h-3.5 w-3.5 inline-block mr-1" />
            Berdasarkan Guru
          </button>
        </div>

        {/* Dynamic Filters */}
        <div className="flex items-center gap-3">
          {viewType === 'kelas' ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Pilih Kelas:</span>
              <select
                value={selectedKelasId}
                onChange={e => setSelectedKelasId(e.target.value)}
                className="bg-slate-50 font-semibold"
              >
                {kelasList.map(k => (
                  <option key={k.id} value={k.id}>{k.namaKelas}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Pilih Guru:</span>
              <select
                value={selectedGuruId}
                disabled={!isAdmin}
                onChange={e => setSelectedGuruId(e.target.value)}
                className="bg-slate-50 font-semibold disabled:opacity-80"
              >
                {guruList.filter(g => g.role !== 'Admin').map(g => (
                  <option key={g.id} value={g.id}>{g.nama}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Table/Grid */}
      <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-150 font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>
            {viewType === 'kelas' ? `Jadwal Mengajar Kelas: ${selectedKelasId}` : `Jadwal Mengajar Guru: ${guruList.find(g => g.id === selectedGuruId)?.nama || selectedGuruId}`}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            TA 2026/2027 Ganjil
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-20 text-center border-r border-slate-200">Jam Ke</th>
                {days.map(day => (
                  <th key={day} className="text-center w-40">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour} className="hover:bg-slate-50/20">
                  <td className="text-center py-4 font-mono font-bold text-slate-700 bg-slate-50 border-r border-b border-slate-200">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="h-3 w-3 text-slate-400 mb-0.5" />
                      <span>{hour}</span>
                    </div>
                  </td>
                  {days.map(day => {
                    const item = getCellItem(day, hour);
                    const guruObj = item ? guruList.find(g => g.id === item.guruId) : null;

                    return (
                      <td key={day} className="border-b border-r border-slate-150 p-2 text-center min-h-[70px] align-middle relative group">
                        {item ? (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 space-y-1 text-center transition-all hover:bg-emerald-100/50">
                            <p className="text-xs font-bold text-slate-900 leading-snug">{item.mapel}</p>
                            {viewType === 'kelas' ? (
                              <p className="text-[10px] text-slate-500 font-medium truncate" title={guruObj?.nama || item.guruId}>
                                {guruObj?.nama.split(',')[0] || item.guruId}
                              </p>
                            ) : (
                              <p className="text-[10px] font-bold text-emerald-800 font-mono">
                                Kelas {item.kelasId}
                              </p>
                            )}

                            {isAdmin && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="p-1 bg-white hover:bg-emerald-50 text-emerald-600 rounded-md border border-slate-200 cursor-pointer shadow-xs"
                                  title="Edit"
                                >
                                  <Edit2 className="h-2.5 w-2.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1 bg-white hover:bg-rose-50 text-rose-600 rounded-md border border-slate-200 cursor-pointer shadow-xs"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 font-medium font-sans text-xs italic">- Kosong -</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-emerald-600" />
                {editingItem ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                    Hari
                  </label>
                  <select
                    value={formHari}
                    onChange={e => setFormHari(e.target.value as any)}
                    className="w-full bg-slate-50 font-semibold"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                    Jam Ke
                  </label>
                  <select
                    value={formJamKe}
                    onChange={e => setFormJamKe(Number(e.target.value))}
                    className="w-full bg-slate-50 font-semibold"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>Jam ke-{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                  Kelas
                </label>
                <select
                  value={formKelasId}
                  onChange={e => setFormKelasId(e.target.value)}
                  className="w-full bg-slate-50 font-semibold"
                >
                  {kelasList.map(k => (
                    <option key={k.id} value={k.id}>{k.namaKelas}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={formMapel}
                  onChange={e => setFormMapel(e.target.value)}
                  className="w-full bg-slate-50 font-semibold"
                >
                  {MAPEL_LIST.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                  Guru Pengampu
                </label>
                <select
                  value={formGuruId}
                  onChange={e => setFormGuruId(e.target.value)}
                  className="w-full bg-slate-50 font-semibold"
                >
                  {guruList.filter(g => g.role !== 'Admin').map(g => (
                    <option key={g.id} value={g.id}>{g.nama}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
