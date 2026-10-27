import React, { useRef, useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Check
} from 'lucide-react';

export const CertificateView: React.FC = () => {
  const {
    courses,
    activeCourseId,
    courseFinalExamProgress,
    certificateInfo,
    userProfile,
    updateUserProfile,
    setActiveView,
    finalExamProgress,
    showToast,
  } = useLMS();

  const currentCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const courseExamProg = courseFinalExamProgress[currentCourse.id] || finalExamProgress;
  const isPassed = courseExamProg.passed;

  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [name, setName] = useState(userProfile.name);
  const [nip, setNip] = useState(userProfile.nip);
  const [agency, setAgency] = useState(userProfile.agency);

  if (!isPassed || !certificateInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <h2 className="text-lg font-bold text-slate-900">
          Sertifikat Belum Diterbitkan
        </h2>
        <p className="mt-1.5 text-xs text-slate-600 max-w-md mx-auto">
          Sertifikat kelulusan kompetensi untuk kelas "{currentCourse.title}" akan otomatis terbit setelah Anda dinyatakan lulus Ujian Akhir (KKM ≥ {currentCourse.finalExam.passingScore}).
        </p>
        <button
          type="button"
          onClick={() => setActiveView('progress')}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Progres Belajar</span>
        </button>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateUserProfile({ name, nip, agency });
    setIsEditingProfile(false);
    showToast('success', 'Profil Diperbarui', 'Data peserta pada sertifikat berhasil diperbarui.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPdf(true);
    showToast('info', 'Menyiapkan PDF', 'Memproses berkas sertifikat...');

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Sertifikat_${currentCourse.code}_${userProfile.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      showToast('success', 'PDF Terunduh', 'Sertifikat resmi berhasil disimpan.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal Membuat PDF', 'Silakan gunakan tombol Cetak.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveView('progress')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Progres Belajar</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Ubah Nama / NIP</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Unduh PDF'}</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Drawer */}
      {isEditingProfile && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Ubah Identitas Penerima Sertifikat</span>
            <span className="text-slate-500">Perubahan otomatis terpasang pada sertifikat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Nama Lengkap & Gelar:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">NIP (Nomor Induk Pegawai):</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Instansi / Unit Kerja:</label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-3 py-1 font-semibold bg-blue-900 text-white rounded flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Simpan</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Certificate Visual Canvas (A4 Landscape) */}
      <div className="overflow-x-auto pb-6">
        <div
          id="printable-certificate"
          ref={certificateRef}
          className="w-[960px] min-h-[660px] mx-auto bg-white text-slate-900 p-12 border border-slate-300 shadow-sm relative select-none"
        >
          {/* Outer & Inner Border */}
          <div className="absolute inset-4 border border-slate-800 pointer-events-none" />
          <div className="absolute inset-5 border border-slate-300 pointer-events-none" />

          {/* Certificate Content */}
          <div className="relative z-10 flex flex-col justify-between h-[580px] text-center">
            
            {/* Header / Kop Instansi */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-950 text-white flex items-center justify-center font-bold text-sm tracking-widest">
                  BPS
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 leading-tight">
                    BADAN PUSAT STATISTIK & KOMITE SATU DATA INDONESIA
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Pusat Pembinaan Penyelenggaraan Statistik Sektoral
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h1 className="text-lg font-bold text-slate-900 uppercase tracking-widest">
                  Sertifikat Kelulusan Kompetensi
                </h1>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  Nomor: {certificateInfo.certificateNumber}
                </p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="py-4 my-auto">
              <p className="text-xs text-slate-500">
                Diberikan kepada:
              </p>

              <h2 className="text-2xl font-bold text-blue-950 tracking-tight mt-2">
                {userProfile.name}
              </h2>

              <p className="mt-1 text-xs font-mono text-slate-600">
                NIP {userProfile.nip}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {userProfile.agency}
              </p>

              <div className="w-24 h-px bg-slate-300 mx-auto my-3" />

              <p className="max-w-xl mx-auto text-xs text-slate-700 leading-relaxed">
                Telah mengikuti dan dinyatakan <strong className="text-slate-900">LULUS</strong> pada program terstruktur{' '}
                <strong>{currentCourse.title}</strong>, mencakup {currentCourse.moduleIds.length} Modul Standar Nasional dan Ujian Akhir Komprehensif dengan nilai kelulusan <strong className="font-mono text-slate-900">{courseExamProg.score || certificateInfo.finalScore}</strong>.
              </p>
            </div>

            {/* Footer / QR, Seal, Signer */}
            <div className="pt-4 border-t border-slate-200 flex items-end justify-between px-6">
              
              {/* QR Verification */}
              <div className="flex items-center gap-3 text-left">
                <div className="w-14 h-14 bg-slate-100 p-1 rounded border border-slate-300 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-2 h-2 bg-white" />
                      <div className="w-2 h-2 bg-white" />
                    </div>
                    <div className="text-[6px] font-mono text-white text-center font-bold">SDI-QR</div>
                    <div className="flex justify-between">
                      <div className="w-2 h-2 bg-white" />
                      <div className="w-1 h-1 bg-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Verifikasi Keaslian</span>
                  <span className="text-[10px] text-slate-600 font-mono block">satudata.go.id/verifikasi</span>
                  <span className="text-[9px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Terverifikasi Digital
                  </span>
                </div>
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-slate-400 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-dashed border-slate-500 flex flex-col items-center justify-center text-slate-700 text-center">
                    <span className="text-[8px] font-bold uppercase tracking-tight leading-none">BPS SDI</span>
                    <span className="text-[7px] font-mono leading-none mt-0.5">2026</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Jakarta, {certificateInfo.issueDate}
                </p>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                  {certificateInfo.signeeTitle}
                </p>

                <div className="h-10 flex items-center justify-end my-1">
                  <div className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-right">
                    <span className="text-[9px] font-mono text-slate-700 block">
                      [Tanda Tangan Elektronik]
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-900 underline">
                  {certificateInfo.signeeName}
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  NIP. 19740812 199602 1 001
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
