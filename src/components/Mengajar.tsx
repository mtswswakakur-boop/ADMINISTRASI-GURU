/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookText, Search, Save, BookOpen } from 'lucide-react';
import { MengajarMapel, Guru, Kelas } from '../types';
import { MAPEL_LIST } from '../data';

interface MengajarProps {
  mengajarList: MengajarMapel[];
  guru: Guru[];
  kelas: Kelas[];
  onSaveMengajar: (data: MengajarMapel[]) => void;
}

export default function Mengajar({ mengajarList, guru, kelas, onSaveMengajar }: MengajarProps) {
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX' | ''>('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state to keep track of changes before committing
  const [localAssignments, setLocalAssignments] = useState<{ [mapel: string]: string }>({});

  const filteredKelasList = kelas.filter(k => !selectedTingkat || k.tingkat === selectedTingkat);

  const handleClassChange = (kelasId: string) => {
    setSelectedKelasId(kelasId);
    if (!kelasId) {
      setLocalAssignments({});
      return;
    }

    // Load existing teaching assignments for this class
    const assignments: { [mapel: string]: string } = {};
    MAPEL_LIST.forEach(mapel => {
      const match = mengajarList.find(m => m.kelasId === kelasId && m.mapel === mapel);
      assignments[mapel] = match ? match.guruId : '';
    });
    setLocalAssignments(assignments);
  };

  const handleTeacherChange = (mapel: string, teacherId: string) => {
    setLocalAssignments(prev => ({ ...prev, [mapel]: teacherId }));
  };

  const handleSave = () => {
    if (!selectedKelasId) return;

    // Map local assignments back to MengajarMapel format
    const updatedList: MengajarMapel[] = MAPEL_LIST.map((mapel, index) => ({
      id: `M-${selectedKelasId}-${index}`,
      tingkat: (kelas.find(k => k.id === selectedKelasId)?.tingkat || 'VII') as any,
      kelasId: selectedKelasId,
      mapel,
      guruId: localAssignments[mapel] || ''
    }));

    // Pass up to state manager
    onSaveMengajar(updatedList);
    alert('Jadwal Pembagian Mengajar Kelas berhasil disimpan!');
  };

  // Filter mapel list based on search term
  const filteredMapelList = MAPEL_LIST.filter(m =>
    m.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (localAssignments[m] && (guru.find(g => g.id === localAssignments[m])?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <BookText className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">Pembagian Tugas Mengajar Guru</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Tingkat</label>
          <select
            value={selectedTingkat}
            onChange={e => {
              setSelectedTingkat(e.target.value as any);
              setSelectedKelasId('');
              setLocalAssignments({});
            }}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
          >
            <option value="">-- Semua Tingkat --</option>
            <option value="VII">Tingkat VII</option>
            <option value="VIII">Tingkat VIII</option>
            <option value="IX">Tingkat IX</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Kelas</label>
          <select
            value={selectedKelasId}
            onChange={e => handleClassChange(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
          >
            <option value="">-- Pilih Kelas --</option>
            {filteredKelasList.map(k => (
              <option key={k.id} value={k.id}>{k.namaKelas} (Wali: {guru.find(g => g.id === k.waliKelasId)?.nama || k.waliKelasId})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Cari Mapel / Guru</label>
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari mata pelajaran / nama guru..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-full"
            />
          </div>
        </div>
      </div>

      {!selectedKelasId ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-600">Pilih Kelas Terlebih Dahulu</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Silakan pilih tingkat dan kelas untuk memetakan tugas mengajar dari masing-masing 15 mata pelajaran resmi madrasah.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-55 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pemetaan Mengajar Kelas: <strong className="text-emerald-700">{selectedKelasId}</strong>
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Pembagian Mengajar
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-1/3">Mata Pelajaran</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Guru Pengampu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredMapelList.map((mapel, index) => {
                  const currentTeacherId = localAssignments[mapel] || '';
                  return (
                    <tr key={mapel} className="hover:bg-slate-50/50 transition-all align-middle">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{mapel}</td>
                      <td className="px-4 py-3">
                        <select
                          value={currentTeacherId}
                          onChange={e => handleTeacherChange(mapel, e.target.value)}
                          className="text-xs md:text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-full max-w-md font-medium text-slate-800"
                        >
                          <option value="">-- Belum Ada Pengajar --</option>
                          {guru.map(g => (
                            <option key={g.id} value={g.id}>{g.nama}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
