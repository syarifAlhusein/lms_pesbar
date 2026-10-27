import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { StepType } from '../../types/lms';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Lock,
  GraduationCap,
  ArrowRight,
  Sun,
  Monitor,
  Moon,
  HelpCircle
} from 'lucide-react';

export const ClassroomSidebar: React.FC = () => {
  const {
    activeModuleId,
    setActiveModuleId,
    setActiveView,
    goToStep,
    modules,
    courses,
    moduleProgresses,
    isSidebarOpen,
    toggleSidebar,
  } = useLMS();

  const currentCourse = courses.find((c) => c.moduleIds.includes(activeModuleId)) || courses[0];
  const courseModules = modules.filter((m) => currentCourse.moduleIds.includes(m.id));
  const activeModuleIndexInCourse = courseModules.findIndex((m) => m.id === activeModuleId);
  const nextModule = activeModuleIndexInCourse >= 0 && activeModuleIndexInCourse < courseModules.length - 1 ? courseModules[activeModuleIndexInCourse + 1] : null;
  const isLastModule = activeModuleIndexInCourse === courseModules.length - 1;

  const progress = moduleProgresses[activeModuleId];
  const currentStep = progress?.currentStep || 'attendance';

  const attendanceDone = Boolean(progress?.attendanceChecked);
  const preTestDone = Boolean(progress?.preTestSubmitted);
  const materialDone = Boolean(progress?.materialCompleted);
  const postTestPassed = Boolean(progress?.postTestPassed);

  const handleStepClick = (step: StepType, locked: boolean) => {
    if (locked) return;
    goToStep(activeModuleId, step);
  };

  const handleNextModule = () => {
    if (nextModule) {
      setActiveModuleId(nextModule.id);
      goToStep(nextModule.id, 'attendance');
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Unified Smoothly Morphing Classroom Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none transition-[width] duration-300 ease-in-out overflow-hidden shadow-lg lg:shadow-none ${
          isSidebarOpen ? 'w-72' : 'w-16'
        }`}
      >
        <div className="w-full flex flex-col">
          
          {/* 1. Header Classroom: Smooth Morph between 288px and 64px */}
          <div className="p-3 border-b border-slate-200/80 bg-slate-50/80 shrink-0 overflow-hidden flex items-center min-h-[57px]">
            {isSidebarOpen ? (
              <div className="w-full flex items-center justify-between gap-2 transition-all duration-300">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-800 tracking-wider uppercase select-none">
                    Silabus Modul
                  </span>
                </div>

                {/* Minimize Button (←) */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors active:scale-95 shrink-0"
                  title="Perkecil Menu Sidebar (Rail Mode)"
                  aria-label="Minimize Classroom Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center py-0.5 transition-all duration-300">
                {/* Expand Button (→) */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-9 h-9 rounded-full bg-slate-900 hover:bg-blue-950 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
                  title="Perluas Menu Sidebar"
                  aria-label="Expand Sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Daftar 4 Tahapan Belajar */}
          <div className="p-3 space-y-1.5">
            {isSidebarOpen && (
              <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap transition-opacity duration-200">
                Tahapan Pembelajaran
              </div>
            )}

            {/* Tahap 1: Presensi Kehadiran */}
            <button
              type="button"
              onClick={() => handleStepClick('attendance', false)}
              className={`w-full flex items-center rounded-xl transition-all relative group active:scale-[0.98] ${
                isSidebarOpen
                  ? 'p-2.5 gap-3 text-xs'
                  : 'w-10 h-10 mx-auto justify-center'
              } ${
                currentStep === 'attendance'
                  ? 'bg-blue-950 text-white font-semibold shadow-xs ring-1 ring-blue-950'
                  : attendanceDone
                  ? 'text-slate-700 hover:bg-emerald-50/50 border border-slate-100'
                  : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
              }`}
              title={!isSidebarOpen ? `1. Presensi Kehadiran ${attendanceDone ? '(Selesai)' : ''}` : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {attendanceDone ? (
                    <CheckCircle2 className={`w-4.5 h-4.5 ${currentStep === 'attendance' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  ) : currentStep === 'attendance' ? (
                    <PlayCircle className="w-4.5 h-4.5 text-blue-300" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-slate-400" />
                  )}
                </div>

                <div
                  className={`min-w-0 text-left transition-all duration-200 ${
                    isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 w-0 pointer-events-none'
                  }`}
                >
                  <div className="truncate font-semibold whitespace-nowrap">1. Presensi Kehadiran</div>
                  <div className={`text-[10px] truncate whitespace-nowrap ${
                    currentStep === 'attendance'
                      ? 'text-blue-200 font-medium'
                      : attendanceDone
                      ? 'text-emerald-600 font-medium'
                      : 'text-slate-400'
                  }`}>
                    Tahap 1
                  </div>
                </div>
              </div>

              {/* Tooltip on Rail Mode */}
              {!isSidebarOpen && (
                <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  1. Presensi Kehadiran {attendanceDone ? '(Selesai)' : ''}
                </span>
              )}
            </button>

            {/* Tahap 2: Entry Test (Pre-Test) */}
            {(() => {
              const isPreTestLocked = !attendanceDone;
              return (
                <button
                  type="button"
                  disabled={isPreTestLocked}
                  onClick={() => handleStepClick('pretest', isPreTestLocked)}
                  className={`w-full flex items-center rounded-xl transition-all relative group active:scale-[0.98] ${
                    isSidebarOpen
                      ? 'p-2.5 gap-3 text-xs'
                      : 'w-10 h-10 mx-auto justify-center'
                  } ${
                    isPreTestLocked
                      ? 'text-slate-300 cursor-not-allowed border border-dashed border-slate-200 bg-slate-50/50 opacity-60'
                      : currentStep === 'pretest'
                      ? 'bg-blue-950 text-white font-semibold shadow-xs ring-1 ring-blue-950'
                      : preTestDone
                      ? 'text-slate-700 hover:bg-emerald-50/50 border border-slate-100'
                      : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                  }`}
                  title={!isSidebarOpen ? `2. Entry Test ${isPreTestLocked ? '(Terkunci)' : preTestDone ? '(Selesai)' : ''}` : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isPreTestLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-300" />
                      ) : preTestDone ? (
                        <CheckCircle2 className={`w-4.5 h-4.5 ${currentStep === 'pretest' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      ) : currentStep === 'pretest' ? (
                        <PlayCircle className="w-4.5 h-4.5 text-blue-300" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-slate-400" />
                      )}
                    </div>

                    <div
                      className={`min-w-0 text-left transition-all duration-200 ${
                        isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 w-0 pointer-events-none'
                      }`}
                    >
                      <div className="truncate font-semibold whitespace-nowrap">2. Entry Test</div>
                      <div className={`text-[10px] truncate whitespace-nowrap ${
                        isPreTestLocked
                          ? 'text-slate-400'
                          : currentStep === 'pretest'
                          ? 'text-blue-200 font-medium'
                          : preTestDone
                          ? 'text-emerald-600 font-medium'
                          : 'text-slate-400'
                      }`}>
                        Tahap 2
                      </div>
                    </div>
                  </div>

                  {!isSidebarOpen && (
                    <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      2. Entry Test {isPreTestLocked ? '(Terkunci)' : preTestDone ? '(Selesai)' : ''}
                    </span>
                  )}
                </button>
              );
            })()}

            {/* Tahap 3: Materi Pembelajaran */}
            {(() => {
              const isMaterialLocked = !preTestDone;
              return (
                <button
                  type="button"
                  disabled={isMaterialLocked}
                  onClick={() => handleStepClick('material', isMaterialLocked)}
                  className={`w-full flex items-center rounded-xl transition-all relative group active:scale-[0.98] ${
                    isSidebarOpen
                      ? 'p-2.5 gap-3 text-xs'
                      : 'w-10 h-10 mx-auto justify-center'
                  } ${
                    isMaterialLocked
                      ? 'text-slate-300 cursor-not-allowed border border-dashed border-slate-200 bg-slate-50/50 opacity-60'
                      : currentStep === 'material'
                      ? 'bg-blue-950 text-white font-semibold shadow-xs ring-1 ring-blue-950'
                      : materialDone
                      ? 'text-slate-700 hover:bg-emerald-50/50 border border-slate-100'
                      : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                  }`}
                  title={!isSidebarOpen ? `3. Materi Pembelajaran ${isMaterialLocked ? '(Terkunci)' : materialDone ? '(Selesai)' : ''}` : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isMaterialLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-300" />
                      ) : materialDone ? (
                        <CheckCircle2 className={`w-4.5 h-4.5 ${currentStep === 'material' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      ) : currentStep === 'material' ? (
                        <PlayCircle className="w-4.5 h-4.5 text-blue-300" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-slate-400" />
                      )}
                    </div>

                    <div
                      className={`min-w-0 text-left transition-all duration-200 ${
                        isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 w-0 pointer-events-none'
                      }`}
                    >
                      <div className="truncate font-semibold whitespace-nowrap">3. Materi Pembelajaran</div>
                      <div className={`text-[10px] truncate whitespace-nowrap ${
                        isMaterialLocked
                          ? 'text-slate-400'
                          : currentStep === 'material'
                          ? 'text-blue-200 font-medium'
                          : materialDone
                          ? 'text-emerald-600 font-medium'
                          : 'text-slate-400'
                      }`}>
                        Tahap 3
                      </div>
                    </div>
                  </div>

                  {!isSidebarOpen && (
                    <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      3. Materi Pembelajaran {isMaterialLocked ? '(Terkunci)' : materialDone ? '(Selesai)' : ''}
                    </span>
                  )}
                </button>
              );
            })()}

            {/* Tahap 4: Post-Test Evaluasi */}
            {(() => {
              const isPostTestLocked = !materialDone;
              return (
                <button
                  type="button"
                  disabled={isPostTestLocked}
                  onClick={() => handleStepClick('posttest', isPostTestLocked)}
                  className={`w-full flex items-center rounded-xl transition-all relative group active:scale-[0.98] ${
                    isSidebarOpen
                      ? 'p-2.5 gap-3 text-xs'
                      : 'w-10 h-10 mx-auto justify-center'
                  } ${
                    isPostTestLocked
                      ? 'text-slate-300 cursor-not-allowed border border-dashed border-slate-200 bg-slate-50/50 opacity-60'
                      : currentStep === 'posttest'
                      ? 'bg-blue-950 text-white font-semibold shadow-xs ring-1 ring-blue-950'
                      : postTestPassed
                      ? 'text-slate-700 hover:bg-emerald-50/50 border border-slate-100'
                      : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                  }`}
                  title={!isSidebarOpen ? `4. Post-Test ${isPostTestLocked ? '(Terkunci)' : postTestPassed ? '(Selesai)' : ''}` : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isPostTestLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-300" />
                      ) : postTestPassed ? (
                        <CheckCircle2 className={`w-4.5 h-4.5 ${currentStep === 'posttest' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      ) : currentStep === 'posttest' ? (
                        <PlayCircle className="w-4.5 h-4.5 text-blue-300" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-slate-400" />
                      )}
                    </div>

                    <div
                      className={`min-w-0 text-left transition-all duration-200 ${
                        isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 w-0 pointer-events-none'
                      }`}
                    >
                      <div className="truncate font-semibold whitespace-nowrap">4. Post-Test Evaluasi</div>
                      <div className={`text-[10px] truncate whitespace-nowrap ${
                        isPostTestLocked
                          ? 'text-slate-400'
                          : currentStep === 'posttest'
                          ? 'text-blue-200 font-medium'
                          : postTestPassed
                          ? 'text-emerald-600 font-medium'
                          : 'text-slate-400'
                      }`}>
                        Tahap 4
                      </div>
                    </div>
                  </div>

                  {!isSidebarOpen && (
                    <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      4. Post-Test {isPostTestLocked ? '(Terkunci)' : postTestPassed ? '(Selesai)' : ''}
                    </span>
                  )}
                </button>
              );
            })()}

          </div>

          {/* 3. Action Banner jika Post-Test sudah Lulus */}
          {postTestPassed && (
            <div className="p-3 mx-2 mt-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              {isSidebarOpen ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="whitespace-nowrap">Tahapan Modul Ini Lulus</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {!isLastModule && nextModule
                      ? 'Anda dapat langsung melanjutkan ke modul berikutnya.'
                      : 'Seluruh kurikulum modul tuntas. Anda dapat mengikuti Ujian Akhir.'}
                  </p>

                  {!isLastModule && nextModule ? (
                    <button
                      type="button"
                      onClick={handleNextModule}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors active:scale-[0.98]"
                    >
                      <span>Lanjut Modul Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveView('final-exam')}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors active:scale-[0.98]"
                    >
                      <span>Ikuti Ujian Akhir</span>
                      <GraduationCap className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={!isLastModule && nextModule ? handleNextModule : () => setActiveView('final-exam')}
                    className="w-9 h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
                    title={!isLastModule && nextModule ? 'Lanjut ke Modul Berikutnya' : 'Ikuti Ujian Akhir'}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Sidebar Footer: Theme Pills & Helpdesk */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          {isSidebarOpen ? (
            <div className="transition-opacity duration-200">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="text-[11px] font-medium whitespace-nowrap">Tema Tampilan</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Sistem"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded bg-slate-100 text-slate-800 shadow-2xs"
                    title="Terang"
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Gelap"
                  >
                    <Moon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>BPS · SDI © 2026</span>
                <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                  <HelpCircle className="w-3 h-3" />
                  <span>Bantuan</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                title="Tema Tampilan Terang"
              >
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
