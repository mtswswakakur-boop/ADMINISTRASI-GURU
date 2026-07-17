/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, UserPlus, Upload, Printer, X, Eye, EyeOff, Save, Download } from 'lucide-react';
import { Guru } from '../types';

interface DaftarGuruProps {
  guru: Guru[];
  onAddGuru: (data: Guru) => void;
  onEditGuru: (id: string, data: Partial<Guru>) => void;
  onDeleteGuru: (id: string) => void;
}

export default function DaftarGuru({ guru, onAddGuru, onEditGuru, onDeleteGuru }: DaftarGuruProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [nama, setNama] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Guru' | 'Wali Kelas'>('Guru');
  const [fotoUrl, setFotoUrl] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const [importText, setImportText] = useState('');
  const [printMode, setPrintMode] = useState(false);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !nama || !password) return;

    onAddGuru({
      id: username.trim().toLowerCase(),
      nuptk,
      nama,
      tahunMasuk,
      password,
      role,
      fotoUrl: fotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    });

    // Reset
    setUsername('');
    setNuptk('');
    setNama('');
    setTahunMasuk('');
    setPassword('');
    setRole('Guru');
    setFotoUrl('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuru) return;

    onEditGuru(editingGuru.id, {
      nuptk: editingGuru.nuptk,
      nama: editingGuru.nama,
      tahunMasuk: editingGuru.tahunMasuk,
      password: editingGuru.password,
      role: editingGuru.role,
      fotoUrl: editingGuru.fotoUrl
    });

    setEditingGuru(null);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    // Split rows and parse tab-separated or comma-separated template values
    const rows = importText.trim().split('\n');
    let importedCount = 0;

    rows.forEach(row => {
      const parts = row.split(/[\t,]/);
      if (parts.length >= 5) {
        const uName = parts[0].trim().toLowerCase();
        const gNuptk = parts[1].trim();
        const gNama = parts[2].trim();
        const gTahun = parts[3].trim();
        const gPass = parts[4].trim();
        const gRole = (parts[5]?.trim() as any) || 'Guru';

        if (uName && gNama && gPass) {
          onAddGuru({
            id: uName,
            nuptk: gNuptk,
            nama: gNama,
            tahunMasuk: gTahun,
            password: gPass,
            role: gRole,
            fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
          });
          importedCount++;
        }
      }
    });

    alert(`Berhasil mengimpor ${importedCount} data guru!`);
    setImportText('');
    setShowImportModal(false);
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
          <h2 className="text-xl font-bold uppercase tracking-wide">Daftar Guru & Staff Madrasah</h2>
          <h3 className="text-sm font-semibold uppercase text-slate-600 mt-1">Madrasah Tsanawiyah Al-Ikhlas</h3>
          <div className="w-full border-b-2 border-slate-900 my-4"></div>
        </div>

        <table className="w-full text-left border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-4 py-2">No</th>
              <th className="border border-slate-400 px-4 py-2">NUPTK</th>
              <th className="border border-slate-400 px-4 py-2">Nama Lengkap</th>
              <th className="border border-slate-400 px-4 py-2">Tahun Masuk</th>
              <th className="border border-slate-400 px-4 py-2">Jabatan / Role</th>
            </tr>
          </thead>
          <tbody>
            {guru.map((g, index) => (
              <tr key={g.id}>
                <td className="border border-slate-400 px-4 py-2 font-mono">{index + 1}</td>
                <td className="border border-slate-400 px-4 py-2">{g.nuptk || '-'}</td>
                <td className="border border-slate-400 px-4 py-2 font-bold">{g.nama}</td>
                <td className="border border-slate-400 px-4 py-2 text-center">{g.tahunMasuk || '-'}</td>
                <td className="border border-slate-400 px-4 py-2">{g.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 text-right text-xs font-semibold">
          <p>Jombang, 16 Juli 2026</p>
          <p className="mt-12">H. Mochammad Hasan, M.Pd.I</p>
          <p className="text-slate-500 font-medium">Kepala Madrasah</p>
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
            <Users className="text-emerald-600 h-6 w-6" />
            <h2 className="text-lg font-bold text-slate-900 font-sans">Daftar Guru & Tenaga Kependidikan</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200"
            >
              <Upload className="h-3.5 w-3.5" />
              Import Guru
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Tambah Guru
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

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-16">Foto</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">NUPTK</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Tahun Masuk</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Role Akses</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Password</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {guru.map((g, index) => (
                <tr key={g.id} className="hover:bg-slate-50/50 transition-all align-middle">
                  <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={g.fotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                      alt={g.nama}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-full border border-slate-100 shadow-2xs"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-xs">{g.nuptk || '-'}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{g.nama}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{g.tahunMasuk || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${
                      g.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      g.role === 'Wali Kelas' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-700 border-slate-100'
                    }`}>
                      {g.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <div className="flex items-center gap-1">
                      <span>{showPasswords[g.id] ? g.password : '••••••'}</span>
                      <button onClick={() => togglePasswordVisibility(g.id)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer">
                        {showPasswords[g.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingGuru(g)}
                        className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-md transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus guru ${g.nama}?`)) {
                            onDeleteGuru(g.id);
                          }
                        }}
                        className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-md transition-all cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tambah Guru Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-md w-full p-6 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Tambah Guru Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Username Login (Unik)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. budisastro"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">NUPTK</label>
                  <input
                    type="text"
                    placeholder="16-digit nomor"
                    value={nuptk}
                    onChange={e => setNuptk(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tahun Masuk</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={tahunMasuk}
                    onChange={e => setTahunMasuk(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Santoso, S.Ag"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 4 karakter"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Hak Akses / Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Wali Kelas">Wali Kelas</option>
                    <option value="Admin">Admin / Kurikulum</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tautan Foto Profil (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={fotoUrl}
                  onChange={e => setFotoUrl(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
              >
                Simpan Guru Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Guru Modal */}
      {editingGuru && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-md w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Edit Data Guru</h3>
              <button onClick={() => setEditingGuru(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={editingGuru.nama}
                  onChange={e => setEditingGuru({ ...editingGuru, nama: e.target.value })}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">NUPTK</label>
                <input
                  type="text"
                  value={editingGuru.nuptk}
                  onChange={e => setEditingGuru({ ...editingGuru, nuptk: e.target.value })}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tahun Masuk</label>
                  <input
                    type="text"
                    value={editingGuru.tahunMasuk}
                    onChange={e => setEditingGuru({ ...editingGuru, tahunMasuk: e.target.value })}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Role Akses</label>
                  <select
                    value={editingGuru.role}
                    onChange={e => setEditingGuru({ ...editingGuru, role: e.target.value as any })}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Wali Kelas">Wali Kelas</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={editingGuru.password}
                  onChange={e => setEditingGuru({ ...editingGuru, password: e.target.value })}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
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

      {/* Import Guru Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-lg w-full p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-950 text-base">Import Data Guru (Format Template)</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                <span className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" /> Template Kolom (Copy-Paste Baris Data):
                </span>
                <code className="text-[10px] font-mono block bg-slate-900 text-white p-2 rounded select-all whitespace-pre-wrap">
                  username_login	nuptk	nama_guru	tahun_masuk	password	role_akses
                </code>
                <p className="text-[10px] text-slate-500 mt-2">
                  *Gunakan pemisah Tab atau Koma (CSV). Contoh:<br />
                  <span className="font-mono">eko123,123456789,Eko Prasetyo,2025,rahasia,Guru</span>
                </p>
              </div>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tempelkan Data Guru Di Sini</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Contoh: budis,19203910,Budi Raharjo S.T,2024,pwd123,Guru"
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-xs transition-all cursor-pointer"
                >
                  Kirim Template & Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
