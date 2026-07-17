/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, UserPlus, Upload, Search, X, Edit2, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { Siswa, Kelas } from '../types';

interface DaftarSiswaProps {
  siswa: Siswa[];
  kelas: Kelas[];
  onAddSiswa: (data: Siswa) => void;
  onEditSiswa: (nisn: string, data: Partial<Siswa>) => void;
  onDeleteSiswa: (nisn: string) => void;
  onMutasiKeluar: (nisn: string, keterangan: string, tanggal: string) => void;
}

export default function DaftarSiswa({
  siswa,
  kelas,
  onAddSiswa,
  onEditSiswa,
  onDeleteSiswa,
  onMutasiKeluar
}: DaftarSiswaProps) {
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX' | ''>('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [mutatingSiswa, setMutatingSiswa] = useState<Siswa | null>(null);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

  // Form states
  const [nisn, setNisn] = useState('');
  const [nama, setNama] = useState('');
  const [tingkatInput, setTingkatInput] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [kelasInput, setKelasInput] = useState('');
  const [isMutasiMasuk, setIsMutasiMasuk] = useState(false);
  const [keteranganMutasi, setKeteranganMutasi] = useState('');

  // Mutasi Keluar Form states
  const [ketKeluar, setKetKeluar] = useState('');
  const [tglKeluar, setTglKeluar] = useState('');

  // CSV Import state
  const [importText, setImportText] = useState('');

  const filteredKelasList = kelas.filter(k => !selectedTingkat || k.tingkat === selectedTingkat);
  const formKelasList = kelas.filter(k => k.tingkat === tingkatInput);

  // Filter students based on selection
  const activeSiswa = siswa.filter(s => s.status !== 'Mutasi Keluar');
  const filteredSiswa = activeSiswa.filter(s => {
    const matchesTingkat = !selectedTingkat || s.tingkat === selectedTingkat;
    const matchesKelas = !selectedKelasId || s.kelasId === selectedKelasId;
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nisn.includes(searchTerm);
    return matchesTingkat && matchesKelas && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn || !nama || !kelasInput) return;

    onAddSiswa({
      nisn: nisn.trim(),
      nama: nama.trim(),
      tingkat: tingkatInput,
      kelasId: kelasInput,
      status: isMutasiMasuk ? 'Mutasi Masuk' : 'Aktif',
      keteranganMutasi: isMutasiMasuk ? keteranganMutasi || 'Pindahan masuk' : undefined,
      tanggalMutasi: isMutasiMasuk ? new Date().toISOString().split('T')[0] : undefined
    });

    // Reset
    setNisn('');
    setNama('');
    setKelasInput('');
    setIsMutasiMasuk(false);
    setKeteranganMutasi('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSiswa) return;

    onEditSiswa(editingSiswa.nisn, {
      nama: editingSiswa.nama,
      kelasId: editingSiswa.kelasId,
      tingkat: editingSiswa.tingkat
    });

    setEditingSiswa(null);
  };

  const handleMutasiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutatingSiswa || !ketKeluar || !tglKeluar) return;

    onMutasiKeluar(mutatingSiswa.nisn, ketKeluar, tglKeluar);
    setMutatingSiswa(null);
    setKetKeluar('');
    setTglKeluar('');
    alert('Siswa berhasil dimutasi keluar!');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim() || !selectedKelasId) return;

    const rows = importText.trim().split('\n');
    let count = 0;
    const currentTingkat = (kelas.find(k => k.id === selectedKelasId)?.tingkat || 'VII') as any;

    rows.forEach(row => {
      const parts = row.split(/[\t,]/);
      if (parts.length >= 2) {
        const sNisn = parts[0].trim();
        const sNama = parts[1].trim();

        if (sNisn && sNama) {
          onAddSiswa({
            nisn: sNisn,
            nama: sNama,
            tingkat: currentTingkat,
            kelasId: selectedKelasId,
            status: 'Aktif'
          });
          count++;
        }
      }
    });

    alert(`Berhasil mengimpor ${count} siswa aktif ke kelas ${selectedKelasId}!`);
    setImportText('');
    setShowImportModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-emerald-600 h-6 w-6" />
          <h2 className="text-lg font-bold text-slate-900 font-sans">Daftar Siswa Madrasah (Siswa Aktif)</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (!selectedKelasId) {
                alert('Silakan pilih kelas terlebih dahulu pada filter untuk mengimpor siswa!');
                return;
              }
              setShowImportModal(true);
            }}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200"
          >
            <Upload className="h-3.5 w-3.5" />
            Import Siswa
          </button>
          <button
            onClick={() => {
              setTingkatInput(selectedTingkat || 'VII');
              setKelasInput(selectedKelasId || '');
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Tingkat</label>
          <select
            value={selectedTingkat}
            onChange={e => {
              setSelectedTingkat(e.target.value as any);
              setSelectedKelasId('');
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
          <label className="text-xs font-semibold text-slate-600 block mb-1">Cari Nama / NISN</label>
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-full"
            />
          </div>
        </div>
      </div>

      {!selectedKelasId ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-600">Pilih Kelas Terlebih Dahulu</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Silakan pilih tingkat dan kelas dari menu filter untuk melihat, mengedit, menghapus, atau memproses mutasi siswa.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">NISN</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36 text-center">Status</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-44 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                      Tidak ada siswa ditemukan di kelas ini.
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((s, index) => (
                    <tr key={s.nisn} className="hover:bg-slate-50/50 transition-all align-middle">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-xs">{s.nisn}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">{s.nama}</span>
                        {s.keteranganMutasi && (
                          <span className="text-[10px] text-slate-500 italic block mt-0.5">
                            * {s.keteranganMutasi}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${
                          s.status === 'Mutasi Masuk'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingSiswa(s)}
                            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setMutatingSiswa(s)}
                            className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer border border-amber-200"
                            title="Proses Mutasi Keluar"
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                            Mutasi
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data siswa ${s.nama}?`)) {
                                onDeleteSiswa(s.nisn);
                              }
                            }}
                            className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-md transition-all cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tambah Siswa Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-md w-full p-6 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Tambah Siswa Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">NISN Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="10-digit nomor NISN"
                  value={nisn}
                  onChange={e => setNisn(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdurrahman"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat</label>
                  <select
                    value={tingkatInput}
                    onChange={e => {
                      setTingkatInput(e.target.value as any);
                      setKelasInput('');
                    }}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
                    value={kelasInput}
                    onChange={e => setKelasInput(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {formKelasList.map(k => (
                      <option key={k.id} value={k.id}>{k.namaKelas}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMutasiMasuk}
                    onChange={e => setIsMutasiMasuk(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">Siswa Mutasi Masuk (Pindahan)?</span>
                </label>

                {isMutasiMasuk && (
                  <div className="mt-3 animate-fade-in">
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Keterangan / Asal Sekolah</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pindahan dari MTsN 1 Surabaya"
                      value={keteranganMutasi}
                      onChange={e => setKeteranganMutasi(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
              >
                Simpan Siswa Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Siswa Modal */}
      {editingSiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-sm w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Edit Data Siswa</h3>
              <button onClick={() => setEditingSiswa(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingSiswa.nama}
                  onChange={e => setEditingSiswa({ ...editingSiswa, nama: e.target.value })}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat</label>
                  <select
                    value={editingSiswa.tingkat}
                    onChange={e => setEditingSiswa({ ...editingSiswa, tingkat: e.target.value as any })}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Kelas</label>
                  <select
                    value={editingSiswa.kelasId}
                    onChange={e => setEditingSiswa({ ...editingSiswa, kelasId: e.target.value })}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {kelas.filter(k => k.tingkat === editingSiswa.tingkat).map(k => (
                      <option key={k.id} value={k.id}>{k.namaKelas}</option>
                    ))}
                  </select>
                </div>
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

      {/* Mutasi Keluar Modal */}
      {mutatingSiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-sm w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Proses Mutasi Siswa Keluar</h3>
              <button onClick={() => setMutatingSiswa(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Siswa <strong className="text-slate-900">{mutatingSiswa.nama}</strong> ({mutatingSiswa.nisn}) akan diubah statusnya menjadi Mutasi Keluar dan dipindahkan ke log riwayat siswa.
            </p>
            <form onSubmit={handleMutasiSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Alasan Mutasi Keluar</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ikut orang tua pindah ke Jakarta"
                  value={ketKeluar}
                  onChange={e => setKetKeluar(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Mutasi</label>
                <input
                  type="date"
                  required
                  value={tglKeluar}
                  onChange={e => setTglKeluar(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
              >
                Konfirmasi Mutasi Keluar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Import Siswa Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-md w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Import Siswa ke Kelas {selectedKelasId}</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                <span className="text-xs font-bold text-slate-700 block mb-1">Format Template:</span>
                <code className="text-[10px] font-mono block bg-slate-900 text-white p-2 rounded">
                  NISN	Nama_Siswa
                </code>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  Gunakan pemisah Tab atau Koma. Contoh:<br />
                  <span className="font-mono">0011223388,Muhammad Rafi Sastra</span>
                </p>
              </div>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tempelkan Baris Data Siswa</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tempelkan di sini..."
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
                >
                  Import Sekarang
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
