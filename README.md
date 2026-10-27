# LMS Pembinaan Statistik Sektoral (Satu Data Indonesia)

Aplikasi Web Learning Management System (LMS) resmi untuk **Pembinaan Penyelenggaraan Statistik Sektoral & Evaluasi Penyelenggaraan Statistik Sektoral (EPSS)** yang dibangun secara spesifik mengacu pada standar dokumen rancangan [DESIGN.md](file:///D:/magang/lms_pesbar/DESIGN.md).

---

## 🌟 Fitur Utama & Kepatuhan Terhadap `DESIGN.md`

### 1. Sequential Module Gating (Penguncian Berjenjang)
- **4 Modul Utama**:
  1. *Modul 1: Prinsip Satu Data Indonesia & Regulasi Statistik Sektoral (Perpres 39/2019)*
  2. *Modul 2: Identifikasi Kebutuhan Data & Metadata Statistik (MS-Keg, MS-Var, MS-Ind)*
  3. *Modul 3: Manajemen Kualitas Data & Rekomendasi Statistik (ROMANTIK & GSBPM)*
  4. *Modul 4: Diseminasi, Interoperabilitas API, & Evaluasi Penyelenggaraan Statistik Sektoral (EPSS/IPS)*
- **State Matriks UI Eksplisit**:
  - `LOCKED`: Modul abu-abu dengan pesan prasyarat kelulusan modul sebelumnya dan tombol aksi nonaktif.
  - `ACTIVE`: Border kiri biru (`#2563EB`), badge "Sedang Berjalan", metrik progres, dan tombol aksi "Lanjutkan Belajar →".
  - `COMPLETED`: Border kiri hijau (`#10B981`), badge "Selesai", skor Post-Test tersimpan, dan tombol "👁️ Review Modul".

### 2. Internal Sub-Step Gating (Alur Terpandu per Modul)
- **Tahap 1: Presensi & Pre-Test**
  - Kartu Presensi dengan checkbox wajib centang dan pencatatan *timestamp* otomatis.
  - Pengerjaan Pre-Test hanya diizinkan **1 kali**.
  - Validasi UI: tombol pengiriman hanya aktif jika presensi tercentang dan seluruh soal telah dipilih.
  - Modal konfirmasi pengiriman serta mode review otomatis pasca pengiriman (seluruh pilihan dikunci dan kunci jawaban ditampilkan).
- **Tahap 2: Materi Pembelajaran**
  - Pemutar video responsif rasio 16:9 (`aspect-video`) berlatar gelap (`bg-slate-900`) dengan seekbar simulasi dan kontrol durasi.
  - Tab ringkasan teknis materi dan poin-poin kompetensi utama.
  - Daftar berkas unduhan resmi berformat PDF (merah), PPT (oranye), dan XLSX (hijau) lengkap dengan tombol unduh berkas langsung.
  - Tombol footer: "Lanjut ke Post-Test →" yang menandai tahapan materi selesai.
- **Tahap 3: Post-Test & Logika Retake**
  - Ambang batas kelulusan (KKM minimal 75).
  - Penghitung percobaan (*Attempt Counter*).
  - Mode Gagal (< 75): Alert card kuning/merah, tabel riwayat percobaan (*Attempt History*), tombol "🔄 Ulangi Post-Test Sekarang" dan "📘 Pelajari Ulang Materi".
  - Mode Lulus (≥ 75): Alert card hijau, nilai akhir tersimpan, pembukaan kunci otomatis modul berikutnya dengan notifikasi *toast*, serta daftar soal mode review *read-only* dengan kunci dan pembahasan.

### 3. Final Evaluation & Otomasi Sertifikat Resmi
- **Ujian Akhir Komprehensif (Final Exam)**:
  - Terbuka hanya jika Modul 1 sampai Modul 4 telah tuntas.
  - 10 butir soal komprehensif dengan ambang batas kelulusan (KKM minimal 80).
  - Menampilkan riwayat percobaan dan animasi selebrasi (*confetti*) saat dinyatakan lulus.
- **Sertifikat Kelulusan Resmi (A4 Landscape / 16:9)**:
  - Kop instansi Badan Pusat Statistik & Komite Satu Data Indonesia.
  - Nomor sertifikat unik berformat JetBrains Mono (`PSS/2026/SDI-...`).
  - Barcode / QR Code verifikasi keaslian digital.
  - Tanda tangan elektronik tersertifikasi BSrE.
  - Tombol **🖨️ Cetak Sertifikat** (`window.print`) dan **⬇ Unduh Sertifikat (PDF)** resolusi tinggi berbasis `html2canvas` & `jspdf`.
  - Formulir penyesuaian nama lengkap, gelar, NIP, dan nama instansi secara langsung.

### 4. Simulator Demo & Pengujian Cepat
- Menu **Simulator Demo** pada navbar atas memungkinkan penguji untuk berpindah keadaan secara instan:
  - *Mulai dari Awal (Modul 1 Aktif)*
  - *Modul 1 Lulus → Modul 2 Aktif*
  - *Modul 1-3 Lulus → Modul 4 Aktif*
  - *Semua Modul Lulus → Buka Final Exam*
  - *Tuntas 100% (Sertifikat Siap Cetak)*
  - *Reset Seluruh Data Progres*
- Penyimpanan persisten otomatis di `localStorage` sehingga progres dan draft jawaban tidak hilang saat halaman di-refresh (*Accidental Navigation Guard*).

---

## 🛠️ Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js (v18+)
- npm

### Menjalankan Server Pengembangan:
```bash
npm run dev
```
Buka peramban di: **`http://localhost:5173/`**

### Melakukan Build Produksi:
```bash
npm run build
npm run preview
```
