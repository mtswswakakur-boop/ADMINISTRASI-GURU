/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, Plus, Save } from 'lucide-react';
import { ModulAjar as ModulAjarType, Guru } from '../types';
import { MAPEL_LIST } from '../data';

interface ModulAjarProps {
  modulList: ModulAjarType[];
  guru: Guru[];
  onAddModul: (data: ModulAjarType) => void;
  onUpdateModul: (id: string, data: Partial<ModulAjarType>) => void;
}

export default function ModulAjar({ modulList, guru, onAddModul, onUpdateModul }: ModulAjarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuru, setSelectedGuru] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [atp, setAtp] = useState('');
  const [prota, setProta] = useState('');
  const [promis, setPromis] = useState('');
  const [modul, setModul] = useState('');
  const [media, setMedia] = useState('');

  // Filtering based on teacher name or subject
  const filteredModul = modulList.filter(m => {
    const teacher = guru.find(g => g.id === m.guruId);
    const teacherName = teacher?.nama || '';
    return teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.mapel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuru || !selectedMapel) return;

    onAddModul({
      id: 'M-' + Date.now(),
      guruId: selectedGuru,
      mapel: selectedMapel,
      atp: atp || '-',
      prota: prota || '-',
      promis: promis || '-',
      modul: modul || '-',
      media: media || '-'
    });

    // Reset fields
    setSelectedMapel('');
    setAtp('');
    setProta('');
    setPromis('');
    setModul('');
    setMedia('');
  };

  const renderLink = (text: string) => {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-xs font-semibold"
        >
          Buka Tautan
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    }
    return <span className="text-slate-600 text-xs font-medium">{text}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-600 h-6 w-6" />
            <h2 className="text-lg font-bold text-slate-900 font-sans">Perangkat Pembelajaran (ATP, PROTA, PROMIS, MODUL AJAR & MEDIA)</h2>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter nama guru / mapel..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form input */}
          <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-100 h-fit">
            <h3 className="font-bold text-slate-950 mb-4 text-sm flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-emerald-600" />
              Unggah Perangkat Baru
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Guru Pengampu</label>
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

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Link ATP (Alur Tujuan Pembelajaran)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... atau deskripsi"
                  value={atp}
                  onChange={e => setAtp(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Link PROTA (Program Tahunan)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... atau deskripsi"
                  value={prota}
                  onChange={e => setProta(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Link PROMIS (Program Semester)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... atau deskripsi"
                  value={promis}
                  onChange={e => setPromis(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Link MODUL AJAR</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... atau deskripsi"
                  value={modul}
                  onChange={e => setModul(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Link MEDIA PEMBELAJARAN</label>
                <input
                  type="text"
                  placeholder="Powerpoint / Quizizz / Tautan lainnya"
                  value={media}
                  onChange={e => setMedia(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Unggah Perangkat
              </button>
            </form>
          </div>

          {/* Table display */}
          <div className="lg:col-span-8 overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Guru & Mapel</th>
                  <th className="px-3 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">ATP</th>
                  <th className="px-3 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">PROTA</th>
                  <th className="px-3 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">PROMIS</th>
                  <th className="px-3 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">MODUL AJAR</th>
                  <th className="px-3 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">MEDIA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredModul.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 text-sm">
                      Belum ada perangkat pembelajaran diunggah.
                    </td>
                  </tr>
                ) : (
                  filteredModul.map((item, index) => {
                    const teacherObj = guru.find(g => g.id === item.guruId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-950 block">{teacherObj?.nama || item.guruId}</span>
                          <span className="text-xs font-semibold text-emerald-700 mt-0.5 block">{item.mapel}</span>
                        </td>
                        <td className="px-3 py-3">{renderLink(item.atp)}</td>
                        <td className="px-3 py-3">{renderLink(item.prota)}</td>
                        <td className="px-3 py-3">{renderLink(item.promis)}</td>
                        <td className="px-3 py-3">{renderLink(item.modul)}</td>
                        <td className="px-3 py-3">{renderLink(item.media)}</td>
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
