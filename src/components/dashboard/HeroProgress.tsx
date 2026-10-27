import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { ArrowRight, CheckCircle2, Award, Clock } from 'lucide-react';

export const HeroProgress: React.FC = () => {
  const {
    userProfile,
    courses,
    activeCourseId,
    setActiveCourseId,
    modules,
    moduleProgresses,
    setActiveModuleId,
    setActiveView,
    courseFinalExamProgress,
  } = useLMS();

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const courseModules = modules.filter((m) => activeCourse.moduleIds.includes(m.id));
  const activeModule = courseModules.find((m) => moduleProgresses[m.id]?.status === 'ACTIVE') || courseModules[0];
  const completedInCourse = courseModules.filter((m) => moduleProgresses[m.id]?.status === 'COMPLETED').length;
  const isCourseComplete = completedInCourse === courseModules.length;
  const isCourseExamPassed = courseFinalExamProgress[activeCourse.id]?.passed;
  const coursePercent = Math.round((completedInCourse / activeCourse.moduleIds.length) * 100);

  const handleResumeActiveCourse = () => {
    setActiveCourseId(activeCourse.id);
    if (!isCourseComplete) {
      setActiveModuleId(activeModule.id);
      setActiveView('workspace');
    } else if (!isCourseExamPassed) {
      setActiveView('final-exam');
    } else {
      setActiveView('certificate');
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Information */}
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Penyelenggara Satu Data Indonesia · {userProfile.agency}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            Selamat Datang Kembali, {userProfile.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            Tingkatkan kapasitas tata kelola Satu Data Indonesia. Saat ini Anda terdaftar pada <strong className="text-slate-900">{courses.length} kelas</strong> standar kompetensi daerah. Pantau capaian kurikulum dan lanjutkan materi pembelajaran Anda.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResumeActiveCourse}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              {!isCourseComplete ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-blue-300" />
                  <span>
                    Lanjutkan: {activeCourse.title} (Modul {activeModule.number})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : !isCourseExamPassed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>Mulai Ujian Akhir: {activeCourse.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buka Sertifikat: {activeCourse.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('progress')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              <span>Rincian Progres Belajar</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Status Summary Panel: Focus on Active Class */}
        <div className="shrink-0 lg:w-80 bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Fokus Kelas Terpilih
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              {coursePercent}%
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {activeCourse.title}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {activeCourse.subtitle}
            </p>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCourseExamPassed ? 'bg-emerald-600' : 'bg-blue-950'
              }`}
              style={{ width: `${coursePercent}%` }}
            />
          </div>

          <div className="pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between items-center">
              <span>Modul tuntas</span>
              <span className="font-semibold text-slate-800 font-mono">
                {completedInCourse} dari {activeCourse.moduleIds.length} Modul
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status evaluasi</span>
              <span className="font-semibold text-slate-800">
                {isCourseExamPassed
                  ? 'Lulus & Bersertifikat'
                  : isCourseComplete
                  ? 'Siap Ujian Akhir'
                  : `Modul ${activeModule.number} Aktif`}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
