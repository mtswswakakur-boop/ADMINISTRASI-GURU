/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profil, Guru, Kelas, Siswa, MengajarMapel, JurnalMengajar, Absensi, NilaiFormatif, NilaiSumatif, AlokasiWaktu, ModulAjar, KaldikEvent, JadwalMengajar } from './types';

export const DEFAULT_PROFIL: Profil = {
  nama: 'MTs Al-Ikhlas Boarding School',
  nsm: '121235150099',
  npsn: '20532144',
  alamat: 'Jl. KH. Wahid Hasyim No. 45, Pesantren',
  kecamatan: 'Tebuireng',
  kabupaten: 'Jombang',
  provinsi: 'Jawa Timur',
  pimpinanNama: 'H. Mochammad Hasan, M.Pd.I',
  pimpinanNip: '197508122003121002',
  logoUrl: '/src/assets/images/mts_logo_1784287858145.jpg',
  tahunAjaran: '2026/2027',
  semester: 'Ganjil'
};

export const DEFAULT_GURU: Guru[] = [
  { id: 'admin', nuptk: '10293847561029', nama: 'Ahmad Fauzi, S.Pd.I (Waka Kurikulum)', tahunMasuk: '2015', password: 'admin', role: 'Admin', fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'wali1', nuptk: '20495867123984', nama: 'Siti Aminah, S.Pd', tahunMasuk: '2018', password: 'wali', role: 'Wali Kelas', fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'wali2', nuptk: '30582910482910', nama: 'Drs. H. M. Yusuf', tahunMasuk: '2012', password: 'wali', role: 'Wali Kelas', fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'guru1', nuptk: '40285918291029', nama: 'Budi Santoso, S.Ag', tahunMasuk: '2016', password: 'guru', role: 'Guru', fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'guru2', nuptk: '50293810294819', nama: 'Dewi Lestari, M.Pd', tahunMasuk: '2020', password: 'guru', role: 'Guru', fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'guru3', nuptk: '60394810294812', nama: 'Lukman Hakim, S.T', tahunMasuk: '2021', password: 'guru', role: 'Guru', fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
];

export const DEFAULT_KELAS: Kelas[] = [
  { id: 'VII-A', namaKelas: 'VII-A', tingkat: 'VII', jenisKelas: 'A', waliKelasId: 'wali1', jumlahSiswa: 32 },
  { id: 'VII-B', namaKelas: 'VII-B', tingkat: 'VII', jenisKelas: 'B', waliKelasId: 'guru1', jumlahSiswa: 30 },
  { id: 'VII-C', namaKelas: 'VII-C', tingkat: 'VII', jenisKelas: 'C', waliKelasId: 'guru2', jumlahSiswa: 28 },
  { id: 'VII-D', namaKelas: 'VII-D', tingkat: 'VII', jenisKelas: 'D', waliKelasId: 'guru3', jumlahSiswa: 29 },
  { id: 'VII-E', namaKelas: 'VII-E', tingkat: 'VII', jenisKelas: 'E', waliKelasId: 'admin', jumlahSiswa: 28 },
  
  { id: 'VIII-A', namaKelas: 'VIII-A', tingkat: 'VIII', jenisKelas: 'A', waliKelasId: 'wali2', jumlahSiswa: 30 },
  { id: 'VIII-B', namaKelas: 'VIII-B', tingkat: 'VIII', jenisKelas: 'B', waliKelasId: 'guru1', jumlahSiswa: 31 },
  { id: 'VIII-C', namaKelas: 'VIII-C', tingkat: 'VIII', jenisKelas: 'C', waliKelasId: 'guru2', jumlahSiswa: 29 },
  { id: 'VIII-D', namaKelas: 'VIII-D', tingkat: 'VIII', jenisKelas: 'D', waliKelasId: 'guru3', jumlahSiswa: 30 },
  { id: 'VIII-E', namaKelas: 'VIII-E', tingkat: 'VIII', jenisKelas: 'E', waliKelasId: 'wali1', jumlahSiswa: 28 },

  { id: 'IX-A', namaKelas: 'IX-A', tingkat: 'IX', jenisKelas: 'A', waliKelasId: 'admin', jumlahSiswa: 32 },
  { id: 'IX-B', namaKelas: 'IX-B', tingkat: 'IX', jenisKelas: 'B', waliKelasId: 'wali2', jumlahSiswa: 30 },
  { id: 'IX-C', namaKelas: 'IX-C', tingkat: 'IX', jenisKelas: 'C', waliKelasId: 'guru1', jumlahSiswa: 28 },
  { id: 'IX-D', namaKelas: 'IX-D', tingkat: 'IX', jenisKelas: 'D', waliKelasId: 'guru2', jumlahSiswa: 29 },
];

export const DEFAULT_SISWA: Siswa[] = [
  // VII-A Students
  { nisn: '0011223301', nama: 'Abdurrahman Wahid', tingkat: 'VII', kelasId: 'VII-A', status: 'Aktif' },
  { nisn: '0011223302', nama: 'Achmad Dani', tingkat: 'VII', kelasId: 'VII-A', status: 'Aktif' },
  { nisn: '0011223303', nama: 'Aisyah Humaira', tingkat: 'VII', kelasId: 'VII-A', status: 'Aktif' },
  { nisn: '0011223304', nama: 'Anisa Rahmawati', tingkat: 'VII', kelasId: 'VII-A', status: 'Mutasi Masuk', keteranganMutasi: 'Pindahan dari MTsN 1 Jombang', tanggalMutasi: '2026-07-10' },
  { nisn: '0011223305', nama: 'Bambang Pamungkas', tingkat: 'VII', kelasId: 'VII-A', status: 'Aktif' },
  { nisn: '0011223306', nama: 'Citra Kirana', tingkat: 'VII', kelasId: 'VII-A', status: 'Aktif' },
  
  // VIII-A Students
  { nisn: '0022334401', nama: 'Fajar Alfian', tingkat: 'VIII', kelasId: 'VIII-A', status: 'Aktif' },
  { nisn: '0022334402', nama: 'Habibie Wijaya', tingkat: 'VIII', kelasId: 'VIII-A', status: 'Aktif' },
  { nisn: '0022334403', nama: 'Imam Bonjol', tingkat: 'VIII', kelasId: 'VIII-A', status: 'Aktif' },
  { nisn: '0022334404', nama: 'Khofifah Indar', tingkat: 'VIII', kelasId: 'VIII-A', status: 'Aktif' },
  { nisn: '0022334405', nama: 'Muhammad Rian', tingkat: 'VIII', kelasId: 'VIII-A', status: 'Aktif' },

  // IX-A Students
  { nisn: '0033445501', nama: 'Nadiem Makarim', tingkat: 'IX', kelasId: 'IX-A', status: 'Aktif' },
  { nisn: '0033445502', nama: 'Prabowo Subianto', tingkat: 'IX', kelasId: 'IX-A', status: 'Aktif' },
  { nisn: '0033445503', nama: 'Riana Sari', tingkat: 'IX', kelasId: 'IX-A', status: 'Aktif' },
  { nisn: '0033445504', nama: 'Sandiaga Uno', tingkat: 'IX', kelasId: 'IX-A', status: 'Aktif' },
  { nisn: '0033445505', nama: 'Zulkifli Hasan', tingkat: 'IX', kelasId: 'IX-A', status: 'Aktif' },
];

// Historical database for Mutasi
export const INITIAL_MUTASI_HISTORY: Siswa[] = [
  { nisn: '0011999901', nama: 'Eko Sulistyo', tingkat: 'VII', kelasId: 'VII-A', status: 'Mutasi Keluar', keteranganMutasi: 'Ikut orang tua pindah tugas ke Jakarta', tanggalMutasi: '2026-07-12' },
  { nisn: '0022999902', nama: 'Farida Nurhan', tingkat: 'VIII', kelasId: 'VIII-B', status: 'Mutasi Keluar', keteranganMutasi: 'Sakit kronis memerlukan rawat jalan khusus', tanggalMutasi: '2026-07-14' },
];

export const DEFAULT_MENGAJAR: MengajarMapel[] = [
  { id: 'm1', tingkat: 'VII', kelasId: 'VII-A', mapel: 'Fikih', guruId: 'admin' },
  { id: 'm2', tingkat: 'VII', kelasId: 'VII-A', mapel: 'Al Qur`an Hadis', guruId: 'guru1' },
  { id: 'm3', tingkat: 'VII', kelasId: 'VII-A', mapel: 'Akidah Akhlak', guruId: 'guru1' },
  { id: 'm4', tingkat: 'VII', kelasId: 'VII-A', mapel: 'Bahasa Arab', guruId: 'wali1' },
  { id: 'm5', tingkat: 'VII', kelasId: 'VII-A', mapel: 'Matematika', guruId: 'guru3' },
  { id: 'm6', tingkat: 'VII', kelasId: 'VII-A', mapel: 'Ilmu Pengetahuan Alam', guruId: 'guru2' },
  
  { id: 'm7', tingkat: 'VIII', kelasId: 'VIII-A', mapel: 'Fikih', guruId: 'admin' },
  { id: 'm8', tingkat: 'VIII', kelasId: 'VIII-A', mapel: 'Sejarah Kebudayaan Islam', guruId: 'guru1' },
  { id: 'm9', tingkat: 'VIII', kelasId: 'VIII-A', mapel: 'Bahasa Indonesia', guruId: 'wali2' },
];

export const DEFAULT_JURNAL: JurnalMengajar[] = [
  { id: 'j1', tanggal: '2026-07-13', hari: 'Senin', guruId: 'admin', mapel: 'Fikih', kelasId: 'VII-A', materi: 'Bab I: Bersuci (Thaharah) dari Hadats dan Najis', metode: 'Ceramah, Demonstrasi, Praktik Wudhu' },
  { id: 'j2', tanggal: '2026-07-14', hari: 'Selasa', guruId: 'guru1', mapel: 'Al Qur`an Hadis', kelasId: 'VII-A', materi: 'Hukum Bacaan Mad Thabi\'i', metode: 'Tanya Jawab & Drill' },
  { id: 'j3', tanggal: '2026-07-15', hari: 'Rabu', guruId: 'wali1', mapel: 'Bahasa Arab', kelasId: 'VII-A', materi: 'At-Ta\'aruf (Perkenalan Diri)', metode: 'Hiwar (Dialog) Berpasangan' },
  { id: 'j4', tanggal: '2026-07-16', hari: 'Kamis', guruId: 'guru3', mapel: 'Matematika', kelasId: 'VII-A', materi: 'Bilangan Bulat dan Pecahan', metode: 'Problem Based Learning' },
];

export const DEFAULT_ABSENSI: Absensi[] = [
  // Abdurrahman Wahid
  { id: 'a1_1', nisn: '0011223301', nama: 'Abdurrahman Wahid', kelasId: 'VII-A', tanggal: '2026-07-13', hari: 'Senin', bulan: 'Juli', tahun: '2026', status: 'Hadir' },
  { id: 'a1_2', nisn: '0011223301', nama: 'Abdurrahman Wahid', kelasId: 'VII-A', tanggal: '2026-07-14', hari: 'Selasa', bulan: 'Juli', tahun: '2026', status: 'Hadir' },
  { id: 'a1_3', nisn: '0011223301', nama: 'Abdurrahman Wahid', kelasId: 'VII-A', tanggal: '2026-07-15', hari: 'Rabu', bulan: 'Juli', tahun: '2026', status: 'Hadir' },
  
  // Achmad Dani (This student will have exactly 6 Alpa entries to trigger the Wali Kelas threshold!)
  { id: 'a2_1', nisn: '0011223302', nama: 'Achmad Dani', kelasId: 'VII-A', tanggal: '2026-07-13', hari: 'Senin', bulan: 'Juli', tahun: '2026', status: 'Alpa' },
  { id: 'a2_2', nisn: '0011223302', nama: 'Achmad Dani', kelasId: 'VII-A', tanggal: '2026-07-14', hari: 'Selasa', bulan: 'Juli', tahun: '2026', status: 'Alpa' },
  { id: 'a2_3', nisn: '0011223302', nama: 'Achmad Dani', kelasId: 'VII-A', tanggal: '2026-07-15', hari: 'Rabu', bulan: 'Juli', tahun: '2026', status: 'Alpa' },
  { id: 'a2_4', nisn: '0011223302', nama: 'Achmad Dani', kelasId: 'VII-A', tanggal: '2026-07-16', hari: 'Kamis', bulan: 'Juli', tahun: '2026', status: 'Alpa' },
  { id: 'a2_5', nisn: '0011223302', nama: 'Achmad Dani', kelasId: 'VII-A', tanggal: '2026-07-17', hari: 'Jumat', bulan: 'Juli', tahun: '2026', status: 'Alpa' },
  { id: 'a2_6', nisn: '0011223302', nama: 'Achmad Dani', kelasId: 'VII-A', tanggal: '2026-07-18', hari: 'Sabtu', bulan: 'Juli', tahun: '2026', status: 'Alpa' },

  // Aisyah Humaira (Some sick and izin)
  { id: 'a3_1', nisn: '0011223303', nama: 'Aisyah Humaira', kelasId: 'VII-A', tanggal: '2026-07-13', hari: 'Senin', bulan: 'Juli', tahun: '2026', status: 'Hadir' },
  { id: 'a3_2', nisn: '0011223303', nama: 'Aisyah Humaira', kelasId: 'VII-A', tanggal: '2026-07-14', hari: 'Selasa', bulan: 'Juli', tahun: '2026', status: 'Sakit' },
  { id: 'a3_3', nisn: '0011223303', nama: 'Aisyah Humaira', kelasId: 'VII-A', tanggal: '2026-07-15', hari: 'Rabu', bulan: 'Juli', tahun: '2026', status: 'Izin' },

  // Anisa Rahmawati
  { id: 'a4_1', nisn: '0011223304', nama: 'Anisa Rahmawati', kelasId: 'VII-A', tanggal: '2026-07-13', hari: 'Senin', bulan: 'Juli', tahun: '2026', status: 'Hadir' },
  { id: 'a4_2', nisn: '0011223304', nama: 'Anisa Rahmawati', kelasId: 'VII-A', tanggal: '2026-07-14', hari: 'Selasa', bulan: 'Juli', tahun: '2026', status: 'Hadir' },

  // Bambang Pamungkas (Another one with some Alpa)
  { id: 'a5_1', nisn: '0011223305', nama: 'Bambang Pamungkas', kelasId: 'VII-A', tanggal: '2026-07-13', hari: 'Senin', bulan: 'Juli', tahun: '2026', status: 'Hadir' },
  { id: 'a5_2', nisn: '0011223305', nama: 'Bambang Pamungkas', kelasId: 'VII-A', tanggal: '2026-07-14', hari: 'Selasa', bulan: 'Juli', tahun: '2026', status: 'Alpa' },
];

export const DEFAULT_FORMATIF: NilaiFormatif[] = [
  { id: '0011223301_Fikih', nisn: '0011223301', mapel: 'Fikih', uh1: 85, uh2: 88, uh3: 90, uh4: 85, uh5: '', uh6: '' },
  { id: '0011223302_Fikih', nisn: '0011223302', mapel: 'Fikih', uh1: 70, uh2: 65, uh3: '', uh4: '', uh5: '', uh6: '' },
  { id: '0011223303_Fikih', nisn: '0011223303', mapel: 'Fikih', uh1: 95, uh2: 92, uh3: 94, uh4: 98, uh5: '', uh6: '' },
  { id: '0011223304_Fikih', nisn: '0011223304', mapel: 'Fikih', uh1: 80, uh2: 82, uh3: '', uh4: '', uh5: '', uh6: '' },
  
  { id: '0011223301_Matematika', nisn: '0011223301', mapel: 'Matematika', uh1: 80, uh2: 75, uh3: 82, uh4: '', uh5: '', uh6: '' },
  { id: '0011223302_Matematika', nisn: '0011223302', mapel: 'Matematika', uh1: 50, uh2: '', uh3: '', uh4: '', uh5: '', uh6: '' },
];

export const DEFAULT_SUMATIF: NilaiSumatif[] = [
  { id: '0011223301_Fikih', nisn: '0011223301', mapel: 'Fikih', sts: 85, asas: 87 },
  { id: '0011223302_Fikih', nisn: '0011223302', mapel: 'Fikih', sts: 68, asas: 62 },
  { id: '0011223303_Fikih', nisn: '0011223303', mapel: 'Fikih', sts: 92, asas: 95 },
  { id: '0011223304_Fikih', nisn: '0011223304', mapel: 'Fikih', sts: 78, asas: 80 },
];

export const DEFAULT_ALOKASI: AlokasiWaktu[] = [
  { id: 'a1', guruId: 'admin', mapel: 'Fikih', mingguEfektif: 18, jamPerMinggu: 2, totalJam: 36, keterangan: 'Sesuai Kaldik Semester Ganjil' },
  { id: 'a2', guruId: 'guru1', mapel: 'Al Qur`an Hadis', mingguEfektif: 18, jamPerMinggu: 2, totalJam: 36, keterangan: 'Sesuai Kaldik Semester Ganjil' },
  { id: 'a3', guruId: 'wali1', mapel: 'Bahasa Arab', mingguEfektif: 18, jamPerMinggu: 3, totalJam: 54, keterangan: 'Kelas Peminatan & Reguler' },
];

export const DEFAULT_MODUL: ModulAjar[] = [
  { id: 'm1', guruId: 'admin', mapel: 'Fikih', atp: 'https://drive.google.com/file/d/atp_fikih_vii', prota: 'https://drive.google.com/file/d/prota_fikih_vii', promis: 'https://drive.google.com/file/d/promis_fikih_vii', modul: 'https://drive.google.com/file/d/modul_fikih_vii', media: 'https://docs.google.com/presentation/d/media_fikih_vii' },
  { id: 'm2', guruId: 'guru1', mapel: 'Al Qur`an Hadis', atp: 'https://drive.google.com/file/d/atp_qurhad_vii', prota: 'https://drive.google.com/file/d/prota_qurhad_vii', promis: 'https://drive.google.com/file/d/promis_qurhad_vii', modul: 'https://drive.google.com/file/d/modul_qurhad_vii', media: 'Powerpoint Interaktif' },
];

export const DEFAULT_KALDIK: KaldikEvent[] = [
  { id: 'k1', tanggal: '2026-07-13', keterangan: 'Hari Pertama Masuk Sekolah & MATSAMA', tipe: 'KBM' },
  { id: 'k2', tanggal: '2026-08-17', keterangan: 'Hari Kemerdekaan RI ke-81', tipe: 'Libur' },
  { id: 'k3', tanggal: '2026-09-21', keterangan: 'Penilaian Tengah Semester (PTS) Ganjil', tipe: 'Ujian' },
  { id: 'k4', tanggal: '2026-12-07', keterangan: 'Asesmen Sumatif Akhir Semester (ASAS)', tipe: 'Ujian' },
  { id: 'k5', tanggal: '2026-12-21', keterangan: 'Libur Semester Ganjil', tipe: 'Libur' },
];

export const MAPEL_LIST = [
  'Al Qur`an Hadis',
  'Akidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam',
  'Bahasa Arab',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam',
  'Ilmu Pengetahuan Sosial',
  'Bahasa Inggris',
  'PJOK',
  'TIK',
  'Seni Budaya',
  'Aswaja',
  'Program Wali Kelas'
];

export const DEFAULT_JADWAL: JadwalMengajar[] = [
  { id: 'jdw1', hari: 'Senin', jamKe: 1, kelasId: 'VII-A', mapel: 'Fikih', guruId: 'admin' },
  { id: 'jdw2', hari: 'Senin', jamKe: 2, kelasId: 'VII-A', mapel: 'Fikih', guruId: 'admin' },
  { id: 'jdw3', hari: 'Senin', jamKe: 3, kelasId: 'VII-A', mapel: 'Al Qur`an Hadis', guruId: 'guru1' },
  { id: 'jdw4', hari: 'Senin', jamKe: 4, kelasId: 'VII-A', mapel: 'Al Qur`an Hadis', guruId: 'guru1' },
  { id: 'jdw5', hari: 'Selasa', jamKe: 1, kelasId: 'VII-A', mapel: 'Bahasa Arab', guruId: 'wali1' },
  { id: 'jdw6', hari: 'Selasa', jamKe: 2, kelasId: 'VII-A', mapel: 'Bahasa Arab', guruId: 'wali1' },
  { id: 'jdw7', hari: 'Selasa', jamKe: 3, kelasId: 'VII-B', mapel: 'Ilmu Pengetahuan Alam', guruId: 'guru2' },
  { id: 'jdw8', hari: 'Rabu', jamKe: 1, kelasId: 'VIII-A', mapel: 'Fikih', guruId: 'admin' },
  { id: 'jdw9', hari: 'Rabu', jamKe: 2, kelasId: 'VIII-A', mapel: 'Bahasa Indonesia', guruId: 'wali2' },
];

