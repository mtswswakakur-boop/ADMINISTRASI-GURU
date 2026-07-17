/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Plus, Edit, X } from 'lucide-react';
import { Kelas, Guru } from '../types';

interface DaftarKelasProps {
  kelas: Kelas[];
  guru: Guru[];
  onAddKelas: (data: Kelas) => void;
  onEditKelas: (id: string, data: Partial<Kelas>) => void;
}

export default function DaftarKelas({ kelas, guru, onAddKelas, onEditKelas }: DaftarKelasProps) {
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);

  // Form states
  const [tingkatInput, setTingkatInput] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [jenisInput, setJenisInput] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'>('A');
  const [waliKelasId, setWaliKelasId] = useState('');
  const [jumlahSiswa, setJumlahSiswa] = useState<number | ''>('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waliKelasId) return;

    const namaKelas = `${tingkatInput}-${jenisInput}`;
    
    // Check if class already exists
    if (kelas.some(k => k.namaKelas === namaKelas)) {
      alert(`Kelas ${namaKelas} sudah ada!`);
      return;
    }

    onAddKelas({
      id: namaKelas,
      namaKelas,
      tingkat: tingkatInput,
      jenisKelas: jenisInput,
      waliKelasId,
      jumlahSiswa: Number(jumlahSiswa) || 0
    });

    setWaliKelasId('');
    setJumlahSiswa('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKelas) return;

    onEditKelas(editingKelas.id, {
      waliKelasId: editingKelas.waliKelasId,
      jumlahSiswa: Number(editingKelas.jumlahSiswa) || 0
    });

    setEditingKelas(null);
  };

  const filteredKelas = kelas.filter(k => k.tingkat === selectedTingkat);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Layers className="text-emerald-600 h-6 w-6" />
          <h2 className="text-lg font-bold text-slate-900 font-sans">Daftar Kelas Madrasah</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Kelas
        </button>
      </div>

      {/* Tabs to select Tingkat */}
      <div className="flex border-b border-slate-100 mb-6">
        {(['VII', 'VIII', 'IX'] as const).map(tingkat => (
          <button
            key={tingkat}
            onClick={() => setSelectedTingkat(tingkat)}
            className={`px-4 py-2.5 font-bold text-sm transition-all border-b-2 -mb-px cursor-pointer ${
              selectedTingkat === tingkat
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tingkat {tingkat}
          </button>
        ))}
      </div>

      {/* Table displays classes based on selected Tingkat */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Kelas</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center">Jumlah Siswa</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Wali Kelas</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Tingkat</th>
              <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-24 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filteredKelas.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 text-sm">
                  Belum ada kelas terdaftar pada Tingkat {selectedTingkat}.
                </td>
              </tr>
            ) : (
              filteredKelas.map((k, index) => {
                const wali = guru.find(g => g.id === k.waliKelasId);
                return (
                  <tr key={k.id} className="hover:bg-slate-50/50 transition-all align-middle">
                    <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{k.namaKelas}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">{k.jumlahSiswa} Siswa</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{wali?.nama || k.waliKelasId}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                        {k.tingkat}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingKelas(k)}
                        className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-md transition-all flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Tambah Kelas Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-sm w-full p-6 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Tambah Kelas Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat</label>
                  <select
                    value={tingkatInput}
                    onChange={e => setTingkatInput(e.target.value as any)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Jenis Kelas</label>
                  <select
                    value={jenisInput}
                    onChange={e => setJenisInput(e.target.value as any)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(char => (
                      <option key={char} value={char}>{char}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Wali Kelas</label>
                <select
                  required
                  value={waliKelasId}
                  onChange={e => setWaliKelasId(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">-- Pilih Wali Kelas --</option>
                  {guru.map(g => (
                    <option key={g.id} value={g.id}>{g.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Siswa Awal</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={jumlahSiswa}
                  onChange={e => setJumlahSiswa(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
              >
                Buat Kelas Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Kelas Modal */}
      {editingKelas && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-sm w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Edit Kelas: {editingKelas.namaKelas}</h3>
              <button onClick={() => setEditingKelas(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Wali Kelas</label>
                <select
                  required
                  value={editingKelas.waliKelasId}
                  onChange={e => setEditingKelas({ ...editingKelas, waliKelasId: e.target.value })}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {guru.map(g => (
                    <option key={g.id} value={g.id}>{g.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Siswa</label>
                <input
                  type="number"
                  required
                  value={editingKelas.jumlahSiswa}
                  onChange={e => setEditingKelas({ ...editingKelas, jumlahSiswa: Number(e.target.value) })}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
