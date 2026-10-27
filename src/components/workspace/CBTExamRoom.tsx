import React, { useState, useEffect } from 'react';
import { Question } from '../../types/lms';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowLeft
} from 'lucide-react';

export interface CBTExamRoomProps {
  title: string;
  category: string;
  questions: Question[];
  draftAnswers: Record<number, string>;
  onSelectOption: (questionId: number, optionId: string) => void;
  onSubmitExam: () => void;
  onExitExam?: () => void;
  durationMinutes: number;
}

export const CBTExamRoom: React.FC<CBTExamRoomProps> = ({
  title,
  category,
  questions,
  draftAnswers,
  onSelectOption,
  onSubmitExam,
  onExitExam,
  durationMinutes,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // Live Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onSubmitExam]);

  // Format time as 04m:52s (matching reference)
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const padMins = String(mins).padStart(2, '0');
    const padSecs = String(secs).padStart(2, '0');
    return `${padMins}m:${padSecs}s`;
  };

  const isLowTime = timeLeft < 120; // less than 2 mins
  const currentQuestion = questions[currentIndex] || questions[0];
  const selectedOption = draftAnswers[currentQuestion.id];

  const totalQuestions = questions.length;
  const answeredCount = questions.filter(q => Boolean(draftAnswers[q.id])).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleConfirmSubmit = () => {
    setSubmitConfirmOpen(false);
    onSubmitExam();
  };

  const handleConfirmExit = () => {
    setExitConfirmOpen(false);
    if (onExitExam) {
      onExitExam();
    }
  };

  return (
    <div className="w-full h-screen min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none overflow-hidden animate-fadeIn">
      
      {/* 1. Top Header Bar: Clean White with subtle border */}
      <header className="h-16 px-6 sm:px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          {onExitExam && (
            <button
              type="button"
              onClick={() => setExitConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white transition-colors"
              title="Keluar sementara dari sesi ujian"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Keluar Ujian</span>
            </button>
          )}

          <div className="hidden sm:block pl-3 border-l border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              {title}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Satu Data Indonesia · BPS
            </span>
          </div>
        </div>

        {/* Timer Box (Formatted as 04m:52s) */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-xs sm:text-sm tracking-wider transition-colors shadow-2xs ${
            isLowTime
              ? 'border-red-300 bg-red-50 text-red-600 animate-pulse'
              : 'border-slate-200 bg-slate-50 text-slate-800'
          }`}
          title="Sisa waktu pengerjaan ujian"
        >
          <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-red-500' : 'text-slate-500'}`} />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </header>

      {/* 2. Main Exam Canvas: 2-Column CBT Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
        
        {/* KOLOM KIRI: Palet Navigasi Nomor Soal (Clean White Sidebar) */}
        <aside className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-5 sm:p-6 flex flex-col overflow-y-auto shrink-0 shadow-2xs">
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-snug tracking-tight">
              Soal kategori: {category}
            </span>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>Terjawab: <strong className="text-emerald-700 font-semibold">{answeredCount}</strong> dari {totalQuestions}</span>
              {unansweredCount > 0 && (
                <span className="text-amber-800 font-medium">{unansweredCount} belum</span>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 my-4" />

          {/* Number Grid: [1], [2], [3]... */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = Boolean(draftAnswers[q.id]);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold transition-all relative flex items-center justify-center active:scale-95 ${
                    isCurrent
                      ? 'bg-blue-950 text-white font-bold shadow-xs ring-2 ring-blue-900/30'
                      : isAnswered
                      ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                      : 'border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  title={`Soal nomor ${idx + 1} ${isAnswered ? '(Sudah dijawab)' : '(Belum dijawab)'}`}
                >
                  <span>{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="border-t border-slate-100 mt-5 pt-3 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-950 shrink-0" />
              <span>Sedang dibuka</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
              <span>Sudah dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-white border border-slate-200 shrink-0" />
              <span>Belum dijawab</span>
            </div>
          </div>

          {/* Submit Shortcut */}
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={() => setSubmitConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              <span>Kumpulkan Jawaban</span>
            </button>
          </div>
        </aside>

        {/* KOLOM KANAN: Lembar Pertanyaan Tunggal (Clean Canvas) */}
        <main className="flex-1 bg-slate-50/60 p-6 sm:p-10 lg:p-12 overflow-y-auto flex flex-col justify-between max-w-4xl mx-auto w-full">
          
          <div className="space-y-6">
            {/* White Question Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
              
              {/* Question Header Tag */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="font-bold text-blue-950">
                  Pertanyaan {currentIndex + 1} dari {totalQuestions}
                </span>
                <span className="font-mono text-slate-400">
                  ID Soal #{currentQuestion.id}
                </span>
              </div>

              {/* Question Statement */}
              <p className="text-slate-900 font-medium text-base sm:text-lg leading-relaxed">
                {currentQuestion.question}
              </p>

              {/* Multiple Choice Radio Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onSelectOption(currentQuestion.id, option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 active:scale-[0.99] ${
                        isSelected
                          ? 'border-blue-950 bg-blue-50/60 text-blue-950 shadow-2xs ring-1 ring-blue-950'
                          : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {/* Circular Radio Indicator */}
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-blue-950 bg-blue-950'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      {/* Option Text */}
                      <span className={`text-sm sm:text-base leading-relaxed ${
                        isSelected ? 'font-semibold text-blue-950' : 'text-slate-700'
                      }`}>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Navigation Controls: Sebelumnya, Selanjutnya, Kumpulkan */}
          <div className="pt-6 mt-6">
            <div className="flex items-center justify-between gap-4">
              {currentIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold active:scale-95 transition-all shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
              ) : (
                <div />
              )}

              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all group"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubmitConfirmOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kumpulkan Jawaban</span>
                </button>
              )}
            </div>
          </div>

        </main>

      </div>

      {/* Confirmation Modal Before Submission */}
      <ConfirmDialog
        isOpen={submitConfirmOpen}
        title="Kumpulkan Jawaban Ujian?"
        message={`Anda telah menjawab ${answeredCount} dari ${totalQuestions} pertanyaan.`}
        unansweredCount={unansweredCount}
        confirmLabel="Ya, Kumpulkan Sekarang"
        cancelLabel="Periksa Kembali"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setSubmitConfirmOpen(false)}
      />

      {/* Confirmation Modal Before Exiting */}
      {onExitExam && (
        <ConfirmDialog
          isOpen={exitConfirmOpen}
          title="Keluar dari Sesi Ujian?"
          message="Jawaban yang telah Anda pilih sudah tersimpan di sistem. Waktu pengerjaan akan tetap berjalan. Anda yakin ingin kembali ke halaman informasi?"
          confirmLabel="Ya, Keluar Sementara"
          cancelLabel="Lanjutkan Mengerjakan"
          onConfirm={handleConfirmExit}
          onCancel={() => setExitConfirmOpen(false)}
        />
      )}

    </div>
  );
};
