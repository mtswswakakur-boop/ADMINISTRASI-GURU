/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Save, School, Award, Clipboard } from 'lucide-react';
import { Profil } from '../types';

interface ProfilMadrasahProps {
  profil: Profil;
  onSave: (profil: Profil) => void;
}

export default function ProfilMadrasah({ profil, onSave }: ProfilMadrasahProps) {
  const [formData, setFormData] = useState<Profil>({ ...profil });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <School className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900">Pengaturan Profil & Identitas Madrasah</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Logo preview and photo link placeholder */}
          <div className="lg:col-span-4 flex flex-col items-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Logo Madrasah (Ukuran 4x6)</span>
            <div className="w-32 h-44 bg-slate-200 border border-slate-300 rounded-lg overflow-hidden shadow-xs flex items-center justify-center relative">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo Madrasah"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <School className="h-10 w-10 mx-auto opacity-50 mb-1" />
                  <span className="text-[10px] block">Belum ada logo</span>
                </div>
              )}
            </div>
            <div className="w-full mt-4">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Tautan URL Logo</label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://tautan-foto-logo.jpg"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Form Fields for Profil */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Clipboard className="h-4 w-4 text-emerald-600" /> Data Statistik & Alamat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nama Madrasah</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nomor Statistik Madrasah (NSM)</label>
                <input
                  type="text"
                  name="nsm"
                  value={formData.nsm}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">NPSN</label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kabupaten/Kota</label>
                <input
                  type="text"
                  name="kabupaten"
                  value={formData.kabupaten}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Provinsi</label>
                <input
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pt-4 pb-2 border-b border-slate-100">
              <Award className="h-4 w-4 text-emerald-600" /> Pimpinan & Kalender Akademik
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nama Kepala Madrasah</label>
                <input
                  type="text"
                  name="pimpinanNama"
                  value={formData.pimpinanNama}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">NIP Kepala Madrasah</label>
                <input
                  type="text"
                  name="pimpinanNip"
                  value={formData.pimpinanNip}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  name="tahunAjaran"
                  value={formData.tahunAjaran}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 2026/2027"
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Semester Aktif</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div className="pt-4 text-right">
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Simpan Profil Madrasah
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
