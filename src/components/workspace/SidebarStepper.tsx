import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { StepType } from '../../types/lms';
import {
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Award
} from 'lucide-react';

export const SidebarStepper: React.FC = () => {
  const {
    activeModuleId,
    moduleProgresses,
    goToStep,
    modules,
    setActiveView,
    finalExamProgress,
    completedModulesCount,
    overallProgressPercent,
  } = useLMS();

  // Accordion state: map of moduleId to boolean expanded
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
  });

  // Automatically expand active module when it changes
  useEffect(() => {
    setExpandedModules(prev => ({
      ...prev,
      [activeModuleId]: true,
    }));
  }, [activeModuleId]);

  const toggleModule = (modId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const isFinalExamAvailable = completedModulesCount === modules.length;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-fit lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div>
        
        {/* Sidebar Header with Overall Progress */}
        <div className="pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Kurikulum Modul
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {overallProgressPercent}% Selesai
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 border border-slate-200">
            <div
              className="h-full bg-blue-900 rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-1.5">
            {completedModulesCount} dari {modules.length} modul telah tuntas
          </p>
        </div>

        {/* Modules Accordion Tree List */}
        <div className="space-y-2">
          {modules.map((mod) => {
            const modProg = moduleProgresses[mod.id];
            const isModLocked = modProg?.status === 'LOCKED';
            const isModDone = modProg?.status === 'COMPLETED';
            const isModActive = modProg?.status === 'ACTIVE';
            const isCurrentModule = mod.id === activeModuleId;
            const isExpanded = Boolean(expandedModules[mod.id]);

            // Sub-step statuses for this module
            const attendanceDone = Boolean(modProg?.attendanceChecked);
            const preTestDone = Boolean(modProg?.preTestSubmitted);
            const materialDone = Boolean(modProg?.materialCompleted);
            const postTestPassed = Boolean(modProg?.postTestPassed);

            const activeStep = modProg?.currentStep || 'attendance';

            const handleSubStepClick = (step: StepType, locked: boolean) => {
              if (isModLocked || locked) return;
              goToStep(mod.id, step);
            };

            return (
              <div
                key={mod.id}
                className={`rounded-lg border transition-colors ${
                  isCurrentModule
                    ? 'border-blue-900/30 bg-slate-50/50'
                    : isModLocked
                    ? 'border-slate-200 bg-slate-50/40 opacity-70'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Module Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full text-left p-2.5 flex items-start justify-between gap-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold ${
                        isModLocked
                          ? 'bg-slate-200 text-slate-500'
                          : isModDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-900 text-white'
                      }`}
                    >
                      {isModLocked ? (
                        <Lock className="w-3 h-3 text-slate-400" />
                      ) : isModDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        `0${mod.number}`
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-900 truncate">
                          Modul {mod.number}
                        </span>
                        {isModDone ? (
                          <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Lulus
                          </span>
                        ) : isModActive ? (
                          <span className="text-[9px] font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded">
                            Aktif
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400">
                            Terkunci
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {mod.title}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400 mt-1">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Sub-steps List (When Expanded) */}
                {isExpanded && (
                  <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-slate-100">
                    
                    {/* Locked hint if module is locked */}
                    {isModLocked && (
                      <div className="p-2 text-[11px] text-slate-500 bg-slate-100/60 rounded">
                        Prasyarat: Lulus Post-Test Modul {mod.number - 1} terlebih dahulu.
                      </div>
                    )}

                    {!isModLocked && (
                      <>
                        {/* 1. Presensi Kehadiran */}
                        <button
                          type="button"
                          onClick={() => handleSubStepClick('attendance', false)}
                          className={`w-full text-left pl-7 pr-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between gap-1.5 relative ${
                            isCurrentModule && activeStep === 'attendance'
                              ? 'bg-blue-900 text-white font-medium'
                              : 'text-slate-700 hover:bg-slate-100/80'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              attendanceDone ? 'bg-emerald-500' : 'bg-slate-300'
                            }`} />
                            <span className="truncate">Presensi Kehadiran</span>
                          </div>

                          <div className="shrink-0 text-[10px]">
                            {attendanceDone ? (
                              <span className={isCurrentModule && activeStep === 'attendance' ? 'text-blue-200' : 'text-emerald-700'}>
                                Tercatat
                              </span>
                            ) : (
                              <span className={isCurrentModule && activeStep === 'attendance' ? 'text-blue-200' : 'text-slate-400'}>
                                Wajib
                              </span>
                            )}
                          </div>
                        </button>

                        {/* 2. Entry Test (Pre-Test) */}
                        {(() => {
                          const isPreTestLocked = !attendanceDone;
                          return (
                            <button
                              type="button"
                              disabled={isPreTestLocked}
                              onClick={() => handleSubStepClick('pretest', isPreTestLocked)}
                              className={`w-full text-left pl-7 pr-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between gap-1.5 relative ${
                                isPreTestLocked
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : isCurrentModule && activeStep === 'pretest'
                                  ? 'bg-blue-900 text-white font-medium'
                                  : 'text-slate-700 hover:bg-slate-100/80'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  preTestDone ? 'bg-emerald-500' : isPreTestLocked ? 'bg-slate-200' : 'bg-blue-500'
                                }`} />
                                <span className="truncate">Entry Test (Pre-Test)</span>
                              </div>

                              <div className="shrink-0 text-[10px] font-mono">
                                {isPreTestLocked ? (
                                  <Lock className="w-3 h-3 text-slate-300" />
                                ) : preTestDone ? (
                                  <span className={isCurrentModule && activeStep === 'pretest' ? 'text-blue-200' : 'text-emerald-700'}>
                                    Skor {modProg?.preTestScore}
                                  </span>
                                ) : (
                                  <span className={isCurrentModule && activeStep === 'pretest' ? 'text-blue-200' : 'text-slate-400'}>
                                    1x Tes
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })()}

                        {/* 3. Materi Pembelajaran */}
                        {(() => {
                          const isMaterialLocked = !preTestDone;
                          return (
                            <button
                              type="button"
                              disabled={isMaterialLocked}
                              onClick={() => handleSubStepClick('material', isMaterialLocked)}
                              className={`w-full text-left pl-7 pr-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between gap-1.5 relative ${
                                isMaterialLocked
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : isCurrentModule && activeStep === 'material'
                                  ? 'bg-blue-900 text-white font-medium'
                                  : 'text-slate-700 hover:bg-slate-100/80'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  materialDone ? 'bg-emerald-500' : isMaterialLocked ? 'bg-slate-200' : 'bg-blue-500'
                                }`} />
                                <span className="truncate">Materi Pembelajaran</span>
                              </div>

                              <div className="shrink-0 text-[10px]">
                                {isMaterialLocked ? (
                                  <Lock className="w-3 h-3 text-slate-300" />
                                ) : materialDone ? (
                                  <span className={isCurrentModule && activeStep === 'material' ? 'text-blue-200' : 'text-emerald-700'}>
                                    Selesai
                                  </span>
                                ) : (
                                  <span className={isCurrentModule && activeStep === 'material' ? 'text-blue-200' : 'text-slate-400'}>
                                    Video & PDF
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })()}

                        {/* 4. Post-Test Evaluasi */}
                        {(() => {
                          const isPostTestLocked = !materialDone;
                          return (
                            <button
                              type="button"
                              disabled={isPostTestLocked}
                              onClick={() => handleSubStepClick('posttest', isPostTestLocked)}
                              className={`w-full text-left pl-7 pr-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between gap-1.5 relative ${
                                isPostTestLocked
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : isCurrentModule && activeStep === 'posttest'
                                  ? 'bg-blue-900 text-white font-medium'
                                  : 'text-slate-700 hover:bg-slate-100/80'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  postTestPassed ? 'bg-emerald-500' : isPostTestLocked ? 'bg-slate-200' : 'bg-amber-500'
                                }`} />
                                <span className="truncate">Post-Test Evaluasi</span>
                              </div>

                              <div className="shrink-0 text-[10px] font-mono">
                                {isPostTestLocked ? (
                                  <Lock className="w-3 h-3 text-slate-300" />
                                ) : postTestPassed ? (
                                  <span className={isCurrentModule && activeStep === 'posttest' ? 'text-blue-200' : 'text-emerald-700'}>
                                    Lulus ({modProg?.postTestScore})
                                  </span>
                                ) : (
                                  <span className={isCurrentModule && activeStep === 'posttest' ? 'text-blue-200' : 'text-slate-400'}>
                                    KKM {mod.passingScore}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })()}

                      </>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Evaluation Section */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold block px-1">
            Evaluasi Akhir
          </span>

          {/* Final Exam Nav Item */}
          <button
            type="button"
            disabled={!isFinalExamAvailable}
            onClick={() => isFinalExamAvailable && setActiveView('final-exam')}
            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
              !isFinalExamAvailable
                ? 'border-slate-200 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-70'
                : finalExamProgress.passed
                ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900 font-medium'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate font-semibold">Ujian Akhir</span>
            </div>
            <div className="shrink-0 text-[10px]">
              {!isFinalExamAvailable ? (
                <Lock className="w-3 h-3 text-slate-400" />
              ) : finalExamProgress.passed ? (
                <span className="text-emerald-700 font-mono font-bold">Lulus ({finalExamProgress.score})</span>
              ) : (
                <span className="text-blue-900 font-semibold">Siap</span>
              )}
            </div>
          </button>

          {/* Certificate Nav Item */}
          {finalExamProgress.passed && (
            <button
              type="button"
              onClick={() => setActiveView('certificate')}
              className="w-full text-left p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Sertifikat Kelulusan</span>
              </div>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded shrink-0">
                Terbit
              </span>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
