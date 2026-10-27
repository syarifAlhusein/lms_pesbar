import { ModuleData, FinalExamData, CourseData } from '../types/lms';

export const MODULES_DATA: ModuleData[] = [
  {
    id: 1,
    courseId: 'pss-2026',
    number: 1,
    code: "PSS-MOD-01",
    title: "Prinsip Satu Data Indonesia & Regulasi Statistik Sektoral",
    subtitle: "Pondasi Hukum, Kelembagaan, dan 4 Prinsip Dasar SDI bagi Walidata & Produsen Data",
    description: "Memahami kerangka regulasi Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia, peran Pembina Data (BPS), Walidata (Diskominfo), dan Produsen Data (OPD), serta tata kelola penyelenggaraan statistik sektoral yang akuntabel.",
    category: "Tata Kelola & Regulasi",
    estimatedDuration: "45 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1", // Can be replaced or custom simulated
      videoTitle: "Kuliah Umum: Urgensi Statistik Sektoral dalam Kerangka Satu Data Indonesia",
      videoDuration: "18:42",
      summary: `Materi ini mengupas tuntas arsitektur Satu Data Indonesia (SDI) yang diatur dalam Perpres 39/2019. Terdapat 4 pilar/prinsip utama SDI:
1. Memenuhi Standar Data (konsep, definisi, cakupan, klasifikasi, ukuran, satuan).
2. Memiliki Metadata Baku (metadata kegiatan, variabel, dan indikator).
3. Memenuhi Kaidah Interoperabilitas Data (kemampuan sistem untuk saling berbagi pakai dengan format terbuka).
4. Menggunakan Kode Referensi dan/atau Data Induk yang disepakati secara nasional.

Dalam ekosistem daerah, BPS bertindak sebagai Pembina Data Statistik, Dinas Komunikasi dan Informatika (Diskominfo) sebagai Walidata Daerah, Bappeda sebagai Koordinator Forum SDI Daerah, dan Perangkat Daerah (OPD) sebagai Produsen Data.`,
      learningPoints: [
        "Definisi dan klasifikasi statistik dasar, sektoral, dan khusus berdasarkan UU No. 16 Tahun 1997.",
        "Struktur peran 4 pilar kelembagaan Satu Data Indonesia di tingkat daerah.",
        "Penerapan 4 Prinsip Satu Data Indonesia dalam produksi data statistik sektoral.",
        "Sanksi dan mitigasi duplikasi anggaran pengumpulan data sektoral antar dinas."
      ],
      resources: [
        {
          id: "res-1-1",
          title: "Perpres Nomor 39 Tahun 2019 tentang Satu Data Indonesia",
          format: "PDF",
          size: "2.4 MB",
          url: "#",
          badgeColor: "red",
          description: "Salinan regulasi resmi payung hukum tata kelola Satu Data Indonesia."
        },
        {
          id: "res-1-2",
          title: "Slide Paparan: Peran Kelembagaan Forum Satu Data Daerah",
          format: "PPT",
          size: "5.8 MB",
          url: "#",
          badgeColor: "orange",
          description: "Bahan tayang pembinaan walidata dan produsen data lingkup pemerintah daerah."
        },
        {
          id: "res-1-3",
          title: "Panduan Praktis Pembagian Tugas Walidata & Produsen Data OPD",
          format: "PDF",
          size: "1.2 MB",
          url: "#",
          badgeColor: "red",
          description: "Checklist operasional verifikasi data sebelum disebarluaskan ke portal data."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 101,
        question: "Berdasarkan UU No. 16 Tahun 1997 tentang Statistik, statistik yang pemanfaatannya ditujukan untuk memenuhi kebutuhan instansi tertentu dalam rangka penyelenggaraan tugas-tugas pemerintahan dan pembangunan disebut...",
        options: [
          { id: "A", text: "Statistik Dasar" },
          { id: "B", text: "Statistik Sektoral" },
          { id: "C", text: "Statistik Khusus" },
          { id: "D", text: "Statistik Primer" }
        ],
        correctAnswer: "B",
        explanation: "Statistik sektoral adalah statistik yang pemanfaatannya ditujukan untuk memenuhi kebutuhan instansi tertentu dalam rangka penyelenggaraan tugas pemerintahan dan pembangunan."
      },
      {
        id: 102,
        question: "Dalam struktur penyelenggaraan Satu Data Indonesia di tingkat pemerintah daerah, instansi yang bertindak sebagai Walidata Daerah adalah...",
        options: [
          { id: "A", text: "Badan Perencanaan Pembangunan Daerah (Bappeda)" },
          { id: "B", text: "Badan Pusat Statistik (BPS) Kabupaten/Kota" },
          { id: "C", text: "Dinas Komunikasi dan Informatika (Diskominfo)" },
          { id: "D", text: "Inspektorat Daerah" }
        ],
        correctAnswer: "C",
        explanation: "Berdasarkan Perpres 39/2019, di tingkat daerah Walidata dijabat oleh Dinas yang menyelenggarakan urusan komunikasi dan informatika (Diskominfo), sedangkan Bappeda bertindak sebagai Koordinator Forum SDI dan BPS sebagai Pembina Data."
      },
      {
        id: 103,
        question: "Berikut ini yang BUKAN merupakan salah satu dari 4 Prinsip Satu Data Indonesia (SDI) adalah...",
        options: [
          { id: "A", text: "Memenuhi Standar Data" },
          { id: "B", text: "Memiliki Metadata" },
          { id: "C", text: "Memenuhi Interoperabilitas Data" },
          { id: "D", text: "Disimpan dalam format proprietary berbayar" }
        ],
        correctAnswer: "D",
        explanation: "Prinsip ke-4 SDI adalah menggunakan Kode Referensi dan/atau Data Induk, serta prinsip ke-3 menuntut format terbuka yang dapat dibagipakaikan (interoperabel), bukan format proprietary tertutup."
      },
      {
        id: 104,
        question: "Siapakah yang bertindak sebagai Pembina Data Statistik dalam penyelenggaraan Satu Data Indonesia?",
        options: [
          { id: "A", text: "Badan Pusat Statistik (BPS)" },
          { id: "B", text: "Badan Informasi Geospasial (BIG)" },
          { id: "C", text: "Kementerian Keuangan" },
          { id: "D", text: "Kementerian PAN-RB" }
        ],
        correctAnswer: "A",
        explanation: "BPS ditetapkan sebagai Pembina Data Statistik sesuai Pasal 11 Perpres No. 39 Tahun 2019."
      }
    ],
    postTestQuestions: [
      {
        id: 111,
        question: "Menurut Perpres No. 39 Tahun 2019, tugas utama Produsen Data dalam penyelenggaraan Satu Data Indonesia adalah...",
        options: [
          { id: "A", text: "Memeriksa kesesuaian data yang disampaikan oleh walidata" },
          { id: "B", text: "Menghasilkan Data sesuai dengan Prinsip Satu Data Indonesia" },
          { id: "C", text: "Menetapkan standar data dan struktur metadata nasional" },
          { id: "D", text: "Mengelola portal Satu Data Indonesia tingkat nasional" }
        ],
        correctAnswer: "B",
        explanation: "Produsen Data (unit kerja instansi/OPD) berkewajiban menghasilkan data yang akurat, mutakhir, dan sesuai dengan 4 prinsip Satu Data Indonesia."
      },
      {
        id: 112,
        question: "Kemampuan sistem informasi data untuk saling berinteraksi, bertukar data, dan menggunakan informasi yang dipertukarkan tanpa re-entry manual disebut...",
        options: [
          { id: "A", text: "Standar Data" },
          { id: "B", text: "Kode Referensi" },
          { id: "C", text: "Interoperabilitas Data" },
          { id: "D", text: "Diseminasi Data" }
        ],
        correctAnswer: "C",
        explanation: "Interoperabilitas Data adalah kemampuan data untuk dibagipakaikan antar sistem elektronik yang saling berinteraksi."
      },
      {
        id: 113,
        question: "Jika sebuah Dinas ingin melakukan survei pengumpulan data statistik sektoral, langkah prosedural koordinasi yang wajib ditempuh terlebih dahulu kepada BPS adalah...",
        options: [
          { id: "A", text: "Langsung mencairkan anggaran survei" },
          { id: "B", text: "Mengajukan Pemberitahuan Kegiatan Statistik Sektoral untuk memperoleh Rekomendasi Statistik (ROMANTIK)" },
          { id: "C", text: "Mempublikasikan kuesioner ke media sosial" },
          { id: "D", text: "Menyerahkan data mentah langsung ke bupati/wali kota" }
        ],
        correctAnswer: "B",
        explanation: "Sesuai PP 51/1999 dan Perpres 39/2019, penyelenggara kegiatan statistik sektoral wajib memberitahukan rancangan kegiatan kepada BPS untuk mendapatkan rekomendasi statistik guna menghindari duplikasi kegiatan."
      },
      {
        id: 114,
        question: "Data Induk dalam Satu Data Indonesia berfungsi sebagai...",
        options: [
          { id: "A", text: "Data yang merepresentasikan objek dalam proses bisnis instansi yang disepakati untuk digunakan bersama" },
          { id: "B", text: "Data rahasia yang tidak boleh diakses oleh instansi lain" },
          { id: "C", text: "File backup cadangan di server offline" },
          { id: "D", text: "Hasil pengolahan data mentah yang belum diverifikasi" }
        ],
        correctAnswer: "A",
        explanation: "Data Induk adalah data yang merepresentasikan objek dalam proses bisnis instansi pemerintah yang ditetapkan untuk digunakan bersama sebagai acuan tunggal."
      }
    ]
  },
  {
    id: 2,
    courseId: 'pss-2026',
    number: 2,
    code: "PSS-MOD-02",
    title: "Identifikasi Kebutuhan Data & Metadata Statistik",
    subtitle: "Penyusunan Metadata Kegiatan (MS-Keg), Metadata Variabel (MS-Var), dan Metadata Indikator (MS-Ind)",
    description: "Pelajari bagaimana mengidentifikasi kebutuhan indikator kinerja daerah, menyusun kamus data, serta mendokumentasikan metadata statistik sesuai standar nasional (BPS) agar data dapat diinterpretasikan secara seragam.",
    category: "Standarisasi & Metadata",
    estimatedDuration: "60 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1",
      videoTitle: "Tutorial Teknis: Tata Cara Pengisian Formulir Metadata Statistik Sektoral (MS-Keg & MS-Var)",
      videoDuration: "24:15",
      summary: `Metadata adalah informasi terstruktur yang mendeskripsikan, menjelaskan, menemukan, atau membuat data mudah ditemukan kembali, digunakan, atau dikelola (data tentang data).

Dalam Statistik Sektoral Indonesia, metadata terbagi ke dalam 3 level utama:
1. Metadata Kegiatan Statistik (MS-Keg): Menguraikan identitas kegiatan, penanggung jawab, tujuan, metodologi pengumpulan (sensus/survei/kompilasi produk administrasi), cakupan wilayah, rancangan sampel, dan manajemen mutu.
2. Metadata Variabel (MS-Var): Menjelaskan setiap variabel yang dikumpulkan dalam kuesioner, termasuk konsep, definisi operasional, klasifikasi, ukuran, satuan, dan tipe data.
3. Metadata Indikator (MS-Ind): Menjelaskan indikator agregat/output yang dihasilkan, rumus perhitungan, sumber data penyusun, dan interpretasinya.

Standarisasi metadata memastikan bahwa angka yang dihasilkan tidak menimbulkan ambiguitas bagi pengambil kebijakan publik.`,
      learningPoints: [
        "Perbedaan fundamental antara Data, Informasi, dan Metadata.",
        "Komponen wajib formulir Metadata Kegiatan (MS-Keg) berbasis standar BPS.",
        "Teknik merumuskan definisi operasional variabel yang terukur dan tidak ambigu.",
        "Penyusunan Metadata Indikator untuk indikator kinerja utama (IKU) pemda."
      ],
      resources: [
        {
          id: "res-2-1",
          title: "Template Baku Formulir Metadata Kegiatan (MS-Keg) BPS",
          format: "XLSX",
          size: "1.8 MB",
          url: "#",
          badgeColor: "emerald",
          description: "Format spreadsheet baku pengisian metadata kegiatan statistik sektoral."
        },
        {
          id: "res-2-2",
          title: "Buku Pedoman Standar Metadata Statistik (Perban BPS No. 5 Tahun 2020)",
          format: "PDF",
          size: "4.1 MB",
          url: "#",
          badgeColor: "red",
          description: "Petunjuk teknis pengisian metadata indikator dan metadata variabel."
        },
        {
          id: "res-2-3",
          title: "Contoh Kompilasi MS-Var untuk Sektor Kesehatan dan Pendidikan",
          format: "PDF",
          size: "2.1 MB",
          url: "#",
          badgeColor: "red",
          description: "Studi kasus riil pengisian variabel angka partisipasi murni dan prevalensi stunting."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 201,
        question: "Pengertian paling tepat dari 'Metadata' dalam konteks Satu Data Indonesia adalah...",
        options: [
          { id: "A", text: "Software pengolah angka statistik" },
          { id: "B", text: "Informasi dalam bentuk struktur dan format baku untuk menggambarkan Data, menjelaskan Data, serta memudahkan pencarian, penggunaan, dan pengelolaan Data" },
          { id: "C", text: "Anggaran biaya pelaksanaan survei" },
          { id: "D", text: "Daftar nama responden survei lapangan" }
        ],
        correctAnswer: "B",
        explanation: "Metadata adalah informasi terstruktur yang mendeskripsikan data sehingga mempermudah pemahaman, penemuan, dan pengelolaannya."
      },
      {
        id: 202,
        question: "Tiga jenis metadata statistik yang dikelola dalam sistem pembinaan statistik sektoral adalah...",
        options: [
          { id: "A", text: "Metadata Umum, Khusus, dan Rahasia" },
          { id: "B", text: "Metadata Kegiatan, Metadata Variabel, dan Metadata Indikator" },
          { id: "C", text: "Metadata Teks, Gambar, dan Video" },
          { id: "D", text: "Metadata Pusat, Provinsi, dan Kabupaten" }
        ],
        correctAnswer: "B",
        explanation: "Sesuai Peraturan BPS No. 5 Tahun 2020, metadata statistik mencakup Metadata Kegiatan (MS-Keg), Metadata Variabel (MS-Var), dan Metadata Indikator (MS-Ind)."
      },
      {
        id: 203,
        question: "Jika Dinas Pertanian menghitung 'Produktivitas Padi per Hektar (Ton/Ha)', informasi mengenai rumus perhitungan, satuan, dan cara interpretasi angka tersebut dituangkan dalam...",
        options: [
          { id: "A", text: "Metadata Kegiatan (MS-Keg)" },
          { id: "B", text: "Metadata Variabel (MS-Var)" },
          { id: "C", text: "Metadata Indikator (MS-Ind)" },
          { id: "D", text: "Kode Referensi" }
        ],
        correctAnswer: "C",
        explanation: "Metadata Indikator menjelaskan indikator kinerja turunan, mencakup formula matematis, sumber data penyusun, batas toleransi, dan interpretasinya."
      },
      {
        id: 204,
        question: "Komponen berikut yang WAJIB ada dalam Standar Data Statistik adalah...",
        options: [
          { id: "A", text: "Konsep, Definisi, Klasifikasi, Ukuran, dan Satuan" },
          { id: "B", text: "Merek komputer dan spesifikasi RAM surveyor" },
          { id: "C", text: "Nomor rekening bendahara pengeluaran dinas" },
          { id: "D", text: "Surat permohonan izin survei dari kepala dinas" }
        ],
        correctAnswer: "A",
        explanation: "Standar Data Statistik sekurang-kurangnya mencakup konsep, definisi, klasifikasi, ukuran, dan satuan."
      }
    ],
    postTestQuestions: [
      {
        id: 211,
        question: "Dalam penyusunan Metadata Variabel (MS-Var), apa perbedaan mendasar antara 'Konsep' dan 'Definisi Operasional'?",
        options: [
          { id: "A", text: "Konsep bersifat abstrak/gambaran umum ide, sedangkan definisi operasional membatasi variabel secara spesifik dan terukur di lapangan" },
          { id: "B", text: "Konsep dibuat oleh BPS, sedangkan definisi operasional dibuat oleh Presiden" },
          { id: "C", text: "Konsep berbentuk angka, definisi berbentuk huruf" },
          { id: "D", text: "Tidak ada perbedaan antara keduanya" }
        ],
        correctAnswer: "A",
        explanation: "Konsep memberikan batasan teoritis, sedangkan definisi operasional menjelaskan secara detail cara mengukur dan mengidentifikasi variabel di lapangan."
      },
      {
        id: 212,
        question: "Manakah contoh 'Klasifikasi Baku' yang digunakan secara resmi dalam sistem statistik di Indonesia?",
        options: [
          { id: "A", text: "Klasifikasi Baku Lapangan Usaha Indonesia (KBLI)" },
          { id: "B", text: "Daftar hadir pegawai bulanan" },
          { id: "C", text: "Struktur organisasi dinas perikanan" },
          { id: "D", text: "Kuitansi perjalanan dinas surveyor" }
        ],
        correctAnswer: "A",
        explanation: "KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) dan KBJI (Klasifikasi Baku Jabatan Indonesia) adalah contoh klasifikasi standar yang ditetapkan BPS."
      },
      {
        id: 213,
        question: "Saat mendokumentasikan kegiatan pengumpulan data berbasis 'Kompilasi Produk Administrasi' (Kompromin), sumber data berasal dari...",
        options: [
          { id: "A", text: "Wawancara acak kepada pengguna jalan raya" },
          { id: "B", text: "Catatan atau register pelayanan publik rutin yang dihasilkan dalam tugas kedinasan OPD" },
          { id: "C", text: "Jajak pendapat daring di media sosial" },
          { id: "D", text: "Artikel berita di media massa" }
        ],
        correctAnswer: "B",
        explanation: "Kompilasi Produk Administrasi memanfaatkan catatan register rutin instansi pemerintah (misalnya data perizinan, data buku register pasien, data kependudukan) tanpa melakukan survei mandiri."
      },
      {
        id: 214,
        question: "Metadata yang lengkap dan terstandarisasi memberikan manfaat langsung bagi pimpinan daerah dalam bentuk...",
        options: [
          { id: "A", text: "Mencegah salah interpretasi data saat merumuskan kebijakan APBD dan target RPJMD" },
          { id: "B", text: "Menambah panjang laporan tahunan agar terlihat tebal" },
          { id: "C", text: "Menghapuskan kebutuhan pengumpulan data lapangan seumur hidup" },
          { id: "D", text: "Menjamin semua proyek dinas disetujui tanpa evaluasi" }
        ],
        correctAnswer: "A",
        explanation: "Ketersediaan metadata baku memastikan pimpinan memahami batasan angka dan metodologi sehingga keputusan perencanaan pembangunan berbasis bukti (evidence-based policy) tepat sasaran."
      }
    ]
  },
  {
    id: 3,
    courseId: 'pss-2026',
    number: 3,
    code: "PSS-MOD-03",
    title: "Manajemen Kualitas Data & Rekomendasi Statistik (ROMANTIK)",
    subtitle: "Penerapan GSBPM, Validasi Kualitas Data, dan Prosedur Permohonan Rekomendasi BPS",
    description: "Pelajari siklus hidup pengelolaan data berdasarkan kerangka Generic Statistical Business Process Model (GSBPM), mekanisme validasi kualitas data (Quality Assurance), dan alur permohonan rekomendasi kegiatan statistik sektoral melalui aplikasi ROMANTIK.",
    category: "Penjaminan Kualitas (QA/QC)",
    estimatedDuration: "50 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1",
      videoTitle: "Simulasi Prosedur Rekomendasi Statistik Sektoral (ROMANTIK Online) & Quality Assurance",
      videoDuration: "20:30",
      summary: `Manajemen kualitas data statistik sektoral merujuk pada standar Generic Statistical Business Process Model (GSBPM) yang memiliki 8 fase:
1. Specify Needs (Spesifikasi Kebutuhan)
2. Design (Perancangan Metodologi & Instrumen)
3. Build (Pembangunan Sistem & Uji Coba Kuesioner)
4. Collect (Pengumpulan Data Lapangan)
5. Process (Pengolahan, Validasi, & Editing Data)
6. Analyse (Analisis & Interpretasi Hasil)
7. Disseminate (Penyebarluasan Data)
8. Evaluate (Evaluasi Penyelenggaraan)

ROMANTIK (Rekomendasi Kegiatan Statistik) adalah sistem terpadu BPS bagi Kementerian/Lembaga/Pemerintah Daerah untuk memberitahukan rancangan kegiatan statistik sektoral mereka. Melalui rekomendasi ini, BPS memastikan tidak terjadi duplikasi kegiatan antar instansi, instrumen memenuhi kaidah keilmuan statistik, dan hasil survei dapat dipertanggungjawabkan secara saintifik.`,
      learningPoints: [
        "Fase-fase GSBPM dalam siklus hidup kegiatan statistik sektoral.",
        "Prosedur pengajuan notifikasi dan permohonan rekomendasi via ROMANTIK Online.",
        "Kriteria penerbitan surat rekomendasi layak versus surat perbaikan rancangan.",
        "Teknik validasi integritas data: pengecekan kelengkapan, konsistensi logis, dan deteksi anomali/outlier."
      ],
      resources: [
        {
          id: "res-3-1",
          title: "Buku Pedoman Penggunaan Aplikasi ROMANTIK Online untuk OPD",
          format: "PDF",
          size: "3.5 MB",
          url: "#",
          badgeColor: "red",
          description: "Langkah demi langkah login, pengisian instrumen, dan tracking status rekomendasi."
        },
        {
          id: "res-3-2",
          title: "Kerangka Manajemen Mutu Statistik Berbasis GSBPM Versi 5.1",
          format: "PPT",
          size: "4.7 MB",
          url: "#",
          badgeColor: "orange",
          description: "Paparan dimensi mutu: relevansi, akurasi, aktualitas, aksesibilitas, keterbandingan, dan koherensi."
        },
        {
          id: "res-3-3",
          title: "Checklist Verifikasi Kualitas Data Sektoral bagi Walidata Diskominfo",
          format: "PDF",
          size: "1.5 MB",
          url: "#",
          badgeColor: "red",
          description: "Lembar kerja pemeriksaan konsistensi internal data sebelum diterbitkan."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 301,
        question: "Aplikasi yang dikembangkan oleh BPS untuk melayani permohonan Rekomendasi Kegiatan Statistik Sektoral secara daring adalah...",
        options: [
          { id: "A", text: "SP4N LAPOR" },
          { id: "B", text: "ROMANTIK (Rekomendasi Kegiatan Statistik)" },
          { id: "C", text: "SIRUP LKPP" },
          { id: "D", text: "Dukcapil Online" }
        ],
        correctAnswer: "B",
        explanation: "ROMANTIK adalah portal resmi BPS untuk pengajuan dan penerbitan Rekomendasi Kegiatan Statistik Sektoral."
      },
      {
        id: 302,
        question: "Apa tujuan utama dari kewajiban memperoleh Rekomendasi Statistik sebelum melaksanakan survei sektoral?",
        options: [
          { id: "A", text: "Menghindari duplikasi pengumpulan data dan menjamin metodologi memenuhi kaidah statistik yang sahih" },
          { id: "B", text: "Menghambat dinas agar tidak bisa membelanjakan APBD" },
          { id: "C", text: "Memaksa dinas membayar biaya lisensi kepada BPS" },
          { id: "D", text: "Memindahkan seluruh staf survei dinas menjadi pegawai BPS" }
        ],
        correctAnswer: "A",
        explanation: "Rekomendasi statistik bertujuan menghindari pemborosan anggaran akibat duplikasi data serta memastikan rancangan survei memiliki validitas ilmiah."
      },
      {
        id: 303,
        question: "Standar proses bisnis statistik internasional yang diadopsi oleh BPS dalam evaluasi statistik sektoral adalah...",
        options: [
          { id: "A", text: "GSBPM (Generic Statistical Business Process Model)" },
          { id: "B", text: "Scrum Agile Framework" },
          { id: "C", text: "ISO 9001 versi manufaktur" },
          { id: "D", text: "ITIL v3 Service Desk" }
        ],
        correctAnswer: "A",
        explanation: "GSBPM adalah model proses bisnis statistik global yang membagi siklus statistik ke dalam 8 tahapan terstruktur."
      },
      {
        id: 304,
        question: "Pemeriksaan konsistensi logis dalam pengolahan data (misalnya: tidak boleh ada responden berusia 5 tahun dengan jenjang pendidikan S2) termasuk dalam tahapan GSBPM...",
        options: [
          { id: "A", text: "Specify Needs" },
          { id: "B", text: "Process (Pengolahan & Editing)" },
          { id: "C", text: "Disseminate" },
          { id: "D", text: "Design Metodologi" }
        ],
        correctAnswer: "B",
        explanation: "Pemeriksaan konsistensi, validasi aturan logika, dan koreksi kesalahan input dilakukan pada fase Process (Fase 5 GSBPM)."
      }
    ],
    postTestQuestions: [
      {
        id: 311,
        question: "Kapan waktu paling ideal bagi instansi Produsen Data untuk mengajukan permohonan Rekomendasi Kegiatan Statistik ke BPS?",
        options: [
          { id: "A", text: "Setelah seluruh kuesioner dicetak dan survei lapangan selesai 100%" },
          { id: "B", text: "Pada tahap perencanaan kegiatan/penyusunan rancangan kuesioner sebelum pengumpulan data dimulai" },
          { id: "C", text: "Saat laporan akhir kegiatan sudah dijilid rapi" },
          { id: "D", text: "Setelah temuan pemeriksaan BPK keluar" }
        ],
        correctAnswer: "B",
        explanation: "Permohonan rekomendasi wajib diajukan pada tahap rancangan/perencanaan sebelum pengumpulan data dilakukan agar saran perbaikan metodologi dari BPS dapat diterapkan."
      },
      {
        id: 312,
        question: "Dimensi mutu statistik yang mengukur seberapa cepat informasi statistik dapat tersedia bagi publik setelah periode referensi berakhir disebut...",
        options: [
          { id: "A", text: "Aktualitas dan Ketepatan Waktu (Timeliness & Punctuality)" },
          { id: "B", text: "Akurasi" },
          { id: "C", text: "Keterbandingan" },
          { id: "D", text: "Relevansi" }
        ],
        correctAnswer: "A",
        explanation: "Aktualitas (Timeliness) mengukur selang waktu antara ketersediaan data dengan peristiwa yang digambarkan oleh data tersebut."
      },
      {
        id: 313,
        question: "Bila hasil penelaahan BPS terhadap rancangan kegiatan dinas menunjukkan adanya indikasi duplikasi dengan data BPS yang sudah ada, maka rekomendasi yang diterbitkan adalah...",
        options: [
          { id: "A", text: "Surat Rekomendasi Disetujui Penuh" },
          { id: "B", text: "Surat Rekomendasi Perbaikan/Pemanfaatan Data Sekunder yang sudah tersedia" },
          { id: "C", text: "Surat Pembubaran Dinas" },
          { id: "D", text: "Surat Pemberhentian Surveyor" }
        ],
        correctAnswer: "B",
        explanation: "BPS akan memberikan telaah teknis dan menyarankan pemanfaatan data sekunder yang telah ada guna efisiensi anggaran dan konsistensi data."
      },
      {
        id: 314,
        question: "Peran Walidata (Diskominfo) dalam menjaga kualitas data sebelum dipublikasikan ke Portal Satu Data Daerah adalah...",
        options: [
          { id: "A", text: "Melakukan pemeriksaan kesesuaian data terhadap standar data, kelengkapan metadata, dan interoperabilitas" },
          { id: "B", text: "Mengubah angka secara sepihak tanpa memberitahu dinas terkait" },
          { id: "C", text: "Menghapus data dinas lain yang kinerjanya kurang baik" },
          { id: "D", text: "Memungut biaya pendaftaran portal dari produsen data" }
        ],
        correctAnswer: "A",
        explanation: "Walidata bertugas memeriksa kesesuaian data yang disampaikan oleh Produsen Data sesuai prinsip Satu Data Indonesia sebelum diunggah ke Portal Data."
      }
    ]
  },
  {
    id: 4,
    courseId: 'pss-2026',
    number: 4,
    code: "PSS-MOD-04",
    title: "Diseminasi, Visualisasi, & Bagi Pakai Data Statistik Sektoral",
    subtitle: "Penyusunan Rilis Data Resmi, Portal Data Terbuka (Open Data), API, dan Penilaian EPSS",
    description: "Pelajari teknik menyajikan data statistik sektoral yang komunikatif bagi publik dan pembuat kebijakan, penerapan standar keterbukaan data melalui API/interoperabilitas, serta persiapan menghadapi Evaluasi Penyelenggaraan Statistik Sektoral (EPSS) menuju Indeks Pembangunan Statistik (IPS) kategori Baik.",
    category: "Diseminasi & Evaluasi EPSS",
    estimatedDuration: "55 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1",
      videoTitle: "Strategi Mencapai Indeks Pembangunan Statistik (IPS) Predikat Baik dalam Evaluasi EPSS",
      videoDuration: "22:15",
      summary: `Diseminasi adalah muara dari seluruh rangkaian kegiatan statistik sektoral. Data yang dikumpulkan dengan anggaran rakyat harus memberikan dampak nyata bagi pengambilan keputusan publik (Evidence-Based Policy).

Prinsip Diseminasi Modern Satu Data Indonesia:
1. Akses Terbuka (Open Data): Format data mesin terbaca (machine-readable: CSV, JSON, GeoJSON), bukan sekadar PDF statis.
2. Interoperabilitas Web Service/API: Memungkinkan integrasi data otomatis antar aplikasi OPD ke Portal Satu Data Daerah tanpa manual download/upload.
3. Visualisasi Infografis & Narasi Data: Meringkas fenomena statistik penting ke dalam narasi yang mudah dipahami bupati/wali kota dan masyarakat umum.
4. Kesiapan Evaluasi Penyelenggaraan Statistik Sektoral (EPSS): EPSS mengukur 5 domain utama (Prinsip SDI, Kualitas Data, Proses Bisnis Statistik, Kelembagaan, dan Statistik Nasional) yang menghasilkan Indeks Pembangunan Statistik (IPS) pemda yang dievaluasi setiap tahun.`,
      learningPoints: [
        "Kriteria format data terbuka (Open Data) dan machine-readable formats.",
        "Pemanfaatan Web Service API untuk pertukaran data antar instansi.",
        "Desain infografis dan dashboard analitik data daerah yang efektif.",
        "5 Domain dan 19 Indikator Evaluasi Penyelenggaraan Statistik Sektoral (EPSS)."
      ],
      resources: [
        {
          id: "res-4-1",
          title: "Panduan Teknis Evaluasi Penyelenggaraan Statistik Sektoral (EPSS) & Instrumen IPS",
          format: "PDF",
          size: "4.8 MB",
          url: "#",
          badgeColor: "red",
          description: "Pedoman resmi BPS dalam menilai kematangan statistik sektoral instansi pemerintah."
        },
        {
          id: "res-4-2",
          title: "Standar Format File Terbuka (Machine Readable) untuk Portal Data Daerah",
          format: "PDF",
          size: "1.9 MB",
          url: "#",
          badgeColor: "red",
          description: "Spesifikasi teknis struktur header CSV dan schema JSON bagi pengembang web portal."
        },
        {
          id: "res-4-3",
          title: "Kumpulan Best Practice Infografis Statistik Sektoral Komunikatif",
          format: "PPT",
          size: "6.2 MB",
          url: "#",
          badgeColor: "orange",
          description: "Contoh layout infografis penyajian indikator makro ekonomi dan sosial daerah."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 401,
        question: "Format file berikut yang memenuhi syarat sebagai format 'Machine-Readable' (dapat dibaca oleh mesin pengolah data secara otomatis) dalam prinsip Open Data adalah...",
        options: [
          { id: "A", text: "Gambar hasil scan JPG miring" },
          { id: "B", text: "CSV (Comma-Separated Values) atau JSON" },
          { id: "C", text: "File PDF berpassword" },
          { id: "D", text: "Screenshot pesan WhatsApp" }
        ],
        correctAnswer: "B",
        explanation: "Format terbuka machine-readable seperti CSV, JSON, atau XML memungkinkan komputer memproses data secara langsung tanpa perlu re-typing."
      },
      {
        id: 402,
        question: "Evaluasi resmi yang diselenggarakan BPS terhadap penyelenggaraan statistik sektoral di kementerian/lembaga dan pemerintah daerah dikenal dengan singkatan...",
        options: [
          { id: "A", text: "EPSS (Evaluasi Penyelenggaraan Statistik Sektoral)" },
          { id: "B", text: "UNBK (Ujian Nasional Berbasis Komputer)" },
          { id: "C", text: "AMDAL (Analisis Mengenai Dampak Lingkungan)" },
          { id: "D", text: "SPBE (Sistem Pemerintahan Berbasis Elektronik) khusus jalan raya" }
        ],
        correctAnswer: "A",
        explanation: "EPSS adalah evaluasi berkala oleh BPS untuk menilai tingkat kematangan penyelenggaraan statistik sektoral."
      },
      {
        id: 403,
        question: "Hasil akhir dari penilaian EPSS berupa angka indeks komposit yang dinamakan...",
        options: [
          { id: "A", text: "Indeks Pembangunan Manusia (IPM)" },
          { id: "B", text: "Indeks Pembangunan Statistik (IPS)" },
          { id: "C", text: "Indeks Harga Konsumen (IHK)" },
          { id: "D", text: "Indeks Kepuasan Masyarakat (IKM)" }
        ],
        correctAnswer: "B",
        explanation: "IPS (Indeks Pembangunan Statistik) adalah ukuran tingkat kematangan penyelenggaraan statistik sektoral instansi pemerintah."
      },
      {
        id: 404,
        question: "Dalam prinsip keterbukaan data, data statistik sektoral yang dihasilkan instansi pemerintah pada dasarnya bersifat terbuka bagi publik, KECUALI...",
        options: [
          { id: "A", text: "Data yang dikecualikan menurut UU Keterbukaan Informasi Publik (misal data privasi individu atau rahasia pertahanan)" },
          { id: "B", text: "Data yang jumlah angkanya di bawah 100" },
          { id: "C", text: "Data yang diminta oleh mahasiswa atau akademisi" },
          { id: "D", text: "Data statistik yang grafiknya kurang menarik" }
        ],
        correctAnswer: "A",
        explanation: "Data statistik sektoral bersifat terbuka untuk publik kecuali terhadap data yang dinyatakan dikecualikan oleh peraturan perundang-undangan."
      }
    ],
    postTestQuestions: [
      {
        id: 411,
        question: "Kategori predikat tingkat kematangan Indeks Pembangunan Statistik (IPS) dengan nilai 2.60 hingga 3.50 adalah predikat...",
        options: [
          { id: "A", text: "Kurang" },
          { id: "B", text: "Cukup" },
          { id: "C", text: "Baik" },
          { id: "D", text: "Memuaskan" }
        ],
        correctAnswer: "C",
        explanation: "Pada rentang skor IPS EPSS: <1.80 Rintisan/Kurang, 1.80-2.59 Terkelola/Cukup, 2.60-3.50 Terdefinisi/Baik, 3.51-4.20 Terpadu/Sangat Baik, >4.20 Optimum/Memuaskan."
      },
      {
        id: 412,
        question: "Penerapan arsitektur API (Application Programming Interface) pada Portal Satu Data Daerah bertujuan untuk...",
        options: [
          { id: "A", text: "Memungkinkan pertukaran data secara otomatis dan real-time antar sistem OPD tanpa duplikasi berkas fisik" },
          { id: "B", text: "Menggantikan seluruh staf administrator di Diskominfo" },
          { id: "C", text: "Menaikkan tarif retribusi daerah" },
          { id: "D", text: "Mengunci data agar hanya bupati yang bisa melihat" }
        ],
        correctAnswer: "A",
        explanation: "API mewujudkan interoperabilitas data sehingga sistem-sistem digital pemerintah daerah dapat saling berkomunikasi secara efisien."
      },
      {
        id: 413,
        question: "Prinsip etika penting dalam penyajian visualisasi data statistik kepada publik adalah...",
        options: [
          { id: "A", text: "Memotong sumbu Y (truncated graph) untuk mendramatisir kenaikan kecil agar terlihat spektakuler" },
          { id: "B", text: "Menampilkan data secara proporsional, mencantumkan sumber data resmi, serta menyertakan catatan metodologis" },
          { id: "C", text: "Menyembunyikan data capaian yang menurun agar pimpinan selalu senang" },
          { id: "D", text: "Menggunakan warna kontras yang menyilaukan mata pembaca" }
        ],
        correctAnswer: "B",
        explanation: "Integritas statistik menuntut penyajian data yang obyektif, proporsional, dan transparan mengenai sumber data serta catatan definisi."
      },
      {
        id: 414,
        question: "Salah satu kriteria bukti dukung (evidence) yang valid untuk penilaian Domain 1 EPSS (Prinsip Satu Data Indonesia) adalah...",
        options: [
          { id: "A", text: "Dokumen penetapan Standar Data dan Metadata yang telah ditelaah oleh BPS selaku Pembina Data" },
          { id: "B", text: "Foto spanduk ucapan selamat hari statistik nasional" },
          { id: "C", text: "Daftar menu makan siang rapat forum satu data" },
          { id: "D", text: "Nota pembelian laptop baru di dinas" }
        ],
        correctAnswer: "A",
        explanation: "Bukti dukung penilaian EPSS harus berupa produk hukum/dokumen teknis resmi, seperti SK penetapan standar data dan formulir metadata yang disahkan pembina data."
      }
    ]
  },
  // KELAS BARU: SPESIALISASI METADATA & INTEROPERABILITAS DATA
  {
    id: 5,
    courseId: 'meta-2026',
    number: 1,
    code: "META-MOD-01",
    title: "Penyusunan Metadata Statistik Kegiatan (MS-Keg)",
    subtitle: "Identifikasi Penyelenggara, Rancangan Survei, dan Metodologi Baku Sektoral",
    description: "Memahami tata cara pengisian instrumen MS-Keg agar setiap kegiatan survei atau kompilasi produk administrasi oleh OPD tercatat resmi di Sistem Statistik Nasional.",
    category: "Metadata Kegiatan",
    estimatedDuration: "45 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1",
      videoTitle: "Tutorial Praktis: Penyusunan Instrumen Metadata Statistik Kegiatan (MS-Keg)",
      videoDuration: "16:20",
      summary: `Metadata Statistik Kegiatan (MS-Keg) merupakan sekumpulan informasi yang menggambarkan latar belakang, tujuan, metodologi, dan penyelenggaraan suatu kegiatan statistik.

Komponen utama formulir MS-Keg terdiri dari 5 bagian:
1. Bagian I: Identifikasi Kegiatan (Judul Kegiatan, Kode Kegiatan, Penanggung Jawab).
2. Bagian II: Penyelenggara (Instansi Pelaksana, Unit Eselon, Alamat Kontak).
3. Bagian III: Rancangan Kegiatan (Latar Belakang, Tujuan, Jadwal Pelaksanaan).
4. Bagian IV: Metodologi (Cakupan Wilayah, Metode Pengumpulan Data, Rancangan Sampel/Sensus).
5. Bagian V: Kualitas & Diseminasi (Penjaminan Kualitas, Rencana Publikasi, Format Akses Data).

Setiap OPD wajib mengajukan rekomendasi kegiatan statistik dan menyusun MS-Keg kepada Walidata dan Pembina Data BPS sebelum survei dilaksanakan.`,
      learningPoints: [
        "Definisi dan fungsi strategis MS-Keg dalam menghindari duplikasi survei daerah.",
        "Struktur 5 bagian utama instrumen formulir MS-Keg standar BPS.",
        "Alur pengajuan dan validasi rekomendasi kegiatan statistik sektoral.",
        "Kaidah dokumentasi metode pengumpulan dan cakupan populasi survei OPD."
      ],
      resources: [
        {
          id: "res-5-1",
          title: "Formulir Standar Metadata Statistik Kegiatan (MS-Keg)",
          format: "PDF",
          size: "1.8 MB",
          url: "#",
          badgeColor: "red",
          description: "Template instrumen resmi MS-Keg terbitan Badan Pusat Statistik."
        },
        {
          id: "res-5-2",
          title: "Buku Pedoman Pengisian Rekomendasi & MS-Keg Sektoral",
          format: "PDF",
          size: "3.4 MB",
          url: "#",
          badgeColor: "red",
          description: "Panduan teknis langkah demi langkah pengisian setiap butir isian kegiatan."
        },
        {
          id: "res-5-3",
          title: "Contoh Isian MS-Keg Sektor Kesehatan & Pendidikan",
          format: "PDF",
          size: "2.1 MB",
          url: "#",
          badgeColor: "orange",
          description: "Studi kasus riil pengisian MS-Keg pada kegiatan survei gizi dan sarana sekolah."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 501,
        question: "Apakah tujuan utama dari penyusunan Metadata Statistik Kegiatan (MS-Keg) oleh Produsen Data?",
        options: [
          { id: "A", text: "Menjelaskan identitas, rancangan metodologi, dan riwayat penyelenggaraan kegiatan statistik" },
          { id: "B", text: "Menentukan besaran anggaran honor petugas lapangan" },
          { id: "C", text: "Menggantikan dokumen perencanaan APBD daerah" },
          { id: "D", text: "Membayar pajak retribusi daerah" }
        ],
        correctAnswer: "A",
        explanation: "MS-Keg berfungsi untuk mendokumentasikan secara rinci metodologi, tujuan, jadwal, dan identitas penyelenggaraan kegiatan statistik."
      },
      {
        id: 502,
        question: "Kapan instrumen MS-Keg harus diajukan ke Pembina Data/Walidata?",
        options: [
          { id: "A", text: "Sebelum kegiatan pengumpulan data dilaksanakan (bersamaan dengan usulan rekomendasi)" },
          { id: "B", text: "Lima tahun setelah laporan survei dipublikasikan" },
          { id: "C", text: "Saat anggaran sudah habis dipakai" },
          { id: "D", text: "Tidak perlu diajukan sama sekali" }
        ],
        correctAnswer: "A",
        explanation: "Pengajuan rancangan MS-Keg dilakukan pada tahap pra-survei dalam alur permohonan Rekomendasi Kegiatan Statistik (Romantik)."
      },
      {
        id: 503,
        question: "Salah satu bagian penting dalam MS-Keg yang memuat informasi populasi sasaran dan metode penarikan sampel adalah...",
        options: [
          { id: "A", text: "Bagian Metodologi" },
          { id: "B", text: "Bagian Kata Pengantar" },
          { id: "C", text: "Bagian Daftar Lampiran" },
          { id: "D", text: "Bagian Pengadaan Barang" }
        ],
        correctAnswer: "A",
        explanation: "Bagian Metodologi mendeskripsikan secara eksplisit cakupan wilayah, kerangka sampel, metode pemilihan sampel, dan teknik penimbangan."
      }
    ],
    postTestQuestions: [
      {
        id: 511,
        question: "Komponen utama yang harus tercakup dalam Bagian I (Identifikasi Kegiatan) pada formulir MS-Keg adalah...",
        options: [
          { id: "A", text: "Judul kegiatan statistik, tahun pelaksanaan, dan cara pengumpulan data" },
          { id: "B", text: "Daftar hadir peserta rapat pembahasan anggaran" },
          { id: "C", text: "Struk belanja perlengkapan kantor" },
          { id: "D", text: "Surat permohonan cuti pegawai" }
        ],
        correctAnswer: "A",
        explanation: "Bagian I mengidentifikasi nama resmi kegiatan, tahun penyelenggaraan, cara pengumpulan (sensus/survei/kompilasi produk administrasi), dan penanggung jawab."
      },
      {
        id: 512,
        question: "Jika suatu dinas melakukan kompilasi produk administrasi (Kompromin) dari data pelayanan, apakah tetap wajib menyusun MS-Keg?",
        options: [
          { id: "A", text: "Ya, karena Kompromin merupakan salah satu metode resmi penyelenggaraan statistik sektoral" },
          { id: "B", text: "Tidak, hanya kegiatan survei lapangan yang perlu metadata" },
          { id: "C", text: "Tergantung apakah instansi tersebut memiliki website atau tidak" },
          { id: "D", text: "Tidak perlu karena data administrasi dianggap rahasia negara" }
        ],
        correctAnswer: "A",
        explanation: "Setiap penyelenggaraan statistik sektoral baik melalui survei maupun kompilasi produk administrasi wajib dilengkapi metadata kegiatan."
      },
      {
        id: 513,
        question: "Peran Walidata Daerah terhadap dokumen MS-Keg yang diajukan oleh Produsen Data (OPD) adalah...",
        options: [
          { id: "A", text: "Memeriksa kelengkapan awal instrumen sebelum diteruskan ke BPS untuk ditelaah" },
          { id: "B", text: "Langsung menghapus berkas tanpa ditinjau" },
          { id: "C", text: "Mencetak dan menjual formulir ke publik" },
          { id: "D", text: "Mengabaikan dokumen tersebut" }
        ],
        correctAnswer: "A",
        explanation: "Walidata bertindak sebagai verifikator pertama yang mengecek kesesuaian dan kelengkapan dokumen metadata sebelum koordinasi telaah dengan BPS."
      }
    ]
  },
  {
    id: 6,
    courseId: 'meta-2026',
    number: 2,
    code: "META-MOD-02",
    title: "Standar Metadata Variabel (MS-Var) & Indikator (MS-Ind)",
    subtitle: "Kamus Variabel, Definisi Operasional, Satuan Ukuran, dan Rumus Agregasi Indikator",
    description: "Menguasai penulisan kamus variabel dan indikator statistik sektoral guna memastikan konsistensi pemaknaan data lintas perangkat daerah.",
    category: "Variabel & Indikator",
    estimatedDuration: "45 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1",
      videoTitle: "Teknis Penulisan Definisi Operasional & Metadata Variabel Sektoral",
      videoDuration: "17:45",
      summary: `Metadata Statistik Variabel (MS-Var) memberikan rincian teknis tentang atribut variabel yang dikumpulkan dalam suatu kegiatan statistik. Sedangkan Metadata Statistik Indikator (MS-Ind) mendokumentasikan metrik komposit atau ukuran agregat yang menggambarkan suatu kondisi pembangunan.

Atribut Kunci Metadata Variabel (MS-Var):
1. Nama Variabel: Nama standar yang digunakan dalam basis data.
2. Konsep: Pemahaman teoritis abstrak dari variabel.
3. Definisi: Penjelasan operasional dan batasan variabel di lapangan.
4. Klasifikasi / Kategori: Nilai kodifikasi opsi jawaban (misal: Jenis Kelamin: 1=Laki-laki, 2=Perempuan).
5. Satuan Ukuran: Satuan kuantitatif (misal: Jiwa, Kilogram, Hektar, Persen).
6. Tipe Data: Numerik, Karakter, Tanggal.

Atribut Kunci Metadata Indikator (MS-Ind):
1. Nama Indikator (misal: Angka Putus Sekolah, Prevalensi Stunting).
2. Interpretasi / Arah Capaian: Apakah semakin tinggi semakin baik atau sebaliknya.
3. Rumus / Formula Perhitungan: Rumus matematis eksplisit komponen pembilang dan penyebut.
4. Sumber Data: Rincian OPD atau survei asal data penyusun.`,
      learningPoints: [
        "Perbedaan substansial antara data mentah, variabel mikro, dan indikator agregat.",
        "Kaidah menyusun definisi operasional yang terukur dan tidak ambigu.",
        "Standardisasi satuan ukuran dan klasifikasi baku nasional.",
        "Penyusunan rumus matematis indikator kinerja utama daerah (IKU/IKD)."
      ],
      resources: [
        {
          id: "res-6-1",
          title: "Pedoman Standar Metadata Variabel & Indikator SDI",
          format: "PDF",
          size: "2.7 MB",
          url: "#",
          badgeColor: "red",
          description: "Buku rujukan BPS untuk penyeragaman kamus data sektoral instansi pemerintah."
        },
        {
          id: "res-6-2",
          title: "Template Excel Kamus Variabel (Data Dictionary)",
          format: "XLSX",
          size: "540 KB",
          url: "#",
          badgeColor: "emerald",
          description: "Lembar kerja praktis penyusunan kamus variabel sebelum diunggah ke portal data."
        },
        {
          id: "res-6-3",
          title: "Katalog Indikator Kinerja Pembangunan Daerah",
          format: "PDF",
          size: "4.1 MB",
          url: "#",
          badgeColor: "red",
          description: "Daftar definisi dan rumus indikator makro pembangunan sektoral daerah."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 601,
        question: "Apakah perbedaan mendasar antara Metadata Variabel (MS-Var) dan Metadata Indikator (MS-Ind)?",
        options: [
          { id: "A", text: "MS-Var menjelaskan variabel mentah/pertanyaan tunggal, sedangkan MS-Ind menjelaskan ukuran agregat hasil kalkulasi formula matematis" },
          { id: "B", text: "MS-Var untuk huruf, sedangkan MS-Ind hanya untuk angka" },
          { id: "C", text: "MS-Var dibuat oleh swasta, sedangkan MS-Ind dibuat oleh wartawan" },
          { id: "D", text: "Tidak ada perbedaan sama sekali" }
        ],
        correctAnswer: "A",
        explanation: "Variabel adalah unit karakteristik tunggal dari objek, sedangkan indikator adalah ringkasan/metrik turunan yang dihitung melalui formula untuk menggambarkan kondisi tertentu."
      },
      {
        id: 602,
        question: "Elemen apa saja yang wajib dicantumkan dalam pendefinisian suatu variabel data sektoral?",
        options: [
          { id: "A", text: "Konsep, definisi operasional, klasifikasi, ukuran, dan satuan" },
          { id: "B", text: "Nomor telepon enumerator dan merk komputer" },
          { id: "C", text: "Harga software pembuat tabel" },
          { id: "D", text: "Nama kepala dinas yang menjabat" }
        ],
        correctAnswer: "A",
        explanation: "Sesuai prinsip Standar Data dan Metadata SDI, variabel wajib memuat konsep, definisi, cakupan, klasifikasi, ukuran, dan satuan."
      },
      {
        id: 603,
        question: "Jika variabel 'Tingkat Kemiskinan' diukur dalam persentase, maka 'Persen (%)' berkedudukan sebagai...",
        options: [
          { id: "A", text: "Satuan Ukuran" },
          { id: "B", text: "Kode Wilayah" },
          { id: "C", text: "Format File" },
          { id: "D", text: "Metode Wawancara" }
        ],
        correctAnswer: "A",
        explanation: "Persen (%) adalah besaran yang digunakan untuk menyatakan ukuran kuantitatif dari variabel/indikator tersebut."
      }
    ],
    postTestQuestions: [
      {
        id: 611,
        question: "Mengapa definisi operasional variabel harus dibuat sangat spesifik dan bebas multi-tafsir?",
        options: [
          { id: "A", text: "Agar petugas pencatat dan pengguna data memiliki pemahaman yang seragam dan tidak terjadi bias data" },
          { id: "B", text: "Agar kalimatnya terlihat panjang dan rumit" },
          { id: "C", text: "Agar data tidak bisa dibaca oleh instansi lain" },
          { id: "D", text: "Sebagai syarat administrasi pencairan tunjangan" }
        ],
        correctAnswer: "A",
        explanation: "Definisi operasional yang tegas mencegah perbedaan interpretasi di lapangan maupun saat analisis data lintas waktu dan wilayah."
      },
      {
        id: 612,
        question: "Dalam MS-Indikator, informasi 'arah capaian / interpretasi' menjelaskan mengenai...",
        options: [
          { id: "A", text: "Apakah nilai yang semakin tinggi menunjukkan kondisi yang semakin baik atau sebaliknya (makin buruk)" },
          { id: "B", text: "Arah mata angin lokasi pengambilan sampel data" },
          { id: "C", text: "Rute perjalanan dinas tim verifikasi" },
          { id: "D", text: "Arah letak gedung kantor dinas" }
        ],
        correctAnswer: "A",
        explanation: "Interpretasi arah indikator penting untuk evaluasi kebijakan (misal: IPM makin tinggi makin baik, sedangkan Angka Pengangguran makin rendah makin baik)."
      },
      {
        id: 613,
        question: "Ketika dua perangkat daerah mengukur variabel yang sama tetapi menggunakan klasifikasi nilai yang berbeda, dampak negatif yang terjadi adalah...",
        options: [
          { id: "A", text: "Data tidak dapat diintegrasikan dan diperbandingkan secara sah (gagal interoperabilitas)" },
          { id: "B", text: "Penyimpanan server menjadi lebih hemat" },
          { id: "C", text: "Data menjadi semakin akurat" },
          { id: "D", text: "Kecepatan internet daerah meningkat" }
        ],
        correctAnswer: "A",
        explanation: "Inkonsistensi klasifikasi menyebabkan data tidak dapat digabungkan (*incompatible*), melanggar prinsip standar data Satu Data Indonesia."
      }
    ]
  },
  {
    id: 7,
    courseId: 'meta-2026',
    number: 3,
    code: "META-MOD-03",
    title: "Interoperabilitas Data & Integrasi API Portal SDI",
    subtitle: "Arsitektur Berbagi Pakai, Format Terbuka (JSON/CSV), dan Kode Referensi Nasional",
    description: "Penerapan prinsip ke-3 dan ke-4 Satu Data Indonesia untuk menghubungkan pangkalan data sektoral dinas ke Portal Data Daerah melalui format terbuka dan web service (API).",
    category: "Interoperabilitas & API",
    estimatedDuration: "45 Menit",
    passingScore: 75,
    material: {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1",
      videoTitle: "Teknis Berbagi Pakai Data Antar Sistem: REST API & Format Terbuka SDI",
      videoDuration: "15:30",
      summary: `Prinsip Interoperabilitas Data (Prinsip 3 SDI) menegaskan bahwa data yang dihasilkan oleh produsen data harus dapat saling dibagipakaikan antar-sistem elektronik pemerintah yang saling berinteraksi secara otomatis.

Tiga pilar teknis interoperabilitas data:
1. Format Terbuka & Machine-Readable:
   - Data disajikan dalam format non-proprietary seperti CSV, JSON, atau XML.
   - Menghindari format gambar/scan PDF yang mengunci data dan menyulitkan pengolahan analitik.
2. Antarmuka Layanan Web (RESTful API):
   - Integrasi langsung antar basis data aplikasi sektoral (SIMPUS, Dapodik, Dukcapil, dll.) ke Portal Satu Data Daerah.
   - Pemanfaatan endpoint API yang terstandar dengan dokumentasi Swagger/OpenAPI.
3. Kode Referensi dan Data Induk (Prinsip 4 SDI):
   - Penggunaan kode wilayah standar Kemendagri (provinsi/kabupaten/kecamatan/desa).
   - Penggunaan NIK terstandar untuk data individu kependudukan.
   - Penggunaan Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) untuk data ekonomi.`,
      learningPoints: [
        "Penerapan standar format data terbuka sesuai regulasi Satu Data Indonesia.",
        "Mekanisme berbagi pakai data via API tanpa proses copy-paste manual.",
        "Kewajiban penggunaan Kode Referensi dan Data Induk nasional.",
        "Prosedur pengamanan akses dan perlindungan data sensitif dalam interoperabilitas."
      ],
      resources: [
        {
          id: "res-7-1",
          title: "Spesifikasi Teknis Interoperabilitas Sistem SDI",
          format: "PDF",
          size: "2.9 MB",
          url: "#",
          badgeColor: "red",
          description: "Standar arsitektur pertukaran data Bappenas, Kominfo, dan BPS."
        },
        {
          id: "res-7-2",
          title: "Panduan Implementasi REST API Portal Data Terbuka",
          format: "PDF",
          size: "1.9 MB",
          url: "#",
          badgeColor: "red",
          description: "Petunjuk konfigurasi webhook dan endpoint data sektoral."
        },
        {
          id: "res-7-3",
          title: "Buku Katalog Kode Referensi & Data Induk Nasional",
          format: "PDF",
          size: "5.2 MB",
          url: "#",
          badgeColor: "orange",
          description: "Daftar kodifikasi resmi wilayah, jabatan, satuan, dan entitas usaha."
        }
      ]
    },
    preTestQuestions: [
      {
        id: 701,
        question: "Apakah yang dimaksud dengan data yang memiliki 'Interoperabilitas' dalam konteks SDI?",
        options: [
          { id: "A", text: "Data yang dapat dengan mudah saling dibagipakaikan dan diolah antar-sistem elektronik yang berbeda tanpa hambatan format" },
          { id: "B", text: "Data yang disimpan di dalam flashdisk dan dikunci di lemari besi" },
          { id: "C", text: "Data yang hanya boleh dibaca oleh satu aplikasi khusus berbayar" },
          { id: "D", text: "Data yang dicetak pada kertas koran" }
        ],
        correctAnswer: "A",
        explanation: "Interoperabilitas data menjamin sistem elektronik dapat bertukar data dan menggunakan data yang dipertukarkan tersebut secara transparan."
      },
      {
        id: 702,
        question: "Manakah format data berikut yang tergolong format terbuka dan berstruktur terbaca mesin (machine-readable)?",
        options: [
          { id: "A", text: "JSON dan CSV" },
          { id: "B", text: "Hasil scan kamera JPG/PNG" },
          { id: "C", text: "File PDF hasil fotokopi" },
          { id: "D", text: "Kertas fax manual" }
        ],
        correctAnswer: "A",
        explanation: "JSON dan CSV adalah format teks terbuka terstruktur yang dapat diuraikan (parsed) secara langsung oleh program komputer tanpa lisensi kepemilikan."
      },
      {
        id: 703,
        question: "Mengapa penggunaan Kode Referensi (misal: Kode Wilayah Kemendagri) menjadi syarat mutlak dalam Satu Data Indonesia?",
        options: [
          { id: "A", text: "Sebagai kunci relasi (*join key*) yang menyatukan data sektoral dari berbagai dinas tanpa ambigu penulisan nama daerah" },
          { id: "B", text: "Untuk menghafal angka-angka kode wilayah" },
          { id: "C", text: "Agar data tidak bisa dibaca oleh pihak lain" },
          { id: "D", text: "Hanya sekadar formalitas peraturan" }
        ],
        correctAnswer: "A",
        explanation: "Kode referensi baku menjamin relasi antar tabel data lintas instansi terhubung presisi (misal membedakan penulisan 'Kab. Pesisir Barat' vs 'Pesisir Barat')."
      }
    ],
    postTestQuestions: [
      {
        id: 711,
        question: "Metode paling efektif dan terstandar untuk menghubungkan basis data aplikasi dinas ke Portal Satu Data Daerah adalah...",
        options: [
          { id: "A", text: "Menyediakan layanan Application Programming Interface (API) terbuka" },
          { id: "B", text: "Mengirimkan file data lewat pesan WhatsApp setiap hari" },
          { id: "C", text: "Mengetik ulang data satu per satu ke portal" },
          { id: "D", text: "Mencetak buku laporan tahunan setebal 1000 halaman" }
        ],
        correctAnswer: "A",
        explanation: "Web API memungkinkan sinkronisasi data secara otomatis, realtime, dan terjadwal langsung antar server tanpa human error."
      },
      {
        id: 712,
        question: "Jika Produsen Data menyajikan data dalam bentuk file PDF hasil scan dokumen berstempel basah, prinsip SDI manakah yang dilanggar?",
        options: [
          { id: "A", text: "Prinsip Interoperabilitas Data (karena data tidak machine-readable dan terkunci)" },
          { id: "B", text: "Prinsip Kebersihan Kantor" },
          { id: "C", text: "Prinsip Disiplin Waktu" },
          { id: "D", text: "Tidak melanggar aturan apapun" }
        ],
        correctAnswer: "A",
        explanation: "Format scan PDF tidak memenuhi kaidah interoperabilitas karena nilainya tidak dapat diolah langsung oleh mesin analitik data tanpa proses OCR yang rentan salah."
      },
      {
        id: 713,
        question: "Bagaimanakah penanganan data yang mengandung informasi rahasia atau identitas pribadi warga dalam konteks interoperabilitas SDI?",
        options: [
          { id: "A", text: "Data disamarkan (anonymized/pseudonymized) atau disajikan dalam bentuk agregat sebelum dipertukarkan" },
          { id: "B", text: "Diumumkan ke media sosial secara lengkap" },
          { id: "C", text: "Dihapus seluruh datanya dari server dinas" },
          { id: "D", text: "Dibiarkan saja tanpa pengamanan apapun" }
        ],
        correctAnswer: "A",
        explanation: "Interoperabilitas SDI tetap tunduk pada UU Pelindungan Data Pribadi (UU PDP); data individual wajib dianonimkan atau diagregasikan."
      }
    ]
  }
];

export const FINAL_EXAM_DATA: FinalExamData = {
  id: "PSS-EXAM-FINAL",
  title: "Ujian Akhir Komprehensif Pembinaan Statistik Sektoral",
  description: "Ujian evaluasi akhir yang mencakup keseluruhan substansi Modul 1 sampai Modul 4. Ambang batas kelulusan (KKM) adalah minimal 80 poin. Kelulusan ujian ini merupakan syarat mutlak untuk penerbitan Sertifikat Resmi Kelulusan.",
  passingScore: 80,
  durationMinutes: 30,
  questions: [
    {
      id: 501,
      question: "Siapakah instansi di tingkat pemerintah daerah yang bertindak sebagai Pembina Data Statistik sesuai amanat Perpres No. 39 Tahun 2019?",
      options: [
        { id: "A", text: "Bappeda Kabupaten/Kota" },
        { id: "B", text: "Badan Pusat Statistik (BPS) Kabupaten/Kota" },
        { id: "C", text: "Dinas Komunikasi dan Informatika (Diskominfo)" },
        { id: "D", text: "Bagian Organisasi Sekretariat Daerah" }
      ],
      correctAnswer: "B",
      explanation: "BPS adalah instansi vertikal yang bertindak sebagai Pembina Data Statistik pada seluruh tingkatan Satu Data Indonesia."
    },
    {
      id: 502,
      question: "Kewajiban utama Perangkat Daerah (OPD) dalam kedudukannya sebagai Produsen Data adalah...",
      options: [
        { id: "A", text: "Menghasilkan data statistik sektoral sesuai standar data dan menyampaikan metadata kepada Walidata" },
        { id: "B", text: "Mengelola server fisik pusat data nasional" },
        { id: "C", text: "Menerbitkan rekomendasi statistik untuk kementerian lain" },
        { id: "D", text: "Menghapus data sensus penduduk BPS" }
      ],
      correctAnswer: "A",
      explanation: "Produsen Data memproduksi data sektoral sesuai standar dan menyusun metadata untuk diserahkan ke Walidata daerah."
    },
    {
      id: 503,
      question: "Tiga tingkatan metadata statistik yang wajib disusun oleh instansi pemerintah adalah...",
      options: [
        { id: "A", text: "Metadata Kegiatan (MS-Keg), Metadata Variabel (MS-Var), dan Metadata Indikator (MS-Ind)" },
        { id: "B", text: "Metadata Umum, Khusus, dan Sementara" },
        { id: "C", text: "Metadata Teknis, Bisnis, dan Operasional" },
        { id: "D", text: "Metadata Wilayah, Waktu, dan Sektor" }
      ],
      correctAnswer: "A",
      explanation: "Peraturan BPS menetapkan struktur baku MS-Keg, MS-Var, dan MS-Ind sebagai standar dokumentasi metadata statistik."
    },
    {
      id: 504,
      question: "Portal daring resmi yang disediakan BPS untuk pengajuan dan pemantauan rekomendasi kegiatan statistik sektoral adalah...",
      options: [
        { id: "A", text: "SPSE Pengadaan" },
        { id: "B", text: "ROMANTIK (Rekomendasi Kegiatan Statistik)" },
        { id: "C", text: "SSCN BKN" },
        { id: "D", text: "OSS Berizin" }
      ],
      correctAnswer: "B",
      explanation: "ROMANTIK memfasilitasi notifikasi dan penerbitan telaah rekomendasi kegiatan statistik sektoral."
    },
    {
      id: 505,
      question: "Karakteristik utama format berkas yang berstatus 'Machine-Readable' adalah...",
      options: [
        { id: "A", text: "Dapat dibaca, diparsing, dan diolah secara langsung oleh program komputer (misal: JSON, CSV)" },
        { id: "B", text: "Hasil cetak kertas yang ditandatangani basah" },
        { id: "C", text: "Berkas PDF hasil foto kamera smartphone" },
        { id: "D", text: "Dokumen yang dilindungi kata sandi rahasia" }
      ],
      correctAnswer: "A",
      explanation: "Machine-readable data berstruktur terstandar sehingga software dapat mengekstraksi nilai secara otomatis tanpa konversi manual."
    },
    {
      id: 506,
      question: "Tahapan GSBPM di mana dilakukan editing, imputasi data hilang, dan validasi konsistensi nilai adalah...",
      options: [
        { id: "A", text: "Specify Needs" },
        { id: "B", text: "Collect" },
        { id: "C", text: "Process" },
        { id: "D", text: "Disseminate" }
      ],
      correctAnswer: "C",
      explanation: "Fase 5 (Process) dalam GSBPM berfokus pada pembersihan data, imputation, penimbangan sampel, dan integrasi data."
    },
    {
      id: 507,
      question: "Indeks komposit yang digunakan pemerintah pusat untuk mengevaluasi tingkat kematangan statistik sektoral instansi pemda adalah...",
      options: [
        { id: "A", text: "Indeks Pembangunan Statistik (IPS) melalui EPSS" },
        { id: "B", text: "Indeks Gini Ratio" },
        { id: "C", text: "Indeks Persepsi Korupsi (IPK)" },
        { id: "D", text: "Indeks Kebahagiaan" }
      ],
      correctAnswer: "A",
      explanation: "IPS (Indeks Pembangunan Statistik) dihasilkan melalui Evaluasi Penyelenggaraan Statistik Sektoral (EPSS)."
    },
    {
      id: 508,
      question: "Salah satu pilar utama Satu Data Indonesia yang mensyaratkan data dapat dibagipakaikan antar sistem elektronik yang berbeda disebut...",
      options: [
        { id: "A", text: "Interoperabilitas Data" },
        { id: "B", text: "Eksklusivitas Data" },
        { id: "C", text: "Kompartimentasi Data" },
        { id: "D", text: "Penguncian Database" }
      ],
      correctAnswer: "A",
      explanation: "Interoperabilitas Data menjamin bahwa data dapat saling dipertukarkan dan digunakan antar platform digital pemerintah."
    },
    {
      id: 509,
      question: "Mengapa kegiatan kompilasi produk administrasi (Kompromin) sangat didorong dalam statistik sektoral modern?",
      options: [
        { id: "A", text: "Karena memanfaatkan data operasional pelayanan yang sudah ada sehingga efisien biaya dan waktu tanpa membebani responden" },
        { id: "B", text: "Karena tidak memerlukan ketelitian sama sekali" },
        { id: "C", text: "Karena hasilnya boleh dikarang bebas" },
        { id: "D", text: "Karena tidak perlu menggunakan komputer" }
      ],
      correctAnswer: "A",
      explanation: "Data administrasi (administrative data) sangat bernilai tinggi karena terus diperbarui dalam pelayanan publik sehari-hari dan menekan beban survei lapangan."
    },
    {
      id: 510,
      question: "Ketika Walidata menemukan inkonsistensi data yang dikirim oleh Produsen Data, tindakan yang benar sesuai aturan SDI adalah...",
      options: [
        { id: "A", text: "Mengembalikan data kepada Produsen Data disertai catatan perbaikan untuk dikonfirmasi ulang" },
        { id: "B", text: "Menyebarluaskan data salah tersebut ke masyarakat luas" },
        { id: "C", text: "Menghapus instansi pengirim dari daftar pemda" },
        { id: "D", text: "Membayar denda tilang data" }
      ],
      correctAnswer: "A",
      explanation: "Walidata berperan sebagai gatekeeper/pemeriksa kualitas data; jika terdapat ketidaksesuaian, data dikembalikan ke Produsen Data untuk diverifikasi ulang."
    }
  ]
};

export const FINAL_EXAM_META_DATA: FinalExamData = {
  id: "META-EXAM-FINAL",
  title: "Ujian Akhir Spesialisasi Metadata & Interoperabilitas SDI",
  description: "Ujian evaluasi akhir komprehensif menguji penguasaan teknis instrumen MS-Keg, MS-Var, MS-Ind, serta implementasi interoperabilitas format terbuka dan API Satu Data Indonesia. KKM kelulusan adalah minimal 80 poin.",
  passingScore: 80,
  durationMinutes: 30,
  questions: [
    {
      id: 801,
      question: "Instrumen metadata yang wajib disusun oleh instansi pemerintah saat merancang survei statistik sektoral baru adalah...",
      options: [
        { id: "A", text: "Metadata Statistik Kegiatan (MS-Keg)" },
        { id: "B", text: "Kuitansi Pembelian ATK" },
        { id: "C", text: "Daftar Riwayat Hidup Petugas" },
        { id: "D", text: "Denah Gedung Kantor" }
      ],
      correctAnswer: "A",
      explanation: "MS-Keg mendokumentasikan secara rinci metodologi, tujuan, cakupan populasi, dan jadwal kegiatan statistik."
    },
    {
      id: 802,
      question: "Tiga tingkatan metadata statistik yang disepakati secara nasional dalam Perpres 39/2019 adalah...",
      options: [
        { id: "A", text: "Metadata Kegiatan, Metadata Variabel, dan Metadata Indikator" },
        { id: "B", text: "Metadata Primer, Sekunder, dan Tersier" },
        { id: "C", text: "Metadata Tingkat Desa, Kecamatan, dan Kabupaten" },
        { id: "D", text: "Metadata Huruf, Angka, dan Simbol" }
      ],
      correctAnswer: "A",
      explanation: "Standar metadata SDI mencakup 3 level: MS-Keg (kegiatan), MS-Var (variabel), dan MS-Ind (indikator)."
    },
    {
      id: 803,
      question: "Apakah peran BPS selaku Pembina Data Statistik terhadap usulan rekomendasi dan MS-Keg yang diajukan daerah?",
      options: [
        { id: "A", text: "Melakukan telaah kelayakan metodologi, memeriksa potensi duplikasi, dan menerbitkan surat rekomendasi resmi" },
        { id: "B", text: "Membiayai seluruh honor petugas survei dinas" },
        { id: "C", text: "Mengambil alih seluruh pelaksanaan pengumpulan data di lapangan" },
        { id: "D", text: "Menolak seluruh permohonan tanpa alasan" }
      ],
      correctAnswer: "A",
      explanation: "BPS bertugas memeriksa rancangan metodologi statistik untuk menjamin validitas ilmiah dan mencegah pemborosan anggaran akibat survei ganda."
    },
    {
      id: 804,
      question: "Karakteristik utama format data yang memenuhi kaidah 'Machine-Readable' adalah...",
      options: [
        { id: "A", text: "Dapat diakses, dibaca, dan diproses langsung oleh kode program komputer tanpa manipulasi manual (seperti JSON/CSV)" },
        { id: "B", text: "Buku tebal yang dicetak di percetakan" },
        { id: "C", text: "Foto berkas formulir kertas" },
        { id: "D", text: "File dokumen yang dikunci dengan kata sandi pribadi" }
      ],
      correctAnswer: "A",
      explanation: "Machine-readable berarti struktur data dikenali secara otomatis oleh mesin analitik digital."
    },
    {
      id: 805,
      question: "Manakah komponen berikut yang merupakan bagian dari Metadata Indikator (MS-Ind)?",
      options: [
        { id: "A", text: "Formula/rumus matematis perhitungan dan interpretasi arah capaian" },
        { id: "B", text: "Merek scanner dokumen yang digunakan" },
        { id: "C", text: "Nomor plat mobil dinas pimpinan" },
        { id: "D", text: "Daftar konsumsi petugas lapangan" }
      ],
      correctAnswer: "A",
      explanation: "MS-Ind wajib menyajikan rumus perhitungan (pembilang & penyebut) serta interpretasi arah metrik indikator."
    },
    {
      id: 806,
      question: "Dalam prinsip Satu Data Indonesia, Kode Referensi nasional (seperti Kode Wilayah Kemendagri) berfungsi sebagai...",
      options: [
        { id: "A", text: "Kunci penyatu dan penyeragam data lintas perangkat daerah agar tidak terjadi perbedaan penamaan entitas" },
        { id: "B", text: "Kode rahasia keamanan server daerah" },
        { id: "C", text: "Nomor urut absensi pegawai kantor" },
        { id: "D", text: "Penghitung anggaran biaya kegiatan" }
      ],
      correctAnswer: "A",
      explanation: "Kode referensi baku menjamin keterhubungan (*data linkage*) antar tabel dari berbagai OPD."
    },
    {
      id: 807,
      question: "Bagaimanakah alur pengajuan Metadata Statistik Kegiatan (MS-Keg) oleh Produsen Data di tingkat kabupaten/kota?",
      options: [
        { id: "A", text: "Produsen Data mengajukan ke Walidata Daerah (Diskominfo) -> Walidata memeriksa awal -> BPS melakukan telaah rekomendasi" },
        { id: "B", text: "Produsen Data langsung mengunggah ke portal tanpa konfirmasi siapapun" },
        { id: "C", text: "Produsen Data mengirimkan surat pos ke Presiden RI" },
        { id: "D", text: "Produsen Data mencetak spanduk di jalan protokol" }
      ],
      correctAnswer: "A",
      explanation: "Sesuai tata kelola SDI daerah, alur berjenjang: Produsen Data -> Walidata Daerah (Diskominfo) -> Pembina Data (BPS)."
    },
    {
      id: 808,
      question: "Definisi operasional pada Metadata Variabel (MS-Var) harus memuat...",
      options: [
        { id: "A", text: "Penjelasan batas-batas pengukuran variabel secara nyata di lapangan agar enumerator mencatat data yang seragam" },
        { id: "B", text: "Pujian kepada pimpinan instansi" },
        { id: "C", text: "Cerita sejarah pendirian kantor dinas" },
        { id: "D", text: "Keluhan mengenai anggaran dinas" }
      ],
      correctAnswer: "A",
      explanation: "Definisi operasional merinci kriteria inklusi dan eksklusi objek agar pencatatan seragam dan objektif."
    },
    {
      id: 809,
      question: "Teknologi pertukaran data yang memungkinkan portal Satu Data Daerah mengambil pembaruan data secara langsung dari database OPD tanpa intervensi manual adalah...",
      options: [
        { id: "A", text: "RESTful Web API (Application Programming Interface)" },
        { id: "B", text: "Pengiriman CD/DVD room via kurir" },
        { id: "C", text: "Fotokopi buku tabel statistik" },
        { id: "D", text: "Pengiriman fax manual" }
      ],
      correctAnswer: "A",
      explanation: "REST API menghubungkan mesin ke mesin secara otomatis dengan format pertukaran data terbuka (JSON/XML)."
    },
    {
      id: 810,
      question: "Bila seluruh Produsen Data di suatu daerah telah konsisten menerapkan MS-Keg, MS-Var, MS-Ind, dan interoperabilitas data, capaian positif yang diperoleh adalah...",
      options: [
        { id: "A", text: "Indeks Pembangunan Statistik (IPS) daerah meningkat tinggi dan kebijakan publik berbasis data yang akurat dapat terwujud" },
        { id: "B", text: "Jumlah pegawai dinas berkurang drastis" },
        { id: "C", text: "Anggaran APBD tidak perlu disusun lagi" },
        { id: "D", text: "Komputer kantor tidak perlu disambung ke listrik" }
      ],
      correctAnswer: "A",
      explanation: "Kepatuhan terhadap standar metadata dan interoperabilitas merupakan domain utama dalam evaluasi kematangan statistik (EPSS) menuju Satu Data Indonesia yang berkualitas."
    }
  ]
};

export const COURSES_DATA: CourseData[] = [
  {
    id: 'pss-2026',
    code: 'SDI-PSS-2026',
    title: 'Pembinaan Statistik Sektoral 2026',
    subtitle: 'Standar Kompetensi Penyelenggara Satu Data Indonesia Tingkat Daerah',
    category: 'Tata Kelola SDI',
    badge: 'Program Resmi SDI',
    description: 'Program wajib pembinaan statistik sektoral bagi Walidata dan Produsen Data OPD sesuai amanat Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia.',
    estimatedDuration: '4 Jam Pembelajaran',
    moduleIds: [1, 2, 3, 4],
    finalExam: FINAL_EXAM_DATA
  },
  {
    id: 'meta-2026',
    code: 'SDI-META-2026',
    title: 'Tata Kelola Metadata Statistik & Interoperabilitas Data 2026',
    subtitle: 'Standar Pengelolaan Metadata Kegiatan (MS-Keg), Variabel (MS-Var), Indikator (MS-Ind), dan Format Baku SDI',
    category: 'Spesialisasi Teknis SDI',
    badge: 'Kelas Teknis BPS',
    description: 'Bimbingan teknis intensif penyusunan instrumen metadata statistik sektoral standar nasional dan arsitektur interoperabilitas data terbuka bagi portal Satu Data Indonesia.',
    estimatedDuration: '3 Jam Pembelajaran',
    moduleIds: [5, 6, 7],
    finalExam: FINAL_EXAM_META_DATA
  }
];

export const DEMO_USERS = {
  student: {
    id: 'usr-student-01',
    name: "Ahmad Fauzi, S.Kom.",
    nip: "19920315 201903 1 004",
    agency: "Dinas Komunikasi, Informatika, Statistik dan Persandian",
    role: "student" as const,
    jobTitle: "Pranata Komputer / Operator Walidata",
    email: "ahmad.fauzi@pesisirbaratkab.go.id",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
  },
  admin: {
    id: 'usr-admin-01',
    name: "Drs. Hendra Kurniawan, M.Si.",
    nip: "19780512 200312 1 003",
    agency: "Bappeda & Tim Pembina Statistik Sektoral SDI",
    role: "admin" as const,
    jobTitle: "Koordinator Kurikulum & Administrator LMS",
    email: "admin.sdi@pesisirbaratkab.go.id",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  }
};

export const INITIAL_USER_PROFILE = DEMO_USERS.student;
