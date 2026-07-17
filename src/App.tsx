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
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle
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
  const [isDataLoadedForUser, setIsDataLoadedForUser] = useState<string | null>(null);
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

  // Beautiful Custom Toast State
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'info' | 'error' }>({
    message: '',
    visible: false,
    type: 'info'
  });

  const triggerToast = (message: string) => {
    let type: 'success' | 'info' | 'error' = 'info';
    const lower = message.toLowerCase();
    if (lower.includes('berhasil') || lower.includes('sukses') || lower.includes('ditemukan') || lower.includes('aman') || lower.includes('ditarik')) {
      type = 'success';
    } else if (lower.includes('gagal') || lower.includes('salah') || lower.includes('maaf') || lower.includes('tidak') || lower.includes('error')) {
      type = 'error';
    }
    setToast({ message, visible: true, type });
  };

  // Intercept window.alert so that iframes (e.g. Google Sites) don't throw security errors when alerting, and render a beautiful Toast instead
  React.useEffect(() => {
    window.alert = (msg: string) => {
      console.log("Custom alert intercepted:", msg);
      triggerToast(msg);
    };
  }, []);

  // Auto-dismiss Toast
  React.useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Read ?url=... parameter from query string on mount for automatic mobile setup!
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      const cleanUrl = decodeURIComponent(urlParam).trim();
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        handleUpdateUrl(cleanUrl);
        // Automatically pull data
        setTimeout(() => {
          handlePullData(cleanUrl);
        }, 800);
        
        // Clean URL parameters
        try {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        } catch (e) {
          console.warn('Failed to clean URL parameters:', e);
        }
      }
    }
  }, []);

  // Load / Switch user-specific data when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id;
      const hasUserData = localStorage.getItem(`mts_${userId}_has_data`) === 'true';
      
      if (hasUserData) {
        const loadItem = (key: string, defaultValue: any) => {
          const val = localStorage.getItem(`mts_${userId}_${key}`);
          return val ? JSON.parse(val) : defaultValue;
        };
        
        setProfil(loadItem('db_profil', DEFAULT_PROFIL));
        setGuru(loadItem('db_guru', DEFAULT_GURU));
        setKelas(loadItem('db_kelas', DEFAULT_KELAS));
        setSiswa(loadItem('db_siswa', DEFAULT_SISWA));
        setMutasiHistory(loadItem('db_riwayatSiswa', INITIAL_MUTASI_HISTORY));
        setMengajar(loadItem('db_mengajar', DEFAULT_MENGAJAR));
        setJurnal(loadItem('db_jurnal', DEFAULT_JURNAL));
        setAbsensi(loadItem('db_absensi', DEFAULT_ABSENSI));
        setNilaiFormatif(loadItem('db_nilaiFormatif', DEFAULT_FORMATIF));
        setNilaiSumatif(loadItem('db_nilaiSumatif', DEFAULT_SUMATIF));
        setAlokasi(loadItem('db_alokasi', DEFAULT_ALOKASI));
        setModul(loadItem('db_modul', DEFAULT_MODUL));
        setKaldik(loadItem('db_kaldik', DEFAULT_KALDIK));
        setJadwal(loadItem('db_jadwal', DEFAULT_JADWAL));
        
        setAppsScriptUrlState(localStorage.getItem(`mts_${userId}_apps_script_url`) || '');
        setAutoSyncEnabled(localStorage.getItem(`mts_${userId}_apps_script_auto_sync`) === 'true');
        setLastSyncedTime(localStorage.getItem(`mts_${userId}_last_synced_time`) || null);
      } else {
        // Migrate global data for this user on first login so they don't start empty
        const migrateItem = (globalKey: string, defaultValue: any) => {
          const val = localStorage.getItem(globalKey);
          return val ? JSON.parse(val) : defaultValue;
        };
        
        const mProfil = migrateItem('mts_db_profil', DEFAULT_PROFIL);
        const mGuru = migrateItem('mts_db_guru', DEFAULT_GURU);
        const mKelas = migrateItem('mts_db_kelas', DEFAULT_KELAS);
        const mSiswa = migrateItem('mts_db_siswa', DEFAULT_SISWA);
        const mMutasi = migrateItem('mts_db_riwayatSiswa', INITIAL_MUTASI_HISTORY);
        const mMengajar = migrateItem('mts_db_mengajar', DEFAULT_MENGAJAR);
        const mJurnal = migrateItem('mts_db_jurnal', DEFAULT_JURNAL);
        const mAbsensi = migrateItem('mts_db_absensi', DEFAULT_ABSENSI);
        const mFormatif = migrateItem('mts_db_nilaiFormatif', DEFAULT_FORMATIF);
        const mSumatif = migrateItem('mts_db_nilaiSumatif', DEFAULT_SUMATIF);
        const mAlokasi = migrateItem('mts_db_alokasi', DEFAULT_ALOKASI);
        const mModul = migrateItem('mts_db_modul', DEFAULT_MODUL);
        const mKaldik = migrateItem('mts_db_kaldik', DEFAULT_KALDIK);
        const mJadwal = migrateItem('mts_db_jadwal', DEFAULT_JADWAL);
        
        const mUrl = localStorage.getItem('mts_apps_script_url') || '';
        const mAutoSync = localStorage.getItem('mts_apps_script_auto_sync') === 'true';
        const mSyncTime = localStorage.getItem('mts_last_synced_time') || null;

        setProfil(mProfil);
        setGuru(mGuru);
        setKelas(mKelas);
        setSiswa(mSiswa);
        setMutasiHistory(mMutasi);
        setMengajar(mMengajar);
        setJurnal(mJurnal);
        setAbsensi(mAbsensi);
        setNilaiFormatif(mFormatif);
        setNilaiSumatif(mSumatif);
        setAlokasi(mAlokasi);
        setModul(mModul);
        setKaldik(mKaldik);
        setJadwal(mJadwal);
        
        setAppsScriptUrlState(mUrl);
        setAutoSyncEnabled(mAutoSync);
        setLastSyncedTime(mSyncTime);

        // Save immediately to mark as initialized for this user
        localStorage.setItem(`mts_${userId}_has_data`, 'true');
      }
      setIsDataLoadedForUser(userId);
    } else {
      // User logged out - load shared global data
      const loadGlobal = (key: string, defaultValue: any) => {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      };
      
      setProfil(loadGlobal('mts_db_profil', DEFAULT_PROFIL));
      setGuru(loadGlobal('mts_db_guru', DEFAULT_GURU));
      setKelas(loadGlobal('mts_db_kelas', DEFAULT_KELAS));
      setSiswa(loadGlobal('mts_db_siswa', DEFAULT_SISWA));
      setMutasiHistory(loadGlobal('mts_db_riwayatSiswa', INITIAL_MUTASI_HISTORY));
      setMengajar(loadGlobal('mts_db_mengajar', DEFAULT_MENGAJAR));
      setJurnal(loadGlobal('mts_db_jurnal', DEFAULT_JURNAL));
      setAbsensi(loadGlobal('mts_db_absensi', DEFAULT_ABSENSI));
      setNilaiFormatif(loadGlobal('mts_db_nilaiFormatif', DEFAULT_FORMATIF));
      setNilaiSumatif(loadGlobal('mts_db_nilaiSumatif', DEFAULT_SUMATIF));
      setAlokasi(loadGlobal('mts_db_alokasi', DEFAULT_ALOKASI));
      setModul(loadGlobal('mts_db_modul', DEFAULT_MODUL));
      setKaldik(loadGlobal('mts_db_kaldik', DEFAULT_KALDIK));
      setJadwal(loadGlobal('mts_db_jadwal', DEFAULT_JADWAL));
      
      setAppsScriptUrlState(localStorage.getItem('mts_apps_script_url') || '');
      setAutoSyncEnabled(localStorage.getItem('mts_apps_script_auto_sync') === 'true');
      setLastSyncedTime(localStorage.getItem('mts_last_synced_time') || null);
      
      setIsDataLoadedForUser(null);
    }
  }, [currentUser]);

  // Global useEffect to save states to localStorage whenever they change
  React.useEffect(() => {
    const userId = currentUser?.id;
    
    // Guard against race conditions during user switching
    if (userId && isDataLoadedForUser !== userId) {
      return;
    }
    if (!userId && isDataLoadedForUser !== null) {
      return;
    }

    const prefix = userId ? `mts_${userId}_` : 'mts_';

    localStorage.setItem(`${prefix}db_profil`, JSON.stringify(profil));
    localStorage.setItem(`${prefix}db_guru`, JSON.stringify(guru));
    localStorage.setItem(`${prefix}db_kelas`, JSON.stringify(kelas));
    localStorage.setItem(`${prefix}db_siswa`, JSON.stringify(siswa));
    localStorage.setItem(`${prefix}db_riwayatSiswa`, JSON.stringify(mutasiHistory));
    localStorage.setItem(`${prefix}db_mengajar`, JSON.stringify(mengajar));
    localStorage.setItem(`${prefix}db_jurnal`, JSON.stringify(jurnal));
    localStorage.setItem(`${prefix}db_absensi`, JSON.stringify(absensi));
    localStorage.setItem(`${prefix}db_nilaiFormatif`, JSON.stringify(nilaiFormatif));
    localStorage.setItem(`${prefix}db_nilaiSumatif`, JSON.stringify(nilaiSumatif));
    localStorage.setItem(`${prefix}db_alokasi`, JSON.stringify(alokasi));
    localStorage.setItem(`${prefix}db_modul`, JSON.stringify(modul));
    localStorage.setItem(`${prefix}db_kaldik`, JSON.stringify(kaldik));
    localStorage.setItem(`${prefix}db_jadwal`, JSON.stringify(jadwal));

    if (userId) {
      localStorage.setItem(`mts_${userId}_has_data`, 'true');
    }
  }, [profil, guru, kelas, siswa, mutasiHistory, mengajar, jurnal, absensi, nilaiFormatif, nilaiSumatif, alokasi, modul, kaldik, jadwal, currentUser, isDataLoadedForUser]);

  // Handle URL change
  const handleUpdateUrl = (url: string) => {
    const cleanUrl = url.trim();
    setAppsScriptUrlState(cleanUrl);
    const key = currentUser ? `mts_${currentUser.id}_apps_script_url` : 'mts_apps_script_url';
    localStorage.setItem(key, cleanUrl);
  };

  // Handle AutoSync toggle
  const handleUpdateAutoSync = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    const key = currentUser ? `mts_${currentUser.id}_apps_script_auto_sync` : 'mts_apps_script_auto_sync';
    localStorage.setItem(key, enabled ? 'true' : 'false');
  };

  // Pull database function
  const handlePullData = async (urlToUse?: string | React.MouseEvent) => {
    const url = (typeof urlToUse === 'string' ? urlToUse : null) || appsScriptUrl;
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

  // Dropdown States for Sidebar Menus
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(() => {
    const isMenuIn = (menus: string[]) => menus.includes(activeMenu);
    return {
      akademik: isMenuIn(['kaldik', 'alokasi', 'modul', 'guru', 'mengajar', 'jadwal-mengajar']),
      kelasSiswa: isMenuIn(['kelas', 'siswa-aktif', 'siswa-riwayat']),
      rekap: isMenuIn(['rekap-absensi', 'rekap-jurnal', 'rekap-nilai-formatif', 'rekap-nilai-sumatif']),
      waliKelas: isMenuIn(['rekap-absensi', 'rekap-nilai-formatif', 'rekap-nilai-sumatif']),
      guruProfil: isMenuIn(['profil-guru', 'jadwal-mengajar']),
      guruAgenda: isMenuIn(['input-absensi', 'input-jurnal']),
      guruAsesmen: isMenuIn(['input-nilai-formatif', 'input-nilai-sumatif']),
      guruReferensi: isMenuIn(['kaldik', 'alokasi', 'modul']),
    };
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Prioritize checking user-specific teacher list in case password was changed
    const userSpecificGuruStr = localStorage.getItem(`mts_${cleanUsername}_db_guru`);
    let guruListToSearch = guru;
    if (userSpecificGuruStr) {
      try {
        const parsed = JSON.parse(userSpecificGuruStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          guruListToSearch = parsed;
        }
      } catch (err) {
        console.warn('Failed to parse user-specific guru list:', err);
      }
    }

    // Find in local database or user-specific list
    const userMatch = guruListToSearch.find(g => g.id === cleanUsername && g.password === cleanPassword);

    if (userMatch) {
      if (loginRole === 'Admin' && userMatch.role !== 'Admin') {
        alert(`User ditemukan, tetapi hak akses Anda di sistem adalah: ${userMatch.role}`);
        return;
      }
      if (loginRole === 'Guru' && userMatch.role !== 'Guru' && userMatch.role !== 'Wali Kelas') {
        alert(`User ditemukan, tetapi hak akses Anda di sistem adalah: ${userMatch.role}`);
        return;
      }
      
      // Update profil academic year and semester to match selection
      setProfil(prev => ({
        ...prev,
        tahunAjaran: selectedTahun,
        semester: selectedSemester
      }));
      
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

  const handleExportBackup = () => {
    return {
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
  };

  const handleImportBackup = (backupData: any): boolean => {
    try {
      if (!backupData) throw new Error('Data kosong');
      if (backupData.profil) setProfil(backupData.profil);
      if (backupData.guru && Array.isArray(backupData.guru)) setGuru(backupData.guru);
      if (backupData.kelas && Array.isArray(backupData.kelas)) setKelas(backupData.kelas);
      if (backupData.siswa && Array.isArray(backupData.siswa)) setSiswa(backupData.siswa);
      if (backupData.riwayatSiswa && Array.isArray(backupData.riwayatSiswa)) setMutasiHistory(backupData.riwayatSiswa);
      if (backupData.mengajar && Array.isArray(backupData.mengajar)) setMengajar(backupData.mengajar);
      if (backupData.jurnal && Array.isArray(backupData.jurnal)) setJurnal(backupData.jurnal);
      if (backupData.absensi && Array.isArray(backupData.absensi)) setAbsensi(backupData.absensi);
      if (backupData.nilaiFormatif && Array.isArray(backupData.nilaiFormatif)) setNilaiFormatif(backupData.nilaiFormatif);
      if (backupData.nilaiSumatif && Array.isArray(backupData.nilaiSumatif)) setNilaiSumatif(backupData.nilaiSumatif);
      if (backupData.alokasiWaktu && Array.isArray(backupData.alokasiWaktu)) setAlokasi(backupData.alokasiWaktu);
      if (backupData.modulAjar && Array.isArray(backupData.modulAjar)) setModul(backupData.modulAjar);
      if (backupData.kaldik && Array.isArray(backupData.kaldik)) setKaldik(backupData.kaldik);
      if (backupData.jadwal && Array.isArray(backupData.jadwal)) setJadwal(backupData.jadwal);
      
      alert('Data cadangan (backup) berhasil diimpor!');
      return true;
    } catch (err: any) {
      alert(`Gagal mengimpor data cadangan: ${err.message}`);
      return false;
    }
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

  // Helper to determine if a date falls within the selected academic period
  const isDateInAcademicPeriod = (dateString: string, academicYear: string, semester: 'Ganjil' | 'Genap'): boolean => {
    if (!dateString) return false;
    const parts = academicYear.split('/');
    if (parts.length !== 2) return true;
    const yearStart = parseInt(parts[0], 10);
    const yearEnd = parseInt(parts[1], 10);

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12

    if (semester === 'Ganjil') {
      // Ganjil: July to December of start year
      return year === yearStart && month >= 7 && month <= 12;
    } else {
      // Genap: January to June of end year
      return year === yearEnd && month >= 1 && month <= 6;
    }
  };

  // Filter lists based on selected academic year and semester
  const filteredJurnal = jurnal.filter(j => isDateInAcademicPeriod(j.tanggal, selectedTahun, selectedSemester));
  const filteredAbsensi = absensi.filter(a => isDateInAcademicPeriod(a.tanggal, selectedTahun, selectedSemester));
  const filteredNilaiFormatif = nilaiFormatif.filter(n => (!n.tahunAjaran || n.tahunAjaran === selectedTahun) && (!n.semester || n.semester === selectedSemester));
  const filteredNilaiSumatif = nilaiSumatif.filter(n => (!n.tahunAjaran || n.tahunAjaran === selectedTahun) && (!n.semester || n.semester === selectedSemester));

  // If teacher / homeroom teacher, filter class and student list for Homeroom Reports
  const filteredKelasWali = currentUser && currentUser.role !== 'Admin'
    ? kelas.filter(k => k.waliKelasId === currentUser.id)
    : kelas;

  const filteredSiswaWali = currentUser && currentUser.role !== 'Admin'
    ? siswa.filter(s => kelas.some(k => k.id === s.kelasId && k.waliKelasId === currentUser.id))
    : siswa;

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
            jurnal={filteredJurnal}
            absensi={filteredAbsensi}
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
        return (
          <RekapAbsensi
            absensi={filteredAbsensi}
            siswa={filteredSiswaWali}
            kelas={filteredKelasWali}
            tahunAjaran={selectedTahun}
            semester={selectedSemester}
          />
        );
      case 'rekap-jurnal':
        return (
          <RekapJurnal
            jurnal={filteredJurnal}
            guru={guru}
            kelas={kelas}
            onEditJurnal={(id, up) => {
              setJurnal(prev => prev.map(j => j.id === id ? { ...j, ...up } : j));
            }}
          />
        );
      case 'rekap-nilai-formatif':
        return (
          <RekapNilaiFormatif
            nilaiFormatif={filteredNilaiFormatif}
            siswa={filteredSiswaWali}
            kelas={filteredKelasWali}
            tahunAjaran={selectedTahun}
            semester={selectedSemester}
          />
        );
      case 'rekap-nilai-sumatif':
        return (
          <RekapNilaiSumatif
            nilaiSumatif={filteredNilaiSumatif}
            siswa={filteredSiswaWali}
            kelas={filteredKelasWali}
            tahunAjaran={selectedTahun}
            semester={selectedSemester}
          />
        );
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
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        );

      // GURU ONLY ACTIONS
      case 'input-absensi':
        return (
          <InputAbsensi
            siswa={siswa}
            kelas={kelas}
            currentUser={currentUser}
            mengajar={mengajar}
            onSaveAbsensiAndJurnal={handleSaveAbsensiAndJurnal}
          />
        );
      case 'input-jurnal':
        return (
          <InputJurnal
            kelas={kelas}
            currentUser={currentUser}
            mengajar={mengajar}
            onSaveJurnal={handleSaveJurnal}
          />
        );
      case 'input-nilai-formatif':
        return (
          <InputNilaiFormatif
            nilaiFormatif={nilaiFormatif}
            siswa={siswa}
            kelas={kelas}
            currentUser={currentUser}
            mengajar={mengajar}
            onSaveNilaiFormatif={handleSaveNilaiFormatif}
            tahunAjaran={selectedTahun}
            semester={selectedSemester}
          />
        );
      case 'input-nilai-sumatif':
        return (
          <InputNilaiSumatif
            nilaiSumatif={nilaiSumatif}
            siswa={siswa}
            kelas={kelas}
            currentUser={currentUser}
            mengajar={mengajar}
            onSaveNilaiSumatif={handleSaveNilaiSumatif}
            tahunAjaran={selectedTahun}
            semester={selectedSemester}
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
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>
          <div className="text-center flex flex-col items-center pt-2">
            {profil.logoUrl ? (
              <div className="w-14 h-14 bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-1.5 mb-2.5">
                <img
                  src={profil.logoUrl}
                  alt="Logo Madrasah"
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-full inline-flex items-center justify-center mb-2.5">
                <GraduationCap className="h-8 w-8" />
              </div>
            )}
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">ADMINISTRASI GURU</h1>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {profil.nama || 'Sistem Manajemen Madrasah Tsanawiyah'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Hak Akses Anda
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-150">
                {(['Admin', 'Guru'] as const).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setLoginRole(role)}
                    className={`py-1 text-center text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
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
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Username / ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin, wali1, guru1"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Tahun Ajaran
                </label>
                <select
                  value={selectedTahun}
                  onChange={e => setSelectedTahun(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer uppercase tracking-wider"
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
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
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
              <div className="pt-2 pb-1 text-[10px] font-bold text-slate-500 tracking-wider">
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

              {/* Dropdown Akademik & Guru */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('akademik')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    Akademik & Guru
                  </span>
                  {openDropdowns.akademik ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.akademik && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('kaldik')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'kaldik' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Kaldik Pendidikan
                    </button>
                    <button
                      onClick={() => setActiveMenu('alokasi')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'alokasi' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Alokasi Waktu
                    </button>
                    <button
                      onClick={() => setActiveMenu('modul')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'modul' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Modul Ajar RPP
                    </button>
                    <button
                      onClick={() => setActiveMenu('guru')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'guru' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Data Guru
                    </button>
                    <button
                      onClick={() => setActiveMenu('mengajar')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'mengajar' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Pembagian Mengajar
                    </button>
                    <button
                      onClick={() => setActiveMenu('jadwal-mengajar')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Jadwal Mengajar
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Kelas & Siswa */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('kelasSiswa')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-emerald-500" />
                    Kelas & Siswa
                  </span>
                  {openDropdowns.kelasSiswa ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.kelasSiswa && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('kelas')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'kelas' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Data Kelas
                    </button>
                    <button
                      onClick={() => setActiveMenu('siswa-aktif')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'siswa-aktif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Siswa Aktif
                    </button>
                    <button
                      onClick={() => setActiveMenu('siswa-riwayat')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'siswa-riwayat' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Riwayat & Mutasi
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Laporan & Rekapitulasi */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('rekap')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Laporan & Rekapitulasi
                  </span>
                  {openDropdowns.rekap ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.rekap && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('rekap-absensi')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'rekap-absensi' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Rekap Absensi
                    </button>
                    <button
                      onClick={() => setActiveMenu('rekap-jurnal')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'rekap-jurnal' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Rekap Jurnal Guru
                    </button>
                    <button
                      onClick={() => setActiveMenu('rekap-nilai-formatif')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'rekap-nilai-formatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Rekap Nilai Formatif
                    </button>
                    <button
                      onClick={() => setActiveMenu('rekap-nilai-sumatif')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'rekap-nilai-sumatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Rekap Nilai Sumatif
                    </button>
                  </div>
                )}
              </div>

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
              {/* Dropdown Profil & Jadwal */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('guruProfil')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-emerald-500" />
                    Profil & Jadwal
                  </span>
                  {openDropdowns.guruProfil ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.guruProfil && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('profil-guru')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'profil-guru' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Profil Guru Anda
                    </button>
                    <button
                      onClick={() => setActiveMenu('jadwal-mengajar')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Jadwal Mengajar Anda
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Agenda Kegiatan Guru */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('guruAgenda')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Agenda Kegiatan Guru
                  </span>
                  {openDropdowns.guruAgenda ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.guruAgenda && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('input-absensi')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'input-absensi' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Input Absen & Jurnal
                    </button>
                    <button
                      onClick={() => setActiveMenu('input-jurnal')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'input-jurnal' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Jurnal Mengajar Mandiri
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Asesmen & Penilaian */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('guruAsesmen')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-emerald-500" />
                    Asesmen & Penilaian
                  </span>
                  {openDropdowns.guruAsesmen ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.guruAsesmen && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('input-nilai-formatif')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'input-nilai-formatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Input Nilai Formatif
                    </button>
                    <button
                      onClick={() => setActiveMenu('input-nilai-sumatif')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'input-nilai-sumatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Input Nilai Sumatif
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Referensi & Program */}
              <div className="pt-2">
                <button
                  onClick={() => toggleDropdown('guruReferensi')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    Referensi & Program
                  </span>
                  {openDropdowns.guruReferensi ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>
                {openDropdowns.guruReferensi && (
                  <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                    <button
                      onClick={() => setActiveMenu('kaldik')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'kaldik' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Kalender Pendidikan
                    </button>
                    <button
                      onClick={() => setActiveMenu('alokasi')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'alokasi' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Analisis Alokasi Waktu
                    </button>
                    <button
                      onClick={() => setActiveMenu('modul')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        activeMenu === 'modul' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Modul Ajar RPP
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* WALI KELAS SPECIAL REKAP ACTIONS */}
          {isWaliKelas && (
            <div className="pt-2">
              <button
                onClick={() => toggleDropdown('waliKelas')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                  Laporan Wali Kelas
                </span>
                {openDropdowns.waliKelas ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
              </button>
              {openDropdowns.waliKelas && (
                <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-800/80 ml-4 animate-fade-in">
                  <button
                    onClick={() => setActiveMenu('rekap-absensi')}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      activeMenu === 'rekap-absensi' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Laporan Absensi Kelas
                  </button>
                  <button
                    onClick={() => setActiveMenu('rekap-nilai-formatif')}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      activeMenu === 'rekap-nilai-formatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Rapor Formatif
                  </button>
                  <button
                    onClick={() => setActiveMenu('rekap-nilai-sumatif')}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      activeMenu === 'rekap-nilai-sumatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Rapor Sumatif
                  </button>
                </div>
              )}
            </div>
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
            <div className="flex-1 overflow-y-auto space-y-2">
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

                  {/* Dropdown Akademik & Guru (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('akademik')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                        Akademik & Guru
                      </span>
                      {openDropdowns.akademik ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.akademik && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        {['kaldik', 'alokasi', 'modul', 'guru', 'mengajar', 'jadwal-mengajar'].map((m) => {
                          const labels: Record<string, string> = {
                            'kaldik': 'Kaldik Pendidikan',
                            'alokasi': 'Alokasi Waktu',
                            'modul': 'Modul Ajar RPP',
                            'guru': 'Data Guru',
                            'mengajar': 'Pembagian Mengajar',
                            'jadwal-mengajar': 'Jadwal Mengajar'
                          };
                          return (
                            <button
                              key={m}
                              onClick={() => {
                                setActiveMenu(m);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                activeMenu === m ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              {labels[m]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dropdown Kelas & Siswa (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('kelasSiswa')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-emerald-500" />
                        Kelas & Siswa
                      </span>
                      {openDropdowns.kelasSiswa ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.kelasSiswa && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        {['kelas', 'siswa-aktif', 'siswa-riwayat'].map((m) => {
                          const labels: Record<string, string> = {
                            'kelas': 'Data Kelas',
                            'siswa-aktif': 'Siswa Aktif',
                            'siswa-riwayat': 'Riwayat & Mutasi'
                          };
                          return (
                            <button
                              key={m}
                              onClick={() => {
                                setActiveMenu(m);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                activeMenu === m ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              {labels[m]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dropdown Laporan & Rekapitulasi (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('rekap')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Laporan & Rekapitulasi
                      </span>
                      {openDropdowns.rekap ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.rekap && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        {['rekap-absensi', 'rekap-jurnal', 'rekap-nilai-formatif', 'rekap-nilai-sumatif'].map((m) => {
                          const labels: Record<string, string> = {
                            'rekap-absensi': 'Rekap Absensi',
                            'rekap-jurnal': 'Rekap Jurnal Guru',
                            'rekap-nilai-formatif': 'Rekap Nilai Formatif',
                            'rekap-nilai-sumatif': 'Rekap Nilai Sumatif'
                          };
                          return (
                            <button
                              key={m}
                              onClick={() => {
                                setActiveMenu(m);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                activeMenu === m ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              {labels[m]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                    Export & Integrasi
                  </div>
                  <button
                    onClick={() => {
                      setActiveMenu('export-gs');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'export-gs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <FolderSync className="h-4 w-4" />
                    Publish Google Sheet
                  </button>
                </>
              )}

              {currentUser.role !== 'Admin' && (
                <>
                  {/* Dropdown Profil & Jadwal (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('guruProfil')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-emerald-500" />
                        Profil & Jadwal
                      </span>
                      {openDropdowns.guruProfil ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.guruProfil && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        <button
                          onClick={() => {
                            setActiveMenu('profil-guru');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'profil-guru' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Profil Guru Anda
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenu('jadwal-mengajar');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'jadwal-mengajar' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Jadwal Mengajar Anda
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Agenda Kegiatan Guru (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('guruAgenda')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Agenda Kegiatan Guru
                      </span>
                      {openDropdowns.guruAgenda ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.guruAgenda && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        <button
                          onClick={() => {
                            setActiveMenu('input-absensi');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'input-absensi' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Input Absen & Jurnal
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenu('input-jurnal');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'input-jurnal' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Jurnal Mengajar Mandiri
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Asesmen & Penilaian (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('guruAsesmen')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="h-3.5 w-3.5 text-emerald-500" />
                        Asesmen & Penilaian
                      </span>
                      {openDropdowns.guruAsesmen ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.guruAsesmen && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        <button
                          onClick={() => {
                            setActiveMenu('input-nilai-formatif');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'input-nilai-formatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Input Nilai Formatif
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenu('input-nilai-sumatif');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'input-nilai-sumatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Input Nilai Sumatif
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Referensi & Program (Mobile) */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleDropdown('guruReferensi')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                        Referensi & Program
                      </span>
                      {openDropdowns.guruReferensi ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    </button>
                    {openDropdowns.guruReferensi && (
                      <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                        <button
                          onClick={() => {
                            setActiveMenu('kaldik');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'kaldik' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Kalender Pendidikan
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenu('alokasi');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'alokasi' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Analisis Alokasi Waktu
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenu('modul');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                            activeMenu === 'modul' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Modul Ajar RPP
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Laporan Wali Kelas (Mobile) */}
              {isWaliKelas && (
                <div className="pt-1">
                  <button
                    onClick={() => toggleDropdown('waliKelas')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all tracking-wider cursor-pointer bg-slate-950/20 rounded-lg border border-slate-800/40"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                      Laporan Wali Kelas
                    </span>
                    {openDropdowns.waliKelas ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                  </button>
                  {openDropdowns.waliKelas && (
                    <div className="pl-3 mt-1.5 space-y-1 border-l border-slate-850 ml-4 animate-fade-in">
                      <button
                        onClick={() => {
                          setActiveMenu('rekap-absensi');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          activeMenu === 'rekap-absensi' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Laporan Absensi Kelas
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenu('rekap-nilai-formatif');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          activeMenu === 'rekap-nilai-formatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Rapor Formatif
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenu('rekap-nilai-sumatif');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          activeMenu === 'rekap-nilai-sumatif' ? 'bg-emerald-600/20 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Rapor Sumatif
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Log Out Section inside Scroll Container */}
              <div className="border-t border-slate-800/60 pt-4 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                    {currentUser.nama.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-300">{currentUser.nama.split(' ')[0]}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-500 hover:text-rose-400 flex items-center gap-1.5 cursor-pointer bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20"
                >
                  <LogOut className="h-3.5 w-3.5" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification overlay */}
      {toast.visible && (
        <div className="fixed top-5 right-5 z-[9999] max-w-sm w-[calc(100%-2.5rem)] sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-in">
          <div className={`p-1.5 rounded-lg flex-shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800' :
            toast.type === 'error' ? 'bg-rose-950/50 text-rose-400 border border-rose-800' :
            'bg-amber-950/50 text-amber-400 border border-amber-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> :
             toast.type === 'error' ? <AlertTriangle className="h-4 w-4" /> :
             <AlertTriangle className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">Notifikasi Sistem</p>
            <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed whitespace-pre-line">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(prev => ({ ...prev, visible: false }))}
            className="text-slate-500 hover:text-slate-300 p-0.5 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
