/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, Save, BookOpen } from 'lucide-react';
import { NilaiSumatif, Siswa, Kelas, MengajarMapel } from '../types';
import { MAPEL_LIST } from '../data';

interface InputNilaiSumatifProps {
  nilaiSumatif: NilaiSumatif[];
  siswa: Siswa[];
  kelas: Kelas[];
  currentUser: any;
  mengajar: MengajarMapel[];
  onSaveNilaiSumatif: (data: NilaiSumatif[]) => void;
  tahunAjaran?: string;
  semester?: string;
}

export default function InputNilaiSumatif({
  nilaiSumatif,
  siswa,
  kelas,
  currentUser,
  mengajar,
  onSaveNilaiSumatif,
  tahunAjaran = '2026/2027',
  semester = 'Ganjil'
}: InputNilaiSumatifProps) {
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX' | ''>('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  // Local grid values, key is `${nisn}-sts` or `${nisn}-asas`
  const [localGrades, setLocalGrades] = useState<{ [key: string]: string }>({});

  // Filter mapel based on what is taught by the logged-in user
  const allowedMapels = currentUser && currentUser.role !== 'Admin'
    ? Array.from(new Set(mengajar.filter(m => m.guruId === currentUser.id).map(m => m.mapel)))
    : MAPEL_LIST;

  const filteredKelasList = kelas.filter(k => !selectedTingkat || k.tingkat === selectedTingkat);
  const classStudents = siswa.filter(s => s.kelasId === selectedKelasId && s.status !== 'Mutasi Keluar');

  const handleLoadGrades = (kelasId: string, mapel: string) => {
    setSelectedKelasId(kelasId);
    if (!kelasId || !mapel) {
      setLocalGrades({});
      return;
    }

    const gradesMap: { [key: string]: string } = {};
    const filteredStudents = siswa.filter(s => s.kelasId === kelasId && s.status !== 'Mutasi Keluar');

    filteredStudents.forEach(s => {
      const match = nilaiSumatif.find(n => n.nisn === s.nisn && n.mapel === mapel && (!n.tahunAjaran || n.tahunAjaran === tahunAjaran) && (!n.semester || n.semester === semester));
      gradesMap[`${s.nisn}-sts`] = match ? String(match.sts) : '';
      gradesMap[`${s.nisn}-asas`] = match ? String(match.asas) : '';
    });

    setLocalGrades(gradesMap);
  };

  const handleGradeChange = (nisn: string, field: 'sts' | 'asas', val: string) => {
    // Restrict input to numbers between 0 and 100
    if (val !== '' && (isNaN(Number(val)) || Number(val) < 0 || Number(val) > 100)) return;
    setLocalGrades(prev => ({ ...prev, [`${nisn}-${field}`]: val }));
  };

  const handleSave = () => {
    if (!selectedKelasId || !selectedMapel) return;

    // Build update payload
    const updatedEntries: NilaiSumatif[] = classStudents.map(s => ({
      id: `NS-${selectedKelasId}-${s.nisn}-${selectedMapel}-${tahunAjaran.replace('/', '-')}-${semester}`,
      nisn: s.nisn,
      nama: s.nama,
      kelasId: selectedKelasId,
      mapel: selectedMapel,
      tahunAjaran,
      semester,
      sts: localGrades[`${s.nisn}-sts`] !== '' ? Number(localGrades[`${s.nisn}-sts`]) : '',
      asas: localGrades[`${s.nisn}-asas`] !== '' ? Number(localGrades[`${s.nisn}-asas`]) : ''
    }));

    onSaveNilaiSumatif(updatedEntries);
    alert('Nilai Sumatif (STS & ASAS) siswa berhasil disimpan!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 font-sans">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <Award className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">Input & Pengolahan Nilai Sumatif (STS & ASAS)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat</label>
          <select
            value={selectedTingkat}
            onChange={e => {
              setSelectedTingkat(e.target.value as any);
              setSelectedKelasId('');
              setLocalGrades({});
            }}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="">-- Semua Tingkat --</option>
            <option value="VII">Tingkat VII</option>
            <option value="VIII">Tingkat VIII</option>
            <option value="IX">Tingkat IX</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Kelas Belajar</label>
          <select
            value={selectedKelasId}
            onChange={e => {
              handleLoadGrades(e.target.value, selectedMapel);
            }}
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
            value={selectedMapel}
            onChange={e => {
              setSelectedMapel(e.target.value);
              handleLoadGrades(selectedKelasId, e.target.value);
            }}
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

      {!selectedKelasId || !selectedMapel ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-600 font-sans">Tentukan Kelas & Mata Pelajaran</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Silakan pilih kelas dan mata pelajaran yang diampu untuk memuat lembar daftar nilai sumatif STS dan ASAS siswa.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daftar Nilai Kelas: <strong className="text-emerald-700">{selectedKelasId}</strong> • Mapel: <strong className="text-emerald-700">{selectedMapel}</strong>
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Simpan Semua Nilai Sumatif
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">NISN</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Lengkap Siswa</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-48 bg-slate-50/50">STS (Sumatif Tengah Semester)</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-48 bg-slate-50/50">ASAS (Asesmen Sumatif Akhir Semester)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                      Tidak ada siswa terdaftar di kelas ini.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((s, index) => (
                    <tr key={s.nisn} className="hover:bg-slate-50/50 transition-all align-middle">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-xs">{s.nisn}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.nama}</td>
                      <td className="px-4 py-3 text-center bg-slate-50/30">
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="-"
                          value={localGrades[`${s.nisn}-sts`] || ''}
                          onChange={e => handleGradeChange(s.nisn, 'sts', e.target.value)}
                          className="w-24 text-center text-xs border border-slate-200 rounded-md py-1 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center bg-slate-50/30">
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="-"
                          value={localGrades[`${s.nisn}-asas`] || ''}
                          onChange={e => handleGradeChange(s.nisn, 'asas', e.target.value)}
                          className="w-24 text-center text-xs border border-slate-200 rounded-md py-1 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
