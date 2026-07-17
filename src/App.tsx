/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  School,
  Calendar,
  Hourglass,
  BookOpen,
  Users,
  Layers,
  ClipboardCheck,
  Award,
  BookText,
  LogOut,
  FolderSync,
  Menu,
  X,
  User,
  ShieldAlert
} from 'lucide-react';

// Core State Imports
import {
  DEFAULT_PROFIL,
  DEFAULT_GURU,
  DEFAULT_KELAS,
  DEFAULT_SISWA,
  INITIAL_MUTASI_HISTORY,
  DEFAULT_MENGAJAR,
  DEFAULT_JURNAL,
  DEFAULT_ABSENSI,
  DEFAULT_FORMATIF,
  DEFAULT_SUMATIF,
  DEFAULT_ALOKASI,
  DEFAULT_MODUL,
  DEFAULT_KALDIK,
  DEFAULT_JADWAL
} from './data';

import {
  Profil,
  Guru,
  Kelas,
  Siswa,
  MengajarMapel,
  JurnalMengajar,
  Absensi,
  NilaiFormatif,
  NilaiSumatif,
  AlokasiWaktu,
  ModulAjar,
  KaldikEvent,
  JadwalMengajar
} from './types';

// Components
import DashboardAdmin from './components/DashboardAdmin';
import ProfilMadrasah from './components/ProfilMadrasah';
import Kaldik from './components/Kaldik';
import AnalisisAlokasiWaktu from './components/AnalisisAlokasiWaktu';
import ModulAjarComponent from './components/ModulAjar';
import AppsScriptExport from './components/AppsScriptExport';
import DaftarGuru from './components/DaftarGuru';
import Mengajar from './components/Mengajar';
import DaftarKelas from './components/DaftarKelas';
import DaftarSiswa from './components/DaftarSiswa';
import RiwayatSiswa from './components/RiwayatSiswa';
import RekapAbsensi from './components/RekapAbsensi';
import RekapJurnal from './components/RekapJurnal';
import RekapNilaiFormatif from './components/RekapNilaiFormatif';
import RekapNilaiSumatif from './components/RekapNilaiSumatif';

import InputAbsensi from './components/InputAbsensi';
import InputJurnal from './components/InputJurnal';
import InputNilaiFormatif from './components/InputNilaiFormatif';
import InputNilaiSumatif from './components/InputNilaiSumatif';
import JadwalMengajarComponent from './components/JadwalMengajar';
import ProfilGuru from './components/ProfilGuru';

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<Guru | null>(null);
  const [loginRole, setLoginRole] = useState<'Admin' | 'Guru'>('Guru');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedTahun, setSelectedTahun] = useState('2026/2027');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  // Application Data States
  const [profil, setProfil] = useState<Profil>(() => {
    const data = localStorage.getItem('mts_db_profil');
    return data ? JSON.parse(data) : DEFAULT_PROFIL;
  });
  const [guru, setGuru] = useState<Guru[]>(() => {
    const data = localStorage.getItem('mts_db_guru');
    return data ? JSON.parse(data) : DEFAULT_GURU;
  });
  const [kelas, setKelas] = useState<Kelas[]>(() => {
    const data = localStorage.getItem('mts_db_kelas');
    return data ? JSON.parse(data) : DEFAULT_KELAS;
  });
  const [siswa, setSiswa] = useState<Siswa[]>(() => {
    const data = localStorage.getItem('mts_db_siswa');
    return data ? JSON.parse(data) : DEFAULT_SISWA;
  });
  const [mutasiHistory, setMutasiHistory] = useState<Siswa[]>(() => {
    const data = localStorage.getItem('mts_db_riwayatSiswa');
    return data ? JSON.parse(data) : INITIAL_MUTASI_HISTORY;
  });
  const [mengajar, setMengajar] = useState<MengajarMapel[]>(() => {
    const data = localStorage.getItem('mts_db_mengajar');
    return data ? JSON.parse(data) : DEFAULT_MENGAJAR;
  });
  const [jurnal, setJurnal] = useState<JurnalMengajar[]>(() => {
    const data = localStorage.getItem('mts_db_jurnal');
    return data ? JSON.parse(data) : DEFAULT_JURNAL;
  });
  const [absensi, setAbsensi] = useState<Absensi[]>(() => {
    const data = localStorage.getItem('mts_db_absensi');
    return data ? JSON.parse(data) : DEFAULT_ABSENSI;
  });
  const [nilaiFormatif, setNilaiFormatif] = useState<NilaiFormatif[]>(() => {
    const data = localStorage.getItem('mts_db_nilaiFormatif');
    return data ? JSON.parse(data) : DEFAULT_FORMATIF;
  });
  const [nilaiSumatif, setNilaiSumatif] = useState<NilaiSumatif[]>(() => {
    const data = localStorage.getItem('mts_db_nilaiSumatif');
    return data ? JSON.parse(data) : DEFAULT_SUMATIF;
  });
  const [alokasi, setAlokasi] = useState<AlokasiWaktu[]>(() => {
    const data = localStorage.getItem('mts_db_alokasi');
    return data ? JSON.parse(data) : DEFAULT_ALOKASI;
  });
  const [modul, setModul] = useState<ModulAjar[]>(() => {
    const data = localStorage.getItem('mts_db_modul');
    return data ? JSON.parse(data) : DEFAULT_MODUL;
  });
  const [kaldik, setKaldik] = useState<KaldikEvent[]>(() => {
    const data = localStorage.getItem('mts_db_kaldik');
    return data ? JSON.parse(data) : DEFAULT_KALDIK;
  });
  const [jadwal, setJadwal] = useState<JadwalMengajar[]>(() => {
    const data = localStorage.getItem('mts_db_jadwal');
    return data ? JSON.parse(data) : DEFAULT_JADWAL;
  });

  // Google Sheets Integration States
  const [appsScriptUrl, setAppsScriptUrlState] = useState<string>(() => localStorage.getItem('mts_apps_script_url') || '');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => localStorage.getItem('mts_apps_script_auto_sync') === 'true');
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => localStorage.getItem('mts_last_synced_time'));
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Global useEffect to save states to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('mts_db_profil', JSON.stringify(profil));
    localStorage.setItem('mts_db_guru', JSON.stringify(guru));
    localStorage.setItem('mts_db_kelas', JSON.stringify(kelas));
    localStorage.setItem('mts_db_siswa', JSON.stringify(siswa));
    localStorage.setItem('mts_db_riwayatSiswa', JSON.stringify(mutasiHistory));
    localStorage.setItem('mts_db_mengajar', JSON.stringify(mengajar));
    localStorage.setItem('mts_db_jurnal', JSON.stringify(jurnal));
    localStorage.setItem('mts_db_absensi', JSON.stringify(absensi));
    localStorage.setItem('mts_db_nilaiFormatif', JSON.stringify(nilaiFormatif));
    localStorage.setItem('mts_db_nilaiSumatif', JSON.stringify(nilaiSumatif));
    localStorage.setItem('mts_db_alokasi', JSON.stringify(alokasi));
    localStorage.setItem('mts_db_modul', JSON.stringify(modul));
    localStorage.setItem('mts_db_kaldik', JSON.stringify(kaldik));
    localStorage.setItem('mts_db_jadwal', JSON.stringify(jadwal));
  }, [profil, guru, kelas, siswa, mutasiHistory, mengajar, jurnal, absensi, nilaiFormatif, nilaiSumatif, alokasi, modul, kaldik, jadwal]);

  // Handle URL change
  const handleUpdateUrl = (url: string) => {
    const cleanUrl = url.trim();
    setAppsScriptUrlState(cleanUrl);
    localStorage.setItem('mts_apps_script_url', cleanUrl);
  };

  // Handle AutoSync toggle
  const handleUpdateAutoSync = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    localStorage.setItem('mts_apps_script_auto_sync', enabled ? 'true' : 'false');
  };

  // Pull database function
  const handlePullData = async (urlToUse?: string) => {
    const url = urlToUse || appsScriptUrl;
    if (!url) {
      alert('Silakan masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setSyncLoading(true);
    setSyncError(null);
    try {
      const { fetchDatabaseFromSheet } = await import('./utils/syncService');
      const db = await fetchDatabaseFromSheet(url);
      
      // Update state
      if (db.profil && db.profil.nama) setProfil(db.profil);
      if (db.guru && db.guru.length > 0) setGuru(db.guru);
      if (db.kelas && db.kelas.length > 0) setKelas(db.kelas);
      if (db.siswa && db.siswa.length > 0) setSiswa(db.siswa);
      if (db.riwayatSiswa) setMutasiHistory(db.riwayatSiswa);
      if (db.mengajar) setMengajar(db.mengajar);
      if (db.jurnal) setJurnal(db.jurnal);
      if (db.absensi) setAbsensi(db.absensi);
      if (db.nilaiFormatif) setNilaiFormatif(db.nilaiFormatif);
      if (db.nilaiSumatif) setNilaiSumatif(db.nilaiSumatif);
      if (db.alokasiWaktu) setAlokasi(db.alokasiWaktu);
      if (db.modulAjar) setModul(db.modulAjar);
      if (db.kaldik) setKaldik(db.kaldik);
      if (db.jadwal) setJadwal(db.jadwal);

      const nowStr = new Date().toLocaleString('id-ID');
      setLastSyncedTime(nowStr);
      localStorage.setItem('mts_last_synced_time', nowStr);
      setIsInitialized(true);
      alert('Data berhasil ditarik dari Google Sheets!');
    } catch (err: any) {
      setSyncError(err.message || 'Gagal menarik data.');
      alert(`Gagal menarik data dari Google Sheets: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  // Push database function
  const handlePushData = async () => {
    if (!appsScriptUrl) {
      alert('Silakan masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setSyncLoading(true);
    setSyncError(null);
    try {
      const { pushDatabaseToSheet } = await import('./utils/syncService');
      const payload = {
        profil,
        guru,
        kelas,
        siswa,
        riwayatSiswa: mutasiHistory,
        mengajar,
        jurnal,
        absensi,
        nilaiFormatif,
        nilaiSumatif,
        alokasiWaktu: alokasi,
        modulAjar: modul,
        kaldik,
        jadwal
      };
      await pushDatabaseToSheet(appsScriptUrl, payload);
      const nowStr = new Date().toLocaleString('id-ID');
      setLastSyncedTime(nowStr);
      localStorage.setItem('mts_last_synced_time', nowStr);
      alert('Data berhasil disimpan ke Google Sheets!');
    } catch (err: any) {
      setSyncError(err.message || 'Gagal mengirim data.');
      alert(`Gagal mengirim data ke Google Sheets: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  // AutoSync effect
  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    if (autoSyncEnabled && appsScriptUrl) {
      const timer = setTimeout(async () => {
        try {
          const { pushDatabaseToSheet } = await import('./utils/syncService');
          const payload = {
            profil,
            guru,
            kelas,
            siswa,
            riwayatSiswa: mutasiHistory,
            mengajar,
            jurnal,
            absensi,
            nilaiFormatif,
            nilaiSumatif,
            alokasiWaktu: alokasi,
            modulAjar: modul,
            kaldik,
            jadwal
          };
          await pushDatabaseToSheet(appsScriptUrl, payload);
          const nowStr = new Date().toLocaleString('id-ID');
          setLastSyncedTime(nowStr);
          localStorage.setItem('mts_last_synced_time', nowStr);
          console.log('Auto-Sync completed successfully!');
        } catch (e) {
          console.error('Auto-Sync failed:', e);
        }
      }, 2000); // Debounce auto-sync by 2s
      return () => clearTimeout(timer);
    }
  }, [profil, guru, kelas, siswa, mutasiHistory, mengajar, jurnal, absensi, nilaiFormatif, nilaiSumatif, alokasi, modul, kaldik, jadwal, autoSyncEnabled, appsScriptUrl]);

  // Active Menu / Page View
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Find in local database
    const userMatch = guru.find(g => g.id === cleanUsername && g.password === cleanPassword);

    if (userMatch) {
      if (loginRole === 'Admin' && userMatch.role !== 'Admin') {
        alert(`User ditemukan, tetapi hak akses Anda di sistem adalah: ${userMatch.role}`);
        return;
      }
      if (loginRole === 'Guru' && userMatch.role !== 'Guru' && userMatch.role !== 'Wali Kelas') {
        alert(`User ditemukan, tetapi hak akses Anda di sistem adalah: ${userMatch.role}`);
        return;
      }
      setCurrentUser(userMatch);
      setActiveMenu('dashboard');
    } else {
      alert('Username atau Password salah! Gunakan: \n - admin / admin (Admin)\n - wali1 / wali (Guru & Wali Kelas)\n - guru1 / guru (Guru)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Data update triggers
  const handleUpdateProfil = (newProfil: Profil) => {
    setProfil(newProfil);
  };

  const handleAddGuru = (newGuru: Guru) => {
    setGuru(prev => [...prev, newGuru]);
  };

  const handleEditGuru = (id: string, updated: Partial<Guru>) => {
    setGuru(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const handleUpdateCurrentGuru = (id: string, updated: Partial<Guru>) => {
    setGuru(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const handleDeleteGuru = (id: string) => {
    setGuru(prev => prev.filter(g => g.id !== id));
  };

  const handleAddKelas = (newKelas: Kelas) => {
    setKelas(prev => [...prev, newKelas]);
  };

  const handleEditKelas = (id: string, updated: Partial<Kelas>) => {
    setKelas(prev => prev.map(k => k.id === id ? { ...k, ...updated } : k));
  };

  const handleAddSiswa = (newSiswa: Siswa) => {
    setSiswa(prev => [...prev, newSiswa]);
  };

  const handleEditSiswa = (nisn: string, updated: Partial<Siswa>) => {
    setSiswa(prev => prev.map(s => s.nisn === nisn ? { ...s, ...updated } : s));
  };

  const handleDeleteSiswa = (nisn: string) => {
    setSiswa(prev => prev.filter(s => s.nisn !== nisn));
  };

  const handleMutasiKeluar = (nisn: string, keterangan: string, tanggal: string) => {
    const target = siswa.find(s => s.nisn === nisn);
    if (!target) return;

    // Remove from active list and append to history logs
    const mutSiswa: Siswa = {
      ...target,
      status: 'Mutasi Keluar',
      keteranganMutasi: keterangan,
      tanggalMutasi: tanggal
    };

    setSiswa(prev => prev.filter(s => s.nisn !== nisn));
    setMutasiHistory(prev => [...prev, mutSiswa]);
  };

  const handleBatalMutasi = (nisn: string) => {
    const target = mutasiHistory.find(m => m.nisn === nisn);
    if (!target) return;

    const restored: Siswa = {
      ...target,
      status: 'Aktif',
      keteranganMutasi: undefined,
      tanggalMutasi: undefined
    };

    setMutasiHistory(prev => prev.filter(m => m.nisn !== nisn));
    setSiswa(prev => [...prev, restored]);
  };

  const handleSaveMengajar = (newList: MengajarMapel[]) => {
    // Overwrite assignments for the specified classId in newList
    if (newList.length === 0) return;
    const targetClassId = newList[0].kelasId;
    setMengajar(prev => [
      ...prev.filter(m => m.kelasId !== targetClassId),
      ...newList
    ]);
  };

  const handleSaveAbsensiAndJurnal = (newAbsList: Absensi[], newJurnal: JurnalMengajar) => {
    setAbsensi(prev => [...prev, ...newAbsList]);
    setJurnal(prev => [...prev, newJurnal]);
  };

  const handleSaveJurnal = (newJurnal: JurnalMengajar) => {
    setJurnal(prev => [...prev, newJurnal]);
  };

  const handleSaveNilaiFormatif = (newList: NilaiFormatif[]) => {
    if (newList.length === 0) return;
    const mapel = newList[0].mapel;
    const kelasId = newList[0].kelasId;
    setNilaiFormatif(prev => [
      ...prev.filter(n => !(n.mapel === mapel && n.kelasId === kelasId)),
      ...newList
    ]);
  };

  const handleSaveNilaiSumatif = (newList: NilaiSumatif[]) => {
    if (newList.length === 0) return;
    const mapel = newList[0].mapel;
    const kelasId = newList[0].kelasId;
    setNilaiSumatif(prev => [
      ...prev.filter(n => !(n.mapel === mapel && n.kelasId === kelasId)),
      ...newList
    ]);
  };

  const handleSaveAlokasi = (item: AlokasiWaktu) => {
    setAlokasi(prev => {
      const exists = prev.some(a => a.id === item.id);
      if (exists) {
        return prev.map(a => a.id === item.id ? item : a);
      }
      return [...prev, item];
    });
  };

  const handleSaveModul = (item: ModulAjar) => {
    setModul(prev => {
      const exists = prev.some(m => m.id === item.id);
      if (exists) {
        return prev.map(m => m.id === item.id ? item : m);
      }
      return [...prev, item];
    });
  };

  const handleAddKaldik = (event: KaldikEvent) => {
    setKaldik(prev => [...prev, event]);
  };

  const handleDeleteKaldik = (id: string) => {
    setKaldik(prev => prev.filter(k => k.id !== id));
  };

  // Rendering Routing Views
  const renderActiveView = () => {
    if (!currentUser) return null;

    switch (activeMenu) {
      case 'dashboard':
        return (
          <DashboardAdmin
            siswa={siswa}
            guru={guru}
            kelas={kelas}
            jurnal={jurnal}
            absensi={absensi}
            currentUser={currentUser}
            mengajar={mengajar}
            alokasi={alokasi}
            profil={profil}
            onNavigate={(menu) => setActiveMenu(menu)}
          />
        );
      case 'profil':
        return <ProfilMadrasah profil={profil} onSave={handleUpdateProfil} />;
      case 'kaldik':
        return (
          <Kaldik
            events={kaldik}
            onAddEvent={handleAddKaldik}
            onDeleteEvent={handleDeleteKaldik}
          />
        );
      case 'alokasi':
        return (
          <AnalisisAlokasiWaktu
            alokasi={alokasi}
            guru={guru}
            onAddAlokasi={handleSaveAlokasi}
            onDeleteAlokasi={(id) => setAlokasi(prev => prev.filter(a => a.id !== id))}
          />
        );
      case 'modul':
        return (
          <ModulAjarComponent
            modulList={modul}
            guru={guru}
            onAddModul={handleSaveModul}
            onUpdateModul={(id, updated) => setModul(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m))}
          />
        );
      case 'guru':
        return (
          <DaftarGuru
            guru={guru}
            onAddGuru={handleAddGuru}
            onEditGuru={handleEditGuru}
            onDeleteGuru={handleDeleteGuru}
          />
        );
      case 'mengajar':
        return (
          <Mengajar
            mengajarList={mengajar}
            guru={guru}
            kelas={kelas}
            onSaveMengajar={handleSaveMengajar}
          />
        );
      case 'kelas':
        return (
          <DaftarKelas
            kelas={kelas}
            guru={guru}
            onAddKelas={handleAddKelas}
            onEditKelas={handleEditKelas}
          />
        );
      case 'siswa-aktif':
        return (
          <DaftarSiswa
            siswa={siswa}
            kelas={kelas}
            onAddSiswa={handleAddSiswa}
            onEditSiswa={handleEditSiswa}
            onDeleteSiswa={handleDeleteSiswa}
            onMutasiKeluar={handleMutasiKeluar}
          />
        );
      case 'siswa-riwayat':
        return <RiwayatSiswa riwayat={mutasiHistory} onBatalMutasi={handleBatalMutasi} />;
      case 'rekap-absensi':
        return <RekapAbsensi absensi={absensi} siswa={siswa} kelas={kelas} tahunAjaran={selectedTahun} />;
      case 'rekap-jurnal':
        return <RekapJurnal jurnal={jurnal} guru={guru} kelas={kelas} onEditJurnal={(id, up) => {
          setJurnal(prev => prev.map(j => j.id === id ? { ...j, ...up } : j));
        }} />;
      case 'rekap-nilai-formatif':
        return <RekapNilaiFormatif nilaiFormatif={nilaiFormatif} siswa={siswa} kelas={kelas} tahunAjaran={selectedTahun} />;
      case 'rekap-nilai-sumatif':
        return <RekapNilaiSumatif nilaiSumatif={nilaiSumatif} siswa={siswa} kelas={kelas} tahunAjaran={selectedTahun} />;
      case 'export-gs':
        return (
          <AppsScriptExport
            appsScriptUrl={appsScriptUrl}
            onUpdateUrl={handleUpdateUrl}
            autoSyncEnabled={autoSyncEnabled}
            onUpdateAutoSync={handleUpdateAutoSync}
            syncLoading={syncLoading}
            syncError={syncError}
            lastSyncedTime={lastSyncedTime}
            onPull={handlePullData}
            onPush={handlePushData}
          />
        );

      // GURU ONLY ACTIONS
      case 'input-absensi':
        return (
          <InputAbsensi
            siswa={siswa}
            kelas={kelas}
            currentUser={currentUser}
            onSaveAbsensiAndJurnal={handleSaveAbsensiAndJurnal}
          />
        );
      case 'input-jurnal':
        return (
          <InputJurnal
            kelas={kelas}
            currentUser={currentUser}
            onSaveJurnal={handleSaveJurnal}
          />
        );
      case 'input-nilai-formatif':
        return (
          <InputNilaiFormatif
            nilaiFormatif={nilaiFormatif}
            siswa={siswa}
            kelas={kelas}
            onSaveNilaiFormatif={handleSaveNilaiFormatif}
          />
        );
      case 'input-nilai-sumatif':
        return (
          <InputNilaiSumatif
            nilaiSumatif={nilaiSumatif}
            siswa={siswa}
            kelas={kelas}
            onSaveNilaiSumatif={handleSaveNilaiSumatif}
          />
        );
      case 'profil-guru':
        return (
          <ProfilGuru
            currentUser={currentUser}
            kelas={kelas}
            siswa={siswa}
            mengajar={mengajar}
            alokasi={alokasi}
            jurnal={jurnal}
            absensi={absensi}
            profil={profil}
            onUpdateGuru={handleUpdateCurrentGuru}
          />
        );
      case 'jadwal-mengajar':
        return (
          <JadwalMengajarComponent
            jadwalList={jadwal}
            guruList={guru}
            kelasList={kelas}
            isAdmin={currentUser.role === 'Admin'}
            onSaveJadwal={(newList) => setJadwal(newList)}
            currentUserId={currentUser.id}
          />
        );
      default:
        return (
          <div className="text-center py-12 text-slate-500 font-sans">
            Menu "{activeMenu}" sedang dikembangkan.
          </div>
        );
    }
  };

  // Login View Wrapper
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-slate-100 p-8 space-y-6">
          <div className="text-center flex flex-col items-center">
            {profil.logoUrl ? (
              <div className="w-16 h-16 bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-1.5 mb-3">
                <img
                  src={profil.logoUrl}
                  alt="Logo Madrasah"
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-full inline-flex items-center justify-center mb-3.5">
                <GraduationCap className="h-10 w-10" />
              </div>
            )}
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">ADMINISTRASI GURU</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              {profil.nama || 'Sistem Manajemen Madrasah Tsanawiyah'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Hak Akses Anda
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-150">
                {(['Admin', 'Guru'] as const).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setLoginRole(role)}
                    className={`py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      loginRole === role
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Username / ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin, wali1, guru1"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Tahun Ajaran
                </label>
                <select
                  value={selectedTahun}
                  onChange={e => setSelectedTahun(e.target.value)}
                  className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(e.target.value as any)}
                  className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              Masuk Ke Sistem
            </button>
          </form>


        </div>
      </div>
    );
  }

  const isWaliKelas = currentUser && (currentUser.role === 'Wali Kelas' || kelas.some(k => k.waliKelasId === currentUser.id));
  const myKelas = currentUser ? kelas.find(k => k.waliKelasId === currentUser.id) : null;

  // Dashboard Master Shell with responsive Drawer & Top Navbar
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          {profil.logoUrl ? (
            <div className="w-9 h-12 bg-white rounded-md overflow-hidden flex items-center justify-center p-0.5 flex-shrink-0 shadow-xs">
              <img
                src={profil.logoUrl}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="bg-emerald-600 text-white p-1.5 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-black text-white tracking-wider leading-none truncate">ADMINISTRASI GURU</h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 block truncate" title={profil.nama}>
              {profil.nama}
            </span>
          </div>
        </div>

        {/* Navigation Elements based on Roles */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          {/* COMMON ACTIONS */}
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMenu === 'dashboard'
                ? 'bg-emerald-600 text-white font-black'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          {currentUser.role === 'Admin' && (
            <>
              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Pengaturan Utama
              </div>
              <button
                onClick={() => setActiveMenu('profil')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'profil' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <School className="h-4 w-4" />
                Profil Madrasah
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Akademik & Guru
              </div>
              <button
                onClick={() => setActiveMenu('kaldik')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'kaldik' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Kaldik Pendidikan
              </button>
              <button
                onClick={() => setActiveMenu('alokasi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'alokasi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Hourglass className="h-4 w-4" />
                Alokasi Waktu
              </button>
              <button
                onClick={() => setActiveMenu('modul')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'modul' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Modul Ajar RPP
              </button>
              <button
                onClick={() => setActiveMenu('guru')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'guru' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                Data Guru
              </button>
              <button
                onClick={() => setActiveMenu('mengajar')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'mengajar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookText className="h-4 w-4" />
                Pembagian Mengajar
              </button>
              <button
                onClick={() => setActiveMenu('jadwal-mengajar')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Jadwal Mengajar
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Kelas & Siswa
              </div>
              <button
                onClick={() => setActiveMenu('kelas')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'kelas' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                Data Kelas
              </button>
              <button
                onClick={() => setActiveMenu('siswa-aktif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'siswa-aktif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                Siswa Aktif
              </button>
              <button
                onClick={() => setActiveMenu('siswa-riwayat')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'siswa-riwayat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                Riwayat & Mutasi
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Laporan & Rekapitulasi
              </div>
              <button
                onClick={() => setActiveMenu('rekap-absensi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-absensi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                Rekap Absensi
              </button>
              <button
                onClick={() => setActiveMenu('rekap-jurnal')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-jurnal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Rekap Jurnal Guru
              </button>
              <button
                onClick={() => setActiveMenu('rekap-nilai-formatif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-nilai-formatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                Rekap Nilai Formatif
              </button>
              <button
                onClick={() => setActiveMenu('rekap-nilai-sumatif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-nilai-sumatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                Rekap Nilai Sumatif
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Export & Integrasi
              </div>
              <button
                onClick={() => setActiveMenu('export-gs')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'export-gs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FolderSync className="h-4 w-4" />
                Publish Google Sheet
              </button>
            </>
          )}

          {/* GURU & WALI KELAS MANAJEMEN */}
          {currentUser.role !== 'Admin' && (
            <>
              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Profil & Jadwal
              </div>
              <button
                onClick={() => setActiveMenu('profil-guru')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'profil-guru' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                Profil Guru Anda
              </button>
              <button
                onClick={() => setActiveMenu('jadwal-mengajar')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Jadwal Mengajar Anda
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Agenda Kegiatan Guru
              </div>
              <button
                onClick={() => setActiveMenu('input-absensi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'input-absensi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                Input Absen & Jurnal
              </button>
              <button
                onClick={() => setActiveMenu('input-jurnal')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'input-jurnal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Jurnal Mengajar Mandiri
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Asesmen & Penilaian
              </div>
              <button
                onClick={() => setActiveMenu('input-nilai-formatif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'input-nilai-formatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                Input Nilai Formatif
              </button>
              <button
                onClick={() => setActiveMenu('input-nilai-sumatif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'input-nilai-sumatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                Input Nilai Sumatif
              </button>

              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Referensi & Program
              </div>
              <button
                onClick={() => setActiveMenu('kaldik')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'kaldik' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Kalender Pendidikan
              </button>
              <button
                onClick={() => setActiveMenu('alokasi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'alokasi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Hourglass className="h-4 w-4" />
                Analisis Alokasi Waktu
              </button>
              <button
                onClick={() => setActiveMenu('modul')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'modul' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Modul Ajar RPP
              </button>
            </>
          )}

          {/* WALI KELAS SPECIAL REKAP ACTIONS */}
          {isWaliKelas && (
            <>
              <div className="pt-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Laporan Wali Kelas
              </div>
              <button
                onClick={() => setActiveMenu('rekap-absensi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-absensi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                Laporan Absensi Kelas
              </button>
              <button
                onClick={() => setActiveMenu('rekap-nilai-formatif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-nilai-formatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                Rapor Formatif
              </button>
              <button
                onClick={() => setActiveMenu('rekap-nilai-sumatif')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'rekap-nilai-sumatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                Rapor Sumatif
              </button>
            </>
          )}
        </nav>

        {/* User profile footer inside Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={currentUser.fotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
              alt={currentUser.nama}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-slate-700 object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-white truncate leading-tight">{currentUser.nama}</p>
              <p className="text-[10px] text-slate-500 font-bold truncate mt-0.5 uppercase tracking-wide">
                {isWaliKelas ? 'Wali Kelas' : currentUser.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer flex-shrink-0"
            title="Keluar dari Aplikasi"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Sticky Header */}
        <header className="sticky top-0 bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SISTEM ADMINISTRASI GURU</p>
              <p className="text-sm font-black text-slate-900 leading-tight">
                TA: <span className="text-emerald-700">{selectedTahun}</span> • Semester <span className="text-emerald-700">{selectedSemester}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-lg select-none uppercase tracking-wide">
              {profil.logoUrl && (
                <img
                  src={profil.logoUrl}
                  alt="Logo"
                  className="w-4 h-5 object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              <span>{profil.nama}</span>
            </div>
            <div className="w-px h-6 bg-slate-100 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-1.5 rounded-full text-slate-600">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 hidden md:block">
                {currentUser.nama.split(' ')[0]} ({currentUser.role})
              </span>
            </div>
          </div>
        </header>

        {/* Outer Dashboard Scroll Area */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 lg:hidden">
          <div className="bg-slate-900 w-72 max-w-xs h-full flex flex-col p-4 space-y-4 animate-slide-right text-slate-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {profil.logoUrl ? (
                  <div className="w-8 h-11 bg-white rounded-md overflow-hidden flex items-center justify-center p-0.5 flex-shrink-0 shadow-xs">
                    <img
                      src={profil.logoUrl}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <GraduationCap className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-sm font-black text-white block leading-none">ADMINISTRASI GURU</span>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase truncate mt-1" title={profil.nama}>
                    {profil.nama}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrolling Nav List for Mobile Drawer */}
            <div className="flex-1 overflow-y-auto space-y-1">
              <button
                onClick={() => {
                  setActiveMenu('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMenu === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>

              {currentUser.role === 'Admin' && (
                <>
                  <button
                    onClick={() => {
                      setActiveMenu('profil');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'profil' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <School className="h-4 w-4" />
                    Profil Madrasah
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('kaldik');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'kaldik' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Kaldik Pendidikan
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('alokasi');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'alokasi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Hourglass className="h-4 w-4" />
                    Alokasi Waktu
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('modul');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'modul' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Modul Ajar RPP
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('guru');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'guru' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Data Guru
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('mengajar');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'mengajar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <BookText className="h-4 w-4" />
                    Pembagian Mengajar
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('jadwal-mengajar');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Jadwal Mengajar
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('kelas');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'kelas' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    Data Kelas
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('siswa-aktif');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'siswa-aktif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Siswa Aktif
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('siswa-riwayat');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'siswa-riwayat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Riwayat & Mutasi
                  </button>
                </>
              )}

              {currentUser.role !== 'Admin' && (
                <>
                  <button
                    onClick={() => {
                      setActiveMenu('profil-guru');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'profil-guru' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Profil Guru Anda
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('jadwal-mengajar');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Jadwal Mengajar Anda
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('input-absensi');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'input-absensi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Input Absen & Jurnal
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('input-jurnal');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'input-jurnal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Jurnal Mengajar Mandiri
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('input-nilai-formatif');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'input-nilai-formatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    Input Nilai Formatif
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('input-nilai-sumatif');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'input-nilai-sumatif' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    Input Nilai Sumatif
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">{currentUser.nama.split(' ')[0]}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
