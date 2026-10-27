import React from 'react';
import { useLMS } from '../../context/LMSContext';

export const KPISummary: React.FC = () => {
  const {
    courses,
    modules,
    moduleProgresses,
    averagePostTestScore,
    courseFinalExamProgress,
  } = useLMS();

  const totalCourses = courses.length;
  const completedCoursesCount = courses.filter(
    (c) => courseFinalExamProgress[c.id]?.passed
  ).length;
  const studyingCoursesCount = totalCourses - completedCoursesCount;

  const totalModules = modules.length;
  const completedModulesCount = modules.filter(
    (m) => moduleProgresses[m.id]?.status === 'COMPLETED'
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        
        {/* KPI 1: Kelas yang Sedang Dipelajari */}
        <div className="p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Kelas yang Dipelajari</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {studyingCoursesCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {totalCourses} kelas terdaftar
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">
            Kurikulum kompetensi aktif berjalan
          </p>
        </div>

        {/* KPI 2: Kelas yang Telah Diselesaikan */}
        <div className="p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Kelas yang Diselesaikan</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className={`text-2xl font-bold font-mono tracking-tight ${
              completedCoursesCount > 0 ? 'text-emerald-700' : 'text-slate-900'
            }`}>
              {completedCoursesCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              kelas tuntas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">
            {completedCoursesCount > 0
              ? 'Sertifikat kompetensi resmi terbit'
              : 'Lulus Ujian Akhir untuk sertifikat'}
          </p>
        </div>

        {/* KPI 3: Akumulasi Modul Diselesaikan */}
        <div className="p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Akumulasi Modul Tuntas</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {completedModulesCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {totalModules} modul
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">
            Total modul tuntas lintas seluruh kelas
          </p>
        </div>

        {/* KPI 4: Rata-Rata Skor Evaluasi */}
        <div className="p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Rata-rata Skor Evaluasi</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {averagePostTestScore > 0 ? averagePostTestScore : '—'}
            </span>
            {averagePostTestScore > 0 && (
              <span className="text-[11px] text-slate-500 font-mono">
                (KKM 75–80)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">
            {averagePostTestScore >= 75
              ? 'Memenuhi standar kelulusan nasional'
              : 'Akumulasi skor Post-Test modul tuntas'}
          </p>
        </div>

      </div>
    </div>
  );
};
