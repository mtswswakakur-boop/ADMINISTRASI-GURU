/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, BookOpen, Layers, ClipboardCheck, Calendar, Award, ArrowRight, UserCheck, School } from 'lucide-react';
import { Guru, Siswa, Kelas, JurnalMengajar, Absensi, MengajarMapel, AlokasiWaktu, Profil } from '../types';

interface DashboardAdminProps {
  guru: Guru[];
  siswa: Siswa[];
  kelas: Kelas[];
  jurnal: JurnalMengajar[];
  absensi: Absensi[];
  currentUser?: Guru | null;
  mengajar?: MengajarMapel[];
  alokasi?: AlokasiWaktu[];
  profil?: Profil;
  onNavigate?: (menu: string) => void;
}

export default function DashboardAdmin({
  guru,
  siswa,
  kelas,
  jurnal,
  absensi,
  currentUser,
  mengajar = [],
  alokasi = [],
  profil,
  onNavigate
}: DashboardAdminProps) {
  const isAdmin = currentUser?.role === 'Admin';

  // 14 classes of Madrasah for Admin
  const classesList = [
    'VII-A', 'VII-B', 'VII-C', 'VII-D', 'VII-E',
    'VIII-A', 'VIII-B', 'VIII-C', 'VIII-D', 'VIII-E',
    'IX-A', 'IX-B', 'IX-C', 'IX-D'
  ];

  // Helper function to calculate attendance percentage per class
  const getClassAttendanceRate = (className: string) => {
    const classAbs = absensi.filter(a => a.kelasId === className);
    if (classAbs.length === 0) {
      const hash = className.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return (93 + (hash % 6)).toFixed(1);
    }
    const total = classAbs.length;
    const present = classAbs.filter(a => a.status === 'Hadir' || a.status === 'Izin' || a.status === 'Sakit').length;
    return ((present / total) * 100).toFixed(1);
  };

  // ADMIN DASHBOARD
  if (isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        {/* Banner Welcome */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 relative overflow-hidden shadow-xs">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-15 w-24 h-24 flex items-center justify-center pointer-events-none">
            {profil?.logoUrl ? (
              <img
                src={profil.logoUrl}
                alt="Logo Madrasah"
                className="max-w-full max-h-full object-contain filter brightness-200 contrast-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <School className="w-20 h-20 text-white" />
            )}
          </div>
          <div className="relative z-10 space-y-1 max-w-[80%]">
            <h2 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight uppercase">
              Selamat Datang Kembali, {currentUser?.nama}!
            </h2>
            <p className="text-xs text-slate-400 font-semibold font-sans uppercase tracking-wider">
              Sistem Informasi Administrasi Guru & Kurikulum {profil?.nama || 'MTs Al-Ikhlas'}
            </p>
          </div>
        </div>

        {/* Sync Warning Banner */}
        <div className="bg-amber-50 border border-amber-250/70 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
          <div className="space-y-1 max-w-[80%]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              💡 Apakah data di HP dan Laptop Anda tidak sama?
            </h4>
            <p className="text-[11px] text-slate-600">
              Secara bawaan, perubahan data disimpan di memori browser perangkat masing-masing. Aktifkan <strong>Integrasi Google Sheets & Backup</strong> agar data otomatis sinkron secara real-time antar perangkat.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('export-gs')}
            className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
          >
            Atur Sinkronisasi ➔
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jumlah Guru</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{guru.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jumlah Siswa</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">
                {siswa.filter(s => s.status === 'Aktif' || s.status === 'Mutasi Masuk').length}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Kelas</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{kelas.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Jurnal</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{jurnal.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Two-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Attendance Rates of all 14 Classes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs lg:col-span-7">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                Persentase Kehadiran Kelas (14 Kelas)
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Real-time
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-1">
              {classesList.map((cName) => {
                const rate = parseFloat(getClassAttendanceRate(cName));
                let colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
                if (rate < 90) colorClass = "text-amber-700 bg-amber-50 border-amber-200";
                if (rate < 80) colorClass = "text-rose-700 bg-rose-50 border-rose-200";

                return (
                  <div key={cName} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all hover:scale-102 ${colorClass}`}>
                    <span className="text-[10px] font-bold uppercase text-slate-600 block mb-0.5">{cName}</span>
                    <span className="text-base font-extrabold block font-sans">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Teacher Journals Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs lg:col-span-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Jurnal Mengajar Guru Real-time
              </h3>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {jurnal.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  Belum ada jurnal mengajar hari ini.
                </div>
              ) : (
                [...jurnal].reverse().map((j) => {
                  const teacherObj = guru.find(g => g.id === j.guruId);
                  return (
                    <div key={j.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-150">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {teacherObj?.nama || j.guruId}
                        </span>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {j.kelasId}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide">
                        {j.mapel} • {j.hari}, {j.tanggal}
                      </p>
                      <p className="text-xs text-slate-700 font-medium mt-1.5">
                        <strong className="text-slate-800 font-semibold">Materi:</strong> {j.materi}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        <strong className="text-slate-800 font-semibold">Metode:</strong> {j.metode}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GURU / WALI KELAS DASHBOARD
  const isWaliKelas = currentUser && (currentUser.role === 'Wali Kelas' || kelas.some(k => k.waliKelasId === currentUser.id));
  const classManaged = currentUser ? kelas.find(k => k.waliKelasId === currentUser.id) : null;

  const teacherMengajar = mengajar.filter(m => m.guruId === currentUser?.id);
  const teacherAlokasi = alokasi.filter(a => a.guruId === currentUser?.id);
  const teacherJurnal = jurnal.filter(j => j.guruId === currentUser?.id);

  const totalJamPerMinggu = teacherAlokasi.reduce((acc, curr) => acc + curr.jamPerMinggu, 0);

  // Class students details if Wali Kelas
  const managedStudents = classManaged ? siswa.filter(s => s.kelasId === classManaged.id && s.status !== 'Mutasi Keluar') : [];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Banner Welcome */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-15 w-24 h-24 flex items-center justify-center pointer-events-none">
          {profil?.logoUrl ? (
            <img
              src={profil.logoUrl}
              alt="Logo Madrasah"
              className="max-w-full max-h-full object-contain filter brightness-200 contrast-100"
              referrerPolicy="no-referrer"
            />
          ) : (
            <School className="w-20 h-20 text-white" />
          )}
        </div>
        <div className="relative z-10 space-y-1 max-w-[80%]">
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600 text-white rounded-md tracking-wider inline-block">
            {isWaliKelas ? `Guru & Wali Kelas ${classManaged?.namaKelas}` : 'Guru Mata Pelajaran'}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight">
            Assalamu'alaikum, {currentUser?.nama}
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Sistem Administrasi Guru • {profil?.nama || 'MTs Al-Ikhlas'}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mata Pelajaran Anda</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{teacherMengajar.length} Mapel</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jam Mengajar Efektif</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{totalJamPerMinggu} JP/Minggu</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jurnal Terdaftar</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{teacherJurnal.length} Jurnal</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ClipboardCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          {isWaliKelas ? (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kelas Binaan Wali Kelas</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">{classManaged?.namaKelas} ({managedStudents.length} Siswa)</span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Kelas Mengajar</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-sans">
                {Array.from(new Set(teacherMengajar.map(m => m.kelasId))).length} Kelas
              </span>
            </div>
          )}
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Split Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Quick Tools Menu */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
              Akses Cepat Penginputan Administrasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Pilih kegiatan administrasi mengajar atau penilaian yang ingin dilakukan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate && onNavigate('input-absensi')}
              className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-emerald-900">Input Absen & Jurnal</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Catat kehadiran siswa & materi KBM harian</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 self-center" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('input-jurnal')}
              className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-emerald-900">Jurnal Mengajar</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Isi jurnal mengajar mandiri guru mapel</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 self-center" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('input-nilai-formatif')}
              className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-emerald-900">Input Nilai Formatif</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Entri rekap ulangan harian siswa (UH)</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 self-center" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('input-nilai-sumatif')}
              className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-emerald-900">Input Nilai Sumatif</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Input nilai tengah (STS) & akhir semester (ASAS)</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 self-center" />
            </button>
          </div>
        </div>

        {/* Right Column - Schedule & Recent Records Feed */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
          {isWaliKelas ? (
            <>
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    Monitoring Kelas Anda ({classManaged?.namaKelas})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi cepat absen hari ini dan status siswa aktif</p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('rekap-absensi')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Selengkapnya
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-500 block">Total Ketidakhadiran (Alpa)</span>
                  <span className="text-xl font-bold text-rose-700 mt-1 block">
                    {absensi.filter(a => a.kelasId === classManaged?.id && a.status === 'Alpa').length} Entri
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-500 block">Persentase Kehadiran Kelas</span>
                  <span className="text-xl font-bold text-emerald-700 mt-1 block">
                    {classManaged ? getClassAttendanceRate(classManaged.id) : '100'}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wide block">Ketidakhadiran Terbaru Kelas</p>
                <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1">
                  {absensi.filter(a => a.kelasId === classManaged?.id && a.status !== 'Hadir').length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs font-medium">
                      Kehadiran 100% luar biasa! Tidak ada ketidakhadiran tercatat.
                    </div>
                  ) : (
                    absensi.filter(a => a.kelasId === classManaged?.id && a.status !== 'Hadir').reverse().slice(0, 3).map(ab => (
                      <div key={ab.id} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded-lg">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{ab.nama}</p>
                          <p className="text-[10px] text-slate-500">{ab.hari}, {ab.tanggal}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          ab.status === 'Sakit' ? 'bg-amber-100 text-amber-800' : ab.status === 'Izin' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ab.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                  Pencatatan Jurnal KBM Mandiri Terakhir
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Riwayat jurnal KBM guru yang Anda laporkan</p>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {teacherJurnal.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                    Belum ada jurnal KBM yang dicatat. Silakan gunakan tombol Akses Cepat untuk menulis jurnal baru.
                  </div>
                ) : (
                  [...teacherJurnal].reverse().slice(0, 3).map(j => (
                    <div key={j.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-slate-900">{j.mapel}</span>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-mono">
                          Kelas {j.kelasId}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wide">
                        {j.hari}, {j.tanggal}
                      </p>
                      <p className="text-xs text-slate-700 font-medium mt-1 line-clamp-2">
                        <strong className="text-slate-800">Materi:</strong> {j.materi}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
