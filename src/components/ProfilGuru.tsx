/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Layers,
  ClipboardCheck,
  Calendar,
  GraduationCap,
  Award,
  ShieldAlert,
  Edit2,
  Save,
  Printer,
  FileText,
  Briefcase,
  MapPin,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Guru, Kelas, Siswa, MengajarMapel, AlokasiWaktu, JurnalMengajar, Absensi, Profil } from '../types';

interface ProfilGuruProps {
  currentUser: Guru;
  kelas: Kelas[];
  siswa: Siswa[];
  mengajar: MengajarMapel[];
  alokasi: AlokasiWaktu[];
  jurnal: JurnalMengajar[];
  absensi: Absensi[];
  profil: Profil;
  onUpdateGuru: (id: string, updated: Partial<Guru>) => void;
}

export default function ProfilGuru({
  currentUser,
  kelas,
  siswa,
  mengajar,
  alokasi,
  jurnal,
  absensi,
  profil,
  onUpdateGuru
}: ProfilGuruProps) {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'instrumen'>('ringkasan');
  const [isEditing, setIsEditing] = useState(false);

  // Find if this guru is a wali kelas for any class
  const classManaged = kelas.find(k => k.waliKelasId === currentUser.id);
  const isWaliKelas = !!classManaged;

  // Filter teacher-specific records
  const teacherMengajar = mengajar.filter(m => m.guruId === currentUser.id);
  const teacherAlokasi = alokasi.filter(a => a.guruId === currentUser.id);
  const teacherJurnal = jurnal.filter(j => j.guruId === currentUser.id);

  // Class students details if Wali Kelas
  const managedStudents = isWaliKelas ? siswa.filter(s => s.kelasId === classManaged.id && s.status !== 'Mutasi Keluar') : [];
  const totalManagedSiswa = managedStudents.length;

  // Teacher totals
  const totalJamPerMinggu = teacherAlokasi.reduce((acc, curr) => acc + curr.jamPerMinggu, 0);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    tmtGuru: '',
    nuptk: '',
    nrg: '',
    masaKerja: '',
    jenisKelamin: '' as 'Laki-laki' | 'Perempuan' | '',
    pendidikanTerakhir: '',
    mapelSatmingkal: '',
    jamMengajarPerMinggu: 0,
    namaLembagaLain: '',
    jamTambahan: 0,
    tugasTambahan1: '',
    tugasTambahan2: '',
    tugasTambahan3: '',
    tmtTugasTambahan: '',
    namaPendamping: '',
    periodePengumpulan: ''
  });

  // Sync Form State with currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData({
        nama: currentUser.nama || '',
        tempatLahir: currentUser.tempatLahir || '',
        tanggalLahir: currentUser.tanggalLahir || '',
        tmtGuru: currentUser.tmtGuru || '',
        nuptk: currentUser.nuptk || '',
        nrg: currentUser.nrg || '',
        masaKerja: currentUser.masaKerja || '',
        jenisKelamin: currentUser.jenisKelamin || '',
        pendidikanTerakhir: currentUser.pendidikanTerakhir || '',
        mapelSatmingkal: currentUser.mapelSatmingkal || teacherMengajar.map(m => m.mapel).filter((v, i, a) => a.indexOf(v) === i).join(', ') || '',
        jamMengajarPerMinggu: currentUser.jamMengajarPerMinggu !== undefined ? currentUser.jamMengajarPerMinggu : totalJamPerMinggu,
        namaLembagaLain: currentUser.namaLembagaLain || '',
        jamTambahan: currentUser.jamTambahan || 0,
        tugasTambahan1: currentUser.tugasTambahan1 || '',
        tugasTambahan2: currentUser.tugasTambahan2 || '',
        tugasTambahan3: currentUser.tugasTambahan3 || '',
        tmtTugasTambahan: currentUser.tmtTugasTambahan || '',
        namaPendamping: currentUser.namaPendamping || '',
        periodePengumpulan: currentUser.periodePengumpulan || ''
      });
    }
  }, [currentUser.id]); // trigger only when switching teacher sessions

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'jamMengajarPerMinggu' || name === 'jamTambahan') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGuru(currentUser.id, formData);
    setIsEditing(false);
    alert('Data profil dan instrumen pendampingan berhasil disimpan!');
  };

  // Compute attendance rate for the managed class
  const getManagedClassAttendanceRate = () => {
    if (!classManaged) return '100';
    const classAbs = absensi.filter(a => a.kelasId === classManaged.id);
    if (classAbs.length === 0) return '98.5';
    const total = classAbs.length;
    const present = classAbs.filter(a => a.status === 'Hadir' || a.status === 'Izin' || a.status === 'Sakit').length;
    return ((present / total) * 100).toFixed(1);
  };

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #print-section, #print-section * {
          visibility: visible;
        }
        #print-section {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 1.5cm;
          margin: 0;
          background: white;
          color: black;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 4px 8px;
          vertical-align: top;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const totalJamTotal = Number(formData.jamMengajarPerMinggu || 0) + Number(formData.jamTambahan || 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-6">
          <GraduationCap className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <img
            src={currentUser.fotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
            alt={currentUser.nama}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full border-4 border-white/30 object-cover shadow-md"
          />
          <div className="text-center md:text-left space-y-1">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-white/20 text-white rounded-full tracking-wider inline-block">
              {currentUser.role === 'Admin' ? 'Administrator' : isWaliKelas ? 'Guru & Wali Kelas' : 'Guru Mapel'}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{currentUser.nama}</h2>
            <p className="text-sm font-medium text-emerald-100 font-mono">
              NUPTK: {currentUser.nuptk || '-'} • Terdaftar Sejak: {currentUser.tahunMasuk || '-'}
            </p>
            {isWaliKelas && (
              <p className="text-xs md:text-sm font-semibold bg-emerald-900/40 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 text-emerald-50 mt-1">
                <Layers className="w-3.5 h-3.5" /> Wali Kelas: <span className="font-bold text-white">{classManaged.namaKelas}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-2 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ringkasan'
              ? 'border-emerald-600 text-emerald-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Ringkasan Aktivitas
        </button>
        <button
          onClick={() => setActiveTab('instrumen')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'instrumen'
              ? 'border-emerald-600 text-emerald-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Instrumen Profil & Pendampingan
        </button>
      </div>

      {activeTab === 'ringkasan' ? (
        <>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Mata Pelajaran Diampu</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{teacherMengajar.length} Mapel</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Jam Mengajar Efektif</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalJamPerMinggu} JP/Minggu</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Jurnal Mandiri</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{teacherJurnal.length} Jurnal</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
              {isWaliKelas ? (
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Siswa Binaan Kelas</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalManagedSiswa} Siswa</span>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Mengajar Kelas</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    {Array.from(new Set(teacherMengajar.map(m => m.kelasId))).length} Kelas
                  </span>
                </div>
              )}
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Detailed Grid columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Teaching Schedule & Mapel Assignment Info */}
            <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Tugas Mengajar & Alokasi Waktu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Daftar penugasan mata pelajaran dan jam mengajar efektif</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 text-xs font-bold text-slate-600">Mapel</th>
                      <th className="py-2 text-xs font-bold text-slate-600">Kelas</th>
                      <th className="py-2 text-xs font-bold text-slate-600 text-center">Tingkat</th>
                      <th className="py-2 text-xs font-bold text-slate-600 text-right">Jam/Minggu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherMengajar.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-xs text-slate-400 font-medium">
                          Belum ada penugasan mengajar terdaftar untuk Anda.
                        </td>
                      </tr>
                    ) : (
                      teacherMengajar.map(tm => {
                        const matchAlokasi = teacherAlokasi.find(a => a.mapel === tm.mapel);
                        return (
                          <tr key={tm.id} className="hover:bg-slate-50/50">
                            <td className="py-2 text-xs font-semibold text-slate-900">{tm.mapel}</td>
                            <td className="py-2 text-xs text-slate-600 font-mono font-bold">{tm.kelasId}</td>
                            <td className="py-2 text-xs text-slate-600 text-center">{tm.tingkat}</td>
                            <td className="py-2 text-xs text-slate-800 font-mono font-bold text-right">
                              {matchAlokasi ? `${matchAlokasi.jamPerMinggu} JP` : '-'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column - Managed Class Details OR Recent Journals */}
            <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
              {isWaliKelas ? (
                <>
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-emerald-600" />
                        Binaan Wali Kelas: {classManaged.namaKelas}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Ringkasan status akademik dan kehadiran kelas binaan Anda</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Presensi: {getManagedClassAttendanceRate()}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Daftar Siswa Kelas {classManaged.namaKelas} ({totalManagedSiswa} Siswa)
                    </div>
                    <div className="max-h-[220px] overflow-y-auto pr-1 space-y-1.5">
                      {managedStudents.map((s, index) => (
                        <div key={s.nisn} className="flex justify-between items-center p-2 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-100/50">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400 w-4 text-center">{index + 1}</span>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{s.nama}</p>
                              <p className="text-[10px] text-slate-500 font-mono">NISN: {s.nisn}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                      Jurnal Mengajar Terbaru Anda
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Daftar pencatatan jurnal KBM mandiri terakhir Anda</p>
                  </div>

                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {teacherJurnal.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs font-medium">
                        Belum ada entri jurnal yang Anda catat.
                      </div>
                    ) : (
                      [...teacherJurnal].reverse().slice(0, 4).map(j => (
                        <div key={j.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-all">
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-xs font-bold text-slate-900">{j.mapel}</span>
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                              Kelas {j.kelasId}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">
                            {j.hari}, {j.tanggal}
                          </p>
                          <p className="text-xs text-slate-700 font-medium mt-1 line-clamp-2">
                            <span className="font-bold text-slate-800">Materi:</span> {j.materi}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          {/* Action Buttons Header */}
          <div className="flex justify-between items-center border-b border-slate-150 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Instrumen Data & Profil Pendampingan Guru</h3>
              <p className="text-xs text-slate-500 mt-0.5">Isi data instrumen secara mandiri untuk melengkapi dokumen pendampingan</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Dokumen (PDF)
              </button>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Data Instrumen
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Batal
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            /* ================= EDIT MODE FORM ================= */
            <form onSubmit={handleSave} className="space-y-6">
              {/* SECTION A: IDENTITAS DIRI */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 border-l-4 border-emerald-500 pl-2 uppercase tracking-wide">
                  IDENTITAS DIRI (A. DATA GURU)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nama Guru</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      name="tempatLahir"
                      value={formData.tempatLahir}
                      onChange={handleInputChange}
                      placeholder="e.g. Jakarta"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tanggal Lahir</label>
                    <input
                      type="text"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleInputChange}
                      placeholder="e.g. 15 Agustus 1985"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">TMT sebagai guru (Terhitung Mulai Tanggal)</label>
                    <input
                      type="text"
                      name="tmtGuru"
                      value={formData.tmtGuru}
                      onChange={handleInputChange}
                      placeholder="e.g. 01 Juli 2010"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">NUPTK</label>
                    <input
                      type="text"
                      name="nuptk"
                      value={formData.nuptk}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">NRG (Nomor Registrasi Guru)</label>
                    <input
                      type="text"
                      name="nrg"
                      value={formData.nrg}
                      onChange={handleInputChange}
                      placeholder="e.g. 12345678"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Masa Kerja</label>
                    <input
                      type="text"
                      name="masaKerja"
                      value={formData.masaKerja}
                      onChange={handleInputChange}
                      placeholder="e.g. 15 Tahun 8 Bulan"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jenis Kelamin</label>
                    <select
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      name="pendidikanTerakhir"
                      value={formData.pendidikanTerakhir}
                      onChange={handleInputChange}
                      placeholder="e.g. S1 Pendidikan Agama Islam"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Mata Pelajaran yang diampu (Satmingkal)</label>
                    <input
                      type="text"
                      name="mapelSatmingkal"
                      value={formData.mapelSatmingkal}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jumlah Jam Mengajar per Minggu</label>
                    <input
                      type="number"
                      name="jamMengajarPerMinggu"
                      value={formData.jamMengajarPerMinggu}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nama Lembaga Lain untuk jam tambahan</label>
                    <input
                      type="text"
                      name="namaLembagaLain"
                      value={formData.namaLembagaLain}
                      onChange={handleInputChange}
                      placeholder="e.g. MTs Darul Ulum"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jumlah Jam Tambahan di Lembaga lain</label>
                    <input
                      type="number"
                      name="jamTambahan"
                      value={formData.jamTambahan}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tugas Tambahan sebagai (1)</label>
                    <input
                      type="text"
                      name="tugasTambahan1"
                      value={formData.tugasTambahan1}
                      onChange={handleInputChange}
                      placeholder="e.g. Kepala Perpustakaan"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tugas Tambahan sebagai (2)</label>
                    <input
                      type="text"
                      name="tugasTambahan2"
                      value={formData.tugasTambahan2}
                      onChange={handleInputChange}
                      placeholder="e.g. Pembina Pramuka"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tugas Tambahan sebagai (3)</label>
                    <input
                      type="text"
                      name="tugasTambahan3"
                      value={formData.tugasTambahan3}
                      onChange={handleInputChange}
                      placeholder="e.g. Koordinator P5"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">TMT Tugas Tambahan</label>
                    <input
                      type="text"
                      name="tmtTugasTambahan"
                      value={formData.tmtTugasTambahan}
                      onChange={handleInputChange}
                      placeholder="e.g. 15 Juli 2025"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jumlah Jam Total (Kombinasi Otomatis)</label>
                    <input
                      type="text"
                      disabled
                      value={`${totalJamTotal} JP (Otomatis)`}
                      className="w-full text-sm bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: NAMA INSTANSI (READ ONLY LINKED TO PROFIL) */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-extrabold text-slate-900 border-l-4 border-emerald-500 pl-2 uppercase tracking-wide flex justify-between items-center">
                  <span>B. DATA INSTANSI/MADRASAH (Linked)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Diedit di Profil Madrasah oleh Admin</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block">Nama Madrasah</label>
                    <p className="text-sm font-bold text-slate-800 mt-1">{profil.nama || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block">Alamat</label>
                    <p className="text-sm font-medium text-slate-700 mt-1">{profil.alamat || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block">Kecamatan</label>
                    <p className="text-sm font-medium text-slate-700 mt-1">{profil.kecamatan || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block">Kabupaten</label>
                    <p className="text-sm font-medium text-slate-700 mt-1">{profil.kabupaten || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block">Provinsi</label>
                    <p className="text-sm font-medium text-slate-700 mt-1">{profil.provinsi || '-'}</p>
                  </div>
                </div>
              </div>

              {/* IDENTITAS PENDAMPING */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-extrabold text-slate-900 border-l-4 border-emerald-500 pl-2 uppercase tracking-wide">
                  IDENTITAS PENDAMPING
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nama Pendamping</label>
                    <input
                      type="text"
                      name="namaPendamping"
                      value={formData.namaPendamping}
                      onChange={handleInputChange}
                      placeholder="e.g. Drs. H. Ahmad Fauzi, M.Pd."
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Periode Pengumpulan</label>
                    <input
                      type="text"
                      name="periodePengumpulan"
                      value={formData.periodePengumpulan}
                      onChange={handleInputChange}
                      placeholder="e.g. Juli - Desember 2026"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 text-right border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            /* ================= VIEW DISPLAY MODE ================= */
            <div className="space-y-6">
              {/* SECTION A: IDENTITAS GURU */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">IDENTITAS DIRI</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-extrabold uppercase">Bagian A: Data Diri Guru</span>
                </div>
                <div className="border border-slate-150 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600 w-1/3">Nama Lengkap Guru</td>
                        <td className="px-4 py-3 text-slate-900 font-extrabold">{formData.nama || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Tempat, Tanggal Lahir</td>
                        <td className="px-4 py-3 text-slate-900">
                          {formData.tempatLahir ? `${formData.tempatLahir}, ` : ''}{formData.tanggalLahir || '-'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">TMT sebagai guru</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{formData.tmtGuru || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">NUPTK / NRG</td>
                        <td className="px-4 py-3 text-slate-900 font-mono font-bold">
                          {formData.nuptk || '-'} {formData.nrg ? ` / ${formData.nrg}` : ''}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Masa Kerja</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{formData.masaKerja || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Jenis Kelamin</td>
                        <td className="px-4 py-3 text-slate-900 font-semibold">{formData.jenisKelamin || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Pendidikan Terakhir</td>
                        <td className="px-4 py-3 text-slate-900">{formData.pendidikanTerakhir || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Mata Pelajaran Diampu (Satmingkal)</td>
                        <td className="px-4 py-3 text-slate-900 font-semibold">{formData.mapelSatmingkal || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Jumlah Jam Mengajar per Minggu</td>
                        <td className="px-4 py-3 text-slate-900 font-mono font-bold text-emerald-700">{formData.jamMengajarPerMinggu || 0} JP</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Nama Lembaga Lain (Jam Tambahan)</td>
                        <td className="px-4 py-3 text-slate-900 italic">{formData.namaLembagaLain || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Jumlah Jam Tambahan Lembaga Lain</td>
                        <td className="px-4 py-3 text-slate-900 font-mono font-bold text-slate-600">{formData.jamTambahan || 0} JP</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Tugas Tambahan Sebagai</td>
                        <td className="px-4 py-3 text-slate-900">
                          <ul className="list-disc pl-4 space-y-1 font-semibold text-xs">
                            <li>{formData.tugasTambahan1 || '-'}</li>
                            <li>{formData.tugasTambahan2 || '-'}</li>
                            <li>{formData.tugasTambahan3 || '-'}</li>
                          </ul>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600 bg-slate-50/50">Jumlah Jam Total</td>
                        <td className="px-4 py-3 text-slate-900 font-mono font-black text-emerald-800 bg-slate-50/50">{totalJamTotal} JP</td>
                      </tr>
                      <tr className="hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">TMT Tugas Tambahan</td>
                        <td className="px-4 py-3 text-slate-900">{formData.tmtTugasTambahan || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION B: INSTANSI */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">DATA MADRASAH</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold uppercase">Bagian B: Instansi Utama</span>
                </div>
                <div className="border border-slate-150 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600 w-1/3">Nama Instansi/Madrasah</td>
                        <td className="px-4 py-3 text-slate-900 font-extrabold">{profil.nama || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Alamat Madrasah</td>
                        <td className="px-4 py-3 text-slate-900">{profil.alamat || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Kecamatan</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{profil.kecamatan || '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Kabupaten/Kota</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{profil.kabupaten || '-'}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Provinsi</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{profil.provinsi || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* IDENTITAS PENDAMPING */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">PENDAMPINGAN</h4>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-extrabold uppercase">IDENTITAS PENDAMPING</span>
                </div>
                <div className="border border-slate-150 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600 w-1/3">Nama Pendamping</td>
                        <td className="px-4 py-3 text-slate-900 font-extrabold">{formData.namaPendamping || '-'}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-bold text-slate-600">Periode Pengumpulan</td>
                        <td className="px-4 py-3 text-slate-900 font-semibold text-slate-800">{formData.periodePengumpulan || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SIGNATURE PANELS DISPLAY */}
              <div className="pt-8 border-t border-slate-100">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pratinjau Tanda Tangan Dokumen
                  </div>
                  <div className="grid grid-cols-2 text-center text-xs md:text-sm font-medium mt-4">
                    <div>
                      <p className="text-slate-500 font-bold uppercase">Pendamping,</p>
                      <div className="h-20 flex items-center justify-center">
                        <span className="text-xs text-slate-300 italic">( Tanda Tangan )</span>
                      </div>
                      <p className="font-extrabold underline text-slate-900 uppercase">
                        "{formData.namaPendamping || 'NAMA PENDAMPING'}"
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase">Guru Mata Pelajaran,</p>
                      <div className="h-20 flex items-center justify-center">
                        <span className="text-xs text-slate-300 italic">( Tanda Tangan )</span>
                      </div>
                      <p className="font-extrabold underline text-slate-900 uppercase">
                        "{formData.nama || currentUser.nama}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= PRINT PREVIEW CONTAINER (HIDDEN ON SCREEN, VISIBLE ON PRINT ONLY) ================= */}
      <div id="print-section" className="hidden">
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid black', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
            INSTRUMEN PENDAMPINGAN DAN PROFIL GURU
          </h2>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
            {profil.nama || 'MADRASAH TSANAWIYAH'}
          </h3>
          <p style={{ fontSize: '11px', margin: '0', fontStyle: 'italic' }}>
            Alamat: {profil.alamat || '-'} • Kec. {profil.kecamatan || '-'} • Kab. {profil.kabupaten || '-'} • Prov. {profil.provinsi || '-'}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid black', paddingBottom: '4px', margin: '0 0 10px 0' }}>
            IDENTITAS DIRI
          </h4>
          
          <div style={{ paddingLeft: '10px', marginBottom: '15px' }}>
            <h5 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase' }}>A. Data Guru</h5>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '5%', padding: '3px 0' }}>1.</td>
                  <td style={{ width: '45%', padding: '3px 0' }}>Nama Guru</td>
                  <td style={{ width: '3%', padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ width: '47%', padding: '3px 0', fontWeight: 'bold' }}>{formData.nama}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>2.</td>
                  <td style={{ padding: '3px 0' }}>Tempat/Tanggal Lahir</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.tempatLahir ? `${formData.tempatLahir}, ` : ''}{formData.tanggalLahir || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>3.</td>
                  <td style={{ padding: '3px 0' }}>TMT sebagai guru</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.tmtGuru || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>4.</td>
                  <td style={{ padding: '3px 0' }}>NUPTK/NRG</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.nuptk || '-'} {formData.nrg ? ` / ${formData.nrg}` : ''}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>5.</td>
                  <td style={{ padding: '3px 0' }}>Masa Kerja</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.masaKerja || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>6.</td>
                  <td style={{ padding: '3px 0' }}>Jenis Kelamin</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.jenisKelamin || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>7.</td>
                  <td style={{ padding: '3px 0' }}>Pendidikan Terakhir</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.pendidikanTerakhir || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>8.</td>
                  <td style={{ padding: '3px 0' }}>Mata Pelajaran yang diampu (Satmingkal)</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.mapelSatmingkal || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>9.</td>
                  <td style={{ padding: '3px 0' }}>Jumlah Jam Mengajar per Minggu</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.jamMengajarPerMinggu || 0} JP</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>10.</td>
                  <td style={{ padding: '3px 0' }}>Nama Lembaga Lain untuk jam tambahan</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.namaLembagaLain || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>11.</td>
                  <td style={{ padding: '3px 0' }}>Jumlah Jam Tambahan di Lembaga lain</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.jamTambahan || 0} JP</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>12.</td>
                  <td style={{ padding: '3px 0' }}>Tugas Tambahan sebagai</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>
                    <div style={{ paddingLeft: '14px' }}>
                      <div>1. {formData.tugasTambahan1 || '-'}</div>
                      <div>2. {formData.tugasTambahan2 || '-'}</div>
                      <div>3. {formData.tugasTambahan3 || '-'}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>13.</td>
                  <td style={{ padding: '3px 0' }}>Jumlah Jam Total</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0', fontWeight: 'bold' }}>{totalJamTotal} JP</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>14.</td>
                  <td style={{ padding: '3px 0' }}>TMT Tugas Tambahan</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{formData.tmtTugasTambahan || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ paddingLeft: '10px' }}>
            <h5 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase' }}>B. Nama Instansi/Madrasah</h5>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '5%', padding: '3px 0' }}>1.</td>
                  <td style={{ width: '45%', padding: '3px 0' }}>Nama Instansi/Madrasah</td>
                  <td style={{ width: '3%', padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ width: '47%', padding: '3px 0', fontWeight: 'bold' }}>{profil.nama || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>2.</td>
                  <td style={{ padding: '3px 0' }}>Alamat</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{profil.alamat || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>3.</td>
                  <td style={{ padding: '3px 0' }}>Kecamatan</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{profil.kecamatan || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>4.</td>
                  <td style={{ padding: '3px 0' }}>Kabupaten</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{profil.kabupaten || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>5.</td>
                  <td style={{ padding: '3px 0' }}>Provinsi</td>
                  <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                  <td style={{ padding: '3px 0' }}>{profil.provinsi || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: '35px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid black', paddingBottom: '4px', margin: '0 0 10px 0' }}>
            IDENTITAS PENDAMPING
          </h4>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', paddingLeft: '10px' }}>
            <tbody>
              <tr>
                <td style={{ width: '5%', padding: '3px 0' }}>1.</td>
                <td style={{ width: '45%', padding: '3px 0' }}>Nama Pendamping</td>
                <td style={{ width: '3%', padding: '3px 0', textAlign: 'center' }}>:</td>
                <td style={{ width: '47%', padding: '3px 0', fontWeight: 'bold' }}>{formData.namaPendamping || '-'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3px 0' }}>2.</td>
                <td style={{ padding: '3px 0' }}>Periode Pengumpulan</td>
                <td style={{ padding: '3px 0', textAlign: 'center' }}>:</td>
                <td style={{ padding: '3px 0' }}>{formData.periodePengumpulan || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '40px', fontSize: '11px' }}>
          <div style={{ textAlign: 'right', marginRight: '40px', marginBottom: '30px' }}>
            {profil.kecamatan || 'Kecamatan'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', paddingBottom: '60px' }}>
                  Pendamping,
                </td>
                <td style={{ width: '50%', paddingBottom: '60px' }}>
                  Guru Mata Pelajaran,
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
                  "{formData.namaPendamping || 'NAMA PENDAMPING'}"
                </td>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
                  "{formData.nama || currentUser.nama}"
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
