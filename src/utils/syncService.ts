/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from '../types';

export interface FullDatabase {
  profil: Profil;
  guru: Guru[];
  kelas: Kelas[];
  siswa: Siswa[];
  riwayatSiswa: Siswa[];
  mengajar: MengajarMapel[];
  jurnal: JurnalMengajar[];
  absensi: Absensi[];
  nilaiFormatif: NilaiFormatif[];
  nilaiSumatif: NilaiSumatif[];
  alokasiWaktu: AlokasiWaktu[];
  modulAjar: ModulAjar[];
  kaldik: KaldikEvent[];
  jadwal: JadwalMengajar[];
}

const URL_STORAGE_KEY = 'mts_apps_script_url';
const AUTO_SYNC_KEY = 'mts_apps_script_auto_sync';

export function getAppsScriptUrl(): string {
  return localStorage.getItem(URL_STORAGE_KEY) || '';
}

export function setAppsScriptUrl(url: string): void {
  localStorage.setItem(URL_STORAGE_KEY, url.trim());
}

export function getAutoSync(): boolean {
  return localStorage.getItem(AUTO_SYNC_KEY) === 'true';
}

export function setAutoSync(value: boolean): void {
  localStorage.setItem(AUTO_SYNC_KEY, value ? 'true' : 'false');
}

/**
 * Mengirim data ke Apps Script Web App dengan format text/plain payload JSON
 * untuk menghindari masalah CORS Preflight OPTIONS request di beberapa browser.
 */
async function sendRequest(url: string, payload: any): Promise<any> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('URL Google Apps Script tidak valid atau kosong.');
  }

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.error('Apps Script API Request Error:', error);
    throw new Error(error.message || 'Gagal berkomunikasi dengan Google Apps Script.');
  }
}

/**
 * Mengambil seluruh database dari Google Sheet
 */
export async function fetchDatabaseFromSheet(url: string): Promise<FullDatabase> {
  if (typeof url !== 'string') {
    throw new Error('URL Google Apps Script tidak valid.');
  }
  const cleanUrl = url.trim();
  // Karena doGet lebih mudah untuk mengambil data sederhana via query params
  // Tapi doPost juga bisa jika ingin lebih aman. Mari gunakan URL GET:
  const getUrl = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=getDatabase`;

  try {
    const response = await fetch(getUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    return {
      profil: data.profil || {},
      guru: data.guru || [],
      kelas: data.kelas || [],
      siswa: data.siswa || [],
      riwayatSiswa: data.riwayatSiswa || [],
      mengajar: data.mengajar || [],
      jurnal: data.jurnal || [],
      absensi: data.absensi || [],
      nilaiFormatif: data.nilaiFormatif || [],
      nilaiSumatif: data.nilaiSumatif || [],
      alokasiWaktu: data.alokasiWaktu || [],
      modulAjar: data.modulAjar || [],
      kaldik: data.kaldik || [],
      jadwal: data.jadwal || []
    };
  } catch (error: any) {
    console.error('fetchDatabaseFromSheet Error:', error);
    throw new Error(error.message || 'Gagal menarik data dari Google Sheets. Pastikan URL Web App benar dan telah di-deploy dengan akses "Anyone".');
  }
}

/**
 * Menyinkronkan seluruh database lokal ke Google Sheet (Overwrite)
 */
export async function pushDatabaseToSheet(url: string, db: FullDatabase): Promise<any> {
  return sendRequest(url, {
    action: 'syncAll',
    data: db
  });
}

/**
 * Mengirimkan aksi tunggal untuk update/delete data agar sinkronisasi lebih cepat
 */
export async function pushActionToSheet(url: string, action: string, payload: any): Promise<any> {
  return sendRequest(url, {
    action,
    ...payload
  });
}
