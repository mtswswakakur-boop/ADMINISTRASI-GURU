/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, Save, BookOpen } from 'lucide-react';
import { NilaiFormatif, Siswa, Kelas } from '../types';
import { MAPEL_LIST } from '../data';

interface InputNilaiFormatifProps {
  nilaiFormatif: NilaiFormatif[];
  siswa: Siswa[];
  kelas: Kelas[];
  onSaveNilaiFormatif: (data: NilaiFormatif[]) => void;
}

export default function InputNilaiFormatif({ nilaiFormatif, siswa, kelas, onSaveNilaiFormatif }: InputNilaiFormatifProps) {
  const [selectedTingkat, setSelectedTingkat] = useState<'VII' | 'VIII' | 'IX' | ''>('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  // Local grid values, key is `${nisn}-${field}` where field is uh1..uh6
  const [localGrades, setLocalGrades] = useState<{ [key: string]: string }>({});

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
      const match = nilaiFormatif.find(n => n.nisn === s.nisn && n.mapel === mapel);
      gradesMap[`${s.nisn}-uh1`] = match ? String(match.uh1) : '';
      gradesMap[`${s.nisn}-uh2`] = match ? String(match.uh2) : '';
      gradesMap[`${s.nisn}-uh3`] = match ? String(match.uh3) : '';
      gradesMap[`${s.nisn}-uh4`] = match ? String(match.uh4) : '';
      gradesMap[`${s.nisn}-uh5`] = match ? String(match.uh5) : '';
      gradesMap[`${s.nisn}-uh6`] = match ? String(match.uh6) : '';
    });

    setLocalGrades(gradesMap);
  };

  const handleGradeChange = (nisn: string, field: string, val: string) => {
    // Restrict input to numbers between 0 and 100
    if (val !== '' && (isNaN(Number(val)) || Number(val) < 0 || Number(val) > 100)) return;
    setLocalGrades(prev => ({ ...prev, [`${nisn}-${field}`]: val }));
  };

  const handleSave = () => {
    if (!selectedKelasId || !selectedMapel) return;

    // Build the array of all updated grades
    const updatedEntries: NilaiFormatif[] = classStudents.map(s => ({
      id: `NF-${selectedKelasId}-${s.nisn}-${selectedMapel}`,
      nisn: s.nisn,
      nama: s.nama,
      kelasId: selectedKelasId,
      mapel: selectedMapel,
      uh1: localGrades[`${s.nisn}-uh1`] !== '' ? Number(localGrades[`${s.nisn}-uh1`]) : '',
      uh2: localGrades[`${s.nisn}-uh2`] !== '' ? Number(localGrades[`${s.nisn}-uh2`]) : '',
      uh3: localGrades[`${s.nisn}-uh3`] !== '' ? Number(localGrades[`${s.nisn}-uh3`]) : '',
      uh4: localGrades[`${s.nisn}-uh4`] !== '' ? Number(localGrades[`${s.nisn}-uh4`]) : '',
      uh5: localGrades[`${s.nisn}-uh5`] !== '' ? Number(localGrades[`${s.nisn}-uh5`]) : '',
      uh6: localGrades[`${s.nisn}-uh6`] !== '' ? Number(localGrades[`${s.nisn}-uh6`]) : ''
    }));

    onSaveNilaiFormatif(updatedEntries);
    alert('Nilai Formatif (UH) siswa berhasil disimpan!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 font-sans">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
        <Award className="text-emerald-600 h-6 w-6" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">Input & Pengolahan Nilai Formatif (Harian/UH)</h2>
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
            {MAPEL_LIST.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedKelasId || !selectedMapel ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-600 font-sans">Tentukan Kelas & Mata Pelajaran</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Silakan pilih kelas dan mata pelajaran yang diampu untuk memuat lembar daftar nilai Ulangan Harian (UH) siswa.
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
              Simpan Semua Nilai Formatif
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider w-36">NISN</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Lengkap Siswa</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">UH 1</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">UH 2</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">UH 3</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">UH 4</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">UH 5</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-wider text-center w-24">UH 6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">
                      Tidak ada siswa terdaftar di kelas ini.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((s, index) => (
                    <tr key={s.nisn} className="hover:bg-slate-50/50 transition-all align-middle">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-xs">{s.nisn}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.nama}</td>
                      {['uh1', 'uh2', 'uh3', 'uh4', 'uh5', 'uh6'].map(field => (
                        <td key={field} className="px-2 py-2 text-center">
                          <input
                            type="text"
                            maxLength={3}
                            placeholder="-"
                            value={localGrades[`${s.nisn}-${field}`] || ''}
                            onChange={e => handleGradeChange(s.nisn, field, e.target.value)}
                            className="w-16 text-center text-xs border border-slate-200 rounded-md py-1 bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                      ))}
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
