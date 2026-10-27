import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { ExamIntroView } from './ExamIntroView';
import {
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  GraduationCap
} from 'lucide-react';

export const StepPostTest: React.FC = () => {
  const {
    activeModuleId,
    modules,
    moduleProgresses,
    retakePostTest,
    goToStep,
    setActiveModuleId,
    setActiveView,
    startExamSession,
  } = useLMS();

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const progress = moduleProgresses[activeModuleId];
  const questions = currentModule.postTestQuestions;

  const isSubmitted = Boolean(progress?.postTestSubmitted);
  const isPassed = Boolean(progress?.postTestPassed);
  const attempts = progress?.postTestAttempts || [];
  const currentAttemptNumber = attempts.length + (isSubmitted ? 0 : 1);
  const submittedAnswers = progress?.postTestAnswers || {};

  const nextModule = modules.find(m => m.id === activeModuleId + 1);
  const isLastModule = activeModuleId === modules.length;

  // 1. Intro / Rules Page before starting (Launches Pure Full-Screen CBT)
  if (!isSubmitted) {
    return (
      <ExamIntroView
        title={`Aturan Post-Test: Modul ${currentModule.number}`}
        moduleBadge={`Modul ${currentModule.number} · ${currentModule.code}`}
        purpose={`Ujian evaluasi ini bertujuan untuk menguji dan mengukur penguasaan kompetensi Anda terhadap materi "${currentModule.title}".`}
        totalQuestions={questions.length}
        durationMinutes={15}
        passingScore={currentModule.passingScore}
        allowRetake={true}
        attempts={attempts}
        onStartExam={() => {
          startExamSession({
            testType: 'posttest',
            moduleId: activeModuleId,
            title: `Post-Test: Modul ${currentModule.number}`,
            category: currentModule.title,
            questions: questions,
            durationMinutes: 15,
          });
        }}
      />
    );
  }

  // 2. Review / Result Mode (After submission)
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Post-Test: {currentModule.title}
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
              Ambang Batas: {currentModule.passingScore}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
              Percobaan {currentAttemptNumber}
            </span>
          </div>
        </div>
      </div>

      {/* CASE A: FAILED (< Passing Grade) */}
      {isSubmitted && !isPassed && (
        <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-300 text-amber-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-amber-950">
              Belum Mencapai Ambang Batas Kelulusan
            </h3>
            <span className="font-mono text-xs font-bold bg-white text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              Skor: {progress?.postTestScore} (KKM {currentModule.passingScore})
            </span>
          </div>

          <p className="mt-2 text-xs text-amber-900 leading-relaxed">
            Anda memperoleh nilai <strong className="font-mono">{progress?.postTestScore}</strong> dari standar minimal <strong className="font-mono">{currentModule.passingScore}</strong>. Anda dapat mengulang Post-Test ini sampai lulus. Nilai yang disimpan adalah nilai pada saat dinyatakan lulus.
          </p>

          <div className="mt-4 pt-3 border-t border-amber-200/80 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => retakePostTest(activeModuleId)}
              className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Post-Test Sekarang</span>
            </button>

            <button
              type="button"
              onClick={() => goToStep(activeModuleId, 'material')}
              className="px-3.5 py-2 rounded-lg border border-amber-300 bg-white hover:bg-amber-100/50 text-amber-900 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pelajari Ulang Materi</span>
            </button>
          </div>

          {/* Attempt History Table */}
          {attempts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-amber-200/60">
              <span className="text-[11px] font-semibold text-amber-900 block mb-1.5">
                Riwayat Percobaan:
              </span>
              <div className="bg-white rounded-lg border border-amber-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-amber-100/40 text-amber-950 font-semibold text-[11px]">
                    <tr>
                      <th className="py-1.5 px-3">Percobaan</th>
                      <th className="py-1.5 px-3">Waktu</th>
                      <th className="py-1.5 px-3">Benar</th>
                      <th className="py-1.5 px-3">Skor</th>
                      <th className="py-1.5 px-3">Hasil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-mono text-[11px]">
                    {attempts.map((att) => (
                      <tr key={att.attemptNumber}>
                        <td className="py-1.5 px-3 font-bold">Ke-{att.attemptNumber}</td>
                        <td className="py-1.5 px-3 font-sans text-slate-500">{att.date}</td>
                        <td className="py-1.5 px-3">{att.correctCount}/{att.totalQuestions}</td>
                        <td className="py-1.5 px-3 font-bold">{att.score}</td>
                        <td className="py-1.5 px-3 font-sans">
                          {att.passed ? (
                            <span className="text-emerald-700 font-semibold">Lulus</span>
                          ) : (
                            <span className="text-amber-700">Mengulang</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CASE B: PASSED (>= Passing Grade) */}
      {isSubmitted && isPassed && (
        <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-300 text-emerald-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-emerald-950">
              Selamat, Anda Dinyatakan Lulus Post-Test Modul {currentModule.number}
            </h3>
            <span className="font-mono text-xs font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
              Nilai Tersimpan: {progress?.postTestScore}
            </span>
          </div>

          <p className="mt-2 text-xs text-emerald-900 leading-relaxed">
            Post-Test telah dinyatakan lulus dan tahapan berikutnya telah berhasil dibuka.{' '}
            {!isLastModule && nextModule ? (
              <span>Silakan melanjutkan ke Modul {nextModule.number} ({nextModule.title}).</span>
            ) : (
              <span>Seluruh modul 1 s.d. 4 telah tuntas. Anda kini berhak mengikuti Ujian Akhir Komprehensif.</span>
            )}
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center gap-2.5">
            {!isLastModule && nextModule ? (
              <button
                type="button"
                onClick={() => {
                  setActiveModuleId(nextModule.id);
                  goToStep(nextModule.id, 'attendance');
                }}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Lanjut ke Modul {nextModule.number} ({nextModule.title.substring(0, 24)}…)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('final-exam')}
                className="px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Lanjut ke Ujian Akhir</span>
                <GraduationCap className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions List Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-semibold text-slate-800">
            Daftar Soal & Pembahasan Kunci Jawaban
          </span>
          <span className="text-slate-500 font-mono">
            {questions.length} Butir Soal (Mode Peninjauan)
          </span>
        </div>

        {questions.map((q, index) => {
          const selectedOption = submittedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="mt-3.5 space-y-2">
                    {q.options.map((opt) => {
                      const isOptionSelected = selectedOption === opt.id;
                      const isOptionCorrect = opt.id === q.correctAnswer;

                      let style = 'bg-white border-slate-200 text-slate-400 opacity-60';

                      if (isOptionCorrect) {
                        style = 'bg-emerald-50/60 border-emerald-400 text-emerald-950 font-medium opacity-100';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        style = 'bg-red-50/40 border-red-300 text-red-950 opacity-100';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-xs select-none ${style}`}
                        >
                          <div className="flex-1">
                            <span className="font-mono font-semibold uppercase mr-1.5">{opt.id}.</span>
                            <span>{opt.text}</span>
                          </div>

                          {isOptionCorrect && (
                            <span className="shrink-0 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Kunci Jawaban
                            </span>
                          )}
                          {isOptionSelected && !isOptionCorrect && (
                            <span className="shrink-0 text-[10px] text-red-800 bg-red-100 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Pilihan Anda
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-200/80">
                    <span className="font-semibold text-slate-800 block mb-0.5">Penjelasan Materi:</span>
                    {q.explanation}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
