/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, Download, Info, FileSpreadsheet, Server, FileCode, Play, RefreshCw, CloudLightning, Database, AlertCircle } from 'lucide-react';
import { CODE_GS_CONTENT, INDEX_HTML_CONTENT, JAVASCRIPT_HTML_CONTENT } from '../appsScriptFiles';

interface AppsScriptExportProps {
  appsScriptUrl?: string;
  onUpdateUrl?: (url: string) => void;
  autoSyncEnabled?: boolean;
  onUpdateAutoSync?: (enabled: boolean) => void;
  syncLoading?: boolean;
  syncError?: string | null;
  lastSyncedTime?: string | null;
  onPull?: () => void;
  onPush?: () => void;
}

export default function AppsScriptExport({
  appsScriptUrl = '',
  onUpdateUrl,
  autoSyncEnabled = false,
  onUpdateAutoSync,
  syncLoading = false,
  syncError = null,
  lastSyncedTime = null,
  onPull,
  onPush
}: AppsScriptExportProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'code' | 'index' | 'js'>('guide');
  const [urlInput, setUrlInput] = useState(appsScriptUrl);

  const handleSaveUrl = () => {
    if (onUpdateUrl) {
      onUpdateUrl(urlInput);
      alert('URL Apps Script disimpan!');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-bottom border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <Server className="text-emerald-600 h-6 w-6" />
            Integrasi Google Apps Script & Spreadsheet
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Panduan lengkap pengaturan Google Sheets dan file source code yang siap di-deploy ke Google Apps Script.
          </p>
        </div>
      </div>

      {/* Google Sheets Sync Control Panel */}
      <div className="mb-8 p-5 bg-slate-50/70 rounded-xl border border-slate-200/60 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3.5">
          <CloudLightning className="text-emerald-600 h-4.5 w-4.5" />
          Panel Sinkronisasi Database Google Sheets
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          <div className="lg:col-span-6 space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Google Apps Script Web App URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-slate-700 placeholder:text-slate-300"
              />
              <button
                onClick={handleSaveUrl}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Simpan
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Masukkan URL hasil deploy "Web App" Anda di Google Apps Script editor.
            </p>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kontrol Manual
            </span>
            <div className="flex gap-2">
              <button
                disabled={syncLoading || !appsScriptUrl}
                onClick={() => onPull && onPull()}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                Tarik (Pull)
              </button>
              <button
                disabled={syncLoading || !appsScriptUrl}
                onClick={() => onPush && onPush()}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Database className="h-3.5 w-3.5" />
                Kirim (Push)
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Opsi & Status
            </span>
            <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoSyncToggle"
                  checked={autoSyncEnabled}
                  disabled={!appsScriptUrl}
                  onChange={(e) => onUpdateAutoSync && onUpdateAutoSync(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="autoSyncToggle" className={`text-xs font-semibold ${appsScriptUrl ? 'text-slate-700 cursor-pointer' : 'text-slate-300'}`}>
                  Auto-Sync (Kirim)
                </label>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${appsScriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>
          </div>
        </div>

        {syncError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-800 text-xs font-medium">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <span>Error: {syncError}</span>
          </div>
        )}

        {lastSyncedTime && (
          <div className="mt-3.5 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <Database className="h-3 w-3" />
            Sinkronisasi Terakhir: <span className="text-slate-600">{lastSyncedTime}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          1. Struktur Spreadsheet
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'code'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <FileCode className="h-4 w-4" />
          2. Code.gs (Backend)
        </button>
        <button
          onClick={() => setActiveTab('index')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'index'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <FileCode className="h-4 w-4" />
          3. Index.html (Frontend)
        </button>
        <button
          onClick={() => setActiveTab('js')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'js'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <FileCode className="h-4 w-4" />
          4. JavaScript.html (Client Logic)
        </button>
      </div>

      {activeTab === 'guide' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-900">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="block font-semibold mb-1">Penting sebelum memulai:</strong>
              Aplikasi lokal ini sepenuhnya berfungsi menggunakan penyimpanan <strong>localStorage</strong> di browser Anda (perubahan data akan bertahan selama cache tidak dihapus). Untuk mengintegrasikan dengan Spreadsheet real-time, silakan ikuti petunjuk pembuatan tabel di bawah dan copy-paste source code ke editor Google Apps Script Anda.
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">1</span>
              Buat Spreadsheet Baru & Tambahkan Tab-Tab Berikut
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Silakan buat satu berkas Google Spreadsheet baru di Google Drive Anda. Lalu buat tab-tab (sheet) berikut dan ketikkan nama kolom persis seperti berikut di baris pertama (A1, B1, dst.):
            </p>

            <div className="space-y-4">
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2.5 font-bold text-slate-700 w-1/4">Nama Sheet (Tab)</th>
                      <th className="px-4 py-2.5 font-bold text-slate-700">Nama-Nama Kolom (Header di Baris 1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Profil</td>
                      <td className="px-4 py-3 text-xs">nama, nsm, npsn, alamat, kecamatan, kabupaten, provinsi, pimpinanNama, pimpinanNip, logoUrl, tahunAjaran, semester</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Guru</td>
                      <td className="px-4 py-3 text-xs">id, nuptk, nama, tahunMasuk, password, role, fotoUrl</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Kelas</td>
                      <td className="px-4 py-3 text-xs">id, namaKelas, tingkat, jenisKelas, waliKelasId, jumlahSiswa</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Siswa</td>
                      <td className="px-4 py-3 text-xs">nisn, nama, tingkat, kelasId, status, keteranganMutasi, tanggalMutasi</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">RiwayatSiswa</td>
                      <td className="px-4 py-3 text-xs">nisn, nama, tingkat, kelasId, status, keteranganMutasi, tanggalMutasi</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Mengajar</td>
                      <td className="px-4 py-3 text-xs">id, tingkat, kelasId, mapel, guruId</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Jurnal</td>
                      <td className="px-4 py-3 text-xs">id, tanggal, hari, guruId, mapel, kelasId, materi, metode</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Absensi</td>
                      <td className="px-4 py-3 text-xs">id, nisn, nama, kelasId, tanggal, hari, bulan, tahun, status</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">NilaiFormatif</td>
                      <td className="px-4 py-3 text-xs">id, nisn, mapel, uh1, uh2, uh3, uh4, uh5, uh6</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">NilaiSumatif</td>
                      <td className="px-4 py-3 text-xs">id, nisn, mapel, sts, asas</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">AlokasiWaktu</td>
                      <td className="px-4 py-3 text-xs">id, guruId, mapel, mingguEfektif, jamPerMinggu, totalJam, keterangan</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">ModulAjar</td>
                      <td className="px-4 py-3 text-xs">id, guruId, mapel, atp, prota, promis, modul, media</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Kaldik</td>
                      <td className="px-4 py-3 text-xs">id, tanggal, keterangan, tipe</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/30">Jadwal</td>
                      <td className="px-4 py-3 text-xs">id, hari, jamKe, kelasId, mapel, guruId</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">2</span>
              Langkah Deploy ke Google Apps Script
            </h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-600">
              <li>Di dalam Google Spreadsheet Anda, klik menu <strong>Ekstensi</strong> &gt; <strong>Apps Script</strong>.</li>
              <li>Hapus semua kode bawaan di editor, lalu buat 3 berkas baru:
                <ul className="list-disc pl-5 mt-1.5 space-y-1">
                  <li>Buat file script bernama <strong><code className="bg-slate-100 text-rose-600 px-1 rounded text-xs font-mono">Code.gs</code></strong> (masukkan kode dari tab kedua di atas).</li>
                  <li>Buat file HTML bernama <strong><code className="bg-slate-100 text-rose-600 px-1 rounded text-xs font-mono">Index.html</code></strong> (masukkan kode dari tab ketiga di atas).</li>
                  <li>Buat file HTML bernama <strong><code className="bg-slate-100 text-rose-600 px-1 rounded text-xs font-mono">JavaScript.html</code></strong> (masukkan kode dari tab keempat di atas).</li>
                </ul>
              </li>
              <li>Klik tombol simpan (ikon disket).</li>
              <li>Di sudut kanan atas editor Apps Script, klik tombol <strong>Terapkan (Deploy)</strong> &gt; <strong>Penerapan baru (New Deployment)</strong>.</li>
              <li>Pilih jenis penerapan: <strong>Aplikasi Web (Web App)</strong>.</li>
              <li>Konfigurasikan:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Deskripsi: <code className="bg-slate-100 px-1 rounded text-xs font-mono">Administrasi Guru MTs v1.0</code></li>
                  <li>Jalankan sebagai (Execute as): <strong>Saya (Email Anda / Me)</strong></li>
                  <li>Siapa yang memiliki akses (Who has access): <strong>Siapa saja (Anyone)</strong></li>
                </ul>
              </li>
              <li>Klik <strong>Terapkan (Deploy)</strong>. Berikan izin otorisasi yang diminta (klik <i>Advanced</i> &gt; <i>Go to ... (unsafe)</i> jika peringatan keamanan Google muncul).</li>
              <li>Salin <strong>URL Aplikasi Web</strong> yang diberikan. URL inilah yang merupakan aplikasi web administrasi guru Anda yang dapat diakses oleh seluruh guru madrasah secara real-time!</li>
            </ol>
          </div>
        </div>
      )}

      {(activeTab === 'code' || activeTab === 'index' || activeTab === 'js') && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {activeTab === 'code' ? 'Code.gs (Backend)' : activeTab === 'index' ? 'Index.html' : 'JavaScript.html'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(
                  activeTab === 'code' ? CODE_GS_CONTENT : activeTab === 'index' ? INDEX_HTML_CONTENT : JAVASCRIPT_HTML_CONTENT,
                  activeTab
                )}
                className="px-3 py-1.5 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedFile === activeTab ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Berhasil Disalin!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Salin Kode
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownload(
                  activeTab === 'code' ? 'Code.gs' : activeTab === 'index' ? 'Index.html' : 'JavaScript.html',
                  activeTab === 'code' ? CODE_GS_CONTENT : activeTab === 'index' ? INDEX_HTML_CONTENT : JAVASCRIPT_HTML_CONTENT
                )}
                className="px-3 py-1.5 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh Berkas
              </button>
            </div>
          </div>

          <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-900 text-slate-100 font-mono text-xs">
            <pre className="p-4 overflow-auto max-h-[500px] leading-relaxed select-all">
              {activeTab === 'code' ? CODE_GS_CONTENT : activeTab === 'index' ? INDEX_HTML_CONTENT : JAVASCRIPT_HTML_CONTENT}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
