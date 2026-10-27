import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CourseData } from '../../types/lms';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  FileCheck2
} from 'lucide-react';

export const ProgressLearningPage: React.FC = () => {
  const {
    courses,
    modules,
    moduleProgresses,
    setActiveCourseId,
    setActiveModuleId,
    setActiveView,
    courseFinalExamProgress,
  } = useLMS();

  // Active Tab: 'studying' (Kelas yang Dipelajari) | 'completed' (Kelas yang Diselesaikan)
  const [activeTab, setActiveTab] = useState<'studying' | 'completed'>('studying');

  // Collapsible curriculum accordion state per course (Default: all closed/collapsed)
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  const toggleCourseExpanded = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Filter studying vs completed courses
  const studyingCourses = courses.filter(
    (course) => !courseFinalExamProgress[course.id]?.passed
  );

  const completedCourses = courses.filter(
    (course) => courseFinalExamProgress[course.id]?.passed
  );

  // Step translation
  const stepLabels: Record<string, string> = {
    attendance: 'Presensi Kehadiran',
    pretest: 'Entry Test (Pre-Test)',
    material: 'Materi Pembelajaran',
    posttest: 'Post-Test Evaluasi',
  };

  const handleStartOrContinue = (courseId: string, moduleId: number) => {
    setActiveCourseId(courseId);
    setActiveModuleId(moduleId);
    setActiveView('workspace');
  };

  const handleReviewModule = (courseId: string, moduleId: number) => {
    setActiveCourseId(courseId);
    setActiveModuleId(moduleId);
    setActiveView('workspace');
  };

  const handleOpenCertificate = (courseId: string) => {
    setActiveCourseId(courseId);
    setActiveView('certificate');
  };

  const handleGoToFinalExam = (courseId: string) => {
    setActiveCourseId(courseId);
    setActiveView('final-exam');
  };

  // Reusable integrated Final Exam Capstone Row for a given course
  const renderFinalExamItem = (course: CourseData) => {
    const examData = course.finalExam;
    const examProg = courseFinalExamProgress[course.id];
    const isExamPassed = examProg?.passed;
    
    // Check if all modules of this course are COMPLETED
    const isCourseModulesComplete = course.moduleIds.every(
      (mId) => moduleProgresses[mId]?.status === 'COMPLETED'
    );
    const completedCourseModulesCount = course.moduleIds.filter(
      (mId) => moduleProgresses[mId]?.status === 'COMPLETED'
    ).length;

    // 1. Locked State: Not all course modules completed yet
    if (!isCourseModulesComplete) {
      return (
        <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-85">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0">
              <div
                className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center"
                title="Ujian Akhir Terkunci"
              >
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600">
                  Tahap Akhir
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-500">
                  Evaluasi Kelulusan Kelas
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600">
                  Terkunci
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-800 leading-snug">
                {examData.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                {examData.description}
              </p>

              <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{examData.durationMinutes} Menit · {examData.questions.length} Soal · KKM {examData.passingScore}</span>
                </span>
                <span className="text-slate-500 italic">
                  Prasyarat: Selesaikan {course.moduleIds.length} modul pembelajaran ({completedCourseModulesCount}/{course.moduleIds.length} tuntas)
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
            <button
              type="button"
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Terkunci</span>
            </button>
          </div>
        </div>
      );
    }

    // 2. Passed State
    if (isExamPassed) {
      return (
        <div className="p-4 rounded-xl border border-emerald-300/90 bg-emerald-50/30 hover:bg-emerald-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0">
              <div
                className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs"
                title="Lulus Ujian Akhir Komprehensif"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">
                  Tahap Akhir
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-600">
                  Evaluasi Kelulusan Kelas
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Lulus Evaluasi Akhir
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {examData.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                Seluruh materi kompetensi kelas {course.title} terverifikasi tuntas dengan predikat memuaskan.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-mono">
                  Nilai Akhir: {examProg?.score || 90} / 100
                </span>
                <span className="text-slate-500">
                  KKM {examData.passingScore} · Sertifikat Kompetensi Resmi Telah Diterbitkan
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 sm:self-center pl-9 sm:pl-0 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenCertificate(course.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Buka Sertifikat</span>
            </button>
            <button
              type="button"
              onClick={() => handleGoToFinalExam(course.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Review Ujian</span>
            </button>
          </div>
        </div>
      );
    }

    // 3. Active & Ready to Take (All course modules completed, final exam pending)
    return (
      <div className="p-4 rounded-xl border border-blue-400/80 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 shadow-xs ring-1 ring-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 shrink-0">
            <div
              className="w-6 h-6 rounded-full bg-blue-950 text-white flex items-center justify-center shadow-2xs"
              title="Ujian Akhir Siap Dikerjakan"
            >
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-950">
                Tahap Akhir
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-blue-900">
                Evaluasi Kelulusan Kelas
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-950">
                ⚡ Siap Dikerjakan
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {examData.title}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
              {examData.description}
            </p>

            <div className="flex items-center gap-4 pt-1 text-[11px] text-blue-900">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-blue-800" />
                <span>{examData.durationMinutes} Menit · {examData.questions.length} Butir Soal · KKM {examData.passingScore}</span>
              </span>
              <span className="text-emerald-700 font-medium">
                Semua {course.moduleIds.length} modul tuntas: Akses Ujian Terbuka
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
          <button
            type="button"
            onClick={() => handleGoToFinalExam(course.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Mulai Ujian Akhir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Progres Belajar
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Pantau seluruh kelas yang sedang Anda pelajari, kelas yang telah diselesaikan, serta riwayat evaluasi akhir Satu Data Indonesia.
        </p>
      </div>

      {/* 2. Full-Width Segmented Control / Split-Button (50% : 50%) */}
      <div className="w-full p-1.5 bg-slate-100 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('studying')}
          className={`w-full flex items-center justify-center gap-2 sm:gap-2.5 py-3 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
            activeTab === 'studying'
              ? 'bg-white text-blue-950 font-bold shadow-xs border border-slate-200/90 ring-1 ring-slate-900/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
          }`}
        >
          <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'studying' ? 'text-blue-900' : 'text-slate-400'}`} />
          <span className="truncate">Kelas yang Dipelajari</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
              activeTab === 'studying'
                ? 'bg-blue-100 text-blue-950'
                : 'bg-slate-200/80 text-slate-600'
            }`}
          >
            {studyingCourses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`w-full flex items-center justify-center gap-2 sm:gap-2.5 py-3 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
            activeTab === 'completed'
              ? 'bg-white text-emerald-950 font-bold shadow-xs border border-slate-200/90 ring-1 ring-emerald-900/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${activeTab === 'completed' ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span className="truncate">Kelas yang Diselesaikan</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
              activeTab === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200/80 text-slate-600'
            }`}
          >
            {completedCourses.length}
          </span>
        </button>
      </div>

      {/* 3. Tab Content */}
      {/* CASE A: TAB KELAS YANG DIPELAJARI */}
      {activeTab === 'studying' && (
        <>
          {studyingCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Seluruh Kelas Telah Selesai
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Selamat! Anda telah menyelesaikan seluruh kurikulum pembelajaran dan lulus Ujian Akhir pada seluruh kelas yang terdaftar.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('completed')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-950 text-white text-xs font-semibold hover:bg-blue-900 shadow-xs transition-colors"
                >
                  <span>Buka Kelas yang Diselesaikan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {studyingCourses.map((course) => {
                const isExpanded = !!expandedCourses[course.id];
                const courseModules = modules.filter(m => course.moduleIds.includes(m.id));

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                  >
                    {/* Card Header: Course Title & Toggle */}
                    <div className={`p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/50 ${isExpanded ? 'border-b border-slate-100' : ''}`}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {course.title}
                          </h2>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 shrink-0">
                            {course.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {course.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleCourseExpanded(course.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer select-none active:scale-[0.98]"
                        >
                          <span className="hidden sm:inline">
                            {isExpanded ? 'Tutup Rincian' : 'Rincian Kelas'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Curriculum Content */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 animate-fadeIn">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                          Silabus & Tahapan Evaluasi Kelas
                        </div>

                        <div className="space-y-3">
                          {courseModules.map((mod) => {
                            const prog = moduleProgresses[mod.id];
                            const isCompleted = prog?.status === 'COMPLETED';
                            const isActive = prog?.status === 'ACTIVE';
                            const isLocked = prog?.status === 'LOCKED';
                            const currentStep = prog?.currentStep || 'attendance';

                            return (
                              <div
                                key={mod.id}
                                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                  isCompleted
                                    ? 'border-emerald-200/80 bg-emerald-50/20'
                                    : isActive
                                    ? 'border-blue-300 bg-blue-50/20 shadow-xs ring-1 ring-blue-100'
                                    : 'border-slate-200 bg-slate-50/60 opacity-80'
                                }`}
                              >
                                {/* Sisi Kiri: Indikator Lingkaran & Metadata */}
                                <div className="flex items-start gap-3.5">
                                  <div className="mt-0.5 shrink-0">
                                    {isCompleted ? (
                                      <div
                                        className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs"
                                        title="Modul Selesai & Lulus"
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                      </div>
                                    ) : isActive ? (
                                      <div
                                        className="w-6 h-6 rounded-full border-2 border-blue-900 bg-white flex items-center justify-center text-blue-900 shadow-2xs"
                                        title="Modul Sedang Aktif"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-blue-900" />
                                      </div>
                                    ) : (
                                      <div
                                        className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center"
                                        title="Modul Terkunci"
                                      >
                                        <Lock className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-slate-900">
                                        Modul {mod.number}
                                      </span>
                                      <span className="text-slate-300">·</span>
                                      <span className="text-xs font-medium text-slate-600">
                                        {mod.code}
                                      </span>
                                      {isCompleted ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                          Lulus Evaluasi
                                        </span>
                                      ) : isActive ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-950">
                                          Sedang Berjalan
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600">
                                          Terkunci
                                        </span>
                                      )}
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                      {mod.title}
                                    </h3>

                                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                                      {mod.subtitle}
                                    </p>

                                    {/* Status Alur Belajar */}
                                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>{mod.estimatedDuration}</span>
                                      </span>

                                      {isCompleted && (
                                        <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                                          Nilai Post-Test: {prog.postTestScore ?? 100} / 100
                                        </span>
                                      )}

                                      {isActive && (
                                        <span className="text-blue-900 font-medium">
                                          Tahap aktif: {stepLabels[currentStep] || 'Presensi'}
                                        </span>
                                      )}

                                      {isLocked && (
                                        <span className="text-slate-500 italic">
                                          Prasyarat: Lulus Post-Test Modul {mod.number - 1}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Sisi Kanan: Action Button */}
                                <div className="shrink-0 sm:self-center pl-9 sm:pl-0 flex items-center gap-2">
                                  {isCompleted ? (
                                    <button
                                      type="button"
                                      onClick={() => handleReviewModule(course.id, mod.id)}
                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Review Modul</span>
                                    </button>
                                  ) : isActive ? (
                                    <button
                                      type="button"
                                      onClick={() => handleStartOrContinue(course.id, mod.id)}
                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors"
                                    >
                                      <span>Lanjutkan Belajar</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Terkunci</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Integrated Ujian Akhir Capstone Row */}
                          {renderFinalExamItem(course)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CASE B: TAB KELAS YANG DISELESAIKAN */}
      {activeTab === 'completed' && (
        <>
          {completedCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Belum Ada Kelas yang Diselesaikan
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Selesaikan seluruh materi pembelajaran dan lulus Ujian Akhir pada kelas yang sedang dipelajari untuk menerbitkan sertifikat kompetensi resmi.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('studying')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-950 text-white text-xs font-semibold hover:bg-blue-900 shadow-xs transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka Kelas yang Sedang Dipelajari</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {completedCourses.map((course) => {
                const isExpanded = !!expandedCourses[course.id];
                const courseModules = modules.filter(m => course.moduleIds.includes(m.id));

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-emerald-200/90 overflow-hidden shadow-2xs transition-all"
                  >
                    {/* Card Header: Program Title with Completed Badge */}
                    <div className={`p-4 sm:p-5 flex items-center justify-between gap-4 bg-emerald-50/40 ${isExpanded ? 'border-b border-emerald-100' : ''}`}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {course.title}
                          </h2>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                            Kelas Selesai · Lulus Ujian Akhir
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 truncate">
                          {course.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenCertificate(course.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition-colors active:scale-[0.98]"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Lihat Sertifikat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCourseExpanded(course.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer select-none active:scale-[0.98]"
                        >
                          <span className="hidden sm:inline">
                            {isExpanded ? 'Tutup Rincian' : 'Rincian Kelas'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Curriculum Content */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 animate-fadeIn">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                          Riwayat Silabus & Nilai Evaluasi Kelas
                        </div>

                        <div className="space-y-3">
                          {courseModules.map((mod) => {
                            const prog = moduleProgresses[mod.id];
                            const score = prog?.postTestScore ?? 100;
                            const dateCompleted = prog?.attendanceTimestamp || 'Terverifikasi';

                            return (
                              <div
                                key={mod.id}
                                className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 hover:bg-emerald-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-start gap-3.5">
                                  <div className="mt-0.5 shrink-0">
                                    <div
                                      className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs"
                                      title="Modul Selesai & Lulus"
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-slate-900">
                                        Modul {mod.number}
                                      </span>
                                      <span className="text-slate-300">·</span>
                                      <span className="text-xs font-medium text-slate-600">
                                        {mod.code}
                                      </span>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                        Lulus Evaluasi
                                      </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                      {mod.title}
                                    </h3>

                                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                                      {mod.subtitle}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px]">
                                      <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                                        Nilai Post-Test: {score} / 100
                                      </span>

                                      {prog?.preTestScore !== undefined && (
                                        <span className="text-slate-600 flex items-center gap-1 font-mono text-[10px]">
                                          <TrendingUp className="w-3 h-3 text-blue-800" />
                                          <span>Entry Test {prog.preTestScore} → Post-Test {score}</span>
                                        </span>
                                      )}

                                      <span className="text-slate-500">
                                        Waktu: {dateCompleted}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 sm:self-center pl-9 sm:pl-0 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleReviewModule(course.id, mod.id)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Review Modul</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {/* Integrated Final Exam Item in Completed Tab */}
                          {renderFinalExamItem(course)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
};
