# UI/UX Design Specification (`design.md`)
**Nama Proyek:** LMS Pembinaan Statistik Sektoral  
**Versi Dokumen:** 1.0.0  
**Fokus Utama:** Sequential Module Gating, Evaluasi Berjenjang (Pre-Test, Post-Test, Final Exam), & Otomasi Sertifikat  

---

## 1. Filosofi & Prinsip Desain

1. **Guided Sequential Flow (Alur Terpandu Tanpa Distraksi)**
   Antarmuka harus secara eksplisit menunjukkan posisi pengguna saat ini, tahapan apa yang sudah diselesaikan, dan syarat apa yang harus dipenuhi untuk membuka tahapan berikutnya (*sequential gating*).
2. **Explicit State Visibility (Transparansi Status & Mode Review)**
   Setiap modul dan sub-tahapan wajib memiliki pembeda visual yang tegas antara status **Terkunci (`Locked`)**, **Aktif (`Active`)**, **Gagal/Wajib Ulang (`Failed/Retake`)**, dan **Lulus/Mode Review (`Completed/Review`)**.
3. **Institutional Clarity (Bersih, Formal, dan Aksesibel)**
   Mengadopsi estetika instansi statistik modern yang mengutamakan keterbacaan tipografi, kontras data yang jelas pada *Dashboard*, serta kenyamanan fokus jangka panjang pada *Workspace* belajar.

---

## 2. Design System & Tokens

### 2.1 Palet Warna (*Color Tokens*)
Menggunakan sistem warna berbasis semantik untuk memetakan status progres dan evaluasi peserta secara konsisten.

| Token | Kategori | Kode Hex | Tailwind Equivalent | Penggunaan Utama |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-canvas` | Surface | `#F8FAFC` | `slate-50` | Latar belakang utama halaman (*Dashboard* & ruang kerja) |
| `--bg-surface` | Surface | `#FFFFFF` | `white` | Kartu modul, panel soal, *sidebar*, dan *navbar* |
| `--bg-locked` | Surface | `#F1F5F9` | `slate-100` | Latar kartu modul/tahapan yang masih terkunci |
| `--text-primary` | Typography | `#0F172A` | `slate-900` | Judul halaman, judul modul, teks soal utama |
| `--text-secondary`| Typography | `#475569` | `slate-600` | Deskripsi modul, instruksi pengerjaan, metadata file |
| `--text-muted` | Typography | `#94A3B8` | `slate-400` | Label elemen yang terkunci (`disabled`) |
| `--brand-primary` | Primary Accent | `#2563EB` | `blue-600` | Modul aktif, tombol aksi utama (CTA), *progress bar* |
| `--brand-hover` | Primary Accent | `#1D4ED8` | `blue-700` | *Hover state* pada tombol utama |
| `--state-success` | Semantic | `#10B981` | `emerald-500` | Status Lulus, *badge* Selesai, jawaban benar di *Mode Review* |
| `--state-warning` | Semantic | `#F59E0B` | `amber-500` | Peringatan belum lulus ambang batas (*Retake Required*) |
| `--state-danger` | Semantic | `#EF4444` | `red-500` | Indikator skor di bawah KKM / jawaban salah |
| `--accent-gold` | Certificate | `#D97706` | `amber-600` | Aksen visual *Final Exam* lulus & Sertifikat Pelatihan |

### 2.2 Tipografi (*Typography Scale*)
* **Primary Font Family:** `Plus Jakarta Sans` atau `Inter`, *sans-serif* (Antarmuka utama & materi bacaan).
* **Monospace Font Family:** `JetBrains Mono` (Angka skor ujian, durasi video, nomor sertifikat).

| Elemen | Ukuran (`rem` / `px`) | Ketebalan (*Weight*) | Line Height | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `1.5rem` (24px) | `700` (Bold) | `2rem` | Judul Halaman Utama & Banner Sertifikat |
| **Heading 2 (H2)** | `1.25rem` (20px) | `700` (Bold) | `1.75rem` | Judul Modul Aktif & Header Seksi Dashboard |
| **Heading 3 (H3)** | `1rem` (16px) | `600` (SemiBold) | `1.5rem` | Judul Kartu Modul, Judul Sub-Tahapan |
| **Body Default** | `0.9375rem` (15px) | `400` (Regular) | `1.6rem` | Naskah soal Pre-Test/Post-Test & deskripsi |
| **Caption / Badge**| `0.75rem` (12px) | `600` (SemiBold) | `1rem` | *Badge* status (`TERKUNCI`, `LULUS`, `MODE REVIEW`) |

### 2.3 Spasi, Border, & Elevasi
* **Border Radius:**
  * Kartu & Panel Utama: `12px` (`rounded-xl`)
  * Tombol & Input Pilihan Ganda: `8px` (`rounded-lg`)
  * Status Badge / Pill: `9999px` (`rounded-full`)
* **Border Default:** `1px solid #E2E8F0` (`border-slate-200`)
* **Active Focus Ring:** `2px solid #3B82F6` dengan offset `2px` (`ring-2 ring-blue-500`)
* **Shadow:** `0 1px 3px 0 rgba(15, 23, 42, 0.06)` (`shadow-sm` untuk kartu statis, `shadow-md` untuk kartu modul aktif).

---

## 3. Arsitektur Informasi & Struktur Navigasi

```text
LMS Pembinaan Statistik Sektoral
├── 1. Top Navigation Bar (Global)
│   ├── Brand / Identitas Instansi
│   ├── Quick Switcher: [Dashboard Progres] | [Ruang Belajar]
│   └── Profil Peserta & Indikator Progres Global (%)
│
├── 2. Halaman Dashboard Progres Peserta (Default Landing View)
│   ├── Hero Progress Banner (Persentase & Bar Penyelesaian Modul 1–4)
│   ├── 4 KPI Summary Cards (Modul Tuntas, Rata-rata Post-Test, Status Final Exam, Status Sertifikat)
│   ├── Daftar Modul Berjenjang (Modul 1 s.d. Modul 4)
│   └── Panel Evaluasi Akhir (Kartu Final Exam & Kartu Unduh Sertifikat)
│
└── 3. Halaman Belajar / Module Workspace (Split-Screen View)
    ├── Sub-Header Kontekstual (Tombol Kembali ke Dashboard, Nama Modul Aktif, Dropdown Pindah Modul)
    ├── Left Sidebar Navigation (Sequential Internal Steps)
    │   ├── Tahap 1: Presensi & Pre-Test
    │   ├── Tahap 2: Materi Pembelajaran
    │   ├── Tahap 3: Post-Test (Ambang Batas)
    │   └── Footer Sidebar: CTA Lanjut ke Modul Berikutnya
    └── Right Main Content Canvas (Dynamic View berdasarkan Tahap Aktif)
```

---

## 4. Spesifikasi Layout & Responsivitas

### 4.1 Halaman Dashboard Progres
* **Max Container Width:** `1200px` (`max-w-6xl`), terpusat (`mx-auto`) dengan *padding* horizontal `24px`.
* **KPI Grid:**
  * Desktop (`>= 1024px`): 4 kolom (`grid-cols-4`, `gap-4`).
  * Tablet (`768px - 1023px`): 2 kolom (`grid-cols-2`).
  * Mobile (`< 768px`): 1 kolom (`grid-cols-1`).
* **Daftar Modul:** Susunan vertikal 1 kolom penuh (`space-y-4`) untuk menegaskan urutan pengerjaan dari atas ke bawah (Modul 1 hingga Modul 4).

### 4.2 Halaman Belajar (*Split-Screen Workspace*)
* **Desktop (`>= 1024px`):**
  * **Left Sidebar:** Lebar tetap `300px` (`w-[300px] shrink-0`), posisi `sticky` di bawah *navbar* (`top-16 h-[calc(100vh-4rem)]`).
  * **Main Content Canvas:** Lebar fleksibel (`flex-1`), area baca dibatasi hingga `840px` agar baris kalimat soal dan ukuran video tetap ergonomis.
* **Tablet & Mobile (`< 1024px`):**
  * Sidebar kiri berubah menjadi **Collapsible Top Stepper Bar** atau **Slide-over Drawer** sehingga layar ponsel fokus menampilkan soal/materi secara penuh.

---

## 5. Spesifikasi Komponen & Matriks State UI

### 5.1 Komponen Kartu Modul (di Dashboard)
Setiap kartu modul memiliki 3 kemungkinan kondisi visual (*state*):

| State | Indikator Visual | Konten Metrik yang Ditampilkan | Tombol Aksi (CTA) |
| :--- | :--- | :--- | :--- |
| **`LOCKED`** | Latar `#F1F5F9`, opasitas `65%`, ikon `🔒` abu-abu. | Pesan prasyarat: *"Selesaikan dan lulus Post-Test pada Modul [N-1] untuk membuka modul ini."* | Nonaktif (`disabled`, tanpa tombol klik). |
| **`ACTIVE`** | Latar putih, *border* kiri `4px solid #2563EB`, *badge* biru `Sedang Berjalan`. | Status sub-tahap terkini (Presensi, Skor Pre-Test, Status Materi, Status Post-Test). | Tombol Primer: **`Lanjutkan Belajar →`** |
| **`COMPLETED`**| Latar putih, *border* kiri `4px solid #10B981`, *badge* hijau `Selesai`. | Status Presensi (`Hadir`), Skor Pre-Test, dan Skor Lulus Post-Test. | Tombol Sekunder (Outline): **`👁️ Review Modul`** |

---

### 5.2 Komponen Sidebar Tahapan Internal Modul
Mengatur penguncian berjenjang di dalam satu modul (*Internal Sub-Step Gating*):

1. **Item `1. Presensi & Pre-Test`**
   * **State Awal:** `ACTIVE` (terbuka otomatis saat modul terbuka).
   * **State Selesai:** Berubah menjadi `COMPLETED` dengan label kecil `[Mode Review]` dan menampilkan skor Pre-Test.
2. **Item `2. Materi Pembelajaran`**
   * **State Awal:** `LOCKED` selama Pre-Test belum disubmit.
   * **State Terbuka:** `ACTIVE` begitu Pre-Test disubmit; berubah menjadi `COMPLETED` setelah pengguna mengakses materi/klik lanjut ke Post-Test.
3. **Item `3. Post-Test`**
   * **State Awal:** `LOCKED` selama halaman Materi belum diselesaikan.
   * **State Aktif (Belum Lulus):** Menampilkan *badge* kuning `Ambang Batas: 75` (atau nilai KKM yang ditentukan).
   * **State Lulus:** Menampilkan *badge* hijau `Lulus • Nilai: [Skor]` dan label `[Mode Review]`.

---

### 5.3 Spesifikasi View Tahap 1: Presensi & Pre-Test
* **Komponen Kartu Presensi:**
  * Berada di bagian paling atas kanvas sebelum daftar soal Pre-Test.
  * Berisi *checkbox* wajib centang: *"Saya menyatakan hadir dan mengikuti pembelajaran pada modul ini."*
  * Menampilkan *timestamp* otomatis saat pengguna mencentang atau mengirim formulir.
* **Komponen Soal Pre-Test:**
  * Menampilkan daftar soal pilihan ganda dengan indikator nomor soal.
  * **Aturan Validasi UI:** Tombol **`Kirim Presensi & Pre-Test`** hanya aktif (`enabled`) apabila *checkbox* presensi telah dicentang dan seluruh soal Pre-Test telah dipilih jawabannya.
* **Transisi ke Mode Review (Setelah Submit):**
  * Muncul *dialog* konfirmasi sebelum pengiriman karena Pre-Test hanya dapat dikerjakan **1 kali**.
  * Setelah disubmit, seluruh *radio button* dikunci (`disabled`), tombol *Submit* dihilangkan, dan muncul *banner* informasi biru di bagian atas:
    > **Mode Review Pre-Test:** Presensi Anda telah tercatat dan Pre-Test telah diselesaikan dengan skor **[X]**. Anda dapat meninjau kembali jawaban Anda di bawah ini atau melanjutkan ke Materi Pembelajaran.

---

### 5.4 Spesifikasi View Tahap 2: Materi Pembelajaran
* **Komponen Pemutar Video (*Embedded Video Player*):**
  * Rasio aspek `16:9` responsif (`aspect-video`) dengan latar gelap (`bg-slate-900`), kontrol *play/pause*, durasi, *seekbar*, dan layar penuh (*fullscreen*).
* **Komponen Daftar Unduhan Materi (*Downloadable Resources*):**
  * Ditampilkan dalam bentuk daftar kartu horizontal di bawah video.
  * Setiap kartu wajib menampilkan:
    1. **Ikon & Badge Format File:** PDF (`merah`), PPT/PPTX (`oranye`), Video MP4 (`biru`).
    2. **Nama Dokumen & Metadata:** Judul file beserta ukuran file (contoh: `3.4 MB`).
    3. **Tombol Unduh Eksplisit:** Tombol **`⬇ Unduh File`** di sisi kanan kartu.
* **Footer Navigasi Materi:**
  * Tombol **`Lanjut ke Post-Test →`** di bagian kanan bawah yang sekaligus menandai tahapan Materi sebagai `Selesai`.

---

### 5.5 Spesifikasi View Tahap 3: Post-Test & Logika Retake
Komponen ini memiliki 3 tampilan kondisional utama:

1. **Mode Pengerjaan (*Taking / Retaking Mode*)**
   * Header menampilkan informasi **Ambang Batas Kelulusan (contoh: Minimal 75)** dan **Percobaan Ke-N**.
   * Daftar soal pilihan ganda aktif dan dapat dipilih.
2. **Mode Hasil: Tidak Lolos Ambang Batas (`Score < Passing Grade`)**
   * Menampilkan **Alert Card Berwarna Kuning/Merah (`--state-warning` / `--state-danger`)**:
     * Judul: *"Belum Mencapai Ambang Batas Kelulusan"*
     * Detail: Menampilkan skor yang baru diperoleh vs skor minimal kelulusan.
     * Penjelasan aturan: *"Anda dapat mengulangi Post-Test ini sampai lulus. Nilai akhir yang disimpan adalah nilai pada saat Anda dinyatakan lulus."*
   * **Action Buttons:**
     * Tombol Primer: **`🔄 Ulangi Post-Test Sekarang`** (Mereset form soal untuk percobaan berikutnya).
     * Tombol Sekunder: **`📘 Pelajari Ulang Materi`** (Mengembalikan tampilan ke Tahap 2).
   * Menampilkan tabel kecil **Riwayat Percobaan (*Attempt History*)** agar peserta mengetahui progres percobaannya.
3. **Mode Hasil: Lolos Ambang Batas (`Score >= Passing Grade` — Terkunci & Mode Review)**
   * Menampilkan **Alert Card Berwarna Hijau (`--state-success`)**:
     * Judul: *"Selamat! Anda Lulus Post-Test Modul [N]"*
     * Detail: Menampilkan **Nilai Akhir Tersimpan** (nilai saat lulus).
     * Informasi penguncian: *"Post-Test telah dikunci dan tidak dapat diulang kembali. Modul selanjutnya kini telah terbuka."*
   * **Action Button Utama:** **`🔓 Lanjut ke Modul [N+1] →`** (Atau **`Lanjut ke Final Exam →`** jika berada di Modul 4).
   * **Daftar Soal Mode Review (Read-Only):**
     * Di bawah *banner* kelulusan, seluruh soal ditampilkan kembali dalam kondisi terkunci (`read-only`), memperlihatkan jawaban yang dipilih peserta beserta indikator status jawaban (`✅ Benar` / `❌ Salah`).

---

### 5.6 Spesifikasi View Tahap Akhir: Final Exam & Sertifikat
* **Halaman Final Exam:**
  * Hanya dapat diakses apabila `Modul 1`, `Modul 2`, `Modul 3`, dan `Modul 4` seluruhnya berstatus `COMPLETED`.
  * Menggunakan pola evaluasi yang sama dengan Post-Test (mendukung pengulangan hingga mencapai ambang batas kelulusan ujian akhir).
* **Tampilan Sertifikat Pelatihan:**
  * Terbuka otomatis begitu peserta dinyatakan **Lulus Final Exam**.
  * Menyediakan **Pratinjau Sertifikat Visual (16:9 / A4 Landscape)** yang memuat:
    * Kop/Identitas Penyelenggara Pembinaan Statistik Sektoral.
    * Nama Lengkap Peserta & Nomor Unik Sertifikat.
    * Pernyataan kelulusan seluruh modul dan ujian akhir beserta tanggal terbit.
  * Menyediakan tombol **`⬇ Unduh Sertifikat (PDF)`** dan **`🖨️ Cetak Sertifikat`**.

---

## 6. Micro-Interactions, Feedback, & Edge Cases

1. **PencegahanKehilangan Jawaban (*Accidental Navigation Guard*)**
   * Selama peserta sedang memilih jawaban pada Pre-Test, Post-Test, atau Final Exam dan belum menekan tombol *Submit*, simpan draf pilihan sementara di *state* lokal (`sessionStorage`/`localStorage`) agar jawaban tidak hilang jika halaman tidak sengaja ter-*refresh*.
2. **Modal Konfirmasi Pengiriman Ujian**
   * Saat menekan tombol *Submit* pada Pre-Test atau Post-Test, tampilkan validasi singkat apabila masih ada soal yang belum terjawab (*scroll* otomatis ke nomor soal yang masih kosong).
3. **Efek Buka Kunci (*Unlock Feedback*)**
   * Saat peserta lulus Post-Test pada Modul $N$, perbarui indikator gembok pada sidebar bawah dan kartu Modul $N+1$ di Dashboard secara instan disertai notifikasi *toast* singkat: *"Modul [N+1] berhasil dibuka!"*.
4. **Standar Aksesibilitas (WCAG 2.1 AA)**
   * Jangan pernah mengandalkan warna saja untuk membedakan status: selalu pasangkan warna hijau/merah/abu-abu dengan ikon eksplisit (`🔒` Terkunci, `🔵` Aktif, `✅` Selesai/Benar, `⚠️` Mengulang) serta label teks yang jelas.