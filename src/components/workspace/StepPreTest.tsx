import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { ExamIntroView } from './ExamIntroView';
import { ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const StepPreTest: React.FC = () => {
  const {
    activeModuleId,
    modules,
    moduleProgresses,
    goToStep,
    startExamSession,
  } = useLMS();

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const progress = moduleProgresses[activeModuleId];

  const isSubmitted = Boolean(progress?.preTestSubmitted);
  const attendanceChecked = Boolean(progress?.attendanceChecked);
  const submittedAnswers = progress?.preTestAnswers || {};
  const questions = currentModule.preTestQuestions;

  // 1. If attendance not checked yet, show guidance
  if (!attendanceChecked) {
    return (
      <div className="space-y-4 max-w-2xl animate-fadeIn">
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Presensi Kehadiran Belum Diisi
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Anda harus mengisi dan menyetujui pernyataan presensi kehadiran untuk Modul {currentModule.number} terlebih dahulu sebelum dapat mengerjakan Entry Test (Pre-Test).
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => goToStep(activeModuleId, 'attendance')}
                  className="px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Buka Lembar Presensi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Intro / Rules Page before starting (Launches Pure Full-Screen CBT)
  if (!isSubmitted) {
    return (
      <ExamIntroView
        title={`Aturan Entry Test: Modul ${currentModule.number}`}
        moduleBadge={`Modul ${currentModule.number} · ${currentModule.code}`}
        purpose={`Ujian ini bertujuan untuk menguji dan memetakan pemahaman awal Anda terhadap topik "${currentModule.title}" sebelum melangkah ke tahap materi pembelajaran.`}
        totalQuestions={questions.length}
        durationMinutes={15}
        allowRetake={false}
        isPreTest={true}
        onStartExam={() => {
          startExamSession({
            testType: 'pretest',
            moduleId: activeModuleId,
            title: `Entry Test: Modul ${currentModule.number}`,
            category: currentModule.title,
            questions: questions,
            durationMinutes: 15,
          });
        }}
      />
    );
  }

  // 3. Review / Result Mode (After submission: No Retake Button for Pre-Test)
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Entry Test: Modul {currentModule.number}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-xl">
          Tes diagnostik awal untuk mengukur pemahaman awal Anda sebelum materi dipelajari. Entry Test ini hanya dapat dikerjakan 1 kali.
        </p>
      </div>

      {/* Review Mode Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-blue-950">Mode Peninjauan Entry Test</span>
              <span className="font-mono text-xs font-bold bg-white text-blue-950 px-2 py-0.5 rounded border border-blue-200">
                Nilai: {progress?.preTestScore}
              </span>
            </div>
            <p className="text-xs text-blue-800 mt-1">
              Entry Test telah selesai. Anda dapat meninjau lembar jawaban dan pembahasan di bawah ini atau langsung melanjutkan ke materi pembelajaran.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goToStep(activeModuleId, 'material')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>Lanjut ke Materi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Questions List Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-semibold text-slate-800">
            Daftar Soal & Pembahasan Kunci Jawaban
          </span>
          <span className="text-slate-500 font-mono">
            {questions.length} Butir Soal
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
