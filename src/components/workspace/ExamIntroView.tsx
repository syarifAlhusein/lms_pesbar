import React, { useState } from 'react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { AttemptRecord } from '../../types/lms';
import {
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  Play,
  Calendar,
  History
} from 'lucide-react';

export interface ExamIntroViewProps {
  title: string;
  moduleBadge?: string;
  purpose: string;
  totalQuestions: number;
  durationMinutes: number;
  passingScore?: number; // undefined if pre-test
  allowRetake: boolean;
  attempts?: AttemptRecord[];
  onStartExam: () => void;
  isPreTest?: boolean;
}

export const ExamIntroView: React.FC<ExamIntroViewProps> = ({
  title,
  moduleBadge,
  purpose,
  totalQuestions,
  durationMinutes,
  passingScore,
  allowRetake,
  attempts = [],
  onStartExam,
  isPreTest = false,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleStartClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onStartExam();
  };

  const currentAttemptNumber = attempts.length + 1;

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn pb-12">
      {/* 1. Header & Title (Editorial Style matching Dicoding) */}
      <div className="space-y-3">
        {moduleBadge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold">
            {moduleBadge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {purpose}
        </p>
      </div>

      {/* 2. Ketentuan / Aturan Pelaksanaan (Clean Card & Bullets) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Ketentuan & Aturan Pengerjaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Terdapat <strong className="font-semibold text-slate-900">{totalQuestions} pertanyaan</strong> pilihan ganda yang harus dikerjakan dalam sesi tes ini. Beberapa ketentuan yang berlaku sebagai berikut:
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-900 shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Jumlah Soal</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{totalQuestions} Butir</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Alokasi Waktu</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{durationMinutes} Menit</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Standar Kelulusan</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {passingScore ? `KKM ${passingScore}%` : 'Diagnostik Awal'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Bullet Points */}
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
            {passingScore ? (
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <span>
                  <strong>Syarat nilai kelulusan</strong>: Minimal <strong>{passingScore}%</strong> jawaban benar untuk dinyatakan lulus.
                </span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <span>
                  <strong>Tanpa Ambang Batas Kelulusan</strong>: Hasil tes ini digunakan murni sebagai tolok ukur pemahaman awal sebelum mempelajari materi.
                </span>
              </li>
            )}

            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              <span>
                <strong>Durasi pengerjaan</strong>: <strong>{durationMinutes} menit</strong> terhitung sejak tombol konfirmasi ditekan.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              <span>
                {allowRetake ? (
                  <span>
                    <strong>Aturan Percobaan</strong>: Apabila nilai belum memenuhi syarat kelulusan, Anda dapat mengulang tes ini kembali hingga lulus.
                  </span>
                ) : (
                  <span>
                    <strong>Kesempatan Tunggal</strong>: Entry Test ini hanya dapat dikerjakan <strong>1 kali</strong> dan tidak dapat diulang.
                  </span>
                )}
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              <span>
                Jawaban otomatis disimpan oleh sistem. Anda dapat berpindah nomor soal secara bebas sebelum mengumpulkan lembar jawaban.
              </span>
            </li>
          </ul>

          <div className="pt-2 text-xs text-slate-500 italic">
            Selamat Mengerjakan! Pastikan Anda berada di lingkungan yang kondusif.
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {attempts.length > 0
              ? `Percobaan ke-${currentAttemptNumber}`
              : isPreTest
              ? 'Percobaan Tunggal (1x)'
              : 'Percobaan Pertama'}
          </span>
          <button
            type="button"
            onClick={handleStartClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>
              {attempts.length > 0 ? 'Mulai Percobaan Baru' : 'Mulai Sekarang'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Riwayat Percobaan Sebelumnya (Jika ada) */}
      {attempts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <History className="w-4 h-4 text-slate-500" />
            <span>Riwayat Pengerjaan Sebelumnya</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Percobaan</th>
                  <th className="py-2.5 px-4">Waktu Pengerjaan</th>
                  <th className="py-2.5 px-4">Benar / Total</th>
                  <th className="py-2.5 px-4">Skor</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((att) => (
                  <tr key={att.attemptNumber} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      Ke-{att.attemptNumber}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{att.date}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-mono">
                      {att.correctCount} / {att.totalQuestions}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {att.score}
                    </td>
                    <td className="py-2.5 px-4">
                      {att.passed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Lulus</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
                          <XCircle className="w-3 h-3 text-amber-600" />
                          <span>Belum Lulus</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Start Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Mulai Pengerjaan Tes?"
        message={`Penghitung waktu (${durationMinutes} menit) akan langsung berjalan setelah Anda menekan tombol konfirmasi. Pastikan Anda siap mengerjakan seluruh ${totalQuestions} pertanyaan tanpa interupsi.`}
        confirmLabel="Ya, Mulai Sekarang"
        cancelLabel="Batal"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};
