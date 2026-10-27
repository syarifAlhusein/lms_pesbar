import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';

export const EnrolledCoursesOverview: React.FC = () => {
  const {
    courses,
    modules,
    moduleProgresses,
    courseFinalExamProgress,
    setActiveCourseId,
    setActiveModuleId,
    setActiveView,
  } = useLMS();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Kelas Terdaftar Saya
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Akses cepat kelas pembelajaran kompetensi Satu Data Indonesia yang sedang Anda ikuti.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('progress')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-950 transition-colors self-start sm:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Buka Progres Belajar Penuh</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {courses.map((course) => {
          const courseModules = modules.filter(m => course.moduleIds.includes(m.id));
          const completedModules = courseModules.filter(
            m => moduleProgresses[m.id]?.status === 'COMPLETED'
          );
          const activeModule = courseModules.find(
            m => moduleProgresses[m.id]?.status === 'ACTIVE'
          ) || courseModules[0];

          const courseProgressPercent = Math.round(
            (completedModules.length / course.moduleIds.length) * 100
          );
          const isAllModulesComplete = completedModules.length === course.moduleIds.length;
          const examProg = courseFinalExamProgress[course.id];
          const isPassed = examProg?.passed;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col justify-between space-y-5"
            >
              {/* Top: Metadata, Badges, Title */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    {course.code} · {course.badge}
                  </span>

                  {isPassed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Lulus & Bersertifikat</span>
                    </span>
                  ) : isAllModulesComplete ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-950">
                      <span>⚡ Siap Ujian Akhir</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      <span>Sedang Berjalan</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>
              </div>

              {/* Middle: Progress Bar & Current Stage */}
              <div className="space-y-3">
                {/* Progress Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Progres Kurikulum
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {courseProgressPercent}% ({completedModules.length}/{course.moduleIds.length} Modul)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPassed ? 'bg-emerald-600' : 'bg-blue-950'
                      }`}
                      style={{ width: `${courseProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Status Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  {isPassed ? (
                    <div className="flex items-center gap-2 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-medium truncate">
                        Nilai Akhir: {examProg?.score || 90}/100 · Sertifikat resmi telah diterbitkan
                      </span>
                    </div>
                  ) : isAllModulesComplete ? (
                    <div className="flex items-center gap-2 text-blue-950">
                      <GraduationCap className="w-4 h-4 text-blue-900 shrink-0" />
                      <span className="font-medium truncate">
                        Semua modul tuntas · Akses Ujian Akhir Komprehensif terbuka
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Tahap aktif: <strong className="text-slate-800">Modul {activeModule.number}</strong> ({activeModule.title})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCourseId(course.id);
                    setActiveView('progress');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                >
                  <span>Lihat Silabus</span>
                </button>

                {isPassed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setActiveView('certificate');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Lihat Sertifikat</span>
                  </button>
                ) : isAllModulesComplete ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setActiveView('final-exam');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <span>Mulai Ujian Akhir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setActiveModuleId(activeModule.id);
                      setActiveView('workspace');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <span>Lanjutkan Modul {activeModule.number}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
