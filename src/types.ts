/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profil {
  nama: string;
  nsm: string;
  npsn: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  pimpinanNama: string;
  pimpinanNip: string;
  logoUrl: string;
  tahunAjaran: string;
  semester: string;
}

export interface Guru {
  id: string; // matches username during login
  nuptk: string;
  nama: string;
  tahunMasuk: string;
  password: string;
  role: 'Admin' | 'Guru' | 'Wali Kelas';
  fotoUrl?: string;

  // New optional fields for IDENTITAS DIRI
  tempatLahir?: string;
  tanggalLahir?: string;
  tmtGuru?: string;
  nrg?: string;
  masaKerja?: string;
  jenisKelamin?: 'Laki-laki' | 'Perempuan' | '';
  pendidikanTerakhir?: string;
  mapelSatmingkal?: string;
  jamMengajarPerMinggu?: number;
  namaLembagaLain?: string;
  jamTambahan?: number;
  tugasTambahan1?: string;
  tugasTambahan2?: string;
  tugasTambahan3?: string;
  tmtTugasTambahan?: string;

  // New optional fields for IDENTITAS PENDAMPING
  namaPendamping?: string;
  periodePengumpulan?: string;
}

export interface Kelas {
  id: string; // unique ID
  namaKelas: string; // e.g., "VII-A"
  tingkat: 'VII' | 'VIII' | 'IX';
  jenisKelas: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  waliKelasId: string; // matching Guru.id
  jumlahSiswa: number;
}

export interface Siswa {
  nisn: string;
  nama: string;
  tingkat: 'VII' | 'VIII' | 'IX';
  kelasId: string; // matching Kelas.id
  status: 'Aktif' | 'Mutasi Masuk' | 'Mutasi Keluar';
  keteranganMutasi?: string;
  tanggalMutasi?: string;
}

export interface MengajarMapel {
  id: string;
  tingkat: 'VII' | 'VIII' | 'IX';
  kelasId: string; // matching Kelas.id
  mapel: string;
  guruId: string; // matching Guru.id
}

export interface JurnalMengajar {
  id: string;
  tanggal: string; // YYYY-MM-DD
  hari: string; // e.g., "Senin"
  guruId: string;
  mapel: string;
  kelasId: string;
  materi: string;
  metode: string;
}

export interface Absensi {
  id: string;
  nisn: string;
  nama: string;
  kelasId: string;
  tanggal: string; // YYYY-MM-DD
  hari: string;
  bulan: string; // Name of month e.g., "Juli"
  tahun: string; // YYYY
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
}

export interface NilaiFormatif {
  id: string; // nisn + mapel
  nisn: string;
  nama?: string;
  kelasId?: string;
  mapel: string;
  uh1: number | '';
  uh2: number | '';
  uh3: number | '';
  uh4: number | '';
  uh5: number | '';
  uh6: number | '';
}

export interface NilaiSumatif {
  id: string; // nisn + mapel
  nisn: string;
  nama?: string;
  kelasId?: string;
  mapel: string;
  sts: number | ''; // Penilaian Tengah Semester / STS
  asas: number | ''; // Asesmen Sumatif Akhir Semester / ASAS
}

export interface AlokasiWaktu {
  id: string;
  guruId: string;
  mapel: string;
  mingguEfektif: number;
  jamPerMinggu: number;
  totalJam: number;
  keterangan: string;
}

export interface ModulAjar {
  id: string;
  guruId: string;
  mapel: string;
  atp: string; // link / text
  prota: string; // link / text
  promis: string; // link / text
  modul: string; // link / text
  media: string; // link / text
}

export interface KaldikEvent {
  id: string;
  tanggal: string; // YYYY-MM-DD
  keterangan: string;
  tipe: 'Libur' | 'Ujian' | 'KBM' | 'Lainnya';
}

export interface JadwalMengajar {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: number; // e.g., 1, 2, 3, 4, 5, 6
  kelasId: string;
  mapel: string;
  guruId: string;
}

