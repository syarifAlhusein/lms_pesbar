import React, { useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { ExamIntroView } from '../workspace/ExamIntroView';
import confetti from 'canvas-confetti';
import {
  Lock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award
} from 'lucide-react';

export const FinalExamWorkspace: React.FC = () => {
  const {
    courses,
    activeCourseId,
    courseFinalExamProgress,
    finalExamProgress,
    retakeFinalExam,
    setActiveView,
    moduleProgresses,
    startExamSession,
  } = useLMS();

  const currentCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const currentCourseExam = currentCourse.finalExam;
  const courseExamProgress = courseFinalExamProgress[currentCourse.id] || finalExamProgress;

  const isCourseComplete = currentCourse.moduleIds.every(
    id => moduleProgresses[id]?.status === 'COMPLETED'
  );
  const completedCourseModulesCount = currentCourse.moduleIds.filter(
    id => moduleProgresses[id]?.status === 'COMPLETED'
  ).length;

  const isLocked = !isCourseComplete;
  const isSubmitted = courseExamProgress.submitted;
  const isPassed = courseExamProgress.passed;
  const attempts = courseExamProgress.attempts || [];
  const currentAttemptNumber = attempts.length + (isSubmitted ? 0 : 1);
  const answers = courseExamProgress.currentAnswers || {};
  const questions = currentCourseExam.questions;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isPassed]);

  // 1. Locked Screen
  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Ujian Akhir Masih Terkunci
        </h2>
        <p className="mt-1.5 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Anda harus menyelesaikan dan lulus seluruh {currentCourse.moduleIds.length} modul pembelajaran pada kelas "{currentCourse.title}" terlebih dahulu sebelum dapat mengakses lembar Ujian Akhir Komprehensif.
        </p>
        <p className="mt-2 text-xs font-mono text-slate-500">
          Progres: {completedCourseModulesCount} dari {currentCourse.moduleIds.length} modul tuntas
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setActiveView('progress')}
            className="px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Progres Belajar</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Intro / Rules Page before starting (Launches Pure Full-Screen CBT)
  if (!isSubmitted) {
    return (
      <div className="space-y-4">
        {/* Navigation button back to progress */}
        <div>
          <button
            type="button"
            onClick={() => setActiveView('progress')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Progres Belajar</span>
          </button>
        </div>

        <ExamIntroView
          title={currentCourseExam.title}
          moduleBadge={`Evaluasi Kelulusan Resmi SDI · ${currentCourse.code}`}
          purpose={currentCourseExam.description}
          totalQuestions={questions.length}
          durationMinutes={currentCourseExam.durationMinutes || 30}
          passingScore={currentCourseExam.passingScore}
          allowRetake={true}
          attempts={attempts}
          onStartExam={() => {
            startExamSession({
              testType: 'final-exam',
              courseId: currentCourse.id,
              title: currentCourseExam.title,
              category: currentCourse.title,
              questions: currentCourseExam.questions,
              durationMinutes: currentCourseExam.durationMinutes || 30,
            });
          }}
        />
      </div>
    );
  }

  // 3. Review / Result Mode (After submission)
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveView('progress')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Progres Belajar</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
            KKM: {currentCourseExam.passingScore}
          </span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
            Percobaan {currentAttemptNumber}
          </span>
        </div>
      </div>

      {/* Title Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
        <span className="text-[11px] font-mono text-slate-400 block mb-1">
          EVALUASI AKHIR KOMPREHENSIF · {currentCourse.code}
        </span>
        <h1 className="text-xl font-bold tracking-tight">
          {currentCourseExam.title}
        </h1>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-xl">
          {currentCourseExam.description}
        </p>
      </div>

      {/* CASE A: FAILED */}
      {isSubmitted && !isPassed && (
        <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-300 text-amber-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-amber-950">
              Belum Mencapai Nilai Ambang Batas Ujian Akhir
            </h3>
            <span className="font-mono text-xs font-bold bg-white text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              Nilai: {courseExamProgress.score} (KKM {currentCourseExam.passingScore})
            </span>
          </div>

          <p className="mt-2 text-xs text-amber-900 leading-relaxed">
            Standar kelulusan Ujian Akhir adalah minimal <strong className="font-mono">{currentCourseExam.passingScore}</strong>. Anda dapat mengulangi ujian ini kembali sampai dinyatakan lulus untuk menerbitkan sertifikat kompetensi resmi.
          </p>

          <div className="mt-4 pt-3 border-t border-amber-200/80">
            <button
              type="button"
              onClick={retakeFinalExam}
              className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Ujian Akhir Sekarang</span>
            </button>
          </div>

          {/* Attempts Table */}
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
                      <th className="py-1.5 px-3">Status</th>
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
                            <span className="text-amber-700">Belum Lolos</span>
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

      {/* CASE B: PASSED */}
      {isSubmitted && isPassed && (
        <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-300 text-emerald-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-emerald-950">
              Selamat, Anda Dinyatakan Lulus Ujian Akhir Komprehensif
            </h3>
            <span className="font-mono text-xs font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
              Nilai Kelulusan: {courseExamProgress.score}
            </span>
          </div>

          <p className="mt-2 text-xs text-emerald-900 leading-relaxed">
            Anda telah menyelesaikan seluruh kurikulum kelas "{currentCourse.title}". Sertifikat tanda kelulusan resmi Anda telah berhasil diterbitkan.
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveView('certificate')}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Buka & Cetak Sertifikat Resmi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('progress')}
              className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium transition-colors"
            >
              Kembali ke Progres Belajar
            </button>
          </div>
        </div>
      )}

      {/* Questions List Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-semibold text-slate-800">
            Daftar Soal & Kunci Jawaban
          </span>
          <span className="text-slate-500 font-mono">
            {questions.length} Butir Soal (Mode Peninjauan)
          </span>
        </div>

        {questions.map((q, index) => {
          const selectedOption = answers[q.id];

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
